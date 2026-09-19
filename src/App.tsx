import { FormEvent, useEffect, useState } from "react";

type Project = {
  title: string;
  eyebrow: string;
  description: string;
  stack: string[];
  bullets: string[];
  href: string;
  accent: "purple" | "cyan" | "orange" | "green";
  featured?: boolean;
  metric?: string;
};

const projects: Project[] = [
  {
    title: "AI Career Preparation Platform",
    eyebrow: "01 / GENAI PRODUCT",
    description:
      "A connected AI career platform that turns one resume into a reusable context across analysis, job matching, content improvement, and interview practice.",
    stack: ["React", "TypeScript", "Node.js", "Express", "tRPC", "MySQL", "Drizzle", "LLMs"],
    bullets: [
      "Built four connected career workflows with resume upload/reuse across the product.",
      "Engineered LLM workflows for resume parsing, job-skill matching, content improvement, and role-specific interview simulation.",
      "Built the resume processing pipeline with PDF/DOCX extraction and persistent storage.",
      "Designed production foundations including JWT auth, secure hashing, S3 storage, usage controls, API security, subscriptions, and deployment architecture.",
    ],
    href: "https://github.com/PiyushJain2004/ai-career-preparation-platform",
    accent: "purple",
    featured: true,
    metric: "4 AI workflows",
  },
  {
    title: "Movie Discovery App",
    eyebrow: "02 / FULL-STACK",
    description:
      "A responsive movie discovery application backed by TMDB, PostgreSQL, and Prisma, built around resilient API consumption.",
    stack: ["React", "TypeScript", "Express", "PostgreSQL", "Prisma", "TMDB API"],
    bullets: [
      "Built popular, search, and movie-detail API flows with React integration.",
      "Implemented debounced search and AbortController cancellation to prevent stale requests.",
      "Added retry handling plus explicit loading, error, and empty states.",
    ],
    href: "https://github.com/PiyushJain2004",
    accent: "cyan",
    metric: "Resilient APIs",
  },
  {
    title: "Concurrency-Safe Inventory Reservation",
    eyebrow: "03 / BACKEND SYSTEMS",
    description:
      "A reservation engine designed for correctness when multiple checkout requests compete for the same inventory.",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    bullets: [
      "Used PostgreSQL transactions and atomic updates to prevent overselling under concurrent requests.",
      "Implemented a Pending → Confirmed → Released state machine with a 10-minute TTL.",
      "Used lazy cleanup on read instead of relying on cron-based expiry jobs.",
    ],
    href: "https://github.com/PiyushJain2004/Concurrency-Safe-Inventory-Reservation-System",
    accent: "orange",
    metric: "Concurrency",
  },
  {
    title: "Agent Management & Task Distribution",
    eyebrow: "04 / FULL-STACK",
    description:
      "A role-based operations platform for assigning, tracking, and monitoring agent workloads through centralized dashboards.",
    stack: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    bullets: [
      "Built centralized dashboards for task assignment, workload tracking, and status visibility.",
      "Implemented JWT authentication and authorization with MongoDB-backed workflows.",
      "Designed role-aware task distribution flows for operational visibility.",
    ],
    href: "https://github.com/PiyushJain2004/agent-management-task-distribution-system",
    accent: "green",
    metric: "RBAC + REST",
  },
];

const skillGroups = [
  { name: "GenAI", color: "purple", items: ["LLM Applications", "LangChain", "Prompt Engineering", "MCP", "NLP"] },
  { name: "Backend", color: "cyan", items: ["Node.js", "Express.js", "REST APIs", "Python", "API Design"] },
  { name: "Frontend", color: "orange", items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML / CSS"] },
  { name: "Data", color: "green", items: ["PostgreSQL", "MySQL", "MongoDB", "Drizzle ORM", "Prisma"] },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const, "aria-hidden": true,
  };
  const p: Record<string, React.ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    github: <><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3.3-.4 6.8-1.6 6.8-7A5.5 5.5 0 0 0 19.3 4 5.1 5.1 0 0 0 19.2.4S18 .1 15 2.1a13.4 13.4 0 0 0-7 0C5 .1 3.8.4 3.8.4A5.1 5.1 0 0 0 3.7 4 5.5 5.5 0 0 0 2.2 7.5c0 5.4 3.5 6.6 6.8 7A4.8 4.8 0 0 0 8 18v4"/><path d="M8 20c-3 .9-3-1.4-4.2-1.8"/></>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></>,
    external: <><path d="M14 3h7v7"/><path d="M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    sparkle: <><path d="m12 2 1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6Z"/><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7Z"/></>,
    send: <><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></>,
  };
  return <svg {...common}>{p[name]}</svg>;
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.featured) return (
    <div className="visual visual-ai">
      <div className="ai-grid" />
      <div className="ai-orbit orbit-a" /><div className="ai-orbit orbit-b" />
      <div className="ai-core"><span><Icon name="sparkle" size={28} /></span><b>AI</b><small>career engine</small></div>
      <div className="ai-steps">
        <span>Resume</span><i /><span>Match</span><i /><span>Improve</span><i /><span>Interview</span>
      </div>
      <div className="visual-label">LLM WORKFLOW / 4 PATHS</div>
    </div>
  );
  if (project.accent === "cyan") return (
    <div className="visual visual-movie">
      <div className="movie-glow" /><div className="poster"><div className="poster-top">TMDB</div><strong>DISCOVER</strong><span>SEARCH / FILTER / EXPLORE</span></div>
      <div className="film-card fc1" /><div className="film-card fc2" /><div className="film-card fc3" />
      <div className="visual-label">API / SEARCH / UI</div>
    </div>
  );
  if (project.accent === "orange") return (
    <div className="visual visual-db">
      <div className="db-rings" /><div className="db-cylinder"><i /><i /><i /></div>
      <div className="db-badge">TX<br /><small>ATOMIC</small></div>
      <div className="db-path path-a" /><div className="db-path path-b" />
      <div className="visual-label">POSTGRESQL / CONCURRENCY</div>
    </div>
  );
  return (
    <div className="visual visual-agent">
      <div className="agent-grid" /><div className="agent-hub">TASK<br /><span>QUEUE</span></div>
      <div className="agent-node an1">ADMIN</div><div className="agent-node an2">AGENT 01</div><div className="agent-node an3">AGENT 02</div>
      <div className="agent-line al1" /><div className="agent-line al2" /><div className="agent-line al3" />
      <div className="visual-label">RBAC / WORKLOADS</div>
    </div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(false);

  useEffect(() => {
    const nav = document.querySelector<HTMLElement>(".nav");
    let raf = 0;

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        nav?.classList.toggle("nav-scrolled", window.scrollY > 20);
        raf = 0;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    if (activeProject) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    }
    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [activeProject]);

  useEffect(() => {
    if (!activeProject) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveProject(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeProject]);

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setSent(false);
    setSendError(false);
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      message: String(data.get("message") || "").trim(),
      honeypot: String(data.get("_honey") || ""),
    };
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.success === false) throw new Error("Submission failed");
      setSent(true);
      form.reset();
    } catch {
      setSendError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={`site ${activeProject ? "project-modal-open" : ""}`}>
      <div className="noise" />
      <div className="cursor-glow" />
      <header className="nav">
        <div className="container nav-inner">
          <button className="brand" onClick={() => go("top")}><span className="brand-mark">PJ</span><span>Piyush Jain</span></button>
          <nav className={`nav-links ${menuOpen ? "nav-open" : ""}`}>
            <button onClick={() => go("work")}>Work</button><button onClick={() => go("experience")}>Experience</button><button onClick={() => go("skills")}>Skills</button><button onClick={() => go("contact")}>Contact</button>
            <a className="resume-link" href="/Piyush-Jain-Resume.pdf" target="_blank" rel="noreferrer">Resume <Icon name="external" size={13} /></a>
          </nav>
          <button className="menu-btn" onClick={() => setMenuOpen(v => !v)} aria-label="Menu"><Icon name={menuOpen ? "close" : "menu"} /></button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-bg"><span className="blob blob-one" /><span className="blob blob-two" /><span className="blob blob-three" /></div>
          <div className="container hero-grid">
            <div className="hero-copy reveal">
              <div className="eyebrow-pill"><span /> OPEN TO SOFTWARE ENGINEERING ROLES</div>
              <p className="hero-kicker">SOFTWARE ENGINEER <b>×</b> GENAI <b>×</b> FULL-STACK <b>×</b> DATA ENGINEERING</p>
              <h1>Building <em>AI systems</em><br />that people can actually use.</h1>
              <p className="hero-lede">I’m Piyush Jain — I build practical LLM products and full-stack applications that solve real-world problems, from idea to shipped experience.</p>
              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => go("work")}>Explore my work <Icon name="arrow" size={17} /></button>
                <a className="btn btn-glass" href="/Piyush-Jain-Resume.pdf" target="_blank" rel="noreferrer"><Icon name="file" size={16} /> Resume</a>
              </div>
              <div className="social-row">
                <a href="https://github.com/PiyushJain2004" target="_blank" rel="noreferrer"><Icon name="github" size={16} /> GitHub</a>
                <a href="https://www.linkedin.com/in/piyush-jain-pj09/" target="_blank" rel="noreferrer"><Icon name="linkedin" size={16} /> LinkedIn</a>
                <a href="mailto:75.piyushjain@gmail.com"><Icon name="mail" size={16} /> 75.piyushjain@gmail.com</a>
              </div>
            </div>

            <div className="hero-visual reveal reveal-delay" aria-hidden="true">
              <div className="hero-orb">
                <div className="orb-ring ring-one" /><div className="orb-ring ring-two" /><div className="orb-ring ring-three" />
                <div className="orb-sphere"><div className="sphere-highlight" /><span>AI</span></div>
                <div className="orbit-dot od-one" /><div className="orbit-dot od-two" />
              </div>

            </div>
          </div>
          <div className="container hero-stats reveal">
            <div><b>4</b><span>featured projects</span></div><div><b>20+</b><span>tools & frameworks</span></div><div><b>2026</b><span>B.Tech · CSE</span></div>
          </div>
          <div className="scroll-cue">SCROLL TO EXPLORE <span>↓</span></div>
        </section>

        <section id="work" className="section work-section">
          <div className="container">
            <div className="section-heading reveal"><div><span className="section-number">01 — SELECTED WORK</span><h2>Projects with <em>real engineering</em> behind them.</h2></div></div>

            <article
              className="featured reveal"
              role="button"
              tabIndex={0}
              aria-label={`Open ${projects[0].title} details`}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a,button")) return;
                setActiveProject(projects[0]);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveProject(projects[0]);
                }
              }}
            >
              <div className="featured-visual"><ProjectVisual project={projects[0]} /><div className="featured-badge">MAIN PROJECT <span>✦</span></div></div>
              <div className="featured-body">
                <div className="project-top"><span>{projects[0].eyebrow}</span><b>{projects[0].metric}</b></div>
                <h3>{projects[0].title}</h3><p>{projects[0].description}</p>
                <div className="tags">{projects[0].stack.map(s => <span key={s}>{s}</span>)}</div>
                <ul>{projects[0].bullets.map(b => <li key={b}><Icon name="check" size={15} />{b}</li>)}</ul>
                <div className="project-actions"><button className="text-btn" onClick={() => setActiveProject(projects[0])}>View details <Icon name="arrow" size={15} /></button><a className="repo-btn" href={projects[0].href} target="_blank" rel="noreferrer"><Icon name="github" size={16} /> GitHub</a></div>
              </div>
            </article>

            <div className="project-grid">
              {projects.slice(1).map((project, i) => (
                <article className={`project-card reveal reveal-delay-${i + 1}`} key={project.title} onClick={() => setActiveProject(project)}>
                  <ProjectVisual project={project} />
                  <div className="card-content"><div className="project-top"><span>{project.eyebrow}</span><b>{project.metric}</b></div><h3>{project.title}</h3><p>{project.description}</p><div className="tags">{project.stack.slice(0, 5).map(s => <span key={s}>{s}</span>)}</div><div className="card-footer"><span>View case study</span><Icon name="arrow" size={15} /></div></div>
                </article>
              ))}
            </div>

            <a className="github-strip reveal" href="https://github.com/PiyushJain2004" target="_blank" rel="noreferrer"><span><Icon name="github" size={22} /></span><div><b>More experiments & source code</b><small>Explore the rest of my work on GitHub.</small></div><Icon name="arrow" size={19} /></a>
          </div>
        </section>

        <section id="experience" className="section experience-section">
          <div className="container">
            <div className="section-heading reveal"><div><span className="section-number">02 — EXPERIENCE</span><h2>Production work, <em>not just tutorials.</em></h2></div></div>
            <div className="experience-card reveal">
              <div className="exp-head"><div><span className="exp-label">SOFTWARE DEVELOPMENT INTERN · TEAM CAPTAIN</span><h3>PESU Venture Lab</h3><p>Bangalore, India · Jan 2026 — May 2026</p></div><span className="exp-year">2026</span></div>
              <div className="exp-metrics"><div><b>1K+</b><span>live users</span></div><div><b>4</b><span>member team</span></div><div><b>AI</b><span>recommendation agent</span></div></div>
              <div className="exp-grid"><div><span>SHIPPED</span><p>Engineered and shipped a full-stack influencer–brand platform using Next.js, React, Node.js, Express, and MongoDB, serving 1,000+ live users.</p></div><div><span>ENGINEERED</span><p>Designed REST APIs and automation workflows for campaigns, promotions, checkout, and onboarding, including Moodle LMS SSO and auto-login.</p></div><div><span>AI SYSTEMS</span><p>Built an LLM-powered recommendation and offer-ranking agent with Groq and MCP, with fallback handling for reliable AI behavior.</p></div><div><span>RELIABILITY</span><p>Collaborated on pre-production testing, issue resolution, and production troubleshooting before live releases.</p></div></div>
            </div>
          </div>
        </section>

        <section id="skills" className="section skills-section">
          <div className="container">
            <div className="section-heading reveal"><div><span className="section-number">03 — SKILLS</span><h2>The tools behind <em>the work.</em></h2></div></div>
            <div className="skills-grid">
              {skillGroups.map((g, i) => <div className={`skill-card ${g.color} reveal reveal-delay-${i + 1}`} key={g.name}><span className="skill-no">0{i + 1}</span><div className="skill-icon"><Icon name={i === 0 ? "sparkle" : i === 1 ? "arrow" : i === 2 ? "check" : "mail"} size={18} /></div><h3>{g.name}</h3><div className="skill-chips">{g.items.map(x => <span className="skill-chip" key={x}><i />{x}</span>)}</div></div>)}
            </div>
            <div className="fundamentals reveal"><span>CS FUNDAMENTALS</span>{["DSA", "OOP", "DBMS", "OS", "Computer Networks"].map(x => <b key={x}>{x}</b>)}</div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container">
            <div className="contact-heading reveal"><span className="section-number">04 — CONTACT</span><h2>Let’s build something<br /><em>worth shipping.</em></h2></div>
            <div className="contact-layout">
              <form className="contact-form reveal" onSubmit={handleSubmit}>
                <div className="form-row"><label><span>Name</span><input name="name" required placeholder="Your name" /></label><label><span>Email</span><input name="email" type="email" required placeholder="you@example.com" /></label></div>
                <label><span>Message</span><textarea name="message" required placeholder="Tell me what you're working on..." /></label>
                <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />
                <div className="form-bottom"><button className="send-btn" type="submit" disabled={sending}>{sending ? "Sending…" : "Send message"} <Icon name="send" size={15} /></button><span>sent directly to 75.piyushjain@gmail.com</span></div>
                {sent && <p className="form-note">Message sent successfully. Thanks for reaching out.</p>}
                {sendError && <p className="form-error">Couldn’t send the message. Please try again in a moment.</p>}
              </form>
              <aside className="contact-links reveal reveal-delay-1">
                <a href="mailto:75.piyushjain@gmail.com"><span><Icon name="mail" size={19} /> Email</span><b>75.piyushjain@gmail.com <Icon name="arrow" size={15} /></b></a>
                <a href="https://github.com/PiyushJain2004" target="_blank" rel="noreferrer"><span><Icon name="github" size={19} /> GitHub</span><b>@PiyushJain2004 <Icon name="external" size={14} /></b></a>
                <a href="https://www.linkedin.com/in/piyush-jain-pj09/" target="_blank" rel="noreferrer"><span><Icon name="linkedin" size={19} /> LinkedIn</span><b>Piyush Jain <Icon name="external" size={14} /></b></a>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <footer><div className="container"><span>© 2026 Piyush Jain</span><span>GenAI · Full-Stack · Data Engineering</span><button onClick={() => go("top")}>Back to top ↑</button></div></footer>

      {activeProject && <div className="modal-backdrop" onMouseDown={() => setActiveProject(null)}><div className="modal" onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true"><button className="modal-close" onClick={() => setActiveProject(null)} aria-label="Close"><Icon name="close" /></button><span className="section-number">{activeProject.eyebrow}</span><h2>{activeProject.title}</h2><p>{activeProject.description}</p><div className="modal-columns"><div><small>ENGINEERING HIGHLIGHTS</small><ul>{activeProject.bullets.map(b => <li key={b}><Icon name="check" size={15} />{b}</li>)}</ul></div><div><small>STACK</small><div className="modal-tags">{activeProject.stack.map(s => <span key={s}>{s}</span>)}</div><a className="btn btn-primary modal-repo" href={activeProject.href} target="_blank" rel="noreferrer">Open repository <Icon name="external" size={15} /></a></div></div></div></div>}
    </div>
  );
}

export default App;
