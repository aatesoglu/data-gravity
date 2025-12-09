import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '../../ui/GlassCard';
import type { VisionResult } from '../../../lib/visionService';
import { Check, Lightbulb, BarChart, Type, Palette, Tag, ArrowRight, AlertTriangle, Edit2, ChevronDown, Eye } from 'lucide-react';
import { GlowButton } from '../../ui/GlowButton';
import { checkChartCompatibility, type ChartType } from '../../../lib/recommendations/recommendEngine';
import type { DatasetAnalysis } from '../../../lib/analyzeData';
import { DynamicChart } from '../canvas/DynamicChart';
import { getChartImage } from '../../../lib/chartGallery';
import { generateMockResponse } from '../../../lib/visionService';
import { generateMockData } from '../../../lib/mockDataGenerator';

interface VisionResultsProps {
    result: VisionResult;
    analysis: DatasetAnalysis | null;
    data?: any[];
    onVisualize: (chartType: ChartType) => void;
}

export const VisionResults = ({ result, analysis, data = [], uploadedImage, onVisualize }: VisionResultsProps) => {
    const [currentResult, setCurrentResult] = useState<VisionResult>(result);
    const [isEditing, setIsEditing] = useState(false);

    // Live Mock Data State
    const [mockData, setMockData] = useState<any[]>([]);
    const [mockAnalysis, setMockAnalysis] = useState<DatasetAnalysis | null>(null);

    useEffect(() => {
        setCurrentResult(result);
    }, [result]);

    // Generate mock data whenever the chart type changes (and we don't have real data)
    useEffect(() => {
        // If we don't have real data to visualize, we use mock data
        if (!analysis || data.length === 0) {
            const mock = generateMockData(currentResult.chartType);
            setMockData(mock.data);
            setMockAnalysis(mock.analysis);
        }
    }, [currentResult.chartType, analysis, data.length]);

    const compatibility = checkChartCompatibility(analysis, currentResult.chartType);

    // We visualize if we have real data OR if we are in mock mode
    const isRealData = analysis && compatibility.compatible && data.length > 0;

    // Determine active data and analysis
    const activeData = isRealData ? data : mockData;
    const activeAnalysis = isRealData ? analysis! : mockAnalysis;

    const canVisualize = !!(activeData.length > 0 && activeAnalysis);

    const handleTypeChange = (newType: string) => {
        const newResult = generateMockResponse(newType as ChartType);
        setCurrentResult(newResult);
        setIsEditing(false);
    };

    const availableTypes: ChartType[] = ['bar', 'line', 'scatter', 'pie', 'area', 'histogram', 'boxplot', 'radar'];

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
                <div className="flex items-center gap-4">
                    <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-sm">
                        Confidence: {(currentResult.confidence * 100).toFixed(0)}%
                    </div>
                </div>
            </div>


            <GlassCard className="border-violet-500/30 bg-violet-900/10 mb-8 overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-6 p-4">
                    <div className="lg:w-1/2 min-h-[400px] rounded-2xl bg-space-950/50 border border-white/5 relative overflow-hidden flex items-center justify-center">
                        {canVisualize && activeAnalysis ? (
                            <div className="w-full h-full absolute inset-0 p-4">
                                <DynamicChart
                                    type={currentResult.chartType}
                                    data={activeData}
                                    analysis={activeAnalysis}
                                    channels={{ x: 'categorical', y: 'numeric' }}
                                />

                                {/* Overlay Badge */}
                                <div className="absolute top-2 right-2 flex flex-col items-end gap-2">
                                    {isRealData ? (
                                        <div className="px-2 py-1 rounded bg-cyan-500/20 text-xs text-cyan-400 border border-cyan-500/20 backdrop-blur-md flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" /> Live Data
                                        </div>
                                    ) : (
                                        <div className="px-2 py-1 rounded bg-yellow-500/10 text-xs text-yellow-400 border border-yellow-500/20 backdrop-blur-md flex items-center gap-1">
                                            <Eye className="w-3 h-3" /> AI Preview (Mock Data)
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center p-8">
                                <div className="p-4 rounded-2xl bg-violet-500/20 text-violet-400 ring-1 ring-violet-500/50 inline-block mb-4">
                                    <BarChart className="w-10 h-10" />
                                </div>
                                <p className="text-sm text-gray-400">Unable to generate preview</p>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col justify-center text-center lg:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white">Detected: </h3>

                            <div className="relative">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-2xl font-bold text-cyan-400 bg-cyan-950/30 px-3 py-1 rounded-lg border border-cyan-500/30 hover:bg-cyan-900/50 transition-colors flex items-center gap-2"
                                >
                                    {currentResult.chartType.charAt(0).toUpperCase() + currentResult.chartType.slice(1)} Chart
                                    <ChevronDown className="w-5 h-5 opacity-50" />
                                </button>

                                {isEditing && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar">
                                        {availableTypes.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => handleTypeChange(type)}
                                                className={`w-full text-left px-4 py-2 hover:bg-cyan-500/20 hover:text-cyan-400 transition-colors ${type === currentResult.chartType ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400'}`}
                                            >
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed max-w-2xl">{currentResult.description}</p>

                        <div className="mt-4 flex flex-wrap gap-2">
                            <div className="px-3 py-1 rounded bg-white/5 text-xs text-gray-400 border border-white/10 flex items-center gap-1">
                                <Edit2 className="w-3 h-3" />
                                <span>Incorrect detection? Click the chart name to change.</span>
                            </div>
                        </div>
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
                            <span className="text-gray-400 text-sm flex items-center gap-2"><Type className="w-4 h-4" /> X-Feature</span>
                            <span className="font-mono text-white">{currentResult.extractedFeatures.xAxisLabel || "N/A"}</span>
                        </div>
                        <div className="flex justify-between p-3 rounded bg-white/5">
                            <span className="text-gray-400 text-sm flex items-center gap-2"><Type className="w-4 h-4" /> Y-Feature</span>
                            <span className="font-mono text-white">{currentResult.extractedFeatures.yAxisLabel || "N/A"}</span>
                        </div>
                        <div className="flex justify-between p-3 rounded bg-white/5">
                            <span className="text-gray-400 text-sm flex items-center gap-2"><Palette className="w-4 h-4" /> Colors detected</span>
                            <div className="flex gap-2">
                                {currentResult.extractedFeatures.colors.map((c, i) => (
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
                        {currentResult.suggestions.map((s, i) => (
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
                        <p className="text-gray-400 text-sm">Apply the detected <span className="text-cyan-400 font-bold">{currentResult.chartType}</span> style to your configured dataset.</p>
                        {!analysis && <p className="text-yellow-500 text-xs mt-2 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Please upload a dataset first to enable this feature.</p>}
                        {analysis && !compatibility.compatible &&
                            <p className="text-red-400 text-xs mt-2 flex items-center gap-2"><AlertTriangle className="w-3 h-3" /> Incompatible: {compatibility.reason}</p>
                        }
                    </div>
                    <GlowButton
                        onClick={() => onVisualize(currentResult.chartType)}
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
