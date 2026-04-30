# Assignment 5: Performance Testing and Benchmark Report

## 1. Methodology

This performance engineering project aimed to benchmark and compare two Node.js backend applications: a Student MIS (Assignment 3) and an Online MCQ Exam System (Assignment 4). The goal was to measure throughput and latency across different types of routes using `autocannon`.

### Tools Used
- **Autocannon**: For high-speed HTTP load generation.
- **Node-Fetch**: For automating the registration and login flows to obtain JWT tokens.
- **Node.js**: The runtime environment for the benchmarking suite.

### Test Environment
- **Concurrency**: 10 concurrent connections.
- **Duration**: 10 seconds per test.
- **Hardware**: Local Machine.

### Scenarios
1.  **Scenario A (Static/Baseline)**: A GET request to the root (`/`) of the MCQ system. This measures the raw server overhead of Express.js without database or authentication logic.
2.  **Scenario B (Protected/CPU-Bound)**: A GET request to `/api/questions` on the MCQ system. This route is protected by a JWT authentication middleware and performs a database query. It was benchmarked by first automating a user login to obtain a valid `Bearer` token.
3.  **Scenario C (Database-Bound)**: A GET request to `/api/departments` on the Student MIS system. This measures the performance of a standard database query operation.

---

## 2. Comparative Results

The following table summarizes the performance metrics collected from the benchmark runs.

| Scenario | Route | Req/Sec (Mean) | Latency (Mean) | Throughput (MB/s) |
| :--- | :--- | :--- | :--- | :--- |
| **A: Static (Baseline)** | `GET /` | **11,984.55** | **0.32 ms** | **5.31** |
| **B: Protected (JWT + DB)** | `GET /api/questions` | **1,169.10** | **6.96 ms** | **0.95** |
| **C: DB-Bound (Student MIS)** | `GET /api/departments` | **4,831.61** | **1.55 ms** | **1.96** |

---

## 3. Analysis

### Static vs. Database Routes
The **Static (Baseline)** route was the fastest, processing nearly **12,000 requests per second** with a negligible latency of **0.32 ms**. This confirms that the Node.js/Express overhead is minimal when no significant logic or I/O involved.

In comparison, the **Database-Bound (Student MIS)** route dropped to **~4,800 requests per second** with a latency of **1.55 ms**. This increase in latency (approximately **5x slower**) represents the cost of checking out a database connection from the pool, executing the query, and parsing the results.

### Impact of JWT and Middleware
The **Protected Route** showed the significant performance impact. It dropped to **~1,170 requests per second** with a latency of **6.96 ms**.

Comparing Scenario B (Protected) with Scenario C (DB-Bound), both perform database queries. However, Scenario B adds the **JWT Verification** step.
- **Database Overhead**: ~1.2 ms (estimated from Scenario C vs A).
- **Total Protected Overhead**: ~6.6 ms (Scenario B vs A).
- **Estimated Auth Overhead**: ~5.4 ms per request.

This substantial drop in throughput (approx. **4x slower than the pure DB route**) suggests that the cryptographic operations involved in verifying the JWT (checking the signature) are CPU-intensive and become a bottleneck under load, compared to the relatively efficient I/O operations of the database query.

### Conclusion
- **Authentication has a Cost**: Adding JWT middleware introduced a significant latency overhead (~5ms per request).
- **Database I/O is Efficient**: The PostgreSQL driver handles concurrency well, with much lower overhead than the authentication logic in this test setup.
- **Optimization**: For high-performance protected routes, caching token validation results or using faster signing algorithms (like HMAC instead of RSA, though `HS256` was likely used here) could help improve throughput.
