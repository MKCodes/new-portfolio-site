"use client";

import { useState, useEffect, useRef } from "react";

// ✏️ UPDATE THIS WHENEVER YOU START SOMETHING NEW
// Set title to null to show the idle/resting state
const CURRENT_BUILD = {
  title: null,
  status: null,
  started: null,
  desc: null,
  stack: [],
  progress: 0,
  log: [],
};

const PROJECTS = [
  {
    id: 1,
    tag: "Graphics · Systems",
    title: "Ray Tracer",
    year: "2026",
    desc: "Built a physically-based ray tracer from scratch — ray-sphere intersections, diffuse reflections, recursive light transport, and a full camera model. Every pixel computed from first principles.",
    stack: ["C++", "Linear Algebra", "Rendering Pipeline", "Recursive Algorithms"],
    accent: "#f97316",
    symbol: "◈",
  },
  {
    id: 2,
    tag: "AI · Full-Stack",
    title: "AI Career Coach",
    year: "2025",
    desc: "Generates tailored resumes and cover letters from job descriptions and your profile using Gemini AI. Background jobs via Inngest, persistent state with Prisma + PostgreSQL.",
    stack: ["Next.js", "Prisma", "Inngest", "Gemini", "PostgreSQL"],
    accent: "#a78bfa",
    symbol: "⬡",
  },
  {
    id: 3,
    tag: "Full-Stack · Web",
    title: "Hotel Booking Platform",
    year: "2023",
    desc: "Full-stack booking system with user auth, hotel search, real-time availability, and secure reservations. REST APIs with dynamic filtering, protected routes, and persistent state.",
    stack: ["MongoDB", "Express", "React", "Node.js", "JWT", "REST"],
    accent: "#34d399",
    symbol: "▣",
  },
];

const EXPERIENCES = [
  {
    id: 1,
    company: "Royal Bank of Canada",
    sub: "Borealis AI",
    role: "Software Engineer Intern",
    period: "May 2025 – Aug 2025",
    location: "Toronto, ON",
    accent: "#0ea5e9",
    logo: "RBC",
    bullets: [
      "Deployed observability platform on RBC AI Farm using Prometheus & AWS Grafana — 50% faster mean time to recovery.",
      "Automated CI/CD pipeline via GitHub Actions for ML model lifecycle, accelerating deployments 40% across 5+ teams.",
      "Built SSH access system for Run:AI containers with Docker & OpenShift, cutting setup time by 50% for 5+ teams.",
      "Validated cross-region S3 replication via AWS CLI & Python, ensuring sub-second latency and 100% object consistency.",
    ],
  },
  {
    id: 2,
    company: "Royal Bank of Canada",
    sub: "Borealis AI",
    role: "Software Engineer Intern",
    period: "Sep 2024 – May 2025",
    location: "Toronto, ON",
    accent: "#7c3aed",
    logo: "RBC",
    bullets: [
      "Built AI-powered migration system with OpenAI LLM & Python to automate WebFOCUS modernization, processing 10,000+ files and saving $5M+ in hiring costs.",
      "Developed 20+ RESTful APIs with Spring Boot and Angular front-end features for NOVA, reducing API latency by 10% across 15+ teams.",
      "Engineered RAG-powered support chatbot using Python, LangChain & FastAPI on OpenShift — 95% accuracy, serving 1,000+ employees.",
    ],
  },
  {
    id: 3,
    company: "Ministry of Public Service and Delivery",
    sub: "",
    role: "Software Engineer Intern",
    period: "Jan 2024 – Aug 2024",
    location: "Toronto, ON",
    accent: "#10b981",
    logo: "GOV",
    bullets: [
      "Optimized server infrastructure with PowerShell, PHP & Ansible — eliminated 30+ manual hours/week.",
      "Automated monitoring dashboards with PowerShell to visualize health metrics across 5+ servers, enabling 10% faster incident response.",
      "Spearheaded migration and configuration of monitoring systems with zero downtime.",
    ],
  },
  {
    id: 4,
    company: "Kev Group Inc",
    sub: "",
    role: "Software Engineer Intern",
    period: "May 2022 – Aug 2022",
    location: "Toronto, ON",
    accent: "#f59e0b",
    logo: "KEV",
    bullets: [
      "Built 50+ responsive pages in HTML, CSS & JavaScript in a cloud-based environment, improving user navigation.",
      "Implemented caching with C# ASP.NET & Redis, reducing database query latency by 30%.",
      "Enhanced internal tools with district filtering and CSV export, saving hours of manual work weekly.",
    ],
  },
];

function useMagnet(strength = 0.4) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      setPos({ x: (e.clientX - cx) * strength, y: (e.clientY - cy) * strength });
    };
    const onLeave = () => setPos({ x: 0, y: 0 });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, [strength]);

  return { ref, style: { transform: `translate(${pos.x}px, ${pos.y}px)`, transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1)" } };
}

function CursorTrail() {
  const [dots, setDots] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      const id = ++idRef.current;
      setDots((d) => [...d.slice(-18), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setDots((d) => d.filter((p) => p.id !== id)), 600);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50" style={{ mixBlendMode: "screen" }}>
      {dots.map((dot, i) => (
        <div
          key={dot.id}
          style={{
            position: "absolute",
            left: dot.x - 4,
            top: dot.y - 4,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: `hsl(${260 + i * 4}, 90%, 70%)`,
            opacity: i / dots.length,
            transform: `scale(${i / dots.length})`,
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        />
      ))}
    </div>
  );
}

function AnimatedText({ text, className, wordClassName, delay = 0 }) {
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: "inline" }}>
      {words.map((word, i) => (
        <span
          key={i}
          className={wordClassName}
          style={{
            display: "inline-block",
            opacity: 0,
            transform: "translateY(30px) rotate(2deg)",
            animation: `wordIn 0.6s cubic-bezier(0.23,1,0.32,1) forwards`,
            animationDelay: `${delay + i * 0.07}s`,
            marginRight: "0.25em",
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: 0,
        animation: `cardIn 0.7s cubic-bezier(0.23,1,0.32,1) forwards`,
        animationDelay: `${0.8 + index * 0.15}s`,
        position: "relative",
        borderRadius: "1.5rem",
        border: `1px solid ${hovered ? project.accent + "80" : "#1e293b"}`,
        background: hovered
          ? `linear-gradient(135deg, ${project.accent}12, #0f172a)`
          : "#0a1020",
        padding: "1.75rem",
        cursor: "pointer",
        transition: "border 0.3s ease, background 0.3s ease, transform 0.3s cubic-bezier(0.23,1,0.32,1), box-shadow 0.3s ease",
        transform: hovered ? "translateY(-6px) scale(1.01)" : "none",
        boxShadow: hovered ? `0 20px 60px ${project.accent}25` : "none",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute", top: "-10px", right: "16px",
        fontSize: "7rem", color: project.accent, opacity: hovered ? 0.12 : 0.04,
        transition: "opacity 0.4s ease, transform 0.4s ease",
        transform: hovered ? "scale(1.1) rotate(-5deg)" : "scale(1)",
        fontFamily: "monospace", lineHeight: 1, userSelect: "none",
        pointerEvents: "none",
      }}>{project.symbol}</div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "0.65rem", fontFamily: "'Space Mono', monospace", color: project.accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {project.tag}
        </span>
        <span style={{ fontSize: "0.65rem", fontFamily: "'Space Mono', monospace", color: "#475569" }}>{project.year}</span>
      </div>

      <h3 style={{ fontSize: "1.4rem", fontFamily: "'Clash Display', 'DM Sans', sans-serif", fontWeight: 700, color: "#f1f5f9", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
        {project.title}
      </h3>

      <p style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.7, marginBottom: "1.25rem" }}>
        {project.desc}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {project.stack.map((s) => (
          <span key={s} style={{
            fontSize: "0.65rem", fontFamily: "'Space Mono', monospace",
            padding: "0.25rem 0.6rem", borderRadius: "999px",
            border: `1px solid ${project.accent}40`,
            color: project.accent, background: `${project.accent}10`,
          }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function CurrentlyBuilding({ data }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1200);
    return () => clearInterval(id);
  }, []);

  if (!data.title) {
    return (
      <div style={{
        borderRadius: "1.5rem",
        border: "1px dashed #1a2540",
        background: "#0a1020",
        padding: "1.5rem 1.75rem",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "10px", flexShrink: 0,
            border: "1px dashed #1e293b",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem",
          }}>💤</div>
          <div>
            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#334155", letterSpacing: "-0.01em" }}>
              Nothing in the oven right now.
            </div>
            <div style={{ fontSize: "0.72rem", fontFamily: "'Space Mono', monospace", color: "#1e293b", marginTop: "0.2rem" }}>
              Check back soon — something's usually brewing.
            </div>
          </div>
        </div>
        <span style={{
          flexShrink: 0, fontSize: "0.6rem", fontFamily: "'Space Mono', monospace",
          padding: "0.25rem 0.7rem", borderRadius: "999px",
          border: "1px solid #1a2540", color: "#1e293b", letterSpacing: "0.1em",
        }}>IDLE</span>
      </div>
    );
  }

  return (
    <div style={{
      borderRadius: "1.5rem",
      border: "1px solid #7c3aed40",
      background: "linear-gradient(135deg, #7c3aed08, #060b14)",
      padding: "1.75rem",
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 0 40px #7c3aed12",
    }}>
      <div style={{
        position: "absolute", top: -60, right: -60,
        width: 180, height: 180, borderRadius: "50%",
        background: "radial-gradient(circle, #7c3aed25, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.25rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span style={{
              fontSize: "0.6rem", fontFamily: "'Space Mono', monospace",
              padding: "0.2rem 0.6rem", borderRadius: "999px",
              border: "1px solid #7c3aed60", color: "#a78bfa", background: "#7c3aed12",
              letterSpacing: "0.1em",
            }}>NOW BUILDING</span>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#a78bfa", display: "inline-block",
              boxShadow: "0 0 6px #7c3aed",
              animation: "blink 1.2s infinite",
            }} />
          </div>
          <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
            {data.title}
          </h3>
          <span style={{ fontSize: "0.62rem", fontFamily: "'Space Mono', monospace", color: "#334155" }}>
            Since {data.started}
          </span>
        </div>

        <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
          <svg width="52" height="52" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="26" cy="26" r="22" fill="none" stroke="#1a2540" strokeWidth="3" />
            <circle
              cx="26" cy="26" r="22" fill="none"
              stroke="#7c3aed" strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 22}`}
              strokeDashoffset={`${2 * Math.PI * 22 * (1 - data.progress / 100)}`}
              strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 4px #7c3aed)" }}
            />
          </svg>
          <span style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.65rem", fontFamily: "'Space Mono', monospace", color: "#a78bfa", fontWeight: 700,
          }}>{data.progress}%</span>
        </div>
      </div>

      <p style={{ fontSize: "0.82rem", color: "#64748b", lineHeight: 1.7, marginBottom: "1.25rem" }}>
        {data.desc}
      </p>

      <div style={{
        borderRadius: "0.75rem", background: "#060b14",
        border: "1px solid #1a2540", padding: "1rem", marginBottom: "1.25rem",
        fontFamily: "'Space Mono', monospace",
      }}>
        <div style={{ fontSize: "0.58rem", color: "#334155", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
          dev log
        </div>
        {data.log.map((line, i) => {
          const isDone = line.startsWith("✓");
          const isActive = line.startsWith("→");
          return (
            <div key={i} style={{
              fontSize: "0.7rem",
              color: isDone ? "#475569" : isActive ? "#a78bfa" : "#1e293b",
              marginBottom: "0.3rem",
              display: "flex", alignItems: "center", gap: "0.4rem",
            }}>
              {isActive && <span style={{ opacity: tick % 2 === 0 ? 1 : 0.3, transition: "opacity 0.3s" }}>▶</span>}
              {line}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
        {data.stack.map(s => (
          <span key={s} style={{
            fontSize: "0.65rem", fontFamily: "'Space Mono', monospace",
            padding: "0.25rem 0.6rem", borderRadius: "999px",
            border: "1px solid #7c3aed30", color: "#a78bfa", background: "#7c3aed0d",
          }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

function ExperienceCard({ exp, index }) {
  const [open, setOpen] = useState(index === 0);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setOpen((o) => !o)}
      style={{
        opacity: 0,
        animation: `cardIn 0.7s cubic-bezier(0.23,1,0.32,1) forwards`,
        animationDelay: `${0.3 + index * 0.12}s`,
        borderRadius: "1.25rem",
        border: `1px solid ${open || hovered ? exp.accent + "50" : "#1a2540"}`,
        background: open ? `linear-gradient(135deg, ${exp.accent}0d, #060b14)` : "#0a1020",
        padding: "1.5rem 1.75rem",
        cursor: "pointer",
        transition: "border 0.3s, background 0.3s, box-shadow 0.3s",
        boxShadow: open ? `0 12px 50px ${exp.accent}18` : "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow bar on left */}
      <div style={{
        position: "absolute", left: 0, top: "20%", bottom: "20%",
        width: 3, borderRadius: "0 3px 3px 0",
        background: exp.accent,
        opacity: open ? 1 : 0,
        transition: "opacity 0.3s",
      }} />

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {/* Logo badge */}
          <div style={{
            width: 44, height: 44, borderRadius: "10px", flexShrink: 0,
            background: `${exp.accent}18`,
            border: `1px solid ${exp.accent}35`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'Space Mono', monospace", fontSize: "0.6rem",
            fontWeight: 700, color: exp.accent, letterSpacing: "0.05em",
          }}>
            {exp.logo}
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.01em" }}>
                {exp.company}
              </span>
              {exp.sub && (
                <span style={{
                  fontSize: "0.62rem", fontFamily: "'Space Mono', monospace",
                  color: exp.accent, background: `${exp.accent}15`,
                  border: `1px solid ${exp.accent}30`,
                  padding: "0.15rem 0.55rem", borderRadius: "999px",
                }}>
                  {exp.sub}
                </span>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.2rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{exp.role}</span>
              <span style={{ fontSize: "0.6rem", color: "#334155" }}>·</span>
              <span style={{ fontSize: "0.65rem", fontFamily: "'Space Mono', monospace", color: "#475569" }}>{exp.location}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
          <span style={{
            fontSize: "0.65rem", fontFamily: "'Space Mono', monospace",
            color: "#475569", whiteSpace: "nowrap",
          }}>
            {exp.period}
          </span>
          <div style={{
            width: 22, height: 22, borderRadius: "50%",
            border: `1px solid ${exp.accent}40`,
            background: `${exp.accent}10`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: exp.accent, fontSize: "0.7rem",
            transition: "transform 0.3s cubic-bezier(0.23,1,0.32,1)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}>
            ↓
          </div>
        </div>
      </div>

      {/* Expandable bullets */}
      <div style={{
        overflow: "hidden",
        maxHeight: open ? "400px" : "0px",
        transition: "max-height 0.4s cubic-bezier(0.23,1,0.32,1)",
      }}>
        <div style={{ marginTop: "1.25rem", paddingLeft: "3.5rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {exp.bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <span style={{
                flexShrink: 0, marginTop: "0.35rem",
                width: 5, height: 5, borderRadius: "50%",
                background: exp.accent, opacity: 0.7,
                display: "inline-block",
              }} />
              <span style={{ fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.7 }}>{b}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const resumeBtn = useMagnet(0.35);
  const projectBtn = useMagnet(0.35);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/send-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setStatus("error"); setMessage(data.error || "Failed to send resume"); return; }
      setStatus("success");
      setMessage("Resume sent! Check your inbox.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #060b14;
          --surface: #0a1020;
          --border: #1a2540;
          --accent1: #7c3aed;
          --accent2: #0ea5e9;
          --accent3: #10b981;
          --text: #f1f5f9;
          --muted: #64748b;
        }

        html { scroll-behavior: smooth; }
        body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; cursor: none; }

        @keyframes wordIn {
          to { opacity: 1; transform: translateY(0) rotate(0deg); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-14px) rotate(1deg); }
          66% { transform: translateY(-6px) rotate(-1deg); }
        }
        @keyframes orb1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.1); }
        }
        @keyframes orb2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(0.9); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

        .cursor {
          width: 12px; height: 12px;
          background: #7c3aed;
          border-radius: 50%;
          position: fixed; z-index: 9999;
          pointer-events: none;
          mix-blend-mode: exclusion;
          transition: transform 0.15s ease;
        }
        .cursor-ring {
          width: 36px; height: 36px;
          border: 1.5px solid #7c3aed80;
          border-radius: 50%;
          position: fixed; z-index: 9998;
          pointer-events: none;
          transition: transform 0.35s cubic-bezier(0.23,1,0.32,1), width 0.2s, height 0.2s, border-color 0.2s;
        }

        .nav-link {
          font-size: 0.8rem;
          font-family: 'Space Mono', monospace;
          color: #64748b;
          text-decoration: none;
          letter-spacing: 0.05em;
          transition: color 0.2s;
          background: none; border: none; cursor: none;
        }
        .nav-link:hover { color: #f1f5f9; }

        .noise {
          position: fixed; inset: 0; z-index: 1; pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #7c3aed, #0ea5e9, #10b981);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .tag-pill {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.7rem; font-family: 'Space Mono', monospace;
          padding: 0.35rem 0.9rem; border-radius: 999px;
          border: 1px solid #1e293b; color: #94a3b8;
          background: #0a1020;
          letter-spacing: 0.05em;
        }

        .skill-chip {
          font-size: 0.7rem; font-family: 'Space Mono', monospace;
          padding: 0.3rem 0.75rem; border-radius: 6px;
          border: 1px solid #1a2540;
          color: #94a3b8; background: #0a1020;
          transition: border-color 0.2s, color 0.2s;
        }
        .skill-chip:hover { border-color: #7c3aed80; color: #c4b5fd; }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.5rem; border-radius: 12px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: #fff; font-size: 0.85rem; font-weight: 600;
          border: none; cursor: none; text-decoration: none;
          box-shadow: 0 8px 30px #7c3aed40;
          transition: box-shadow 0.3s, transform 0.2s;
        }
        .btn-primary:hover { box-shadow: 0 12px 40px #7c3aed60; }

        .btn-secondary {
          display: inline-flex; align-items: center; gap: 0.5rem;
          padding: 0.75rem 1.5rem; border-radius: 12px;
          border: 1px solid #1e293b; background: transparent;
          color: #94a3b8; font-size: 0.85rem; font-weight: 500;
          cursor: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-secondary:hover { border-color: #7c3aed80; color: #c4b5fd; }

        .section-label {
          font-family: 'Space Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.2em;
          text-transform: uppercase; color: #475569;
          display: flex; align-items: center; gap: 0.75rem;
        }
        .section-label::before {
          content: ''; display: block;
          width: 24px; height: 1px; background: #475569;
        }

        .about-stat {
          padding: 1.5rem;
          border-radius: 1rem;
          border: 1px solid #1a2540;
          background: #0a1020;
          text-align: center;
          transition: border-color 0.3s, transform 0.3s;
        }
        .about-stat:hover {
          border-color: #7c3aed60;
          transform: translateY(-4px);
        }
      `}</style>

      <CustomCursor />
      <div className="noise" />

      <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>

        {/* Header */}
        <header style={{
          position: "sticky", top: 0, zIndex: 20,
          borderBottom: "1px solid #0f1929",
          background: `rgba(6,11,20,${Math.min(0.95, scrollY / 100)})`,
          backdropFilter: "blur(20px)",
          transition: "background 0.3s",
        }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "none", border: "none", cursor: "none" }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #7c3aed, #0ea5e9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8rem", fontWeight: 700, color: "#fff",
                fontFamily: "'Space Mono', monospace",
              }}>MK</div>
              <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#f1f5f9", letterSpacing: "-0.01em" }}>Mohammad Khan</span>
            </button>
            <nav style={{ display: "flex", gap: "2rem" }}>
              {[["experience", "Experience"], ["projects", "Projects"], ["about", "About"], ["contact", "Contact"]].map(([id, label]) => (
                <button key={id} onClick={() => scrollToSection(id)} className="nav-link">{label}</button>
              ))}
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section style={{ position: "relative", overflow: "hidden", padding: "6rem 1.5rem 8rem" }}>
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "10%", left: "20%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #7c3aed25, transparent 70%)", animation: "orb1 8s ease-in-out infinite" }} />
            <div style={{ position: "absolute", bottom: "10%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #0ea5e920, transparent 70%)", animation: "orb2 10s ease-in-out infinite" }} />
            <div style={{ position: "absolute", top: "50%", right: "30%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, #10b98115, transparent 70%)", animation: "orb1 6s ease-in-out infinite reverse" }} />
          </div>

          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            backgroundImage: "linear-gradient(#0ea5e908 1px, transparent 1px), linear-gradient(90deg, #0ea5e908 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />

          <div style={{ position: "relative", maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ opacity: 0, animation: "fadeUp 0.6s ease forwards", animationDelay: "0.1s" }}>
                <span className="tag-pill">
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "blink 2s infinite" }} />
                  Available for new grad roles
                </span>
              </div>

              <div style={{ opacity: 0, animation: "fadeUp 0.6s ease forwards", animationDelay: "0.2s" }}>
                <h1 style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, color: "#f1f5f9" }}>
                  <AnimatedText text="I build backends that" delay={0.2} />
                  <br />
                  <span style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
                    <AnimatedText text="power the web." wordClassName="gradient-text" delay={0.5} />
                  </span>
                </h1>
              </div>

              <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: 1.75, maxWidth: "480px", opacity: 0, animation: "fadeUp 0.6s ease forwards", animationDelay: "0.7s" }}>
                CS grad with 3 internships at RBC and the Ontario government. I build the APIs, pipelines, and AI systems that run behind the scenes — with Spring Boot, Python, Next.js, and a thing for clean architecture.
              </p>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", opacity: 0, animation: "fadeUp 0.6s ease forwards", animationDelay: "0.85s" }}>
                <div ref={resumeBtn.ref} style={resumeBtn.style}>
                  <a href="/resume.pdf" target="_blank" className="btn-primary">View Resume ↗</a>
                </div>
                <div ref={projectBtn.ref} style={projectBtn.style}>
                  <button onClick={() => scrollToSection("projects")} className="btn-secondary">See Projects →</button>
                </div>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", opacity: 0, animation: "fadeUp 0.6s ease forwards", animationDelay: "1s" }}>
                {["Java", "Python", "Next.js", "React", "Angular", "Spring Boot", "PostgreSQL", "AI Integrations"].map((s) => (
                  <span key={s} className="skill-chip">{s}</span>
                ))}
              </div>
            </div>

            <div style={{ opacity: 0, animation: "fadeUp 0.8s ease forwards", animationDelay: "0.4s" }}>
              <FeaturedCard />
            </div>
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience" style={{ padding: "6rem 1.5rem", borderTop: "1px solid #0f1929", position: "relative", overflow: "hidden" }}>
          {/* Subtle background glow */}
          <div style={{ position: "absolute", top: "30%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #0ea5e910, transparent 70%)", pointerEvents: "none" }} />

          <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
            {/* Section header */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem" }}>
              <div>
                <p className="section-label" style={{ marginBottom: "0.75rem" }}>Work History</p>
                <h2 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#f1f5f9" }}>Experience</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "blink 2s infinite" }} />
                <span style={{ fontSize: "0.7rem", fontFamily: "'Space Mono', monospace", color: "#475569" }}>
                  3+ yrs · 4 roles
                </span>
              </div>
            </div>

            {/* Timeline layout */}
            <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "0 3rem" }}>
              
              {/* Left: timeline spine */}
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "sticky", top: "80px",
                  display: "flex", flexDirection: "column", gap: "1rem",
                }}>
                  <div style={{
                    borderRadius: "1rem", border: "1px solid #1a2540",
                    background: "#0a1020", padding: "1.25rem",
                  }}>
                    <p style={{ fontSize: "0.6rem", fontFamily: "'Space Mono', monospace", color: "#334155", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
                      Timeline
                    </p>
                    {EXPERIENCES.map((exp, i) => (
                      <div key={exp.id} style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: i < EXPERIENCES.length - 1 ? "0.9rem" : 0 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: exp.accent, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 600 }}>{exp.company.split(" ").slice(0, 2).join(" ")}</div>
                          <div style={{ fontSize: "0.58rem", fontFamily: "'Space Mono', monospace", color: "#334155", marginTop: "0.1rem" }}>
                            {exp.period.split("–")[0].trim()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div style={{
                    borderRadius: "1rem", border: "1px solid #1a2540",
                    background: "#0a1020", padding: "1.25rem",
                    display: "flex", flexDirection: "column", gap: "0.75rem",
                  }}>
                    {[
                      { val: "$5M+", label: "Cost Savings" },
                      { val: "10K+", label: "Files Processed" },
                      { val: "1K+", label: "Users Served" },
                    ].map((s) => (
                      <div key={s.label}>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>{s.val}</div>
                        <div style={{ fontSize: "0.58rem", fontFamily: "'Space Mono', monospace", color: "#334155", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {EXPERIENCES.map((exp, i) => (
                  <ExperienceCard key={exp.id} exp={exp} index={i} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" style={{ padding: "6rem 1.5rem", background: "#060b14", position: "relative" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "3rem" }}>
              <div>
                <p className="section-label" style={{ marginBottom: "0.75rem" }}>Selected Work</p>
                <h2 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#f1f5f9" }}>Projects</h2>
              </div>
              <p style={{ fontSize: "0.78rem", fontFamily: "'Space Mono', monospace", color: "#475569" }}>
                {new Date().getFullYear()} · 3 projects
              </p>
            </div>

            {/* Currently building card */}
            <div style={{ marginBottom: "1.75rem" }}>
              <CurrentlyBuilding data={CURRENT_BUILD} />
            </div>

            {/* Live demos banner */}
            <div style={{
              marginBottom: "1.75rem",
              borderRadius: "1rem",
              border: "1px dashed #1e293b",
              background: "linear-gradient(90deg, #0a1020, #060b14)",
              padding: "0.85rem 1.25rem",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
              overflow: "hidden", position: "relative",
            }}>
              {/* Scrolling ticker text */}
              <div style={{ overflow: "hidden", flex: 1 }}>
                <div style={{
                  display: "flex", gap: "3rem", whiteSpace: "nowrap",
                  animation: "ticker 18s linear infinite",
                }}>
                  {Array(4).fill(null).map((_, i) => (
                    <span key={i} style={{ fontSize: "0.68rem", fontFamily: "'Space Mono', monospace", color: "#334155", letterSpacing: "0.1em" }}>
                      ⚙ LIVE DEMOS IN PROGRESS &nbsp;·&nbsp; DEPLOYMENTS SHIPPING SOON &nbsp;·&nbsp; CODE READY, SERVERS PENDING
                    </span>
                  ))}
                </div>
              </div>
              <span style={{
                flexShrink: 0, fontSize: "0.62rem", fontFamily: "'Space Mono', monospace",
                padding: "0.25rem 0.7rem", borderRadius: "999px",
                border: "1px solid #f59e0b40", color: "#f59e0b", background: "#f59e0b10",
                letterSpacing: "0.08em",
              }}>
                🚧 WIP
              </span>
              <style>{`
                @keyframes ticker {
                  from { transform: translateX(0); }
                  to { transform: translateX(-50%); }
                }
              `}</style>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
              {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" style={{ padding: "6rem 1.5rem", borderTop: "1px solid #0f1929" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>Background</p>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: "2.5rem" }}>About Me</h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <p style={{ fontSize: "0.95rem", color: "#94a3b8", lineHeight: 1.8 }}>
                  I'm a software engineer focused on building clean, scalable, production-ready applications. I work across the full stack with an emphasis on strong architecture, performance, and intuitive user experiences.
                </p>
                <p style={{ fontSize: "0.95rem", color: "#94a3b8", lineHeight: 1.8 }}>
                  I also create content around web development and building real-world projects — sharing practical insights from designing and shipping end-to-end systems.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem" }}>
                  {[
                    { label: "Projects", value: "10+" },
                    { label: "Stack", value: "Full-Stack" },
                    { label: "Focus", value: "Scalability" },
                    { label: "Status", value: "Open to Work" },
                  ].map((s) => (
                    <div key={s.label} className="about-stat">
                      <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>{s.value}</div>
                      <div style={{ fontSize: "0.65rem", fontFamily: "'Space Mono', monospace", color: "#475569", marginTop: "0.25rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: "0.75rem", fontFamily: "'Space Mono', monospace", color: "#475569", marginBottom: "1rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Current Stack</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {[
                    { name: "React / Next.js", level: 90, color: "#7c3aed" },
                    { name: "Java / Spring Boot", level: 85, color: "#0ea5e9" },
                    { name: "PostgreSQL + Prisma", level: 80, color: "#10b981" },
                    { name: "Python", level: 82, color: "#f59e0b" },
                    { name: "Docker + Nginx", level: 70, color: "#ec4899" },
                    { name: "AI Integrations", level: 78, color: "#a78bfa" },
                  ].map((skill) => (
                    <SkillBar key={skill.name} {...skill} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer / Contact */}
        <footer id="contact" style={{ marginTop: "auto", borderTop: "1px solid #0f1929", background: "#060b14", padding: "4rem 1.5rem" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
              <div>
                <p className="section-label" style={{ marginBottom: "0.75rem" }}>Get In Touch</p>
                <h3 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#f1f5f9", marginBottom: "0.75rem" }}>
                  Want my resume?
                </h3>
                <p style={{ fontSize: "0.85rem", color: "#475569" }}>
                  Drop your email and I'll send it straight to your inbox.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.75rem" }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  style={{
                    flex: 1, padding: "0.75rem 1rem", borderRadius: "12px",
                    border: "1px solid #1a2540", background: "#0a1020",
                    color: "#f1f5f9", fontSize: "0.85rem",
                    outline: "none", fontFamily: "'DM Sans', sans-serif",
                  }}
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary"
                  style={{ whiteSpace: "nowrap", cursor: "none" }}
                >
                  {status === "loading" ? "Sending..." : "Send it →"}
                </button>
              </form>
            </div>

            {message && (
              <p style={{ marginTop: "1rem", fontSize: "0.8rem", fontFamily: "'Space Mono', monospace", color: status === "success" ? "#10b981" : "#f43f5e" }}>
                {status === "success" ? "✓ " : "✗ "}{message}
              </p>
            )}

            <div style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid #0f1929", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.7rem", fontFamily: "'Space Mono', monospace", color: "#1e293b" }}>
                © {new Date().getFullYear()} Mohammad Khan
              </span>
              <span style={{ fontSize: "0.7rem", fontFamily: "'Space Mono', monospace", color: "#1e293b" }}>
                Built with Next.js
              </span>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX - 6 + "px";
        dotRef.current.style.top = e.clientY - 6 + "px";
      }
    };
    const animate = () => {
      ring.current.x += (pos.current.x - ring.current.x) * 0.15;
      ring.current.y += (pos.current.y - ring.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.left = ring.current.x - 18 + "px";
        ringRef.current.style.top = ring.current.y - 18 + "px";
      }
      raf.current = requestAnimationFrame(animate);
    };
    window.addEventListener("mousemove", onMove);
    raf.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current); };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

function FeaturedCard() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const lines = [
    { label: "const stack", value: "= ['Next.js', 'Java', 'Python']" },
    { label: "const focus", value: "= 'full-stack systems'" },
    { label: "const status", value: "= 'available'" },
  ];

  return (
    <div style={{
      borderRadius: "1.75rem",
      border: "1px solid #1a2540",
      background: "linear-gradient(135deg, #0a1020, #060b14)",
      padding: "1.75rem",
      boxShadow: "0 0 60px #7c3aed18, inset 0 1px 0 #ffffff08",
      animation: "float 6s ease-in-out infinite",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, #7c3aed20, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
        {["#f43f5e", "#fbbf24", "#10b981"].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ marginLeft: "0.5rem", fontSize: "0.65rem", fontFamily: "'Space Mono', monospace", color: "#334155" }}>mohammad.dev</span>
      </div>

      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {lines.map((l, i) => (
          <div key={i} style={{ display: "flex", gap: "0.5rem" }}>
            <span style={{ color: "#c4b5fd" }}>{l.label}</span>
            <span style={{ color: "#10b981" }}>{l.value}</span>
          </div>
        ))}
        <div style={{ color: "#7c3aed", marginTop: "0.25rem" }}>
          {">"} <span style={{ animation: "blink 1s infinite", color: "#f1f5f9" }}>█</span>
        </div>
      </div>

      <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
        {[
          { label: "Projects", val: "10+" },
          { label: "Stack", val: "Full" },
          { label: "Hire", val: "Open" },
        ].map((s) => (
          <div key={s.label} style={{
            background: "#060b14", borderRadius: "0.75rem",
            border: "1px solid #1a2540", padding: "0.75rem 0.5rem", textAlign: "center"
          }}>
            <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#f1f5f9" }}>{s.val}</div>
            <div style={{ fontSize: "0.6rem", fontFamily: "'Space Mono', monospace", color: "#334155", marginTop: "0.15rem" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillBar({ name, level, color }) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setAnimated(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.35rem" }}>
        <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>{name}</span>
        <span style={{ fontSize: "0.65rem", fontFamily: "'Space Mono', monospace", color: "#475569" }}>{level}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: "#0f1929", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 999,
          background: color,
          width: animated ? `${level}%` : "0%",
          transition: "width 1.2s cubic-bezier(0.23,1,0.32,1)",
          boxShadow: `0 0 8px ${color}80`,
        }} />
      </div>
    </div>
  );
}
