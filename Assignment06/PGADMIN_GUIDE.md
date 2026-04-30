# How to run the PostgreSQL Queries in pgAdmin 4

Follow these steps to set up and run the Data Warehouse project:

### 1. Open pgAdmin 4
- Launch pgAdmin 4 on your system.
- Connect to your PostgreSQL server (usually `PostgreSQL 15` or similar).

### 2. Create a New Database
- Right-click on **Databases** > **Create** > **Database...**
- Name it `customer_orders_dw` and click **Save**.

### 3. Open Query Tool
- Right-click on the newly created `customer_orders_dw` database.
- Select **Query Tool**.

### 4. Execute the Scripts IN ORDER

#### Step A: Setup Operational Database
1. Copy all content from `operational_db.sql`.
2. Paste it into the Query Tool.
3. Click the **Execute** button (the Play icon / F5).
4. Verify that tables (Customer, Stores, Items, etc.) are created in the `public` schema.

#### Step B: Setup Data Warehouse (ETL)
1. Clear the Query Tool.
2. Copy all content from `data_warehouse.sql`.
3. Paste it into the Query Tool and click **Execute**.
4. This will create the Star Schema tables (`dim_customer`, `dim_item`, `dim_store`, `dim_date`, `fact_sales`) and populate them with transformed data.

#### Step C: Run Business Queries
1. Clear the Query Tool.
2. Copy queries from `queries.sql` one by one or all at once.
3. Click **Execute** to see the results in the **Data Output** tab.

### 5. Viewing the Schema Graphically
- To see the "Star Schema" relationships, you can right-click on the database and select **ERD Tool**. Drag the tables (`dim_...` and `fact_sales`) onto the canvas to see the star structure visually.
