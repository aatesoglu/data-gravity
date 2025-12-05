import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface GlowButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'ghost';
    icon?: React.ReactNode;
}

export const GlowButton = ({ className, variant = 'primary', icon, children, ...props }: GlowButtonProps) => {
    const variants = {
        primary: "bg-cyan-500/10 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]",
        secondary: "bg-violet-500/10 text-violet-400 border-violet-500/50 hover:bg-violet-500/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]",
        ghost: "bg-transparent text-gray-300 border-transparent hover:text-white hover:bg-white/5"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "relative px-6 py-3 rounded-xl border font-semibold transition-all duration-300 flex items-center gap-2",
                variants[variant],
                className
            )}
            {...props}
        >
            {icon && <span className="relative z-10">{icon}</span>}
            <span className="relative z-10">{children as React.ReactNode}</span>
        </motion.button>
    );
};
