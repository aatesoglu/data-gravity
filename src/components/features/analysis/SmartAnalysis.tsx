import { useState, useEffect } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import Papa from 'papaparse';

interface SmartAnalysisProps {
    data?: any[];
}

interface StatResult {
    key: string;
    isNormal: boolean;
    pValue: number;
    mean: number;
    median: number;
    stdDev: number;
}

export const SmartAnalysis = ({ data = [] }: SmartAnalysisProps) => {
    const [stats, setStats] = useState<StatResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (!data || data.length === 0) {
                setStats([]);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Convert JSON data back to CSV to send to backend (R expects CSV file)
                const csv = Papa.unparse(data);
                const blob = new Blob([csv], { type: 'text/csv' });
                const file = new File([blob], "dataset.csv", { type: "text/csv" });

                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('http://localhost:8000/analyze', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error(`Server error: ${response.statusText}`);
                }

                const result = await response.json();
                setStats(result);
            } catch (err) {
                console.error("Backend Analysis Failed:", err);
                setError("Failed to connect to R backend. Is the Python server running?");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [data]);

    if (loading) {
        return (
            <GlassCard className="border-indigo-500/30">
                <div className="flex items-center justify-center p-12 text-indigo-400 gap-3">
                    <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    Running R Statistical Analysis...
                </div>
            </GlassCard>
        );
    }

    if (error) {
        return (
            <GlassCard className="border-red-500/30">
                <div className="p-8 text-center text-red-400">
                    <p>{error}</p>
                    <p className="text-xs text-gray-500 mt-2">Please ensure `uvicorn backend.main:app --reload` is running.</p>
                </div>
            </GlassCard>
        );
    }

    if (stats.length === 0) {
        return null; // Don't show empty card
    }

    return (
        <GlassCard className="border-indigo-500/30 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
                <div className="text-[10rem] font-bold text-indigo-500 leading-none">R</div>
            </div>

            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-10 h-10 rounded bg-indigo-600 flex items-center justify-center text-xl font-bold font-mono">R</div>
                <div>
                    <h3 className="text-xl font-bold text-white">Advanced Statistical Analysis</h3>
                    <p className="text-sm text-indigo-400">Powered by R Runtime (Backend)</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                {/* Distribution Tests */}
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">DISTRIBUTION TESTS (SHAPIRO-WILK)</h4>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {stats.map(stat => (
                            <div key={stat.key} className="p-4 rounded-lg bg-gray-900/50 border border-white/5 flex items-center justify-between">
                                <span className="font-medium text-gray-300">{stat.key}</span>
                                <div className="text-right">
                                    <div className={`px-2 py-0.5 rounded text-xs font-bold border ${stat.isNormal
                                        ? 'bg-green-500/20 text-green-400 border-green-500/20'
                                        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'}`}>
                                        {stat.isNormal ? 'Normal Dist.' : 'Not Normal'}
                                    </div>
                                    <div className="text-[10px] text-gray-500 mt-1">p={stat.pValue?.toFixed(4)}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Statistics */}
                <div>
                    <h4 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">SUMMARY STATISTICS</h4>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {stats.map(stat => (
                            <div key={stat.key} className="p-4 rounded-lg bg-gray-900/50 border border-white/5">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium text-gray-300">{stat.key}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <div className="text-gray-500 text-xs">Mean</div>
                                        <div className="font-mono text-white">{stat.mean?.toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-xs">Median</div>
                                        <div className="font-mono text-white">{stat.median?.toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <div className="text-gray-500 text-xs">Std Dev</div>
                                        <div className="font-mono text-white">{stat.stdDev?.toFixed(2)}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </GlassCard>
    );
};
