import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const springConfig = { type: 'spring', stiffness: 300, damping: 30 };

export default function ServerGlobe({ selectedServer, onSelect }) {
  // Simple visual globe representation (Three.js would be ideal but keeping it simple)
  const nodePositions = [
    { city: 'Москва', country: 'Россия', flag: '🇷🇺', ping: 12, load: 28, x: 62, y: 28 },
    { city: 'Амстердам', country: 'Нидерланды', flag: '🇳🇱', ping: 45, load: 42, x: 50, y: 28 },
    { city: 'Франкфурт', country: 'Германия', flag: '🇩🇪', ping: 52, load: 35, x: 52, y: 33 },
    { city: 'Стокгольм', country: 'Швеция', flag: '🇸🇪', ping: 67, load: 18, x: 54, y: 24 },
    { city: 'Нью-Йорк', country: 'США', flag: '🇺🇸', ping: 120, load: 55, x: 25, y: 38 },
  ];

  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'rgba(28,28,30,0.6)',
        border: '1px solid rgba(255,255,255,0.06)',
        height: '160px',
      }}
    >
      {/* Globe SVG background */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice">
        {/* Grid lines */}
        {[15, 30, 45, 60, 75].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        ))}
        {[15, 30, 45].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
        ))}

        {/* Continent silhouettes (simplified) */}
        <path d="M55 20 L65 20 L68 25 L65 28 L62 30 L58 28 L55 25 Z" fill="rgba(255,255,255,0.06)" />
        <path d="M48 22 L55 22 L55 30 L50 32 L47 28 Z" fill="rgba(255,255,255,0.06)" />
        <path d="M20 30 L35 28 L38 35 L32 40 L22 38 Z" fill="rgba(255,255,255,0.06)" />
        <path d="M68 32 L80 30 L82 38 L74 42 L67 40 Z" fill="rgba(255,255,255,0.06)" />

        {/* Connection lines to selected server */}
        {nodePositions.map((node, i) => (
          node.city === selectedServer?.city ? null : (
            <line
              key={i}
              x1={node.x} y1={node.y}
              x2={selectedServer ? nodePositions.find(n => n.city === selectedServer.city)?.x || 50 : 50}
              y2={selectedServer ? nodePositions.find(n => n.city === selectedServer.city)?.y || 30 : 30}
              stroke="rgba(10,132,255,0.08)"
              strokeWidth="0.3"
              strokeDasharray="1,2"
            />
          )
        ))}

        {/* Node points */}
        {nodePositions.map((node, i) => {
          const isSelected = selectedServer?.city === node.city;
          return (
            <g key={i} onClick={() => onSelect(node)} style={{ cursor: 'pointer' }}>
              {isSelected && (
                <>
                  <circle cx={node.x} cy={node.y} r="5" fill="rgba(10,132,255,0.15)" />
                  <circle cx={node.x} cy={node.y} r="3" fill="rgba(10,132,255,0.25)" />
                </>
              )}
              <circle
                cx={node.x} cy={node.y} r="2"
                fill={isSelected ? '#0A84FF' : '#98989D'}
                opacity={isSelected ? 1 : 0.7}
              />
            </g>
          );
        })}
      </svg>

      {/* Selected server info overlay */}
      {selectedServer && (
        <motion.div
          key={selectedServer.city}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={springConfig}
          className="absolute bottom-3 left-3 right-3 p-3 rounded-xl"
          style={{ background: 'rgba(28,28,30,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedServer.flag}</span>
              <div>
                <div className="text-sm font-semibold" style={{ color: '#F5F5F7' }}>{selectedServer.city}</div>
                <div className="text-xs" style={{ color: '#98989D' }}>{selectedServer.country}</div>
              </div>
            </div>
            <div className="flex gap-4 text-right">
              <div>
                <div className="text-xs font-mono font-bold" style={{ color: '#0A84FF' }}>{selectedServer.ping} мс</div>
                <div className="text-xs" style={{ color: '#98989D' }}>Пинг</div>
              </div>
              <div>
                <div className="text-xs font-medium" style={{ color: selectedServer.load > 70 ? '#FF453A' : '#30D158' }}>
                  {selectedServer.load}%
                </div>
                <div className="text-xs" style={{ color: '#98989D' }}>Нагр.</div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}