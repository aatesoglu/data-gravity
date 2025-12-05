import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import { GlowButton } from '../../ui/GlowButton';
import type { ChartRecommendation } from '../../../lib/recommendations/recommendEngine';
import type { DatasetAnalysis } from '../../../lib/analyzeData';
import { DynamicChart } from './DynamicChart';
import { Download, Share2, Settings, ArrowLeft } from 'lucide-react';

interface VisualizationCanvasProps {
    chart: ChartRecommendation;
    data: any[];
    analysis: DatasetAnalysis;
    onBack: () => void;
}

export const VisualizationCanvas = ({ chart, data, analysis, onBack }: VisualizationCanvasProps) => {


    const handleExport = (format: 'png' | 'svg') => {
        // Basic stub for export functionality
        console.log(`Exporting as ${format}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-7xl mx-auto"
        >
            {/* Function Bar */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <GlowButton variant="ghost" onClick={onBack} className="px-3">
                        <ArrowLeft className="w-5 h-5" />
                    </GlowButton>
                    <div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">
                            {chart.title}
                        </h2>
                        <p className="text-gray-400 text-sm">Interactive Visualization Mode</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <GlowButton variant="secondary" className="px-4 py-2" onClick={() => handleExport('png')}>
                        <Download className="w-4 h-4 mr-2" /> Export
                    </GlowButton>
                    <GlowButton variant="ghost" className="px-4 py-2">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                    </GlowButton>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Canvas */}
                <div className="lg:col-span-3">
                    <GlassCard className="h-[600px] flex items-center justify-center p-2 relative bg-space-900/50">
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                            <div className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-400">
                                Live Preview
                            </div>
                        </div>

                        <DynamicChart
                            type={chart.type}
                            data={data}
                            analysis={analysis}
                            channels={chart.requiredChannels}
                        />
                    </GlassCard>
                </div>

                {/* Controls Panel */}
                <div className="lg:col-span-1 space-y-4">
                    <GlassCard className="p-4">
                        <h3 className="font-bold flex items-center gap-2 mb-4 text-cyan-400">
                            <Settings className="w-4 h-4" /> Configuration
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Color Palette</label>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 rounded-full bg-cyan-500 cursor-pointer ring-2 ring-white/20 hover:ring-cyan-400"></div>
                                    <div className="w-6 h-6 rounded-full bg-violet-500 cursor-pointer ring-2 ring-transparent hover:ring-violet-400"></div>
                                    <div className="w-6 h-6 rounded-full bg-orange-500 cursor-pointer ring-2 ring-transparent hover:ring-orange-400"></div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 block mb-2">X-Axis Label</label>
                                <div className="p-2 rounded bg-space-950/50 border border-white/10 text-sm text-gray-300">
                                    Auto-detected
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-gray-400 block mb-2">Interactive Features</label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-space-900 text-cyan-500" />
                                        Show Tooltips
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-space-900 text-cyan-500" />
                                        Enable Zoom
                                    </label>
                                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                                        <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-space-900 text-cyan-500" />
                                        Animation
                                    </label>
                                </div>
                            </div>
                        </div>
                    </GlassCard>

                    <GlassCard className="bg-gradient-to-br from-violet-900/20 to-transparent border-violet-500/20">
                        <h4 className="font-bold text-violet-400 mb-2">Insights</h4>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            This visualization highlights the distribution patterns in your data. Consider normalizing outliers for cleaner representation.
                        </p>
                    </GlassCard>
                </div>
            </div>
        </motion.div>
    );
};
