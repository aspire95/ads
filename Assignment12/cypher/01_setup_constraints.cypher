// ============================================================
// Assignment 12 Ver2: Spatial and Geographic Data - Neo4j
// Script 01: Setup constraints and indexes
// ============================================================

// Optional cleanup. Run only if you want a fresh database.
// MATCH (n) DETACH DELETE n;

CREATE CONSTRAINT train_station_id IF NOT EXISTS
FOR (t:TrainStation)
REQUIRE t.id IS UNIQUE;

CREATE CONSTRAINT office_id IF NOT EXISTS
FOR (o:Office)
REQUIRE o.id IS UNIQUE;

CREATE INDEX train_station_location IF NOT EXISTS
FOR (t:TrainStation)
ON (t.location);

CREATE INDEX office_location IF NOT EXISTS
FOR (o:Office)
ON (o.location);

CREATE INDEX train_station_city IF NOT EXISTS
FOR (t:TrainStation)
ON (t.city);

CREATE INDEX office_city IF NOT EXISTS
FOR (o:Office)
ON (o.city);

// Verification:
// SHOW CONSTRAINTS;
// SHOW INDEXES;
