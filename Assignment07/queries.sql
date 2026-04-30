
-- 1. Daily, weekly, monthly, quarterly profit of each store
SELECT 
    s.StoreName,
    d.Date,
    d.MonthName,
    d.Quarter,
    SUM(f.TotalAmount - f.ActualCost) AS TotalProfit
FROM FactProductSales f
JOIN DimStores s ON f.StoreKey = s.StoreKey
JOIN DimDate d ON f.DateKey = d.DateKey
GROUP BY ROLLUP (s.StoreName, d.Quarter, d.MonthName, d.Date)
ORDER BY s.StoreName, d.Date;

-- 2. Comparison of sales and profit on various time periods (Monthly)
SELECT 
    d.MonthName,
    d.Year,
    SUM(f.TotalAmount) AS TotalSales,
    SUM(f.TotalAmount - f.ActualCost) AS TotalProfit
FROM FactProductSales f
JOIN DimDate d ON f.DateKey = d.DateKey
GROUP BY d.Year, d.MonthName
ORDER BY d.Year, d.MonthName;

-- 3. Comparison of sales in various time bands of the day
SELECT 
    t.DayTimeBucket,
    SUM(f.TotalAmount) AS TotalSales
FROM FactProductSales f
JOIN DimTime t ON f.TimeKey = t.TimeKey
GROUP BY t.DayTimeBucket
ORDER BY TotalSales DESC;

-- 4. Which product has more demand on which location?
SELECT 
    s.City,
    p.ProductName,
    SUM(f.Quantity) AS TotalQuantity
FROM FactProductSales f
JOIN DimStores s ON f.StoreKey = s.StoreKey
JOIN DimProduct p ON f.ProductKey = p.ProductKey
GROUP BY s.City, p.ProductName
ORDER BY s.City, TotalQuantity DESC;

-- 5. Trend of sales by time period of the day (Morning/Afternoon/Evening)
SELECT 
    d.DayName,
    t.DayTimeBucket,
    SUM(f.TotalAmount) AS TotalSales
FROM FactProductSales f
JOIN DimDate d ON f.DateKey = d.DateKey
JOIN DimTime t ON f.TimeKey = t.TimeKey
GROUP BY d.DayName, t.DayTimeBucket
ORDER BY d.DayName;

-- 6. On what day sales is higher?
SELECT 
    d.DayName,
    SUM(f.TotalAmount) AS TotalSales
FROM FactProductSales f
JOIN DimDate d ON f.DateKey = d.DateKey
GROUP BY d.DayName
ORDER BY TotalSales DESC;

-- 7. Every Sunday of this month, what is sales and profit?
SELECT 
    d.Date,
    SUM(f.TotalAmount) AS TotalSales,
    SUM(f.TotalAmount - f.ActualCost) AS TotalProfit
FROM FactProductSales f
JOIN DimDate d ON f.DateKey = d.DateKey
WHERE d.DayName = 'Sunday' AND d.Month = 2 AND d.Year = 2026
GROUP BY d.Date;

-- 8. Trend of sales on weekday and weekend?
SELECT 
    CASE WHEN d.IsWeekday THEN 'Weekday' ELSE 'Weekend' END AS DayType,
    SUM(f.TotalAmount) AS TotalSales
FROM FactProductSales f
JOIN DimDate d ON f.DateKey = d.DateKey
GROUP BY DayType;

-- 9. Weekly, monthly and yearly sales comparison for KPI
SELECT 
    d.Year,
    d.MonthName,
    SUM(f.TotalAmount) AS MonthlySales
FROM FactProductSales f
JOIN DimDate d ON f.DateKey = d.DateKey
GROUP BY d.Year, d.MonthName
ORDER BY d.Year, d.MonthName;
