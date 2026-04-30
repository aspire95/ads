-- ==========================================
-- 1. Operational Database Schema (Source)
-- ==========================================

-- Headquarter Database Relations
CREATE TABLE Headquarters (
    City_id INT PRIMARY KEY,
    City_name VARCHAR(100),
    Headquarter_addr VARCHAR(255),
    State VARCHAR(100),
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Customer (
    Customer_id INT PRIMARY KEY,
    Customer_name VARCHAR(100),
    City_id INT REFERENCES Headquarters(City_id),
    First_order_date DATE,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Walk_in_customers (
    Customer_id INT PRIMARY KEY REFERENCES Customer(Customer_id),
    tourism_guide VARCHAR(100),
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Mail_order_customers (
    Customer_id INT PRIMARY KEY REFERENCES Customer(Customer_id),
    post_address TEXT,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales Database Relations
CREATE TABLE Stores (
    Store_id INT PRIMARY KEY,
    City_id INT REFERENCES Headquarters(City_id),
    Phone VARCHAR(20),
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Items (
    Item_id INT PRIMARY KEY,
    Description TEXT,
    Size VARCHAR(50),
    Weight DECIMAL(10,2),
    Unit_price DECIMAL(10,2),
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Stored_items (
    Store_id INT REFERENCES Stores(Store_id),
    Item_id INT REFERENCES Items(Item_id),
    Quantity_held INT,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Store_id, Item_id)
);

CREATE TABLE Orders (
    Order_no INT PRIMARY KEY,
    Order_date DATE,
    Customer_id INT REFERENCES Customer(Customer_id)
);

CREATE TABLE Ordered_item (
    Order_no INT REFERENCES Orders(Order_no),
    Item_id INT REFERENCES Items(Item_id),
    Quantity_ordered INT,
    Ordered_price DECIMAL(10,2),
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (Order_no, Item_id)
);

-- ==========================================
-- 2. Sample Data Insertion
-- ==========================================

-- Insert Headquarters
INSERT INTO Headquarters (City_id, City_name, Headquarter_addr, State) VALUES
(1, 'New York', '123 Broadway, NY', 'NY'),
(2, 'Los Angeles', '456 Sunset Blvd, LA', 'CA'),
(3, 'Chicago', '789 Michigan Ave, CHI', 'IL');

-- Insert Stores
INSERT INTO Stores (Store_id, City_id, Phone) VALUES
(101, 1, '212-555-0101'),
(102, 1, '212-555-0102'),
(201, 2, '310-555-0201'),
(301, 3, '312-555-0301');

-- Insert Items
INSERT INTO Items (Item_id, Description, Size, Weight, Unit_price) VALUES
(1, 'Laptop', 'Medium', 2.5, 1200.00),
(2, 'Smartphone', 'Small', 0.5, 800.00),
(3, 'Monitor', 'Large', 5.0, 300.00);

-- Insert Stored Items (Stock)
INSERT INTO Stored_items (Store_id, Item_id, Quantity_held) VALUES
(101, 1, 50),
(101, 2, 100),
(102, 1, 30),
(201, 2, 80),
(301, 3, 60);

-- Insert Customers
INSERT INTO Customer (Customer_id, Customer_name, City_id, First_order_date) VALUES
(501, 'Alice Smith', 1, '2023-01-15'),
(502, 'Bob Johnson', 2, '2023-02-20'),
(503, 'Charlie Brown', 1, '2023-03-10'),
(504, 'David Wilson', 3, '2023-04-05');

-- Insert Walk-in
INSERT INTO Walk_in_customers (Customer_id, tourism_guide) VALUES
(501, 'Global Tours'),
(503, 'City Explorer');

-- Insert Mail-order
INSERT INTO Mail_order_customers (Customer_id, post_address) VALUES
(502, '456 Oak St, LA, CA'),
(503, '789 Maple Ave, NY, NY'); -- 503 is a DUAL customer

-- Insert Orders
INSERT INTO Orders (Order_no, Order_date, Customer_id) VALUES
(1001, '2023-05-01', 501),
(1002, '2023-05-02', 502),
(1003, '2023-05-03', 503);

-- Insert Ordered Items
INSERT INTO Ordered_item (Order_no, Item_id, Quantity_ordered, Ordered_price) VALUES
(1001, 1, 1, 1200.00),
(1001, 2, 2, 800.00),
(1002, 2, 1, 800.00),
(1003, 3, 3, 300.00);
