/**
 * ============================================================================
 * 🏢 PAINT N'AT LLC - PREMIUM WEBSITE APPLICATION
 * ============================================================================
 * * DESCRIPTION:
 * A high-end, cinematic single-page application (SPA) for a premium painting 
 * and contracting business. Features advanced scroll animations, glassmorphism 
 * UI, and a custom before/after image reveal engine.
 * * THEME:
 * Tie-Dye Wash (Vibrant Cyan, Electric Purple, Hot Pink)
 * * TECH STACK:
 * - React (Hooks, State Management, Refs)
 * - Tailwind CSS (Styling, Animations, Responsive Design)
 * - Lucide React (SVG Iconography)
 * * @author Paint N'at Development Team
 * @version 2.1.0
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, ArrowRight, Paintbrush, 
  Hammer, Droplet, Star, MoveRight, 
  ChevronRight, ArrowUpRight
} from 'lucide-react';

// ============================================================================
// 🛠️ HELPER COMPONENTS
// ============================================================================

/**
 * 🖼️ SafeImage Component
 * * 💡 INFO TIP: Browsers often struggle with .HEIC formats natively. 
 * This component acts as a safety net. It attempts to load the primary image, 
 * but if the browser throws an error (e.g., unsupported format or broken link), 
 * it seamlessly hot-swaps to a safe fallback image to prevent crashes.
 */
const SafeImage = ({ src, fallbackSrc, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        // Prevent infinite loops by checking if we are already using the fallback
        if (imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
};

// ============================================================================
// ⚙️ CUSTOM HOOKS
// ============================================================================

/**
 * 👁️ useIntersection Hook
 * * 💡 INFO TIP: This hook tracks whether an element has scrolled into the 
 * user's viewport. It uses the browser's native `IntersectionObserver` API 
 * for high performance, avoiding jittery window scroll event listeners.
 * * @param {number} threshold - How much of the element must be visible (0.0 to 1.0)
 * @returns {[Ref, boolean]} - The ref to attach to the element, and its visibility state
 */
const useIntersection = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    // Safety guard: Ensure the element exists before observing
    if (!ref.current) return;
    
    // Safety guard: If the browser doesn't support IntersectionObserver, fail gracefully
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      setIsVisible(true);
      return;
    }

    // Create the observer instance
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once revealed (run once)
        }
      },
      { threshold }
    );
    
    observer.observe(ref.current);
    
    // Cleanup function when component unmounts
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

// ============================================================================
// 🎬 ANIMATION COMPONENTS
// ============================================================================

/**
 * ✨ Reveal Component
 * * 💡 INFO TIP: A wrapper component that applies CSS transitions when its 
 * children scroll into view. It utilizes the `useIntersection` hook above.
 * * @param {number} delay - Animation delay in milliseconds for staggered effects
 * @param {string} direction - The origin of the slide animation ('up', 'left', 'right')
 */
const Reveal = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const [ref, isVisible] = useIntersection();
  
  // Set initial hidden state based on direction prop
  let hiddenClasses = "opacity-0 ";
  if (direction === 'up') hiddenClasses += "translate-y-12";
  if (direction === 'left') hiddenClasses += "translate-x-12";
  if (direction === 'right') hiddenClasses += "-translate-x-12";

  const visibleClasses = "opacity-100 translate-y-0 translate-x-0";

  return (
    <div 
      ref={ref} 
      className={`transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? visibleClasses : hiddenClasses} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};


// ============================================================================
// 🚀 MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // --- STATE MANAGEMENT ---
  const [scrolled, setScrolled] = useState(false);         // Tracks if user has scrolled past top
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Manages mobile hamburger menu

  // --- SIDE EFFECTS ---
  // Listen to window scroll to shrink/style the navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup memory
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = (formData.get('name') || '').toString().trim();
    const email = (formData.get('email') || '').toString().trim();
    const scope = (formData.get('scope') || '').toString().trim();

    const subject = encodeURIComponent(`New Estimate Request - ${name || 'Website Visitor'}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nProject Scope: ${scope || 'Not selected'}\n\nPlease contact me for a free estimate.`
    );
    window.location.href = `mailto:markschrecengost1@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-400 selection:text-[#09090b] font-sans overflow-x-hidden">
      
      {/* =======================================================================
        🎨 GLOBAL CSS OVERRIDES & KEYFRAMES
        =======================================================================
        💡 INFO TIP: Injecting custom CSS animations directly into the component 
        ensures they are always packaged with the JS, making the code portable.
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 20s linear infinite; }
        
        @keyframes shine { to { background-position: 200% center; } }
        .text-gradient {
          background: linear-gradient(135deg, #22d3ee 0%, #a855f7 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-size: 200% auto;
          animation: shine 5s linear infinite;
        }
        
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .blob { filter: blur(80px); z-index: 0; pointer-events: none; }
        .tie-dye-bg {
          background:
            radial-gradient(circle at 20% 15%, rgba(34, 211, 238, 0.45), transparent 38%),
            radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.48), transparent 42%),
            radial-gradient(circle at 35% 78%, rgba(236, 72, 153, 0.5), transparent 40%),
            radial-gradient(circle at 75% 82%, rgba(16, 185, 129, 0.42), transparent 38%),
            linear-gradient(145deg, #1f1d78 0%, #5b2496 30%, #bf2a8e 58%, #ef6b38 78%, #22d3ee 100%);
        }
        .geo-overlay {
          background-image:
            repeating-linear-gradient(26deg, rgba(255,255,255,0.14) 0 140px, transparent 140px 280px),
            repeating-linear-gradient(-26deg, rgba(255,255,255,0.1) 0 130px, transparent 130px 260px);
          mix-blend-mode: screen;
        }
        .estimate-ribbon {
          clip-path: polygon(5% 0, 95% 0, 90% 50%, 95% 100%, 5% 100%, 10% 50%);
        }
        .logo-stroke {
          text-shadow:
            -2px -2px 0 #ffffff,
            2px -2px 0 #ffffff,
            -2px 2px 0 #ffffff,
            2px 2px 0 #ffffff;
        }
      `}} />

      {/* =======================================================================
        🧭 NAVIGATION BAR
        =======================================================================
      */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-500 rounded-full px-6 py-3 ${scrolled ? 'glass-panel shadow-2xl' : 'bg-transparent'}`}>
            
            {/* Logo */}
            <div className="flex items-center gap-2 z-50">
              <img
                src="/brand/logo.png"
                alt="Paint N'at Logo"
                className="h-10 w-10 object-contain"
              />
              <span className="font-bold text-xl tracking-tight text-white">Paint N'at</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {['Services', 'About', 'Portfolio', 'Process', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-cyan-400 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:block">
              <a href="#contact" className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-white/10 border border-white/20 rounded-full hover:bg-white hover:text-black overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Get a Quote <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
                </span>
              </a>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button 
              className="md:hidden z-50 text-white focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Menu */}
        <div className={`fixed inset-0 bg-[#050505] z-40 flex flex-col items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex flex-col items-center gap-8 text-3xl font-light tracking-tighter">
            {['Services', 'About', 'Portfolio', 'Process', 'Contact'].map((item, i) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-cyan-400 hover:via-purple-500 hover:to-pink-500 transition-all"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* =======================================================================
        🌟 HERO SECTION
        =======================================================================
      */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        
        {/* Ambient Background Graphics */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 tie-dye-bg"></div>
          <div className="absolute inset-0 geo-overlay opacity-70"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/40 to-[#050505]/85"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full flex flex-col items-center text-center">
          <Reveal delay={100}>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel mb-8 border-cyan-300/40">
              <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-cyan-300 absolute"></span>
              <span className="text-xs font-semibold tracking-widest uppercase text-white/90">Quick, Efficient, Friendly</span>
            </div>
          </Reveal>
          
          <Reveal delay={300}>
            <h1 className="text-5xl sm:text-7xl lg:text-[7rem] leading-[0.95] tracking-tight font-black mb-8">
              <span className="block">Quick, Efficient,</span>
              <span className="block">Friendly Service</span>
              <span className="block">with a Smile!</span>
            </h1>
          </Reveal>

          <Reveal delay={500}>
            <div className="estimate-ribbon bg-yellow-300 text-[#1a1f38] font-black tracking-wide px-10 py-5 text-2xl md:text-4xl shadow-2xl mb-10">
              FREE ESTIMATES!
            </div>
          </Reveal>

          <Reveal delay={700}>
            <div className="flex flex-col items-center gap-7">
              <p className="max-w-4xl mx-auto text-xl md:text-4xl font-extrabold text-white leading-tight">
                Painting, Cleaning/Hauling, All-Season Property Maintenance, Residential/Commercial, and much more...
              </p>
              <a href="#contact" className="group relative px-10 py-4 bg-white text-[#14111f] font-bold rounded-full overflow-hidden flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-lg shadow-white/20">
                <span className="relative z-10">Book Your Free Estimate</span>
                <MoveRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform text-cyan-600" />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =======================================================================
        🎞️ ENDLESS MARQUEE (TICKER TAPE)
        =======================================================================
      */}
      <div className="py-10 border-y border-white/5 bg-[#0a0a0a] overflow-hidden whitespace-nowrap flex relative z-10">
        <div className="animate-marquee flex gap-12 text-4xl md:text-6xl font-black tracking-tighter text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>
          <span>INTERIOR PAINTING</span><span className="text-white">•</span>
          <span>EXTERIOR COATINGS</span><span className="text-white">•</span>
          <span>CUSTOM DRYWALL</span><span className="text-white">•</span>
          <span>FINE TRIM WORK</span><span className="text-white">•</span>
          <span>CABINET REFINISHING</span><span className="text-white">•</span>
          {/* Duplicated block below to ensure seamless looping animation */}
          <span>INTERIOR PAINTING</span><span className="text-white">•</span>
          <span>EXTERIOR COATINGS</span><span className="text-white">•</span>
          <span>CUSTOM DRYWALL</span><span className="text-white">•</span>
          <span>FINE TRIM WORK</span><span className="text-white">•</span>
          <span>CABINET REFINISHING</span><span className="text-white">•</span>
        </div>
      </div>

      {/* =======================================================================
        🍱 BENTO BOX: SERVICES SECTION
        =======================================================================
      */}
      <section id="services" className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div>
                <h2 className="text-sm font-bold tracking-widest uppercase text-purple-400 mb-4">Our Expertise</h2>
                <h3 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
                  The Paint.<br />
                  <span className="text-gray-500">And The Rest.</span>
                </h3>
              </div>
              <p className="max-w-md text-gray-400 font-light text-lg">
                Why hire three different contractors? We handle the canvas, the prep, and the masterpiece—all under one roof.
              </p>
            </div>
          </Reveal>

          {/* Grid Layout Engine */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            
            {/* Bento Block 1: Massive Feature Card */}
            <Reveal delay={100} className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-[2rem]">
              <div className="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?q=80&w=2000&auto=format&fit=crop" alt="Interior" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-10">
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-6">
                  <Paintbrush size={28} className="text-white" />
                </div>
                <h4 className="text-3xl font-bold mb-3">Flawless Interiors</h4>
                <p className="text-gray-300 max-w-md">Precision painting that transforms your living spaces. We use premium low-VOC paints and protect every inch of your furniture.</p>
              </div>
            </Reveal>

            {/* Bento Block 2: Secondary Focus */}
            <Reveal delay={200} className="relative group overflow-hidden rounded-[2rem] bg-gradient-to-br from-purple-900/40 to-[#050505] border border-white/10 p-10 flex flex-col justify-between hover:bg-white/5 transition-colors">
              <div className="w-14 h-14 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <Hammer size={28} />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3">...And That</h4>
                <p className="text-gray-400 text-sm">Drywall patching, baseboard installation, and minor carpentry. We prep the canvas before we paint.</p>
              </div>
            </Reveal>

            {/* Bento Block 3: Secondary Focus */}
            <Reveal delay={300} className="relative group overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/5 p-10 flex flex-col justify-between hover:border-white/20 transition-colors">
              <div className="w-14 h-14 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <Droplet size={28} />
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-3">Exterior Defense</h4>
                <p className="text-gray-400 text-sm">Weather-resistant coatings, deck staining, and power washing to boost curb appeal and protect your home.</p>
              </div>
            </Reveal>

            {/* Bento Block 4: Call To Action Grid Item */}
            <Reveal delay={400} className="md:col-span-3 h-auto py-12 relative group overflow-hidden rounded-[2rem] glass-panel flex flex-col md:flex-row items-center justify-between px-10 border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 mb-6 md:mb-0">
                <h4 className="text-2xl font-bold mb-2">Have a unique project?</h4>
                <p className="text-gray-400">Let's discuss how we can bring your vision to life.</p>
              </div>
              <a href="#contact" className="relative z-10 px-8 py-4 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                Start a Conversation <ArrowUpRight size={20} className="text-purple-600" />
              </a>
            </Reveal>

          </div>
        </div>
      </section>

      {/* =======================================================================
        📖 ABOUT US SECTION
        =======================================================================
      */}
      <section id="about" className="py-32 relative z-10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Owner Photo */}
            <Reveal direction="right">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/10 group">
                <SafeImage 
                  src="/team%20photos/IMG_1705.jpg" 
                  fallbackSrc="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2000&auto=format&fit=crop"
                  alt="Husband and wife working" 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" 
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[#050505] via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-10 left-10">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-4 border-cyan-500/20">
                    <Star size={14} className="text-cyan-400" />
                    <span className="text-xs font-semibold tracking-widest uppercase text-gray-300">Est. 2020</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white">Husband & Wife Duo</h3>
                </div>
              </div>
            </Reveal>

            {/* Biography Content */}
            <Reveal direction="left" delay={200}>
              <h2 className="text-sm font-bold tracking-widest uppercase text-purple-400 mb-4">Who We Are</h2>
              <h3 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight mb-8">
                More Than Just <br />
                <span className="text-gray-500">Contractors.</span>
              </h3>
              
              <div className="space-y-6 text-gray-400 text-lg font-light leading-relaxed">
                <p>
                  Established in 2020, Paint N'at is a husband-and-wife-led enterprise built on the belief that comprehensive property care shouldn't require a dozen different contractors. We specialize in end-to-end property transformations for both commercial and residential clients.
                </p>
                <p>
                  From high-end interior and exterior painting to complex renovations, fix-and-flips, and rental turnovers, we deliver meticulous craftsmanship. But our expertise doesn't stop at the front door. We offer true four-season property management, including professional landscaping, seasonal maintenance, and detailed home repairs. In fact, the list of what we <em className="text-gray-200">don't</em> do is exceptionally short.
                </p>
                <p>
                  Proudly serving the Tri-State area—from Southeast Pittsburgh to Youngstown and everywhere in between—we bring passion, precision, and a relentless work ethic to every project we touch.
                </p>
              </div>

              {/* Data Highlights */}
              <div className="mt-10 grid grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-colors">
                  <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">4+</h4>
                  <p className="text-sm text-gray-500">Seasons of Service</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-pink-500/30 transition-colors">
                  <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-2">100%</h4>
                  <p className="text-sm text-gray-500">Tri-State Coverage</p>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* =======================================================================
        📸 HIGH-END GALLERY (BEFORE & AFTER PORTFOLIO)
        =======================================================================
        💡 INFO TIP: This section utilizes a complex hover state to reveal a 
        "Before" image stacked perfectly underneath the "After" image.
      */}
      <section id="portfolio" className="py-32 bg-[#020202] relative">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Reveal>
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Signature <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-gray-200">Spaces</span></h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">Hover over any project to reveal the "Before" transformation.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { 
                before: "/before/IMG_3610.jpg", after: "/after/IMG_3691.jpg", 
                fallbackBefore: "https://images.unsplash.com/photo-1504624720567-64a4048cb218?q=80&w=1000", fallbackAfter: "https://images.unsplash.com/photo-1530982011887-3cc11cc85693?q=80&w=1000",
                title: "Barn Restoration", category: "Cleanout & Maintenance" 
              },
              { 
                before: "/before/IMG_3970.jpg", after: "/after/IMG_3971.jpg", 
                fallbackBefore: "https://images.unsplash.com/photo-1581141849291-1125c7b692b5?q=80&w=1000", fallbackAfter: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000",
                title: "Modern Vanity Install", category: "Renovation & Plumbing" 
              },
              { 
                before: "/before/IMG_3327.jpg", after: "/after/IMG_3692.jpg", 
                fallbackBefore: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=1000", fallbackAfter: "https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?q=80&w=1000",
                title: "High-Gloss Finish", category: "Interior Painting & Prep" 
              },
              { 
                before: "/before/IMG_3721.jpg", after: "/after/IMG_3722.jpg", 
                fallbackBefore: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=1000", fallbackAfter: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000",
                title: "Garage Overhaul", category: "Demo & Cleanout" 
              }
            ].map((item, idx) => (
              <Reveal key={idx} delay={idx * 150}>
                <a
                  href="https://www.instagram.com/paint.n.at?igsh=MXNoODFvM3Jzd2F2NQ%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-[4/3] lg:aspect-[16/9] rounded-[2rem] overflow-hidden cursor-pointer border border-white/5 bg-[#0a0a0a]"
                >
                  
                  {/* LAYER 1: After Image (Default Visible) */}
                  <SafeImage 
                    src={item.after} 
                    fallbackSrc={item.fallbackAfter}
                    alt={`${item.title} After`} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 z-0" 
                  />
                  
                  {/* LAYER 2: Before Image (Revealed on Hover via Opacity Change) */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 bg-[#0a0a0a]">
                    <SafeImage 
                      src={item.before} 
                      fallbackSrc={item.fallbackBefore}
                      alt={`${item.title} Before`} 
                      className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity" 
                    />
                    <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold tracking-widest text-gray-300 uppercase">
                      Before
                    </div>
                  </div>

                  {/* Aesthetic Shadow Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-90 z-20 pointer-events-none"></div>
                  
                  {/* Dynamic 'After' Label (Hides on hover) */}
                  <div className="absolute top-6 right-6 bg-purple-600/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-purple-400/30 text-xs font-bold tracking-widest text-white uppercase opacity-100 group-hover:opacity-0 transition-opacity duration-500 z-20 shadow-lg">
                    After
                  </div>

                  {/* Typography Data */}
                  <div className="absolute bottom-0 left-0 w-full p-8 z-30 transition-transform duration-500 ease-out group-hover:-translate-y-2">
                    <p className="text-cyan-400 font-medium text-sm mb-2 tracking-widest uppercase">{item.category}</p>
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl md:text-3xl font-bold">{item.title}</h3>
                      <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <ArrowUpRight size={20} className="text-purple-600" />
                      </div>
                    </div>
                  </div>

                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =======================================================================
        💬 PREMIUM TESTIMONIALS 
        =======================================================================
      */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020202] to-[#0a0a0a]"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <Reveal>
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">The Word on the Street</h2>
            </div>
          </Reveal>

          {/* Staggered Masonry-Style Grid Array */}
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                text: "Mark was able to come out the next day. He was quick and efficient! Would definitely use their services again. Thank you!",
                author: "Crystal Mccoy",
                role: "Client"
              },
              {
                text: "Mark is detailed and timely! I have been using him for a month and will continue.",
                author: "Marta Dash",
                role: "Local Guide"
              },
              {
                text: "Absolutely top notch work, as well as professional and friendly to boot. Had real difficulty finding anyone who worked in my area...",
                author: "SextonKing",
                role: "Local Guide"
              },
              {
                text: "I needed some light landscaping done to my yard. Every business I called was booked out to September and some in October. When I called Paint N'at...",
                author: "Madelyn Woods",
                role: "Local Guide"
              }
            ].map((review, idx) => (
              <Reveal key={idx} delay={100 + (idx * 100)} className={`p-10 rounded-[2rem] glass-panel text-left relative group ${idx % 2 !== 0 ? 'md:translate-y-12' : ''} hover:border-cyan-500/20 transition-colors`}>
                <div className="absolute top-10 right-10 text-white/5 font-serif text-8xl leading-none">"</div>
                
                {/* 5-Star Generator */}
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} className="fill-amber-400 text-amber-400" />)}
                </div>
                
                <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-200 mb-8 relative z-10">
                  "{review.text}"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-900 to-purple-900 flex items-center justify-center text-xl font-bold text-gray-300 shadow-inner">
                    {review.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{review.author}</h4>
                    <p className="text-sm text-gray-500">{review.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

      {/* =======================================================================
        📬 IMMERSIVE CONTACT CTA & FORM (Tie-Dye Wash Edition)
        =======================================================================
      */}
      <section id="contact" className="py-32 relative">
        <div className="absolute inset-0 bg-[#050505] overflow-hidden">
          {/* 💡 INFO TIP: TIE-DYE WASH EFFECT
            By stacking multiple animated blobs with different colors (Cyan, Purple, Pink) 
            and staggered animation delays, we create an incredible, shifting tie-dye 
            gradient wash behind the frosted glass form. 
          */}
          <div className="absolute bottom-0 left-1/3 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-cyan-600/20 blob animate-pulse" style={{ animationDuration: '7s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-purple-600/20 blob animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
          <div className="absolute -bottom-10 right-1/2 w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] rounded-full bg-pink-600/20 blob animate-pulse" style={{ animationDuration: '9s', animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="glass-panel rounded-[3rem] p-8 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden">
            
            {/* Subtle inner graph-paper background texture */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            
            <div className="text-center max-w-2xl mx-auto mb-12 relative z-10">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">Let's Create.</h2>
              <p className="text-gray-400 text-lg">Book a complimentary consultation. We'll discuss your space, your vision, and the precise details required to achieve it.</p>
            </div>

            {/* 💡 INFO TIP: FORM UI BUG FIX 
              The inputs below originally had text like `placeholder="Name"`. 
              This caused the placeholder text to overlap with the floating 
              `<label>` element underneath. By setting the placeholder to a 
              single space `placeholder=" "`, it fixes the text overlap while 
              keeping the Tailwind `:placeholder-shown` animations working!
            */}
            <form className="relative z-10 max-w-3xl mx-auto space-y-6" onSubmit={handleContactSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Name Input Field */}
                <div className="relative group">
                  <input type="text" id="name" name="name" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-transparent focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all peer" placeholder=" " />
                  <label htmlFor="name" className="absolute left-6 top-5 text-gray-500 transition-all pointer-events-none peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-cyan-400 peer-valid:-translate-y-3 peer-valid:text-xs">Your Name</label>
                </div>
                
                {/* Email Input Field */}
                <div className="relative group">
                  <input type="email" id="email" name="email" required className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-transparent focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all peer" placeholder=" " />
                  <label htmlFor="email" className="absolute left-6 top-5 text-gray-500 transition-all pointer-events-none peer-focus:-translate-y-3 peer-focus:text-xs peer-focus:text-cyan-400 peer-valid:-translate-y-3 peer-valid:text-xs">Email Address</label>
                </div>
              </div>
              
              {/* Project Scope Dropdown */}
              <div className="relative group">
                <select name="scope" defaultValue="" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:outline-none focus:border-cyan-400 focus:bg-white/10 transition-all appearance-none cursor-pointer">
                  <option value="" disabled className="text-gray-500 bg-[#0a0a0a]">Select Project Scope</option>
                  <option value="interior" className="bg-[#0a0a0a]">Complete Interior Overhaul</option>
                  <option value="exterior" className="bg-[#0a0a0a]">Exterior Restoration & Paint</option>
                  <option value="bespoke" className="bg-[#0a0a0a]">Bespoke Cabinetry/Trim</option>
                  <option value="handyman" className="bg-[#0a0a0a]">Handyman & Prep Work</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <ChevronRight size={20} className="rotate-90" />
                </div>
              </div>

              {/* Submit Button (Tie-Dye Gradient Hover) */}
              <button className="w-full group relative inline-flex items-center justify-center px-8 py-6 text-lg font-bold text-white transition-all duration-300 bg-white/10 border border-white/20 rounded-2xl hover:text-white overflow-hidden mt-4">
                <span className="relative z-10 flex items-center gap-3">
                  Submit Request <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>
          </Reveal>
        </div>
      </section>

      {/* =======================================================================
        ⚓ MINIMALIST FOOTER
        =======================================================================
      */}
      <footer className="bg-[#020202] py-12 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex items-center gap-2">
            <img
              src="/brand/logo.png"
              alt="Paint N'at Logo"
              className="h-12 w-12 object-contain"
            />
          </div>

          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-cyan-400 transition-colors">Instagram</a>
            <a href="https://www.facebook.com/people/Paint-Nat/61555840680239/?ref=embed_page#" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">Facebook</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">LinkedIn</a>
          </div>

          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Paint N'at LLC. Crafted with precision.
          </p>

          <aside className="w-full max-w-md rounded-lg border border-cyan-300/45 bg-gradient-to-r from-cyan-500/15 via-purple-500/15 to-pink-500/15 p-2.5 md:p-3 text-center shadow-md shadow-cyan-900/20">
            <h3 className="text-xs md:text-base font-extrabold tracking-tight text-white">
              Need your own website like this?
            </h3>
            <p className="mt-1 text-[11px] md:text-xs text-gray-200">
              Built for leads, speed, and mobile-first conversion. Get started today.
            </p>
            <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-1.5">
              <a
                href="https://valleytainment.com/#idea-form"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Valleytainment project idea form"
                className="w-full sm:w-auto rounded-md bg-yellow-300 px-2.5 py-1.5 text-[11px] md:text-xs font-black text-[#1b1f38] hover:bg-yellow-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020202] transition-colors"
              >
                Click Here: Get My Website
              </a>
              <a
                href="mailto:valleytainmentllc@gmail.com?subject=Website%20Inquiry"
                aria-label="Email Valleytainment"
                className="w-full sm:w-auto rounded-md border border-white/30 bg-white/10 px-2.5 py-1.5 text-[11px] md:text-xs font-semibold text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#020202] transition-colors"
              >
                valleytainmentllc@gmail.com
              </a>
            </div>
          </aside>

        </div>
      </footer>
      
    </div>
  );
}

// ============================================================================
// 🎨 FALLBACK ICONS (If Lucide import fails)
// ============================================================================
function ArrowDown(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M19 12l-7 7-7-7"/>
    </svg>
  );
}
