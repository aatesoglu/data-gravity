
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import type { VisionResult } from '../../../lib/visionService';
import { Check, Lightbulb, BarChart, Type, Palette, Tag, ArrowRight, AlertTriangle } from 'lucide-react';
import { GlowButton } from '../../ui/GlowButton';
import { checkChartCompatibility, type ChartType } from '../../../lib/recommendations/recommendEngine';
import type { DatasetAnalysis } from '../../../lib/analyzeData';
import { DynamicChart } from '../canvas/DynamicChart';

interface VisionResultsProps {
    result: VisionResult;
    analysis: DatasetAnalysis | null;
    data?: any[]; // added data prop
    onVisualize: (chartType: ChartType) => void;
}

export const VisionResults = ({ result, analysis, data = [], onVisualize }: VisionResultsProps) => {
    const compatibility = checkChartCompatibility(analysis, result.chartType);
    const canVisualize = analysis && compatibility.compatible && data.length > 0;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold flex items-center gap-3">
                        <span className="w-2 h-10 bg-violet-500 rounded-full" />
                        Analysis Complete
                    </h2>
                    <p className="text-gray-400 mt-1">Detected visuals from uploaded image</p>
                </div>
                <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-sm">
                    Confidence: {(result.confidence * 100).toFixed(0)}%
                </div>
            </div>


            <GlassCard className="border-violet-500/30 bg-violet-900/10 mb-8 overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-6 p-4">
                    <div className="lg:w-1/2 min-h-[300px] rounded-2xl bg-space-950/50 border border-white/5 relative overflow-hidden flex items-center justify-center">
                        {canVisualize ? (
                            <div className="w-full h-full absolute inset-0 p-4">
                                <DynamicChart
                                    type={result.chartType}
                                    data={data}
                                    analysis={analysis!}
                                    channels={{ x: 'categorical', y: 'numeric' }} // Default assumption for auto-viz
                                />
                                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-cyan-500/20 text-xs text-cyan-400 border border-cyan-500/20 backdrop-blur-md">
                                    Live Preview
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <div className="p-4 rounded-2xl bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/50 inline-block mb-4">
                                    <BarChart className="w-10 h-10" />
                                </div>
                                <p className="text-sm text-gray-400">Upload dataset to see live preview</p>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">Detected: </h3>
                            <span className="text-2xl font-bold text-cyan-400 bg-cyan-950/30 px-3 py-1 rounded-lg border border-cyan-500/30">
                                {result.chartType.charAt(0).toUpperCase() + result.chartType.slice(1)} Chart
                            </span>
                        </div>
                        <p className="text-gray-300 leading-relaxed max-w-2xl">{result.description}</p>
                    </div>
                </div>
            </GlassCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Extracted Features */}
                <GlassCard>
                    <h4 className="font-bold mb-4 flex items-center gap-2 text-cyan-400">
                        <Tag className="w-4 h-4" /> Extracted Metadata
                    </h4>
                    <div className="space-y-3">
                        <div className="flex justify-between p-3 rounded bg-white/5">
                            <span className="text-gray-400 text-sm flex items-center gap-2"><Type className="w-4 h-4" /> X-Axis</span>
                            <span className="font-mono text-white">{result.extractedFeatures.xAxisLabel || "N/A"}</span>
                        </div>
                        <div className="flex justify-between p-3 rounded bg-white/5">
                            <span className="text-gray-400 text-sm flex items-center gap-2"><Type className="w-4 h-4" /> Y-Axis</span>
                            <span className="font-mono text-white">{result.extractedFeatures.yAxisLabel || "N/A"}</span>
                        </div>
                        <div className="flex justify-between p-3 rounded bg-white/5">
                            <span className="text-gray-400 text-sm flex items-center gap-2"><Palette className="w-4 h-4" /> Colors detected</span>
                            <div className="flex gap-2">
                                {result.extractedFeatures.colors.map((c, i) => (
                                    <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </GlassCard>

                {/* AI Suggestions */}
                <GlassCard>
                    <h4 className="font-bold mb-4 flex items-center gap-2 text-yellow-400">
                        <Lightbulb className="w-4 h-4" /> Improvement Suggestions
                    </h4>
                    <ul className="space-y-3">
                        {result.suggestions.map((s, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-start gap-3 text-sm text-gray-300"
                            >
                                <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                                <span>{s}</span>
                            </motion.li>
                        ))}
                    </ul>
                </GlassCard>
            </div>

            <GlassCard className="p-6 border-cyan-500/30">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="font-bold text-lg text-white mb-1">Style Transfer</h4>
                        <p className="text-gray-400 text-sm">Apply the detected <span className="text-cyan-400 font-bold">{result.chartType}</span> style to your configured dataset.</p>
                        {!analysis && <p className="text-yellow-500 text-xs mt-2 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Please upload a dataset first to enable this feature.</p>}
                        {analysis && !compatibility.compatible &&
                            <p className="text-red-400 text-xs mt-2 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Incompatible: {compatibility.reason}</p>
                        }
                    </div>
                    <GlowButton
                        onClick={() => onVisualize(result.chartType)}
                        className="px-8 whitespace-nowrap"
                        variant="primary"
                        disabled={!analysis || !compatibility.compatible}
                    >
                        Visualize My Data <ArrowRight className="w-4 h-4 ml-2" />
                    </GlowButton>
                </div>
            </GlassCard>
        </div>
    );
};
