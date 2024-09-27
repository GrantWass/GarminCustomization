import { counties } from "./counties";
import * as turf from "@turf/turf";

export default async function isPointInCountry(point) {
  try {
    for (const country of counties.results) {
      const coordinates = country.geo_shape.geometry.coordinates[0];

      const polygon = turf.polygon([coordinates]);
      const pointTurf = turf.point([point[0], point[1]]);

      if (turf.booleanPointInPolygon(pointTurf, polygon)) {
        console.log(`Point is in ${country.name}`);
        return country.name;
      }
    }

    console.log("Point is not in any country");
    return null;
  } catch (error) {
    console.error("Error reading countries.json:", error);
  }
}
