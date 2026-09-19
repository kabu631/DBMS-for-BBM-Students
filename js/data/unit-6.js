/**
 * Unit 6 — Database Recovery Techniques (4 Lecture Hours).
 * Part 1 of 2: topics 6.1 – 6.3.
 */

registerUnit({
  id: "unit-6",
  number: "Unit 6",
  title: "Database Recovery Techniques",
  subtitle: "Putting the database back together after a crash — the log, write-ahead logging, checkpoints, deferred and immediate update, shadow paging and backups",
  readingTime: "4 Lecture Hours (LHs)",
  description: "Recovery Concepts; NO-UNDO/REDO Recovery Based on Deferred Update; Recovery Technique Based on Immediate Update; Shadow Paging; Database Backup and Recovery from Catastrophic Failures.",
  topics: [

    /* ================================================================== */
    {
      id: "u6-recovery-concepts",
      title: "6.1 Recovery Concepts — Caching, Write-Ahead Logging & Checkpoints",
      summary: "Why recovery is needed, the buffer cache and its dirty/pin bits, the WAL rule, steal/no-steal and force/no-force policies, UNDO and REDO, and checkpointing.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 23 (Sec. 23.1) | Silberschatz Ch. 16</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p><strong>Recovery</strong> means restoring the database to the last <em>correct</em> state after something goes wrong — a power cut, a crash, a failed transaction.</p>
          <p>The whole problem exists because of one design decision: for speed, the DBMS keeps data in <strong>memory buffers</strong> and writes them back to disk only occasionally. So at the instant of a crash, the disk is in an unpredictable middle state:</p>
          <ul>
            <li>Some <strong>committed</strong> transactions may not have reached the disk yet → they must be <strong>REDONE</strong>.</li>
            <li>Some <strong>uncommitted</strong> transactions may already have reached the disk → they must be <strong>UNDONE</strong>.</li>
          </ul>
          <p>Every technique in this unit is a different strategy for sorting that out.</p>
        </div>

        <div class="learn-box analogy-box">
          <div class="learn-title">📝 Everyday Analogy</div>
          <p>You are writing an important letter. You draft it on a rough sheet (memory), and every so often copy the finished paragraphs into the clean final copy (disk).</p>
          <p>If the lights suddenly go out, the clean copy might be missing paragraphs you had finished, and might contain paragraphs you had decided to cancel. To fix it you need a <strong>list of exactly what you did and in what order</strong> — that list is the <strong>log</strong>.</p>
        </div>

        <h3>The Two Storage Worlds</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:24%">Storage</th><th>Where</th><th style="width:28%">Survives a Crash?</th></tr></thead>
            <tbody>
              <tr><td><strong>Volatile storage</strong></td><td>Main memory, cache, buffers</td><td><strong>No</strong> — contents are lost instantly.</td></tr>
              <tr><td><strong>Non-volatile storage</strong></td><td>Hard disk, SSD</td><td>Yes, unless the disk itself fails.</td></tr>
              <tr><td><strong>Stable storage</strong></td><td>An idealised store, approximated by mirroring across several disks or sites</td><td>Yes — survives even disk failure. The log is kept here.</td></tr>
            </tbody>
          </table>
        </div>

        <hr class="section-divider" />

        <h3>Caching (Buffering) of Disk Blocks</h3>
        <p>The DBMS keeps a pool of memory buffers holding recently-used disk pages. Each buffer carries two control bits:</p>
        <div class="grid-2col">
          <div class="feature-card">
            <h4>Dirty Bit</h4>
            <p><code>0</code> = this buffer matches the disk copy.<br><code>1</code> = it has been modified in memory and <strong>not yet written back</strong>.</p>
            <p>Only dirty buffers need flushing — this is what makes buffering fast.</p>
          </div>
          <div class="feature-card">
            <h4>Pin / Unpin Bit</h4>
            <p><strong>Pinned</strong> = this buffer must <em>not</em> be written to disk yet (a transaction is still working on it).<br><strong>Unpinned</strong> = it may be flushed whenever convenient.</p>
          </div>
        </div>
        <p>When a buffer is written back, the DBMS can do it <strong>in-place</strong> (overwriting the original block — so the old value is lost unless the log has it) or <strong>shadowing</strong> (writing to a new location and keeping the old one, which is the basis of shadow paging in topic 6.4).</p>

        <hr class="section-divider" />

        <h3>The Write-Ahead Logging (WAL) Protocol</h3>
        <div class="definition-box">
          <div class="definition-title">📌 The Golden Rule of Recovery</div>
          <p><strong>Before a modified data page may be written to disk, the log record describing that change must already be on disk.</strong></p>
          <p>Stated as two sub-rules:</p>
          <ol>
            <li><strong>UNDO rule:</strong> the <em>before-image</em> (old value) must be in the log on disk before the data page is overwritten — otherwise the change could never be undone.</li>
            <li><strong>REDO rule:</strong> all <em>after-images</em> (new values) and the <code>[commit, T]</code> record must be on disk before T is declared committed — otherwise the change could never be redone.</li>
          </ol>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 Why WAL Is Non-Negotiable</div>
          <p>Imagine the opposite order: the DBMS writes the new data to disk, and crashes <em>before</em> the log record is written. On restart, the disk holds a change with <strong>no record of what the old value was</strong> — so the transaction can never be undone. The database is permanently corrupt.</p>
          <p>Writing the log first means the log is always at least as up to date as the data. Recovery may find log records for changes that never reached the disk — which is harmless, since it can simply redo them — but never the reverse.</p>
        </div>

        <h3>Buffer Management Policies</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:20%">Policy</th><th>Meaning</th><th style="width:30%">Consequence for Recovery</th></tr></thead>
            <tbody>
              <tr><td><strong>STEAL</strong></td><td>An uncommitted transaction's dirty pages <em>may</em> be written to disk to free buffer space.</td><td><strong>UNDO is required</strong> — the disk may hold uncommitted changes.</td></tr>
              <tr><td><strong>NO-STEAL</strong></td><td>Dirty pages are pinned until the transaction commits.</td><td>No UNDO needed — but a large transaction may exhaust the buffer pool.</td></tr>
              <tr><td><strong>FORCE</strong></td><td>All of a transaction's pages are written to disk at commit time.</td><td>No REDO needed — but committing becomes slow (many random disk writes).</td></tr>
              <tr><td><strong>NO-FORCE</strong></td><td>Pages may stay in memory after commit and be flushed later.</td><td><strong>REDO is required</strong> — but commits are fast.</td></tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box world-box">
          <div class="learn-title">🌍 What Real Systems Choose</div>
          <p>Almost every production DBMS uses <strong>STEAL / NO-FORCE</strong>, because it gives the best performance: buffers can be reused freely, and commits do not wait for random disk writes.</p>
          <p>The price is that recovery must implement <strong>both UNDO and REDO</strong> — which is exactly the immediate-update technique of topic 6.3, and the reason it is the one used in practice.</p>
        </div>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:26%">Policy Combination</th><th>UNDO needed?</th><th>REDO needed?</th><th>Used By</th></tr></thead>
            <tbody>
              <tr><td>NO-STEAL / FORCE</td><td>No</td><td>No</td><td>Simplest, but slowest — rare.</td></tr>
              <tr><td><strong>NO-STEAL / NO-FORCE</strong></td><td>No</td><td><strong>Yes</strong></td><td>Deferred update (topic 6.2)</td></tr>
              <tr><td>STEAL / FORCE</td><td><strong>Yes</strong></td><td>No</td><td>Rarely used.</td></tr>
              <tr><td><strong>STEAL / NO-FORCE</strong></td><td><strong>Yes</strong></td><td><strong>Yes</strong></td><td>Immediate update (topic 6.3) — <strong>the practical choice</strong>.</td></tr>
            </tbody>
          </table>
        </div>

        <hr class="section-divider" />

        <h3>UNDO and REDO</h3>
        <div class="compare-grid">
          <div class="compare-card compare-bad">
            <h4>UNDO — roll back</h4>
            <p>Restore the <strong>old value</strong> from the log for every change made by a transaction that did <em>not</em> commit.</p>
            <p>Processed <strong>backwards</strong> through the log, from the end to the start, so that the earliest value is restored last.</p>
          </div>
          <div class="compare-card compare-good">
            <h4>REDO — roll forward</h4>
            <p>Re-apply the <strong>new value</strong> from the log for every change made by a transaction that <em>did</em> commit but may not have reached disk.</p>
            <p>Processed <strong>forwards</strong> through the log, so that changes are re-applied in their original order.</p>
          </div>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 Direction Matters — And Is Often Asked</div>
          <div class="formula-strip">UNDO goes BACKWARD (old values) · REDO goes FORWARD (new values)</div>
          <p>Both operations must be <strong>idempotent</strong>: performing them twice must give the same result as performing them once. This matters because the system can crash <em>during</em> recovery, and recovery must then simply start again from the beginning.</p>
        </div>

        <div class="note-figure">
          <img src="images/tp/unit6/redo-recovery-concept.png" alt="Old Stable Database State plus Database Log fed through REDO to produce the New Stable Database State" class="note-img" loading="lazy" />
          <div class="figure-caption">Figure 6.2 (Source: Tpoint Tech) — REDO in one picture: the old stable copy on disk, combined with the log's record of what happened since, produces the new, fully up-to-date stable state.</div>
        </div>

        <hr class="section-divider" />

        <h3>Checkpointing</h3>
        <div class="definition-box">
          <div class="definition-title">📌 Definition</div>
          <p>A <strong>checkpoint</strong> is a point at which the DBMS writes all modified buffers to disk and records <code>[checkpoint]</code> in the log. Everything before the checkpoint is known to be safely on disk.</p>
        </div>

        <div class="worked-example">
          <div class="we-title">📐 What Happens During a Checkpoint</div>
          <ol class="step-list">
            <li><strong>Temporarily suspend</strong> the execution of transactions.</li>
            <li><strong>Force-write</strong> all modified buffers in main memory to disk.</li>
            <li><strong>Write a <code>[checkpoint]</code> record</strong> to the log, together with the list of transactions that are currently active.</li>
            <li><strong>Force-write the log</strong> itself to disk.</li>
            <li><strong>Resume</strong> transaction execution.</li>
          </ol>
        </div>

        <div class="svg-figure">
          <svg viewBox="0 0 800 260" role="img" aria-label="Timeline showing which transactions need undo or redo relative to a checkpoint and a crash">
            <line x1="40" y1="220" x2="760" y2="220" class="svg-stroke" stroke-width="2"/>
            <text x="400" y="248" text-anchor="middle" font-size="12" class="svg-muted">time →</text>

            <line x1="300" y1="30" x2="300" y2="228" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="6 4"/>
            <text x="300" y="22" text-anchor="middle" font-size="12" font-weight="700" fill="#f59e0b">CHECKPOINT</text>

            <line x1="660" y1="30" x2="660" y2="228" stroke="#f43f5e" stroke-width="3"/>
            <text x="660" y="22" text-anchor="middle" font-size="12" font-weight="700" fill="#f43f5e">CRASH</text>

            <line x1="70" y1="52" x2="240" y2="52" stroke="#10b981" stroke-width="5"/>
            <text x="46" y="57" font-size="12" font-weight="700">T₁</text>
            <text x="330" y="57" font-size="11" fill="#10b981">committed before checkpoint → <tspan font-weight="700">nothing to do</tspan></text>

            <line x1="140" y1="88" x2="470" y2="88" stroke="#6366f1" stroke-width="5"/>
            <text x="116" y="93" font-size="12" font-weight="700">T₂</text>
            <text x="490" y="93" font-size="11" fill="#6366f1">committed after checkpoint → <tspan font-weight="700">REDO</tspan></text>

            <line x1="330" y1="124" x2="600" y2="124" stroke="#6366f1" stroke-width="5"/>
            <text x="306" y="129" font-size="12" font-weight="700">T₃</text>
            <text x="620" y="129" font-size="11" fill="#6366f1"><tspan font-weight="700">REDO</tspan></text>

            <line x1="220" y1="160" x2="660" y2="160" stroke="#f43f5e" stroke-width="5"/>
            <text x="196" y="165" font-size="12" font-weight="700">T₄</text>
            <text x="680" y="165" font-size="11" fill="#f43f5e"><tspan font-weight="700">UNDO</tspan></text>

            <line x1="500" y1="196" x2="660" y2="196" stroke="#f43f5e" stroke-width="5"/>
            <text x="476" y="201" font-size="12" font-weight="700">T₅</text>
            <text x="680" y="201" font-size="11" fill="#f43f5e"><tspan font-weight="700">UNDO</tspan></text>

            <circle cx="240" cy="52" r="5" fill="#10b981"/><text x="252" y="44" font-size="9" fill="#10b981">commit</text>
            <circle cx="470" cy="88" r="5" fill="#6366f1"/><text x="482" y="80" font-size="9" fill="#6366f1">commit</text>
            <circle cx="600" cy="124" r="5" fill="#6366f1"/><text x="612" y="116" font-size="9" fill="#6366f1">commit</text>
          </svg>
          <div class="figure-caption">Figure 6.1 — The checkpoint decides how much work recovery must do. Transactions committed <em>before</em> the checkpoint need nothing; those committed after need REDO; those still running at the crash need UNDO.</div>
        </div>

        <div class="img-grid-2col">
          <div class="note-figure">
            <img src="images/tp/unit6/checkpoint-transaction-timeline.png" alt="Four transactions T1-T4 plotted against a checkpoint tc and a crash tr, with T2's start and commit logged" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 6.1b (Source: Tpoint Tech) — The same idea with four transactions. T1 finished before the checkpoint (nothing to do); T2 and T4 span the checkpoint (T2 committed after it, so REDO; T4 is still running at the crash, so UNDO); T3 started before and finished before the crash without a logged commit shown here, so treat it as REDO only if its commit record appears in the log.</div>
          </div>
          <div class="note-figure">
            <img src="images/tp/unit6/checkpoint-failure-timeline.png" alt="Several overlapping T1 transaction bars plotted between a Checkpoint mark and a Failure mark" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 6.1c (Source: Tpoint Tech) — A general view of overlapping transactions running between a checkpoint and a failure — exactly the picture an exam diagram question expects you to reproduce.</div>
          </div>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 The Rule for Reading This Diagram</div>
          <ul>
            <li><strong>Committed before the checkpoint</strong> → already safely on disk → <strong>do nothing</strong>.</li>
            <li><strong>Committed between the checkpoint and the crash</strong> → <strong>REDO</strong>.</li>
            <li><strong>Still active at the crash</strong> → <strong>UNDO</strong>.</li>
          </ul>
          <p>Exam questions give you a log and a crash point and ask which transactions to undo and which to redo. This three-line rule answers all of them.</p>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"What is write-ahead logging? Why is it necessary?"</em> — the rule, its two sub-rules, and what goes wrong without it (5 marks).</li>
            <li><em>"What is a checkpoint? Explain the steps involved."</em> — definition + the five steps + the timeline diagram (5–6 marks).</li>
            <li><em>"Explain the steal/no-steal and force/no-force policies."</em> — the policy table and which combination requires UNDO/REDO (5 marks).</li>
            <li><em>"Differentiate between UNDO and REDO."</em> — old vs new values, backward vs forward (3 marks).</li>
          </ul>
        </div>
      </div>
      `
    },

    /* ================================================================== */
    {
      id: "u6-deferred-update",
      title: "6.2 NO-UNDO/REDO Recovery Based on Deferred Update",
      summary: "The deferred update technique: never touch the database until commit, so recovery only ever needs REDO — with a complete worked recovery from a log.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 23 (Sec. 23.2) | Silberschatz Ch. 16</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p>The deferred update idea is beautifully simple: <strong>do not change the actual database at all until the transaction commits.</strong></p>
          <p>All updates are recorded in the log and kept in memory buffers. Only after <code>[commit, T]</code> is safely written does the DBMS start applying them to the database on disk.</p>
        </div>

        <div class="learn-box analogy-box">
          <div class="learn-title">✏️ Everyday Analogy</div>
          <p>Filling in an important form. You write everything on a <strong>rough sheet</strong> first. Only when you are completely satisfied do you copy it onto the real form in pen.</p>
          <p>If you change your mind halfway, you simply throw the rough sheet away — the real form was never touched, so there is nothing to correct.</p>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 Why It Is Called NO-UNDO/REDO</div>
          <div class="formula-strip">Uncommitted changes never reach the disk → nothing to UNDO. Committed changes might not have reached it yet → REDO may be needed.</div>
          <p>In buffer-policy terms this is exactly <strong>NO-STEAL / NO-FORCE</strong> from topic 6.1.</p>
        </div>

        <h3>The Two Recovery Rules</h3>
        <div class="worked-example">
          <div class="we-title">📐 After a Crash, Deferred Update Recovery Does This</div>
          <ol class="step-list">
            <li><strong>Scan the log</strong> from the last checkpoint to the end, and build two lists.</li>
            <li><strong>List 1 — committed transactions:</strong> those with both <code>[start_transaction, T]</code> and <code>[commit, T]</code> in the log.</li>
            <li><strong>List 2 — active transactions:</strong> those with a start record but <strong>no</strong> commit record.</li>
            <li><strong>REDO every write of every committed transaction</strong>, working <em>forwards</em> through the log and writing the new value of each item.</li>
            <li><strong>Do nothing at all for the active transactions</strong> — simply restart them. Their changes never reached the database, so there is nothing to undo.</li>
          </ol>
        </div>

        <div class="svg-figure">
          <svg viewBox="0 0 800 210" role="img" aria-label="Deferred update: writes go only to the log until commit">
            <rect x="30" y="40" width="200" height="120" rx="10" fill="rgba(99,102,241,0.12)" stroke="#6366f1" stroke-width="2"/>
            <text x="130" y="30" text-anchor="middle" font-size="13" font-weight="700">Transaction T</text>
            <text x="130" y="72" text-anchor="middle" font-size="12" class="svg-muted">write(X, 950)</text>
            <text x="130" y="96" text-anchor="middle" font-size="12" class="svg-muted">write(Y, 2050)</text>
            <text x="130" y="128" text-anchor="middle" font-size="13" font-weight="700" fill="#10b981">COMMIT</text>

            <line x1="230" y1="84" x2="320" y2="84" stroke="#6366f1" stroke-width="2.5"/>
            <polygon points="320,84 310,79 310,89" fill="#6366f1"/>
            <text x="275" y="76" text-anchor="middle" font-size="10" class="svg-muted">recorded</text>

            <rect x="322" y="40" width="180" height="120" rx="10" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" stroke-width="2"/>
            <text x="412" y="30" text-anchor="middle" font-size="13" font-weight="700">LOG (on disk)</text>
            <text x="412" y="72" text-anchor="middle" font-size="11" class="svg-muted">[write, T, X, 950]</text>
            <text x="412" y="94" text-anchor="middle" font-size="11" class="svg-muted">[write, T, Y, 2050]</text>
            <text x="412" y="128" text-anchor="middle" font-size="11" font-weight="700" fill="#10b981">[commit, T]</text>

            <line x1="502" y1="128" x2="600" y2="128" stroke="#10b981" stroke-width="2.5"/>
            <polygon points="600,128 590,123 590,133" fill="#10b981"/>
            <text x="551" y="120" text-anchor="middle" font-size="10" font-weight="700" fill="#10b981">ONLY after commit</text>

            <rect x="602" y="40" width="170" height="120" rx="10" fill="rgba(16,185,129,0.12)" stroke="#10b981" stroke-width="2"/>
            <text x="687" y="30" text-anchor="middle" font-size="13" font-weight="700">DATABASE (disk)</text>
            <text x="687" y="82" text-anchor="middle" font-size="12" class="svg-muted">untouched until</text>
            <text x="687" y="102" text-anchor="middle" font-size="12" class="svg-muted">the commit point</text>

            <text x="400" y="192" text-anchor="middle" font-size="12" class="svg-muted">Because nothing uncommitted ever reaches the database, UNDO is never required.</text>
          </svg>
          <div class="figure-caption">Figure 6.2 — Deferred update. All writes are held in the log and buffers; the database is modified only after the commit record is safe.</div>
        </div>

        <hr class="section-divider" />

        <div class="worked-example">
          <div class="we-title">✍️ Complete Worked Recovery</div>
          <div class="we-question">The system crashes. The log, read from the last checkpoint, contains:
          <div class="code-block"><div class="code-content"><pre>[checkpoint]
[start_transaction, T1]
[write_item, T1, A, 100]        -- new value 100
[commit, T1]
[start_transaction, T2]
[write_item, T2, B, 200]
[start_transaction, T3]
[write_item, T3, C, 300]
[commit, T3]
[write_item, T2, D, 400]
              <<<<< CRASH >>>>></pre></div></div>
          Using deferred update, state what recovery does.</div>
          <ol class="step-list">
            <li><strong>Scan from the checkpoint to the end of the log.</strong> Identify every transaction that appears.</li>
            <li><strong>Classify T1:</strong> it has both a start record and <code>[commit, T1]</code> → <strong>committed</strong>.</li>
            <li><strong>Classify T2:</strong> it has a start record but <strong>no</strong> commit record → <strong>active at the crash</strong>.</li>
            <li><strong>Classify T3:</strong> start record and <code>[commit, T3]</code> → <strong>committed</strong>.</li>
            <li><strong>REDO the committed transactions</strong>, working forwards through the log: write A = 100 (from T1), then write C = 300 (from T3).</li>
            <li><strong>Handle T2:</strong> nothing to undo. Under deferred update its writes to B and D never reached the database, so the DBMS simply discards them and <strong>restarts T2</strong>.</li>
          </ol>
          <div class="we-answer"><strong>Answer:</strong><br>
          <strong>REDO list</strong> = {T1, T3} → set A = 100 and C = 300.<br>
          <strong>UNDO list</strong> = empty — deferred update never needs UNDO.<br>
          T2 is simply restarted from the beginning. B and D retain their original values.</div>
        </div>

        <div class="compare-grid">
          <div class="compare-card compare-good">
            <h4>✔ Advantages</h4>
            <ul>
              <li><strong>No UNDO is ever required</strong> — recovery is simpler and faster to implement.</li>
              <li>Aborting a transaction is trivial: just discard its log records.</li>
              <li>No cascading rollback, since nothing uncommitted is ever visible on disk.</li>
            </ul>
          </div>
          <div class="compare-card compare-bad">
            <h4>✘ Disadvantages</h4>
            <ul>
              <li>A long transaction must hold <strong>all</strong> its updates in buffers, which can exhaust memory.</li>
              <li>Commit becomes a burst of disk activity, delaying the transaction.</li>
              <li>It is impractical for large transactions, which is why real systems prefer immediate update.</li>
            </ul>
          </div>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"Explain the deferred update recovery technique."</em> — the principle, why it is NO-UNDO/REDO, and the recovery procedure (6 marks).</li>
            <li><em>"Given the following log, show how the database is recovered using deferred update."</em> — a common numerical. Always produce the two lists (committed → REDO, active → ignore/restart) explicitly.</li>
            <li><em>"Why does deferred update not require UNDO?"</em> — because no uncommitted change ever reaches the database on disk (3 marks).</li>
          </ul>
        </div>
      </div>
      `
    },

    /* ================================================================== */
    {
      id: "u6-immediate-update",
      title: "6.3 Recovery Based on Immediate Update (UNDO/REDO)",
      summary: "Writing changes to the database as they happen, protected by write-ahead logging — the UNDO/REDO algorithm, the order of the two passes, and a full worked recovery.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 23 (Sec. 23.3) | Silberschatz Ch. 16</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p>Immediate update takes the opposite approach: <strong>apply changes to the database as soon as they happen</strong>, without waiting for commit.</p>
          <p>That is faster and uses far less memory — but it means the disk can contain changes from transactions that later abort. So recovery needs <strong>both</strong> operations: UNDO for the uncommitted, REDO for the committed.</p>
          <p>Safety comes entirely from the <strong>write-ahead logging</strong> rule: the old value is always in the log before the data is overwritten, so any change can be reversed.</p>
        </div>

        <div class="learn-box analogy-box">
          <div class="learn-title">📖 Everyday Analogy</div>
          <p>Editing a document directly, but keeping a careful <strong>change history</strong> as you go: "changed 'Ram' to 'Shyam' on page 3."</p>
          <p>If you decide to cancel, you walk back through the history in reverse, undoing each change. Because you wrote down the old value <em>before</em> making each edit, nothing is ever unrecoverable.</p>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 The Two Variants</div>
          <ul>
            <li><strong>UNDO/NO-REDO</strong> — if all updates are forced to disk <em>before</em> commit (a FORCE policy), committed changes are already safe, so only UNDO is needed.</li>
            <li><strong>UNDO/REDO</strong> — the general case, with a STEAL/NO-FORCE policy. <strong>This is what real systems use</strong>, and what exams mean by "immediate update".</li>
          </ul>
        </div>

        <h3>The Recovery Algorithm</h3>
        <div class="worked-example">
          <div class="we-title">📐 Two Passes Through the Log</div>
          <ol class="step-list">
            <li><strong>Scan the log</strong> from the last checkpoint to the end, building two lists: <strong>committed</strong> transactions (start and commit records both present) and <strong>active</strong> transactions (start but no commit).</li>
            <li><strong>UNDO pass — go BACKWARDS</strong> through the log from the end. For every <code>[write_item, T, X, old, new]</code> belonging to an <em>active</em> transaction, restore <code>X = old</code>.</li>
            <li><strong>REDO pass — go FORWARDS</strong> through the log from the checkpoint. For every <code>[write_item, T, X, old, new]</code> belonging to a <em>committed</em> transaction, write <code>X = new</code>.</li>
            <li><strong>Write <code>[abort, T]</code></strong> for each undone transaction, and restart them if required.</li>
          </ol>
        </div>

        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ The Order of the Passes — A Classic Exam Trap</div>
          <p><strong>UNDO is performed first (backwards), then REDO (forwards).</strong></p>
          <p>Why does the order matter? If the same item was written by both an uncommitted and a committed transaction, doing REDO last guarantees that the committed value is the one left in the database. Reversing the order could leave the item holding a value that was supposed to be rolled back.</p>
          <p>(ARIES, mentioned in the next topic, actually does REDO first and then UNDO — but it uses extra bookkeeping to make that safe. For this syllabus, answer <strong>UNDO then REDO</strong>.)</p>
        </div>

        <div class="worked-example">
          <div class="we-title">✍️ Complete Worked Recovery</div>
          <div class="we-question">Recover using immediate update (UNDO/REDO) from this log. Each write record shows <code>[write_item, T, item, old_value, new_value]</code>.
          <div class="code-block"><div class="code-content"><pre>[checkpoint]
[start_transaction, T1]
[write_item, T1, A, 500, 600]
[start_transaction, T2]
[write_item, T2, B, 800, 900]
[commit, T1]
[start_transaction, T3]
[write_item, T3, C, 200, 250]
[write_item, T2, D, 300, 350]
[commit, T3]
                <<<<< CRASH >>>>></pre></div></div></div>
          <ol class="step-list">
            <li><strong>Build the lists.</strong> T1 has a commit record → <strong>committed</strong>. T3 has a commit record → <strong>committed</strong>. T2 has a start record but no commit → <strong>active</strong>.</li>
            <li><strong>So:</strong> REDO list = {T1, T3}, UNDO list = {T2}.</li>
            <li><strong>UNDO pass — scan backwards from the crash.</strong> The last T2 record is <code>[write_item, T2, D, 300, 350]</code> → restore <strong>D = 300</strong> (the old value).</li>
            <li><strong>Continue backwards.</strong> The next T2 record is <code>[write_item, T2, B, 800, 900]</code> → restore <strong>B = 800</strong>. No more T2 records remain.</li>
            <li><strong>REDO pass — scan forwards from the checkpoint.</strong> <code>[write_item, T1, A, 500, 600]</code> belongs to committed T1 → write <strong>A = 600</strong> (the new value).</li>
            <li><strong>Continue forwards.</strong> <code>[write_item, T3, C, 200, 250]</code> belongs to committed T3 → write <strong>C = 250</strong>. The T2 records are skipped, as T2 is not committed.</li>
            <li><strong>Finish:</strong> write <code>[abort, T2]</code> to the log and restart T2.</li>
          </ol>
          <div class="we-answer"><strong>Answer — final values after recovery:</strong><br>
          <strong>A = 600</strong> (redone, T1 committed) · <strong>B = 800</strong> (undone, T2 uncommitted) · <strong>C = 250</strong> (redone, T3 committed) · <strong>D = 300</strong> (undone, T2 uncommitted).<br>
          <strong>UNDO list = {T2}</strong>, processed backwards. <strong>REDO list = {T1, T3}</strong>, processed forwards.</div>
        </div>

        <hr class="section-divider" />

        <h3>Deferred vs Immediate Update — The Comparison</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:24%">Basis</th><th>Deferred Update</th><th>Immediate Update</th></tr></thead>
            <tbody>
              <tr><td><strong>When the database is changed</strong></td><td>Only <em>after</em> commit</td><td>As soon as the write happens</td></tr>
              <tr><td><strong>Also called</strong></td><td>NO-UNDO/REDO</td><td>UNDO/REDO</td></tr>
              <tr><td><strong>UNDO required?</strong></td><td><strong>No</strong></td><td><strong>Yes</strong></td></tr>
              <tr><td><strong>REDO required?</strong></td><td>Yes</td><td>Yes</td></tr>
              <tr><td><strong>Log must store</strong></td><td>New values only</td><td><strong>Both</strong> old and new values</td></tr>
              <tr><td><strong>Buffer policy</strong></td><td>NO-STEAL / NO-FORCE</td><td>STEAL / NO-FORCE</td></tr>
              <tr><td><strong>Memory pressure</strong></td><td>High — all updates held until commit</td><td>Low — buffers can be reused freely</td></tr>
              <tr><td><strong>Suits</strong></td><td>Short transactions</td><td>Long transactions; <strong>used in practice</strong></td></tr>
              <tr><td><strong>Recovery complexity</strong></td><td>Simpler</td><td>More complex, but far more efficient</td></tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 The One Difference That Explains All the Others</div>
          <div class="formula-strip">Deferred update logs only NEW values, because it never needs to undo. Immediate update logs BOTH, because it does.</div>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"Explain the immediate update recovery technique with an example."</em> — the principle, the WAL dependency, and the two-pass algorithm (6–8 marks).</li>
            <li><em>"Given the log below, determine which transactions must be undone and which redone, and give the final values."</em> — a very common numerical. Show the two lists, then trace each pass.</li>
            <li><em>"Differentiate between deferred and immediate update."</em> — the nine-row comparison table (5–6 marks).</li>
          </ul>
        </div>
      </div>
      `
    }
  ]
});
