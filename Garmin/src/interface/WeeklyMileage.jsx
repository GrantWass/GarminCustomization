import React from 'react';

const LineGraph = ({ data }) => {


    if (data.length == 0) {
        return <div>Loading...</div>;
    }

    const width = 600;
    const height = 300;
    const padding = 50;

    const maxX = Math.max(...data.map(d => d[0]));
    const maxY = Math.max(...data.map(d => d[1]));
    const minY = Math.min(...data.map(d => d[1]));

    const xScale = (x) => (x / maxX) * (width - 2 * padding) + padding;
    const yScale = (y) => (height - ((y - minY) / (maxY - minY)) * (height - 2 * padding) - padding);

    let points = data.map(d => [xScale(d[0]), yScale(d[1])]);

    return (
    <div>
    <svg width={width} height={height} className="line-graph">
        {/* Axis */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="black" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="black" />

        {/* Data line */}
        <polyline
        fill="none"
        stroke="blue"
        strokeWidth="2"
        points={points.map(p => p.join(',')).join(' ')}
        />

        {/* Data points */}
        {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="red" />
        ))}
    </svg>
    </div>
    );
};

export default LineGraph;
