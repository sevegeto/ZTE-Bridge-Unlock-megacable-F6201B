import React, { useState } from 'react';
import { Settings, Info, Unlock, Zap, AlertTriangle, Compass, Radar, Ghost, Bot, ExternalLink, ShieldAlert, Check, ChevronDown, ChevronUp, Monitor, Terminal, Key, HelpCircle, Power, Globe } from 'lucide-react';

interface ConfigPanelProps {
  scriptMode: 'BRIDGE' | 'UNLOCK' | 'BLIND';
  setScriptMode: (val: 'BRIDGE' | 'UNLOCK' | 'BLIND') => void;
  vlanEnabled: boolean;
  setVlanEnabled: (val: boolean) => void;
  vlanId: string;
  setVlanId: (val: string) => void;
  vlanPriority: string;
  setVlanPriority: (val: string) => void;
  instanceName: string;
  setInstanceName: (val: string) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  scriptMode,
  setScriptMode,
  vlanEnabled,
  setVlanEnabled,
  vlanId,
  setVlanId,
  vlanPriority,
  setVlanPriority,
  instanceName,
  setInstanceName
}) => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
      <div className="flex items-center gap-2 mb-6 text-blue-400">
        <Settings size={20} />
        <h2 className="text-xl font-bold text-white">Configuration</h2>
      </div>

      {/* Mode Switcher */}
      <div className="bg-slate-900 p-1 rounded-lg flex mb-6 border border-slate-700">
        <button
            onClick={() => setScriptMode('BRIDGE')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                scriptMode === 'BRIDGE' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
        >
            <Zap size={14} />
            <span className="hidden sm:inline">Bridge Gen</span>
            <span className="sm:hidden">Bridge</span>
        </button>
        <button
            onClick={() => setScriptMode('UNLOCK')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                scriptMode === 'UNLOCK' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
        >
            <Unlock size={14} />
            <span className="hidden sm:inline">SU Unlocker</span>
            <span className="sm:hidden">Unlock</span>
        </button>
        <button
            onClick={() => setScriptMode('BLIND')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                scriptMode === 'BLIND' 
                ? 'bg-pink-600 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white'
            }`}
        >
            <Bot size={14} />
            <span className="hidden sm:inline">Protocol Droid</span>
            <span className="sm:hidden">Droid</span>
        </button>
      </div>

      {scriptMode !== 'UNLOCK' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            {/* Instance Name Input */}
            <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
                Target Connection Name
            </label>
            <div className="relative">
                <input
                type="text"
                value={instanceName}
                onChange={(e) => setInstanceName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="BRIDGE"
                />
            </div>
            <p className="text-xs text-slate-500 mt-1">
                The name of the connection to configure (e.g. "BRIDGE").
            </p>
            </div>

            {/* VLAN Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div>
                <h3 className="text-white font-medium">Enable VLAN</h3>
                <p className="text-xs text-slate-500">Required for Megacable (ID: 558)</p>
            </div>
            <button
                onClick={() => setVlanEnabled(!vlanEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                vlanEnabled ? 'bg-blue-600' : 'bg-slate-600'
                }`}
            >
                <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    vlanEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
                />
            </button>
            </div>

            {/* VLAN Configuration Group */}
            {vlanEnabled && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300 grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                    VLAN ID
                </label>
                <input
                    type="number"
                    value={vlanId}
                    onChange={(e) => setVlanId(e.target.value)}
                    min="0"
                    max="4094"
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="558"
                />
                </div>
                <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                    802.1p (Priority)
                </label>
                <select
                    value={vlanPriority}
                    onChange={(e) => setVlanPriority(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                >
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((val) => (
                    <option key={val} value={val}>
                        {val}
                    </option>
                    ))}
                </select>
                </div>
            </div>
            )}

            {/* Warning Info */}
            {scriptMode === 'BRIDGE' && (
                <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-4 flex gap-3">
                <Info className="text-yellow-500 shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-yellow-200/80">
                    <p className="font-semibold mb-1">Conflict Resolution</p>
                    The script will automatically disable VLAN on "HSI" if it conflicts with your new "BRIDGE" connection (ID 558).
                </div>
                </div>
            )}
        </div>
      )}

      {scriptMode === 'UNLOCK' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                    <Radar size={18} className="text-blue-400"/>
                    Deep Scan Active
                </h3>
                <p className="text-sm text-slate-400">
                    The Unlocker now includes a "Menu Hunter" that actively probes for 15+ common ZTE configuration pages.
                </p>
             </div>
        </div>
      )}
      
      {/* Root/Advanced Resource Section */}
      <div className="mt-8 pt-6 border-t border-slate-700">
         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Resources & Root Methods</h3>
         <div className="bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden">
             <div className="p-4 bg-slate-900/80">
                <div className="flex items-start gap-2 mb-2">
                    <ShieldAlert className="text-orange-500 shrink-0 mt-0.5" size={16}/>
                    <p className="text-sm text-slate-300 font-semibold">Option 1: MAC Spoofing (Troubleshooting)</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                    Your logs show the MAC is correct (00-07...), but the modem is still rejecting the tool (Step 3 Failed). This usually means the modem is holding a "zombie session".
                </p>
                <div className="flex gap-2">
                     <button 
                        onClick={() => setShowGuide(!showGuide)}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-xs text-slate-300 transition-colors"
                     >
                         {showGuide ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                         {showGuide ? 'Hide Guide' : 'Open Troubleshooting Guide'}
                     </button>
                </div>
             </div>

             {showGuide && (
                 <div className="p-4 bg-black/20 border-t border-slate-800 text-xs space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                     
                     {/* Step 1 */}
                     <div className="space-y-2">
                         <div className="flex items-center gap-2 text-blue-400 font-bold">
                             <Monitor size={14}/>
                             <span>1. MAC Verification (Already Passed)</span>
                         </div>
                         <p className="pl-5 text-slate-400">Your physical address is correct: <code className="text-green-400">00-07-29-55-35-57</code></p>
                     </div>

                     {/* Step 2 */}
                     <div className="space-y-2">
                         <div className="flex items-center gap-2 text-red-400 font-bold">
                             <Globe size={14}/>
                             <span>2. The "Zombie Session" Fix</span>
                         </div>
                         <div className="pl-5 text-slate-400 space-y-2">
                             <p>The modem ignores the tool because it thinks a browser is already connected.</p>
                             <ul className="list-disc pl-4 space-y-1">
                                 <li><strong>Close ALL</strong> browser tabs pointing to <code className="bg-slate-950 px-1 rounded">192.168.1.1</code>.</li>
                                 <li>If you can, use a different browser or Incognito mode when you eventually log in.</li>
                             </ul>
                         </div>
                     </div>

                     {/* Step 3 */}
                     <div className="space-y-2">
                         <div className="flex items-center gap-2 text-yellow-400 font-bold">
                             <Power size={14}/>
                             <span>3. The Reboot Race (Critical)</span>
                         </div>
                         <ol className="list-decimal pl-5 text-slate-400 space-y-2 marker:text-slate-600">
                             <li><strong>Unplug the Fiber/Optical cable</strong> from the modem (prevents ISP updates).</li>
                             <li><strong>Power Cycle:</strong> Unplug the modem power, wait 10s, plug back in.</li>
                             <li>Wait for the <strong>LAN</strong> light to turn on.</li>
                             <li><strong>Run the tool IMMEDIATELY</strong>. Do not wait for the PON/Internet light.</li>
                             <li>Select <strong>Option 2 (EXE)</strong> immediately.</li>
                         </ol>
                     </div>

                     <div className="bg-slate-800/50 border border-slate-700 p-2 rounded text-slate-400 italic text-center mt-2">
                         If this fails, try disabling IPv6 in your network adapter properties temporarily.
                     </div>
                 </div>
             )}
         </div>
      </div>
    </div>
  );
};

export default ConfigPanel;