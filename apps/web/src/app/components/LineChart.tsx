
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { KPI } from '../features/products/types.js';

interface LineChartProps {
  data: KPI[];
  loading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl p-4">
        <p className="text-gray-600 font-medium mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.dataKey}: <span className="font-semibold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

export function LineChart({ data, loading = false }: LineChartProps) {
  if (loading) {
    return (
      <div className="chart-container">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded-lg w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <div className="h-80 flex items-center justify-center">
          <p className="text-gray-500 text-lg">No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ paddingBottom: '20px' }}
          />
          <Line
            type="monotone"
            dataKey="stock"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
            name="Stock"
          />
          <Line
            type="monotone"
            dataKey="demand"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
            name="Demand"
          />
        </RechartsLineChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
