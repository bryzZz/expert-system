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
     
    let energyProduction: number[] = []; 
    for(let i = 0; i < forecasts['Солнце'].length; i++){ 
        const s = (forecasts['Солнце'][i] > 10 ? 15 : 15 * (forecasts['Солнце'][i] / 10)) * objectsCount['solarPanel']; 
        const w = (forecasts['Ветер'][i] > 9 ? 15 : 15 * (forecasts['Ветер'][i] / 9)) * objectsCount['windmill']; 
        energyProduction.push(s + w); 
    } 
    let energyConsumption: number[] = []; 
    for(let i = 0; i < forecasts['Дома'].length; i++){ 
        energyConsumption.push(forecasts['Дома'][i] * objectsCount['home'] + forecasts['Заводы'][i] * objectsCount['factory'] + forecasts['Больницы'][i] * objectsCount['hospital']); 
    } 
       
    return { 
      labels: new Array(forecasts['Солнце'].length).fill(0).map((_, i) => i.toString()), 
      datasets: [{ 
        label: 'Производство', 
        data: energyProduction, 
        pointRadius: 0, 
        tension: 0.1, 
      }, { 
        label: 'Потребление', 
        data: energyConsumption, 
        pointRadius: 0, 
        tension: 0.1, 
      }] 
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
