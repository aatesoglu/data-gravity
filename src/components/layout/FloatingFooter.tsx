import { motion } from 'framer-motion';

export const FloatingFooter = () => {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none"
        >
            <div className="glass-panel px-6 py-2 rounded-full flex items-center gap-6 pointer-events-auto bg-space-900/20">
                <span className="text-xs text-gray-500">
                    Powered by <span className="text-cyan-400 font-semibold">Gemini 2.0</span>
                </span>
                <div className="h-3 w-[1px] bg-white/10"></div>
                <span className="text-xs text-gray-500">v1.0.0-alpha</span>
            </div>
        </motion.footer>
    );
};
