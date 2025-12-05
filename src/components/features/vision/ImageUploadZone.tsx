import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Scan, CheckCircle, AlertCircle } from 'lucide-react';
import { GlassCard } from '../../ui/GlassCard';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility helper to avoid duplicate declaration
function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

interface ImageUploadZoneProps {
    onImageSelect: (file: File) => void;
}

export const ImageUploadZone = ({ onImageSelect }: ImageUploadZoneProps) => {
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
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            setError('Invalid format. Please upload PNG, JPG or SVG.');
            return false;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('File size too large. Max 5MB.');
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
                onImageSelect(file);
            }
        }
    }, [onImageSelect]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (validateFile(file)) {
                onImageSelect(file);
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
                        isDragActive ? "border-violet-400 bg-violet-400/5" : "border-slate-700 hover:border-violet-500/30",
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
                        accept=".png, .jpg, .jpeg, .svg"
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
                                <h3 className="text-xl font-bold text-red-400 mb-2">Scan Failed</h3>
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
                                            className="absolute inset-0 bg-violet-500 blur-xl opacity-20 rounded-full"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        />
                                    )}
                                    <div className="w-full h-full rounded-full bg-space-800 flex items-center justify-center border border-white/10 relative z-10">
                                        <ImageIcon className={cn("w-10 h-10 transition-colors duration-300", isDragActive ? "text-violet-400" : "text-gray-400")} />
                                    </div>

                                    {/* Floating Scanner Effect */}
                                    <motion.div
                                        animate={{ y: [0, 40, 0], opacity: [0.5, 1, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 2.5 }}
                                        className="absolute inset-x-0 h-1 bg-cyan-400 top-4 blur-[2px] shadow-[0_0_15px_rgba(34,211,238,0.8)] z-20"
                                    />

                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 3, delay: 0 }}
                                        className="absolute -right-4 -top-2 bg-space-900 border border-white/10 p-2 rounded-lg"
                                    >
                                        <Scan className="w-4 h-4 text-cyan-400" />
                                    </motion.div>
                                </div>

                                <h3 className="text-2xl font-bold mb-3 text-white">
                                    {isDragActive ? "Drop Image to Scan" : "Drag & Drop Chart Image"}
                                </h3>
                                <p className="text-gray-400 mb-6 max-w-sm mx-auto">
                                    Upload existing visualizations. Our AI will analyze types, colors, and data patterns.
                                </p>
                                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                                    <CheckCircle className="w-4 h-4 text-violet-500" />
                                    <span>Powered by Vision API</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </GlassCard>
            </motion.div>
        </div>
    );
};
