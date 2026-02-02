import { ChatInterface } from '@/components/chat/ChatInterface';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-zinc-50 dark:bg-[#0a0a0a] selection:bg-blue-500/30">
      <div className="w-full max-w-2xl relative z-10">
        {/* Ambient Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/5 blur-[80px] rounded-full -z-10 pointer-events-none" />

        <ChatInterface />

        <div className="mt-8 text-center space-y-2 opacity-50 hover:opacity-100 transition-opacity duration-500">
          <p className="text-xs text-zinc-500 font-medium tracking-wide">
            POWERED BY CRADLE & OSTIUM
          </p>
        </div>
      </div>
    </main>
  );
}