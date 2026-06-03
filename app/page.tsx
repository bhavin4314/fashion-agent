import type { Metadata } from "next";
import Image from "next/image";
import { Camera, Ruler, Sparkles } from "lucide-react";
import { Navbar } from "./_components/Navbar";
import { SearchPill } from "./_components/SearchPill";

export const metadata: Metadata = {
  title: "Vistra | AI Fashion Concierge",
  description: "Find your perfect, coordinated outfits curated by world-class AI.",
};

export default function Home() {
  return (
    <div className="text-charcoal antialiased min-h-screen flex flex-col bg-white">
      {/* Dynamic Navigation Header */}
      <Navbar />

      {/* Hero Section */}
      <header className="relative w-full h-screen flex items-center justify-center pt-[80px] overflow-hidden select-none">
        <div className="absolute inset-0 z-0">
          <Image
            alt="Hero background"
            className="w-full h-full object-cover"
            src="/images/home-main-cover.png"
            fill
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-black/5" />
        </div>
        
        {/* Centered Search Pill leaf controller */}
        <div className="relative z-10 w-full max-w-4xl px-margin-mobile md:px-0">
          <SearchPill />
        </div>
      </header>

      {/* AI Features Columns Section */}
      <section className="py-xxl bg-white select-none">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            {/* Feature 1 */}
            <div className="p-lg rounded-xl flex flex-col gap-md">
              <div className="w-10 h-10 flex items-center justify-center bg-[#ff385c]/10 rounded-lg shrink-0">
                <Camera className="h-6 w-6 text-[#ff385c]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">
                  Multi-Modal Search
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  Search using photos or text. Upload any look you like and our AI will source the closest matches globally.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="p-lg rounded-xl flex flex-col gap-md">
              <div className="w-10 h-10 flex items-center justify-center bg-[#ff385c]/10 rounded-lg shrink-0">
                <Sparkles className="h-6 w-6 text-[#ff385c]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">
                  Instant Coordination
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  Our system matches separate garments to build complete outfits in real-time, ensuring you never buy a piece that doesn't fit your wardrobe.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-lg rounded-xl flex flex-col gap-md">
              <div className="w-10 h-10 flex items-center justify-center bg-[#ff385c]/10 rounded-lg shrink-0">
                <Ruler className="h-6 w-6 text-[#ff385c]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-charcoal mb-2">
                  Smart Size Recommendation
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  No guess-work. The assistant analyzes brand-specific measurements to find your exact match based on your unique profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seasonal Picks Editorial Accent Banner */}
      <section className="pb-xxl bg-white select-none px-margin-mobile md:px-0">
        <div className="max-w-7xl mx-auto md:px-margin-desktop">
          <div className="relative rounded-xl overflow-hidden aspect-[21/9] group cursor-pointer">
            <Image
              alt="Trend Collection"
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              src="/images/home-cloth-cover.png"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-xl text-white">
              <p className="text-xs font-bold uppercase tracking-widest mb-2 select-none">
                Seasonal Picks
              </p>
              <h2 className="text-2xl md:text-4xl font-extrabold select-none">
                Autumn Essentials
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="w-full py-xl bg-footer-bg border-t border-border-light mt-auto">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md select-none">
          <div className="text-sm text-charcoal">
            © 2026 Vistra AI Fashion Concierge. All rights reserved.
          </div>
          <div className="flex gap-lg">
            <a
              className="text-sm font-semibold text-charcoal underline hover:no-underline transition-all duration-150"
              href="#"
            >
              Privacy Policy
            </a>
            <a
              className="text-sm font-semibold text-charcoal underline hover:no-underline transition-all duration-150"
              href="#"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
