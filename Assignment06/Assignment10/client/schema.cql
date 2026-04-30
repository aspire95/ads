-- Assignment 10 Cassandra Keyspace
-- Create the keyspace matching the Weather Station Use Case
CREATE KEYSPACE IF NOT EXISTS weather_db 
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3'}
AND durable_writes = true;

USE weather_db;

-- We partition by weatherStationID and the recording date (to avoid partition bounds from getting too large over years)
-- And we cluster by the event_time in descending order to readily query the latest temperature of a station
CREATE TABLE IF NOT EXISTS temperature_data (
    weatherStationID text,
    date date,
    event_time timestamp,
    temperature decimal,
    PRIMARY KEY ((weatherStationID, date), event_time)
) WITH CLUSTERING ORDER BY (event_time DESC)
AND comment = 'Hold the temperature data generated every 5 mins by IoT weather sensors';

-- We could define Materialized Views or Secondary Indexes if "retrieval in any dimensions" is required natively
-- e.g. finding stations exceeding certain temperature:
CREATE INDEX IF NOT EXISTS ix_temperature ON temperature_data (temperature);
