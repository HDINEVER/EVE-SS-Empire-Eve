import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShipStats, ViewMode } from '../../types';
import { Layers, Shield, Zap, Crosshair, ChevronRight, Activity, Cpu, ChevronLeft } from 'lucide-react';

interface EveUIProps {
  stats: ShipStats;
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  isRotating: boolean;
  onToggleRotation: () => void;
}

// Hook to track window size
const useWindowSize = () => {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
};

const EveUI: React.FC<EveUIProps> = ({ stats, currentMode, onModeChange, isRotating, onToggleRotation }) => {
  const [activeTab, setActiveTab] = useState<'attributes' | 'fitting'>('attributes');
  const [leftHovered, setLeftHovered] = useState(false);
  const [rightHovered, setRightHovered] = useState(false);
  const { width } = useWindowSize();

  // Screen size breakpoints
  const isSmallScreen = width < 900;
  const isMediumScreen = width < 1200;

  // Panels auto-hide on small screens, show on hover
  const shouldAutoHide = isSmallScreen;

  // Calculate dynamic offset based on screen size and hover state
  const getLeftOffset = () => {
    if (!shouldAutoHide) return 0; // Always visible on large screens
    return leftHovered ? 0 : -240; // Hide when not hovered on small screens
  };

  const getRightOffset = () => {
    if (!shouldAutoHide) return 0; // Always visible on large screens
    return rightHovered ? 0 : 240; // Hide when not hovered on small screens
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-2 sm:p-4 md:p-6">
      
      {/* Top Header / System Info */}
      <motion.div 
        className="flex justify-between items-start pointer-events-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-1">
          <h1 className={`font-bold tracking-widest text-cyan-100 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] uppercase font-['Share_Tech_Mono'] ${isSmallScreen ? 'text-xl' : isMediumScreen ? 'text-2xl' : 'text-4xl'}`}>
            {stats.name}
          </h1>
          <div className={`flex items-center gap-2 text-cyan-500 font-semibold tracking-wider uppercase ${isSmallScreen ? 'text-[10px]' : 'text-sm'}`}>
            <span className="bg-cyan-950/50 px-2 py-0.5 border border-cyan-800 rounded-sm">{stats.class} Class</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="hidden sm:inline">{stats.manufacturer}</span>
          </div>
        </div>

        {/* Top Right: System Status */}
        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className={`bg-slate-900/80 backdrop-blur-md border border-slate-700/50 rounded-sm flex items-center gap-2 shadow-lg ${isSmallScreen ? 'p-2' : 'p-3 gap-3'}`}>
            <div className="flex flex-col items-end">
              <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase tracking-wider">System Integrity</span>
              <span className={`text-emerald-400 font-mono ${isSmallScreen ? 'text-sm' : 'text-lg'}`}>100%</span>
            </div>
            <Activity size={isSmallScreen ? 16 : 20} className="text-emerald-500 animate-pulse" />
          </div>
        </motion.div>
      </motion.div>

      {/* Center Reticle (Tactical Mode) */}
      <AnimatePresence>
        {currentMode === ViewMode.TACTICAL && (
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] border border-cyan-500/10 rounded-full pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-[280px] sm:w-[380px] md:w-[480px] h-[280px] sm:h-[380px] md:h-[480px] border border-dashed border-cyan-500/20 rounded-full animate-[spin_60s_linear_infinite]" />
            <div className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
            <div className="absolute left-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area: Left & Right Panels */}
      <div className="flex justify-between items-end h-full mt-4 relative">
        
        {/* Left Panel: Controls */}
        <motion.div 
          className="flex items-end gap-1 pointer-events-auto"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: getLeftOffset() }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          onMouseEnter={() => setLeftHovered(true)}
          onMouseLeave={() => setLeftHovered(false)}
        >
          <div className={`bg-slate-900/90 backdrop-blur-md border-l-2 border-cyan-600 shadow-[0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden ${isSmallScreen ? 'p-2 w-56' : 'p-4 w-72'}`}>
            {/* Decorative glitch lines */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-600 to-transparent opacity-50" />
            
            <h3 className={`text-cyan-400 uppercase tracking-widest mb-3 font-bold flex items-center gap-2 ${isSmallScreen ? 'text-xs' : 'text-sm mb-4'}`}>
              <Layers size={isSmallScreen ? 12 : 16} /> View Control
            </h3>
            
            <div className="flex flex-col gap-1 sm:gap-2">
              {(Object.keys(ViewMode) as Array<keyof typeof ViewMode>).map((modeKey) => (
                <motion.button
                  key={modeKey}
                  onClick={() => onModeChange(ViewMode[modeKey])}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    px-3 py-1.5 sm:px-4 sm:py-2 text-left text-xs sm:text-sm font-medium transition-colors duration-200 border border-transparent
                    ${currentMode === ViewMode[modeKey] 
                      ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50 shadow-[0_0_10px_rgba(8,145,178,0.2)]' 
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-cyan-200'}
                  `}
                >
                  <span className="flex items-center justify-between">
                    {ViewMode[modeKey]}
                    {currentMode === ViewMode[modeKey] && <ChevronRight size={isSmallScreen ? 10 : 14} />}
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-slate-700/50">
              <motion.button
                onClick={onToggleRotation}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-colors duration-200 border
                  ${isRotating
                    ? 'bg-amber-950/40 text-amber-500 border-amber-600/50' 
                    : 'bg-slate-800/50 text-slate-400 border-transparent hover:border-slate-600'}
                `}
              >
                {isRotating ? 'HALT ROTATION' : 'INITIATE ROTATION'}
              </motion.button>
            </div>
          </div>
          
          {/* Left Hover Trigger Area (visible on small screens when panel is hidden) */}
          {shouldAutoHide && !leftHovered && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-cyan-500/20 to-transparent flex items-center justify-center">
              <ChevronRight size={16} className="text-cyan-400 animate-pulse" />
            </div>
          )}
        </motion.div>

        {/* Right Panel: Ship Stats */}
        <motion.div 
          className="flex items-end gap-1 pointer-events-auto"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: getRightOffset() }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          onMouseEnter={() => setRightHovered(true)}
          onMouseLeave={() => setRightHovered(false)}
        >
          {/* Right Hover Trigger Area (visible on small screens when panel is hidden) */}
          {shouldAutoHide && !rightHovered && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-cyan-500/20 to-transparent flex items-center justify-center">
              <ChevronLeft size={16} className="text-cyan-400 animate-pulse" />
            </div>
          )}

          <div className={`bg-slate-900/90 backdrop-blur-md border border-slate-700 shadow-2xl overflow-hidden rounded-tl-xl ${isSmallScreen ? 'w-56' : isMediumScreen ? 'w-64' : 'w-80'}`}>
            {/* Header Tabs */}
            <div className="flex border-b border-slate-700">
              <motion.button 
                onClick={() => setActiveTab('attributes')}
                whileHover={{ backgroundColor: 'rgba(30, 41, 59, 1)' }}
                className={`flex-1 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'attributes' ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500'}`}
              >
                Attributes
              </motion.button>
              <motion.button 
                onClick={() => setActiveTab('fitting')}
                whileHover={{ backgroundColor: 'rgba(30, 41, 59, 1)' }}
                className={`flex-1 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'fitting' ? 'bg-slate-800 text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500'}`}
              >
                Fitting
              </motion.button>
            </div>

            <motion.div 
              className={`overflow-y-auto custom-scrollbar ${isSmallScreen ? 'p-2 max-h-[180px]' : 'p-4 max-h-[300px]'}`}
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {activeTab === 'attributes' ? (
                  <motion.div 
                    key="attributes"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 sm:space-y-4"
                  >
                    {/* Defense Group */}
                    <div>
                      <h4 className="text-[8px] sm:text-[10px] text-slate-500 uppercase font-bold mb-1.5 sm:mb-2 flex items-center gap-1">
                        <Shield size={isSmallScreen ? 8 : 10} /> Defense
                      </h4>
                      <StatRow label="Shield HP" value={stats.shield.toLocaleString()} unit="HP" barValue={70} color="bg-blue-500" isSmall={isSmallScreen} />
                      <StatRow label="Armor HP" value={stats.armor.toLocaleString()} unit="HP" barValue={45} color="bg-orange-500" isSmall={isSmallScreen} />
                      <StatRow label="Structure" value={stats.structure.toLocaleString()} unit="HP" barValue={30} color="bg-red-500" isSmall={isSmallScreen} />
                    </div>

                    {/* Engineering Group */}
                    <div>
                      <h4 className="text-[8px] sm:text-[10px] text-slate-500 uppercase font-bold mb-1.5 sm:mb-2 mt-2 sm:mt-4 flex items-center gap-1">
                        <Zap size={isSmallScreen ? 8 : 10} /> Capacitor
                      </h4>
                      <StatRow label="Capacity" value={stats.capacitor.toLocaleString()} unit="GJ" barValue={85} color="bg-yellow-500" isSmall={isSmallScreen} />
                      <StatRow label="Recharge" value="455" unit="s" isSmall={isSmallScreen} />
                    </div>

                    {/* Fitting Group */}
                    <div>
                      <h4 className="text-[8px] sm:text-[10px] text-slate-500 uppercase font-bold mb-1.5 sm:mb-2 mt-2 sm:mt-4 flex items-center gap-1">
                        <Cpu size={isSmallScreen ? 8 : 10} /> Fitting
                      </h4>
                      <StatRow label="CPU" value={stats.cpu} unit="tf" barValue={92} color="bg-purple-500" isSmall={isSmallScreen} />
                      <StatRow label="Powergrid" value={stats.powerGrid} unit="MW" barValue={64} color="bg-red-400" isSmall={isSmallScreen} />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="fitting"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5 sm:space-y-2"
                  >
                    <FittingItem icon={<Crosshair size={isSmallScreen ? 10 : 12} className="text-red-400"/>} name="200mm AutoCannon II" isSmall={isSmallScreen} />
                    <FittingItem icon={<Crosshair size={isSmallScreen ? 10 : 12} className="text-red-400"/>} name="200mm AutoCannon II" isSmall={isSmallScreen} />
                    <FittingItem icon={<Crosshair size={isSmallScreen ? 10 : 12} className="text-red-400"/>} name="Rocket Launcher II" isSmall={isSmallScreen} />
                    <FittingItem icon={<Zap size={isSmallScreen ? 10 : 12} className="text-yellow-400"/>} name="1MN Afterburner II" isSmall={isSmallScreen} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            {/* Bottom Cap/Status */}
            <div className={`bg-slate-950 border-t border-slate-700 flex justify-between items-center text-slate-500 font-mono ${isSmallScreen ? 'p-1.5 text-[8px]' : 'p-2 text-[10px]'}`}>
              <span>SIMULATION MODE</span>
              <span>ID: 99-AK-2</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Helper for stats
const StatRow: React.FC<{label: string, value: string, unit: string, barValue?: number, color?: string, isSmall?: boolean}> = ({label, value, unit, barValue, color = "bg-cyan-500", isSmall = false}) => (
  <motion.div 
    className={isSmall ? "mb-1" : "mb-2"}
    initial={{ opacity: 0, x: -5 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className={`flex justify-between font-mono ${isSmall ? 'text-[10px] mb-0' : 'text-xs mb-0.5'}`}>
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-200">{value} <span className="text-slate-500">{unit}</span></span>
    </div>
    {barValue !== undefined && (
      <div className="h-1 w-full bg-slate-800 rounded-sm overflow-hidden">
        <motion.div 
          className={`h-full ${color}`} 
          initial={{ width: 0 }}
          animate={{ width: `${barValue}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    )}
  </motion.div>
);

// Fitting item component
const FittingItem: React.FC<{icon: React.ReactNode, name: string, isSmall?: boolean}> = ({ icon, name, isSmall = false }) => (
  <motion.div 
    className={`text-slate-400 flex items-center justify-between bg-slate-800/50 rounded border border-slate-700 ${isSmall ? 'p-1.5 text-[10px]' : 'p-2 text-xs'}`}
    whileHover={{ scale: 1.02, backgroundColor: 'rgba(51, 65, 85, 0.7)' }}
    transition={{ duration: 0.2 }}
  >
    <span className="flex items-center gap-1.5 sm:gap-2">{icon} {name}</span>
    <span className="text-emerald-400">ONLINE</span>
  </motion.div>
);

export default EveUI;