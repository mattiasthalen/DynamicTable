# Dynamic Table

## Example Data
```
// Create an inline table with sample sales data
[Sales Data]:
LOAD * INLINE [
    Year, Quarter, Month, Region, Country, Category, Product, Segment, Sales, Quantity, Cost, Profit, Discount
    2023, Q1, Jan, North America, USA, Electronics, Laptop, Enterprise, 12500, 5, 8750, 3750, 0.10
    2023, Q1, Jan, North America, USA, Electronics, Smartphone, Consumer, 8200, 10, 5500, 2700, 0.05
    2023, Q1, Jan, Europe, Germany, Furniture, Desk, Enterprise, 4300, 3, 2800, 1500, 0.12
    2023, Q1, Feb, North America, Canada, Electronics, Tablet, Consumer, 6400, 8, 4200, 2200, 0.08
    2023, Q1, Feb, Europe, UK, Electronics, Smartphone, Enterprise, 9800, 12, 6500, 3300, 0.15
    2023, Q1, Feb, Asia Pacific, Japan, Software, Antivirus, SMB, 2200, 20, 1100, 1100, 0.00
    2023, Q1, Mar, North America, USA, Software, Office Suite, Enterprise, 18500, 25, 10000, 8500, 0.20
    2023, Q1, Mar, Europe, France, Electronics, Laptop, Consumer, 10200, 4, 7200, 3000, 0.05
    2023, Q1, Mar, Asia Pacific, Australia, Furniture, Chair, SMB, 3800, 10, 2500, 1300, 0.10
    2023, Q2, Apr, North America, USA, Electronics, Smartphone, Consumer, 7600, 9, 5100, 2500, 0.12
    2023, Q2, Apr, Europe, Germany, Software, Database, Enterprise, 22000, 2, 14000, 8000, 0.15
    2023, Q2, Apr, Asia Pacific, China, Electronics, Tablet, SMB, 5500, 7, 3800, 1700, 0.08
    2023, Q2, May, North America, Canada, Furniture, Bookshelf, Consumer, 2800, 4, 1700, 1100, 0.05
    2023, Q2, May, Europe, Spain, Electronics, Laptop, Enterprise, 14500, 6, 10200, 4300, 0.10
    2023, Q2, May, Asia Pacific, India, Software, Security, SMB, 4100, 15, 2500, 1600, 0.00
    2023, Q2, Jun, North America, USA, Software, Design, Consumer, 6200, 8, 3800, 2400, 0.15
    2023, Q2, Jun, Europe, Italy, Electronics, Smartphone, Enterprise, 11200, 14, 7500, 3700, 0.10
    2023, Q2, Jun, Asia Pacific, Singapore, Furniture, Desk, SMB, 3600, 3, 2400, 1200, 0.05
    2023, Q3, Jul, North America, USA, Electronics, Laptop, SMB, 9200, 4, 6400, 2800, 0.08
    2023, Q3, Jul, Europe, UK, Software, Office Suite, Consumer, 5800, 12, 3500, 2300, 0.10
    2023, Q3, Jul, Asia Pacific, Japan, Electronics, Smartphone, Enterprise, 13500, 15, 9000, 4500, 0.15
    2023, Q3, Aug, North America, Canada, Software, Database, SMB, 7800, 3, 4500, 3300, 0.00
    2023, Q3, Aug, Europe, France, Furniture, Chair, Consumer, 2100, 7, 1300, 800, 0.05
    2023, Q3, Aug, Asia Pacific, Australia, Electronics, Tablet, Enterprise, 11800, 12, 8200, 3600, 0.12
    2023, Q3, Sep, North America, USA, Electronics, Smartphone, Consumer, 9500, 11, 6300, 3200, 0.10
    2023, Q3, Sep, Europe, Germany, Furniture, Desk, Enterprise, 5600, 4, 3600, 2000, 0.15
    2023, Q3, Sep, Asia Pacific, China, Software, Antivirus, SMB, 3400, 30, 1800, 1600, 0.05
    2023, Q4, Oct, North America, USA, Software, Office Suite, Enterprise, 24500, 30, 14000, 10500, 0.20
    2023, Q4, Oct, Europe, Spain, Electronics, Laptop, Consumer, 10800, 5, 7500, 3300, 0.08
    2023, Q4, Oct, Asia Pacific, India, Furniture, Bookshelf, SMB, 2900, 5, 1800, 1100, 0.10
    2023, Q4, Nov, North America, Canada, Electronics, Smartphone, Consumer, 8800, 10, 5900, 2900, 0.12
    2023, Q4, Nov, Europe, UK, Software, Database, Enterprise, 19800, 2, 12500, 7300, 0.15
    2023, Q4, Nov, Asia Pacific, Singapore, Electronics, Tablet, SMB, 6700, 8, 4600, 2100, 0.05
    2023, Q4, Dec, North America, USA, Furniture, Chair, Enterprise, 4200, 12, 2700, 1500, 0.00
    2023, Q4, Dec, Europe, Italy, Electronics, Laptop, Consumer, 15600, 7, 10900, 4700, 0.10
    2023, Q4, Dec, Asia Pacific, Japan, Software, Security, SMB, 5300, 18, 3200, 2100, 0.08
];
```

## Dimension table
```
[Dimensions]:
Load
	*

Inline
	[
    	Dimension,	Dimension Sort
		Year,		1
		Quarter,	2
		Month,		3
		Region,		4
		Country,	5
		Category,	6
		Product,	7
		Segment,	8
		Sales,		9
		Quantity,	10
		Cost,		11
		Profit,		12
		Discount,	13
    ]
;
```

## Measure table
```
[Measures]:
Load
	[Measure]
,	'Sum([' & [Measure Expression] & '])' As [Measure Expression]
,	[Measure Sort]

Inline
	[
    	Measure,	Measure Expression, Measure Sort
        # Cost, 	Cost,				1
        # Profit,	Profit,				2
        # Discount,	Discount,			3
    ]
;
```