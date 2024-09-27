import SmallMap from './SmallMap';
import React from 'react';

const RunDetails = ({ run }) => {
  return (
    <div className="last-run">
      <SmallMap coordinates={run.coords} />
      <div className="run-info">
        <p className="location">{run.activity_name}</p>
        <p className="date">{run.date.replace(/ 0(\d) /, ' $1 ')}</p>
        <p className="start-time">
          <strong>Start Time:</strong> {run.start_time.replace(/^0+/, '')}
        </p>
      </div>
      <div className="activity-details">
        <p className="distance">
          <strong>Distance:</strong> {`${run.distance_miles.toFixed(2)} Miles`}
        </p>
        <p className="duration">
          <strong>Duration:</strong> {run.duration.replace(/^0+/, '')}
        </p>
        <p className="pace">
          <strong>Pace:</strong> {`${run.pace_per_mile} per mile`}
        </p>
        {run?.elevation_gain_feet && (
          <p className="elevation">
            <strong>Elevation Gain:</strong> {`${run.elevation_gain_feet.toFixed(2)} ft`}
          </p>
        )}
      </div>
    </div>
  );
};

export default RunDetails;
