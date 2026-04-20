import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Palette, 
  Type as TypeIcon, 
  ShieldCheck, 
  ArrowRight, 
  Download, 
  RefreshCcw,
  Layout,
  Briefcase,
  Layers,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { generateBrandIdentity } from './services/geminiService';
import { BrandIdentity } from './types';

// Helper for dynamic Google Font loading
const FontLoader = ({ families }: { families: string[] }) => {
  useEffect(() => {
    if (families.length === 0) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    const params = families.map(f => `family=${f.replace(/ /g, '+')}:wght@400;700`).join('&');
    link.href = `https://fonts.googleapis.com/css2?${params}&display=swap`;
    document.head.appendChild(link);
    return () => {
      const existing = document.head.querySelector(`link[href="${link.href}"]`);
      if (existing) document.head.removeChild(existing);
    };
  }, [families]);
  return null;
};

export default function App() {
  const [mission, setMission] = useState('');
  const [brandName, setBrandName] = useState('');
  const [loading, setLoading] = useState(false);
  const [identity, setIdentity] = useState<BrandIdentity | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const loadingSteps = [
    "Analyzing market mission...",
    "Synthesizing color psychology...",
    "Curating typographic pairings...",
    "Drafting visual geometry...",
    "Finishing the Brand Bible..."
  ];

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingStep(s => (s + 1) % loadingSteps.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleGenerate = async () => {
    if (!mission.trim()) return;
    setLoading(true);
    try {
      const res = await generateBrandIdentity(mission, brandName);
      setIdentity(res);
    } catch (error) {
      console.error("Generation failed:", error);
      alert("Failed to generate identity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIdentity(null);
    setMission('');
    setBrandName('');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans selection:bg-indigo-600 selection:text-white">
      {identity && <FontLoader families={identity.typography.map(t => t.fontName)} />}
      
      <main className="h-screen overflow-hidden">
        <AnimatePresence mode="wait">
          {!identity ? (
            <div className="h-full flex items-center justify-center p-6">
              <motion.div 
                key="input"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full max-w-xl space-y-8"
              >
                <div className="text-center space-y-3">
                  <div className="flex justify-center mb-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                      <Sparkles size={24} />
                    </div>
                  </div>
                  <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">
                    BrandForge <span className="text-indigo-600">v1.</span>0
                  </h1>
                  <p className="text-slate-500 font-medium">
                    Corporate Identity Engine • High Density Edition
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-16 -translate-y-16 blur-3xl opacity-50" />
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 block ml-1">Identity Label</label>
                    <input 
                      type="text"
                      placeholder="e.g. Luminara"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 block ml-1">Core Mission</label>
                    <textarea 
                      rows={5}
                      placeholder="Input company mission, vision, and core purpose..."
                      value={mission}
                      onChange={(e) => setMission(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 focus:border-indigo-500 focus:bg-white outline-none transition-all resize-none leading-relaxed"
                    />
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={loading || !mission.trim()}
                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-slate-800 disabled:opacity-50 transition-all shadow-lg active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        <span>{loadingSteps[loadingStep]}</span>
                      </>
                    ) : (
                      <>
                        <span>Initialize Synthesis</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.div 
              key="output"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full grid grid-cols-1 md:grid-cols-[320px_1fr] bg-white"
            >
              {/* Sidebar */}
              <aside className="bg-white border-r border-slate-200 p-8 flex flex-col h-full overflow-y-auto">
                <div className="mb-10">
                  <h1 className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 mb-1">Identity Engine v1.0</h1>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{identity.brandName}</h2>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">Brand Bible Document</p>
                </div>

                <div className="flex-1 space-y-8">
                  {/* Dashboard Nav */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Dashboard Navigation</label>
                    <nav className="space-y-1">
                      {[
                        { label: 'Logos & Marks', icon: Layers },
                        { label: 'Usage Protocols', icon: ShieldCheck },
                        { label: 'Color System', icon: Palette },
                        { label: 'Typography', icon: TypeIcon },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-colors cursor-pointer group">
                           <item.icon size={14} className="group-hover:text-indigo-600 transition-colors" />
                           {item.label}
                        </div>
                      ))}
                    </nav>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-slate-100">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Mission Descriptor</label>
                    <p className="text-sm text-slate-600 italic leading-relaxed border-l-2 border-indigo-100 pl-4 py-1">
                      "{identity.missionSummary}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Brand Archetype</label>
                    <div className="flex flex-wrap gap-2">
                       {identity.brandVoice.map((v, i) => (
                         <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] uppercase tracking-widest font-bold rounded border border-slate-200/50">
                           {v}
                         </span>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Strategic Tagline</label>
                    <p className="text-lg font-black text-slate-900 leading-tight uppercase tracking-tight">
                      {identity.tagline}
                    </p>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Status</p>
                      <p className="text-xs font-bold text-indigo-700">Optimized • Complete</p>
                    </div>
                    <ShieldCheck size={18} className="text-indigo-400" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleReset} className="p-3 bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
                      <RefreshCcw size={18} />
                    </button>
                    <button className="flex-1 py-3 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-md">
                      Export Assets
                    </button>
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <main className="bg-[#F8FAFC] p-8 lg:p-12 overflow-y-auto space-y-8">
                {/* Top Row: Logos */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative group overflow-hidden h-[320px] flex items-center justify-center">
                    <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest absolute top-6 left-8">Primary Identifier</label>
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-24 h-24 p-6 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-slate-200/50 relative overflow-hidden">
                        {/* Dot Grid Background for visibility */}
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '10px 10px' }} />
                        <svg 
                          viewBox="0 0 100 100" 
                          className="w-full h-full fill-current relative z-10"
                          style={{ color: identity.palette[0].hex }}
                          dangerouslySetInnerHTML={{ __html: identity.primaryLogo.svgData }}
                        />
                      </div>
                      <div className="text-center">
                        <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{identity.brandName}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em] mt-2 italic">Standard Wordmark</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm relative h-[320px] grid grid-cols-2 gap-4">
                     <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest absolute top-6 left-8">Secondary Marks</label>
                     <div className="flex flex-col items-center justify-center border-r border-slate-100 mt-4 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 0)', backgroundSize: '10px 10px' }} />
                        <div className="w-16 h-16 p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center relative z-10 shadow-sm">
                          <svg 
                            viewBox="0 0 100 100" 
                            className="w-full h-full fill-current"
                            style={{ color: identity.palette[0].hex }}
                            dangerouslySetInnerHTML={{ __html: identity.secondaryMark.svgData }}
                          />
                        </div>
                        <p className="text-[10px] mt-4 font-bold text-slate-400 uppercase tracking-[0.15em] relative z-10">Icon System</p>
                     </div>
                     <div className="flex flex-col items-center justify-center mt-4 text-center px-4">
                        <div className="h-16 flex items-center">
                           <p className="text-3xl font-black italic tracking-tighter" style={{ color: identity.palette[0].hex }}>
                             {identity.brandName.charAt(0)}
                           </p>
                        </div>
                        <p className="text-[10px] mt-4 font-bold text-slate-400 uppercase tracking-[0.15em]">Lettermark</p>
                        <p className="text-[9px] text-slate-300 font-medium leading-tight mt-2 italic">
                          {identity.secondaryMark.description}
                        </p>
                     </div>
                  </div>
                </div>

                {/* Detailed Usage Guidelines */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-8">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                    <ShieldCheck size={18} className="text-indigo-500" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Official Usage Protocols</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">P</div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Logo Placement</h4>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed pl-11 border-l border-slate-100">
                        {identity.usageGuidelines.logoPlacement}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">S</div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Clear Space</h4>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed pl-11 border-l border-slate-100">
                        {identity.usageGuidelines.clearSpace}
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">C</div>
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Color Application</h4>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed pl-11 border-l border-slate-100">
                        {identity.usageGuidelines.colorApplication}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Logo Variation Suite */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                    <Layers size={18} className="text-indigo-500" />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Digital Asset Suite</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 flex items-center justify-between group">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monochrome Variant</label>
                        <p className="text-[9px] text-slate-400 max-w-[140px] italic">{identity.monochromeLogo.description}</p>
                      </div>
                      <div className="w-20 h-20 bg-white border border-slate-200 rounded-lg flex items-center justify-center p-4 transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900">
                        <svg 
                          viewBox="0 0 100 100" 
                          className="w-full h-full fill-current"
                          dangerouslySetInnerHTML={{ __html: identity.monochromeLogo.svgData }}
                        />
                      </div>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-8 flex items-center justify-between group">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Favicon / App Icon</label>
                        <p className="text-[9px] text-slate-400 max-w-[140px] italic">{identity.favicon.description}</p>
                      </div>
                      <div className="w-12 h-12 bg-white border border-slate-200 rounded-md flex items-center justify-center p-2 shadow-sm transition-all group-hover:scale-110">
                        <svg 
                          viewBox="0 0 100 100" 
                          className="w-full h-full fill-current"
                          style={{ color: identity.palette[0].hex }}
                          dangerouslySetInnerHTML={{ __html: identity.favicon.svgData }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Color Palette */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <Palette size={18} className="text-indigo-500" />
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Color Palette Definition</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase">Balanced Set • 05</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {identity.palette.map((color, i) => (
                      <div key={i} className="space-y-4 group">
                        <div 
                          className="h-32 rounded-xl border border-slate-100 shadow-sm relative transition-all group-hover:scale-[1.02]"
                          style={{ backgroundColor: color.hex }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-mono text-[10px] font-bold text-slate-400 uppercase">{color.hex}</p>
                          <h4 className="text-xs font-black text-slate-900 leading-tight">{color.name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">{color.usage}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typography pairing */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-10">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                      <TypeIcon size={18} className="text-indigo-500" />
                      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900">Typography System</h3>
                    </div>
                    <div className="space-y-12">
                      {identity.typography.map((font, i) => (
                        <div key={i} className="space-y-4 relative group">
                          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
                             <span className="w-4 h-[1px] bg-indigo-200"></span>
                             {font.role} • {font.fontName}
                          </p>
                          <h3 
                            className="text-4xl md:text-5xl leading-tight text-slate-900 tracking-tight"
                            style={{ fontFamily: `"${font.fontName}", serif` }}
                          >
                            The quick brown fox jumps over the lazy dog.
                          </h3>
                          <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest pt-2">
                             <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded">Bold</span>
                             <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded opacity-60">Medium</span>
                             <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded opacity-30">Light</span>
                             <span className="ml-auto italic lowercase opacity-50 font-normal normal-case">{font.rationale}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Usage Summary */}
                  <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl shadow-slate-300 relative overflow-hidden flex flex-col justify-between h-full min-h-[400px]">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center gap-2 opacity-50 mb-8">
                        <ShieldCheck size={16} />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Design Integrity</h4>
                      </div>
                      
                      {[
                        { title: "Core Purpose", text: "Communicate through minimalist geometry and balanced negative space." },
                        { title: "Color Contrast", text: "Maintain absolute legibility. Primary tones define the brand's weight." }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2 border-l-2 border-white/10 pl-6 py-1 hover:border-indigo-400 transition-colors">
                           <h5 className="text-xs font-bold text-white uppercase tracking-widest">{item.title}</h5>
                           <p className="text-sm text-white/60 leading-relaxed font-light">{item.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="relative z-10 pt-10 border-t border-white/5">
                       <p className="text-[9px] font-bold uppercase tracking-widest text-indigo-400 mb-2">Automated Guidelines</p>
                       <p className="text-[11px] text-white/40 italic leading-relaxed">
                         The identity generated for {identity.brandName} is optimized for high-density environments and professional output.
                       </p>
                    </div>
                  </div>
                </div>
              </main>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
