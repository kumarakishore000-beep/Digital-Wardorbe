import type { Metadata } from "next";
import { Shirt, Link as LinkIcon, Gem, Sparkles, Watch } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In — AuraStyle AI",
  description: "Sign in to your AuraStyle AI account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Left side: Colorful Image & Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 items-center justify-center p-12">
        {/* Background decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-[100px] mix-blend-overlay" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-black/20 rounded-full blur-[100px] mix-blend-overlay" />
        
        {/* Floating Icons */}
        <div className="absolute top-[20%] left-[20%] text-white/30 transform -rotate-12 animate-[pulse_4s_ease-in-out_infinite]">
          <Shirt className="w-24 h-24 drop-shadow-2xl" />
        </div>
        <div className="absolute top-[30%] right-[20%] text-white/30 transform rotate-45 animate-[pulse_5s_ease-in-out_infinite]">
          <LinkIcon className="w-16 h-16 drop-shadow-2xl" />
        </div>
        <div className="absolute bottom-[20%] left-[30%] text-white/30 transform rotate-12 animate-[pulse_6s_ease-in-out_infinite]">
          <Gem className="w-20 h-20 drop-shadow-2xl" />
        </div>
        <div className="absolute bottom-[30%] right-[15%] text-white/30 transform -rotate-45 animate-[pulse_4.5s_ease-in-out_infinite]">
          <Watch className="w-20 h-20 drop-shadow-2xl" />
        </div>

        <div className="relative z-10 max-w-md text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[32px] bg-white/10 backdrop-blur-xl shadow-2xl mb-4 border border-white/20">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">AuraStyle AI</h1>
          <p className="text-xl text-white/90 font-medium leading-relaxed">
            Discover your perfect look with AI-powered styling and fashion matching.
          </p>
        </div>
      </div>

      {/* Right side: Form Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Decorative subtle glows for mobile */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] lg:hidden" />
        
        <div className="w-full max-w-[380px] z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
