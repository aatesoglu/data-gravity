
import barChart from '../assets/charts/bar_chart_preview_1765091819166.png';
import lineChart from '../assets/charts/line_chart_preview_1765091832998.png';
import scatterChart from '../assets/charts/scatter_chart_preview_1765091845619.png';
import areaChart from '../assets/charts/area_chart_preview_1765091865614.png';
import pieChart from '../assets/charts/pie_chart_preview_1765091880145.png';
import histogramChart from '../assets/charts/histogram_chart_preview_1765091895608.png';
import boxplotChart from '../assets/charts/boxplot_chart_preview_1765091910165.png';
import radarChart from '../assets/charts/radar_chart_preview_1765091924921.png';
import type { ChartType } from './recommendations/recommendEngine';

export interface ChartGalleryItem {
    type: ChartType;
    image: string;
    description: string;
    features: string[];
}

export const CHART_GALLERY: Record<string, ChartGalleryItem> = {
    bar: {
        type: 'bar',
        image: barChart,
        description: 'Comparison of categorical data values',
        features: ['Categorical X', 'Numeric Y']
    },
    line: {
        type: 'line',
        image: lineChart,
        description: 'Tracking trends over time or continuous intervals',
        features: ['Time/Numeric X', 'Numeric Y']
    },
    area: {
        type: 'area',
        image: areaChart,
        description: 'Visualizing volume or magnitude trend over time',
        features: ['Time X', 'Numeric Volume']
    },
    scatter: {
        type: 'scatter',
        image: scatterChart,
        description: 'Analyzing correlation between two variables',
        features: ['Numeric X', 'Numeric Y']
    },
    pie: {
        type: 'pie',
        image: pieChart,
        description: 'Showing part-to-whole proportions',
        features: ['Categorical Categories', 'Proportions']
    },
    histogram: {
        type: 'histogram',
        image: histogramChart,
        description: 'Understanding distribution frequency',
        features: ['Binned Ranges', 'Frequency Count']
    },
    boxplot: {
        type: 'boxplot',
        image: boxplotChart,
        description: 'Summary of statistical distribution and outliers',
        features: ['Quartiles', 'Median', 'Outliers']
    },
    radar: {
        type: 'radar',
        image: radarChart,
        description: 'Multivariate comparison of entities',
        features: ['Multiple Axes', 'Polygon Area']
    }
};

export const getChartImage = (type: string) => {
    return CHART_GALLERY[type]?.image || CHART_GALLERY['bar'].image; // Default fallback
}
