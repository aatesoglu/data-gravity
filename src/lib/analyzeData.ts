export interface ColumnAnalysis {
    name: string;
    type: 'numeric' | 'categorical' | 'date' | 'unknown';
    missing: number;
    unique: number;
    min?: number;
    max?: number;
    mean?: number;
    median?: number;
    sampleVal: any;
}

export interface DatasetAnalysis {
    rowCount: number;
    columnCount: number;
    columns: ColumnAnalysis[];
    completenessScore: number; // 0-100
}

export const analyzeDataset = (data: any[], columns: string[]): DatasetAnalysis => {
    const rowCount = data.length;
    const colAnalysis: ColumnAnalysis[] = [];

    columns.forEach(col => {
        const values = data.map(d => d[col]).filter(v => v !== null && v !== undefined && v !== '');
        const missingCount = rowCount - values.length;
        const uniqueCount = new Set(values).size;

        // Type Inference
        let type: ColumnAnalysis['type'] = 'unknown';
        const sample = values[0];

        // Check if numeric
        const isNumeric = values.every(v => !isNaN(Number(v)));
        if (isNumeric && values.length > 0) type = 'numeric';

        // Check if date (simple check)
        if (type === 'unknown' && values.length > 0) {
            const isDate = !isNaN(Date.parse(String(sample)));
            if (isDate) type = 'date';
        }

        // Default to categorical
        if (type === 'unknown') type = 'categorical';

        const colResult: ColumnAnalysis = {
            name: col,
            type,
            missing: missingCount,
            unique: uniqueCount,
            sampleVal: sample
        };

        if (type === 'numeric') {
            const nums = values.map(v => Number(v)).sort((a, b) => a - b);
            colResult.min = nums[0];
            colResult.max = nums[nums.length - 1];
            colResult.mean = nums.reduce((a, b) => a + b, 0) / nums.length;
            colResult.median = nums[Math.floor(nums.length / 2)];
        }

        colAnalysis.push(colResult);
    });

    const totalCells = rowCount * columns.length;
    const totalMissing = colAnalysis.reduce((acc, col) => acc + col.missing, 0);
    const completeness = totalCells > 0 ? Math.round(((totalCells - totalMissing) / totalCells) * 100) : 0;

    return {
        rowCount,
        columnCount: columns.length,
        columns: colAnalysis,
        completenessScore: completeness
    };
};
