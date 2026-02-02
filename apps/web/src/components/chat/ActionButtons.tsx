import React from 'react';
import { Loader2, ExternalLink, RefreshCw, Play } from 'lucide-react';
import { SetupStep } from '@/types';
import { clsx } from 'clsx';

interface ActionButtonsProps {
    step: SetupStep;
    isLoading: boolean;
    onAction: (action: 'generate_agent' | 'generate_link' | 'create_agent') => void;
    disabled?: boolean;
}

export function ActionButtons({ step, isLoading, onAction, disabled }: ActionButtonsProps) {
    const baseClass = "flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95 shadow-sm";
    const primaryClass = "bg-blue-600 hover:bg-blue-700 text-white border border-transparent";

    if (isLoading) {
        return (
            <div className="flex items-center gap-3 text-sm text-zinc-500 animate-pulse">
                <Loader2 className="animate-spin text-blue-600" size={16} />
                <span>Processing...</span>
            </div>
        );
    }

    switch (step) {
        case 'idle':
            return (
                <button
                    onClick={() => onAction('generate_agent')}
                    disabled={disabled || isLoading}
                    className={clsx(baseClass, primaryClass)}
                >
                    <Play size={16} className="fill-current" />
                    Start Setup
                </button>
            );

        case 'agent':
            return (
                <button
                    onClick={() => onAction('generate_link')}
                    disabled={disabled || isLoading}
                    className={clsx(baseClass, primaryClass)}
                >
                    <ExternalLink size={16} />
                    Link Telegram
                </button>
            );

        case 'telegram-link':
            return (
                <div className="text-zinc-500 text-sm flex items-center gap-2">
                    <Loader2 className="animate-spin text-blue-600" size={16} />
                    Waiting for Telegram connection...
                </div>
            );

        case 'telegram-connect':
            return (
                <div className="text-zinc-500 text-sm flex items-center gap-2">
                    <Loader2 className="animate-spin text-blue-600" size={16} />
                    Verifying connection...
                </div>
            );

        case 'create-agent':
            return (
                <button
                    onClick={() => onAction('create_agent')}
                    disabled={disabled || isLoading}
                    className={clsx(baseClass, primaryClass)}
                >
                    <RefreshCw size={16} />
                    Confirm & Create Agent
                </button>
            );

        case 'complete':
            return (
                <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium border border-green-100 dark:border-green-900/50">
                    Setup Complete
                </div>
            )

        default:
            return null;
    }
}
