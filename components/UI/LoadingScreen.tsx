import React, { useState, useEffect, useRef } from 'react';
import { useProgress } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';

// 加载状态消息
const loadingMessages = [
  { threshold: 0, text: 'Establishing connection...' },
  { threshold: 10, text: 'Loading ship geometry...' },
  { threshold: 30, text: 'Processing materials...' },
  { threshold: 50, text: 'Applying textures...' },
  { threshold: 70, text: 'Compiling shaders...' },
  { threshold: 85, text: 'Finalizing render...' },
  { threshold: 95, text: 'Almost ready...' },
];

const LoadingScreen: React.FC = () => {
  const { progress, active } = useProgress();
  const [displayProgress, setDisplayProgress] = useState(0);
  const [fakeProgress, setFakeProgress] = useState(0);
  const lastRealProgress = useRef(0);
  const stuckTime = useRef(0);

  // 平滑插值 + 假进度逻辑
  useEffect(() => {
    if (!active) return;

    const interval = setInterval(() => {
      setDisplayProgress(prev => {
        // 检测是否卡住了（实际进度没变化）
        if (progress === lastRealProgress.current) {
          stuckTime.current += 50;
        } else {
          stuckTime.current = 0;
          lastRealProgress.current = progress;
        }

        // 计算目标进度
        let targetProgress = progress;

        // 如果卡住超过 500ms，开始添加假进度
        if (stuckTime.current > 500 && progress < 95) {
          // 假进度缓慢增加，但不会超过实际进度太多
          const fakeBonus = Math.min(
            (stuckTime.current - 500) * 0.002, // 每秒增加约4%的假进度
            Math.min(15, 95 - progress) // 最多比实际进度多15%，且不超过95%
          );
          setFakeProgress(fakeBonus);
          targetProgress = Math.min(progress + fakeBonus, 95);
        } else {
          setFakeProgress(0);
        }

        // 平滑插值到目标进度
        const diff = targetProgress - prev;
        if (Math.abs(diff) < 0.1) return targetProgress;
        
        // 进度增加时快一点，减少时慢一点（通常不会减少）
        const speed = diff > 0 ? 0.08 : 0.02;
        return prev + diff * speed;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [progress, active]);

  // 获取当前状态消息
  const currentMessage = [...loadingMessages]
    .reverse()
    .find(m => displayProgress >= m.threshold)?.text || loadingMessages[0].text;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black"
        >
          {/* Outer glow ring */}
          <div className="relative w-48 h-48 mb-8">
            {/* Pulsing background glow */}
            <motion.div
              className="absolute inset-0 rounded-full bg-cyan-500/10"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Background ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#1e293b"
                strokeWidth="2"
              />
              {/* Progress ring with smooth transition */}
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - (displayProgress / 100) * 283}
                className="drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
              />
              {/* Rotating activity indicator */}
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth="1"
                strokeDasharray="10 20"
                opacity={0.5}
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: 'center' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span 
                className="text-4xl font-bold text-cyan-400 font-mono drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {Math.round(displayProgress)}%
              </motion.span>
            </div>

            {/* Orbiting dot indicator */}
            <motion.div
              className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
              style={{
                top: '50%',
                left: '50%',
                marginTop: '-4px',
                marginLeft: '-4px',
              }}
              animate={{
                x: [0, 70, 0, -70, 0],
                y: [-70, 0, 70, 0, -70],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          {/* Loading text */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-cyan-100 tracking-widest uppercase mb-2 font-['Share_Tech_Mono']">
              INITIALIZING SYSTEMS
            </h2>
            <motion.p 
              key={currentMessage}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-slate-400 tracking-wider h-5"
            >
              {currentMessage}
            </motion.p>
          </div>

          {/* Data stream effect */}
          <div className="absolute left-8 top-1/4 bottom-1/4 w-px overflow-hidden opacity-30">
            <motion.div
              className="w-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent"
              style={{ height: '200%' }}
              animate={{ y: ['-50%', '0%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>
          <div className="absolute right-8 top-1/4 bottom-1/4 w-px overflow-hidden opacity-30">
            <motion.div
              className="w-full bg-gradient-to-b from-transparent via-cyan-500 to-transparent"
              style={{ height: '200%' }}
              animate={{ y: ['0%', '-50%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Animated scan line */}
          <motion.div
            className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
            initial={{ top: '20%' }}
            animate={{ top: '80%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
          />

          {/* Activity dots */}
          <div className="absolute bottom-20 flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-cyan-500"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-600/50" />
          <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-600/50" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-600/50" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-600/50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
