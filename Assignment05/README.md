# How to Run Assignment 5 Benchmarks

Follow these steps to execute the performance benchmarks for the Student MIS (Assignment 3) and MCQ System (Assignment 4).

## Prerequisites
- Node.js installed.
- PostgreSQL running with the databases for Assignment 3 (`students03`, `departments03` tables) and Assignment 4 (`users04`, `questions04` tables) already set up.

## 1. Setup Dependencies
Open a terminal in `d:\College_Work\SEM-VI\ADS_LAB\Assignment05` and run:

```bash
# Main project dependencies
npm install

# Target Assignment 3 Backend dependencies
cd targets/ass3_backend
npm install
cd ../..

# Target Assignment 4 Backend dependencies
cd targets/ass4_backend
npm install
cd ../..
```

## 2. Run Assignment 3 Benchmark (Student MIS)

**Terminal 1 (Server):**
Start the Assignment 3 backend.
```bash
cd targets/ass3_backend
node server.js
```
*Wait for "Server running on port 3000"*

**Terminal 2 (Benchmark):**
Run the benchmark script.
```bash
node benchmark_ass3.js
```
*Output will be saved to `ass3_results.json`.*

> **Stop the server** in Terminal 1 (Ctrl+C) before proceeding.

## 3. Run Assignment 4 Benchmark (MCQ System)

**Terminal 1 (Server):**
Start the modified Assignment 4 backend.
```bash
cd targets/ass4_backend
node server.js
```
*Wait for "Server is running on port 3000"*

**Terminal 2 (Benchmark):**
Run the benchmark script.
```bash
node benchmark_ass4.js
```
*Output will be saved to `ass4_results.json`.*

## 4. View Report
The final report `Assignment 5 Performance Report.md` has essentially already been generated based on my run. You can regenerate the data by following the steps above if you wish to see it in action.
