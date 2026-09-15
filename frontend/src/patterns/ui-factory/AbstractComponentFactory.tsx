'use client';
import React from 'react';
import { cn } from '@/lib/utils';

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export interface ICardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowEffect?: boolean;
}

export interface IBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'sale' | 'featured' | 'stock';
  children: React.ReactNode;
}

export interface IUIComponentFactory {
  createButton(props: IButtonProps): React.ReactElement;
  createCard(props: ICardProps): React.ReactElement;
  createBadge(props: IBadgeProps): React.ReactElement;
}

export class GlassmorphicUIFactory implements IUIComponentFactory {
  createButton({ variant = 'primary', size = 'md', className, children, ...props }: IButtonProps) {
    const sizeClasses = {
      sm: 'px-3.5 py-1.5 text-xs font-semibold',
      md: 'px-5 py-2.5 text-sm font-bold',
      lg: 'px-7 py-3.5 text-base font-bold',
    }[size];

    const variantClasses = {
      primary: 'bg-stone-900 text-stone-100 hover:bg-stone-800 dark:bg-gradient-to-r dark:from-indigo-500 dark:via-purple-500 dark:to-pink-500 dark:text-white shadow-md hover:scale-[1.02] active:scale-[0.98]',
      secondary: 'bg-stone-200/80 text-stone-800 hover:bg-stone-300 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-700/90 border border-stone-300 dark:border-slate-700/60',
      outline: 'bg-white/60 dark:bg-white/5 border border-stone-300 dark:border-white/15 text-stone-800 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-white/10 hover:border-stone-400 dark:hover:border-white/30',
      ghost: 'bg-transparent text-stone-600 hover:text-stone-900 dark:text-slate-400 dark:hover:text-white hover:bg-stone-200/50 dark:hover:bg-white/5',
      glow: 'bg-stone-900 text-stone-100 shadow-md dark:bg-indigo-600 dark:text-white dark:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:scale-[1.02]',
    }[variant];

    return (
      <button
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none',
          sizeClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }

  createCard({ children, className, glowEffect = false, ...props }: ICardProps) {
    return (
      <div
        className={cn(
          'relative rounded-2xl glass-panel transition-all duration-300',
          glowEffect ? 'hover:border-stone-400 dark:hover:border-indigo-500/40 hover:shadow-lg dark:hover:shadow-glow-brand' : 'hover:border-stone-400 dark:hover:border-white/20',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  createBadge({ variant = 'default', children, className, ...props }: IBadgeProps) {
    const variantClasses = {
      default: 'bg-stone-200/80 text-stone-800 border-stone-300 dark:bg-slate-800/80 dark:text-slate-300 dark:border-white/10',
      sale: 'bg-rose-500/10 text-rose-700 border-rose-500/20 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30',
      featured: 'bg-amber-500/15 text-amber-800 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30',
      stock: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30',
    }[variant];

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase border backdrop-blur-md',
          variantClasses,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
}

export const UIComponentFactory = new GlassmorphicUIFactory();

export const Button = (props: IButtonProps) => UIComponentFactory.createButton(props);
export const Card = (props: ICardProps) => UIComponentFactory.createCard(props);
export const Badge = (props: IBadgeProps) => UIComponentFactory.createBadge(props);
