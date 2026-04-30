# Assignment 11: Neo4j Research Papers Database

This project demonstrates how to model, construct, and query a graph database for research papers (the Cora dataset) using **Neo4j** and an **Angular 19** frontend.

## 📁 Pre-requisites

1. **Neo4j Desktop** (or a local Neo4j Docker container).
2. **Node.js 24+** and **npm** to run the frontend.
3. **Python 3.x** to fetch and convert the original dataset.

---

## 🚀 Step 1: Database Setup (Neo4j)

### 1. Enable CORS & Unsecured HTTP in Neo4j
Because the Angular app connects directly to Neo4j's HTTP API (for simplicity in an academic/lab setup), you must configure your database settings to allow `localhost` connections without blocking CORS.

Open your local Neo4j Desktop layout, click **Settings**, and ensure these lines are either added or uncommented:
```properties
dbms.connector.http.enabled=true
dbms.connector.http.allowed_origins=*
```
Wait for Neo4j to restart. Your server should now allow REST API access.

---

## 🗄️ Step 2: Data Extraction (Python)

The Cora dataset comes in `.content` and `.cites` files. Our Python script downloads and converts them to Neo4j-friendly `.csv` files.

1. Open a terminal inside the `data` folder.
2. Run:
   ```bash
   python convert_to_csv.py
   ```
3. The script will download the files and produce:
    - `papers.csv`
    - `cites.csv`
    - `categories.csv`
    - `authors.csv`

---

## 🔄 Step 3: Load Data into Neo4j

1. Navigate to the `import` directory for your Neo4j database instance:
   *(In Neo4j Desktop: right-click your database -> Open Folder -> Import)*
2. **Important:** Move all `.csv` files generated in the previous step into this `import` directory.
3. Open the Neo4j Browser and execute the provided Cypher scripts in `neo4j-queries` one-by-one, strictly in this order:

    - `01_constraints_indexes.cypher`
    - `02_load_categories.cypher`
    - `03_load_papers.cypher`
    - `04_load_citations.cypher`

You can also run snippets from `05_sample_queries.cypher` to interactively see how the data works!

---

## 💻 Step 4: Run the Angular Frontend

1. Open a terminal at `Assignment11/frontend`.
2. Assuming `npm install` has been run automatically, run the dev server:
   ```bash
   npm start
   ```
3. Navigate to `http://localhost:4200` to interact with the ResearchGraph application!

### Usage Note:
Make sure your Neo4j instance username is `neo4j` and your password is `password`. If your password is different, find `src/app/services/neo4j.service.ts` and change this snippet before clicking "Run Query":
```typescript
private username  = 'neo4j';
private password  = 'password'; // <- update to your local password
```
