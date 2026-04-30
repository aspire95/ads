-- ==========================================
-- 1. Data Warehouse Star Schema
-- ==========================================

-- Dimension: Time
CREATE TABLE dim_date (
    date_key INT PRIMARY KEY,
    full_date DATE,
    day INT,
    month INT,
    quarter INT,
    year INT,
    day_of_week VARCHAR(15)
);

-- Dimension: Customer (includes classification)
CREATE TABLE dim_customer (
    customer_key SERIAL PRIMARY KEY,
    customer_id INT,
    customer_name VARCHAR(100),
    city_name VARCHAR(100),
    state VARCHAR(50),
    customer_type VARCHAR(20), -- 'Walk-in', 'Mail-order', 'Dual'
    tourism_guide VARCHAR(100),
    post_address TEXT,
    first_order_date DATE
);

-- Dimension: Store
CREATE TABLE dim_store (
    store_key SERIAL PRIMARY KEY,
    store_id INT,
    city_name VARCHAR(100),
    state VARCHAR(50),
    headquarter_addr VARCHAR(255),
    phone VARCHAR(20)
);

-- Dimension: Item
CREATE TABLE dim_item (
    item_key SERIAL PRIMARY KEY,
    item_id INT,
    description TEXT,
    size VARCHAR(50),
    weight DECIMAL(10,2),
    unit_price DECIMAL(10,2)
);

-- Fact Table: Sales
CREATE TABLE fact_sales (
    order_no INT,
    customer_key INT REFERENCES dim_customer(customer_key),
    store_key INT REFERENCES dim_store(store_key),
    item_key INT REFERENCES dim_item(item_key),
    date_key INT REFERENCES dim_date(date_key),
    quantity_ordered INT,
    ordered_price DECIMAL(10,2),
    total_amount DECIMAL(12,2),
    PRIMARY KEY (order_no, item_key)
);

-- ==========================================
-- 2. ETL Process (Extract, Transform, Load)
-- ==========================================

-- Populate dim_date
DO $$
DECLARE
    start_date DATE := '2023-01-01';
    end_date DATE := '2023-12-31';
    curr_date DATE := start_date;
BEGIN
    WHILE curr_date <= end_date LOOP
        INSERT INTO dim_date (date_key, full_date, day, month, quarter, year, day_of_week)
        VALUES (
            TO_CHAR(curr_date, 'YYYYMMDD')::INT,
            curr_date,
            EXTRACT(DAY FROM curr_date),
            EXTRACT(MONTH FROM curr_date),
            EXTRACT(QUARTER FROM curr_date),
            EXTRACT(YEAR FROM curr_date),
            TO_CHAR(curr_date, 'Day')
        );
        curr_date := curr_date + INTERVAL '1 day';
    END LOOP;
END $$;

-- Populate dim_customer
INSERT INTO dim_customer (customer_id, customer_name, city_name, state, customer_type, tourism_guide, post_address, first_order_date)
SELECT 
    c.Customer_id, 
    c.Customer_name, 
    h.City_name, 
    h.State,
    CASE 
        WHEN w.Customer_id IS NOT NULL AND m.Customer_id IS NOT NULL THEN 'Dual'
        WHEN w.Customer_id IS NOT NULL THEN 'Walk-in'
        WHEN m.Customer_id IS NOT NULL THEN 'Mail-order'
        ELSE 'Unknown'
    END,
    w.tourism_guide,
    m.post_address,
    c.First_order_date
FROM Customer c
JOIN Headquarters h ON c.City_id = h.City_id
LEFT JOIN Walk_in_customers w ON c.Customer_id = w.Customer_id
LEFT JOIN Mail_order_customers m ON c.Customer_id = m.Customer_id;

-- Populate dim_store
INSERT INTO dim_store (store_id, city_name, state, headquarter_addr, phone)
SELECT 
    s.Store_id, 
    h.City_name, 
    h.State, 
    h.Headquarter_addr, 
    s.Phone
FROM Stores s
JOIN Headquarters h ON s.City_id = h.City_id;

-- Populate dim_item
INSERT INTO dim_item (item_id, description, size, weight, unit_price)
SELECT Item_id, Description, Size, Weight, Unit_price FROM Items;

-- Populate fact_sales
-- Note: In a real DW, we need logic to associate an order with a specific store.
-- The requirement says: "enterprise will try to satisfy the customer's order items by the present stock in the city where the customer lives."
-- If not found, "company will turn to the other cities".
-- For simplicity in this ETL, we'll assign the first store in the customer's city that has the item, or any store if not.

INSERT INTO fact_sales (order_no, customer_key, store_key, item_key, date_key, quantity_ordered, ordered_price, total_amount)
SELECT 
    oi.Order_no,
    dc.customer_key,
    (SELECT ds.store_key 
     FROM dim_store ds 
     JOIN Stored_items si ON ds.store_id = si.Store_id
     WHERE si.Item_id = oi.Item_id 
     AND (ds.city_name = dc.city_name OR NOT EXISTS (SELECT 1 FROM dim_store ds2 JOIN Stored_items si2 ON ds2.store_id = si2.Store_id WHERE si2.Item_id = oi.Item_id AND ds2.city_name = dc.city_name))
     LIMIT 1),
    di.item_key,
    TO_CHAR(o.Order_date, 'YYYYMMDD')::INT,
    oi.Quantity_ordered,
    oi.Ordered_price,
    (oi.Quantity_ordered * oi.Ordered_price)
FROM Ordered_item oi
JOIN Orders o ON oi.Order_no = o.Order_no
JOIN dim_customer dc ON o.Customer_id = dc.customer_id
JOIN dim_item di ON oi.Item_id = di.item_id;
