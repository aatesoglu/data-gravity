import {
    BarChart, Bar, LineChart, Line, ScatterChart, Scatter, AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import type { ChartType } from '../../../lib/recommendations/recommendEngine';
import type { DatasetAnalysis } from '../../../lib/analyzeData';

interface DynamicChartProps {
    type: ChartType;
    data: any[];
    analysis: DatasetAnalysis;
    channels: {
        x: 'numeric' | 'categorical' | 'date';
        y: 'numeric' | 'categorical';
    };
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-space-900/90 backdrop-blur-md border border-cyan-500/30 p-4 rounded-lg shadow-xl">
                <p className="text-cyan-400 font-bold mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm text-gray-300">
                        {entry.name}: <span className="text-white font-mono">{entry.value.toLocaleString()}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export const DynamicChart = ({ type, data, analysis, channels }: DynamicChartProps) => {

    // 1. Identify Data Keys (Simple heuristic for MVP)
    // We need to find which columns match the required channels
    const xCol = analysis.columns.find(c => c.type === channels.x)?.name || analysis.columns[0].name;
    const yCol = analysis.columns.find(c => c.name !== xCol && c.type === channels.y)?.name || analysis.columns[1]?.name;

    // Prepare data (slice if too big for preview)
    const chartData = data.slice(0, 100);

    const ChartComponents = {
        bar: (
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey={xCol} stroke="#6b7280" fontSize={12} tick={{ fill: '#9ca3af' }} />
                <YAxis stroke="#6b7280" fontSize={12} tick={{ fill: '#9ca3af' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Legend />
                <Bar dataKey={yCol} fill="#00D9FF" radius={[4, 4, 0, 0]}>
                    {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${180 + index * 2}, 100%, 50%)`} opacity={0.8} />
                    ))}
                </Bar>
            </BarChart>
        ),
        line: (
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey={xCol} stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey={yCol} stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: '#8B5CF6' }} activeDot={{ r: 8 }} />
                {/* Optional second line if available */}
            </LineChart>
        ),
        area: (
            <AreaChart data={chartData}>
                <defs>
                    <linearGradient id="colorY" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey={xCol} stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey={yCol} stroke="#00D9FF" fillOpacity={1} fill="url(#colorY)" />
            </AreaChart>
        ),
        scatter: (
            <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" dataKey={xCol} name={xCol} stroke="#6b7280" fontSize={12} />
                <YAxis type="number" dataKey={yCol} name={yCol} stroke="#6b7280" fontSize={12} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
                <Scatter name="Data Points" data={chartData} fill="#00B4D8" />
            </ScatterChart>
        )
    };

    const renderContent = () => {
        // @ts-ignore - Index signature for dynamic rendering
        const Component = ChartComponents[type] || ChartComponents['bar']; // Fallback to Bar
        return (
            <ResponsiveContainer width="100%" height="100%">
                {Component}
            </ResponsiveContainer>
        );
    };

    return (
        <div className="w-full h-full">
            {renderContent()}
        </div>
    );
};
