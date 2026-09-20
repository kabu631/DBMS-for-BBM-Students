/**
 * DBMS Syllabus Application Controller
 * Comprehensive SPA with interactive SQL Playground, Topic Organization,
 * University Practice Challenges, Live Schema Explorer, and Syntax Guides.
 */

class AppController {
  constructor() {
    this.currentRoute = "overview";
    this.completedTopics = JSON.parse(localStorage.getItem("dbms_completed_topics") || "[]");
    // Light is the default. The key is only written when the student toggles the
    // theme themselves, so an automatically saved value never overrides the default.
    this.theme = "light";
    try {
      const saved = localStorage.getItem("dbms_theme_choice");
      if (saved === "light" || saved === "dark") this.theme = saved;
    } catch (e) { /* storage blocked: keep default */ }
    this.activeW3Category = "ALL";
    this.activePlaygroundTopic = "ALL";
    this.sortColumn = null;
    this.sortAsc = true;
    this.queryHistory = [];

    this.practiceChallenges = [
      {
        id: "ch-1",
        title: "Challenge 1: High-Fee Students in Capital Valley",
        level: "Beginner",
        tag: "tag-select",
        desc: "Find the SID, Name, Address, and Fees of all students from 'Kathmandu' or 'Lalitpur' who pay fees of at least Rs. 25,000. Order by fees descending.",
        hint: "Use WHERE (address LIKE '%Kathmandu%' OR address LIKE '%Lalitpur%') AND fees >= 25000 ORDER BY fees DESC;",
        solution: "SELECT sid, name, address, fees FROM student\nWHERE (address LIKE '%Kathmandu%' OR address LIKE '%Lalitpur%')\n  AND fees >= 25000.00\nORDER BY fees DESC;",
        starter: "SELECT sid, name, address, fees FROM student\nWHERE -- your condition here\nORDER BY fees DESC;"
      },
      {
        id: "ch-2",
        title: "Challenge 2: Aggregate Statistics on Student Fees",
        level: "Intermediate",
        tag: "tag-aggregates",
        desc: "Compute the total count of students, total fees collected, average fee paid, minimum fee, and maximum fee across all enrolled students.",
        hint: "Use aggregate functions: COUNT(*), SUM(fees), ROUND(AVG(fees), 2), MIN(fees), MAX(fees) FROM student;",
        solution: "SELECT \n    COUNT(*) AS total_students,\n    SUM(fees) AS total_fees_collected,\n    ROUND(AVG(fees), 2) AS average_fee,\n    MIN(fees) AS min_fee,\n    MAX(fees) AS max_fee\nFROM student;",
        starter: "SELECT \n    -- add aggregate functions here\nFROM student;"
      },
      {
        id: "ch-3",
        title: "Challenge 3: Identify Unenrolled Courses",
        level: "Beginner",
        tag: "tag-select",
        desc: "List all courses that currently have NO student enrolled (where sid is NULL), displaying CID, Course Name, and Duration.",
        hint: "Remember to use 'sid IS NULL' instead of 'sid = NULL'.",
        solution: "SELECT cid, cname, duration\nFROM course\nWHERE sid IS NULL\nORDER BY cname;",
        starter: "SELECT cid, cname, duration\nFROM course\nWHERE -- check for NULL\nORDER BY cname;"
      },
      {
        id: "ch-4",
        title: "Challenge 4: Complete 3-Table Relational JOIN",
        level: "Advanced",
        tag: "tag-join",
        desc: "Perform a 3-table join connecting Student, Course, and Teacher. Display Student Name, Enrolled Course Name, Duration, and Assigned Faculty Name.",
        hint: "Join student s on s.sid = c.sid, then join teacher t on t.cid = c.cid.",
        solution: "SELECT \n    s.sid,\n    s.name AS student_name,\n    c.cname AS course_name,\n    c.duration AS course_duration_months,\n    t.tname AS faculty_instructor\nFROM student s\nINNER JOIN course c ON s.sid = c.sid\nINNER JOIN teacher t ON c.cid = t.cid\nORDER BY s.sid, c.cname;",
        starter: "SELECT \n    s.name AS student_name,\n    c.cname AS course_name,\n    t.tname AS faculty_instructor\nFROM student s\n-- add your JOINs here\n;"
      },
      {
        id: "ch-5",
        title: "Challenge 5: Faculty Earning Above Average Salary",
        level: "Intermediate",
        tag: "tag-select",
        desc: "Using a subquery, find all teachers whose salary is strictly greater than the overall average teacher salary. Display Teacher Name and Salary.",
        hint: "Use WHERE salary > (SELECT AVG(salary) FROM teacher)",
        solution: "SELECT \n    tname AS teacher_name,\n    salary,\n    ROUND(salary - (SELECT AVG(salary) FROM teacher), 2) AS above_avg_by\nFROM teacher\nWHERE salary > (\n    SELECT AVG(salary) FROM teacher\n)\nORDER BY salary DESC;",
        starter: "SELECT tname, salary FROM teacher\nWHERE salary > (\n    -- subquery here\n);"
      }
    ];

    this.init();
  }

  init() {
    this.applyTheme(this.theme);
    this.bindEvents();
    this.initLightbox();
    
    // Handle initial routing immediately
    this.handleRoute();
    this.updateProgressUI();

    // Initialize SQL WASM Engine in background (fallback is already active)
    if (window.sqlPlaygroundInstance && window.sqlPlaygroundInstance.init) {
      window.sqlPlaygroundInstance.init().catch(err => {
        console.warn("WASM init deferred; in-memory relational engine active.", err);
      });
    }
  }

  bindEvents() {
    // Hash change event for routing
    window.addEventListener("hashchange", () => this.handleRoute());

    // "Scrolled" flag drives the floating back-to-top button on phones
    const markScrolled = () => document.documentElement.classList.toggle("scrolled", window.scrollY > 500);
    window.addEventListener("scroll", markScrolled, { passive: true });
    markScrolled();

    // Web fonts change text widths, so re-measure diagrams once they have loaded
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => this.scheduleScrollHints());
    }

    // Theme toggle
    const themeBtn = document.getElementById("themeToggleBtn");
    if (themeBtn) {
      themeBtn.addEventListener("click", () => this.toggleTheme());
    }

    // Mobile menu toggle & backdrop
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const sidebar = document.getElementById("sidebar");
    const sidebarBackdrop = document.getElementById("sidebarBackdrop");
    const closeSidebarBtn = document.getElementById("closeSidebarBtn");

    // Keep a reference so route changes (handleRoute) can close the drawer too.
    // Previously navigation closed the sidebar but left the dark backdrop up.
    this.openMobileSidebar = () => {
      if (sidebar) sidebar.classList.add("open");
      if (sidebarBackdrop) sidebarBackdrop.classList.add("active");
      document.documentElement.classList.add("nav-open");   // lock background scroll
      if (mobileBtn) mobileBtn.setAttribute("aria-expanded", "true");
    };

    this.closeMobileSidebar = () => {
      if (sidebar) sidebar.classList.remove("open");
      if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
      document.documentElement.classList.remove("nav-open");
      if (mobileBtn) mobileBtn.setAttribute("aria-expanded", "false");
    };

    const openMobileSidebar = this.openMobileSidebar;
    const closeMobileSidebar = this.closeMobileSidebar;

    // Leaving the mobile layout (rotate / resize) must never leave the drawer locked open
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMobileSidebar();
      this.scheduleScrollHints();
    });
    window.addEventListener("orientationchange", () => this.scheduleScrollHints());

    if (mobileBtn) mobileBtn.addEventListener("click", openMobileSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeMobileSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", closeMobileSidebar);

    // Search trigger & modal
    const searchTrigger = document.getElementById("searchTrigger");
    const searchModal = document.getElementById("searchModal");
    const searchInput = document.getElementById("searchModalInput");
    const closeSearchBtn = document.getElementById("closeSearchModal");

    if (searchTrigger && searchModal) {
      searchTrigger.addEventListener("click", () => this.openSearchModal());
    }

    if (closeSearchBtn && searchModal) {
      closeSearchBtn.addEventListener("click", () => this.closeSearchModal());
    }

    if (searchModal) {
      searchModal.addEventListener("click", (e) => {
        if (e.target === searchModal) this.closeSearchModal();
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.handleSearch(e.target.value));
    }

    // Keyboard shortcuts (Ctrl+K for search, Esc to close)
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        this.openSearchModal();
      } else if (e.key === "Escape") {
        this.closeSearchModal();
        this.closeMobileSidebar();
      }
    });

    // Quick Floating Scroll Up & Down Controls
    const btnTop = document.getElementById("btnScrollTop");
    const btnBottom = document.getElementById("btnScrollBottom");
    if (btnTop) {
      btnTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
    if (btnBottom) {
      btnBottom.addEventListener("click", () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      });
    }
  }

  handleRoute() {
    const hash = window.location.hash.replace("#", "") || "overview";
    this.currentRoute = hash;

    // Update active nav link
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    navLinks.forEach(link => {
      if (link.getAttribute("data-unit") === hash) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Close the mobile drawer (sidebar + backdrop + scroll lock) on route change
    if (this.closeMobileSidebar) this.closeMobileSidebar();

    // Render content
    if (hash === "playground") {
      this.renderPlayground();
      this.updateBreadcrumb("Laboratory", "SQL Playground");
    } else if (hash === "normalization") {
      this.renderNormalization();
      this.updateBreadcrumb("Interactive Practice", "Normalization Practice Portal (60 Problems)");
    } else if (hash === "overview") {
      this.renderOverview();
      this.updateBreadcrumb("Course Information", "Overview & Textbooks");
    } else if (hash === "books" || hash === "textbooks") {
      this.renderOverview();
      this.updateBreadcrumb("Course Information", "Downloadable Reference Books");
      setTimeout(() => {
        const booksEl = document.getElementById("recommendedBooksSection");
        if (booksEl) booksEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } else if (hash === "glossary") {
      this.renderGlossary();
      this.updateBreadcrumb("Revision", "Glossary of Terms");
    } else if (hash === "studyguide") {
      this.renderStudyGuide();
      this.updateBreadcrumb("Revision", "Exam Study Guide");
    } else {
      const unit = SYLLABUS_DATA.units.find(u => u.id === hash) || SYLLABUS_DATA.units[0];
      this.renderUnit(unit);
      this.updateBreadcrumb("Core Syllabus", `${unit.number}: ${unit.title}`);
    }

    // Make tables / diagrams behave on small screens (see enhanceContent)
    this.enhanceContent();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  updateBreadcrumb(section, page) {
    const el = document.getElementById("breadcrumbUnit");
    if (!el) return;
    // The "Section /" prefix is hidden on phones (CSS .bc-section) so the
    // page name gets the whole width instead of being truncated.
    el.textContent = "";
    const prefix = document.createElement("span");
    prefix.className = "bc-section";
    prefix.textContent = `${section} / `;
    el.appendChild(prefix);
    el.appendChild(document.createTextNode(page));
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RESPONSIVE HELPERS — things CSS alone cannot do
  // ═══════════════════════════════════════════════════════════════════════════

  /**
   * Run after every route render. Idempotent.
   *  1. Wrap any bare <table> so it scrolls inside itself instead of widening the page.
   *  2. Tag tables with their column count so CSS can give wide ones a sensible min-width.
   *  3. Tell each inline SVG its natural width so it never shrinks to unreadable text.
   *  4. Add a "swipe sideways" hint under scrollable tables and diagrams.
   */
  enhanceContent() {
    const root = document.getElementById("mainContent");
    if (!root) return;

    // Exam-answer <details> start closed (tables inside measure 0px), so re-measure on open.
    if (!root.dataset.toggleBound) {
      root.dataset.toggleBound = "1";
      root.addEventListener("toggle", () => this.scheduleScrollHints(), true);
    }

    root.querySelectorAll("table").forEach(table => {
      // The playground manages its own results table + scroller
      if (table.closest(".results-table-container, .playground-wrapper-3col")) return;
      if (!table.parentElement.classList.contains("table-responsive")) {
        const wrap = document.createElement("div");
        wrap.className = "table-responsive";
        table.parentNode.insertBefore(wrap, table);
        wrap.appendChild(table);
      }
      const firstRow = table.querySelector("tr");
      let cols = 0;
      if (firstRow) {
        firstRow.querySelectorAll("th, td").forEach(c => { cols += c.colSpan || 1; });
      }
      table.classList.remove("cols-3", "cols-4", "cols-5", "cols-6");
      if (cols >= 3) table.classList.add(`cols-${Math.min(cols, 6)}`);
    });

    this.fitSvgs();

    // Syllabus paragraph in the unit banner: collapsed on phones, tap to expand
    root.querySelectorAll(".unit-desc").forEach(desc => {
      if (desc.nextElementSibling && desc.nextElementSibling.classList.contains("desc-toggle")) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "desc-toggle";
      btn.textContent = "Show full syllabus text ▾";
      btn.addEventListener("click", () => {
        const open = desc.classList.toggle("is-expanded");
        btn.textContent = open ? "Show less ▴" : "Show full syllabus text ▾";
      });
      desc.insertAdjacentElement("afterend", btn);
    });

    // Tables & diagrams get a "swipe" hint; code blocks only get the edge fade
    root.querySelectorAll(".table-responsive, .svg-figure, .code-content").forEach(region => {
      const next = region.nextElementSibling;
      const wantsHint = !region.classList.contains("code-content");
      if (wantsHint && (!next || !next.classList.contains("scroll-hint"))) {
        const hint = document.createElement("div");
        hint.className = "scroll-hint";
        hint.setAttribute("aria-hidden", "true");
        hint.textContent = region.classList.contains("svg-figure")
          ? "🔍 Tap the diagram to enlarge  ·  ↔ swipe to pan"
          : "↔ Swipe sideways to see more";
        region.insertAdjacentElement("afterend", hint);
      }
      this.bindScrollRegion(region);
    });

    this.scheduleScrollHints();
  }

  /** Keeps a scrollable region's edge-fade (data-scroll) up to date. Safe to call repeatedly. */
  bindScrollRegion(region) {
    if (!region || region.dataset.scrollBound) return;
    region.dataset.scrollBound = "1";
    region.addEventListener("scroll", () => this.updateScrollState(region), { passive: true });
    // Table hints go away once the reader has touched the table
    region.addEventListener("pointerdown", () => { region.dataset.touched = "1"; this.updateScrollState(region); }, { passive: true });
  }

  /** Sets data-scroll (none|start|middle|end) and shows/hides the hint for one region. */
  updateScrollState(region) {
    const max = region.scrollWidth - region.clientWidth;
    let state = "none";
    if (max > 4) {
      if (region.scrollLeft <= 2) state = "start";
      else if (region.scrollLeft >= max - 2) state = "end";
      else state = "middle";
    }
    region.dataset.scroll = state;
    const hint = region.nextElementSibling;
    if (hint && hint.classList.contains("scroll-hint")) {
      // Diagrams keep their "tap to enlarge" line; table hints vanish after first touch
      const persistent = region.classList.contains("svg-figure");
      hint.classList.toggle("is-needed", state !== "none" && (persistent || !region.dataset.touched));
    }
  }

  /** Debounced: re-measure every scrollable region (after render, resize, rotate, image load). */
  scheduleScrollHints() {
    clearTimeout(this._hintTimer);
    this._hintTimer = setTimeout(() => {
      this.fitSvgs();
      document.querySelectorAll("#mainContent .table-responsive, #mainContent .svg-figure, #mainContent .code-content, #mainContent .results-table-container")
        .forEach(region => this.updateScrollState(region));
    }, 120);
  }

  /**
   * Most diagrams are drawn on a wide canvas with empty margins, so shrinking the
   * whole canvas to phone width makes the text unreadable. On small screens we crop
   * each SVG's viewBox to its real content (getBBox); on larger screens we restore
   * the original. CSS then gives the cropped diagram a readable minimum width.
   */
  fitSvgs() {
    const compact = window.innerWidth <= 900;
    document.querySelectorAll("#mainContent .svg-figure svg").forEach(svg => {
      if (!svg.dataset.vb) svg.dataset.vb = svg.getAttribute("viewBox") || "";
      let vb = svg.dataset.vb;
      if (!vb) return;
      if (compact) {
        try {
          const b = svg.getBBox();
          if (b.width > 60 && b.height > 30) {
            const pad = 14;
            vb = [b.x - pad, b.y - pad, b.width + pad * 2, b.height + pad * 2]
              .map(n => Math.round(n * 10) / 10).join(" ");
          }
        } catch (e) { /* not rendered yet; keep the original viewBox */ }
      }
      svg.setAttribute("viewBox", vb);
      const width = parseFloat(vb.split(/[\s,]+/)[2]);
      if (width) svg.style.setProperty("--svg-w", `${Math.round(width)}px`);

      // Diagrams are drawn symmetrically, so start the pan in the middle, once.
      const fig = svg.closest(".svg-figure");
      if (compact && fig && !fig.dataset.centered && fig.scrollWidth > fig.clientWidth + 4) {
        fig.dataset.centered = "1";
        fig.scrollLeft = (fig.scrollWidth - fig.clientWidth) / 2;
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FIGURE LIGHTBOX — tap a diagram / image on a phone to view it full-screen
  // ═══════════════════════════════════════════════════════════════════════════

  initLightbox() {
    if (document.getElementById("figureLightbox")) return;
    const box = document.createElement("div");
    box.id = "figureLightbox";
    box.className = "lightbox";
    box.hidden = true;
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Enlarged figure");
    box.innerHTML = `
      <div class="lightbox-bar">
        <span class="lightbox-hint">Pinch to zoom · drag to pan</span>
        <button type="button" class="lightbox-close" aria-label="Close enlarged figure">✕ Close</button>
      </div>
      <div class="lightbox-body"></div>
      <div class="lightbox-caption"></div>`;
    document.body.appendChild(box);

    box.querySelector(".lightbox-close").addEventListener("click", () => this.closeLightbox());
    box.addEventListener("click", e => { if (e.target === box) this.closeLightbox(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") this.closeLightbox(); });

    // One delegated listener covers every diagram and image, present and future.
    document.getElementById("mainContent").addEventListener("click", e => {
      if (window.innerWidth > 900) return;                       // desktop: images already big enough
      if (e.target.closest("a, button, summary")) return;
      const target = e.target.closest(".svg-figure svg, .note-img");
      if (target) this.openLightbox(target);
    });
  }

  openLightbox(source) {
    const box = document.getElementById("figureLightbox");
    if (!box) return;
    const body = box.querySelector(".lightbox-body");
    body.textContent = "";

    const clone = source.cloneNode(true);
    clone.removeAttribute("loading");
    clone.classList.remove("note-img");
    if (source.tagName.toLowerCase() === "svg") {
      const w = parseFloat(getComputedStyle(source).getPropertyValue("--svg-w")) || 700;
      clone.style.cssText = `width:${Math.max(720, Math.round(w * 1.15))}px;min-width:0;max-width:none;height:auto;`;
    } else {
      const natural = source.naturalWidth || 600;
      clone.style.cssText = `width:${Math.min(1000, Math.max(360, natural * 2))}px;max-width:none;height:auto;background:#fff;border-radius:8px;padding:8px;`;
    }
    body.appendChild(clone);

    const cap = source.closest(".note-figure, .svg-figure");
    const capEl = cap && cap.querySelector(".figure-caption");
    box.querySelector(".lightbox-caption").textContent = capEl ? capEl.textContent : (source.getAttribute("alt") || "");

    this._lightboxReturnFocus = document.activeElement;
    box.hidden = false;
    document.documentElement.classList.add("lightbox-open");
    body.scrollTop = 0;
    body.scrollLeft = Math.max(0, (body.scrollWidth - body.clientWidth) / 2);
    box.querySelector(".lightbox-close").focus();
  }

  closeLightbox() {
    const box = document.getElementById("figureLightbox");
    if (!box || box.hidden) return;
    box.hidden = true;
    box.querySelector(".lightbox-body").textContent = "";
    document.documentElement.classList.remove("lightbox-open");
    if (this._lightboxReturnFocus && this._lightboxReturnFocus.focus) this._lightboxReturnFocus.focus();
  }

  renderOverview() {
    const container = document.getElementById("mainContent");
    if (!container) return;

    const info = SYLLABUS_DATA.courseInfo || {};
    const readings = info.readings || info.references || [];

    const unitCards = (SYLLABUS_DATA.units || []).map(u => `
      <div class="feature-card" style="cursor:pointer; transition:all var(--transition-fast);" onclick="location.hash='#${u.id}'">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span class="unit-tag" style="margin-bottom:0;">${u.number}</span>
          <span style="font-size:0.75rem; font-weight:700; color:var(--accent-secondary);">${u.readingTime}</span>
        </div>
        <h4 style="font-size:1.05rem; margin-bottom:6px; color:var(--text-primary);">${u.title}</h4>
        <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">${u.subtitle || u.description || ''}</p>
        <div style="margin-top:12px; font-size:0.8rem; color:var(--accent-primary); font-weight:600;">
          Explore Unit Topics ➜
        </div>
      </div>
    `).join("");

    const BOOK_MAP = {
      "Fundamentals of Database Systems": {
        file: "Fundamentals of Database Systems (Book 1).pdf",
        size: "4.3 MB"
      },
      "Database System Concepts": {
        file: "Database System Concepts (Book 2).pdf",
        size: "16.5 MB"
      },
      "Database Management Systems": {
        file: "Database Management Systems (Book 3).pdf",
        size: "12.1 MB"
      },
      "Principles of Distributed Database Systems": {
        file: "Principles of Distributed Database Systems (Book 4).pdf",
        size: "3.7 MB"
      },
      "A First Course in Database Systems": {
        file: "A First Course in Database Systems (Book 5).pdf",
        size: "11.7 MB"
      },
      "NoSQL for Dummies": {
        file: "NoSQL-for-dummies (Book 6).pdf",
        size: "3.3 MB"
      }
    };

    const refBooks = readings.map(ref => {
      const mapped = BOOK_MAP[ref.title] || {};
      const fileName = ref.fileName || mapped.file || '';
      const fileSize = ref.fileSize || mapped.size || 'PDF';
      const fileUrl = fileName ? `Books/${encodeURIComponent(fileName)}` : '';

      return `
        <div class="book-card">
          <a href="${fileUrl}" target="_blank" rel="noopener" class="book-cover-link" title="Open ${ref.title} PDF in new tab">
            <div class="book-cover">📚</div>
          </a>
          <div class="book-info">
            <a href="${fileUrl}" target="_blank" rel="noopener" class="book-title-link" title="Read ${ref.title} PDF">
              <div class="book-title">${ref.title}</div>
            </a>
            <div class="book-author">${ref.authors || ref.author || ''} ${ref.edition ? `(${ref.edition})` : ''}</div>
            <div class="book-publisher">${ref.publisher || ''}</div>
          </div>
          ${fileUrl ? `
            <div class="book-icon-actions">
              <a href="${fileUrl}" target="_blank" rel="noopener" class="btn-book-icon btn-icon-read" title="Read Online in Browser (${ref.title})" aria-label="Read Online">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </a>
              <a href="${fileUrl}" download="${fileName}" class="btn-book-icon btn-icon-download" title="Download PDF (${fileSize})" aria-label="Download PDF">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </a>
            </div>
          ` : ''}
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="unit-banner">
        <span class="unit-tag">${info.code || info.courseCode || 'CSC-DBMS'}</span>
        <h1 class="unit-title">${info.title || 'Database Management Systems'}</h1>
        <div class="unit-subtitle">${info.description || 'Comprehensive Database Course Syllabus & Knowledge Base'}</div>
        <div class="unit-meta">
          <div class="unit-meta-item"><span>⏱️</span> <strong>${info.totalLHs || info.lectureHours || '48 Lecture Hours'}</strong></div>
          <div class="unit-meta-item"><span>🧪</span> <strong>${info.labHours || '16 Lab Hours'}</strong></div>
          <div class="unit-meta-item"><span>🎓</span> <strong>Tribhuvan University Course Standard</strong></div>
        </div>
      </div>

      <div class="definition-box" style="margin-bottom: 28px;">
        <div class="definition-title">🎯 Course Objectives & Scope</div>
        <p>${info.objective || 'The main objective of this course is to introduce different concepts of database, data modeling with ER diagram, features of SQL, normalization, transaction processing, concurrency control, and database recovery.'}</p>
        ${info.labObjective ? `<p style="margin-top:8px;"><strong>Laboratory Work:</strong> ${info.labObjective}</p>` : ''}
      </div>

      <h3 style="font-family:var(--font-heading); font-size:1.3rem; margin-bottom:16px; color:var(--text-primary);">
        📚 Core Syllabus Units (6 Units & 48 Lecture Hours)
      </h3>

      <div class="unit-cards-grid">
        ${unitCards}
      </div>

      <div class="topic-card" id="recommendedBooksSection">
        <div class="topic-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px;">
          <div>
            <h3 class="topic-title">📖 Recommended Standard Reference Textbooks</h3>
            <div class="topic-summary">Prescribed reference books for in-depth theoretical, relational, and mathematical foundations. Direct download links and online reading available below.</div>
          </div>
          <div class="books-summary-badge">
            <span>6 Downloadable PDFs</span>
          </div>
        </div>
        <div class="books-grid">
          ${refBooks}
        </div>
      </div>

      <div class="topic-card" style="background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08)); border-color: rgba(99,102,241,0.3); margin-top:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <h3 style="font-size:1.3rem; margin-bottom:6px; color:var(--text-primary);">⚡ Hands-On Interactive SQL Playground</h3>
            <p style="color:var(--text-secondary); font-size:0.9rem; max-width:650px;">
              Practice live SQL queries in your browser with preloaded Nepali student, course, and faculty datasets and W3Schools command reference guide.
            </p>
          </div>
          <a href="#playground" class="btn-primary" style="padding:10px 20px;">
            <span>Launch SQL Playground ➜</span>
          </a>
        </div>
      </div>
    `;
  }

  renderUnit(unit) {
    const container = document.getElementById("mainContent");
    if (!container) return;

    const topicsHtml = unit.topics.map(t => {
      const isCompleted = this.completedTopics.includes(t.id);
      return `
        <article class="topic-card" id="${t.id}">
          <div class="topic-header">
            <div>
              <h2 class="topic-title">${t.title}</h2>
              <div class="topic-summary">${t.summary}</div>
            </div>
            <label class="topic-status-check ${isCompleted ? 'completed' : ''}">
              <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="app.toggleTopicCompletion('${t.id}', this.checked)">
              <span>${isCompleted ? 'Completed ✓' : 'Mark as Read'}</span>
            </label>
          </div>
          ${t.content}
        </article>
      `;
    }).join("");

    container.innerHTML = `
      <div class="unit-banner">
        <span class="unit-tag">${unit.number}</span>
        <h1 class="unit-title">${unit.title}</h1>
        <div class="unit-subtitle">${unit.subtitle}</div>
        <p class="unit-desc">${unit.description}</p>
        <div class="unit-meta">
          <div class="unit-meta-item"><span>⏱️</span> <strong>${unit.readingTime}</strong></div>
          <div class="unit-meta-item"><span>📑</span> <strong>${unit.topics.length} Major Topics</strong></div>
        </div>
      </div>

      ${this.renderUnitIntro(unit)}

      <div class="topics-container">
        ${topicsHtml}
      </div>

      ${this.renderExamCorner(unit)}
      ${this.renderQuiz(unit)}
    `;

    this.bindCopyButtons();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GLOSSARY & EXAM STUDY GUIDE PAGES
  // ═══════════════════════════════════════════════════════════════════════════

  renderGlossary() {
    const container = document.getElementById("mainContent");
    if (!container) return;

    const terms = (typeof GLOSSARY !== "undefined" ? GLOSSARY : []).slice()
      .sort((a, b) => a.term.localeCompare(b.term));
    const units = [...new Set(terms.map(t => t.unit))];

    const filterChips = units.map(u => `
      <button class="btn-outline glossary-filter-btn" data-unit-filter="${u}" onclick="app.filterGlossary('${u}')" style="padding:5px 14px; font-size:0.78rem;">${u}</button>
    `).join("");

    const cardsHtml = terms.map(t => `
      <div class="glossary-card" data-glossary-term="${t.term.toLowerCase()}" data-glossary-def="${(t.def || '').toLowerCase().replace(/"/g, '&quot;')}" data-glossary-unit="${t.unit}">
        <div class="glossary-term">${t.term}</div>
        <div class="glossary-def">${t.def}</div>
        <span class="glossary-unit">${t.unit}</span>
      </div>
    `).join("");

    container.innerHTML = `
      <div class="unit-banner">
        <span class="unit-tag">Revision</span>
        <h1 class="unit-title">📚 Glossary of Terms</h1>
        <div class="unit-subtitle">Every key term from all six units, in one searchable place</div>
        <p class="unit-desc">${terms.length} terms collected across the whole syllabus. Use this in the last week before an exam to check you can define every bolded word you have studied — if a definition here doesn't ring a bell, that is exactly the topic to re-read.</p>
      </div>

      <div class="glossary-toolbar">
        <input type="text" class="glossary-search" id="glossarySearchInput" placeholder="🔍 Search a term or definition…" oninput="app.filterGlossary(null, this.value)">
        <button class="btn-outline" data-unit-filter="ALL" onclick="app.filterGlossary('ALL')" style="padding:5px 14px; font-size:0.78rem;">All Units</button>
        ${filterChips}
      </div>

      <div class="glossary-grid" id="glossaryGrid">
        ${cardsHtml}
      </div>
      <div class="glossary-empty" id="glossaryEmpty" style="display:none;">No terms match your search. Try a different keyword.</div>
    `;
  }

  filterGlossary(unitFilter, searchText) {
    const grid = document.getElementById("glossaryGrid");
    if (!grid) return;

    const searchInput = document.getElementById("glossarySearchInput");
    const query = (searchText !== undefined ? searchText : (searchInput ? searchInput.value : "")).trim().toLowerCase();

    // Track active unit filter on the grid dataset so search and unit-filter compose.
    if (unitFilter !== null && unitFilter !== undefined) {
      grid.dataset.activeUnit = unitFilter;
      document.querySelectorAll(".glossary-toolbar [data-unit-filter]").forEach(btn => {
        btn.classList.toggle("btn-primary", btn.getAttribute("data-unit-filter") === unitFilter);
      });
    }
    const activeUnit = grid.dataset.activeUnit || "ALL";

    let visibleCount = 0;
    grid.querySelectorAll(".glossary-card").forEach(card => {
      const matchesUnit = activeUnit === "ALL" || card.dataset.glossaryUnit === activeUnit;
      const matchesSearch = !query || card.dataset.glossaryTerm.includes(query) || card.dataset.glossaryDef.includes(query);
      const visible = matchesUnit && matchesSearch;
      card.style.display = visible ? "" : "none";
      if (visible) visibleCount++;
    });

    const empty = document.getElementById("glossaryEmpty");
    if (empty) empty.style.display = visibleCount === 0 ? "block" : "none";
  }

  renderStudyGuide() {
    const container = document.getElementById("mainContent");
    if (!container) return;

    const units = SYLLABUS_DATA.units || [];
    const totalQuiz = units.reduce((sum, u) => sum + ((u.quiz || []).length), 0);
    const totalQa = units.reduce((sum, u) => sum + (((u.examCorner || {}).questions || []).length), 0);

    const planCards = units.map(u => {
      const mustKnow = (u.examCorner || {}).mustKnow || [];
      return `
        <div class="plan-card">
          <h4>${u.number}: ${u.title}</h4>
          <p><strong>${u.readingTime}</strong> · ${u.topics.length} topics</p>
          ${mustKnow.length ? `<p style="margin-top:8px;"><strong>Revise first:</strong></p><ul>${mustKnow.slice(0, 6).map(m => `<li>${m}</li>`).join("")}</ul>` : ""}
          <p style="margin-top:10px;">
            <a href="#${u.id}" class="btn-outline" style="display:inline-block; padding:5px 12px; font-size:0.8rem;">Open Unit ➜</a>
          </p>
        </div>
      `;
    }).join("");

    container.innerHTML = `
      <div class="unit-banner">
        <span class="unit-tag">Revision</span>
        <h1 class="unit-title">🗓️ Exam Study Guide</h1>
        <div class="unit-subtitle">How to use this site to prepare efficiently in the days before your exam</div>
        <div class="unit-meta">
          <div class="unit-meta-item"><span>📝</span> <strong>${totalQa} Model Q&amp;A</strong></div>
          <div class="unit-meta-item"><span>🧩</span> <strong>${totalQuiz} Self-Test Questions</strong></div>
          <div class="unit-meta-item"><span>📚</span> <strong>${(typeof GLOSSARY !== "undefined" ? GLOSSARY.length : 0)} Glossary Terms</strong></div>
        </div>
      </div>

      <div class="unit-intro-card">
        <h2>📖 A Simple 4-Step Study Method</h2>
        <p><strong>1. Read the unit topic by topic.</strong> Each topic starts with an "In Simple Words" box — read that first for the plain-language version before the formal definitions.</p>
        <p><strong>2. Work every "Worked Example" by hand</strong> on paper before reading the given answer. Numerical questions (finding candidate keys, normalizing a table, tracing a schedule) are where most marks are won or lost.</p>
        <p><strong>3. Open the unit's Exam Corner</strong> at the bottom of the page. Try to answer each question from memory, then click it open to compare with the model answer.</p>
        <p><strong>4. Take the unit's Self-Test quiz</strong> and aim for at least 80% before moving to the next unit. Then, in the final week, sweep the <a href="#glossary" style="color:var(--accent-primary); font-weight:600;">Glossary</a> to make sure you can define every term without hesitating.</p>
      </div>

      <h3 style="font-family:var(--font-heading); font-size:1.3rem; margin:28px 0 6px; color:var(--text-primary);">📋 Unit-by-Unit Revision Checklist</h3>
      <p style="color:var(--text-secondary); font-size:0.9rem; margin-bottom:8px;">The "revise first" list under each unit is its highest-yield exam topics — if you are short on time, start there.</p>
      <div class="plan-grid">
        ${planCards}
      </div>

      <div class="topic-card" style="background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(6,182,212,0.08)); border-color: rgba(99,102,241,0.3); margin-top:24px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
          <div>
            <h3 style="font-size:1.3rem; margin-bottom:6px; color:var(--text-primary);">⚡ Practise SQL Live</h3>
            <p style="color:var(--text-secondary); font-size:0.9rem; max-width:650px;">
              SQL numericals are the easiest marks in the whole exam because they have exact, checkable answers. Practise them in the SQL Playground until you can write a JOIN or a GROUP BY without hesitating.
            </p>
          </div>
          <a href="#playground" class="btn-primary" style="padding:10px 20px;">
            <span>Open SQL Playground ➜</span>
          </a>
        </div>
      </div>
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // NORMALIZATION PRACTICE PORTAL EMBED
  // ═══════════════════════════════════════════════════════════════════════════

  renderNormalization() {
    const container = document.getElementById("mainContent");
    if (!container) return;

    const currentTheme = this.theme || "light";

    container.innerHTML = `
      <div class="normalization-portal-wrapper">
        <div class="normalization-portal-header">
          <div class="norm-header-info">
            <div class="norm-title-row">
              <span class="norm-pill-badge">Interactive Practice Platform</span>
              <span class="norm-count-badge">60 Academic Problems</span>
            </div>
            <h2 class="norm-portal-title">🧩 Database Normalization Practice</h2>
            <p class="norm-portal-desc">
              Master Functional Dependencies, Attribute Closures, Candidate Keys, 1NF Atomicity, 2NF Partial Dependencies, and 3NF Transitive Decompositions with step-by-step verified solutions.
            </p>
          </div>
          <div class="norm-header-actions">
            <a href="normalization/index.html" target="_blank" rel="noopener" class="btn-portal-action" title="Open Normalization in a separate window">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              <span>Open in New Tab</span>
            </a>
            <button type="button" class="btn-portal-action" id="btnNormFullscreen" title="Toggle Fullscreen Mode">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
              <span>Fullscreen</span>
            </button>
          </div>
        </div>

        <div class="normalization-frame-container" id="normFrameContainer">
          <iframe 
            id="normalizationFrame" 
            src="normalization/index.html?embed=true&theme=${encodeURIComponent(currentTheme)}" 
            title="DBMS Normalization Practice Platform" 
            loading="lazy"
            allow="clipboard-write">
          </iframe>
        </div>
      </div>
    `;

    // Fullscreen toggle handler
    const btnFullscreen = document.getElementById("btnNormFullscreen");
    const frameContainer = document.getElementById("normFrameContainer");
    if (btnFullscreen && frameContainer) {
      btnFullscreen.addEventListener("click", () => {
        if (!document.fullscreenElement) {
          if (frameContainer.requestFullscreen) {
            frameContainer.requestFullscreen().catch(err => console.warn("Fullscreen request error:", err));
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen().catch(err => console.warn("Exit fullscreen error:", err));
          }
        }
      });
    }

    // Sync theme on iframe load
    const frame = document.getElementById("normalizationFrame");
    if (frame) {
      frame.addEventListener("load", () => {
        try {
          frame.contentWindow.postMessage({ type: "THEME_CHANGE", theme: this.theme }, "*");
        } catch (e) { /* cross-origin fallback */ }
      });
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STUDENT-FRIENDLY UNIT EXTRAS: plain-language intro, exam corner, quiz
  // ═══════════════════════════════════════════════════════════════════════════

  /** Plain-language "what this unit is really about" card, shown under the banner. */
  renderUnitIntro(unit) {
    const intro = unit.simpleIntro;
    if (!intro) return "";

    const goalsHtml = (intro.goals || []).length
      ? `<p style="margin-top:14px;"><strong>By the end of this unit you should be able to:</strong></p>
         <ul class="unit-goals">${intro.goals.map(g => `<li>${g}</li>`).join("")}</ul>`
      : "";

    return `
      <section class="unit-intro-card">
        <h2>🎯 ${intro.heading || "What This Unit Is Really About"}</h2>
        ${intro.text || ""}
        ${goalsHtml}
      </section>
    `;
  }

  /** Revision checklist plus collapsible model answers for likely exam questions. */
  renderExamCorner(unit) {
    const ec = unit.examCorner;
    if (!ec) return "";

    const mustKnowHtml = (ec.mustKnow || []).length
      ? `<div class="ec-section-title">✅ Must-Know Checklist — revise these first</div>
         <div class="term-strip">${ec.mustKnow.map(t => `<span class="term-chip">${t}</span>`).join("")}</div>`
      : "";

    const questionsHtml = (ec.questions || []).length
      ? `<div class="ec-section-title">📝 Likely Exam Questions with Model Answers</div>
         <p style="color:var(--text-secondary); font-size:0.87rem; margin-bottom:12px;">
           Try to answer each question on paper first, then click it to compare with the model answer.
         </p>
         ${ec.questions.map(item => `
           <details class="qa-item">
             <summary>${item.q}<span class="qa-marks">${item.marks} marks</span></summary>
             <div class="qa-answer">${item.a}</div>
           </details>
         `).join("")}`
      : "";

    return `
      <section class="exam-corner" id="${unit.id}-exam-corner">
        <h2>🎓 Exam Corner — ${unit.number}</h2>
        <div class="ec-sub">Everything from this unit that has a habit of appearing in question papers, with answers written the way an examiner wants to read them.</div>
        ${mustKnowHtml}
        ${questionsHtml}
      </section>
    `;
  }

  /** Multiple-choice self-test. Answers are checked in the browser, nothing is sent anywhere. */
  renderQuiz(unit) {
    const quiz = unit.quiz;
    if (!quiz || !quiz.length) return "";

    const letters = ["A", "B", "C", "D", "E"];
    const questionsHtml = quiz.map((item, qi) => {
      const optsHtml = item.opts.map((opt, oi) => `
        <button type="button" class="quiz-opt" id="${unit.id}-q${qi}-o${oi}"
                onclick="app.answerQuiz('${unit.id}', ${qi}, ${oi}, ${item.correct})">
          <span class="opt-key">${letters[oi]}.</span>${opt}
        </button>
      `).join("");

      return `
        <div class="quiz-q" id="${unit.id}-q${qi}">
          <div class="quiz-q-text"><span class="quiz-num">Q${qi + 1}.</span>${item.q}</div>
          <div class="quiz-opts">${optsHtml}</div>
          <div class="quiz-feedback" id="${unit.id}-q${qi}-fb" style="display:none;"></div>
        </div>
      `;
    }).join("");

    return `
      <section class="quiz-block" id="${unit.id}-quiz">
        <h2>🧩 Self-Test — ${unit.number}</h2>
        <div class="quiz-sub">${quiz.length} questions. Pick an answer to see instantly whether you were right and, more usefully, <em>why</em>.</div>
        <div class="quiz-score">
          <span class="score-pill" id="${unit.id}-score">0 / ${quiz.length} answered</span>
          <button class="btn-outline" style="padding:5px 14px; font-size:0.8rem;" onclick="app.resetQuiz('${unit.id}', ${quiz.length})">↺ Try Again</button>
        </div>
        ${questionsHtml}
      </section>
    `;
  }

  /** Handles one quiz answer: locks the question, colours the options, shows the explanation. */
  answerQuiz(unitId, qIndex, chosen, correct) {
    const qEl = document.getElementById(`${unitId}-q${qIndex}`);
    if (!qEl || qEl.dataset.answered === "true") return;
    qEl.dataset.answered = "true";

    const unit = SYLLABUS_DATA.units.find(u => u.id === unitId);
    const item = unit && unit.quiz ? unit.quiz[qIndex] : null;

    qEl.querySelectorAll(".quiz-opt").forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correct) btn.classList.add("is-correct");
      else if (idx === chosen) btn.classList.add("is-wrong");
    });

    const fb = document.getElementById(`${unitId}-q${qIndex}-fb`);
    if (fb && item) {
      const wasRight = chosen === correct;
      fb.style.display = "block";
      fb.innerHTML = `<strong>${wasRight ? "✅ Correct." : "❌ Not quite."}</strong> ${item.explain || ""}`;
      fb.style.borderLeftColor = wasRight ? "var(--accent-emerald)" : "var(--accent-rose)";
    }

    this.updateQuizScore(unitId);
  }

  updateQuizScore(unitId) {
    const unit = SYLLABUS_DATA.units.find(u => u.id === unitId);
    if (!unit || !unit.quiz) return;

    const total = unit.quiz.length;
    let answered = 0;
    let right = 0;

    unit.quiz.forEach((item, qi) => {
      const qEl = document.getElementById(`${unitId}-q${qi}`);
      if (qEl && qEl.dataset.answered === "true") {
        answered++;
        const correctBtn = document.getElementById(`${unitId}-q${qi}-o${item.correct}`);
        const wrongPicked = qEl.querySelector(".quiz-opt.is-wrong");
        if (correctBtn && !wrongPicked) right++;
      }
    });

    const pill = document.getElementById(`${unitId}-score`);
    if (!pill) return;

    if (answered === 0) {
      pill.textContent = `0 / ${total} answered`;
    } else if (answered < total) {
      pill.textContent = `Score: ${right} / ${answered} correct (${total - answered} left)`;
    } else {
      const pct = Math.round((right / total) * 100);
      const verdict = pct >= 80 ? "Excellent — exam ready 🎉"
        : pct >= 60 ? "Good — revise the ones you missed"
        : "Re-read this unit, then try again";
      pill.textContent = `Final: ${right} / ${total} (${pct}%) — ${verdict}`;
    }
  }

  resetQuiz(unitId, total) {
    for (let qi = 0; qi < total; qi++) {
      const qEl = document.getElementById(`${unitId}-q${qi}`);
      if (!qEl) continue;
      qEl.dataset.answered = "false";
      qEl.querySelectorAll(".quiz-opt").forEach(btn => {
        btn.disabled = false;
        btn.classList.remove("is-correct", "is-wrong");
      });
      const fb = document.getElementById(`${unitId}-q${qi}-fb`);
      if (fb) { fb.style.display = "none"; fb.innerHTML = ""; }
    }
    this.updateQuizScore(unitId);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SQL PLAYGROUND RENDERING & INTERACTIVE FEATURES
  // ═══════════════════════════════════════════════════════════════════════════

  renderPlayground() {
    const container = document.getElementById("mainContent");
    if (!container) return;

    const schema = window.sqlPlaygroundInstance.getSchema();
    let schemaHtml = "";

    for (const [tblName, tblData] of Object.entries(schema)) {
      const colsHtml = tblData.columns.map(c => `
        <div class="column-row" onclick="app.insertSnippet('${c.name}')" title="Click to insert '${c.name}' into editor">
          <span><strong style="color:var(--text-primary);">${c.name}</strong> <small style="color:var(--text-muted)">(${c.type})</small></span>
          ${c.pk ? '<span class="pk-tag">🔑 PK</span>' : (c.name === 'sid' || c.name === 'cid') ? '<span class="pk-tag" style="background:rgba(6,182,212,0.2);color:var(--accent-secondary)">🔗 FK</span>' : ''}
        </div>
      `).join("");

      schemaHtml += `
        <div class="table-item">
          <div class="table-item-header" onclick="this.nextElementSibling.classList.toggle('hidden')">
            <span>🗃️ <strong>${tblName}</strong></span>
            <span class="nav-badge">${tblData.rowCount} rows</span>
          </div>
          <div class="column-list">
            <div style="font-size:0.72rem; color:var(--text-muted); margin-bottom:4px;">💡 Click any column to insert:</div>
            ${colsHtml}
            <div style="display:flex; gap:6px; margin-top:8px; padding-top:8px; border-top:1px solid var(--border-color);">
              <button class="btn-outline" style="padding:3px 8px; font-size:0.72rem; flex:1;" onclick="app.previewTable('${tblName}')" title="Preview first 10 rows">
                👁️ Preview 10
              </button>
              <button class="btn-outline" style="padding:3px 8px; font-size:0.72rem; flex:1;" onclick="app.generateSelectTemplate('${tblName}')" title="Insert SELECT query">
                ⚡ SELECT
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // Category Tabs for Reference & Challenges
    const activeCategory = this.activeW3Category || "ALL";
    const refGuides = SYLLABUS_DATA.w3ReferenceGuides || [];
    
    let filteredGuides = [];
    if (activeCategory === "ALL") {
      filteredGuides = refGuides;
    } else if (activeCategory === "CHALLENGES") {
      filteredGuides = [];
    } else {
      filteredGuides = refGuides.filter(g => g.category === activeCategory);
    }

    const categories = [
      { id: "ALL", label: "📚 All Queries" },
      { id: "SELECT", label: "🔍 SELECT & WHERE" },
      { id: "JOIN", label: "🔗 Relational JOINs" },
      { id: "AGGREGATES", label: "📊 Aggregates" },
      { id: "INSERT", label: "➕ INSERT" },
      { id: "UPDATE", label: "✏️ UPDATE" },
      { id: "DELETE", label: "🗑️ DELETE" },
      { id: "CHALLENGES", label: "🏆 Practice Challenges" }
    ];

    const categoryTabsHtml = categories.map(cat => `
      <button class="pg-topic-btn ${cat.id === activeCategory ? 'active' : ''}" onclick="app.filterW3Reference('${cat.id}')">
        ${cat.label}
      </button>
    `).join("");

    let refCardsHtml = "";

    if (activeCategory === "CHALLENGES") {
      refCardsHtml = this.practiceChallenges.map((ch, idx) => `
        <div class="challenge-box" id="${ch.id}">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <span class="challenge-badge">${ch.level}</span>
            <span style="font-size:0.75rem; color:var(--text-muted);">Challenge #${idx + 1}</span>
          </div>
          <div class="challenge-title">${ch.title}</div>
          <div class="challenge-desc">${ch.desc}</div>
          <div class="challenge-actions">
            <button class="w3-btn-action w3-btn-load" onclick="app.loadCustomQuery(\`${ch.starter.replace(/\\`/g, "\\\\`").replace(/\\/g, "\\\\\\\\")}\`)">
              <span>🚀 Load Starter</span>
            </button>
            <button class="w3-btn-action" onclick="app.toggleChallengeHint('${ch.id}')">
              <span>💡 Hint</span>
            </button>
            <button class="w3-btn-action" style="background:rgba(16,185,129,0.15);color:var(--accent-emerald);" onclick="app.loadCustomQuery(\`${ch.solution.replace(/\\`/g, "\\\\`").replace(/\\/g, "\\\\\\\\")}\`)">
              <span>🔍 Solution</span>
            </button>
          </div>
          <div class="hint-box hidden" id="hint-${ch.id}">
            <strong>💡 Hint:</strong> ${ch.hint}
          </div>
        </div>
      `).join("");
    } else {
      refCardsHtml = filteredGuides.map(g => `
        <div class="w3-card" id="${g.id}">
          <div class="w3-card-header">
            <span class="w3-card-title">${g.title}</span>
            <span class="w3-tag ${g.tag}">${g.category}</span>
          </div>
          <div class="w3-desc">${g.desc}</div>
          <div class="w3-code-block">${g.sql.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
          <div class="w3-card-actions">
            <button class="w3-btn-action" onclick="app.copySnippet('${g.id}', \`${g.sql.replace(/\\`/g, "\\\\`").replace(/\\/g, "\\\\\\\\")}\`)">
              <span>📋 Copy</span>
            </button>
            <button class="w3-btn-action w3-btn-load" onclick="app.loadCustomQuery(\`${g.sql.replace(/\\`/g, "\\\\`").replace(/\\/g, "\\\\\\\\")}\`)">
              <span>⚡ Load into Editor</span>
            </button>
          </div>
        </div>
      `).join("");
    }

    // Quick Snippet Chips for Editor
    const snippets = [
      { label: "SELECT *", code: "SELECT * FROM " },
      { label: "WHERE", code: " WHERE " },
      { label: "INNER JOIN", code: " INNER JOIN course c ON s.sid = c.sid " },
      { label: "3-TABLE JOIN", code: "SELECT t.tname, t.salary, c.cname, s.name FROM teacher t INNER JOIN course c ON t.cid = c.cid INNER JOIN student s ON c.sid = s.sid;" },
      { label: "GROUP BY", code: " GROUP BY " },
      { label: "ORDER BY DESC", code: " ORDER BY fees DESC " },
      { label: "COUNT(*)", code: "COUNT(*)" },
      { label: "HAVING", code: " HAVING " },
      { label: "LIMIT 10", code: " LIMIT 10;" }
    ];

    const snippetChipsHtml = snippets.map(s => `
      <button class="snippet-chip" onclick="app.insertSnippet(\`${s.code.replace(/\\`/g, "\\\\`").replace(/\\/g, "\\\\\\\\")}\`)">
        + ${s.label}
      </button>
    `).join("");

    container.innerHTML = `
      <div class="unit-banner" style="margin-bottom: 20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <span class="unit-tag" style="background:rgba(6,182,212,0.2); color:var(--accent-secondary);">Laboratory Works</span>
            <h1 class="unit-title">Interactive SQL Playground & Laboratory</h1>
            <div class="unit-subtitle">Execute real SQL queries live in your browser using in-memory WebAssembly SQLite engine.</div>
          </div>
          <div style="display:flex; gap:10px;">
            <button class="btn-outline" style="padding:8px 14px; font-size:0.85rem;" onclick="app.resetPlaygroundDb()">
              🔄 Reset Database
            </button>
          </div>
        </div>
      </div>

      <!-- Spacious 2-Column Wide Workspace (Editor & Large Results Table) -->
      <div class="playground-layout-wide">
        <!-- Column 1: Schema Explorer Panel -->
        <aside class="schema-panel">
          <div class="panel-title">
            <span>🗃️ Database Tables</span>
            <button class="btn-outline" style="padding:3px 8px; font-size:0.75rem;" onclick="app.resetPlaygroundDb()">Reset</button>
          </div>
          <div class="table-list" id="schemaTableList">
            ${schemaHtml}
          </div>
        </aside>

        <!-- Column 2: Big SQL Editor & Expansive Results Output -->
        <div class="playground-main">
          <!-- Big SQL Editor -->
          <div class="editor-card">
            <div class="editor-toolbar">
              <div class="editor-title">
                <span>💻 SQL Query Editor</span>
              </div>
              <div class="editor-actions">
                <select class="form-select" style="padding:5px 10px; font-size:0.8rem; background:var(--bg-tertiary); color:var(--text-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); max-width:200px;" onchange="if(this.value) { app.loadCustomQuery(this.value); this.value=''; }">
                  <option value="">⚡ Quick Presets...</option>
                  <option value="SELECT * FROM student;">1. All Students (15 rows)</option>
                  <option value="SELECT * FROM course;">2. All Courses (15 rows)</option>
                  <option value="SELECT * FROM teacher;">3. All Faculty (10 rows)</option>
                  <option value="SELECT sid, name, address, fees, contact FROM student WHERE fees >= 25000;">4. High-Fee Students</option>
                  <option value="SELECT s.sid, s.name, s.fees, c.cname, c.duration FROM student s INNER JOIN course c ON s.sid = c.sid;">5. Student-Course Join</option>
                  <option value="SELECT t.tname, t.salary, c.cname, s.name AS student_name FROM teacher t INNER JOIN course c ON t.cid = c.cid INNER JOIN student s ON c.sid = s.sid;">6. 3-Table Relational Join</option>
                  <option value="SELECT AVG(fees) AS avg_fee, MIN(fees) AS min_fee, MAX(fees) AS max_fee, COUNT(*) AS total_students FROM student;">7. Aggregate Statistics</option>
                </select>
                <button class="btn-outline" style="padding:5px 10px; font-size:0.8rem;" onclick="app.formatSqlQuery()" title="Format and Capitalize SQL keywords">
                  ✨ Format SQL
                </button>
                <button class="btn-outline" style="padding:5px 10px; font-size:0.8rem;" onclick="app.clearEditor()">
                  Clear
                </button>
                <button class="btn-primary" id="btnRunQuery" onclick="app.executeCurrentQuery()" style="padding:6px 14px;">
                  <span>▶ Run Query</span>
                  <span style="font-size:0.72rem; opacity:0.8;">(Ctrl+Enter)</span>
                </button>
              </div>
            </div>

            <!-- Quick Snippet Insertion Bar -->
            <div style="padding: 8px 16px; background: #161b22; border-bottom: 1px solid rgba(255,255,255,0.06); display:flex; align-items:center; gap:8px; overflow-x:auto;">
              <span style="font-size:0.72rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; white-space:nowrap;">Quick Inserts:</span>
              <div class="snippet-chips-bar">
                ${snippetChipsHtml}
              </div>
            </div>

            <textarea id="sqlQueryInput" class="sql-textarea" spellcheck="false" placeholder="Write your SQL query here (e.g. SELECT * FROM student;)">${SYLLABUS_DATA.sampleQueries[0].sql}</textarea>
          </div>

          <!-- Big Expansive Results Output Card -->
          <div class="results-card">
            <div class="results-header">
              <div style="display:flex; align-items:center; gap:10px;">
                <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary); margin:0;">
                  <span>📊 Execution Results</span>
                </h3>
                <span class="meta-badge" id="resultsRowCount">0 Rows</span>
                <span id="resultsExecTime" style="font-family:var(--font-mono); font-size:0.82rem; color:var(--accent-emerald);">0 ms</span>
              </div>
              <div class="results-meta" id="resultsMeta" style="display:flex; align-items:center; gap:8px;">
                <input type="text" id="tableLiveFilter" style="padding:5px 12px; font-size:0.8rem; width:180px; background:var(--bg-secondary); border:1px solid var(--border-color); border-radius:var(--radius-sm); color:var(--text-primary);" placeholder="🔍 Filter rows live..." oninput="app.filterResults(this.value)" />
                <button class="btn-outline" id="btnCopyTable" style="padding:4px 10px; font-size:0.78rem; display:none;" onclick="app.copyResultsTable()">📋 Copy Table</button>
                <button class="btn-outline" id="btnExportCsv" style="padding:4px 10px; font-size:0.78rem; display:none;" onclick="app.exportResultsToCsv()">📄 Export CSV</button>
              </div>
            </div>

            <div id="resultsOutput" class="results-table-container">
              <div class="results-empty">
                Hit <strong>▶ Run Query</strong> or press <strong>Ctrl+Enter</strong> to view query execution results.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Reference & Practice Challenges Grid Section -->
      <section class="playground-bottom-ref" id="sqlReferenceSection">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
          <div>
            <h2 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin:0 0 4px 0;">
              <span>📖 SQL Command Reference & Practice Lab Challenges</span>
            </h2>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin:0;">
              Click any query below to load it into the compiler above and practice with live university records.
            </p>
          </div>
        </div>

        <!-- Topic Filter Tabs -->
        <div class="pg-topic-bar" style="margin-bottom:16px;">
          ${categoryTabsHtml}
        </div>

        <!-- Reference Cards Grid -->
        <div class="w3-grid-layout" id="w3CardList">
          ${refCardsHtml}
        </div>
      </section>
    `;

    // Bind Ctrl+Enter shortcut in textarea
    const textarea = document.getElementById("sqlQueryInput");
    if (textarea) {
      textarea.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          e.preventDefault();
          this.executeCurrentQuery();
        }
      });
    }

    // Auto-run initial query on open for instant engagement
    this.executeCurrentQuery();
  }

  switchPlaygroundMobileTab(tabName) {
    this.playgroundMobileTab = tabName;
    this.renderPlayground();
  }

  filterW3Reference(category) {
    this.activeW3Category = category;
    this.renderPlayground();
  }

  toggleChallengeHint(chId) {
    const hint = document.getElementById(`hint-${chId}`);
    if (hint) hint.classList.toggle("hidden");
  }

  insertSnippet(code) {
    const textarea = document.getElementById("sqlQueryInput");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;

    textarea.value = currentVal.substring(0, start) + code + currentVal.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + code.length;
  }

  formatSqlQuery() {
    const textarea = document.getElementById("sqlQueryInput");
    if (!textarea) return;

    let sql = textarea.value;
    const keywords = [
      "SELECT", "FROM", "WHERE", "GROUP BY", "ORDER BY", "HAVING", "LIMIT",
      "INSERT INTO", "VALUES", "UPDATE", "SET", "DELETE FROM",
      "INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN", "JOIN", "ON",
      "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "ADD COLUMN",
      "PRIMARY KEY", "FOREIGN KEY", "REFERENCES", "CHECK", "UNIQUE", "DEFAULT",
      "AND", "OR", "NOT", "IN", "BETWEEN", "LIKE", "IS NULL", "IS NOT NULL",
      "COUNT", "SUM", "AVG", "MIN", "MAX", "ROUND", "UNION", "CASE", "WHEN", "THEN", "ELSE", "END", "AS"
    ];

    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, "gi");
      sql = sql.replace(regex, kw);
    });

    textarea.value = sql;
  }

  previewTable(tblName) {
    this.loadCustomQuery(`SELECT * FROM ${tblName} LIMIT 10;`);
  }

  generateSelectTemplate(tblName) {
    this.loadCustomQuery(`SELECT * \nFROM ${tblName}\nORDER BY 1;`);
  }

  loadCustomQuery(sqlQuery) {
    this.playgroundMobileTab = "editor";
    const textarea = document.getElementById("sqlQueryInput");
    if (textarea) {
      textarea.value = sqlQuery;
      this.executeCurrentQuery();
      textarea.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.location.hash = "#playground";
      setTimeout(() => {
        const ta = document.getElementById("sqlQueryInput");
        if (ta) {
          ta.value = sqlQuery;
          this.executeCurrentQuery();
        }
      }, 100);
    }
  }

  copySnippet(cardId, code) {
    navigator.clipboard.writeText(code).then(() => {
      const card = document.getElementById(cardId);
      if (card) {
        const copyBtn = card.querySelector(".w3-card-actions .w3-btn-action:first-child span");
        if (copyBtn) {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = "Copied! ✓";
          setTimeout(() => {
            copyBtn.textContent = originalText;
          }, 1600);
        }
      }
    });
  }

  copyCellText(val, element) {
    navigator.clipboard.writeText(val).then(() => {
      if (element) {
        const originalBg = element.style.background;
        element.style.background = "rgba(16, 185, 129, 0.25)";
        setTimeout(() => {
          element.style.background = originalBg;
        }, 600);
      }
    });
  }

  clearEditor() {
    const textarea = document.getElementById("sqlQueryInput");
    if (textarea) {
      textarea.value = "";
      textarea.focus();
    }
  }

  resetPlaygroundDb() {
    window.sqlPlaygroundInstance.resetDatabase();
    this.renderPlayground();
  }

  executeCurrentQuery() {
    const textarea = document.getElementById("sqlQueryInput");
    if (!textarea) return;

    const query = textarea.value;
    const outputContainer = document.getElementById("resultsOutput");
    const metaRowCount = document.getElementById("resultsRowCount");
    const metaExecTime = document.getElementById("resultsExecTime");
    const exportBtn = document.getElementById("btnExportCsv");
    const copyTableBtn = document.getElementById("btnCopyTable");
    const filterInput = document.getElementById("tableLiveFilter");

    if (filterInput) filterInput.value = "";

    const res = window.sqlPlaygroundInstance.execute(query);

    if (!res.success) {
      outputContainer.innerHTML = `
        <div class="error-banner">
          <strong>❌ SQL Execution Error:</strong> ${res.error}
        </div>
      `;
      metaRowCount.textContent = "Error";
      metaExecTime.textContent = "";
      if (exportBtn) exportBtn.style.display = "none";
      if (copyTableBtn) copyTableBtn.style.display = "none";
      return;
    }

    if (res.isCommandResult) {
      outputContainer.innerHTML = `
        <div style="padding: 24px; text-align:center; color:var(--accent-emerald);">
          <strong>✅ Query Executed:</strong> ${res.message}
        </div>
      `;
      metaRowCount.textContent = "0 Rows Affected";
      metaExecTime.textContent = `${res.executionTime} ms`;
      if (exportBtn) exportBtn.style.display = "none";
      if (copyTableBtn) copyTableBtn.style.display = "none";
      return;
    }

    // Save result for sort and export
    this.lastResultData = res;
    this.sortColumn = null;
    this.sortAsc = true;
    this.filterQuery = "";
    this.renderResultsTable();

    metaRowCount.textContent = `${res.rowCount} Row${res.rowCount === 1 ? '' : 's'}`;
    metaExecTime.textContent = `${res.executionTime} ms`;
    if (exportBtn) exportBtn.style.display = "inline-flex";
    if (copyTableBtn) copyTableBtn.style.display = "inline-flex";
  }

  filterResults(query) {
    this.filterQuery = (query || "").trim().toLowerCase();
    this.renderResultsTable();
  }

  renderResultsTable() {
    const outputContainer = document.getElementById("resultsOutput");
    if (!outputContainer || !this.lastResultData) return;

    const { columns, values } = this.lastResultData;

    let displayRows = [...values];

    // Live search filter
    if (this.filterQuery) {
      displayRows = displayRows.filter(row => {
        return row.some(cell => {
          if (cell === null || cell === undefined) return false;
          return String(cell).toLowerCase().includes(this.filterQuery);
        });
      });
    }

    // Sorting
    if (this.sortColumn !== null) {
      const colIdx = columns.indexOf(this.sortColumn);
      if (colIdx !== -1) {
        displayRows.sort((a, b) => {
          const valA = a[colIdx];
          const valB = b[colIdx];
          if (valA === null) return 1;
          if (valB === null) return -1;
          if (typeof valA === "number" && typeof valB === "number") {
            return this.sortAsc ? valA - valB : valB - valA;
          }
          return this.sortAsc 
            ? String(valA).localeCompare(String(valB)) 
            : String(valB).localeCompare(String(valA));
        });
      }
    }

    let tableHtml = `<table class="results-table"><thead><tr>`;
    tableHtml += `<th style="width:36px; text-align:center;">#</th>`;

    columns.forEach(col => {
      let sortClass = "";
      if (col === this.sortColumn) {
        sortClass = this.sortAsc ? "sorted-asc" : "sorted-desc";
      }
      tableHtml += `<th class="${sortClass}" onclick="app.sortTableBy('${col}')" title="Click to sort by ${col}">${col}</th>`;
    });

    tableHtml += `</tr></thead><tbody>`;

    if (displayRows.length === 0) {
      tableHtml += `<tr><td colspan="${columns.length + 1}" style="text-align:center; padding:24px; color:var(--text-muted);">No matching rows found.</td></tr>`;
    } else {
      displayRows.forEach((row, rIdx) => {
        tableHtml += `<tr>`;
        tableHtml += `<td class="row-index-cell">${rIdx + 1}</td>`;
        row.forEach((val, colIdx) => {
          const colName = (columns[colIdx] || "").toLowerCase();
          if (val === null) {
            tableHtml += `<td><span class="null-pill">NULL</span></td>`;
          } else if (colName === "contact" || colName.includes("phone") || colName === "sid" || colName === "cid" || colName === "tid" || colName.endsWith("_id") || colName.endsWith("id")) {
            // Numbers WITHOUT commas (Phone / Contact / IDs)
            tableHtml += `<td style="font-family:var(--font-mono); font-weight:600; color:var(--text-primary); cursor:pointer;" onclick="app.copyCellText('${val}', this)" title="Click to copy ${val}">${val}</td>`;
          } else if (colName === "fees" || colName === "salary" || colName.includes("fee") || colName.includes("salary") || colName.includes("price") || colName.includes("amount") || (typeof val === "number" && !Number.isInteger(val))) {
            // Decimal values formatted with 2 decimal places (e.g. 25000.00, 85000.00)
            const numVal = Number(val);
            const formatted = isNaN(numVal) ? val : numVal.toFixed(2);
            tableHtml += `<td style="font-family:var(--font-mono); font-weight:600; color:var(--accent-emerald); cursor:pointer;" onclick="app.copyCellText('${formatted}', this)" title="Click to copy ${formatted}">${formatted}</td>`;
          } else if (typeof val === "number") {
            tableHtml += `<td style="font-family:var(--font-mono); font-weight:600; color:var(--text-primary); cursor:pointer;" onclick="app.copyCellText('${val}', this)" title="Click to copy ${val}">${val}</td>`;
          } else {
            tableHtml += `<td style="cursor:pointer;" onclick="app.copyCellText('${String(val).replace(/'/g, "\\'")}', this)" title="Click to copy ${val}">${val}</td>`;
          }
        });
        tableHtml += `</tr>`;
      });
    }

    tableHtml += `</tbody></table>`;
    outputContainer.innerHTML = tableHtml;

    // Wide result sets scroll sideways inside the card; show the edge fade on phones
    this.bindScrollRegion(outputContainer);
    this.scheduleScrollHints();
  }

  sortTableBy(colName) {
    if (this.sortColumn === colName) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortColumn = colName;
      this.sortAsc = true;
    }
    this.renderResultsTable();
  }

  exportResultsToCsv() {
    if (!this.lastResultData || !this.lastResultData.columns) return;
    const { columns, values } = this.lastResultData;
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += columns.join(",") + "\r\n";
    values.forEach(row => {
      csvContent += row.map((v, colIdx) => {
        if (v === null) return '""';
        const colName = (columns[colIdx] || "").toLowerCase();
        if (colName === "fees" || colName === "salary" || colName.includes("fee") || colName.includes("salary")) {
          const num = Number(v);
          return `"${!isNaN(num) ? num.toFixed(2) : v}"`;
        }
        return `"${v}"`;
      }).join(",") + "\r\n";
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "query_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  copyResultsTable() {
    if (!this.lastResultData) return;
    const { columns, values } = this.lastResultData;
    let tsv = columns.join("\t") + "\n";
    values.forEach(r => {
      tsv += r.map((v, colIdx) => {
        if (v === null) return 'NULL';
        const colName = (columns[colIdx] || "").toLowerCase();
        if (colName === "fees" || colName === "salary" || colName.includes("fee") || colName.includes("salary")) {
          const num = Number(v);
          return !isNaN(num) ? num.toFixed(2) : v;
        }
        return v;
      }).join("\t") + "\n";
    });
    navigator.clipboard.writeText(tsv).then(() => {
      const btn = document.getElementById("btnCopyTable");
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = "Copied! ✓";
        setTimeout(() => btn.textContent = orig, 1600);
      }
    });
  }

    toggleTopicCompletion(topicId, isChecked) {
    if (isChecked) {
      if (!this.completedTopics.includes(topicId)) {
        this.completedTopics.push(topicId);
      }
    } else {
      this.completedTopics = this.completedTopics.filter(id => id !== topicId);
    }

    localStorage.setItem("dbms_completed_topics", JSON.stringify(this.completedTopics));
    this.updateProgressUI();

    // Update label style
    const label = document.querySelector(`#${topicId} .topic-status-check`);
    if (label) {
      if (isChecked) {
        label.classList.add("completed");
        label.querySelector("span").textContent = "Completed ✓";
      } else {
        label.classList.remove("completed");
        label.querySelector("span").textContent = "Mark as Read";
      }
    }
  }

  updateProgressUI() {
    let totalTopics = 0;
    SYLLABUS_DATA.units.forEach(unit => {
      totalTopics += unit.topics.length;
      const completedInUnit = unit.topics.filter(t => this.completedTopics.includes(t.id)).length;
      
      // Update badge in sidebar
      const navBadge = document.querySelector(`.sidebar-nav a[data-unit="${unit.id}"] .nav-badge`);
      if (navBadge) {
        navBadge.textContent = `${unit.readingTime.split(' ')[0]} LHs (${completedInUnit}/${unit.topics.length})`;
      }
    });

    const percent = totalTopics > 0 ? Math.round((this.completedTopics.length / totalTopics) * 100) : 0;
    const progressFill = document.getElementById("progressBarFill");
    const progressPct = document.getElementById("progressPercentage");

    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressPct) progressPct.textContent = `${percent}%`;
  }

  openSearchModal() {
    const modal = document.getElementById("searchModal");
    const input = document.getElementById("searchModalInput");
    if (modal && input) {
      modal.classList.add("active");
      input.value = "";
      input.focus();
      this.handleSearch("");
    }
  }

  closeSearchModal() {
    const modal = document.getElementById("searchModal");
    if (modal) modal.classList.remove("active");
  }

  handleSearch(query) {
    const resultsContainer = document.getElementById("searchResultsList");
    if (!resultsContainer) return;

    const q = query.toLowerCase().trim();
    let matches = [];

    SYLLABUS_DATA.units.forEach(unit => {
      unit.topics.forEach(topic => {
        if (!q || topic.title.toLowerCase().includes(q) || topic.summary.toLowerCase().includes(q) || topic.content.toLowerCase().includes(q)) {
          matches.push({ unit, topic });
        }
      });
    });

    const isNormMatch = q && ("normalization practice closures candidate keys 1nf 2nf 3nf decomposition").includes(q);

    const bookMatches = q ? (SYLLABUS_DATA.courseInfo?.readings || []).filter(b => {
      return (
        b.title.toLowerCase().includes(q) ||
        b.authors.toLowerCase().includes(q) ||
        (b.tag && b.tag.toLowerCase().includes(q)) ||
        ("download book books textbook textbooks pdf").includes(q)
      );
    }) : [];

    if (matches.length === 0 && !isNormMatch && bookMatches.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align:center; padding: 24px; color:var(--text-muted);">
          No matching topics or textbooks found for "<em>${query}</em>"
        </div>
      `;
      return;
    }

    let html = "";
    if (isNormMatch) {
      html += `
        <div class="search-result-item search-result-featured" onclick="app.closeSearchModal(); window.location.hash='#normalization';">
          <div class="search-result-unit" style="color:var(--accent-blue);">Interactive Practice Portal • 60 Questions</div>
          <div class="search-result-title">🧩 Normalization Practice Platform</div>
          <div style="font-size:0.8rem; color:var(--text-secondary);">60 Solved Problems: Closures, Candidate Keys, 1NF, 2NF & 3NF Decompositions.</div>
        </div>
      `;
    }

    if (bookMatches.length > 0) {
      bookMatches.slice(0, 3).forEach(b => {
        html += `
          <div class="search-result-item search-result-book" onclick="app.closeSearchModal(); window.location.hash='#books';">
            <div class="search-result-unit" style="color:#10b981;">Downloadable Textbook • ${b.fileSize}</div>
            <div class="search-result-title">📕 ${b.title} (${b.edition})</div>
            <div style="font-size:0.8rem; color:var(--text-secondary);">${b.authors} • ${b.publisher}</div>
          </div>
        `;
      });
    }

    html += matches.slice(0, 8).map(m => `
      <div class="search-result-item" onclick="app.navigateToTopic('${m.unit.id}', '${m.topic.id}')">
        <div class="search-result-unit">${m.unit.number}: ${m.unit.title}</div>
        <div class="search-result-title">${m.topic.title}</div>
        <div style="font-size:0.8rem; color:var(--text-secondary);">${m.topic.summary}</div>
      </div>
    `).join("");

    resultsContainer.innerHTML = html;
  }

  navigateToTopic(unitId, topicId) {
    this.closeSearchModal();
    window.location.hash = `#${unitId}`;
    setTimeout(() => {
      const topicEl = document.getElementById(topicId);
      if (topicEl) {
        topicEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }

  toggleTheme() {
    const newTheme = this.theme === "dark" ? "light" : "dark";
    this.applyTheme(newTheme);
    try { localStorage.setItem("dbms_theme_choice", newTheme); } catch (e) { /* ignore */ }
  }

  applyTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b0f19" : "#f8fafc");

    const themeIcon = document.getElementById("themeIcon");
    const themeText = document.getElementById("themeText");
    if (themeIcon && themeText) {
      if (theme === "dark") {
        themeIcon.textContent = "☀️";
        themeText.textContent = "Light Mode";
      } else {
        themeIcon.textContent = "🌙";
        themeText.textContent = "Dark Mode";
      }
    }

    // Sync theme with embedded Normalization iframe if present
    const normFrame = document.getElementById("normalizationFrame");
    if (normFrame && normFrame.contentWindow) {
      try {
        normFrame.contentWindow.postMessage({ type: "THEME_CHANGE", theme }, "*");
      } catch (e) { /* cross-origin fallback */ }
    }
  }

  bindCopyButtons() {
    const copyBtns = document.querySelectorAll(".btn-copy-code");
    copyBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const code = btn.getAttribute("data-code");
        if (code) {
          navigator.clipboard.writeText(code).then(() => {
            const originalText = btn.textContent;
            btn.textContent = "Copied! ✓";
            btn.style.background = "var(--accent-emerald)";
            setTimeout(() => {
              btn.textContent = originalText;
              btn.style.background = "";
            }, 1800);
          });
        }
      });
    });
  }
}

// Global App Instance
window.app = new AppController();
