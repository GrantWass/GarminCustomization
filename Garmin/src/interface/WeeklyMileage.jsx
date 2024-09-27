import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarGraph = ({ data }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef && chartRef.current && data.length > 0) {
            const ctx = chartRef.current.getContext('2d');

            // Group runs by their exact date
            const groupByDate = (data) => {
                const groupedData = {};
                data.forEach(run => {
                    const date = run.date;  // Use the exact date as the key
                    if (!groupedData[date]) {
                        groupedData[date] = { miles: 0, elevation_gain: 0, duration: 0 };
                    }
                    groupedData[date].miles += run.miles;
                    groupedData[date].elevation_gain += run.elevation_gain;
                    groupedData[date].duration += run.duration;
                });
                return groupedData;
            };

            // Group the data by exact date
            const groupedData = groupByDate(data);

            // Get the labels (unique dates) and the corresponding data
            const dates = Object.keys(groupedData);
            const miles = dates.map(date => groupedData[date].miles);
            const elevation = dates.map(date => groupedData[date].elevation_gain);
            const duration = dates.map(date => groupedData[date].duration);

            // Standardize elevation gain and duration
            const maxMiles = Math.max(...miles);
            const maxElevation = Math.max(...elevation);
            const maxDuration = Math.max(...duration);

            const standardizedElevation = elevation.map(e => (e / maxElevation) * maxMiles);
            const standardizedDuration = duration.map(d => (d / maxDuration) * maxMiles);

            // Create the chart
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: dates.map(date => {
                        const d = new Date(date);
                        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    }),
                    datasets: [
                        {
                            label: 'Miles',
                            data: miles,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Light blue for miles
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            yAxisID: 'miles',
                        },
                        {
                            label: 'Duration (minutes)',
                            data: standardizedDuration,
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',  // Light yellow for duration
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1,
                            yAxisID: 'duration',
                        },
                        {
                            label: 'Elevation Gain (feet)',
                            data: standardizedElevation,
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',  // Light purple for elevation gain
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                            yAxisID: 'elevation',
                        }
                    ]
                },
                options: {
                    scales: {
                        x: {
                            ticks: {
                                color: 'white',  // x-axis label color
                            }
                        },
                        miles: {
                            type: 'linear',
                            position: 'left',  // Set miles to the left y-axis
                            ticks: {
                                color: 'white',
                                callback: (value) => value.toFixed(2) + ' miles',  // Show original miles value
                            },
                            title: {
                                display: true,
                                text: 'Miles',  // Label for the miles y-axis
                                color: 'white',
                                font: {
                                    size: 16
                                }
                            },
                            beginAtZero: true,
                        },
                        duration: {
                            type: 'linear',
                            position: 'right',  // Set duration to the right y-axis
                            ticks: {
                                color: 'white',
                                callback: (value) => (value * maxDuration / maxMiles).toFixed(2) + ' min',  // Convert back to original value
                            },
                            title: {
                                display: true,
                                text: 'Duration (minutes)',  // Label for the duration y-axis
                                color: 'white',
                                font: {
                                    size: 16
                                }
                            },
                            beginAtZero: true,
                            display: true,  // Make it visible or hidden dynamically
                        },
                        elevation: {
                            type: 'linear',
                            position: 'right',  // Set elevation to the right y-axis
                            ticks: {
                                color: 'white',
                                callback: (value) => (value * maxElevation / maxMiles).toFixed(2) + ' ft',  // Convert back to original value
                            },
                            title: {
                                display: true,
                                text: 'Elevation Gain (feet)',  // Label for the elevation gain y-axis
                                color: 'white',
                                font: {
                                    size: 16
                                }
                            },
                            beginAtZero: true,
                            grid: {
                                drawOnChartArea: false, // Disable gridlines for this axis
                            },
                            display: true,  // Make it visible or hidden dynamically
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: 'white'  // Legend text color
                            },
                            onClick: (e, legendItem, legend) => {
                                const index = legendItem.datasetIndex;
                                const chart = legend.chart;
                                const dataset = chart.data.datasets[index];

                                // Toggle the visibility of the dataset
                                dataset.hidden = !dataset.hidden;

                                // Get the corresponding y-axis ID and toggle its display
                                const yAxisID = dataset.yAxisID;
                                const yAxis = chart.options.scales[yAxisID];
                                yAxis.display = !yAxis.display;

                                // Update the chart
                                chart.update();
                            }
                        },
                        tooltip: {
                            callbacks: {
                                title: (tooltipItems) => {
                                    const date = tooltipItems[0].label;
                                    return `Date: ${date}`;
                                },
                                label: (tooltipItem) => {
                                    const label = tooltipItem.dataset.label || '';
                                    const value = tooltipItem.raw || 0;

                                    // Show the original values for elevation and duration in the tooltips
                                    if (label.includes('Elevation')) {
                                        const originalElevation = elevation[tooltipItem.dataIndex];
                                        return `Elevation Gain (feet): ${originalElevation.toFixed(2)}`;
                                    } else if (label.includes('Duration')) {
                                        const originalDuration = duration[tooltipItem.dataIndex];
                                        return `Duration (minutes): ${originalDuration.toFixed(2)}`;
                                    }

                                    // Return miles as it is
                                    return `${label}: ${value.toFixed(2)}`;
                                }
                            }
                        }
                    }
                }
            });

            return () => {
                chart.destroy();
            };
        }
    }, [data]);

    return (
        <div className='weekly-mileage-container'>
            <canvas ref={chartRef} className="bar-graph"></canvas>
        </div>
    );
};

export default BarGraph;
