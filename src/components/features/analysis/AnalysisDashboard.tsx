import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import type { DatasetAnalysis } from '../../../lib/analyzeData';
import { Database, Layout, ShieldCheck, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { clsx } from 'clsx';

interface AnalysisDashboardProps {
    analysis: DatasetAnalysis;
}

export const AnalysisDashboard = ({ analysis }: AnalysisDashboardProps) => {
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
            className="w-full max-w-6xl mx-auto space-y-8"
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
                        <p className="text-sm text-cyan-400 font-semibold mb-1">AI INSIGHT</p>
                        <p className="text-xs text-gray-300">Dataset is ready for advanced visualization.</p>
                    </div>
                </GlassCard>
            </div>

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
                    <div className="mt-4 flex gap-4 justify-center text-xs text-gray-400">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-cyan-500"></span> Numeric</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-violet-500"></span> Categorical</div>
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
        </motion.div>
    );
};
