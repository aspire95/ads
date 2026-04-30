# Assignment 10: Cassandra Clustering and IoT Use Case

## Group Name
**Cluster Name:** `2026GRP01`

---

## Part 1: Setup a multi-node Cassandra Cluster on a Single Windows Machine

### Approach A: Using Docker Compose (Recommended)
Docker Compose is the cleanest way to run a multi-node Cassandra cluster without causing port conflicts on a single machine.

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Navigate to the `Solution` folder.
3. Run the following command:
   ```bash
   docker-compose up -d
   ```
4. Verify the cluster status:
   ```bash
   docker exec -it cassandra-node1 nodetool status
   ```

### Approach B: Manual Installation on Windows
If you wish to do it manually without Docker, follow these steps:
1. Download apache-cassandra binary and extract it to three separate folders: `node1`, `node2`, and `node3`.
2. Edit `conf/cassandra.yaml` for each node:
   - **cluster_name:** `'2026GRP01'`
   - **storage_port:** `7000` (Node1), `7001` (Node2), `7002` (Node3)
   - **native_transport_port:** `9042` (Node1), `9043` (Node2), `9044` (Node3)
   - **rpc_port:** `9160` (Node1), `9161` (Node2), `9162` (Node3)
   - **data_file_directories**, **commitlog_directory**, **saved_caches_directory**: Point to distinct directories for each node.
   - **seeds:** `"127.0.0.1"` (IP of Node1) for all nodes.
3. Start Node 1 first by running `bin\cassandra.bat`. Once running, start Node 2 and Node 3.

---

## Part 2: Install DataStax OpsCenter Community Edition

1. Download the DataStax OpsCenter tar.gz or installer from their community download link.
2. Install and start OpsCenter.
3. Open a browser and navigate to `http://localhost:8888`.
4. Click **Manage existing cluster**.
5. Provide the hostname of any node in the cluster (e.g., `localhost` or the Docker IP) and configure the JMX port.
6. OpsCenter will automatically detect the other nodes in your `2026GRP01` cluster and start monitoring.

---

## Part 3 & 4: Weather Station IoT Use Case

The target keyspace and tables are defined in `schema.cql`. We partition the data by `weatherStationID` and `date` to avoid unbounded partition growth, and cluster by `event_time` to keep time-series ordering.

### Steps to Test:
1. Connect to Cassandra: `cqlsh localhost 9042`
2. Execute the schema:
   ```bash
   cqlsh -f schema.cql
   ```
3. Run the IoT Data Simulator (Node.js script) to generate random temperature data every 5 minutes:
   ```bash
   npm init -y
   npm install cassandra-driver
   node iot_simulator.js
   ```
4. In OpsCenter, you can visually observe the write requests rate rising as the IoT simulator continues pushing data. You can trace node distributions visually on the dashboard!
