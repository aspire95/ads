# Cassandra Multi-Node Clustering Setup Guide

## Assignment 10 - Advanced Database System Lab

## Group: 2026GRP01

---

## Part 1: Single-Machine Multi-Node Cluster Setup

### Overview

Setting up 3 Cassandra nodes on a single Windows machine with proper clustering configuration.

### Node Configuration Summary

| Component                 | Node A    | Node B    | Node C    |
| ------------------------- | --------- | --------- | --------- |
| **Cluster Name**          | 2026GRP01 | 2026GRP01 | 2026GRP01 |
| **Storage Port**          | 7000      | 7001      | 7002      |
| **SSL Storage Port**      | 7001      | 7101      | 7102      |
| **Native Transport Port** | 9042      | 9043      | 9044      |
| **Listen Address**        | 127.0.0.1 | 127.0.0.1 | 127.0.0.1 |
| **RPC Address**           | 127.0.0.1 | 127.0.0.1 | 127.0.0.1 |

### Key Configuration Parameters

#### Cluster Name (`cassandra.yaml`)

All nodes must have the same cluster name:

```yaml
cluster_name: "2026GRP01"
```

#### Seed Nodes Configuration

Seeds help new nodes discover the cluster. All nodes point to the same seed list:

```yaml
seed_provider:
  - class_name: org.apache.cassandra.locator.SimpleSeedProvider
    parameters:
      - seeds: "127.0.0.1:7000,127.0.0.1:7001,127.0.0.1:7002"
```

#### Token Distribution

For uniform load distribution:

```yaml
num_tokens: 16
allocate_tokens_for_local_replication_factor: 3
```

---

## Part 2: Starting the Cluster

### Prerequisites

1. Java 11 or higher installed and in PATH
2. All three node directories configured (done)
3. No firewalls blocking ports 7000-7002, 9042-9044

### Starting Each Node

#### Start Node A (Terminal 1)

```bash
cd "Node A\bin"
cassandra.bat
```

Expected output:

```
INFO  - Created default data directory ...
INFO  - Listening for thrift clients ...
INFO  - Cassandra has started ...
```

#### Start Node B (Terminal 2)

Wait for Node A to fully start, then:

```bash
cd "Node B\bin"
cassandra.bat
```

Watch for discovery messages showing Node A has been detected.

#### Start Node C (Terminal 3)

Wait for Node B to fully start, then:

```bash
cd "Node C\bin"
cassandra.bat
```

### Verify Cluster Status

After all nodes have started, verify the cluster in a new terminal:

```bash
cd "Node A\bin"
nodetool -h 127.0.0.1 -p 7000 status
```

Expected output showing 3 UN (Up/Normal) nodes:

```
Datacenter: datacenter1
=======================
Status=Up/Down
|/ State=Normal/Leaving/Joining/Moving
--  Address      Load        Tokens  Owns    Host ID                               Rack
UN  127.0.0.1    100.0 KiB   16      33.3%   a1b2c3d4-...                        rack1
UN  127.0.0.1    100.0 KiB   16      33.3%   b2c3d4e5-...                        rack1
UN  127.0.0.1    100.0 KiB   16      33.3%   c3d4e5f6-...                        rack1
```

---

## Part 3: Testing the Cluster

### Connect to CQL Shell

```bash
cd "Node A\bin"
cqlsh 127.0.0.1 9042
```

### Create Sample Keyspace and Table

```cql
-- Create a keyspace with replication across all nodes
CREATE KEYSPACE IF NOT EXISTS test_ks
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};

USE test_ks;

-- Create a simple table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    name TEXT,
    email TEXT,
    age INT
);

-- Insert sample data
INSERT INTO users (id, name, email, age)
VALUES (uuid(), 'John Doe', 'john@example.com', 30);

INSERT INTO users (id, name, email, age)
VALUES (uuid(), 'Jane Smith', 'jane@example.com', 28);

-- Query the data
SELECT * FROM users;
```

### Verify Replication

Query from different node ports:

```bash
# Terminal 1 - Node A
cqlsh 127.0.0.1 9042

# Terminal 2 - Node B
cqlsh 127.0.0.1 9043

# Terminal 3 - Node C
cqlsh 127.0.0.1 9044
```

Data inserted to any node should be visible on all nodes (with slight delay for replication).

---

## Part 4: Multi-Machine Cluster Setup

For lab machines (3 or more physical machines):

### Configuration for Each Physical Machine

Each physical machine will have ONE Cassandra node. Update the `cassandra.yaml` accordingly:

#### Example: Machine 1 (IP: 192.168.1.10)

```yaml
cluster_name: "2026GRP01"
listen_address: 192.168.1.10
broadcast_address: 192.168.1.10
rpc_address: 0.0.0.0
broadcast_rpc_address: 192.168.1.10
storage_port: 7000
native_transport_port: 9042

seed_provider:
  - class_name: org.apache.cassandra.locator.SimpleSeedProvider
    parameters:
      - seeds: "192.168.1.10:7000,192.168.1.11:7000,192.168.1.12:7000"
```

#### Example: Machine 2 (IP: 192.168.1.11)

```yaml
cluster_name: "2026GRP01"
listen_address: 192.168.1.11
broadcast_address: 192.168.1.11
rpc_address: 0.0.0.0
broadcast_rpc_address: 192.168.1.11
storage_port: 7000
native_transport_port: 9042

seed_provider:
  - class_name: org.apache.cassandra.locator.SimpleSeedProvider
    parameters:
      - seeds: "192.168.1.10:7000,192.168.1.11:7000,192.168.1.12:7000"
```

#### Example: Machine 3 (IP: 192.168.1.12)

```yaml
cluster_name: "2026GRP01"
listen_address: 192.168.1.12
broadcast_address: 192.168.1.12
rpc_address: 0.0.0.0
broadcast_rpc_address: 192.168.1.12
storage_port: 7000
native_transport_port: 9042

seed_provider:
  - class_name: org.apache.cassandra.locator.SimpleSeedProvider
    parameters:
      - seeds: "192.168.1.10:7000,192.168.1.11:7000,192.168.1.12:7000"
```

### Key Differences for Multi-Machine Setup

| Parameter                 | Single Machine      | Multi-Machine                     |
| ------------------------- | ------------------- | --------------------------------- |
| **listen_address**        | 127.0.0.1           | Actual IP of machine              |
| **broadcast_address**     | (commented/default) | Actual IP of machine              |
| **rpc_address**           | 127.0.0.1           | 0.0.0.0 (binds to all interfaces) |
| **broadcast_rpc_address** | (commented/default) | Actual IP of machine              |
| **storage_port**          | Different per node  | Same (7000) for all               |
| **native_transport_port** | Different per node  | Same (9042) for all               |

### Multi-Machine Startup Procedure

1. **Start Node 1 (Seed Node):**

   ```bash
   cd Node/bin
   cassandra.bat
   ```

2. **Wait 30-60 seconds** for Node 1 to initialize

3. **Start Node 2:**

   ```bash
   cd Node/bin
   cassandra.bat
   ```

   Watch for "InetAddress ... is now UP" messages

4. **Similarly start remaining nodes**

5. **Verify cluster:**
   ```bash
   nodetool -h 192.168.1.10 status
   ```

---

## Important Notes

### For Single Machine

- All nodes use 127.0.0.1 (localhost)
- Different ports prevent binding conflicts
- replication_factor and RF tokens configured for 3 nodes

### For Multi-Machine

- Use actual machine IPs in listen_address and broadcast_address
- All nodes can use same ports (7000, 9042, etc.)
- Ensure network connectivity between machines (ping test)
- Firewall must allow ports 7000-7001 (internode comms) and 9042 (client)

### Data Consistency

- With RF=3 and 3 nodes, all data is replicated across all nodes
- Consistency Level = QUORUM provides strong consistency (2/3 nodes)
- On single machine: all replicas on same machine (for testing only)
- On multi-machine: replicas distributed across machines (production-like)

### Troubleshooting

**Nodes won't join cluster:**

- Verify cluster_name is identical on all nodes
- Check seed_provider configuration includes all nodes
- Ensure ports are not already in use: `netstat -an | findstr :7000`

**High latency on single machine:**

- Expected due to shared resources
- Use multi-machine setup for realistic performance testing

**Data not replicating:**

- Check replication_factor matches number of nodes
- Use `NODETOOL getendpoints <keyspace> <token>` to verify replica placement

---

## Deliverables

1. ✅ Configured 3-node cluster on single Windows machine
   - All nodes have same cluster_name: 2026GRP01
   - Different ports configured to avoid conflicts
   - Seed nodes properly configured

2. Set up multi-machine cluster on 3+ lab machines
   - Configure actual IP addresses in cassandra.yaml
   - Start nodes following multi-machine procedure
   - Document node IPs and configuration

3. Test and verify
   - Create keyspace with RF=3
   - Insert data and verify replication across all nodes
   - Demonstrate nodetool commands showing all nodes UP

---

## References

- Cassandra Documentation: https://cassandra.apache.org/doc/
- Clustering Guide: https://extendit.us/articles/steps-configure-multiple-nodes-cassandra-single-windows-machine
- Configuration Parameters: https://cassandra.apache.org/doc/latest/configuration/

---

**Last Updated:** 2026
**Team:** 2026GRP01
