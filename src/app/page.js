"use client";

import { useState, useEffect, useRef } from "react";

const PROJECTS = [
  {
    id: 1,
    tag: "Graphics · Systems",
    title: "Ray Tracer",
    year: "2024",
    desc: "Built a physically-based ray tracer from scratch — ray-sphere intersections, diffuse reflections, recursive light transport, and a full camera model. Every pixel computed from first principles.",
    stack: ["C++", "Linear Algebra", "Rendering Pipeline", "Recursive Algorithms"],
    accent: "#f97316",
    symbol: "◈",
  },
  {
    id: 2,
    tag: "AI · Full-Stack",
    title: "AI Career Coach",
    year: "2024",
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
      {/* Big symbol background */}
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

      {/* Custom cursor */}
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
              {[["projects", "Projects"], ["about", "About"], ["contact", "Contact"]].map(([id, label]) => (
                <button key={id} onClick={() => scrollToSection(id)} className="nav-link">{label}</button>
              ))}
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section style={{ position: "relative", overflow: "hidden", padding: "6rem 1.5rem 8rem" }}>
          {/* Orbs */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "10%", left: "20%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #7c3aed25, transparent 70%)", animation: "orb1 8s ease-in-out infinite" }} />
            <div style={{ position: "absolute", bottom: "10%", right: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #0ea5e920, transparent 70%)", animation: "orb2 10s ease-in-out infinite" }} />
            <div style={{ position: "absolute", top: "50%", right: "30%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, #10b98115, transparent 70%)", animation: "orb1 6s ease-in-out infinite reverse" }} />
          </div>

          {/* Grid lines */}
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
                  <AnimatedText text="I build things for the" delay={0.2} />
                  <br />
                  <span style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.5rem)", fontWeight: 800, letterSpacing: "-0.03em" }}>
                    <AnimatedText text="web that matter." wordClassName="gradient-text" delay={0.5} />
                  </span>
                </h1>
              </div>

              <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: 1.75, maxWidth: "480px", opacity: 0, animation: "fadeUp 0.6s ease forwards", animationDelay: "0.7s" }}>
                Computer Science grad building scalable full-stack systems with React, Next.js, Spring Boot, and Python. I care about clean architecture, real-world impact, and interfaces people actually love.
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

            {/* Hero card */}
            <div style={{ opacity: 0, animation: "fadeUp 0.8s ease forwards", animationDelay: "0.4s" }}>
              <FeaturedCard />
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
              {PROJECTS.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" style={{ padding: "6rem 1.5rem", borderTop: "1px solid #0f1929" }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
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
      {/* Glow */}
      <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, #7c3aed20, transparent 70%)", pointerEvents: "none" }} />

      {/* Terminal header */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
        {["#f43f5e", "#fbbf24", "#10b981"].map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ marginLeft: "0.5rem", fontSize: "0.65rem", fontFamily: "'Space Mono', monospace", color: "#334155" }}>mohammad.dev</span>
      </div>

      {/* Code lines */}
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

      {/* Stats row */}
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
