import type { Metadata } from "next";
import AuraStyleLogo from "@/components/AuraStyleLogo";

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
    <div className="min-h-screen flex bg-[#0a192f] text-[#FAF8F5] selection:bg-[#1e3a8a] selection:text-[#fffff0]">
      {/* Left side: Editorial Lookbook & Floral AS Branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden bg-[#071326] items-center justify-center p-12 border-r border-[#FAF8F5]/10">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1e3a8a]/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#38BDF8]/10 rounded-full blur-[120px]" />

        <div className="relative z-10 w-full max-w-lg">
          <AuraStyleLogo variant="showcase" className="border-0 shadow-none bg-transparent p-0" />
        </div>
      </div>

      {/* Right side: Form Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-[#0a192f]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1e3a8a]/20 rounded-full blur-[100px] lg:hidden" />
        
        <div className="w-full max-w-[400px] z-10">
          {children}
        </div>
      </div>
    </div>
  );
}
