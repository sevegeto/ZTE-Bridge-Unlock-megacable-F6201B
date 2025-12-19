import React, { useState, useMemo } from 'react';
import { Wifi, Router, ShieldCheck, ArrowRight, AlertTriangle, RefreshCw, CheckCircle2, Trash2, PlusCircle, Code, Unlock, Compass, Zap, Radar, Ghost, Bot, Crosshair } from 'lucide-react';
import ConfigPanel from './components/ConfigPanel';
import ScriptViewer from './components/ScriptViewer';
import { generateBridgeScript, generateUnlockScript, generateBlindBridgeScript } from './utils/scriptGenerator';

const App: React.FC = () => {
  const [scriptMode, setScriptMode] = useState<'BRIDGE' | 'UNLOCK' | 'BLIND'>('BRIDGE');
  const [vlanEnabled, setVlanEnabled] = useState<boolean>(true);
  const [vlanId, setVlanId] = useState<string>('558');
  const [vlanPriority, setVlanPriority] = useState<string>('0');
  const [instanceName, setInstanceName] = useState<string>('BRIDGE');

  const script = useMemo(() => {
    if (scriptMode === 'UNLOCK') {
      return generateUnlockScript();
    }
    if (scriptMode === 'BLIND') {
      return generateBlindBridgeScript({
        vlanEnabled,
        vlanId: vlanId || '0',
        vlanPriority,
        instanceName
      });
    }
    return generateBridgeScript({
      vlanEnabled,
      vlanId: vlanId || '0',
      vlanPriority,
      instanceName
    });
  }, [scriptMode, vlanEnabled, vlanId, vlanPriority, instanceName]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 selection:bg-blue-500/30">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Router className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight">ZTE BridgeTool</h1>
              <p className="text-xs text-blue-400 font-medium">For Megacable F6xx Modems</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500 hidden sm:flex">
             <span>v3.6.0</span>
             <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
             <span className="flex items-center gap-1 text-green-400"><ShieldCheck size={14}/> Anti-Crash Active</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Configuration & Instructions */}
          <div className="lg:col-span-4 space-y-6">
            <ConfigPanel 
              scriptMode={scriptMode}
              setScriptMode={setScriptMode}
              vlanEnabled={vlanEnabled}
              setVlanEnabled={setVlanEnabled}
              vlanId={vlanId}
              setVlanId={setVlanId}
              vlanPriority={vlanPriority}
              setVlanPriority={setVlanPriority}
              instanceName={instanceName}
              setInstanceName={setInstanceName}
            />

            {scriptMode === 'BRIDGE' && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <ShieldCheck size={20} className="text-green-500"/> 
                  Auto-Inject Bridge Fix
                </h3>
                
                <div className="mb-5 space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">What the script does:</h4>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex gap-2 items-start">
                      <ShieldCheck size={14} className="text-blue-500 mt-1 shrink-0"/>
                      <span><strong>Anti-Crash:</strong> Neutralizes ZTE's <code>mtu_check_change</code> error to prevent script failures.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <Zap size={14} className="text-blue-500 mt-1 shrink-0"/>
                      <span><strong>Injects Option:</strong> If "Bridge" is missing from the dropdown, it creates and selects it automatically.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <Router size={14} className="text-blue-500 mt-1 shrink-0"/>
                      <span><strong>Sets VLAN:</strong> Configures ID {vlanEnabled ? vlanId : '(Off)'} required for ISP handshake.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 space-y-3">
                   <div className="flex gap-3 text-sm text-slate-300">
                    <div className="mt-0.5 text-red-400"><Trash2 size={16}/></div>
                    <span><strong>1. DELETE</strong> the failed 'BRIDGE' connection.</span>
                  </div>
                  <div className="flex gap-3 text-sm text-slate-300">
                     <div className="mt-0.5 text-blue-400"><PlusCircle size={16}/></div>
                    <span><strong>2. CLICK 'Create New Item'</strong>.</span>
                  </div>
                  <div className="flex gap-3 text-sm text-slate-300">
                     <div className="mt-0.5 text-green-400"><RefreshCw size={16}/></div>
                    <span><strong>3. RUN SCRIPT</strong> on the empty form.</span>
                  </div>
                </div>
              </div>
            )}

            {scriptMode === 'UNLOCK' && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <Radar size={20} className="text-blue-400"/> 
                  Menu Hunter v3.0
                </h3>
                
                <div className="mb-5 space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">What the script does:</h4>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex gap-2 items-start">
                      <Ghost size={14} className="text-blue-400 mt-1 shrink-0"/>
                      <span><strong>Reveals UI:</strong> Removes <code>display:none</code> from all hidden elements.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <Unlock size={14} className="text-blue-400 mt-1 shrink-0"/>
                      <span><strong>Enables Inputs:</strong> Unlocks read-only and disabled form fields.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <Compass size={14} className="text-blue-400 mt-1 shrink-0"/>
                      <span><strong>Deep Scan:</strong> Probes 15+ known ZTE hidden URLs (e.g., <code>wan_internet_lua.lua</code>) to find the config page.</span>
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-slate-400 border-t border-slate-700 pt-3">
                  Updated to automatically derive filenames from the current URL to find the hidden parent page.
                </p>
              </div>
            )}

            {scriptMode === 'BLIND' && (
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl border-pink-500/30 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-white font-bold flex items-center gap-2 mb-4 text-pink-400">
                  <Bot size={20}/> 
                  Protocol Droid v3.4
                </h3>
                
                 <div className="mb-5 space-y-2">
                  <h4 className="text-xs font-bold text-pink-500/70 uppercase tracking-wider">What the script does:</h4>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex gap-2 items-start">
                      <Zap size={14} className="text-pink-400 mt-1 shrink-0"/>
                      <span><strong>Session Hijack:</strong> Uses your active login token (`_sessionTOKEN`) to authorize requests.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <Crosshair size={14} className="text-pink-400 mt-1 shrink-0"/>
                      <span><strong>Matrix Attack:</strong> Targets 20+ endpoint combinations (`add`, `create`, `set`) against known files.</span>
                    </li>
                    <li className="flex gap-2 items-start">
                      <Code size={14} className="text-pink-400 mt-1 shrink-0"/>
                      <span><strong>Polyglot Payload:</strong> Sends both <code>Multipart/FormData</code> and <code>URL-Encoded</code> packets to bypass firewalls.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-pink-900/20 border border-pink-700/50 rounded-lg">
                  <p className="text-xs text-pink-200 mt-1">
                    <strong>Last Resort:</strong> Use this if you are stuck on 404/403 errors. It attempts to configure the modem blindly without seeing the form.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Code Output */}
          <div className="lg:col-span-8 flex flex-col min-h-[500px]">
             <div className="flex items-center gap-2 mb-2">
               <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                 {scriptMode === 'BRIDGE' ? 'Bridge Generator Script' : scriptMode === 'UNLOCK' ? 'SU Unlock & Menu Hunter' : 'Protocol Droid Script'}
               </span>
               <div className="h-px bg-slate-800 flex-grow"></div>
             </div>
             <ScriptViewer script={script} />
          </div>

        </div>
      </main>

      <footer className="border-t border-slate-800 mt-12 py-8 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-600 text-sm">
                Generated strictly client-side. No data is sent to any server.
            </p>
            <p className="text-slate-700 text-xs mt-2">
                Use at your own risk. This tool helps unlock hidden capabilities in the web UI.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;