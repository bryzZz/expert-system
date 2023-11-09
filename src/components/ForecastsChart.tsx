import React, { useEffect, useMemo, useRef } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js/auto";
import { Line } from "react-chartjs-2";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ForecastsChartProps {
  data: Record<string, number[]>;
}

export const ForecastsChart: React.FC<ForecastsChartProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef();

  const chartData = useMemo(() => {
    return {
      labels: new Array(169).fill(0).map((_, i) => i.toString()),
      datasets: Object.entries(data).map(([label, data]) => ({
        label,
        data,
        pointRadius: 0,
        tension: 0.1,
      })),
    };
  }, [data]);

  useEffect(() => {
    if (!chartRef.current || !containerRef.current) return;

    const fn = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (chartRef.current as any).resize();
    };

    window.addEventListener("resize", fn);

    return () => {
      window.removeEventListener("resize", fn);
    };
  });

  return (
    <div ref={containerRef} className="w-full">
      <Line
        ref={chartRef}
        options={{
          resizeDelay: 0,
          responsive: true,
        }}
        data={chartData}
      />
    </div>
  );
};

// CBBBDCACDCBCBDBCAC - Диск A07 - Правильно
// СССABСBADBСDACBBCD - График A05 - Правильно

// EECEEBCDCCDBCADDAECDDCACEADB - Диск b01 - Правильно
// CCDDEECEEADABADBEACBDEDDEEDC - Диск b02
