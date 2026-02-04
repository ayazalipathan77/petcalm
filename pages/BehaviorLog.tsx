import React, { useState } from 'react';
import { Incident } from '../types';
import { TRIGGERS } from '../constants';
import { Button } from '../components/ui/Button';
import { getBehaviorAnalysis } from '../services/geminiService';
import { Plus, BarChart2, Calendar, BrainCircuit } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BehaviorLogProps {
  incidents: Incident[];
  onAddIncident: (incident: Incident) => void;
  petName: string;
}

export const BehaviorLog: React.FC<BehaviorLogProps> = ({ incidents, onAddIncident, petName }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // New Incident Form State
  const [newSeverity, setNewSeverity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [newTrigger, setNewTrigger] = useState(TRIGGERS[0]);
  const [newNotes, setNewNotes] = useState('');

  const handleSave = () => {
    const newIncident: Incident = {
      id: Math.random().toString(),
      date: new Date().toISOString(),
      trigger: newTrigger,
      severity: newSeverity,
      notes: newNotes
    };
    onAddIncident(newIncident);
    setShowAddModal(false);
    // Reset form
    setNewSeverity(3);
    setNewTrigger(TRIGGERS[0]);
    setNewNotes('');
  };

  const handleAiAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await getBehaviorAnalysis(incidents, petName);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  // Prepare chart data
  const data = incidents.slice(0, 7).reverse().map(i => ({
    name: new Date(i.date).toLocaleDateString('en-US', { weekday: 'short' }),
    severity: i.severity
  }));

  return (
    <div className="pb-24 pt-6 px-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-text">Behavior Log</h1>
        <button onClick={() => setShowAddModal(true)} className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors">
          <Plus size={24} />
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm mb-6 h-48">
        <h3 className="text-xs font-bold text-neutral-subtext uppercase tracking-wider mb-2">Severity Trend (Last 7)</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="severity" radius={[4, 4, 4, 4]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.severity > 3 ? '#E74C3C' : '#5B8A72'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* AI Analysis Button */}
      {!aiAnalysis && (
        <Button
          variant="accent"
          fullWidth
          onClick={handleAiAnalysis}
          isLoading={isAnalyzing}
          className="mb-6 flex items-center justify-center gap-2"
        >
          <BrainCircuit size={18} />
          Analyze Patterns with AI
        </Button>
      )}

      {/* AI Result Card */}
      {aiAnalysis && (
        <div className="bg-gradient-to-br from-accent-light/20 to-white p-5 rounded-2xl border border-accent/30 mb-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-2 text-accent-dark font-bold">
            <BrainCircuit size={18} />
            <h3>AI Insights</h3>
          </div>
          <p className="text-sm text-neutral-text leading-relaxed whitespace-pre-line">{aiAnalysis}</p>
          <button onClick={() => setAiAnalysis(null)} className="text-xs text-neutral-400 mt-2 underline">Close</button>
        </div>
      )}

      {/* List */}
      <h3 className="text-xs font-bold text-neutral-subtext uppercase tracking-wider mb-3">Recent Incidents</h3>
      <div className="space-y-3">
        {incidents.map(incident => (
          <div key={incident.id} className="bg-white p-4 rounded-xl border border-neutral-100 flex gap-4">
            <div className={`w-12 h-12 rounded-full flex flex-col items-center justify-center text-white font-bold text-sm ${incident.severity >= 4 ? 'bg-status-error' : incident.severity === 3 ? 'bg-status-warning' : 'bg-status-success'
              }`}>
              {incident.severity}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-neutral-text">{incident.trigger}</h4>
                <span className="text-[10px] text-neutral-400">{new Date(incident.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-neutral-subtext mt-1">{incident.notes}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center animate-fade-in sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl flex flex-col max-h-[85vh] animate-slide-up shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="p-6 pb-2 flex-shrink-0">
              <h2 className="text-xl font-bold">Log Incident</h2>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 py-2 overflow-y-auto flex-1 min-h-0">
              <label className="block text-sm text-neutral-subtext mb-2">Trigger</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {TRIGGERS.slice(0, 5).map(t => (
                  <button
                    key={t}
                    onClick={() => setNewTrigger(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${newTrigger === t ? 'bg-primary text-white border-primary' : 'border-neutral-200 text-neutral-600 hover:border-primary/50'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <label className="block text-sm text-neutral-subtext mb-2">Severity (1-5)</label>
              <div className="px-1 mb-4">
                <input
                  type="range" min="1" max="5"
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(Number(e.target.value) as any)}
                  className="w-full accent-primary mb-2 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-neutral-400 font-medium">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Panic</span>
                </div>
              </div>

              <label className="block text-sm text-neutral-subtext mb-2">Notes</label>
              <textarea
                className="w-full border border-neutral-200 rounded-xl p-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none mb-2 bg-white text-gray-900 resize-none"
                rows={4}
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="What happened? (Optional)"
              />
            </div>

            {/* Modal Footer (Sticky) */}
            <div className="p-6 pt-4 flex-shrink-0 bg-white border-t border-neutral-100 pb-8 sm:pb-6">
              <div className="flex gap-3">
                <Button variant="ghost" fullWidth onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button fullWidth onClick={handleSave}>Save Log</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};