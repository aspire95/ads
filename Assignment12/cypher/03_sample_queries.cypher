// ============================================================
// Assignment 12 Ver2: Spatial and Geographic Data - Neo4j
// Script 03: Sample spatial queries
// ============================================================
// Run these queries one by one after loading the data.
// ============================================================

// Query 1: Distance between Copenhagen stations and Malmo offices.
MATCH (t:TrainStation {city: 'Copenhagen'})
MATCH (o:Office {city: 'Malmo'})
WITH t, o, point.distance(t.location, o.location) / 1000 AS dist_km
RETURN t.id AS StationID,
       t.name AS TrainStation,
       o.id AS OfficeID,
       o.name AS Office,
       round(dist_km, 2) AS Distance_km
ORDER BY dist_km ASC
LIMIT 5;

// Query 2: Ten nearest train stations to Copenhagen city centre.
WITH point({latitude: 55.6761, longitude: 12.5683, crs: 'WGS-84'}) AS refPoint
MATCH (t:TrainStation)
WITH t, point.distance(t.location, refPoint) / 1000 AS dist_km
RETURN t.id AS StationID,
       t.name AS StationName,
       t.city AS City,
       t.latitude AS Latitude,
       t.longitude AS Longitude,
       round(dist_km, 3) AS Distance_km
ORDER BY dist_km ASC
LIMIT 10;

// Query 3: Five nearest offices to station TS-1.
MATCH (t:TrainStation {id: 'TS-1'})
MATCH (o:Office)
WITH t, o, point.distance(t.location, o.location) / 1000 AS dist_km
RETURN t.name AS FromStation,
       o.name AS NearestOffice,
       o.city AS OfficeCity,
       round(dist_km, 3) AS Distance_km
ORDER BY dist_km ASC
LIMIT 5;

// Query 4: Offices within 10 km of station TS-100.
MATCH (t:TrainStation {id: 'TS-100'})
MATCH (o:Office)
WITH t, o, point.distance(t.location, o.location) AS dist_m
WHERE dist_m <= 10000
RETURN t.name AS Station,
       o.name AS Office,
       o.city AS City,
       round(dist_m / 1000, 3) AS Distance_km
ORDER BY dist_m ASC;

// Query 5: Train stations within 5 km of Berlin city centre.
WITH point({latitude: 52.5200, longitude: 13.4050, crs: 'WGS-84'}) AS berlinCentre
MATCH (t:TrainStation)
WITH t, point.distance(t.location, berlinCentre) AS dist_m
WHERE dist_m <= 5000
RETURN t.id AS StationID,
       t.name AS StationName,
       t.city AS City,
       round(dist_m / 1000, 3) AS Distance_km
ORDER BY dist_m ASC;

// Query 6: Nearest same-city office for each train station.
MATCH (t:TrainStation)
MATCH (o:Office)
WHERE t.city = o.city
WITH t, o, point.distance(t.location, o.location) AS dist_m
ORDER BY t.id, dist_m ASC
WITH t, collect({officeName: o.name, distanceM: round(dist_m)})[0] AS nearest
RETURN t.id AS StationID,
       t.name AS Station,
       t.city AS City,
       nearest.officeName AS NearestOffice,
       nearest.distanceM AS Distance_m
ORDER BY City, Distance_m ASC
LIMIT 20;

// Query 7: Shortest stored travel routes.
MATCH (t:TrainStation)-[r:TRAVEL_ROUTE]->(o:Office)
RETURN t.name AS TrainStation,
       t.city AS City,
       o.name AS Office,
       r.distance_m AS RouteDistance_m
ORDER BY r.distance_m ASC
LIMIT 10;

// Query 8: Top five longest travel routes.
MATCH (t:TrainStation)-[r:TRAVEL_ROUTE]->(o:Office)
RETURN t.name AS FromStation,
       o.name AS ToOffice,
       round(r.distance_m / 1000, 2) AS Distance_km
ORDER BY r.distance_m DESC
LIMIT 5;

// Query 9: Count offices within different radii around Paris.
WITH point({latitude: 48.8566, longitude: 2.3522, crs: 'WGS-84'}) AS paris
MATCH (o:Office)
WITH point.distance(o.location, paris) AS dist_m
RETURN count(CASE WHEN dist_m <= 5000 THEN 1 END) AS within_5km,
       count(CASE WHEN dist_m <= 10000 THEN 1 END) AS within_10km,
       count(CASE WHEN dist_m <= 20000 THEN 1 END) AS within_20km,
       count(CASE WHEN dist_m <= 50000 THEN 1 END) AS within_50km;

// Query 10: Nearest train stations to office OF-50.
MATCH (o:Office {id: 'OF-50'})
MATCH (t:TrainStation)
WITH o, t, point.distance(o.location, t.location) / 1000 AS dist_km
RETURN o.name AS Office,
       o.city AS OfficeCity,
       t.name AS NearestStation,
       t.city AS StationCity,
       round(dist_km, 3) AS Distance_km
ORDER BY dist_km ASC
LIMIT 5;

// Query 11: Average intra-city station-to-office distance by city.
MATCH (t:TrainStation)
MATCH (o:Office)
WHERE t.city = o.city
WITH t.city AS city,
     avg(point.distance(t.location, o.location)) / 1000 AS avg_dist_km,
     count(o) AS comparison_count
RETURN city AS City,
       round(avg_dist_km, 3) AS AvgDistance_km,
       comparison_count AS Comparisons
ORDER BY avg_dist_km ASC;

// Query 12: Manual point demo using exact coordinates.
WITH point({latitude: 55.672874, longitude: 12.564590, crs: 'WGS-84'}) AS copenhagenStation,
     point({latitude: 55.611784, longitude: 12.994341, crs: 'WGS-84'}) AS malmoOffice
RETURN copenhagenStation AS StationPoint,
       malmoOffice AS OfficePoint,
       round(point.distance(copenhagenStation, malmoOffice)) AS Distance_m,
       round(point.distance(copenhagenStation, malmoOffice) / 1000, 3) AS Distance_km;
