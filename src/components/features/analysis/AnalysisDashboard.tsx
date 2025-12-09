import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import type { DatasetAnalysis } from '../../../lib/analyzeData';
import { Database, Layout, ShieldCheck, AlertTriangle, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { clsx } from 'clsx';
import { recommendCharts, type ChartRecommendation } from '../../../lib/recommendations/recommendEngine';
import { DynamicChart } from '../canvas/DynamicChart';
import { SmartAnalysis } from './SmartAnalysis';

interface AnalysisDashboardProps {
    analysis: DatasetAnalysis;
    data?: any[]; // We need data to render the chart
    onVisualize?: (chart: ChartRecommendation) => void;
}

export const AnalysisDashboard = ({ analysis, data = [], onVisualize }: AnalysisDashboardProps) => {
    const [recommendations, setRecommendations] = useState<ChartRecommendation[]>([]);

    useEffect(() => {
        if (analysis) {
            const recs = recommendCharts(analysis);
            setRecommendations(recs);
        }
    }, [analysis]);

    const bestFit = recommendations.length > 0 ? recommendations[0] : null;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-7xl mx-auto space-y-8"
        >
            {/* Top Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <GlassCard className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/20 text-blue-400">
                        <Layout className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Rows</p>
                        <h3 className="text-2xl font-bold">{analysis.rowCount.toLocaleString()}</h3>
                    </div>
                </GlassCard>

                <GlassCard className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
                        <Database className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Columns</p>
                        <h3 className="text-2xl font-bold">{analysis.columnCount}</h3>
                    </div>
                </GlassCard>

                <GlassCard className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${analysis.completenessScore > 90 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Data Quality</p>
                        <h3 className="text-2xl font-bold">{analysis.completenessScore}%</h3>
                    </div>
                </GlassCard>

                <GlassCard className="bg-cyan-900/20 border-cyan-500/30">
                    <div className="h-full flex flex-col justify-center">
                        <p className="text-sm text-cyan-400 font-semibold mb-1 flex items-center gap-2">
                            <Sparkles className="w-3 h-3" /> AI INSIGHT
                        </p>
                        <p className="text-xs text-gray-300">
                            {bestFit ? `Best fit: ${bestFit.title}` : "Dataset is ready for visualization."}
                        </p>
                    </div>
                </GlassCard>
            </div>

            {/* Best Fit Visualization Section */}
            {bestFit && (
                <GlassCard className="border-cyan-500/20 bg-cyan-900/5 overflow-hidden">
                    <div className="flex flex-col md:flex-row h-[450px] w-full"> {/* Ensure w-full */}
                        <div className="flex-1 p-4 relative h-full min-h-[300px] min-w-0"> {/* Add min-w-0 to prevent flex overflow issues, and min-h */}
                            <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs text-cyan-400 font-mono">
                                ★ Top Recommendation
                            </div>
                            <div className="w-full h-full"> {/* Wrapping DynamicChart in explicit full size div */}
                                <DynamicChart
                                    type={bestFit.type}
                                    data={data}
                                    analysis={analysis}
                                    channels={bestFit.requiredChannels}
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-80 border-l border-white/5 p-8 flex flex-col justify-center bg-black/20">
                            <div className="mb-6">
                                <p className="text-xs font-bold text-violet-400 tracking-widest uppercase mb-2">RECOMMENDED</p>
                                <h3 className="text-3xl font-bold text-white mb-3 leading-tight">{bestFit.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {bestFit.description}
                                </p>
                            </div>

                            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">WHY THIS CHART?</p>
                                <ul className="space-y-2">
                                    {(() => {
                                        const getReasons = (type: string) => {
                                            switch (type) {
                                                case 'line':
                                                case 'area':
                                                    return [
                                                        "Optimal for time-series analysis",
                                                        "Highlights trends over periods",
                                                        "High data density visual"
                                                    ];
                                                case 'bar':
                                                case 'radar':
                                                    return [
                                                        "Best for categorical comparison",
                                                        "Clear value differentiation",
                                                        "Easy to read discrete groups"
                                                    ];
                                                case 'scatter':
                                                    return [
                                                        "Shows correlation patterns",
                                                        "Identifies relationship strength",
                                                        "Good for outlier detection"
                                                    ];
                                                case 'pie':
                                                    return [
                                                        "Shows part-to-whole ratio",
                                                        "Simple composition view",
                                                        "Effective for few categories"
                                                    ];
                                                case 'histogram':
                                                case 'boxplot':
                                                    return [
                                                        "Visualizes data distribution",
                                                        "Key for statistical analysis",
                                                        "Detects spread & skewness"
                                                    ];
                                                default:
                                                    return [
                                                        "Best statistical fit",
                                                        "Matches data structure",
                                                        "High readability score"
                                                    ];
                                            }
                                        };

                                        const reasons = getReasons(bestFit.type);

                                        return (
                                            <>
                                                <li className="flex items-start gap-2 text-sm text-gray-300">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                                                    <span>{reasons[0]}</span>
                                                </li>
                                                <li className="flex items-start gap-2 text-sm text-gray-300">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                                                    <span>{reasons[1]} ({bestFit.score}% fit)</span>
                                                </li>
                                                <li className="flex items-start gap-2 text-sm text-gray-300">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                                                    <span>{reasons[2]}</span>
                                                </li>
                                            </>
                                        )
                                    })()}
                                </ul>
                            </div>
                        </div>
                    </div>
                </GlassCard>
            )}

            {/* Column Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Column Types Chart */}
                <GlassCard>
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-cyan-500 rounded-full" />
                        Data Structure
                    </h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analysis.columns.map(c => ({ name: c.name, unique: c.unique }))}>
                                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tick={{ fill: '#9ca3af' }} />
                                <YAxis stroke="#6b7280" fontSize={12} tick={{ fill: '#9ca3af' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1A2332', border: '1px solid #374151', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar dataKey="unique" fill="#00D9FF" radius={[4, 4, 0, 0]}>
                                    {analysis.columns.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.type === 'numeric' ? '#00D9FF' : '#8B5CF6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                {/* Column List */}
                <GlassCard className="overflow-hidden flex flex-col">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="w-1 h-6 bg-violet-500 rounded-full" />
                        Field Analysis
                    </h3>
                    <div className="overflow-y-auto max-h-[300px] pr-2 space-y-2 custom-scrollbar">
                        {analysis.columns.map((col) => (
                            <motion.div
                                variants={item}
                                key={col.name}
                                className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={clsx(
                                        "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                                        col.type === 'numeric' ? "bg-cyan-500/20 text-cyan-400" :
                                            col.type === 'date' ? "bg-orange-500/20 text-orange-400" :
                                                "bg-violet-500/20 text-violet-400"
                                    )}>
                                        {col.type.substring(0, 3).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white">{col.name}</div>
                                        <div className="text-xs text-gray-500">
                                            {col.unique} unique • {col.missing > 0 ? `${col.missing} missing` : 'Complete'}
                                        </div>
                                    </div>
                                </div>

                                {col.type === 'numeric' && (
                                    <div className="text-right text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div>Min: {col.min?.toLocaleString()}</div>
                                        <div>Max: {col.max?.toLocaleString()}</div>
                                    </div>
                                )}
                                {col.missing > 0 && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                            </motion.div>
                        ))}
                    </div>
                </GlassCard>
            </div>

            {/* Advanced Statistical Analysis (R Part) */}
            <motion.div variants={item}>
                <SmartAnalysis data={data} />
            </motion.div>
        </motion.div>
    );
};
