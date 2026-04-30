-- X-Mart Data Warehouse (OLAP) - Star Schema
-- PRN: 23510014

CREATE DATABASE xmart_dw;

\c xmart_dw;

-- Dimension: DimDate
CREATE TABLE DimDate (
    DateKey INT PRIMARY KEY,
    Date DATE,
    FullDateUK VARCHAR(10),
    FullDateUSA VARCHAR(10),
    DayOfMonth INT,
    DaySuffix VARCHAR(5),
    DayName VARCHAR(15),
    DayOfWeekUSA INT,
    DayOfWeekUK INT,
    DayOfWeekInMonth INT,
    DayOfWeekInYear INT,
    DayOfQuarter INT,
    DayOfYear INT,
    WeekOfMonth INT,
    WeekOfQuarter INT,
    WeekOfYear INT,
    Month INT,
    MonthName VARCHAR(15),
    MonthOfQuarter INT,
    Quarter INT,
    QuarterName VARCHAR(15),
    Year INT,
    YearName VARCHAR(15),
    MonthYear VARCHAR(15),
    MMYYYY VARCHAR(10),
    IsWeekday BOOLEAN,
    IsHolidayUSA BOOLEAN,
    IsHolidayUK BOOLEAN
);

-- Dimension: DimTime
CREATE TABLE DimTime (
    TimeKey INT PRIMARY KEY,
    TimeAltKey TIME,
    Time30 VARCHAR(10),
    Hour30 INT,
    MinuteNumber INT,
    SecondNumber INT,
    TimeInSecond INT,
    HourlyBucket VARCHAR(20),
    DayTimeBucketGroupKey INT,
    DayTimeBucket VARCHAR(20)
);

-- Dimension: DimProduct
CREATE TABLE DimProduct (
    ProductKey SERIAL PRIMARY KEY,
    ProductAltKey INT,
    ProductName VARCHAR(100),
    ProductCost DECIMAL(10, 2)
);

-- Dimension: DimCustomer
CREATE TABLE DimCustomer (
    CustomerID SERIAL PRIMARY KEY,
    CustomerAltID INT,
    CustomerName VARCHAR(100),
    Gender VARCHAR(10)
);

-- Dimension: DimStores
CREATE TABLE DimStores (
    StoreKey SERIAL PRIMARY KEY,
    StoreAltID INT,
    StoreName VARCHAR(100),
    StoreLocation VARCHAR(255),
    City VARCHAR(100),
    State VARCHAR(100),
    Country VARCHAR(100)
);

-- Dimension: DimSalesPerson
CREATE TABLE DimSalesPerson (
    SalesPersonKey SERIAL PRIMARY KEY,
    SalesPersonAltID INT,
    SalesPersonName VARCHAR(100),
    StoreKey INT REFERENCES DimStores(StoreKey),
    City VARCHAR(100),
    State VARCHAR(100),
    Country VARCHAR(100)
);

-- Fact Table: FactProductSales
CREATE TABLE FactProductSales (
    TransactionID SERIAL PRIMARY KEY,
    SalesInvoiceNumber INT,
    DateKey INT REFERENCES DimDate(DateKey),
    TimeKey INT REFERENCES DimTime(TimeKey),
    StoreKey INT REFERENCES DimStores(StoreKey),
    CustomerKey INT REFERENCES DimCustomer(CustomerID),
    ProductKey INT REFERENCES DimProduct(ProductKey),
    SalesPersonKey INT REFERENCES DimSalesPerson(SalesPersonKey),
    Quantity INT,
    TotalAmount DECIMAL(10, 2),
    ActualCost DECIMAL(10, 2)
);

-- --- PRE-POPULATE DATA ---

-- Populating DimDate (Sample)
INSERT INTO DimDate (DateKey, Date, FullDateUK, FullDateUSA, DayOfMonth, DayName, Month, MonthName, Quarter, Year, IsWeekday)
VALUES 
(20260201, '2026-02-01', '01/02/2026', '02/01/2026', 1, 'Sunday', 2, 'February', 1, 2026, FALSE),
(20260202, '2026-02-02', '02/02/2026', '02/02/2026', 2, 'Monday', 2, 'February', 1, 2026, TRUE),
(20260208, '2026-02-08', '08/02/2026', '02/08/2026', 8, 'Sunday', 2, 'February', 1, 2026, FALSE);

-- Populating DimTime (Sample)
INSERT INTO DimTime (TimeKey, TimeAltKey, Hour30, MinuteNumber, SecondNumber, HourlyBucket, DayTimeBucket)
VALUES 
(103000, '10:30:00', 10, 30, 0, '10-11', 'Morning'),
(142000, '14:20:00', 14, 20, 0, '14-15', 'Afternoon'),
(110000, '11:00:00', 11, 0, 0, '11-12', 'Morning');

-- Populating Dimensions from OLTP (Simulated ETL)
INSERT INTO DimProduct (ProductAltKey, ProductName, ProductCost) VALUES
(1, 'Laptop', 40000),
(2, 'Smartphone', 15000),
(3, 'Coffee Maker', 2000);

INSERT INTO DimCustomer (CustomerAltID, CustomerName, Gender) VALUES
(1, 'John Doe', 'Male'),
(2, 'Jane Smith', 'Female');

INSERT INTO DimStores (StoreAltID, StoreName, StoreLocation, City, State, Country) VALUES
(1, 'X-Mart East', 'Sector 5', 'Pune', 'Maharashtra', 'India'),
(2, 'X-Mart West', 'Bandra', 'Mumbai', 'Maharashtra', 'India');

INSERT INTO DimSalesPerson (SalesPersonAltID, SalesPersonName, StoreKey, City, State, Country) VALUES
(1, 'Rahul Sharma', 1, 'Pune', 'Maharashtra', 'India'),
(2, 'Amit Patel', 2, 'Mumbai', 'Maharashtra', 'India');

-- Populating Fact Table
INSERT INTO FactProductSales (SalesInvoiceNumber, DateKey, TimeKey, StoreKey, CustomerKey, ProductKey, SalesPersonKey, Quantity, TotalAmount, ActualCost)
VALUES
(1, 20260201, 103000, 1, 1, 1, 1, 1, 55000.00, 40000.00),
(2, 20260201, 142000, 2, 2, 2, 2, 2, 44000.00, 30000.00),
(1, 20260202, 110000, 1, 1, 3, 1, 5, 17500.00, 10000.00),
(3, 20260208, 103000, 1, 2, 2, 1, 1, 22000.00, 15000.00); -- Sunday sale
