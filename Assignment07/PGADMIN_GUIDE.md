# X-Mart Data Warehouse Guide
**PRN:** 23510014

This guide explains how to set up and execute the X-Mart Data Warehouse project using pgAdmin 4.

## Prerequisites
- PostgreSQL installed
- pgAdmin 4 installed

## Execution Steps

### 1. Set up the Operational Database (OLTP)
1. Open **pgAdmin 4**.
2. Right-click on 'Servers' and connect to your local PostgreSQL server.
3. Open the **Query Tool**.
4. Copy and paste the content of `operational_db.sql` and execute it.
5. This will create the `xmart_oltp` database and populate it with initial transactional data.

### 2. Set up the Data Warehouse (OLAP)
1. In the Query Tool, execute the content of `data_warehouse.sql`.
2. This script:
   - Creates the `xmart_dw` database.
   - Designs the **Star Schema** with dimension and fact tables.
   - Populates dimensions and the fact table with sample data (simulating ETL).

### 3. Run Analytical Queries
1. Right-click on the `xmart_dw` database in the browser tree and select **Query Tool**.
2. Open `queries.sql`.
3. Select and execute queries one by one to see the results for:
   - Profit analysis by store.
   - Sales trends by time of day.
   - Weekend vs Weekday performance.
   - Product demand by location.

## Project Structure
- `operational_db.sql`: Source transactional system.
- `data_warehouse.sql`: Core Star Schema design.
- `queries.sql`: Analytical queries for decision making.
- `DimDate`: Dimension for time-based analysis (Date, Month, Quarter).
- `DimTime`: Dimension for granular time analysis (Hour, Time Bands).
- `FactProductSales`: Central fact table containing measures like Total Sales and Cost.

---
*Created for Advanced Database System Lab Assignment 7*
