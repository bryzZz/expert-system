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
import { Building, BuildingType } from "../types"; 
 
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
  buildings: Building[]; 
  forecasts: Record<string, number[]>; 
} 
 
export const EnergyChart: React.FC<ForecastsChartProps> = ({ buildings, forecasts }) => { 
  const containerRef = useRef<HTMLDivElement>(null); 
  const chartRef = useRef(); 
 
  const chartData = useMemo(() => { 
    const objectsCount = buildings.reduce((acc, cur) => { 
        if (cur.type in acc) { 
          acc[cur.type] += 1; 
        } else { 
          acc[cur.type] = 1; 
        } 
   
        return acc; 
      }, {} as Record<BuildingType, number>); 
       
    return { 
      labels: new Array(forecasts['Солнце'].length).fill(0).map((_, i) => i.toString()), 
      datasets: Object.entries(forecasts).map(([label, data]) => { 
        let _data = []; 
        if(label === 'Дома'){ 
            _data = data.map((value) => value * objectsCount['home']) 
        } 
        if(label === 'Заводы'){ 
            _data = data.map((value) => value * objectsCount['factory']) 
        } 
        if(label === 'Больницы'){ 
            _data = data.map((value) => value * objectsCount['hospital']) 
        } 
        if(label === 'Солнце'){ 
            _data = data.map((value) => (value > 10 ? 15 : 15 * (value / 10)) * objectsCount['solarPanel']) 
        } 
        if(label === 'Ветер'){ 
            _data = data.map((value) => (value > 9 ? 15 : 15 * (value / 9)) * objectsCount['windmill']) 
        } 
 
        return { 
            label, 
            data: _data, 
            pointRadius: 0, 
            tension: 0.1, 
          } 
      }), 
    }; 
  }, [forecasts]); 
 
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
