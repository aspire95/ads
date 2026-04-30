-- ====================================================================
-- Business Requirement Queries (Running against Data Warehouse Schema)
-- ====================================================================

-- 1. Find all the stores along with city, state, phone, description, size, weight 
-- and unit price that hold a particular item of stock.
-- (Using operational Stored_items joined with DW dimensions for richness)
SELECT ds.store_id, ds.city_name, ds.state, ds.phone, di.description, di.size, di.weight, di.unit_price
FROM dim_store ds
JOIN Stored_items si ON ds.store_id = si.Store_id
JOIN dim_item di ON si.Item_id = di.item_id
WHERE di.description = 'Laptop'; -- 'Laptop' is a particular item


-- 2. Find all the orders along with customer name and order date that can be 
-- fulfilled by a given store.
SELECT fs.order_no, dc.customer_name, dd.full_date
FROM fact_sales fs
JOIN dim_customer dc ON fs.customer_key = dc.customer_key
JOIN dim_date dd ON fs.date_key = dd.date_key
JOIN dim_store ds ON fs.store_key = ds.store_key
WHERE ds.store_id = 101;


-- 3. Find all stores along with city name and phone that hold items ordered by 
-- given customer.
SELECT DISTINCT ds.store_id, ds.city_name, ds.phone
FROM fact_sales fs
JOIN dim_store ds ON fs.store_key = ds.store_key
JOIN dim_customer dc ON fs.customer_key = dc.customer_key
WHERE dc.customer_name = 'Alice Smith';


-- 4. Find the headquarter address along with city and state of all stores that 
-- hold stocks of an item above a particular level (e.g., > 10).
SELECT DISTINCT ds.headquarter_addr, ds.city_name, ds.state
FROM dim_store ds
JOIN Stored_items si ON ds.store_id = si.Store_id
WHERE si.Item_id = 1 AND si.Quantity_held > 10;


-- 5. For each customer order, show the items ordered along with description, 
-- store id and city name and the stores that hold the items.
SELECT fs.order_no, di.description, ds.store_id, ds.city_name as fulfillment_city,
       (SELECT string_agg(ds2.store_id::text, ', ') 
        FROM dim_store ds2 
        JOIN Stored_items si2 ON ds2.store_id = si2.Store_id 
        WHERE si2.Item_id = di.item_id) as all_holder_stores
FROM fact_sales fs
JOIN dim_item di ON fs.item_key = di.item_key
JOIN dim_store ds ON fs.store_key = ds.store_key;


-- 6. Find the city and the state in which a given customer lives.
SELECT customer_name, city_name, state
FROM dim_customer
WHERE customer_name = 'Bob Johnson';


-- 7. Find the stock level of a particular item in all stores in a particular city.
SELECT ds.store_id, ds.city_name, si.Quantity_held
FROM dim_store ds
JOIN Stored_items si ON ds.store_id = si.Store_id
WHERE si.Item_id = 1 AND ds.city_name = 'New York';


-- 8. Find the items, quantity ordered, customer, store and city of an order.
SELECT di.description, fs.quantity_ordered, dc.customer_name, ds.store_id, ds.city_name
FROM fact_sales fs
JOIN dim_item di ON fs.item_key = di.item_key
JOIN dim_customer dc ON fs.customer_key = dc.customer_key
JOIN dim_store ds ON fs.store_key = ds.store_key
WHERE fs.order_no = 1001;


-- 9. Find the walk in customers, mail order customers and dual customers 
-- (both walk-in and mail order).
SELECT customer_name, customer_type
FROM dim_customer
WHERE customer_type IN ('Walk-in', 'Mail-order', 'Dual');
-- Or breakdown count:
SELECT customer_type, count(*) 
FROM dim_customer 
GROUP BY customer_type;
