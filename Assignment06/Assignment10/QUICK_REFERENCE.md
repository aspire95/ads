# Cassandra Cluster Configuration Summary

## Quick Reference Card

### Single-Machine Cluster (3 Nodes on Windows)

**Cluster Name:** `2026GRP01`

| Aspect          | Node A    | Node B    | Node C    |
| --------------- | --------- | --------- | --------- |
| Storage Port    | 7000      | 7001      | 7002      |
| Thrift Port     | 7001      | 7101      | 7102      |
| CQL Native Port | 9042      | 9043      | 9044      |
| Listen Address  | 127.0.0.1 | 127.0.0.1 | 127.0.0.1 |
| RPC Address     | 127.0.0.1 | 127.0.0.1 | 127.0.0.1 |

**All Nodes Seed List:**

```
127.0.0.1:7000,127.0.0.1:7001,127.0.0.1:7002
```

---

## Quick Commands

### Start Nodes

```bash
# Terminal 1 - Node A
cd "Node A\bin" && cassandra.bat

# Terminal 2 - Node B (wait 30s after Node A starts)
cd "Node B\bin" && cassandra.bat

# Terminal 3 - Node C (wait 30s after Node B starts)
cd "Node C\bin" && cassandra.bat
```

### Check Cluster Status

```bash
cd "Node A\bin"
nodetool -h 127.0.0.1 -p 7000 status
```

### Connect to CQL Shell

```bash
cd "Node A\bin"
cqlsh 127.0.0.1 9042
```

### Create Test Keyspace

```cql
CREATE KEYSPACE IF NOT EXISTS test_ks
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};
```

---

## Multi-Machine Setup (Lab)

**Replace with actual IPs for each machine:**

- Machine 1: `listen_address: <IP1>` | `broadcast_address: <IP1>`
- Machine 2: `listen_address: <IP2>` | `broadcast_address: <IP2>`
- Machine 3: `listen_address: <IP3>` | `broadcast_address: <IP3>`

**All machines use same ports:** 7000, 9042, etc.

**Seed list includes all machine IPs:**

```
<IP1>:7000,<IP2>:7000,<IP3>:7000
```

---

## Configuration Files Modified

✅ Node A/conf/cassandra.yaml

- cluster_name: 2026GRP01
- seeds: 127.0.0.1:7000,127.0.0.1:7001,127.0.0.1:7002
- storage_port: 7000
- native_transport_port: 9042

✅ Node B/conf/cassandra.yaml

- cluster_name: 2026GRP01
- seeds: 127.0.0.1:7000,127.0.0.1:7001,127.0.0.1:7002
- storage_port: 7001
- ssl_storage_port: 7101
- native_transport_port: 9043

✅ Node C/conf/cassandra.yaml

- cluster_name: 2026GRP01
- seeds: 127.0.0.1:7000,127.0.0.1:7001,127.0.0.1:7002
- storage_port: 7002
- ssl_storage_port: 7102
- native_transport_port: 9044

---

## Expected Output When Cluster is Running

```
UN  127.0.0.1    100.0 KiB   16      33.3%   <UUID1>    rack1
UN  127.0.0.1    100.0 KiB   16      33.3%   <UUID2>    rack1
UN  127.0.0.1    100.0 KiB   16      33.3%   <UUID3>    rack1

"UN" = Up/Normal (healthy nodes)
```

---

## Troubleshooting

**Nodes not forming cluster?**

- Check all cluster_name values match exactly
- Verify seed_provider has correct ports
- Look for "seed provider cannot be null" errors

**Port conflicts?**

- Run: `netstat -ano | findstr :7000` to check ports
- Kill processes if needed: `taskkill /PID <PID> /F`

**Nodes won't start?**

- Check Java is installed: `java -version`
- Check CASSANDRA_HOME environment if needed
- Review logs in Node/bin/
