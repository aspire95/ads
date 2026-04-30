# Assignment 12 Ver2 - Spatial and Geographic Data in Neo4j

Course: 7CS371 - Advanced Database System Lab  
Topic: Geospatial data and nearest-location queries  
Database: Neo4j 4.x or 5.x

## What To Do

1. Open Neo4j Desktop or Neo4j Browser.
2. Create or start a database.
3. Run `cypher/01_setup_constraints.cypher`.
4. Run `cypher/02_insert_data.cypher`.
   - Run the three main statements separately if Neo4j Browser asks you to split them.
5. Run `cypher/03_sample_queries.cypher` query by query.
6. Take screenshots of:
   - constraints/indexes
   - node and relationship counts
   - at least 4 to 6 sample query outputs

## Aim

To demonstrate storage and querying of spatial/geographic data using Neo4j native point values and distance functions.

## Problem Statement

Create a graph database containing train stations and offices. Each node should store latitude and longitude as raw values and as a Neo4j spatial `point`. Use Cypher queries to find nearest locations, locations within a radius, and travel-route distances.

## Graph Model

```text
(:TrainStation {id, name, city, latitude, longitude, location})
        |
        | [:TRAVEL_ROUTE {distance_m}]
        v
(:Office {id, name, city, latitude, longitude, location})
```

## Dataset Created

- 5,000 `TrainStation` nodes
- 5,000 `Office` nodes
- 5,000 `TRAVEL_ROUTE` relationships
- 20 European cities
- Native Neo4j WGS-84 spatial points

## Files

```text
Assignment12_ver2/
|-- README.md
`-- cypher/
    |-- 01_setup_constraints.cypher
    |-- 02_insert_data.cypher
    `-- 03_sample_queries.cypher
```

## Verification Queries

```cypher
SHOW CONSTRAINTS;
SHOW INDEXES;

MATCH (n)
RETURN labels(n)[0] AS Label, count(n) AS Count
ORDER BY Label;

MATCH ()-[r:TRAVEL_ROUTE]->()
RETURN count(r) AS Routes;
```

Expected result:

| Item | Count |
|---|---:|
| TrainStation | 5000 |
| Office | 5000 |
| TRAVEL_ROUTE | 5000 |

## Important Functions

```cypher
point({latitude: 55.6761, longitude: 12.5683, crs: 'WGS-84'})
point.distance(point1, point2)
```

`point.distance()` returns distance in metres.

## Conclusion

Neo4j can store and query geographic data using built-in spatial point support. Location-based queries such as nearest station, nearby offices, and route distance calculation can be implemented directly in Cypher without installing external spatial plugins.
