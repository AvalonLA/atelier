
import React, { useState } from 'react';
import { allProducts } from './FeatureGrid';
import { Consultation } from '../types';

const mockConsultations: Consultation[] = [
  { id: '1', customerName: 'Julian Alvarez', productName: 'ROLLER BLACKOUT PRO', query: '¿Hacen envíos a CABA?', date: '2024-05-20', status: 'pending' },
  { id: '2', customerName: 'Enzo Fernandez', productName: 'SUNSCREEN ARCHITECTURAL', query: 'Necesito presupuesto para 3 ventanales.', date: '2024-05-19', status: 'responded' },
  { id: '3', customerName: 'Lionel Messi', productName: 'ZEBRA DUAL TECH', query: '¿Tienen stock en color gris ceniza?', date: '2024-05-18', status: 'pending' },
];

interface AdminPanelProps {
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'collection' | 'consultations' | 'settings'>('dashboard');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length > 0) setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center p-6 animate-in fade-in duration-500">
        <div className="max-w-md w-full p-12 border border-white/10 bg-neutral-900 shadow-2xl">
          <h2 className="font-futuristic text-xl tracking-[0.5em] text-center mb-12">ADMIN_ACCESS</h2>
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="font-futuristic text-[9px] tracking-widest text-neutral-500 block uppercase">PASS_PHRASE</label>
              <input 
                type="password" 
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border-b border-white/20 py-3 outline-none focus:border-white transition-colors text-sm font-light"
                placeholder="ANY_PASSWORD_WORKS"
              />
            </div>
            <button className="w-full py-4 bg-white text-black font-futuristic text-[10px] tracking-[0.3em] hover:bg-neutral-200 transition-colors">
              VERIFY_IDENTITY
            </button>
            <button type="button" onClick={onClose} className="w-full text-[9px] font-futuristic tracking-widest text-neutral-500 hover:text-white transition-colors">CANCEL</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black flex animate-in fade-in duration-700">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 flex flex-col p-8 h-full bg-[#050505]">
        <div className="mb-20">
          <h2 className="font-futuristic text-xl tracking-[0.3em]">MORK_OS</h2>
          <p className="text-[8px] font-futuristic tracking-[0.4em] text-neutral-600 mt-2">TERMINAL_ADMIN_v4.0</p>
        </div>
        
        <nav className="flex-1 space-y-6">
          {[
            { id: 'dashboard', label: 'DASHBOARD', icon: 'M4 6h16M4 12h16M4 18h16' },
            { id: 'collection', label: 'COLLECTION', icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z' },
            { id: 'consultations', label: 'CONSULTAS', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
            { id: 'settings', label: 'SETTINGS', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left font-futuristic text-[9px] tracking-[0.4em] flex items-center gap-4 transition-all py-2 ${activeTab === tab.id ? 'text-white translate-x-2' : 'text-neutral-600 hover:text-neutral-300'}`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d={tab.icon} /></svg>
              {tab.label}
            </button>
          ))}
        </nav>

        <button 
          onClick={onClose}
          className="mt-auto font-futuristic text-[9px] tracking-[0.4em] text-neutral-600 hover:text-white transition-colors flex items-center gap-4 py-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          LOGOUT
        </button>
      </aside>

      {/* Main Content */}
      <main data-lenis-prevent className="flex-1 p-20 overflow-y-auto bg-[#080808]">
        <div className="max-w-6xl">
          {activeTab === 'dashboard' && (
            <div className="space-y-16 animate-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <h2 className="text-6xl font-thin tracking-tighter">SISTEMA <br /><span className="opacity-40 italic">MÉTRICO.</span></h2>
                <span className="font-futuristic text-[10px] tracking-widest text-neutral-500">SYSTEM_UPTIME: 99.9%</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: 'VISITAS_MES', value: '14,203', change: '+12%' },
                  { label: 'QUERIES_AI', value: '2,481', change: '+24%' },
                  { label: 'CONVERSIONES', value: '4.2%', change: '-2%' }
                ].map((stat, i) => (
                  <div key={i} className="p-10 border border-white/5 bg-black/40">
                    <span className="font-futuristic text-[9px] tracking-widest text-neutral-600 block mb-4 uppercase">{stat.label}</span>
                    <div className="flex items-baseline gap-4">
                      <span className="text-4xl font-light tracking-tighter">{stat.value}</span>
                      <span className={`text-[10px] font-futuristic tracking-widest ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-64 border border-white/5 bg-black/20 flex items-center justify-center">
                <span className="font-futuristic text-[10px] tracking-[0.8em] text-neutral-700">VISUAL_ANALYTICS_PENDING_RECALIBRATION</span>
              </div>
            </div>
          )}

          {activeTab === 'collection' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-center border-b border-white/5 pb-8">
                <h2 className="text-4xl font-thin tracking-tighter uppercase">GESTIÓN_COLECCIÓN</h2>
                <button className="px-8 py-3 bg-white text-black font-futuristic text-[9px] tracking-widest hover:bg-neutral-200 transition-colors uppercase">AÑADIR_NUEVO</button>
              </div>
              
              <div className="space-y-1">
                {allProducts.map(p => (
                  <div key={p.id} className="group flex items-center gap-8 p-6 border border-white/5 bg-black/40 hover:bg-black hover:border-white/20 transition-all">
                    <img src={p.image} className="w-16 h-16 object-cover grayscale opacity-50 group-hover:opacity-100 transition-opacity" alt="" />
                    <div className="flex-1">
                      <h4 className="font-futuristic text-xs tracking-widest">{p.name}</h4>
                      <span className="text-[10px] text-neutral-600 font-futuristic uppercase tracking-widest">{p.category}</span>
                    </div>
                    <div className="flex gap-6">
                      <button className="font-futuristic text-[9px] tracking-widest text-neutral-500 hover:text-white transition-colors uppercase">EDITAR</button>
                      <button className="font-futuristic text-[9px] tracking-widest text-red-900 hover:text-red-500 transition-colors uppercase">ELIMINAR</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'consultations' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
               <div className="border-b border-white/5 pb-8">
                <h2 className="text-4xl font-thin tracking-tighter uppercase">CONSULTAS_INTERNAS</h2>
                <p className="font-futuristic text-[9px] tracking-widest text-neutral-600 mt-2">REGISTRO DE QUERIES DE CLIENTES</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-neutral-600">
                      <th className="pb-6 font-futuristic text-[9px] tracking-widest font-normal uppercase">CLIENTE</th>
                      <th className="pb-6 font-futuristic text-[9px] tracking-widest font-normal uppercase">PRODUCTO</th>
                      <th className="pb-6 font-futuristic text-[9px] tracking-widest font-normal uppercase">CONSULTA</th>
                      <th className="pb-6 font-futuristic text-[9px] tracking-widest font-normal uppercase">STATUS</th>
                      <th className="pb-6 font-futuristic text-[9px] tracking-widest font-normal uppercase">ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {mockConsultations.map(c => (
                      <tr key={c.id} className="group hover:bg-white/5 transition-colors">
                        <td className="py-6 font-light text-sm">{c.customerName}</td>
                        <td className="py-6 font-futuristic text-[10px] tracking-widest text-neutral-500">{c.productName}</td>
                        <td className="py-6 font-light text-sm text-neutral-400 max-w-xs truncate">{c.query}</td>
                        <td className="py-6">
                          <span className={`font-futuristic text-[8px] tracking-widest py-1 px-3 rounded-full border ${c.status === 'pending' ? 'border-yellow-900 text-yellow-500' : 'border-green-900 text-green-500'}`}>
                            {c.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-6">
                          <button className="font-futuristic text-[9px] tracking-widest text-neutral-500 hover:text-white">RESPONDER</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-700">
               <div className="border-b border-white/5 pb-8">
                <h2 className="text-4xl font-thin tracking-tighter uppercase">CORE_SETTINGS</h2>
                <p className="font-futuristic text-[9px] tracking-widest text-neutral-600 mt-2">CONFIGURACIÓN DE SISTEMAS GLOBALES</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="font-futuristic text-[9px] tracking-widest text-neutral-500 uppercase block">SITE_TITLE</label>
                    <input type="text" defaultValue="MORK | Futuristic Curtains" className="w-full bg-black border border-white/10 p-4 outline-none focus:border-white transition-colors text-sm font-light" />
                  </div>
                  <div className="space-y-4">
                    <label className="font-futuristic text-[9px] tracking-widest text-neutral-500 uppercase block">GLOBAL_THEME</label>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-white border border-white ring-2 ring-white ring-offset-2 ring-offset-black"></div>
                      <div className="w-12 h-12 bg-neutral-900 border border-white/20"></div>
                      <div className="w-12 h-12 bg-neutral-500 border border-white/20"></div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="font-futuristic text-[9px] tracking-widest text-neutral-500 uppercase block">AI_ASSISTANT_STATUS</label>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-5 bg-white rounded-full relative">
                        <div className="absolute top-1 right-1 w-3 h-3 bg-black rounded-full"></div>
                      </div>
                      <span className="text-[10px] font-futuristic tracking-widest text-green-500">OPERATIONAL</span>
                    </div>
                  </div>
                </div>

                <div className="p-10 border border-white/5 bg-black/40 h-fit">
                   <h4 className="font-futuristic text-[10px] tracking-widest mb-6 opacity-40">AUTO_BACKUP</h4>
                   <p className="text-xs font-light text-neutral-500 mb-8 leading-relaxed">Los cambios se sincronizan automáticamente con el núcleo neural cada 6 horas.</p>
                   <button className="w-full py-4 border border-white/20 font-futuristic text-[9px] tracking-widest hover:bg-white hover:text-black transition-all">FORCE_REINDEX</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
