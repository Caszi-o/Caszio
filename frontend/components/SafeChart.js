import { useState, useEffect } from 'react';

const SafeChart = ({ type, data, options, height = '300px', fallbackMessage = 'Chart temporarily unavailable' }) => {
  const [ChartComponent, setChartComponent] = useState(null);
  const [chartError, setChartError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const loadChart = async () => {
      try {
        // Dynamically import chart components to avoid SSR issues
        const { Line, Doughnut, Bar } = await import('react-chartjs-2');
        
        // Also import and register Chart.js components
        const ChartJSModule = await import('chart.js');
        const ChartJS = ChartJSModule.Chart;

        // Register ChartJS components
        ChartJS.register(
          ChartJSModule.CategoryScale,
          ChartJSModule.LinearScale,
          ChartJSModule.PointElement,
          ChartJSModule.LineElement,
          ChartJSModule.Title,
          ChartJSModule.Tooltip,
          ChartJSModule.Legend,
          ChartJSModule.ArcElement,
          ChartJSModule.BarElement
        );
        
        const chartComponents = {
          line: Line,
          doughnut: Doughnut,
          bar: Bar
        };
        
        const Component = chartComponents[type] || Line;
        setChartComponent(() => Component);
      } catch (error) {
        console.warn('Chart.js failed to load:', error);
        setChartError(true);
      }
    };

    loadChart();
  }, [type, isClient]);

  // Show fallback during SSR or if there's an error
  if (!isClient || chartError || !ChartComponent) {
    return (
      <div 
        className="flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-sm mb-2">📊</div>
          <div className="text-sm">{fallbackMessage}</div>
        </div>
      </div>
    );
  }

  // Additional safety check
  if (!data) {
    return (
      <div 
        className="flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <div className="text-sm mb-2">📊</div>
          <div className="text-sm">No data available</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height }}>
      <ChartComponent data={data} options={options} />
    </div>
  );
};

export default SafeChart;
