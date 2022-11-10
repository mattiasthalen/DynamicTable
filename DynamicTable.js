define(["qlik", "jquery"],
    function (qlik) {

        // Settings panel
        var settings = {
            type: "items",
            items: [
				// Dimensions
                {
                    label: "Max Dimensions",
                    type: "integer",
                    defaultValue: 50,
                    ref: "maxDimensions"
                },
                {
                    label: "Dimension Name Field",
                    type: "string",
                    ref: "dimensionNameField",
                },
                {
                    label: "Dimension Sort Field",
                    type: "string",
                    ref: "dimensionSortField",
                },
				
				// Measures
                {
                    label: "Max Measures",
                    type: "integer",
                    defaultValue: 50,
                    ref: "maxMeasures"
                },
                {
                    label: "Measure Name Field",
                    type: "string",
                    ref: "measureNameField",
                },
                {
                    label: "Measure Expression Field",
                    type: "string",
                    ref: "measureExpressionField",
                },
                {
                    label: "Measure Sort Field",
                    type: "string",
                    ref: "measureSortField",
                },
				
				// Footer
                {
                    label: "Generate dynamic table",
                    component: "button",
                    action: function (context) { generateTable(qlik, context); }
                },
                {
                    label: "Created by Mattias Thalén",
                    component: "text"
                }
            ]
        };

        // Tabe generator
        function generateTable(qlik, layout) {

            var app = qlik.currApp(this);
            var initialId = layout.qInfo.qId;
			
			/* -------------
			   DIMENSIONS
			------------- */

            // Set and check dimension fields
            var maxDimensions = layout.maxDimensions;

            if (maxDimensions.length == 0 || maxDimensions <= 0) {
                var errorMsg = "Max Dimensions is not valid!";

                alert(errorMsg);
                throw errorMsg;
            }

            var dimensionNameField = layout.dimensionNameField;

            if (dimensionNameField.length == 0) {
                var errorMsg = "Dimension Field is empty!";

                alert(errorMsg);
                throw errorMsg;
            }

            var dimensionSortField = layout.dimensionSortField;

            // Create qlik expression for concatenating and, if applicable, sort it
            var dimensionConcat = "Concat(Distinct " + dimensionNameField + ", Chr(124))";

            if (dimensionSortField.length > 0) {
                var dimensionConcat = "Concat(Distinct " + dimensionNameField + ", Chr(124), " + dimensionSortField + ")";
            }

            // Set initial column, row numbering
            var columns = [{
                qDef: {
                    qLabel: "Row",
                    qDef: "=RowNo(TOTAL)",
                    qAggrFunc: "Max",
                    qNumFormat: {
                        qType: "F",
                        qnDec: 0,
                        qUseThou: 0,
                        qFmt: "# ##0",
                        qDec: ".",
                        qThou: " "
                    },
                    "numFormatFromTemplate": false
                },
                qCalcCondition: { qCond: "=GetSelectedCount(" + dimensionNameField + ") >= 1" }
            }];

            // Generate all dimension columns as specifed by Max Dimensions
            for (let i = 0; i < maxDimensions; i++) {
                var n = i + 1;
                var dimensionBaseFormula = "SubField(" + dimensionConcat + ", Chr(124), " + n + ")";

                var dimensionData = {
                    qDef: {
                        qFieldDefs: ["=$(=Chr(91) & " + dimensionBaseFormula + " & Chr(93))"],
                        qLabelExpression: "=" + dimensionBaseFormula
                    },
                    qCalcCondition: { qCond: "=GetSelectedCount(" + dimensionNameField + ") >= " + n }
                };

                columns.push(dimensionData);
            }
			
			/* -------------
			   MEASURES
			------------- */

            // Set and check measure fields
            var maxMeasures = layout.maxMeasures;

            if (maxMeasures.length == 0 || maxMeasures <= 0) {
                var errorMsg = "Max Measures is not valid!";

                alert(errorMsg);
                throw errorMsg;
            }

            var measureNameField = layout.measureNameField;

            if (measureNameField.length == 0) {
                var errorMsg = "Measure Field is empty!";

                alert(errorMsg);
                throw errorMsg;
            }
			
            var measureExpressionField = layout.measureExpressionField;			

            if (measureExpressionField.length == 0) {
                var errorMsg = "Measure Expression Field is empty!";

                alert(errorMsg);
                throw errorMsg;
            }
			
            var measureSortField = layout.measureSortField;

            // Create qlik expression for concatenating and, if applicable, sort it
            var measureNameConcat = "Concat(Distinct " + measureNameField + ", Chr(124))";
            var measureExpressionConcat = "Concat(Distinct " + measureExpressionField + ", Chr(124))";

            if (measureSortField.length > 0) {
                var measureNameConcat = "Concat(Distinct " + measureNameField + ", Chr(124), " + measureSortField + ")";
                var measureExpressionConcat = "Concat(Distinct " + measureExpressionField + ", Chr(124), " + measureSortField + ")";
            }

            // Generate all measure columns as specifed by Max Measures
            for (let i = 0; i < maxMeasures; i++) {
                var n = i + 1;
                var measureLabelFormula = "=SubField(" + measureNameConcat + ", Chr(124), " + n + ")";
                var measureExpressionFormula = "=$($(=SubField(" + measureExpressionConcat + ", Chr(124), " + n + ")))";

                var measureData = {
					qDef: {
						qLabelExpression: measureLabelFormula,
						qDef: measureExpressionFormula,
						qAggrFunc: "Max",
						qNumFormat: {
							qType: "F",
							qnDec: 0,
							qUseThou: 0,
							qFmt: "# ##0",
							qDec: ".",
							qThou: " "
						},
						"numFormatFromTemplate": false
					},
					qCalcCondition: { qCond: "=GetSelectedCount(" + measureNameField + ") >= " + n }
				};

                columns.push(measureData);
            }
			
			var dimensionShowCondition = "GetSelectedCount(" + dimensionNameField + ") >= 1 And GetSelectedCount(" + dimensionNameField + ") <= " + maxDimensions;
			var measureShowCondition = "GetSelectedCount(" + measureNameField + ") >= 1 And GetSelectedCount(" + measureNameField + ") <= " + maxMeasures;
            var condShowCondition = "=" + dimensionShowCondition + " And " + measureShowCondition;
			
            var dimensionShowMsg = "Please select between 1 and " + maxDimensions + " values in the " + dimensionNameField + " filter.";
            var measureShowMsg = "Please select between 1 and " + maxMeasures + " values in the " + measureNameField + " filter.";
			
            var condShowMsg = "=If(Not(" + dimensionShowCondition + "), '" + dimensionShowMsg + "') & If(Not(" + dimensionShowCondition + " And " + measureShowCondition + "), '\n') & If(Not(" + measureShowCondition + "), '" + measureShowMsg + "')";

            // Generate new qlik object and replace the placeholder
            app.model.enigmaModel.getObject(initialId)
                .then(function (obj) {
                    initialObj = obj;

                    return app.visualization.create(
                        "table",
                        columns,
                        {
                            title: "Dynamic Report",
                            multiline: { wrapTextInCells: true },
                            components: [{
                                key: "theme",
                                content: { hoverEffect: true },
                                scrollbar: { size: "medium" }
                            }],
                            qHyperCubeDef: {
                                qCalcCondition: {
                                    qCond: condShowCondition,
                                    qMsg: condShowMsg
                                }
                            }
                        })
                        .then(function (obj) {
                            finalObj = obj;
                            console.log("finalObj.model.getProperties():", finalObj.model.getProperties());

                            return finalObj.model.getProperties();
                        })
                        .then(function (properties) {
                            properties.qInfo.qId = initialId;

                            return initialObj.setProperties(properties);
                        })
                        .then(function (result) {
                            finalObj.close();

                            var currSheet = qlik.navigation.getCurrentSheetId();
                            return app.model.enigmaModel.getObject(currSheet.sheetId);
                        })
                        .then(function (sheetObj) {
                            sheetObj.properties.cells.forEach(function (cell) {
                                if (cell.name == initialId) cell.type = "table";
                            });

                            return sheetObj.setProperties(sheetObj.properties);
                        })
                        .catch(function (error) {
                            console.error(error);
                        });
                })
        };

        return {
            support: {
                snapshot: false,
                export: false,
                exportData: false
            },
            definition: settings,
            paint: function ($element, layout) {

                $element.html(
                    "<table height='100%'><tr><td style='text-align:center;'>"
                    + "<p>This is a placeholder for a dynamic table.</p>"
                    + "<br>"
                    + "<p>First create a field in the data model that contains all the dimensions & measures you want to be available to the dynamic table.<br>"
                    + "For measures, create a second field in the model that contains the expression for the measure."
                    + "Then select the name of the dimension & measure fields you just created, in the settings panel of this object.</p>"
                    + "<br>"
                    + "<p>You also have the option to supply sorting fields that will be used to sort the columns in the report</p>"
                    + "<br>"
                    + "<p>After configuring the settings this will become a standard Qlik Sense table.</p>"
                    + "<td></tr></table>");

                return qlik.Promise.resolve();
            }
        };
    });