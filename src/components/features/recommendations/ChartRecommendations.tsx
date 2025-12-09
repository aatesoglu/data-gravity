import { GlassCard } from '../../ui/GlassCard';
import type { ChartRecommendation } from '../../../lib/recommendations/recommendEngine';
import { BarChart, LineChart, ScatterChart, PieChart, Activity, Box, Grid } from 'lucide-react';
import { GlowButton } from '../../ui/GlowButton';
import { getChartImage } from '../../../lib/chartGallery';

interface ChartRecommendationsProps {
    recommendations: ChartRecommendation[];
    onSelect: (rec: ChartRecommendation) => void;
}

const ChartIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'bar': return <BarChart className="w-8 h-8 text-cyan-400" />;
        case 'line': return <LineChart className="w-8 h-8 text-violet-400" />;
        case 'area': return <Activity className="w-8 h-8 text-pink-400" />;
        case 'scatter': return <ScatterChart className="w-8 h-8 text-green-400" />;
        case 'pie': return <PieChart className="w-8 h-8 text-orange-400" />;
        case 'boxplot': return <Box className="w-8 h-8 text-yellow-400" />;
        default: return <Grid className="w-8 h-8 text-gray-400" />;
    }
};

export const ChartRecommendations = ({ recommendations, onSelect }: ChartRecommendationsProps) => {
    return (
        <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <span className="w-2 h-10 bg-cyan-500 rounded-full" />
                AI Recommended Visualizations
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec, index) => (
                    <GlassCard
                        key={rec.type}
                        className={`cursor-pointer group relative overflow-hidden ${index === 0 ? 'border-cyan-500/50' : ''}`}
                        onClick={() => onSelect(rec)}
                    >
                        {/* Background Image Layer */}
                        <div className="absolute inset-0 z-0">
                            <img
                                src={getChartImage(rec.type)}
                                alt={rec.title}
                                className="w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 ease-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/80 to-gray-900 border-b border-white/5" />
                        </div>

                        <div className="relative z-10 flex flex-col h-full">
                            {index === 0 && (
                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-cyan-500/20">
                                    TOP MATCH
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors backdrop-blur-md border border-white/5">
                                    <ChartIcon type={rec.type} />
                                </div>
                                <div className="text-2xl font-bold font-mono text-cyan-400 group-hover:text-cyan-300 transition-colors">
                                    {rec.score}%
                                </div>
                            </div>

                            <h3 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors">
                                {rec.title}
                            </h3>
                            <p className="text-gray-400 text-sm mb-6 h-10 line-clamp-2">
                                {rec.description}
                            </p>

                            <div className="mt-auto">
                                <GlowButton
                                    variant="ghost"
                                    className="w-full justify-center group-hover:bg-cyan-500/20 border-white/10"
                                >
                                    Visualize
                                </GlowButton>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    );
};
