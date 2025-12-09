import {
    BarChart, Bar, LineChart, Line, ScatterChart, Scatter, AreaChart, Area, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    FunnelChart, Funnel, LabelList, Treemap,
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
            <div className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 p-4 rounded-lg shadow-xl">
                <p className="text-cyan-400 font-bold mb-1">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm text-gray-300">
                        {entry.name}: <span className="text-white font-mono">{Number(entry.value).toLocaleString()}</span>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// Custom Treemap Content
const CustomTreemapContent = (props: any) => {
    const { x, y, width, height, index, name } = props;
    return (
        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: `hsl(${180 + index * 30}, 70%, 50%)`,
                    stroke: '#1f2937',
                    strokeWidth: 2,
                }}
            />
            {width > 30 && height > 30 && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={12}
                    fontWeight="bold"
                >
                    {name}
                </text>
            )}
        </g>
    );
};

// Custom BoxPlot Shape
const BoxPlotShape = (props: any) => {
    const { x, width, payload, yAxis } = props;

    // Safety check: specific to the crash "Cannot read properties of undefined (reading 'scale')"
    if (!yAxis || !yAxis.scale) {
        return <rect x={props.x} y={props.y} width={props.width} height={props.height} fill="#8884d8" opacity={0.5} />;
    }

    // Ensure we have statistical data
    if (payload.min === undefined || payload.max === undefined) {
        return <rect x={props.x} y={props.y} width={props.width} height={props.height} fill="#8884d8" opacity={0.5} />;
    }

    const scale = yAxis.scale;
    const yMin = scale(payload.min);
    const yQ1 = scale(payload.q1);
    const yMedian = scale(payload.median);
    const yQ3 = scale(payload.q3);
    const yMax = scale(payload.max);

    const center = x + width / 2;

    return (
        <g>
            {/* Whiskers Line (Min to Max) */}
            <line x1={center} y1={yMin} x2={center} y2={yMax} stroke="#00D9FF" strokeWidth={1} />

            {/* Box (Q1 to Q3) */}
            <rect
                x={x}
                y={yQ3}
                width={width}
                height={Math.abs(yQ1 - yQ3)}
                fill="#00D9FF"
                fillOpacity={0.2}
                stroke="#00D9FF"
                strokeWidth={2}
            />

            {/* Median Line */}
            <line x1={x} y1={yMedian} x2={x + width} y2={yMedian} stroke="#fff" strokeWidth={2} strokeDasharray="3 3" />

            {/* Whisker Caps */}
            <line x1={center - width / 4} y1={yMin} x2={center + width / 4} y2={yMin} stroke="#00D9FF" strokeWidth={2} />
            <line x1={center - width / 4} y1={yMax} x2={center + width / 4} y2={yMax} stroke="#00D9FF" strokeWidth={2} />
        </g>
    );
};

export const DynamicChart = ({ type, data, analysis, channels }: DynamicChartProps) => {
    // Debug logging
    console.log("DynamicChart Rendering:", { type, channels, dataLength: data?.length });

    // Resolve column names based on required channel types
    const requiredXType = channels?.x;
    const requiredYType = channels?.y;

    const xCol = (requiredXType ? analysis.columns.find(c => c.type === requiredXType)?.name : null)
        || analysis.columns.find(c => c.type === 'date' || c.type === 'categorical')?.name
        || analysis.columns[0]?.name;

    const yCol = (requiredYType ? analysis.columns.find(c => c.type === requiredYType)?.name : null)
        || analysis.columns.find(c => c.name !== xCol && c.type === 'numeric')?.name
        || analysis.columns[1]?.name;

    if (!data || data.length === 0 || !xCol || !yCol) {
        console.warn("DynamicChart: Insufficient data or missing columns", { xCol, yCol, dataLength: data?.length });
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-400 border border-white/10 rounded-lg min-h-[300px]">
                <p>Insufficient data for visualization</p>
            </div>
        );
    }

    // Prepare data (slice if too big for preview)
    const chartData = data.slice(0, 100).map(d => ({
        ...d,
        [yCol]: Number(d[yCol]) // Ensure Y-axis value is a number
    }));

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
        ),
        pie: (
            <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey={yCol}
                    nameKey={xCol}
                    label
                >
                    {chartData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${180 + index * 40}, 100%, 50%)`} />
                    ))}
                </Pie>
            </PieChart>
        ),
        radar: (
            <RadarChart cx="50%" cy="50%" outerRadius="60%" data={chartData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey={xCol} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <Radar name={yCol} dataKey={yCol} stroke="#00D9FF" fill="#00D9FF" fillOpacity={0.4} />
                <Tooltip content={<CustomTooltip />} />
            </RadarChart>
        ),
        histogram: (
            <BarChart data={chartData} barCategoryGap={0}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey={xCol} stroke="#6b7280" fontSize={12} tick={{ fill: '#9ca3af' }} />
                <YAxis stroke="#6b7280" fontSize={12} tick={{ fill: '#9ca3af' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Legend />
                <Bar dataKey={yCol} fill="#8B5CF6" opacity={0.8} />
            </BarChart>
        ),
        boxplot: (
            <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="category" stroke="#6b7280" fontSize={12} tick={{ fill: '#9ca3af' }} />
                <YAxis stroke="#6b7280" fontSize={12} tick={{ fill: '#9ca3af' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Legend />
                {/* We use 'median' as the primary key for the Bar to setup the axis range, but render custom shape */}
                <Bar dataKey="median" shape={<BoxPlotShape />} />
            </BarChart>
        ),
        funnel: (
            <FunnelChart>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Funnel
                    dataKey={yCol}
                    data={chartData}
                    isAnimationActive
                >
                    <LabelList position="right" fill="#fff" stroke="none" dataKey={xCol} />
                </Funnel>
            </FunnelChart>
        ),
        treemap: (
            <Treemap
                data={chartData}
                dataKey={yCol}
                nameKey={xCol}
                stroke="#fff"
                fill="#8884d8"
                content={<CustomTreemapContent />}
            >
                <Tooltip content={<CustomTooltip />} />
            </Treemap>
        )
    };

    const renderContent = () => {
        // @ts-ignore - Index signature for dynamic rendering
        const Component = ChartComponents[type] || ChartComponents['bar']; // Fallback to Bar
        return (
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                {Component}
            </ResponsiveContainer>
        );
    };

    return (
        <div className="w-full h-full min-h-[300px]">
            {renderContent()}
        </div>
    );
};
