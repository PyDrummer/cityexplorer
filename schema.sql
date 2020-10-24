DROP TABLE if exists locations;

CREATE TABLE locations (
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(255),
  latitude VARCHAR(255),
  longitude VARCHAR(255)
);
