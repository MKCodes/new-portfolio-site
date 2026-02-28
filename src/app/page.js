"use client";

import { useState } from "react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

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

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Failed to send resume");
        return;
      }

      setStatus("success");
      setMessage("Resume sent! Check your inbox.");
      setEmail("");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }


  return (
    <main className="min-h-screen flex flex-col bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-800/50 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <img
              src="/logo.jpeg"
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="text-sm font-semibold tracking-wide text-slate-100">
              Portfolio
            </span>
          </button>
          <nav className="flex gap-6 text-sm text-slate-300">
            <button
              type="button"
              onClick={() => scrollToSection("projects")}
              className="hover:text-violet-300"
            >
              Projects
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("about")}
              className="hover:text-violet-300"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("contact")}
              className="hover:text-violet-300"
            >
              Contact
            </button>
          </nav>
        </div>
      </header>

      <section className="flex-1">
        <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-16 md:py-32 md:flex-row md:items-center">
          <div className="flex-1 space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-medium text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Available for new grad roles
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-50 md:text-5xl">
            Building clean, modern web apps with{" "}
            <span className="bg-gradient-to-r from-violet-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">
              scalable full-stack systems
            </span>
            </h1>
            <p className="max-w-xl text-sm text-slate-300 md:text-base">
            I’m Mohammad Khan, a Computer Science new graduate and software engineer. I design and build scalable full-stack applications using modern technologies like React, Next.js, Spring Boot, and Python — with a strong focus on clean architecture, performance, and real-world impact. I care deeply about intuitive user experiences and writing maintainable, production-ready code.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/resume.pdf"
                target="_blank"
                className="rounded-xl bg-violet-500 px-4 py-2 text-sm font-medium text-slate-50 shadow-lg shadow-violet-500/30 hover:bg-violet-400"
              >
                View Resume
              </a>
              <button
                type="button"
                onClick={() => scrollToSection("projects")}
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:border-violet-400/80 hover:text-violet-200"
              >
                View Projects
              </button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
            <span className="rounded-full border border-slate-700 px-3 py-1">
                Java
              </span>
            <span className="rounded-full border border-slate-700 px-3 py-1">
                Python
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-1">
                Next.js
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-1">
                Angular
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-1">
                React
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-1">
                Tailwind CSS
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-1">
                SQL and NoSQL
              </span>
              <span className="rounded-full border border-slate-700 px-3 py-1">
                AI Integrations
              </span>
            </div>
          </div>
          <div className="flex-1">
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="relative block h-72 rounded-3xl border border-slate-800 bg-gradient-to-br from-violet-500/20 via-sky-500/10 to-emerald-500/10 p-6 shadow-[0_0_40px_rgba(56,18,248,0.25)] hover:border-violet-400/70 hover:shadow-[0_0_50px_rgba(129,140,248,0.45)] transition"
            >
              <div className="mb-4 flex justify-between text-xs text-slate-200">
                <span>Featured Project</span>
                <span>AI-Powered Developer Tools</span>
              </div>
              <div className="space-y-3 text-sm text-slate-100">
                <div className="rounded-2xl bg-slate-950/60 p-3">
                  <p className="text-xs text-slate-400">Now Shipping</p>
                  <p className="text-sm font-medium text-slate-50">
                    AI Newsletter & Resume Builder
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl bg-slate-950/60 p-3">
                    <p className="text-slate-400">Stack</p>
                    <p>Next.js · Postgres · OpenAI </p>
                  </div>
                  <div className="rounded-2xl bg-slate-950/60 p-3">
                    <p className="text-slate-400">Focus</p>
                    <p>Automation, delightful UX</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300/80">
                  Built for teaching, real clients, and content creation - all
                  iun one ecosystem
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="border-t border-slate-800/60 bg-slate-950/60 py-16 md:py-32"
      >
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-50">Projects</h2>
            <p className="text-xs text-slate-400">
              A few things I&apos;ve build recently.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
          <a
            href=""
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-4 hover:border-violet-400/70 transition"
            >
              <p className="mb-2 text-xs font-medium text-violet-300">
                Graphics Programming · Systems
              </p>

              <h3 className="mb-2 text-sm font-semibold text-slate-50">
                Ray Tracer
              </h3>

              <p className="mb-3 text-xs text-slate-400">
                Built a ray tracer from scratch implementing ray-sphere intersections,
                diffuse reflections, camera models, and recursive light transport to render
                physically-based images.
              </p>

              <p className="text-[11px] text-slate-400">
                C++ · Linear Algebra · Rendering Pipeline · Recursive Algorithms
              </p>
            </a>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-4 hover:border-violet-400/70 transition"
            >
              <p className="mb-2 text-xs font-medium text-violet-300">
                Resume & Cover Letter
              </p>
              <h3 className="mb-2 text-sm font-semibold text-slate-50">
                AI Powered Career Coach
              </h3>
              <p className="mb-3 text-xs text-slate-400">
                Generates tailored resumes and cover letters from job
                descriptions and your profile.
              </p>
              <p className="text-[11px] text-slate-400">
                Next.js · Prisma · Inngest · Gemini · Tailwind CSS · PostgreSQL
              </p>
            </a>
            <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-slate-800 bg-slate-950/60 p-4 hover:border-violet-400/70 transition"
            >
              <p className="mb-2 text-xs font-medium text-violet-300">
                Full-Stack Web Application
              </p>

              <h3 className="mb-2 text-sm font-semibold text-slate-50">
                Hotel Booking Platform
              </h3>

              <p className="mb-3 text-xs text-slate-400">
                Built a full-stack booking system with user authentication, hotel search,
                availability, and secure reservations. Designed REST APIs and
                implemented dynamic filtering, protected routes, and persistent state.
              </p>

              <p className="text-[11px] text-slate-400">
                MongoDB · Express · React · Node.js · JWT · REST APIs
              </p>
            </a>
          </div>
        </div>
      </section>

      <section id="about" className="py-16 md:py-32">
        <div className="mx-auto max-w-3xl px-4 space-y-4">
          <h2 className="text-lg font-semibold text-slate-50">About</h2>

          <p className="text-sm text-slate-300">
            I&apos;m a software engineer focused on building clean, scalable, and
            production-ready applications. I work across the stack using modern web
            technologies, with an emphasis on strong architecture, performance, and
            intuitive user experiences.
          </p>

          <p className="text-sm text-slate-300">
            I also create content around web development and building real-world
            projects, sharing practical insights from designing and shipping
            end-to-end systems.
          </p>

          <p className="text-sm text-slate-300">My current stack includes:</p>

          <ul className="list-disc list-inside text-sm text-slate-400 space-y-1">
            <li>React / Next.js</li>
            <li>Node.js & API development</li>
            <li>PostgreSQL (Prisma / Supabase)</li>
            <li>Docker & Nginx deployments</li>
            <li>Tailwind CSS</li>
            <li>AI integrations (OpenAI API & related tools)</li>
          </ul>
        </div>
      </section>
      <footer
        id="contact"
        className="mt-auto border-t border-slate-800 bg-slate-950/90 py-10"
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 md:flex-row md:item-center md:justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-50">
              Get a copy of my resume
            </h3>
            <p className="text-xs text-slate-400">
              Enter your email and I&apos;ll send it to you instantly.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md flex-col gap-2 md:flex-row"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-violet-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-1 rounded-xl bg-violet-500 px-4 py-2 text-sm font-semibold text-slate-50 shadow-lg shadow-violet-500/30 hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60 md:mt-0"
            >
              {status === "loading" ? "Sending..." : "Send Resume"}
            </button>
          </form>
        </div>
        {message && (
          <div className="mx-auto mt-3 max-w-5xl px-4">
            <p
              className={`text-xs ${
                status === "success" ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {message}
            </p>
          </div>
        )}
        <div className="mx-auto mt-8 max-w-5xl px-4 text-[11px] text-slate-500">
          © {new Date().getFullYear()} Mohammad. Built with Next.js.
        </div>
      </footer>
    </main>
  );
}