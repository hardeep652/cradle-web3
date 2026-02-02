import React from 'react';
import { Bot, User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ChatMessageProps {
    role: 'bot' | 'user';
    content: React.ReactNode;
    timestamp?: string;
    animate?: boolean;
}

export function ChatMessage({ role, content, timestamp, animate = true }: ChatMessageProps) {
    return (
        <div className={twMerge(clsx(
            "flex w-full mb-6 transition-all duration-300 ease-in-out",
            role === 'user' ? "justify-end" : "justify-start",
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        ))}>
            <div className={clsx("flex max-w-[85%] md:max-w-[70%] gap-3", role === 'user' ? "flex-row-reverse" : "flex-row")}>
                <div className={clsx(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-sm",
                    role === 'bot' ? "bg-zinc-100 dark:bg-zinc-800 text-blue-600 border-zinc-200 dark:border-zinc-700" : "bg-blue-600 text-white border-blue-600"
                )}>
                    {role === 'bot' ? <Bot size={16} /> : <User size={16} />}
                </div>
                <div className={clsx("flex flex-col", role === 'user' ? "items-end" : "items-start")}>
                    <div className={clsx(
                        "py-3 px-4 rounded-2xl shadow-sm text-sm border leading-relaxed",
                        role === 'bot'
                            ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-tl-none text-zinc-800 dark:text-zinc-200"
                            : "bg-blue-600 text-white border-blue-600 rounded-tr-none"
                    )}>
                        {content}
                    </div>
                    {timestamp && <span className="text-[10px] text-zinc-400 mt-1 px-1">{timestamp}</span>}
                </div>
            </div>
        </div>
    );
}
