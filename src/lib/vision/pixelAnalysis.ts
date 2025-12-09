import type { ChartType } from '../recommendations/recommendEngine';

/**
 * Analyzes an image file using HTML Canvas to detect chart patterns using 
 * simulated Computer Vision heuristics (Color, Density, Geometry).
 * @param file The uploaded image file
 * @returns Predicted chart type
 */
export const analyzeChartPixelData = async (file: File): Promise<ChartType> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);

        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                // resize to small dimension for processing speed and normalized data
                const size = 100;
                canvas.width = size;
                canvas.height = size;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    URL.revokeObjectURL(objectUrl);
                    resolve('bar'); // Fallback
                    return;
                }

                // Draw image to canvas
                ctx.drawImage(img, 0, 0, size, size);
                const imageData = ctx.getImageData(0, 0, size, size);
                const data = imageData.data;

                URL.revokeObjectURL(objectUrl);

                const result = runPixelHeuristics(data, size);
                resolve(result);
            } catch (e) {
                console.error("Pixel analysis failed", e);
                resolve('bar');
            }
        };

        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            resolve('bar');
        };

        img.src = objectUrl;
    });
};

const runPixelHeuristics = (data: Uint8ClampedArray, size: number): ChartType => {
    // 1. Analyze Density & Spatial Distribution
    const { inkDensity, centerDensity, cornerDensity, bottomDensity } = analyzeDensity(data, size);

    // 2. Analyze Color Diversity (number of distinct hues)
    const { colorCount, dominantHue } = analyzeColors(data, size);

    console.log(`AI Vision Scan: Ink=${inkDensity.toFixed(2)}, Center=${centerDensity.toFixed(2)}, Corners=${cornerDensity.toFixed(2)}, Colors=${colorCount}`);

    // --- DECISION TREE (Heuristics) ---

    // 1. PIE CHART Detection
    // Characteristics: High center density, low corner density (circular), usually multiple colors.
    if (centerDensity > 0.4 && cornerDensity < 0.1) {
        // High confidence for Pie
        return 'pie';
    }

    // 2. RADAR CHART Detection
    // Characteristics: Center heavy but typically less filled than Pie, spiky shape.
    if (centerDensity > 0.25 && centerDensity <= 0.4 && cornerDensity < 0.15) {
        return 'radar';
    }

    // 3. SCATTER PLOT Detection
    // Characteristics: Very low global ink density (sparse dots), often mono-color or dual-color.
    if (inkDensity < 0.12) {
        return 'scatter';
    }

    // 4. LINE CHART Detection
    // Characteristics: Low ink density (thin lines), often single primary color.
    if (inkDensity >= 0.12 && inkDensity < 0.22) {
        return 'line';
    }

    // 5. AREA CHART Detection
    // Characteristics: High global ink density (filled areas below lines).
    if (inkDensity > 0.35) {
        return 'area';
    }

    // 6. BOXPLOT vs HISTOGRAM vs BAR
    // Usually moderate density (0.22 - 0.35). distinguish by color and structure.

    // Histogram: Often mono-colored bars touching each other.
    if (colorCount <= 1 && bottomDensity > inkDensity * 1.5) {
        return 'histogram';
    }

    // Boxplot: Specific sparse rectangular structures.
    if (colorCount <= 1 && inkDensity < 0.28) {
        return 'boxplot';
    }

    // Bar Chart: Multi-colored bars or separated columns. Default fallback.
    return 'bar';
};

const analyzeDensity = (data: Uint8ClampedArray, size: number) => {
    let totalInk = 0;
    let centerInk = 0;
    let cornerInk = 0;
    let bottomInk = 0;

    const centerStart = size * 0.25;
    const centerEnd = size * 0.75;
    const bottomStart = size * 0.8;

    // Background approximate (top-left pixel)
    const bgR = data[0];
    const bgG = data[1];
    const bgB = data[2];

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const idx = (y * size + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Is pixel 'ink' (different from bg)?
            const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
            if (diff > 30) {
                totalInk++;

                // Center Check
                if (x > centerStart && x < centerEnd && y > centerStart && y < centerEnd) centerInk++;

                // Corner Check
                const isCorner = (x < 10 && y < 10) || (x > 90 && y < 10) || (x < 10 && y > 90) || (x > 90 && y > 90);
                if (isCorner) cornerInk++;

                // Bottom Check (X-Axis area)
                if (y > bottomStart) bottomInk++;
            }
        }
    }

    const totalPixels = size * size;
    return {
        inkDensity: totalInk / totalPixels,
        centerDensity: centerInk / (totalPixels * 0.25),
        cornerDensity: cornerInk / (totalPixels * 0.04),
        bottomDensity: bottomInk / (totalPixels * 0.2)
    };
};

const analyzeColors = (data: Uint8ClampedArray, size: number) => {
    const hues = new Set<number>();

    // Sample pixels (every 5th pixel for speed)
    for (let i = 0; i < data.length; i += 20) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Skip white/black/gray
        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);
        if (max - min < 30 || max < 50 || min > 240) continue;

        // Simple Hue calc
        let h = 0;
        if (max === r) h = (g - b) / (max - min);
        else if (max === g) h = 2 + (b - r) / (max - min);
        else h = 4 + (r - g) / (max - min);

        h *= 60;
        if (h < 0) h += 360;

        // Buckets of 30 degrees
        hues.add(Math.floor(h / 30));
    }

    return {
        colorCount: hues.size,
        dominantHue: 0 // Placeholder
    };
};
