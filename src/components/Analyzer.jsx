import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Video, PlayCircle } from 'lucide-react';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || '';

export default function Analyzer() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [type, setType] = useState(''); // image | video
  const [loading, setLoading] = useState(false);
  const [detections, setDetections] = useState([]); // [{x,y,w,h,label,score}]
  const [useBackend, setUseBackend] = useState(false);
  const [status, setStatus] = useState('');

  const inputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onFiles = (f) => {
    const file = f?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      setStatus('Unsupported format. Please upload an image or video file.');
      return;
    }
    setFile(file);
    setType(isImage ? 'image' : 'video');
    setPreview(URL.createObjectURL(file));
    setDetections([]);
    setStatus('Ready to analyze');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFiles(e.dataTransfer.files);
  };

  const handleBrowse = () => inputRef.current?.click();

  const runMockDetection = async () => {
    if (type !== 'image') return [];
    // Create a few mock boxes for demo
    const count = Math.floor(Math.random() * 3) + 1;
    const boxes = Array.from({ length: count }).map(() => ({
      x: Math.random() * 0.6 + 0.1,
      y: Math.random() * 0.6 + 0.1,
      w: Math.random() * 0.3 + 0.15,
      h: Math.random() * 0.2 + 0.15,
      label: ['Fish', 'Jellyfish', 'Turtle', 'Crab'][Math.floor(Math.random() * 4)],
      score: Math.random() * 0.3 + 0.65,
    }));
    return boxes;
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setStatus('Analyzing...');
    try {
      let result = null;
      if (useBackend && BASE_URL) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch(`${BASE_URL}/api/analyze`, {
          method: 'POST',
          body: fd,
        });
        if (!res.ok) throw new Error(`Backend responded ${res.status}`);
        result = await res.json();
      } else {
        // Fallback to mock
        const boxes = await runMockDetection();
        result = { detections: boxes, species: [...new Set(boxes.map(b => b.label))] };
      }

      const payload = {
        id: crypto.randomUUID(),
        at: new Date().toISOString(),
        filename: file.name,
        type,
        detections: result.detections || [],
        species: result.species || [],
      };
      setDetections(payload.detections);
      persistHistory(payload);
      setStatus('Analysis complete');
    } catch (err) {
      console.error(err);
      setStatus('Analysis failed, showing demo results.');
      const boxes = await runMockDetection();
      setDetections(boxes);
    } finally {
      setLoading(false);
    }
  };

  const persistHistory = (entry) => {
    const key = 'mvai_history_v1';
    const prev = JSON.parse(localStorage.getItem(key) || '[]');
    prev.unshift(entry);
    localStorage.setItem(key, JSON.stringify(prev.slice(0, 20)));
  };

  return (
    <section id="analyze" className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Analyze Image or Video</h2>
          <p className="text-sm text-white/60">Drag & drop your media below. Bounding boxes and species will appear after analysis.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`px-2 py-1 rounded-md border ${BASE_URL ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10' : 'border-yellow-500/30 text-yellow-300 bg-yellow-500/10'}`}>
            {BASE_URL ? 'Backend detected' : 'Backend not configured'}
          </span>
          <label className={`inline-flex items-center gap-2 px-2 py-1 rounded-md border ${useBackend ? 'border-cyan-500/30 bg-cyan-500/10' : 'border-white/10 bg-white/5'}`}>
            <input type="checkbox" className="accent-cyan-500" checked={useBackend} onChange={(e) => setUseBackend(e.target.checked)} />
            Use AI backend
          </label>
        </div>
      </header>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="relative grid md:grid-cols-2 gap-6 p-4 rounded-2xl bg-white/5 border border-white/10"
      >
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-neutral-900/30 min-h-[260px] p-6 text-center">
          {preview ? (
            type === 'image' ? (
              <div className="w-full">
                <ImageWithBoxes src={preview} boxes={detections} />
              </div>
            ) : (
              <video src={preview} controls className="w-full rounded-lg border border-white/10" />
            )
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-white/5 border border-white/10">
                <Upload className="w-6 h-6 text-cyan-300" />
              </div>
              <div className="text-white/80">Drag & drop an image or video here</div>
              <div className="text-xs text-white/50">or</div>
              <div className="flex gap-2">
                <button onClick={handleBrowse} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm">
                  <ImageIcon className="w-4 h-4" /> Browse file
                </button>
                <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm cursor-pointer">
                  <Video className="w-4 h-4" /> Use camera
                  <input type="file" className="hidden" accept="image/*,video/*" capture onChange={(e) => onFiles(e.target.files)} />
                </label>
              </div>
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden" onChange={(e) => onFiles(e.target.files)} />
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl bg-neutral-900/50 border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white/60">Status</div>
                <div className="text-white/90 text-sm">{status || 'Waiting for media...'}</div>
              </div>
              <button
                disabled={!file || loading}
                onClick={analyze}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-600 disabled:opacity-50"
              >
                <PlayCircle className="w-4 h-4" /> {loading ? 'Analyzing...' : 'Analyze'}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-neutral-900/50 border border-white/10 p-4">
            <h4 className="font-medium mb-2">Detections</h4>
            {detections?.length ? (
              <ul className="space-y-2 text-sm">
                {detections.map((d, i) => (
                  <li key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-white/80">{d.label || 'Object'}</span>
                    <span className="text-white/60">{(d.score ? d.score * 100 : 0).toFixed(1)}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-white/60">No detections yet.</p>
            )}
          </div>

          <div className="rounded-xl bg-neutral-900/50 border border-white/10 p-4">
            <h4 className="font-medium mb-2">Tips</h4>
            <ul className="list-disc ml-5 text-sm text-white/70 space-y-1">
              <li>Higher resolution images improve detection quality.</li>
              <li>For videos, select short clips for faster processing.</li>
              <li>Toggle "Use AI backend" once the API URL is configured.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageWithBoxes({ src, boxes }) {
  const imgRef = useRef(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const onLoad = () => {
      if (!imgRef.current) return;
      setDims({ w: imgRef.current.clientWidth, h: imgRef.current.clientHeight });
    };
    const el = imgRef.current;
    if (el && el.complete) onLoad();
    el?.addEventListener('load', onLoad);
    return () => el?.removeEventListener('load', onLoad);
  }, [src]);

  return (
    <div className="relative w-full">
      <img ref={imgRef} src={src} alt="preview" className="w-full rounded-lg border border-white/10" />
      {boxes?.map((b, i) => (
        <div
          key={i}
          className="absolute border-2 rounded-md"
          style={{
            left: `${b.x * 100}%`,
            top: `${b.y * 100}%`,
            width: `${b.w * 100}%`,
            height: `${b.h * 100}%`,
            borderColor: 'rgba(34,211,238,0.9)',
            boxShadow: '0 0 0 2px rgba(34,211,238,0.2) inset',
          }}
        >
          <div className="absolute -top-6 left-0 text-xs px-2 py-0.5 rounded bg-cyan-500 text-black font-medium">
            {b.label || 'Object'} {b.score ? `· ${(b.score * 100).toFixed(0)}%` : ''}
          </div>
        </div>
      ))}
    </div>
  );
}
