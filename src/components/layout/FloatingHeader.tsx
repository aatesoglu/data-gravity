import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { clsx } from 'clsx';

interface FloatingHeaderProps {
    activeTab: string;
    onNavigate: (tab: 'home' | 'analyze' | 'recommend' | 'vision_upload') => void;
}

export const FloatingHeader = ({ activeTab, onNavigate }: FloatingHeaderProps) => {
    const navItems = [
        { id: 'analyze', label: 'Analiz' },
        { id: 'recommend', label: 'Görselleştirmek' },
        { id: 'vision_upload', label: 'Tanımak' },
    ] as const;

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
        >
            <div className="glass-panel rounded-full px-8 py-4 flex items-center gap-12 backdrop-blur-xl bg-space-900/40 border-cyan-500/20">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => onNavigate('home')}
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 animate-pulse-slow"></div>
                        <Activity className="w-6 h-6 text-cyan-400 relative z-10" />
                    </div>
                    <span className="text-lg font-bold tracking-wider text-white">
                        ANTIGRAVITY <span className="text-cyan-400">VIZ</span>
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigate(item.id)}
                            className={clsx(
                                "text-sm font-medium transition-colors relative group",
                                activeTab === item.id ? "text-cyan-400" : "text-gray-300 hover:text-cyan-400"
                            )}
                        >
                            {item.label}
                            <span className={clsx(
                                "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300",
                                activeTab === item.id ? "w-full" : "w-0 group-hover:w-full"
                            )}></span>
                        </button>
                    ))}
                </nav>

                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] animate-pulse"></div>
                    <span className="text-xs text-gray-400 uppercase tracking-widest">System Ready</span>
                </div>
            </div>
        </motion.header>
    );
};
