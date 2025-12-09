import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileType, CheckCircle, AlertCircle } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SAMPLE_CSV_DATA } from '../../../lib/sampleData';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface FileUploadZoneProps {
    onFileSelect: (file: File) => void;
}

export const FileUploadZone = ({ onFileSelect }: FileUploadZoneProps) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragActive(true);
        } else if (e.type === 'dragleave') {
            setIsDragActive(false);
        }
    }, []);

    const validateFile = (file: File) => {
        const validTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        if (!validTypes.includes(file.type) && !file.name.endsWith('.csv')) {
            setError('Invalid file format. Please upload CSV or Excel.');
            return false;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setError('File size too large. Max 10MB.');
            return false;
        }
        return true;
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        setError(null);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (validateFile(file)) {
                onFileSelect(file);
            }
        }
    }, [onFileSelect]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setError(null);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                onFileSelect(file);
            }
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <motion.div
                animate={isDragActive ? { scale: 1.02 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
            >
                <GlassCard
                    className={cn(
                        "relative border-2 border-dashed transition-colors duration-300 flex flex-col items-center justify-center p-12 min-h-[400px]",
                        isDragActive ? "border-cyan-400 bg-cyan-400/5" : "border-slate-700 hover:border-cyan-500/30",
                        error ? "border-red-500/50" : ""
                    )}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    hoverEffect={false}
                >
                    <input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                        onChange={handleChange}
                        accept=".csv, .xls, .xlsx"
                    />

                    <AnimatePresence mode="wait">
                        {error ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                                    <AlertCircle className="w-10 h-10 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-red-400 mb-2">Upload Failed</h3>
                                <p className="text-gray-400">{error}</p>
                                <p className="text-sm text-gray-500 mt-4">Try again</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="default"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center"
                            >
                                <div className="relative w-24 h-24 mx-auto mb-8">
                                    {isDragActive && (
                                        <motion.div
                                            className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 rounded-full"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        />
                                    )}
                                    <div className="w-full h-full rounded-full bg-space-800 flex items-center justify-center border border-white/10 relative z-10">
                                        <Upload className={cn("w-10 h-10 transition-colors duration-300", isDragActive ? "text-cyan-400" : "text-gray-400")} />
                                    </div>

                                    {/* Floating Icons */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 3, delay: 0 }}
                                        className="absolute -right-4 -top-2 bg-space-900 border border-white/10 p-2 rounded-lg"
                                    >
                                        <FileType className="w-4 h-4 text-green-400" />
                                    </motion.div>
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 4, delay: 1 }}
                                        className="absolute -left-4 top-10 bg-space-900 border border-white/10 p-2 rounded-lg"
                                    >
                                        <div className="text-[10px] font-mono text-blue-400">CSV</div>
                                    </motion.div>
                                </div>

                                <h3 className="text-2xl font-bold mb-3 text-white">
                                    {isDragActive ? "Drop it here!" : "Drag & Drop Data File"}
                                </h3>
                                <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                                    Support for CSV, Excel (.xlsx, .xls).
                                    Our engine will auto-detect formats.
                                </p>
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                                    <CheckCircle className="w-4 h-4 text-cyan-500" />
                                    <span>Secure Local Processing</span>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        const file = new File([SAMPLE_CSV_DATA], "sample_data.csv", { type: "text/csv" });
                                        onFileSelect(file);
                                    }}
                                    className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-cyan-400 transition-colors"
                                >
                                    Or try with Sample Data
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </GlassCard>
            </motion.div>
        </div>
    );
};
