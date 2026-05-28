import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Power, RefreshCw, X } from 'lucide-react';

const nodes = [
  { id: 1, name: 'RU-MOW-01', city: 'Москва', country: 'Россия', flag: '🇷🇺', ip: '45.12.xx.xx', cpu: 32, ram: 41, traffic: '8.2 ТБ', users: 284, status: 'active', load: 28 },
  { id: 2, name: 'NL-AMS-01', city: 'Амстердам', country: 'Нидерланды', flag: '🇳🇱', ip: '185.x.xx.xx', cpu: 54, ram: 62, traffic: '12.7 ТБ', users: 412, status: 'active', load: 42 },
  { id: 3, name: 'DE-FRA-01', city: 'Франкфурт', country: 'Германия', flag: '🇩🇪', ip: '194.xx.xx.x', cpu: 38, ram: 44, traffic: '6.4 ТБ', users: 318, status: 'active', load: 35 },
  { id: 4, name: 'SE-STO-01', city: 'Стокгольм', country: 'Швеция', flag: '🇸🇪', ip: '213.xx.xx.x', cpu: 18, ram: 24, traffic: '3.1 ТБ', users: 142, status: 'active', load: 18 },
  { id: 5, name: 'US-NYC-01', city: 'Нью-Йорк', country: 'США', flag: '🇺🇸', ip: '104.xx.xx.x', cpu: 71, ram: 78, traffic: '19.8 ТБ', users: 621, status: 'active', load: 55 },
  { id: 6, name: 'JP-TKY-01', city: 'Токио', country: 'Япония', flag: '🇯🇵', ip: '157.xx.xx.x', cpu: 0, ram: 0, traffic: '0', users: 0, status: 'offline', load: 0 },
];

export default function AdminNodes() {
  const [selectedNode, setSelectedNode] = useState(null);

  const getLoadColor = (load) => {
    if (load < 40) return '#30D158';
    if (load < 70) return '#FFD60A';
    return '#FF453A';
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-start justify-between mb-6 gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1" style={{ color: '#F5F5F7', letterSpacing: '-0.02em' }}>Ноды</h1>
          <p className="text-sm" style={{ color: '#98989D' }}>Управление серверной инфраструктурой</p>
        </div>
        <button
          className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl text-sm font-medium flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #0A84FF, #5E5CE6)', color: 'white' }}
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Добавить ноду</span>
          <span className="sm:hidden">Добавить</span>
        </button>
      </div>

      {/* Network topology visualization */}
      <div className="glass-card p-6 rounded-2xl mb-6 relative overflow-hidden" style={{ height: 200 }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="0 0 600 180">
            {/* Central hub */}
            <circle cx="300" cy="90" r="16" fill="rgba(10,132,255,0.2)" stroke="#0A84FF" strokeWidth="2" />
            <text x="300" y="95" textAnchor="middle" fill="#0A84FF" fontSize="9" fontWeight="bold">HUB</text>

            {/* Node positions */}
            {[
              { x: 120, y: 40, name: 'MOW' },
              { x: 200, y: 140, name: 'AMS' },
              { x: 400, y: 50, name: 'FRA' },
              { x: 480, y: 130, name: 'STO' },
              { x: 90, y: 130, name: 'NYC' },
              { x: 510, y: 50, name: 'TKY' },
            ].map((node, i) => {
              const n = nodes[i];
              const isOffline = n?.status === 'offline';
              const loadColor = isOffline ? '#FF453A' : getLoadColor(n?.load || 0);
              return (
                <g key={i}>
                  <motion.line
                    x1={300} y1={90} x2={node.x} y2={node.y}
                    stroke={isOffline ? 'rgba(255,69,58,0.2)' : 'rgba(10,132,255,0.15)'}
                    strokeWidth={isOffline ? 1 : Math.max(1, (n?.load || 0) / 20)}
                    strokeDasharray="4,3"
                    animate={!isOffline ? { opacity: [0.3, 0.7, 0.3] } : {}}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                  <circle cx={node.x} cy={node.y} r="14" fill={`${loadColor}18`} stroke={loadColor} strokeWidth="1.5" />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" fill={loadColor} fontSize="7" fontWeight="bold">{node.name}</text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="absolute top-4 left-4 text-xs font-medium" style={{ color: '#98989D' }}>Топология сети</div>
      </div>

      {/* Nodes grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {nodes.map((node, i) => {
          const loadColor = node.status === 'offline' ? '#FF453A' : getLoadColor(node.load);
          return (
            <motion.button
              key={node.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedNode(node)}
              className="glass-card p-5 rounded-2xl text-left"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{node.flag}</span>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: '#F5F5F7' }}>{node.name}</div>
                    <div className="text-xs" style={{ color: '#98989D' }}>{node.city}, {node.country}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ background: node.status === 'active' ? '#30D158' : '#FF453A' }}
                    animate={node.status === 'active' ? { opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-xs" style={{ color: node.status === 'active' ? '#30D158' : '#FF453A' }}>
                    {node.status === 'active' ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>

              {node.status === 'active' && (
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'CPU', value: `${node.cpu}%`, color: getLoadColor(node.cpu) },
                    { label: 'RAM', value: `${node.ram}%`, color: getLoadColor(node.ram) },
                    { label: 'Нагр.', value: `${node.load}%`, color: loadColor },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="text-xs mb-1" style={{ color: '#98989D' }}>{label}</div>
                      <div className="text-sm font-bold font-mono" style={{ color }}>{value}</div>
                      <div className="mt-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: value, background: color, opacity: 0.7 }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-xs" style={{ color: '#98989D' }}>
                <span>{node.users} пользователей</span>
                <span>Трафик: {node.traffic}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Node detail panel */}
      <AnimatePresence>
        {selectedNode && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setSelectedNode(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 p-6 overflow-y-auto"
              style={{ background: 'rgba(18,18,20,0.99)', borderLeft: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold" style={{ color: '#F5F5F7' }}>{selectedNode.name}</h3>
                <button onClick={() => setSelectedNode(null)}><X size={18} color="#98989D" /></button>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  ['IP адрес', selectedNode.ip],
                  ['Местоположение', `${selectedNode.city}, ${selectedNode.country}`],
                  ['Пользователи', selectedNode.users],
                  ['Трафик', selectedNode.traffic],
                  ['CPU', `${selectedNode.cpu}%`],
                  ['RAM', `${selectedNode.ram}%`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <span className="text-sm" style={{ color: '#98989D' }}>{k}</span>
                    <span className="text-sm font-medium font-mono" style={{ color: '#F5F5F7' }}>{v}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {[
                  { icon: Power, label: selectedNode.status === 'active' ? 'Отключить' : 'Включить', color: selectedNode.status === 'active' ? '#FF453A' : '#30D158' },
                  { icon: RefreshCw, label: 'Перезагрузить', color: '#FFD60A' },
                ].map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium"
                    style={{ background: `${color}14`, color, border: `1px solid ${color}30` }}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}