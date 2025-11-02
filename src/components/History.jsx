import React, { useEffect, useMemo, useState } from 'react';
import { History as HistoryIcon } from 'lucide-react';

export default function History() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const key = 'mvai_history_v1';
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    setItems(data);
  }, []);

  const clear = () => {
    localStorage.setItem('mvai_history_v1', '[]');
    setItems([]);
  };

  return (
    <section id="history" className="space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <HistoryIcon className="w-5 h-5 text-fuchsia-300" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Analysis history</h3>
            <p className="text-sm text-white/60">Recently analyzed files are stored on your device.</p>
          </div>
        </div>
        <button onClick={clear} className="px-3 py-1.5 text-sm rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">
          Clear
        </button>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-white/60">
          No history yet. Analyze an image to see it here.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.id} className="rounded-xl border border-white/10 bg-neutral-900/50 p-4">
              <div className="text-sm text-white/50">{new Date(it.at).toLocaleString()}</div>
              <div className="font-medium mt-1">{it.filename}</div>
              <div className="text-sm text-white/70 mt-2 flex flex-wrap gap-1">
                {it.species?.length ? it.species.map((s, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white/5 border border-white/10">{s}</span>
                )) : <span className="text-white/50">No species listed</span>}
              </div>
              <div className="text-xs text-white/50 mt-2">{it.detections?.length || 0} detections</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
