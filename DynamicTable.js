define(["qlik", "jquery"],
    function (qlik) {

        // Settings panel
        var settings = {
            type: "items",
            items: [
                {
                    label: "Max Fields",
                    type: "integer",
                    defaultValue: 50,
                    ref: "maxFields"
                },
                {
                    label: "Dimension Field",
                    type: "string",
                    defaultValue: "Dimension",
                    ref: "dimensionField",
                    /* component: "dropdown",
                    options: [{
                        value: "Dimension",
                        label: "Dimension"
                    }] */
                },
                {
                    label: "Generate dynamic table",
                    component: "button",
                    action: function (context) { generateTable(qlik, context); }
                },
                {
                    label: "by Mattias Thalén",
                    component: "text"
                }
            ]
        };

        // Tabe generator
        function generateTable(qlik, layout) {

            var app = qlik.currApp(this);
            var initialId = layout.qInfo.qId;
            var maxFields = layout.maxFields;
            var dimensionField = layout.dimensionField;
            var condShowCondition = "=GetSelectedCount([" + dimensionField + "]) >= 1 And GetSelectedCount([" + dimensionField + "]) <= " + maxFields;
            var condShowMsg = "Please select between 1 and " + maxFields + " values in the [" + dimensionField + "] filter."
            var columns = [{
                qDef: {
                    qLabel: "Row",
                    qDef: "=RowNo(TOTAL)",
                    qAggrFunc: "Max"/*,
                    qNumFormat: "# ##0" */
                },
                qCalcCondition: { qCond: "=GetSelectedCount([" + dimensionField + "]) >= 1" }
            }];

            for (let i = 0; i < maxFields; i++) {
                var n = i + 1;
                var baseFormula = "SubField(Concat([" + dimensionField + "], Chr(124)), Chr(124), " + n + ")";

                var columnData = {
                    qDef: {
                        qFieldDefs: ["=$(=Chr(91) & " + baseFormula + " & Chr(93))"],
                        qLabelExpression: "=" + baseFormula
                    },
                    qCalcCondition: { qCond: "=GetSelectedCount([" + dimensionField + "]) >= " + n }
                };

                columns.push(columnData);
            }

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
                    + "<p>After configuring the setting this will become a standard Qlik Sense table.</p>"
                    + "<td></tr></table>");

                return qlik.Promise.resolve();
            }
        };
    });
