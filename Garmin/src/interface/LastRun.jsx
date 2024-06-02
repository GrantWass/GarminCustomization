import SmallMap from './SmallMap'

const RunDetails = (run) => {
  run = run.run

    return (
      <div className="last-run">
        <SmallMap coordinates={run.coords}/>
        <p className="location">{run.activity_name}</p>
        <p className="date">{run.date.replace(/ 0(\d) /, ' $1 ')}</p>
        <p className="start-time"><strong>Start Time:</strong> {run.start_time.replace(/^0+/, '')}</p>
        <div className="activity-details">
          <p className="distance">{run.distance_miles.toFixed(2) + " Miles"}</p>
          <p className="duration">{run.duration.replace(/^0:+/, '')}</p>
          <p className="pace">{run.pace_per_mile + " per mile"}</p>
          <p className="elevation">{run.elevation_gain_feet.toFixed(2) + " ft elevation"}</p>
        </div>
      </div>
    );
  };
  
  export default RunDetails;