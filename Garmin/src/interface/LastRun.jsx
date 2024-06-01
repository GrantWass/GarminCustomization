const run = {
    distance: '5 miles',
    elevation: '200 feet',
    time: '35 minutes',
    pace: '7 minutes per mile',
    location: 'Central Park, New York'
  };

const RunDetails = () => {
    return (
      <div className="last-run">
        <p><strong>Distance:</strong> {run.distance}</p>
        <p><strong>Elevation:</strong> {run.elevation}</p>
        <p><strong>Time:</strong> {run.time}</p>
        <p><strong>Pace:</strong> {run.pace}</p>
        <p><strong>Location:</strong> {run.location}</p>
      </div>
    );
  };
  
  export default RunDetails;