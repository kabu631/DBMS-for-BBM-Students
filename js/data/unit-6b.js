/**
 * Unit 6 — Part 2 (final): topics 6.4 and 6.5, plus the unit intro,
 * exam corner, self-test quiz and glossary terms.
 */

appendTopics("unit-6", [

  /* ==================================================================== */
  {
    id: "u6-shadow-paging",
    title: "6.4 Shadow Paging",
    summary: "Recovery with no log at all: current and shadow page tables, how commit and rollback work, and the advantages and drawbacks compared with log-based recovery.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 23 (Sec. 23.4) | Silberschatz Ch. 16</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p><strong>Shadow paging</strong> takes a completely different route: it uses <strong>no log at all</strong>.</p>
        <p>Instead of overwriting a page, the DBMS <em>never modifies a page in place</em>. It writes the change to a brand-new page and updates a table of pointers. The old pages stay exactly where they were, untouched — so if anything goes wrong, you simply go back to using the old pointers.</p>
      </div>

      <div class="learn-box analogy-box">
        <div class="learn-title">📄 Everyday Analogy</div>
        <p>You are editing page 5 of a bound document. Rather than scribbling on page 5, you <strong>photocopy it, edit the copy</strong>, and change the contents page so that "page 5" now points at the new sheet.</p>
        <p>To cancel, you change the contents page back — the original page 5 was never touched. To confirm, you keep the new contents page and throw the old sheet away.</p>
      </div>

      <h3>The Two Page Tables</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:26%">Table</th><th>Kept Where</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td><strong>Shadow page table</strong></td><td>On <strong>disk</strong>, and never modified during the transaction</td><td>Points at the database as it was <em>before</em> the transaction started — the safe fallback.</td></tr>
            <tr><td><strong>Current page table</strong></td><td>In <strong>memory</strong>, modified as the transaction runs</td><td>Points at the database as the transaction is building it, including the new pages.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="svg-figure">
        <svg viewBox="0 0 800 330" role="img" aria-label="Shadow page table and current page table pointing at database pages">
          <text x="150" y="26" text-anchor="middle" font-size="14" font-weight="700" fill="#f59e0b">SHADOW page table</text>
          <text x="150" y="44" text-anchor="middle" font-size="11" class="svg-muted">(on disk, never changed)</text>
          <rect x="70" y="56" width="160" height="34" class="svg-panel" stroke-width="1.5"/><text x="150" y="78" text-anchor="middle" font-size="12">page 1 → block 12</text>
          <rect x="70" y="90" width="160" height="34" class="svg-panel" stroke-width="1.5"/><text x="150" y="112" text-anchor="middle" font-size="12">page 2 → block 27</text>
          <rect x="70" y="124" width="160" height="34" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="2"/><text x="150" y="146" text-anchor="middle" font-size="12">page 3 → block 45</text>
          <rect x="70" y="158" width="160" height="34" class="svg-panel" stroke-width="1.5"/><text x="150" y="180" text-anchor="middle" font-size="12">page 4 → block 61</text>

          <text x="650" y="26" text-anchor="middle" font-size="14" font-weight="700" fill="#10b981">CURRENT page table</text>
          <text x="650" y="44" text-anchor="middle" font-size="11" class="svg-muted">(in memory, being updated)</text>
          <rect x="570" y="56" width="160" height="34" class="svg-panel" stroke-width="1.5"/><text x="650" y="78" text-anchor="middle" font-size="12">page 1 → block 12</text>
          <rect x="570" y="90" width="160" height="34" class="svg-panel" stroke-width="1.5"/><text x="650" y="112" text-anchor="middle" font-size="12">page 2 → block 27</text>
          <rect x="570" y="124" width="160" height="34" fill="rgba(16,185,129,0.22)" stroke="#10b981" stroke-width="2"/><text x="650" y="146" text-anchor="middle" font-size="12">page 3 → <tspan font-weight="700">block 90</tspan></text>
          <rect x="570" y="158" width="160" height="34" class="svg-panel" stroke-width="1.5"/><text x="650" y="180" text-anchor="middle" font-size="12">page 4 → block 61</text>

          <rect x="300" y="228" width="120" height="40" rx="6" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="2"/>
          <text x="360" y="253" text-anchor="middle" font-size="12" font-weight="700">block 45</text>
          <text x="360" y="288" text-anchor="middle" font-size="11" class="svg-muted">OLD page 3</text>
          <text x="360" y="304" text-anchor="middle" font-size="11" class="svg-muted">(left untouched)</text>

          <rect x="460" y="228" width="120" height="40" rx="6" fill="rgba(16,185,129,0.22)" stroke="#10b981" stroke-width="2"/>
          <text x="520" y="253" text-anchor="middle" font-size="12" font-weight="700">block 90</text>
          <text x="520" y="288" text-anchor="middle" font-size="11" class="svg-muted">NEW page 3</text>
          <text x="520" y="304" text-anchor="middle" font-size="11" class="svg-muted">(the modified copy)</text>

          <line x1="150" y1="158" x2="330" y2="226" stroke="#f59e0b" stroke-width="2"/>
          <polygon points="334,229 324,224 326,234" fill="#f59e0b"/>
          <line x1="650" y1="158" x2="545" y2="226" stroke="#10b981" stroke-width="2"/>
          <polygon points="541,229 549,222 551,232" fill="#10b981"/>

          <text x="400" y="206" text-anchor="middle" font-size="12" font-weight="700" class="svg-muted">A write to page 3 creates a NEW block — the old one is never overwritten</text>
        </svg>
        <div class="figure-caption">Figure 6.3 — Shadow paging. Only the changed page is duplicated; the shadow table still points at the original, giving instant rollback.</div>
      </div>

      <h3>How It Works — The Four Steps</h3>
      <div class="worked-example">
        <div class="we-title">📐 Procedure</div>
        <ol class="step-list">
          <li><strong>When the transaction starts,</strong> copy the current page table to create the <strong>shadow page table</strong>, and save it on disk. Both tables now point at the same pages, so no data is duplicated yet.</li>
          <li><strong>On the first write to a page,</strong> do <em>not</em> modify it. Copy it to a <strong>free block</strong>, modify the copy, and update only the <strong>current</strong> page table to point at the new block. The shadow table still points at the original.</li>
          <li><strong>To COMMIT:</strong> flush all modified pages to disk, write the current page table to disk, and then atomically switch the database's single pointer so that <strong>the current page table becomes the new shadow page table</strong>. The old pages become free space.</li>
          <li><strong>To ROLLBACK (or after a crash):</strong> simply <strong>discard the current page table</strong>. The shadow table on disk already describes the pre-transaction database perfectly. Recovery is essentially instantaneous.</li>
        </ol>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 The Key Insight</div>
        <div class="formula-strip">Commit = switch one pointer · Rollback = discard one table</div>
        <p>Because commit is a single atomic pointer change, the database is never caught in a half-updated state. That is how shadow paging achieves atomicity <strong>without any log</strong>.</p>
      </div>

      <hr class="section-divider" />

      <h3>Advantages and Disadvantages</h3>
      <div class="compare-grid">
        <div class="compare-card compare-good">
          <h4>✔ Advantages</h4>
          <ul>
            <li><strong>No log is needed</strong>, so no log-maintenance overhead.</li>
            <li><strong>No UNDO and no REDO</strong> — recovery is simply "use the shadow table".</li>
            <li>Recovery after a crash is <strong>almost instantaneous</strong>.</li>
            <li>Commit is a single atomic pointer update.</li>
          </ul>
        </div>
        <div class="compare-card compare-bad">
          <h4>✘ Disadvantages</h4>
          <ul>
            <li><strong>Data fragmentation</strong> — updated pages scatter across the disk, destroying the locality that makes sequential reads fast.</li>
            <li><strong>Garbage collection</strong> is needed to reclaim the old pages after every commit.</li>
            <li><strong>Hard to use with concurrent transactions</strong> — the page table is a single shared structure, so it is awkward for many transactions to update at once.</li>
            <li>Copying and writing page tables adds overhead for a large database.</li>
          </ul>
        </div>
      </div>

      <div class="learn-box world-box">
        <div class="learn-title">🌍 Is It Used Today?</div>
        <p>Not as the main recovery technique in general-purpose DBMSs — the concurrency limitation is decisive, and log-based UNDO/REDO won. But the underlying idea, <strong>copy-on-write</strong>, is everywhere: in file systems such as ZFS and Btrfs, in virtual machine snapshots, and in how Git stores versions. Shadow paging is worth understanding well beyond the exam.</p>
      </div>

      <h3>Shadow Paging vs Log-Based Recovery</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:24%">Basis</th><th>Shadow Paging</th><th>Log-Based Recovery</th></tr></thead>
          <tbody>
            <tr><td><strong>Log required</strong></td><td>No</td><td>Yes</td></tr>
            <tr><td><strong>UNDO / REDO</strong></td><td>Neither</td><td>One or both, depending on technique</td></tr>
            <tr><td><strong>Update style</strong></td><td>Copy-on-write (never in place)</td><td>In place, protected by WAL</td></tr>
            <tr><td><strong>Rollback cost</strong></td><td>Trivial — discard the current page table</td><td>Must reverse each change from the log</td></tr>
            <tr><td><strong>Fragmentation</strong></td><td><strong>Severe</strong></td><td>None</td></tr>
            <tr><td><strong>Concurrency support</strong></td><td><strong>Poor</strong></td><td>Good</td></tr>
            <tr><td><strong>Used in practice</strong></td><td>Rarely, for databases</td><td><strong>Yes — the industry standard</strong></td></tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"Explain the shadow paging recovery technique with a diagram."</em> — the two page tables, the four steps, and the diagram (6–8 marks).</li>
          <li><em>"What are the advantages and disadvantages of shadow paging?"</em> — the comparison cards; fragmentation and poor concurrency are the answers examiners look for (4–5 marks).</li>
          <li><em>"Differentiate between shadow paging and log-based recovery."</em> — the seven-row table (5 marks).</li>
        </ul>
      </div>
    </div>
    `
  },

  /* ==================================================================== */
  {
    id: "u6-backup-catastrophic",
    title: "6.5 Database Backup & Recovery from Catastrophic Failures",
    summary: "Why the log is not enough when the disk itself dies: full, incremental and differential backups, the 3-2-1 rule, recovery from a catastrophe, and a brief look at ARIES.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 23 (Sec. 23.5, 23.6) | Silberschatz Ch. 16</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>Everything so far assumed the <strong>disk survived</strong> the failure — so the log was still there to repair the database with.</p>
        <p>A <strong>catastrophic failure</strong> is different: the disk itself is destroyed by a head crash, fire, flood or theft. The database <em>and</em> the log are both gone. No clever algorithm can help. The only defence is a <strong>backup stored somewhere else</strong>.</p>
      </div>

      <div class="learn-box analogy-box">
        <div class="learn-title">🏠 Everyday Analogy</div>
        <p>Keeping a spare key is useless if you keep it inside the locked house. A backup on the same disk as the database is exactly that — it protects you from nothing that matters.</p>
        <p>This is why backups are kept on separate media, in a separate building, and in modern practice a separate region.</p>
      </div>

      <h3>Types of Backup</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:22%">Type</th><th>What Is Copied</th><th style="width:22%">Backup Speed</th><th style="width:22%">Restore Speed</th></tr></thead>
          <tbody>
            <tr><td><strong>Full backup</strong></td><td>The entire database.</td><td>Slowest</td><td><strong>Fastest</strong> — one file to restore.</td></tr>
            <tr><td><strong>Incremental backup</strong></td><td>Only what changed since the <em>last backup of any kind</em>.</td><td><strong>Fastest</strong></td><td>Slowest — restore the full backup plus <em>every</em> increment in order.</td></tr>
            <tr><td><strong>Differential backup</strong></td><td>Everything that changed since the last <em>full</em> backup.</td><td>Medium</td><td>Medium — restore the full backup plus the <em>latest</em> differential only.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 Incremental vs Differential</div>
        <div class="formula-strip">Incremental = since the LAST backup · Differential = since the last FULL backup</div>
        <p>So differentials grow steadily larger each day but need only two files to restore; incrementals stay small but need the whole chain. If one incremental in the chain is corrupt, everything after it is unrecoverable — which is why many organisations prefer differentials despite the extra storage.</p>
      </div>

      <h3>Backing Up the Log Too</h3>
      <p>The database backup alone only gets you to the moment the backup was taken. To recover everything up to the instant of the disaster you also need the <strong>log backups</strong> taken since then.</p>

      <div class="worked-example">
        <div class="we-title">📐 Recovery From a Catastrophic Failure</div>
        <ol class="step-list">
          <li><strong>Replace or repair the failed hardware</strong> — a new disk, or a standby server.</li>
          <li><strong>Restore the most recent full backup</strong> onto it. The database is now correct as of the time that backup was taken.</li>
          <li><strong>Apply the differential backup</strong> (or all the incremental backups in order) taken since the full backup.</li>
          <li><strong>Apply the archived log</strong>, redoing every committed transaction recorded since the last backup. This rolls the database forward, transaction by transaction.</li>
          <li><strong>Undo any transactions</strong> that were still active at the moment of failure, then bring the database back online.</li>
        </ol>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ Some Data Loss Is Usually Unavoidable</div>
        <p>Anything committed after the last log backup is simply gone. The gap between backups is called the <strong>Recovery Point Objective (RPO)</strong> — "how much data can we afford to lose?" — and the time to get running again is the <strong>Recovery Time Objective (RTO)</strong>.</p>
        <p>An RPO of zero requires continuous replication to a second site, not periodic backups.</p>
      </div>

      <h3>The 3-2-1 Backup Rule</h3>
      <div class="svg-figure">
        <svg viewBox="0 0 760 180" role="img" aria-label="The 3-2-1 backup rule illustrated">
          <circle cx="130" cy="80" r="52" fill="rgba(99,102,241,0.18)" stroke="#6366f1" stroke-width="2.5"/>
          <text x="130" y="74" text-anchor="middle" font-size="34" font-weight="800" fill="#6366f1">3</text>
          <text x="130" y="98" text-anchor="middle" font-size="12" font-weight="700">copies</text>
          <text x="130" y="152" text-anchor="middle" font-size="12" class="svg-muted">of your data in total</text>
          <text x="130" y="168" text-anchor="middle" font-size="12" class="svg-muted">(the original + 2 backups)</text>

          <circle cx="380" cy="80" r="52" fill="rgba(16,185,129,0.18)" stroke="#10b981" stroke-width="2.5"/>
          <text x="380" y="74" text-anchor="middle" font-size="34" font-weight="800" fill="#10b981">2</text>
          <text x="380" y="98" text-anchor="middle" font-size="12" font-weight="700">media types</text>
          <text x="380" y="152" text-anchor="middle" font-size="12" class="svg-muted">e.g. local disk + cloud,</text>
          <text x="380" y="168" text-anchor="middle" font-size="12" class="svg-muted">so one failure mode can't kill both</text>

          <circle cx="630" cy="80" r="52" fill="rgba(245,158,11,0.18)" stroke="#f59e0b" stroke-width="2.5"/>
          <text x="630" y="74" text-anchor="middle" font-size="34" font-weight="800" fill="#f59e0b">1</text>
          <text x="630" y="98" text-anchor="middle" font-size="12" font-weight="700">off-site</text>
          <text x="630" y="152" text-anchor="middle" font-size="12" class="svg-muted">in a different building or region,</text>
          <text x="630" y="168" text-anchor="middle" font-size="12" class="svg-muted">to survive fire, flood or theft</text>
        </svg>
        <div class="figure-caption">Figure 6.4 — The 3-2-1 rule, the standard professional guideline for backup strategy.</div>
      </div>

      <div class="learn-box world-box">
        <div class="learn-title">🌍 The Rule Everyone Learns the Hard Way</div>
        <p><strong>A backup that has never been restored is not a backup — it is a hope.</strong> Organisations regularly discover during a real disaster that their backups were silently failing for months, or that nobody knows the restore procedure.</p>
        <p>Professional practice is to schedule <em>restore drills</em>: periodically restore to a test server and verify the data. Saying this in an exam answer shows genuine understanding.</p>
      </div>

      <hr class="section-divider" />

      <h3>A Brief Look at ARIES</h3>
      <div class="learn-box simple-box">
        <div class="learn-title">💡 The Algorithm Real Systems Use</div>
        <p><strong>ARIES</strong> (Algorithms for Recovery and Isolation Exploiting Semantics), developed at IBM, is the recovery algorithm behind most commercial databases. It refines the UNDO/REDO technique of topic 6.3 and works in <strong>three passes</strong>:</p>
      </div>
      <div class="grid-3col">
        <div class="feature-card">
          <h4>1. Analysis Pass</h4>
          <p>Scan forward from the last checkpoint to work out which transactions were active at the crash and which pages were dirty.</p>
        </div>
        <div class="feature-card">
          <h4>2. Redo Pass</h4>
          <p>Repeat history: re-apply <em>every</em> logged change, even those of uncommitted transactions, to restore the exact state at the moment of the crash.</p>
        </div>
        <div class="feature-card">
          <h4>3. Undo Pass</h4>
          <p>Roll back the transactions that never committed, writing <strong>compensation log records</strong> so that a crash <em>during</em> recovery is itself recoverable.</p>
        </div>
      </div>
      <p>Its three principles are worth quoting in an answer: <strong>write-ahead logging</strong>, <strong>repeating history during redo</strong>, and <strong>logging changes made during undo</strong>.</p>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"How is recovery performed from a catastrophic failure?"</em> — why the log alone is insufficient, then the five restore steps (5–6 marks).</li>
          <li><em>"Differentiate between full, incremental and differential backups."</em> — the three-row table plus the memory rule (4 marks).</li>
          <li><em>"What is the difference between a system crash and a disk failure in terms of recovery?"</em> — a system crash loses only volatile memory, so the log on disk repairs it; a disk failure destroys the stored data, so only a backup helps (4 marks).</li>
          <li><em>"Write short notes on ARIES."</em> — the three passes and the three principles (4 marks).</li>
        </ul>
      </div>
    </div>
    `
  }
]);

/* ====================================================================== */
/* Unit 6 extras                                                          */
/* ====================================================================== */

registerUnitExtras("unit-6", {
  simpleIntro: {
    heading: "What This Unit Is Really About",
    text: "<p>Unit 5 promised you <strong>atomicity</strong> and <strong>durability</strong>. This short unit explains how the database actually keeps those promises when the power goes out.</p><p>The whole problem comes from one fact: for speed, a DBMS works in memory and writes to disk only occasionally. So at the instant of a crash, the disk holds a messy half-state — some committed work missing, some uncommitted work already written. Recovery is the process of cleaning that up, and the <strong>log</strong> is the only evidence available.</p><p>You will learn three techniques: <strong>deferred update</strong> (never touch the database before commit, so you only ever need REDO), <strong>immediate update</strong> (write as you go, so you need both UNDO and REDO — this is what real systems use), and <strong>shadow paging</strong> (never overwrite anything, so you need no log at all). Then, because none of them help when the disk itself dies, backups.</p><p>At 4 lecture hours this is the smallest unit, and its questions are very predictable — mostly \"explain this technique\" and \"recover the database from this log\".</p>",
    goals: [
      "Explain why recovery is necessary and distinguish volatile, non-volatile and stable storage.",
      "State the write-ahead logging rule and explain what goes wrong without it.",
      "Explain the steal/no-steal and force/no-force policies and which combination needs UNDO and REDO.",
      "Describe checkpointing and decide from a log which transactions need UNDO and which need REDO.",
      "Apply the deferred update (NO-UNDO/REDO) technique to recover from a given log.",
      "Apply the immediate update (UNDO/REDO) technique, in the correct pass order.",
      "Explain shadow paging with its two page tables, and its advantages and drawbacks.",
      "Describe backup types and the procedure for recovering from a catastrophic failure."
    ]
  },

  examCorner: {
    mustKnow: [
      "Volatile, non-volatile and stable storage",
      "Buffer cache, dirty bit, pin/unpin bit",
      "Write-ahead logging (WAL) and its two sub-rules",
      "STEAL / NO-STEAL and FORCE / NO-FORCE",
      "Which policy combination needs UNDO, REDO, or both",
      "UNDO goes backward (old values); REDO goes forward (new values)",
      "Idempotence of UNDO and REDO",
      "Checkpoints and the five steps",
      "Which transactions to UNDO and REDO relative to a checkpoint",
      "Deferred update = NO-UNDO/REDO",
      "Immediate update = UNDO/REDO, and the pass order",
      "Shadow paging: current and shadow page tables",
      "Full, incremental and differential backups",
      "Catastrophic failure recovery procedure",
      "ARIES: the three passes"
    ],
    questions: [
      {
        q: "What is write-ahead logging? Why is it essential for recovery?",
        marks: "6",
        a: "<p><strong>Write-Ahead Logging (WAL)</strong> is the rule that the log record describing a change must be written to stable storage <strong>before</strong> the corresponding modified data page is written to disk.</p><p>It has two parts:</p><ul><li><strong>UNDO rule</strong> — the <em>before-image</em> (old value) of an item must be in the log on disk before the item itself is overwritten on disk.</li><li><strong>REDO rule</strong> — all <em>after-images</em> (new values) together with the <code>[commit, T]</code> record must be forced to the log before T is considered committed.</li></ul><p><strong>Why it is essential:</strong> suppose the data page were written first and the system crashed before the log record reached disk. The database would then contain a change with <strong>no record of the previous value</strong>, so the transaction could never be rolled back — the database would be permanently and undetectably corrupt.</p><p>By writing the log first, the log is always at least as current as the data. Recovery may encounter log records for changes that never reached disk, which is harmless because they can simply be redone; the dangerous reverse situation cannot occur.</p>"
      },
      {
        q: "What is a checkpoint? Explain the steps involved and its role in recovery.",
        marks: "6",
        a: "<p>A <strong>checkpoint</strong> is a point at which the DBMS guarantees that all modified buffers have been written to disk, so that everything before it is known to be safe. It limits how far back recovery must scan.</p><p><strong>Steps:</strong></p><ol><li>Temporarily suspend execution of transactions.</li><li>Force-write all modified buffers from main memory to disk.</li><li>Write a <code>[checkpoint]</code> record to the log, including the list of currently active transactions.</li><li>Force-write the log to disk.</li><li>Resume transaction execution.</li></ol><p><strong>Role in recovery:</strong> after a crash the system need only scan the log from the last checkpoint rather than from the beginning. Classification is then simple:</p><ul><li>Transactions <strong>committed before the checkpoint</strong> — their changes are already on disk, so nothing is done.</li><li>Transactions <strong>committed between the checkpoint and the crash</strong> — <strong>REDO</strong> them.</li><li>Transactions <strong>still active at the crash</strong> — <strong>UNDO</strong> them.</li></ul>"
      },
      {
        q: "Explain the deferred update recovery technique. Why does it not require UNDO?",
        marks: "6",
        a: "<p>In <strong>deferred update</strong> (also called the <strong>NO-UNDO/REDO</strong> technique), a transaction's updates are <strong>not applied to the database on disk until the transaction reaches its commit point</strong>. All changes are recorded in the log and held in memory buffers; only after <code>[commit, T]</code> is safely written are they applied to the database.</p><p><strong>Recovery procedure after a crash:</strong></p><ol><li>Scan the log from the last checkpoint and build two lists: transactions with both a start and a commit record (<em>committed</em>), and those with a start but no commit (<em>active</em>).</li><li><strong>REDO</strong> all the write operations of the committed transactions, scanning <strong>forwards</strong> through the log and applying each new value.</li><li>For the active transactions, do <strong>nothing</strong> — simply restart them.</li></ol><p><strong>Why no UNDO is needed:</strong> because no uncommitted transaction's changes ever reach the database on disk, there is nothing on disk that needs reversing. Discarding the log records is sufficient.</p><p>In buffer-policy terms this corresponds to <strong>NO-STEAL / NO-FORCE</strong>. Its drawback is that a long transaction must hold all its updates in buffers, which can exhaust memory — which is why immediate update is preferred in practice.</p>"
      },
      {
        q: "Given the log below, show how the database is recovered using the immediate update technique.<br>[checkpoint], [start T1], [write T1,A,500,600], [start T2], [write T2,B,800,900], [commit T1], [start T3], [write T3,C,200,250], [write T2,D,300,350], [commit T3], CRASH.",
        marks: "8",
        a: "<p><strong>Step 1 — classify the transactions</strong> by scanning the log from the checkpoint:</p><ul><li><strong>T1</strong> — has <code>[commit T1]</code> → committed → <strong>REDO list</strong>.</li><li><strong>T2</strong> — started but has no commit record → active at the crash → <strong>UNDO list</strong>.</li><li><strong>T3</strong> — has <code>[commit T3]</code> → committed → <strong>REDO list</strong>.</li></ul><p><strong>Step 2 — UNDO pass (scan BACKWARDS from the end of the log), restoring old values for T2:</strong></p><ul><li><code>[write T2, D, 300, 350]</code> → restore <strong>D = 300</strong></li><li><code>[write T2, B, 800, 900]</code> → restore <strong>B = 800</strong></li></ul><p><strong>Step 3 — REDO pass (scan FORWARDS from the checkpoint), applying new values for T1 and T3:</strong></p><ul><li><code>[write T1, A, 500, 600]</code> → write <strong>A = 600</strong></li><li><code>[write T3, C, 200, 250]</code> → write <strong>C = 250</strong></li></ul><p><strong>Step 4 —</strong> write <code>[abort, T2]</code> to the log and restart T2.</p><p><strong>Final values: A = 600, B = 800, C = 250, D = 300.</strong></p><p>Note the order: <strong>UNDO first (backwards), then REDO (forwards)</strong>, so that if an item was written by both a committed and an uncommitted transaction, the committed value is the one that survives.</p>"
      },
      {
        q: "Explain shadow paging with a diagram. State its advantages and disadvantages.",
        marks: "8",
        a: "<p><strong>Shadow paging</strong> is a recovery technique that uses <strong>no log</strong>. It maintains two page tables:</p><ul><li><strong>Shadow page table</strong> — stored on disk and never modified during the transaction; it points at the database as it was before the transaction began.</li><li><strong>Current page table</strong> — held in memory and updated as the transaction proceeds.</li></ul><p><strong>Working:</strong></p><ol><li>At transaction start, the current page table is copied to create the shadow page table on disk. Both initially point at the same pages.</li><li>When a page is first modified, it is <strong>not</strong> overwritten. It is copied to a free block, the copy is modified, and only the <strong>current</strong> page table is updated to point at the new block.</li><li><strong>On commit:</strong> all modified pages are flushed, the current page table is written to disk, and the database pointer is atomically switched so the current page table becomes the new shadow. The old pages become free.</li><li><strong>On failure or rollback:</strong> the current page table is simply discarded; the shadow page table on disk already describes the correct pre-transaction state.</li></ol><p><strong>Advantages:</strong> no log required; no UNDO and no REDO; near-instantaneous recovery; commit is a single atomic pointer update.</p><p><strong>Disadvantages:</strong> severe <strong>data fragmentation</strong> as updated pages scatter across the disk; <strong>garbage collection</strong> is needed to reclaim old pages; and it is <strong>difficult to use with concurrent transactions</strong>, since the page table is a single shared structure. For these reasons log-based recovery is preferred in practice.</p>"
      },
      {
        q: "How is a database recovered from a catastrophic failure? How does this differ from recovery after a system crash?",
        marks: "6",
        a: "<p><strong>The difference:</strong> in a <strong>system crash</strong> only <em>volatile</em> storage (memory and buffers) is lost; the disk, and therefore the log, survive — so the log alone is enough to repair the database using UNDO and REDO. In a <strong>catastrophic failure</strong> (head crash, fire, flood, theft) the <em>disk itself</em> is destroyed, taking both the database and the log with it. No recovery algorithm can help; only an off-site backup can.</p><p><strong>Recovery procedure from a catastrophe:</strong></p><ol><li>Replace or repair the failed hardware, or switch to a standby server.</li><li>Restore the most recent <strong>full backup</strong>.</li><li>Apply the latest <strong>differential backup</strong>, or all <strong>incremental backups</strong> in order.</li><li>Apply the <strong>archived log</strong>, redoing every committed transaction recorded since the backup, to roll the database forward.</li><li>Undo any transactions that were still active at the moment of failure and bring the database online.</li></ol><p>Any work committed after the last log backup is lost; that gap is the <strong>Recovery Point Objective</strong>. Backups must follow the <strong>3-2-1 rule</strong>: three copies, on two different media, with one kept off-site — a backup stored on the same disk as the database protects against nothing.</p>"
      }
    ]
  },

  quiz: [
    {
      q: "Write-ahead logging requires that:",
      opts: [
        "The log record is written to disk before the corresponding data page",
        "The data page is written before the log record",
        "Both are written at exactly the same time",
        "The log is written only at commit time"
      ],
      correct: 0,
      explain: "If the data reached disk first and the system crashed, there would be no record of the old value — the change could never be undone and the database would be permanently corrupt."
    },
    {
      q: "A log record stores both old and new values because:",
      opts: [
        "The old value supports UNDO and the new value supports REDO",
        "It makes the log smaller",
        "It helps detect deadlocks",
        "It is required for indexing"
      ],
      correct: 0,
      explain: "Recovery must reverse uncommitted transactions and re-apply committed ones, so one record must serve both directions."
    },
    {
      q: "A STEAL policy means that:",
      opts: [
        "Dirty pages of an uncommitted transaction may be written to disk",
        "Pages are always written at commit time",
        "A transaction can take another's locks",
        "The log is discarded after commit"
      ],
      correct: 0,
      explain: "Because uncommitted changes can therefore reach disk, a STEAL policy makes UNDO necessary. Most real systems use STEAL/NO-FORCE and so need both UNDO and REDO."
    },
    {
      q: "The deferred update technique is also called:",
      opts: ["NO-UNDO/REDO", "UNDO/REDO", "UNDO/NO-REDO", "NO-UNDO/NO-REDO"],
      correct: 0,
      explain: "Nothing uncommitted ever reaches the database, so no UNDO is needed; committed changes may not have been flushed yet, so REDO is."
    },
    {
      q: "In immediate update recovery, the correct order of the two passes is:",
      opts: ["UNDO first (backwards), then REDO (forwards)", "REDO first, then UNDO", "Only REDO", "Only UNDO"],
      correct: 0,
      explain: "Doing REDO last guarantees that where an item was written by both a committed and an uncommitted transaction, the committed value survives."
    },
    {
      q: "A transaction that was still active when the system crashed must be:",
      opts: ["Undone", "Redone", "Committed", "Ignored"],
      correct: 0,
      explain: "It never committed, so its partial changes must be rolled back. Only transactions with a commit record in the log are redone."
    },
    {
      q: "Transactions that committed BEFORE the last checkpoint require:",
      opts: ["No action at all", "UNDO", "REDO", "Both UNDO and REDO"],
      correct: 0,
      explain: "A checkpoint forces all buffers to disk, so everything committed before it is already safely stored."
    },
    {
      q: "In shadow paging, the shadow page table:",
      opts: [
        "Is stored on disk and never modified during the transaction",
        "Is modified continuously as the transaction runs",
        "Is kept only in memory",
        "Replaces the log during recovery"
      ],
      correct: 0,
      explain: "It preserves the pre-transaction state, which is what makes rollback as simple as discarding the current page table."
    },
    {
      q: "The main disadvantage of shadow paging is:",
      opts: [
        "Data fragmentation and poor support for concurrency",
        "It needs a very large log",
        "Recovery is extremely slow",
        "It cannot guarantee atomicity"
      ],
      correct: 0,
      explain: "Copy-on-write scatters updated pages across the disk, and the single shared page table makes concurrent transactions awkward — which is why log-based recovery won."
    },
    {
      q: "A backup containing everything changed since the last FULL backup is called:",
      opts: ["Differential", "Incremental", "Full", "Archival"],
      correct: 0,
      explain: "Incremental copies changes since the last backup of ANY kind, so restoring needs the whole chain; a differential needs only the full backup plus the latest differential."
    },
    {
      q: "Recovery from a disk failure differs from recovery after a system crash because:",
      opts: [
        "The stored database and log are destroyed, so a backup is required",
        "Only main memory is lost",
        "No recovery is needed",
        "Only UNDO is required"
      ],
      correct: 0,
      explain: "A system crash loses only volatile memory, so the log on disk repairs everything. A disk failure destroys the log itself, leaving an off-site backup as the only option."
    },
    {
      q: "UNDO and REDO operations must be idempotent, meaning:",
      opts: [
        "Performing them twice gives the same result as performing them once",
        "They can never be interrupted",
        "They must run in parallel",
        "They require no log"
      ],
      correct: 0,
      explain: "The system can crash during recovery itself, so recovery must be safe to restart from the beginning without corrupting anything."
    }
  ]
});

registerGlossary("Unit 6", [
  ["Recovery", "Restoring the database to the most recent consistent state after a failure."],
  ["Volatile Storage", "Main memory and buffers; contents are lost in a crash."],
  ["Stable Storage", "An idealised store that survives all failures, approximated by mirroring; holds the log."],
  ["Buffer Cache", "Memory holding recently used disk pages, controlled by dirty and pin bits."],
  ["Dirty Bit", "A flag showing that a buffer has been modified and not yet written back to disk."],
  ["Write-Ahead Logging (WAL)", "The rule that a log record must reach disk before the data page it describes."],
  ["STEAL Policy", "Allowing uncommitted dirty pages to be written to disk; makes UNDO necessary."],
  ["NO-FORCE Policy", "Not requiring all pages to be flushed at commit; makes REDO necessary."],
  ["UNDO", "Restoring old values from the log, scanning backwards, for uncommitted transactions."],
  ["REDO", "Re-applying new values from the log, scanning forwards, for committed transactions."],
  ["Idempotent", "An operation that gives the same result whether performed once or many times."],
  ["Checkpoint", "A point at which all buffers are flushed and recorded, limiting how far recovery must scan."],
  ["Deferred Update", "The NO-UNDO/REDO technique: the database is changed only after commit."],
  ["Immediate Update", "The UNDO/REDO technique: changes are applied as they happen, protected by WAL."],
  ["Shadow Paging", "Log-free recovery using a current and a shadow page table with copy-on-write."],
  ["Current Page Table", "The in-memory page table updated as a transaction runs."],
  ["Shadow Page Table", "The on-disk page table preserving the pre-transaction state."],
  ["Catastrophic Failure", "A failure destroying the disk itself, so only an off-site backup can recover it."],
  ["Full Backup", "A complete copy of the entire database."],
  ["Incremental Backup", "A copy of everything changed since the last backup of any kind."],
  ["Differential Backup", "A copy of everything changed since the last full backup."],
  ["3-2-1 Rule", "Keep three copies, on two media types, with one stored off-site."],
  ["RPO / RTO", "Recovery Point Objective (how much data may be lost) and Recovery Time Objective (how fast to restore)."],
  ["ARIES", "The industry-standard recovery algorithm: analysis, redo and undo passes with compensation log records."]
]);
