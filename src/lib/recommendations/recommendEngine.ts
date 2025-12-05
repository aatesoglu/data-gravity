import type { DatasetAnalysis } from '../analyzeData';

export type ChartType =
    | 'bar' | 'line' | 'area' | 'scatter' | 'pie'
    | 'histogram' | 'boxplot' | 'heatmap' | 'radar';

export interface ChartRecommendation {
    type: ChartType;
    score: number; // 0-100
    title: string;
    description: string;
    requiredChannels: {
        x: 'numeric' | 'categorical' | 'date';
        y: 'numeric' | 'categorical';
        z?: 'numeric'; // e.g. for bubble size
    };
}

export const recommendCharts = (analysis: DatasetAnalysis): ChartRecommendation[] => {
    const numericCols = analysis.columns.filter(c => c.type === 'numeric');
    const categoricalCols = analysis.columns.filter(c => c.type === 'categorical');
    const dateCols = analysis.columns.filter(c => c.type === 'date');
    const recs: ChartRecommendation[] = [];

    // --- 1. Evolution (Time Series) ---
    if (dateCols.length > 0 && numericCols.length > 0) {
        if (analysis.rowCount > 20) {
            recs.push({
                type: 'line',
                score: 95,
                title: 'Time Series Line Chart',
                description: `Ideal for tracking ${numericCols[0].name} over time.`,
                requiredChannels: { x: 'date', y: 'numeric' }
            });
            recs.push({
                type: 'area',
                score: 90,
                title: 'Area Trend Chart',
                description: 'Emphasizes the magnitude of change over time.',
                requiredChannels: { x: 'date', y: 'numeric' }
            });
        }
    }

    // --- 2. Distribution (Single Variable) ---
    if (numericCols.length > 0) {
        recs.push({
            type: 'histogram',
            score: 80,
            title: 'Distribution Histogram',
            description: `Analyze the frequency distribution of ${numericCols[0].name}.`,
            requiredChannels: { x: 'numeric', y: 'numeric' } // Self-aggregation
        });

        // Boxplot requires more data points to be meaningful
        if (analysis.rowCount > 10) {
            recs.push({
                type: 'boxplot',
                score: 75,
                title: 'Box & Whisker Plot',
                description: 'Detect outliers and quartiles.',
                requiredChannels: { x: 'numeric', y: 'numeric' }
            });
        }
    }

    // --- 3. Correlation (Two Numerics) ---
    if (numericCols.length >= 2) {
        const score = analysis.rowCount > 50 ? 95 : 70;
        recs.push({
            type: 'scatter',
            score: score,
            title: 'Scatter Plot Analysis',
            description: `Investigate relationship between ${numericCols[0].name} and ${numericCols[1].name}.`,
            requiredChannels: { x: 'numeric', y: 'numeric' }
        });
    }

    // --- 4. Ranking / Part-of-Whole (Categorical + Numeric) ---
    if (categoricalCols.length > 0 && numericCols.length > 0) {
        const uniqueCount = categoricalCols[0].unique;

        // Bar Chart
        if (uniqueCount < 20) {
            recs.push({
                type: 'bar',
                score: 90,
                title: 'Categorical Bar Chart',
                description: `Compare ${numericCols[0].name} across ${categoricalCols[0].name}.`,
                requiredChannels: { x: 'categorical', y: 'numeric' }
            });
        }

        // Pie Chart (Only for few categories)
        if (uniqueCount < 6) {
            recs.push({
                type: 'pie',
                score: 60, // Lower score due to general best practices
                title: 'Pie Chart Composition',
                description: 'Show part-to-whole contribution.',
                requiredChannels: { x: 'categorical', y: 'numeric' }
            });
        }

        // Radar Chart
        if (uniqueCount > 3 && uniqueCount < 10 && numericCols.length > 2) {
            recs.push({
                type: 'radar',
                score: 70,
                title: 'Radar Comparison',
                description: 'Compare multiple variables across categories.',
                requiredChannels: { x: 'categorical', y: 'numeric' }
            });
        }
    }

    return recs.sort((a, b) => b.score - a.score);
};

export const checkChartCompatibility = (analysis: DatasetAnalysis | null, chartType: ChartType): { compatible: boolean; reason?: string } => {
    if (!analysis) return { compatible: false, reason: "No dataset loaded" };

    const numericCols = analysis.columns.filter(c => c.type === 'numeric');
    const categoricalCols = analysis.columns.filter(c => c.type === 'categorical');
    const dateCols = analysis.columns.filter(c => c.type === 'date');

    switch (chartType) {
        case 'line':
        case 'area':
            if (dateCols.length === 0) return { compatible: false, reason: "Requires a Date column (Time Series)" };
            if (numericCols.length === 0) return { compatible: false, reason: "Requires at least 1 Numeric column" };
            return { compatible: true };

        case 'bar':
        case 'pie':
        case 'radar':
            if (categoricalCols.length === 0) return { compatible: false, reason: "Requires a Categorical column" };
            if (numericCols.length === 0) return { compatible: false, reason: "Requires a Numeric column" };
            return { compatible: true };

        case 'scatter':
            if (numericCols.length < 2) return { compatible: false, reason: "Requires at least 2 Numeric columns" };
            return { compatible: true };

        case 'histogram':
        case 'boxplot':
            if (numericCols.length === 0) return { compatible: false, reason: "Requires a Numeric column" };
            return { compatible: true };

        default:
            return { compatible: true };
    }
};
