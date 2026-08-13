import { useEffect, useMemo, useRef, useState } from "react";
import { checkHealth, predictDisease } from "./api";
import CaseStudy from "./CaseStudy";
import "./App.css";

const DISEASE_COPY = {
  "Early Blight": {
    tone: "early",
    summary:
      "Concentric fungal rings typically start on older leaves. Remove infected foliage and improve airflow.",
  },
  "Late Blight": {
    tone: "late",
    summary:
      "Fast-spreading water-soaked lesions. Isolate affected plants quickly in cool, wet conditions.",
  },
  Healthy: {
    tone: "healthy",
    summary: "Leaf tissue looks clear of blight signals. Keep monitoring after rain or heavy irrigation.",
  },
};

const ACCEPT =
  ".jpg,.jpeg,.jfif,.png,.bmp,.webp,.gif,.tif,.tiff,.ico,image/jpeg,image/png,image/bmp,image/webp,image/gif,image/tiff,image/x-icon";

const ALLOWED_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".jfif",
  ".png",
  ".bmp",
  ".webp",
  ".gif",
  ".tif",
  ".tiff",
  ".ico",
]);

function confidencePct(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function fileExtension(name = "") {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i).toLowerCase() : "";
}

function ConfidenceRing({ value, tone }) {
  const size = 148;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(Math.max(value, 0), 1));

  return (
    <div className={`ring ring-${tone}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle className="ring-track" cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} />
        <circle
          className="ring-value"
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="ring-label">
        <strong>{confidencePct(value)}</strong>
        <span>confidence</span>
      </div>
    </div>
  );
}

export default function App() {
  const inputRef = useRef(null);
  const resultRef = useRef(null);
  const [tab, setTab] = useState("detect");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [apiReady, setApiReady] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    checkHealth()
      .then((data) => setApiReady(Boolean(data.model_loaded)))
      .catch(() => setApiReady(false));
  }, []);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (result && resultRef.current && tab === "detect") {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result, tab]);

  const meta = useMemo(() => (result ? DISEASE_COPY[result.label] : null), [result]);

  function acceptFile(next) {
    if (!next) return;
    const ext = fileExtension(next.name);
    if (ext && !ALLOWED_EXT.has(ext)) {
      setError(`Unsupported type "${ext}". Use JPG, JPEG, JFIF, PNG, BMP, WEBP, GIF, TIF, TIFF, or ICO.`);
      return;
    }
    setFile(next);
    setResult(null);
    setError("");
  }

  function onDrop(event) {
    event.preventDefault();
    setDragOver(false);
    acceptFile(event.dataTransfer.files?.[0]);
  }

  async function onAnalyze() {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await predictDisease(file);
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function onReset() {
    setFile(null);
    setResult(null);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="shell">
      <div className="atmosphere" aria-hidden="true">
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />
        <svg className="leaf-field" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="leafFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a7a45" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#0f766e" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <path
            className="leaf-shape leaf-1"
            fill="url(#leafFill)"
            d="M780 120c120 40 210 160 190 300-30 190-220 300-380 250-90-30-150-110-170-200-20-90 10-190 90-250 70-55 170-90 270-100z"
          />
          <path
            className="leaf-shape leaf-2"
            fill="url(#leafFill)"
            d="M180 420c150-120 340-80 420 40 70 110 40 270-80 340-140 80-320 20-380-120-40-90-10-190 40-260z"
          />
          <path
            className="vein"
            d="M760 160c-20 90-70 180-150 250M700 280c60 20 110 70 140 130M640 360c50 35 80 90 90 150"
          />
        </svg>
      </div>

      <header className="nav">
        <div className="nav-brand">
          <span className="mark" aria-hidden="true" />
          <span>AetherLeaf</span>
        </div>
        <nav className="nav-tabs" aria-label="Primary">
          <button
            type="button"
            className={tab === "detect" ? "tab active" : "tab"}
            onClick={() => setTab("detect")}
          >
            Detect
          </button>
          <button
            type="button"
            className={tab === "case" ? "tab active" : "tab"}
            onClick={() => setTab("case")}
          >
            Case study
          </button>
        </nav>
        <p className={`live ${apiReady ? "on" : apiReady === false ? "off" : ""}`}>
          <span className="dot" />
          {apiReady === null ? "Warming up" : apiReady ? "Model live" : "API offline"}
        </p>
      </header>

      <main>
        {tab === "case" ? (
          <CaseStudy />
        ) : (
          <>
            <section className="hero">
              <div className="hero-copy">
                <p className="eyebrow">Potato leaf intelligence</p>
                <h1 className="brand-hero">AetherLeaf</h1>
                <p className="lede">
                  Drop a leaf photo. Our CNN model reads Early Blight, Late Blight, or Healthy in
                  seconds.
                </p>
                <div className="cta-row">
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() => inputRef.current?.click()}
                  >
                    Upload leaf image
                  </button>
                </div>
              </div>

              <div
                className={`stage ${dragOver ? "dragging" : ""} ${preview ? "filled" : ""} ${loading ? "scanning" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPT}
                  hidden
                  onChange={(e) => acceptFile(e.target.files?.[0])}
                />

                {!preview ? (
                  <button
                    type="button"
                    className="stage-empty"
                    onClick={() => inputRef.current?.click()}
                  >
                    <span className="pulse" aria-hidden="true" />
                    <strong>Drag & drop anywhere here</strong>
                    <span>or click to browse from your device</span>
                  </button>
                ) : (
                  <div className="stage-filled">
                    <div className="frame">
                      <img src={preview} alt="Selected potato leaf" />
                      {loading && <div className="scanline" aria-hidden="true" />}
                    </div>
                    <div className="stage-actions">
                      <button
                        type="button"
                        className="btn primary"
                        onClick={onAnalyze}
                        disabled={loading}
                      >
                        {loading ? "Reading leaf…" : "Analyze now"}
                      </button>
                      <button
                        type="button"
                        className="btn ghost"
                        onClick={onReset}
                        disabled={loading}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {error && <p className="error">{error}</p>}

            {result && (
              <section
                ref={resultRef}
                className={`verdict tone-${meta?.tone || "healthy"}`}
                aria-live="polite"
              >
                <div className="verdict-top">
                  <ConfidenceRing value={result.confidence} tone={meta?.tone || "healthy"} />
                  <div>
                    <p className="verdict-kicker">Diagnosis</p>
                    <h2>{result.label}</h2>
                    <p className="verdict-copy">{meta?.summary}</p>
                  </div>
                </div>

                <ul className="scores">
                  {result.probabilities.map((item, index) => (
                    <li key={item.class_id} style={{ "--i": index }}>
                      <div className="score-meta">
                        <span>{item.label}</span>
                        <strong>{confidencePct(item.confidence)}</strong>
                      </div>
                      <div className="score-bar">
                        <span style={{ width: `${item.confidence * 100}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </main>

      <footer className="foot">
        <p>Built on our trained Keras model. Works with camera photos, downloads, and browser uploads</p>
      </footer>
    </div>
  );
}
