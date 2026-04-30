-- X-Mart Operational Database (OLTP)
-- PRN: 23510014

CREATE DATABASE xmart_oltp;

\c xmart_oltp;

CREATE TABLE Stores (
    StoreID SERIAL PRIMARY KEY,
    StoreName VARCHAR(100),
    StoreLocation VARCHAR(255),
    City VARCHAR(100),
    State VARCHAR(100),
    Country VARCHAR(100)
);

CREATE TABLE Products (
    ProductID SERIAL PRIMARY KEY,
    ProductName VARCHAR(100),
    ProductCategory VARCHAR(50),
    ProductCost DECIMAL(10, 2),
    ProductPrice DECIMAL(10, 2)
);

CREATE TABLE Customers (
    CustomerID SERIAL PRIMARY KEY,
    CustomerName VARCHAR(100),
    Gender VARCHAR(10),
    ContactNo VARCHAR(15),
    City VARCHAR(100)
);

CREATE TABLE SalesPersons (
    SalesPersonID SERIAL PRIMARY KEY,
    SalesPersonName VARCHAR(100),
    StoreID INT REFERENCES Stores(StoreID),
    City VARCHAR(100),
    State VARCHAR(100),
    Country VARCHAR(100)
);

CREATE TABLE Sales (
    InvoiceNumber SERIAL PRIMARY KEY,
    SaleDate DATE,
    SaleTime TIME,
    CustomerID INT REFERENCES Customers(CustomerID),
    ProductID INT REFERENCES Products(ProductID),
    StoreID INT REFERENCES Stores(StoreID),
    SalesPersonID INT REFERENCES SalesPersons(SalesPersonID),
    Quantity INT,
    TotalAmount DECIMAL(10, 2)
);

-- Sample Data for PRN: 23510014
INSERT INTO Stores (StoreName, StoreLocation, City, State, Country) VALUES
('X-Mart East', 'Sector 5', 'Pune', 'Maharashtra', 'India'),
('X-Mart West', 'Bandra', 'Mumbai', 'Maharashtra', 'India');

INSERT INTO Products (ProductName, ProductCategory, ProductCost, ProductPrice) VALUES
('Laptop', 'Electronics', 40000, 55000),
('Smartphone', 'Electronics', 15000, 22000),
('Coffee Maker', 'Appliances', 2000, 3500);

INSERT INTO Customers (CustomerName, Gender, ContactNo, City) VALUES
('John Doe', 'Male', '9876543210', 'Pune'),
('Jane Smith', 'Female', '8765432109', 'Mumbai');

INSERT INTO SalesPersons (SalesPersonName, StoreID, City, State, Country) VALUES
('Rahul Sharma', 1, 'Pune', 'Maharashtra', 'India'),
('Amit Patel', 2, 'Mumbai', 'Maharashtra', 'India');

INSERT INTO Sales (SaleDate, SaleTime, CustomerID, ProductID, StoreID, SalesPersonID, Quantity, TotalAmount) VALUES
('2026-02-01', '10:30:00', 1, 1, 1, 1, 1, 55000),
('2026-02-01', '14:20:00', 2, 2, 2, 2, 2, 44000),
('2026-02-02', '11:00:00', 1, 3, 1, 1, 5, 17500);
