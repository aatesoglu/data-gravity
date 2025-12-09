import type { ChartType } from './recommendations/recommendEngine';
import { analyzeChartPixelData } from './vision/pixelAnalysis';

export interface VisionResult {
    chartType: ChartType;
    confidence: number;
    description: string;
    extractedFeatures: {
        title?: string;
        xAxisLabel?: string;
        yAxisLabel?: string;
        colors: string[];
        dataCount?: number;
    };
    suggestions: string[];
}

export const analyzeImage = async (file: File): Promise<VisionResult> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let detectedType: ChartType = 'bar'; // Default
    const name = file.name.toLowerCase();

    // 1. Filename Heuristics (Highest Priority for reliability)
    if (name.includes('pie')) detectedType = 'pie';
    else if (name.includes('line')) detectedType = 'line';
    else if (name.includes('scatter')) detectedType = 'scatter';
    else if (name.includes('area')) detectedType = 'area';
    else if (name.includes('radar')) detectedType = 'radar';
    else if (name.includes('hist')) detectedType = 'histogram';
    else if (name.includes('box')) detectedType = 'boxplot';
    else if (name.includes('funnel')) detectedType = 'funnel';
    else if (name.includes('tree')) detectedType = 'treemap';
    else if (name.includes('bar')) detectedType = 'bar';
    else {
        // 2. Fallback to Pixel Analysis
        detectedType = await analyzeChartPixelData(file);
    }

    console.log(`Vision Service: Detected ${detectedType} from image content (Name: ${name}).`);

    // Generate context-aware mock response based on the visual detection
    return generateMockResponse(detectedType);
};

export const generateMockResponse = (type: ChartType): VisionResult => {
    const baseResponse = {
        confidence: 0.85 + Math.random() * 0.14, // 0.85 - 0.99
    };

    switch (type) {
        case 'bar':
            return {
                ...baseResponse,
                chartType: 'bar',
                description: "Detected a bar chart comparing categorical data across multiple groups.",
                extractedFeatures: {
                    title: "Comparative Analysis",
                    xAxisLabel: "Categories",
                    yAxisLabel: "Values",
                    colors: ["#06b6d4", "#3b82f6", "#6366f1"],
                    dataCount: 5
                },
                suggestions: [
                    "Consider sorting bars by value for better readability.",
                    "Ensure varied colors are accessible."
                ]
            };
        case 'line':
            return {
                ...baseResponse,
                chartType: 'line',
                description: "Detected a line chart showing trends over a continuous period.",
                extractedFeatures: {
                    title: "Trend Over Time",
                    xAxisLabel: "Time Period",
                    yAxisLabel: "Metric Value",
                    colors: ["#8b5cf6"],
                    dataCount: 12
                },
                suggestions: [
                    "Use a thicker line weight for the primary trend.",
                    "Consider adding markers for data points if few."
                ]
            };
        case 'scatter':
            return {
                ...baseResponse,
                chartType: 'scatter',
                description: "Detected a scatter plot analyzing the correlation between two variables.",
                extractedFeatures: {
                    title: "Correlation Study",
                    xAxisLabel: "Variable X",
                    yAxisLabel: "Variable Y",
                    colors: ["#10b981"],
                    dataCount: 50
                },
                suggestions: [
                    "Check for outliers in the top-right quadrant.",
                    "Consider a trend line to emphasize correlation."
                ]
            };
        case 'pie':
            return {
                ...baseResponse,
                chartType: 'pie',
                description: "Detected a pie chart illustrating part-to-whole proportions.",
                extractedFeatures: {
                    title: "Segment Distribution",
                    xAxisLabel: "N/A",
                    yAxisLabel: "N/A",
                    colors: ["#f472b6", "#c084fc", "#60a5fa"],
                    dataCount: 4
                },
                suggestions: [
                    "Ensure segments sum to 100%.",
                    "Limit to 5-7 slices for legibility."
                ]
            };
        case 'area':
            return {
                ...baseResponse,
                chartType: 'area',
                description: "Detected an area chart showing volume trends over time.",
                extractedFeatures: {
                    title: "Volume Growth",
                    xAxisLabel: "Date",
                    yAxisLabel: "Volume",
                    colors: ["#ec4899"],
                    dataCount: 10
                },
                suggestions: [
                    "Use transparency to show underlying grid."
                ]
            };
        case 'radar':
            return {
                ...baseResponse,
                chartType: 'radar',
                description: "Detected a radar chart comparing multiple variables.",
                extractedFeatures: {
                    title: "Multi-Variable Comparison",
                    xAxisLabel: "Variables",
                    yAxisLabel: "Score",
                    colors: ["#00D9FF"],
                    dataCount: 6
                },
                suggestions: [
                    "Ensure all axes use the same scale.",
                    "Use fill opacity to show overlap."
                ]
            };
        case 'histogram':
            return {
                ...baseResponse,
                chartType: 'histogram',
                description: "Detected a histogram showing the distribution of a single variable.",
                extractedFeatures: {
                    title: "Distribution analysis",
                    xAxisLabel: "Bins",
                    yAxisLabel: "Frequency",
                    colors: ["#8B5CF6"],
                    dataCount: 8
                },
                suggestions: [
                    "Adjust bin size for clearer distribution steps.",
                    "Check for skewness in the tail."
                ]
            };
        case 'boxplot':
            return {
                ...baseResponse,
                chartType: 'boxplot',
                description: "Detected a box plot summarizing statistical distribution (median, quartiles).",
                extractedFeatures: {
                    title: "Statistical Summary",
                    xAxisLabel: "Groups",
                    yAxisLabel: "Values",
                    colors: ["#00D9FF"],
                    dataCount: 4
                },
                suggestions: [
                    "Highlight outliers individually.",
                    "Compare medians across groups."
                ]
            };
        case 'funnel':
            return {
                ...baseResponse,
                chartType: 'funnel',
                description: "Detected a funnel chart showing process stages and conversion.",
                extractedFeatures: {
                    title: "Conversion Funnel",
                    xAxisLabel: "Stage",
                    yAxisLabel: "Users",
                    colors: ["#8884d8"],
                    dataCount: 5
                },
                suggestions: [
                    "Ensure stage order is logical.",
                    "Highlight drop-off rates."
                ]
            };
        case 'treemap':
            return {
                ...baseResponse,
                chartType: 'treemap',
                description: "Detected a treemap visualizing data proportions as nested rectangles.",
                extractedFeatures: {
                    title: "Category Distribution",
                    xAxisLabel: "Category",
                    yAxisLabel: "Size",
                    colors: ["#8884d8"],
                    dataCount: 6
                },
                suggestions: [
                    "Use contrasting colors for categories.",
                    "Ensure labels are legible."
                ]
            };
        default:
            return {
                ...baseResponse,
                chartType: type,
                description: `Detected a ${type} chart visualization.`,
                extractedFeatures: {
                    title: "Data Visualization",
                    xAxisLabel: "X-Axis",
                    yAxisLabel: "Y-Axis",
                    colors: ["#cbd5e1"],
                    dataCount: 8
                },
                suggestions: [
                    "Ensure clear labels and title."
                ]
            };
    }
};
