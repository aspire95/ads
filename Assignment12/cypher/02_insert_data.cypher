// ============================================================
// Assignment 12 Ver2: Spatial and Geographic Data - Neo4j
// Script 02: Insert train stations, offices, and routes
// ============================================================
// Creates:
//   5000 TrainStation nodes
//   5000 Office nodes
//   5000 TRAVEL_ROUTE relationships
//
// If constraints already exist and data is already loaded, do not run this
// file again unless you first clean the database.
// ============================================================

// Step 1: Insert 5000 train stations.
UNWIND range(1, 5000) AS i
WITH i,
     [
       {city:'Copenhagen', baseLat:55.6761, baseLon:12.5683},
       {city:'Malmo',      baseLat:55.6050, baseLon:13.0038},
       {city:'Stockholm',  baseLat:59.3293, baseLon:18.0686},
       {city:'Oslo',       baseLat:59.9139, baseLon:10.7522},
       {city:'Helsinki',   baseLat:60.1695, baseLon:24.9354},
       {city:'Berlin',     baseLat:52.5200, baseLon:13.4050},
       {city:'Paris',      baseLat:48.8566, baseLon:2.3522},
       {city:'London',     baseLat:51.5074, baseLon:-0.1278},
       {city:'Amsterdam',  baseLat:52.3676, baseLon:4.9041},
       {city:'Brussels',   baseLat:50.8503, baseLon:4.3517},
       {city:'Vienna',     baseLat:48.2082, baseLon:16.3738},
       {city:'Prague',     baseLat:50.0755, baseLon:14.4378},
       {city:'Warsaw',     baseLat:52.2297, baseLon:21.0122},
       {city:'Budapest',   baseLat:47.4979, baseLon:19.0402},
       {city:'Rome',       baseLat:41.9028, baseLon:12.4964},
       {city:'Madrid',     baseLat:40.4168, baseLon:-3.7038},
       {city:'Lisbon',     baseLat:38.7169, baseLon:-9.1399},
       {city:'Athens',     baseLat:37.9838, baseLon:23.7275},
       {city:'Zurich',     baseLat:47.3769, baseLon:8.5417},
       {city:'Munich',     baseLat:48.1351, baseLon:11.5820}
     ][(i - 1) % 20] AS cityInfo
WITH i, cityInfo,
     round(cityInfo.baseLat + (rand() * 0.9 - 0.45), 6) AS lat,
     round(cityInfo.baseLon + (rand() * 0.9 - 0.45), 6) AS lon
CREATE (:TrainStation {
  id: 'TS-' + toString(i),
  name: cityInfo.city + ' Station ' + toString(i),
  city: cityInfo.city,
  latitude: lat,
  longitude: lon,
  location: point({latitude: lat, longitude: lon, crs: 'WGS-84'})
});

// Step 2: Insert 5000 offices.
UNWIND range(1, 5000) AS i
WITH i,
     [
       {city:'Copenhagen', baseLat:55.6761, baseLon:12.5683},
       {city:'Malmo',      baseLat:55.6050, baseLon:13.0038},
       {city:'Stockholm',  baseLat:59.3293, baseLon:18.0686},
       {city:'Oslo',       baseLat:59.9139, baseLon:10.7522},
       {city:'Helsinki',   baseLat:60.1695, baseLon:24.9354},
       {city:'Berlin',     baseLat:52.5200, baseLon:13.4050},
       {city:'Paris',      baseLat:48.8566, baseLon:2.3522},
       {city:'London',     baseLat:51.5074, baseLon:-0.1278},
       {city:'Amsterdam',  baseLat:52.3676, baseLon:4.9041},
       {city:'Brussels',   baseLat:50.8503, baseLon:4.3517},
       {city:'Vienna',     baseLat:48.2082, baseLon:16.3738},
       {city:'Prague',     baseLat:50.0755, baseLon:14.4378},
       {city:'Warsaw',     baseLat:52.2297, baseLon:21.0122},
       {city:'Budapest',   baseLat:47.4979, baseLon:19.0402},
       {city:'Rome',       baseLat:41.9028, baseLon:12.4964},
       {city:'Madrid',     baseLat:40.4168, baseLon:-3.7038},
       {city:'Lisbon',     baseLat:38.7169, baseLon:-9.1399},
       {city:'Athens',     baseLat:37.9838, baseLon:23.7275},
       {city:'Zurich',     baseLat:47.3769, baseLon:8.5417},
       {city:'Munich',     baseLat:48.1351, baseLon:11.5820}
     ][(i - 1) % 20] AS cityInfo
WITH i, cityInfo,
     round(cityInfo.baseLat + (rand() * 0.9 - 0.45), 6) AS lat,
     round(cityInfo.baseLon + (rand() * 0.9 - 0.45), 6) AS lon
CREATE (:Office {
  id: 'OF-' + toString(i),
  name: cityInfo.city + ' Office ' + toString(i),
  city: cityInfo.city,
  latitude: lat,
  longitude: lon,
  location: point({latitude: lat, longitude: lon, crs: 'WGS-84'})
});

// Step 3: Create one route from TS-i to OF-i.
UNWIND range(1, 5000) AS i
MATCH (t:TrainStation {id: 'TS-' + toString(i)})
MATCH (o:Office {id: 'OF-' + toString(i)})
CREATE (t)-[:TRAVEL_ROUTE {
  distance_m: round(point.distance(t.location, o.location))
}]->(o);

// Verification:
// MATCH (n) RETURN labels(n)[0] AS Label, count(n) AS Count ORDER BY Label;
// MATCH ()-[r:TRAVEL_ROUTE]->() RETURN count(r) AS Routes;
