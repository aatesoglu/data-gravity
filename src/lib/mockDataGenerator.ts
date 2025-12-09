import type { DatasetAnalysis } from './analyzeData';
import type { ChartType } from './recommendations/recommendEngine';

export interface MockDataResult {
    data: any[];
    analysis: DatasetAnalysis;
}

export const generateMockData = (type: ChartType): MockDataResult => {
    switch (type) {
        case 'line':
        case 'area':
            return generateTimeSeriesData();
        case 'scatter':
            return generateScatterData();
        case 'pie':
            return generatePieData();
        case 'bar':
        case 'radar': // Reusing categorical logic for radar for simplicity
            return generateCategoricalData();
        case 'histogram':
            return generateDistributionData();
        case 'boxplot':
            return generateBoxPlotData();
        case 'funnel':
            return generateFunnelData();
        case 'treemap':
            return generateTreemapData();
        default:
            return generateCategoricalData();
    }
};

const generateCategoricalData = (): MockDataResult => {
    const categories = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'];
    const data = categories.map(cat => ({
        category: cat,
        value: Math.floor(Math.random() * 100) + 20
    }));

    return {
        data,
        analysis: {
            rowCount: 5,
            columns: [
                { name: 'category', type: 'categorical', unique: 5, missing: 0, sampleVal: 'Category A' },
                { name: 'value', type: 'numeric', unique: 5, min: 20, max: 120, missing: 0, sampleVal: 50 }
            ],
            summary: "Mock Categorical Data"
        }
    };
};

const generateTimeSeriesData = (): MockDataResult => {
    const data = Array.from({ length: 12 }, (_, i) => ({
        date: new Date(2023, i, 1).toISOString().split('T')[0],
        value: Math.floor(Math.random() * 500) + 100
    }));

    return {
        data,
        analysis: {
            rowCount: 12,
            columns: [
                { name: 'date', type: 'date', unique: 12, missing: 0, sampleVal: '2023-01-01' },
                { name: 'value', type: 'numeric', unique: 12, min: 100, max: 600, missing: 0, sampleVal: 250 }
            ],
            summary: "Mock Time Series Data"
        }
    };
};

const generateScatterData = (): MockDataResult => {
    const data = Array.from({ length: 30 }, (_, i) => ({
        x: Math.floor(Math.random() * 100),
        y: Math.floor(Math.random() * 100) + (i * 2) // Slight trend
    }));

    return {
        data,
        analysis: {
            rowCount: 30,
            columns: [
                { name: 'x', type: 'numeric', unique: 30, min: 0, max: 100, missing: 0, sampleVal: 50 },
                { name: 'y', type: 'numeric', unique: 30, min: 0, max: 160, missing: 0, sampleVal: 80 }
            ],
            summary: "Mock Scatter Data"
        }
    };
};

const generatePieData = (): MockDataResult => {
    const data = [
        { segment: 'Segment A', value: 40 },
        { segment: 'Segment B', value: 30 },
        { segment: 'Segment C', value: 20 },
        { segment: 'Segment D', value: 10 },
    ];

    return {
        data,
        analysis: {
            rowCount: 4,
            columns: [
                { name: 'segment', type: 'categorical', unique: 4, missing: 0, sampleVal: 'Segment A' },
                { name: 'value', type: 'numeric', unique: 4, min: 10, max: 40, missing: 0, sampleVal: 25 }
            ],
            summary: "Mock Pie Data"
        }
    };
};

const generateDistributionData = (): MockDataResult => {
    const data = Array.from({ length: 50 }, () => ({
        value: Math.floor(Math.random() * 100)
    }));

    return {
        data,
        analysis: {
            rowCount: 50,
            columns: [
                { name: 'value', type: 'numeric', unique: 40, min: 0, max: 100, missing: 0, sampleVal: 50 }
            ],
            summary: "Mock Distribution Data"
        }
    };
}

const generateBoxPlotData = (): MockDataResult => {
    const categories = ['Group A', 'Group B', 'Group C', 'Group D'];
    const data = categories.map(cat => {
        const min = Math.floor(Math.random() * 20) + 10;
        const q1 = min + Math.floor(Math.random() * 20);
        const median = q1 + Math.floor(Math.random() * 20);
        const q3 = median + Math.floor(Math.random() * 20);
        const max = q3 + Math.floor(Math.random() * 20);
        return { category: cat, min, q1, median, q3, max };
    });

    return {
        data,
        analysis: {
            rowCount: 4,
            columns: [
                { name: 'category', type: 'categorical', unique: 4, missing: 0, sampleVal: 'Group A' },
                { name: 'median', type: 'numeric', unique: 4, min: 0, max: 100, missing: 0, sampleVal: 50 }
            ],
            summary: "Mock Boxplot Data"
        }
    };
};

const generateFunnelData = (): MockDataResult => {
    const data = [
        { stage: 'Impressions', value: 1000, fill: '#8884d8' },
        { stage: 'Clicks', value: 800, fill: '#83a6ed' },
        { stage: 'Visits', value: 600, fill: '#8dd1e1' },
        { stage: 'Add to Cart', value: 400, fill: '#82ca9d' },
        { stage: 'Purchases', value: 200, fill: '#a4de6c' }
    ];
    return {
        data,
        analysis: {
            rowCount: 5,
            columns: [
                { name: 'stage', type: 'categorical', unique: 5, missing: 0, sampleVal: 'Impressions' },
                { name: 'value', type: 'numeric', unique: 5, min: 200, max: 1000, missing: 0, sampleVal: 600 }
            ],
            summary: "Mock Funnel Data"
        }
    };
};

const generateTreemapData = (): MockDataResult => {
    const data = [
        { name: 'Marketing', size: 2000 },
        { name: 'Sales', size: 1500 },
        { name: 'Development', size: 1200 },
        { name: 'HR', size: 600 },
        { name: 'Support', size: 400 },
    ];
    return {
        data: data.map(d => ({ ...d, value: d.size })),
        analysis: {
            rowCount: 5,
            columns: [
                { name: 'name', type: 'categorical', unique: 5, missing: 0, sampleVal: 'Marketing' },
                { name: 'size', type: 'numeric', unique: 5, min: 400, max: 2000, missing: 0, sampleVal: 1200 }
            ],
            summary: "Mock Treemap Data"
        }
    };
};
