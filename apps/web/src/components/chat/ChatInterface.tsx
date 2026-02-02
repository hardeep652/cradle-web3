'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useAccount } from 'wagmi';
import { useLazyTraderSetup } from '@/hooks';
import { ChatMessage } from './ChatMessage';
import { ActionButtons } from './ActionButtons';
import { WalletButton } from '@/components/wallet-button';
import { Bot, Sparkles } from 'lucide-react';
import { SetupStep } from '@/types';

interface Message {
    id: string;
    role: 'bot' | 'user';
    content: React.ReactNode;
    timestamp: string;
}

export function ChatInterface() {
    const { address, isConnected } = useAccount();
    const {
        currentStep,
        generateAgent,
        generateLink,
        createAgent,
        startPolling,
        isGeneratingAgent,
        isGeneratingLink,
        isCreatingAgent,
        isPolling,
        agentAddress,
        linkCode,
        botUsername,
        deepLink,
        telegramUser,
        error,
        agentResult
    } = useLazyTraderSetup({ userWallet: address });

    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const processedSteps = useRef<Set<string>>(new Set());

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, currentStep]);

    // Initial Welcome Message
    useEffect(() => {
        if (messages.length === 0) {
            addBotMessage(
                <div>
                    <p className="font-semibold mb-1">Welcome to Ostium Lazy Trader.</p>
                    <p>I can help you set up an automated trading agent.</p>
                    <p className="mt-2">To get started, please connect your wallet.</p>
                </div>
            );
        }
    }, []);

    // Handle Wallet Connection
    useEffect(() => {
        if (isConnected && address && !processedSteps.current.has('wallet-connected')) {
            addUserMessage(<p>Connected wallet: <span className="font-mono text-xs bg-blue-700 px-1 py-0.5 rounded text-white">{address.slice(0, 6)}...{address.slice(-4)}</span></p>);

            setTimeout(() => {
                addBotMessage(
                    <div>
                        <p>Great! Your wallet is connected.</p>
                        <p className="mt-1">Now, let's generate your unique Ostium Agency address.</p>
                    </div>
                );
            }, 500);

            processedSteps.current.add('wallet-connected');
        }
    }, [isConnected, address]);

    // Handle Steps
    useEffect(() => {
        // We only want to trigger this when entering a NEW step that we haven't acknowledged yet
        // OR when specific data becomes available within a step

        // Step: Agent Generated
        if (currentStep === 'agent' && agentAddress && !processedSteps.current.has('agent-generated')) {
            processedSteps.current.add('agent-generated');
            setTimeout(() => {
                addBotMessage(
                    <div>
                        <p>Agent generated successfully!</p>
                        <div className="my-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700 font-mono text-xs break-all">
                            {agentAddress}
                        </div>
                        <p>Next, we need to link your Telegram account to receive notifications and control your agent.</p>
                    </div>
                );
            }, 500);
        }

        // Step: Link Generated
        if (currentStep === 'telegram-link' && linkCode && !processedSteps.current.has('link-generated')) {
            processedSteps.current.add('link-generated');

            // Start polling automatically when we show the link
            startPolling();

            setTimeout(() => {
                addBotMessage(
                    <div>
                        <p>Here is your Telegram connection link.</p>
                        <p className="mb-3 text-xs opacity-70">Click the button below to open Telegram, or send the code to @{botUsername}</p>

                        <div className="flex flex-col gap-2">
                            <a
                                href={deepLink || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                                <Bot size={16} /> Open Telegram Bot
                            </a>
                            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-center text-lg tracking-wider select-all cursor-copy">
                                {linkCode}
                            </div>
                        </div>
                        <p className="mt-3 text-xs italic opacity-60">I'm waiting for your connection...</p>
                    </div>
                );
            }, 500);
        }

        // Step: Create Agent (Telegram Connected)
        if (currentStep === 'create-agent' && telegramUser && !processedSteps.current.has('telegram-connected')) {
            processedSteps.current.add('telegram-connected');
            setTimeout(() => {
                addBotMessage(
                    <div>
                        <p className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Telegram Connected!
                        </p>
                        <p className="mt-1">Verified user: <strong className="text-blue-600">@{telegramUser.telegram_username}</strong></p>
                        <p className="mt-3 border-t pt-3 border-zinc-200 dark:border-zinc-700">
                            Everything looks good. Ready to deploy your Lazy Trader agent?
                        </p>
                    </div>
                );
            }, 500);
        }

        // Step: Complete
        if (currentStep === 'complete' && agentResult?.success && !processedSteps.current.has('completed')) {
            processedSteps.current.add('completed');
            setTimeout(() => {
                addBotMessage(
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-green-600 font-bold mb-2">
                            <Sparkles size={18} />
                            <span>Agent Deployed Successfully!</span>
                        </div>
                        <p>Your Ostium Lazy Trader is now active on the testnet.</p>

                        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400">
                            Deployment ID: {agentResult.deployment?.id}
                        </div>

                        <p className="text-sm">You can now manage your trades directly from Telegram.</p>
                    </div>
                );
            }, 500);
        }

    }, [currentStep, agentAddress, linkCode, deepLink, botUsername, telegramUser, agentResult]);

    // Handle Errors
    useEffect(() => {
        if (error) {
            addBotMessage(
                <div className="text-red-500">
                    <p className="font-bold">Error</p>
                    <p className="text-sm">{error}</p>
                </div>
            );
        }
    }, [error]);

    const addBotMessage = (content: React.ReactNode) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'bot',
            content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    };

    const addUserMessage = (content: React.ReactNode) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'user',
            content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
    };

    const handleAction = (action: 'generate_agent' | 'generate_link' | 'create_agent') => {
        if (action === 'generate_agent') {
            addUserMessage("Generate my agent.");
            generateAgent();
        } else if (action === 'generate_link') {
            addUserMessage("Link my Telegram account.");
            generateLink();
        } else if (action === 'create_agent') {
            addUserMessage("Create and deploy agent.");
            createAgent();
        }
    };

    const isLoading = isGeneratingAgent || isGeneratingLink || isCreatingAgent || (currentStep === 'telegram-link' && isPolling);

    return (
        <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white dark:bg-zinc-950 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                        <Bot size={20} />
                    </div>
                    <div>
                        <h1 className="font-bold text-sm">Ostium AI Trader</h1>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`}></span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{isConnected ? 'Online' : 'Waiting for Wallet'}</span>
                        </div>
                    </div>
                </div>
                <WalletButton />
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-2 scroll-smooth">
                {messages.map((msg) => (
                    <ChatMessage
                        key={msg.id}
                        role={msg.role}
                        content={msg.content}
                        timestamp={msg.timestamp}
                    />
                ))}
                {isLoading && currentStep !== 'telegram-link' && (
                    <div className="flex justify-start mb-4">
                        <div className="bg-zinc-100 dark:bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                    {isConnected ? (
                        <ActionButtons
                            step={currentStep}
                            isLoading={isLoading && currentStep !== 'telegram-link'} // Don't block UI during link polling
                            onAction={handleAction}
                        />
                    ) : (
                        <div className="text-sm text-zinc-500 italic ml-2">Connect wallet to start conversation...</div>
                    )}
                </div>
            </div>
        </div>
    );
}
