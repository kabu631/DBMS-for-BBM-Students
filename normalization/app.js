// =============================================================================
// DBMS Normalization Platform - Logic & Interactions (app.js)
// =============================================================================

(function () {
  'use strict';

  // State
  let state = {
    category: 'all',
    difficulty: 'all',
    status: 'all',
    search: '',
    revealAll: false,
    mastered: new Set(),
    theme: 'light'
  };

  // DOM Elements
  const questionsList = document.getElementById('questionsList');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  const diffFilter = document.getElementById('diffFilter');
  const statusFilter = document.getElementById('statusFilter');
  const categoryTabs = document.getElementById('categoryTabs');
  const resultsCount = document.getElementById('resultsCount');
  const activeFilterBadge = document.getElementById('activeFilterBadge');
  const progressBar = document.getElementById('progressBar');
  const progressStats = document.getElementById('progressStats');
  const btnResetProgress = document.getElementById('btnResetProgress');
  const btnToggleMode = document.getElementById('btnToggleMode');
  const modeText = document.getElementById('modeText');
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const btnChecklist = document.getElementById('btnChecklist');
  const checklistModal = document.getElementById('checklistModal');
  const modalClose = document.getElementById('modalClose');
  const footerChecklistLink = document.getElementById('footerChecklistLink');
  const btnPrint = document.getElementById('btnPrint');

  const themeIcon = document.getElementById('themeIcon');

  // Category counts
  const countAll = document.getElementById('countAll');
  const countClosures = document.getElementById('countClosures');
  const count1nf2nf = document.getElementById('count1nf2nf');
  const count3nf = document.getElementById('count3nf');

  // Safe data access
  function getData() {
    if (typeof QUESTIONS_DATA !== 'undefined' && Array.isArray(QUESTIONS_DATA)) return QUESTIONS_DATA;
    if (typeof window !== 'undefined' && Array.isArray(window.QUESTIONS_DATA)) return window.QUESTIONS_DATA;
    if (typeof globalThis !== 'undefined' && Array.isArray(globalThis.QUESTIONS_DATA)) return globalThis.QUESTIONS_DATA;
    return [];
  }

  function getCounts() {
    if (typeof getCategoryCounts === 'function') return getCategoryCounts();
    if (typeof window !== 'undefined' && typeof window.getCategoryCounts === 'function') return window.getCategoryCounts();
    const data = getData();
    return {
      all: data.length,
      "closures-keys": data.filter(q => q.category === "closures-keys").length,
      "1nf-2nf": data.filter(q => q.category === "1nf-2nf").length,
      "3nf": data.filter(q => q.category === "3nf").length
    };
  }

  // Theme application
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    const metaThemeColor = document.getElementById('themeColorMeta');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'light' ? '#f8fafc' : '#090d16');
    }
    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
      } else {
        themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
      }
    }
  }

  // Initialize
  function init() {
    loadSavedState();
    setupEventListeners();
    updateCategoryBadges();
    renderQuestions();
    updateProgress();
  }

  // Load from localStorage
  function loadSavedState() {
    try {
      const savedMastered = localStorage.getItem('dbms_mastered');
      if (savedMastered) {
        state.mastered = new Set(JSON.parse(savedMastered));
      }
      const savedTheme = localStorage.getItem('dbms_theme');
      const parentTheme = localStorage.getItem('dbms_theme_choice');
      const params = new URLSearchParams(window.location.search);
      const queryTheme = params.get('theme');
      if (queryTheme === 'light' || queryTheme === 'dark') {
        applyTheme(queryTheme);
      } else if (parentTheme === 'light' || parentTheme === 'dark') {
        applyTheme(parentTheme);
      } else if (savedTheme) {
        applyTheme(savedTheme);
      } else {
        applyTheme('light');
      }
      if (params.get('embed') === 'true' || window.self !== window.top) {
        document.body.classList.add('is-embedded');
      }
    } catch (e) {
      console.warn('Could not load localStorage state', e);
      applyTheme('light');
    }
  }

  // Cross-frame theme sync from parent window
  window.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'THEME_CHANGE' && (event.data.theme === 'light' || event.data.theme === 'dark')) {
      applyTheme(event.data.theme);
      saveTheme();
    }
  });

  function saveMastered() {
    try {
      localStorage.setItem('dbms_mastered', JSON.stringify([...state.mastered]));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }

  function saveTheme() {
    try {
      localStorage.setItem('dbms_theme', state.theme);
    } catch (e) {
      console.warn('Could not save theme', e);
    }
  }

  // Update Category Badge Numbers
  function updateCategoryBadges() {
    const counts = getCounts();
    if (countAll) countAll.textContent = counts.all;
    if (countClosures) countClosures.textContent = counts['closures-keys'];
    if (count1nf2nf) count1nf2nf.textContent = counts['1nf-2nf'];
    if (count3nf) count3nf.textContent = counts['3nf'];
  }

  // Update Progress Tracker
  function updateProgress() {
    const total = getData().length;
    const solved = state.mastered.size;
    const percentage = total > 0 ? Math.round((solved / total) * 100) : 0;

    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressBar && progressBar.parentElement) {
      progressBar.parentElement.setAttribute('aria-valuenow', percentage);
    }
    if (progressStats) progressStats.textContent = `${solved} of ${total} Solved (${percentage}%)`;
  }

  // Filter Data
  function getFilteredQuestions() {
    const data = getData();
    return data.filter(q => {
      // Category filter
      if (state.category !== 'all' && q.category !== state.category) {
        return false;
      }

      // Difficulty filter
      if (state.difficulty !== 'all' && q.difficulty !== state.difficulty) {
        return false;
      }

      // Status filter
      const isMastered = state.mastered.has(q.id);
      if (state.status === 'mastered' && !isMastered) return false;
      if (state.status === 'unsolved' && isMastered) return false;

      // Search query
      if (state.search.trim()) {
        const query = state.search.toLowerCase().trim();
        const inTitle = q.title.toLowerCase().includes(query);
        const inRelation = q.relation.toLowerCase().includes(query);
        const inFds = q.fds.some(fd => fd.toLowerCase().includes(query));
        const inTasks = q.tasks.some(t => t.toLowerCase().includes(query));
        const inSolution = q.solution.explanation ? q.solution.explanation.toLowerCase().includes(query) : false;
        const inKeys = q.solution.candidateKey ? q.solution.candidateKey.toLowerCase().includes(query) : false;

        return inTitle || inRelation || inFds || inTasks || inSolution || inKeys;
      }

      return true;
    });
  }

  // Render Questions
  function renderQuestions() {
    const filtered = getFilteredQuestions();
    resultsCount.textContent = `Showing ${filtered.length} problem${filtered.length === 1 ? '' : 's'}`;

    const catLabels = {
      all: 'All Categories',
      'closures-keys': '1. Closures & Keys',
      '1nf-2nf': '2. 1NF & 2NF Normalization',
      '3nf': '3. 3NF Normalization'
    };
    activeFilterBadge.textContent = `${catLabels[state.category]} • ${state.difficulty === 'all' ? 'All Difficulties' : state.difficulty}`;

    if (filtered.length === 0) {
      questionsList.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    const fragment = document.createDocumentFragment();

    filtered.forEach(q => {
      const card = createQuestionCard(q);
      fragment.appendChild(card);
    });

    questionsList.innerHTML = '';
    questionsList.appendChild(fragment);
  }

  // Create Individual Question Card Element
  function createQuestionCard(q) {
    const isMastered = state.mastered.has(q.id);
    const card = document.createElement('article');
    card.className = `question-card ${isMastered ? 'mastered' : ''}`;
    card.id = `q-${q.id}`;

    // Tag classes
    const catClass = `badge-cat-${q.category}`;
    const diffClass = `badge-diff-${q.difficulty.toLowerCase()}`;

    // Sample data table HTML if present
    let sampleDataHtml = '';
    if (q.sampleData) {
      const ths = q.sampleData.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('');
      const trs = q.sampleData.rows.map(row => {
        const tds = row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('');
        return `<tr>${tds}</tr>`;
      }).join('');

      sampleDataHtml = `
        <div class="data-table-wrapper">
          <table class="data-table">
            <thead><tr>${ths}</tr></thead>
            <tbody>${trs}</tbody>
          </table>
        </div>
      `;
    }

    // FDs HTML
    const fdsHtml = q.fds.map(fd => `<span class="fd-chip">${escapeHtml(fd)}</span>`).join('');

    // Tasks HTML
    const tasksHtml = q.tasks.map((task, idx) => `
      <li class="task-item">
        <span class="task-number">${idx + 1}</span>
        <span>${escapeHtml(task)}</span>
      </li>
    `).join('');

    // Solution Tables HTML
    let solutionTablesHtml = '';
    if (q.solution.closureTable) {
      const ct = q.solution.closureTable;
      const ths = ct.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('');
      const trs = ct.rows.map(r => {
        const tds = r.map(c => `<td>${escapeHtml(c)}</td>`).join('');
        return `<tr>${tds}</tr>`;
      }).join('');

      solutionTablesHtml += `
        <div class="solution-table-caption">Iterative Attribute Closure Derivation</div>
        <div class="solution-table-wrapper">
          <table class="solution-table">
            <thead><tr>${ths}</tr></thead>
            <tbody>${trs}</tbody>
          </table>
        </div>
      `;
    }

    if (q.solution.tables && q.solution.tables.length > 0) {
      q.solution.tables.forEach(tbl => {
        const ths = tbl.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('');
        const trs = tbl.rows.map(r => {
          const tds = r.map(c => {
            // Check for PK or FK in text
            let cellHtml = escapeHtml(c);
            cellHtml = cellHtml.replace(/\(PK\)/g, '<span class="pk-tag">PK</span>');
            cellHtml = cellHtml.replace(/\(FK\)/g, '<span class="fk-tag">FK</span>');
            return `<td>${cellHtml}</td>`;
          }).join('');
          return `<tr>${tds}</tr>`;
        }).join('');

        solutionTablesHtml += `
          <div class="solution-table-caption">${escapeHtml(tbl.caption || 'Relational Schema Table')}</div>
          <div class="solution-table-wrapper">
            <table class="solution-table">
              <thead><tr>${ths}</tr></thead>
              <tbody>${trs}</tbody>
            </table>
          </div>
        `;
      });
    }

    // Takeaway HTML
    const takeawayHtml = q.solution.keyTakeaway ? `
      <div class="takeaway-box">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
        <div><strong>Key Takeaway:</strong> ${escapeHtml(q.solution.keyTakeaway)}</div>
      </div>
    ` : '';

    const isSolutionOpen = state.revealAll;

    card.innerHTML = `
      <div class="card-top">
        <div class="card-tags">
          <span class="badge ${catClass}">${q.categoryLabel}</span>
          <span class="badge ${diffClass}">${q.difficulty}</span>
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--text-dim);">Problem #${q.id}</span>
        </div>

        <div class="card-actions-top">
          <button class="btn-copy" data-copy="${escapeHtml(q.relation + ' | ' + q.fds.join('; '))}" aria-label="Copy schema and dependencies to clipboard" title="Copy Schema & FDs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span class="copy-tooltip">Copy</span>
          </button>

          <button class="btn-master ${isMastered ? 'active' : ''}" data-id="${q.id}" aria-label="Mark problem ${q.id} as ${isMastered ? 'solved' : 'unsolved'}" title="${isMastered ? 'Mark as unsolved' : 'Mark as solved'}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${isMastered ? 'Mastered' : 'Mark Solved'}</span>
          </button>
        </div>
      </div>

      <h3 class="question-title">${escapeHtml(q.title)}</h3>

      <div class="spec-box">
        <div class="spec-row">
          <span class="spec-label">Given Relation Schema</span>
          <span class="spec-relation">${escapeHtml(q.relation)}</span>
        </div>
        ${sampleDataHtml}
        <div class="spec-row">
          <span class="spec-label">Functional Dependencies / Rules</span>
          <div class="spec-fds">${fdsHtml}</div>
        </div>
      </div>

      <div class="tasks-section">
        <div class="tasks-heading">Tasks to Solve</div>
        <ul class="tasks-list">${tasksHtml}</ul>
      </div>

      <div class="solution-container">
        <button class="solution-toggle-btn ${isSolutionOpen ? 'open' : ''}" data-target="sol-${q.id}" aria-expanded="${isSolutionOpen ? 'true' : 'false'}" aria-controls="sol-${q.id}">
          <span>${isSolutionOpen ? 'Hide Complete Solution' : 'Reveal Step-by-Step Solution'}</span>
          <svg class="toggle-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        </button>

        <div id="sol-${q.id}" class="solution-body ${isSolutionOpen ? 'open' : ''}" role="region" aria-label="Step-by-step solution for Problem ${q.id}">
          <div class="ck-badge-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <div><strong>Candidate Key(s):</strong> ${escapeHtml(q.solution.candidateKey)}</div>
          </div>

          ${renderSolutionSteps(q.solution)}

          ${solutionTablesHtml}
          ${takeawayHtml}
        </div>
      </div>
    `;

    return card;
  }

  // Helper: Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Parse explanation text into structured steps and sub-points
  function parseExplanationSteps(text) {
    if (!text) return [];

    // Check for 'Step X:' pattern
    const stepPattern = /Step\s+(\d+)\s*[:\.]\s*([\s\S]*?)(?=(?:Step\s+\d+\s*[:\.]|$))/gi;
    const steps = [];
    let match;

    while ((match = stepPattern.exec(text)) !== null) {
      const stepNum = match[1];
      let content = match[2].trim();
      let title = '';
      let body = content;

      // Check for title with dash/colon: e.g. "1NF Evaluation & Conversion — The Topics..."
      const dashMatch = content.match(/^([^—\–\n]+?)\s*[—\–]\s*([\s\S]+)$/);
      if (dashMatch) {
        title = dashMatch[1].trim();
        body = dashMatch[2].trim();
      } else {
        const colonMatch = content.match(/^([^:\n]{3,45}):\s*([\s\S]+)$/);
        if (colonMatch) {
          title = colonMatch[1].trim();
          body = colonMatch[2].trim();
        }
      }

      let rawPoints = [];
      if (body.includes('\n•') || body.includes('\n-') || body.includes('\n*')) {
        rawPoints = body.split(/\n[•\-\*]\s*/).map(p => p.trim()).filter(Boolean);
      } else {
        rawPoints = body.split(/(?<=[.!?])\s+(?=[A-Z0-9\(\"\'\[])/).map(p => p.trim()).filter(Boolean);
      }

      steps.push({
        num: stepNum,
        title: title || ('Step ' + stepNum),
        points: rawPoints.length ? rawPoints : [body]
      });
    }

    if (steps.length > 0) return steps;

    // Check for numbered items like (1), (2) or 1., 2.
    const pointPattern = /(?:(?:\((\d+)\)|\b(\d+)\.)\s*)([\s\S]*?)(?=(?:\(\d+\)|\b\d+\.\s+[A-Z]|$))/g;
    let pointMatch;
    while ((pointMatch = pointPattern.exec(text)) !== null) {
      const pNum = pointMatch[1] || pointMatch[2];
      const pBody = pointMatch[3].trim();
      const subPoints = pBody.split(/(?<=[.!?])\s+(?=[A-Z0-9\(\"\'\[])/).map(p => p.trim()).filter(Boolean);
      steps.push({
        num: pNum,
        title: 'Point ' + pNum,
        points: subPoints.length ? subPoints : [pBody]
      });
    }

    if (steps.length > 1) return steps;

    // Fallback: split by sentences into point-wise items
    const generalPoints = text.split(/(?<=[.!?])\s+(?=[A-Z0-9\(\"\'\[])/).map(p => p.trim()).filter(Boolean);
    return [{
      num: null,
      title: 'Key Solution Steps',
      points: generalPoints.length ? generalPoints : [text]
    }];
  }

  // Format point text with semantic tags
  function formatPointText(text) {
    let safe = escapeHtml(text);
    // Highlight PK / FK tags
    safe = safe.replace(/\(PK\)/g, '<span class="pk-tag">PK</span>');
    safe = safe.replace(/\(FK\)/g, '<span class="fk-tag">FK</span>');
    // Highlight Normal Forms
    safe = safe.replace(/\b(1NF|2NF|3NF)\b/g, '<strong class="nf-highlight">$1</strong>');
    return safe;
  }

  // Render structured point-wise step cards
  function renderSolutionSteps(sol) {
    if (!sol) return '';
    const steps = (sol.steps && Array.isArray(sol.steps) && sol.steps.length > 0)
      ? sol.steps
      : parseExplanationSteps(sol.explanation);

    if (!steps || steps.length === 0) return '';

    return `
      <div class="solution-steps-container">
        ${steps.map(step => `
          <div class="solution-step-item">
            <div class="step-badge-row">
              ${step.num ? `<span class="step-pill">Step ${escapeHtml(step.num)}</span>` : `<span class="step-pill step-pill-general">Key Analysis</span>`}
              <h4 class="step-title">${escapeHtml(step.title)}</h4>
            </div>
            <ul class="step-points-list">
              ${step.points.map(pt => `<li class="step-point">${formatPointText(pt)}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Setup Event Listeners
  function setupEventListeners() {
    // Search input with debounce
    let searchTimer = null;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimer);
      searchClear.style.display = e.target.value ? 'block' : 'none';
      searchTimer = setTimeout(() => {
        state.search = e.target.value;
        renderQuestions();
      }, 200);
    });

    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      state.search = '';
      searchClear.style.display = 'none';
      renderQuestions();
      searchInput.focus();
    });

    // Category Tabs
    categoryTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      categoryTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.category = btn.getAttribute('data-category');
      renderQuestions();
    });

    // Filters
    diffFilter.addEventListener('change', (e) => {
      state.difficulty = e.target.value;
      renderQuestions();
    });

    statusFilter.addEventListener('change', (e) => {
      state.status = e.target.value;
      renderQuestions();
    });

    // Global category filter helper for footer links
    window.filterCategory = function (cat) {
      state.category = cat;
      categoryTabs.querySelectorAll('.tab-btn').forEach(b => {
        if (b.getAttribute('data-category') === cat) b.classList.add('active');
        else b.classList.remove('active');
      });
      renderQuestions();
    };

    // Toggle All Solutions (Study vs Practice Mode)
    btnToggleMode.addEventListener('click', () => {
      state.revealAll = !state.revealAll;
      modeText.textContent = state.revealAll ? 'Hide All' : 'Reveal All';

      const solutionBodies = document.querySelectorAll('.solution-body');
      const toggleBtns = document.querySelectorAll('.solution-toggle-btn');

      solutionBodies.forEach(b => {
        if (state.revealAll) b.classList.add('open');
        else b.classList.remove('open');
      });

      toggleBtns.forEach(btn => {
        if (state.revealAll) {
          btn.classList.add('open');
          btn.querySelector('span').textContent = 'Hide Complete Solution';
        } else {
          btn.classList.remove('open');
          btn.querySelector('span').textContent = 'Reveal Step-by-Step Solution';
        }
      });
    });

    // Delegate Question Card Actions (Solution Toggle, Mastered, Copy)
    questionsList.addEventListener('click', (e) => {
      // Toggle Solution
      const toggleBtn = e.target.closest('.solution-toggle-btn');
      if (toggleBtn) {
        const targetId = toggleBtn.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const isOpen = targetEl.classList.toggle('open');
          toggleBtn.classList.toggle('open', isOpen);
          toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          toggleBtn.querySelector('span').textContent = isOpen ? 'Hide Complete Solution' : 'Reveal Step-by-Step Solution';
        }
        return;
      }

      // Mastered Button
      const masterBtn = e.target.closest('.btn-master');
      if (masterBtn) {
        const qId = parseInt(masterBtn.getAttribute('data-id'), 10);
        const card = document.getElementById(`q-${qId}`);
        if (state.mastered.has(qId)) {
          state.mastered.delete(qId);
          masterBtn.classList.remove('active');
          masterBtn.querySelector('span').textContent = 'Mark Solved';
          if (card) card.classList.remove('mastered');
        } else {
          state.mastered.add(qId);
          masterBtn.classList.add('active');
          masterBtn.querySelector('span').textContent = 'Mastered';
          if (card) card.classList.add('mastered');
        }
        saveMastered();
        updateProgress();
        if (state.status !== 'all') renderQuestions();
        return;
      }

      // Copy Button
      const copyBtn = e.target.closest('.btn-copy');
      if (copyBtn) {
        const textToCopy = copyBtn.getAttribute('data-copy');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(textToCopy).then(() => {
            const tooltip = copyBtn.querySelector('.copy-tooltip');
            if (tooltip) tooltip.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            setTimeout(() => {
              if (tooltip) tooltip.textContent = 'Copy';
              copyBtn.classList.remove('copied');
            }, 1800);
          });
        }
        return;
      }
    });

    // Theme Toggle
    if (btnThemeToggle) {
      btnThemeToggle.addEventListener('click', () => {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
        saveTheme();
      });
    }

    // Reset Progress
    if (btnResetProgress) {
      btnResetProgress.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset your solved problems progress?')) {
          state.mastered.clear();
          saveMastered();
          updateProgress();
          renderQuestions();
        }
      });
    }

    // Modal Events
    function openModal() {
      checklistModal.classList.add('open');
      modalClose.focus();
    }
    function closeModal() {
      checklistModal.classList.remove('open');
      btnChecklist.focus();
    }

    btnChecklist.addEventListener('click', openModal);
    if (footerChecklistLink) footerChecklistLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
    modalClose.addEventListener('click', closeModal);
    checklistModal.addEventListener('click', (e) => {
      if (e.target === checklistModal) closeModal();
    });

    // Global Keyboard Shortcuts (Pro Max Standard)
    document.addEventListener('keydown', (e) => {
      // Focus search on '/'
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
      // Escape to close modal or clear search
      if (e.key === 'Escape') {
        if (checklistModal.classList.contains('open')) {
          closeModal();
        } else if (searchInput && (searchInput.value || document.activeElement === searchInput)) {
          searchInput.value = '';
          state.search = '';
          searchClear.style.display = 'none';
          renderQuestions();
          searchInput.blur();
        }
      }
    });

    // Print
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
