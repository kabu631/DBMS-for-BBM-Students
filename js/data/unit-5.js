/**
 * Unit 5 — Transaction Processing and Concurrency Control (7 Lecture Hours).
 * Part 1 of 2: topics 5.1 – 5.3.
 */

registerUnit({
  id: "unit-5",
  number: "Unit 5",
  title: "Transaction Processing & Concurrency Control",
  subtitle: "What a transaction is, the four problems that appear when many users work at once, the ACID guarantees, and the locking and timestamp protocols that enforce them",
  readingTime: "7 Lecture Hours (LHs)",
  description: "Introduction to Transaction Processing; Transaction and System Concepts; Desirable Properties of Transactions; Serializable Schedule; Two-Phase Locking and Timestamp Ordering; Concurrency Control Techniques.",
  topics: [

    /* ================================================================== */
    {
      id: "u5-intro-transactions",
      title: "5.1 Introduction to Transaction Processing",
      summary: "Single-user vs multi-user systems, why concurrency is necessary, the four concurrency problems (lost update, dirty read, incorrect summary, unrepeatable read), and the types of failure.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 21 (Sec. 21.1) | Silberschatz Ch. 14</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p>A <strong>transaction</strong> is a group of database operations that must be treated as <strong>one single indivisible unit of work</strong> — either all of them happen, or none of them do.</p>
          <p>The classic example is a bank transfer. Moving Rs. 5,000 from account A to account B is two operations: subtract from A, add to B. If the system crashes after the first and before the second, Rs. 5,000 has simply <em>vanished</em>. Grouping them into one transaction makes that impossible.</p>
        </div>

        <div class="learn-box analogy-box">
          <div class="learn-title">💸 Everyday Analogy</div>
          <p>Think of paying a shopkeeper with cash. You hand over the note and they hand over the goods. It happens as one exchange. Nobody would accept "I took your money, and then I had a power cut, so you get nothing" — yet that is exactly what a database does if it has no transactions.</p>
        </div>

        <div class="code-block">
          <div class="code-header"><span>The bank transfer, written as a transaction</span></div>
          <div class="code-content"><pre>BEGIN TRANSACTION;
    read(A);          -- read balance of A
    A := A - 5000;
    write(A);         -- save it back
                      -- <<< a crash HERE would destroy Rs. 5000
    read(B);
    B := B + 5000;
    write(B);
COMMIT;               -- only now does anything become permanent</pre></div>
        </div>

        <h3>Single-User vs Multi-User Systems</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:24%">Basis</th><th>Single-User System</th><th>Multi-User System</th></tr></thead>
            <tbody>
              <tr><td><strong>Users at a time</strong></td><td>One</td><td>Many</td></tr>
              <tr><td><strong>Concurrency</strong></td><td>Not possible</td><td>Essential</td></tr>
              <tr><td><strong>Concurrency control</strong></td><td>Not needed</td><td>Absolutely required</td></tr>
              <tr><td><strong>Example</strong></td><td>A personal MS Access file</td><td>A bank, an airline reservation system, an e-commerce site</td></tr>
            </tbody>
          </table>
        </div>

        <h3>Why Allow Concurrency At All?</h3>
        <p>If concurrency causes so many problems, why not run transactions strictly one after another? Because of two things:</p>
        <ul class="styled-list">
          <li><strong>Throughput.</strong> While transaction T₁ waits for a slow disk read, the CPU would sit idle. Letting T₂ use it means far more work gets done per second.</li>
          <li><strong>Reduced waiting time.</strong> Without interleaving, a customer running a two-second report would block a one-millisecond balance check behind it.</li>
        </ul>

        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ Interleaved ≠ Parallel</div>
          <p>On a single CPU, transactions are <strong>interleaved</strong> — the processor switches rapidly between them, so only one instruction runs at any instant. True <strong>parallel</strong> execution needs multiple processors.</p>
          <p>The concurrency problems below arise from <em>interleaving alone</em>, so they occur even on a single-CPU machine. Exams sometimes test this point directly.</p>
        </div>

        <hr class="section-divider" />

        <h3>The Four Concurrency Problems</h3>
        <p>These four appear in almost every exam paper. Learn each one as <strong>name + two-transaction table + one-line explanation</strong>.</p>

        <h4 style="margin-top:20px;">Problem 1 — Lost Update</h4>
        <div class="learn-box simple-box">
          <div class="learn-title">💡 What Happens</div>
          <p>Two transactions read the same value, both change it, and the second write <strong>overwrites</strong> the first. One update disappears as if it never happened.</p>
        </div>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:12%">Time</th><th style="width:34%">T₁ (deposit 500)</th><th style="width:34%">T₂ (withdraw 200)</th><th>Balance X</th></tr></thead>
            <tbody>
              <tr><td>t1</td><td>read(X) → 1000</td><td></td><td>1000</td></tr>
              <tr><td>t2</td><td></td><td>read(X) → 1000</td><td>1000</td></tr>
              <tr><td>t3</td><td>X := 1000 + 500 = 1500</td><td></td><td>1000</td></tr>
              <tr><td>t4</td><td></td><td>X := 1000 − 200 = 800</td><td>1000</td></tr>
              <tr><td>t5</td><td>write(X)</td><td></td><td><strong>1500</strong></td></tr>
              <tr><td>t6</td><td></td><td>write(X)</td><td style="color:var(--accent-rose);"><strong>800</strong> ✘</td></tr>
            </tbody>
          </table>
        </div>
        <p><strong>The correct answer is 1300</strong> (1000 + 500 − 200). Instead we get 800 — T₁'s deposit of 500 has been <em>lost</em>, because T₂ was working from a stale copy of the balance.</p>

        <h4 style="margin-top:24px;">Problem 2 — Dirty Read (Temporary Update / Uncommitted Dependency)</h4>
        <div class="learn-box simple-box">
          <div class="learn-title">💡 What Happens</div>
          <p>One transaction reads a value that another transaction has written but <strong>not yet committed</strong>. If the writer then aborts, the reader has used a value that never officially existed.</p>
        </div>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:12%">Time</th><th style="width:36%">T₁</th><th style="width:36%">T₂</th><th>X</th></tr></thead>
            <tbody>
              <tr><td>t1</td><td>read(X) → 1000</td><td></td><td>1000</td></tr>
              <tr><td>t2</td><td>X := 1000 − 200; write(X)</td><td></td><td>800</td></tr>
              <tr><td>t3</td><td></td><td style="color:var(--accent-rose);">read(X) → 800 (dirty!)</td><td>800</td></tr>
              <tr><td>t4</td><td style="color:var(--accent-rose);"><strong>ROLLBACK</strong></td><td></td><td>1000</td></tr>
              <tr><td>t5</td><td></td><td>continues using 800 ✘</td><td>1000</td></tr>
            </tbody>
          </table>
        </div>
        <p>T₂ acted on a value that was undone. Worse, if T₂ had already committed, we cannot undo it — this cascade of forced rollbacks is called <strong>cascading rollback</strong>.</p>

        <h4 style="margin-top:24px;">Problem 3 — Incorrect Summary (Inconsistent Analysis)</h4>
        <div class="learn-box simple-box">
          <div class="learn-title">💡 What Happens</div>
          <p>One transaction computes an aggregate (a sum, a count, an average) while another transaction is <em>midway</em> through updating the records. The summary counts some records before the change and others after it.</p>
        </div>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:12%">Time</th><th style="width:38%">T₁ (transfer 500 from A to B)</th><th>T₂ (total all balances)</th></tr></thead>
            <tbody>
              <tr><td>t1</td><td></td><td>sum := 0; read(A) → 1000; sum = 1000</td></tr>
              <tr><td>t2</td><td>read(A); A := A − 500; write(A) → 500</td><td></td></tr>
              <tr><td>t3</td><td>read(B); B := B + 500; write(B) → 2500</td><td></td></tr>
              <tr><td>t4</td><td>COMMIT</td><td style="color:var(--accent-rose);">read(B) → 2500; sum = 3500 ✘</td></tr>
            </tbody>
          </table>
        </div>
        <p>The true total never changed — it is 1000 + 2000 = <strong>3000</strong>. But T₂ read A <em>before</em> the deduction and B <em>after</em> the addition, counting the 500 twice.</p>

        <h4 style="margin-top:24px;">Problem 4 — Unrepeatable Read</h4>
        <div class="learn-box simple-box">
          <div class="learn-title">💡 What Happens</div>
          <p>A transaction reads the same item <strong>twice</strong> and gets <strong>two different values</strong>, because another transaction changed it in between. The first transaction's own view of the world is inconsistent.</p>
        </div>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:12%">Time</th><th style="width:38%">T₁</th><th>T₂</th></tr></thead>
            <tbody>
              <tr><td>t1</td><td>read(X) → 1000</td><td></td></tr>
              <tr><td>t2</td><td></td><td>X := X − 300; write(X); COMMIT</td></tr>
              <tr><td>t3</td><td style="color:var(--accent-rose);">read(X) → 700 ✘ (was 1000 a moment ago)</td><td></td></tr>
            </tbody>
          </table>
        </div>
        <p>T₁ did nothing wrong, yet the database gave it two different answers to the same question.</p>

        <div class="img-grid-3col">
          <div class="note-figure">
            <img src="images/tp/unit5/lost-update-problem.png" alt="Timeline table showing Tx reading A, Ty reading A, then Tx overwriting Ty's update" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 5.2a (Source: Tpoint Tech) — Lost update: Tx's write at t₆ overwrites the value Ty just computed.</div>
          </div>
          <div class="note-figure">
            <img src="images/tp/unit5/dirty-read-problem.png" alt="Timeline table showing Ty reading a value Tx wrote before Tx rolled back" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 5.2b (Source: Tpoint Tech) — Dirty read: Ty reads Tx's uncommitted write, which is then rolled back.</div>
          </div>
          <div class="note-figure">
            <img src="images/tp/unit5/unrepeatable-read-problem.png" alt="Timeline table showing Tx reading A twice with a different value each time" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 5.2c (Source: Tpoint Tech) — Unrepeatable read: Tx reads A at t₁ and again at t₅, getting two different values.</div>
          </div>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 Memory Trick for the Four Problems</div>
          <div class="mnemonic-phrase">L · D · I · U — "Lost Dirty Incorrect Unrepeatable"</div>
          <ul>
            <li><strong>Lost update</strong> — my write was <em>overwritten</em>.</li>
            <li><strong>Dirty read</strong> — I read something <em>uncommitted</em>.</li>
            <li><strong>Incorrect summary</strong> — I added things up <em>mid-change</em>.</li>
            <li><strong>Unrepeatable read</strong> — I read <em>twice</em> and got two answers.</li>
          </ul>
          <p>In the exam, always draw the little two-column T₁/T₂ table. Words alone rarely get full marks.</p>
        </div>

        <hr class="section-divider" />

        <h3>Types of Failure</h3>
        <p>The second half of this unit (and all of Unit 6) exists because systems fail. The standard classification:</p>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:26%">Failure Type</th><th>Cause</th><th style="width:26%">Recovery Needed</th></tr></thead>
            <tbody>
              <tr><td><strong>1. Transaction failure</strong></td><td>A logical error inside the transaction — bad input, division by zero, a violated constraint, or an explicit ROLLBACK.</td><td>Undo that transaction only.</td></tr>
              <tr><td><strong>2. System crash</strong></td><td>Hardware, operating system or DBMS failure, or a power cut. <strong>Main memory is lost; the disk survives.</strong></td><td>Redo committed transactions, undo uncommitted ones (Unit 6).</td></tr>
              <tr><td><strong>3. Disk failure</strong></td><td>A head crash or disk corruption destroys part of the stored database. <strong>The disk itself is lost.</strong></td><td>Restore from backup and re-apply the log.</td></tr>
              <tr><td><strong>4. Concurrency control enforcement</strong></td><td>The scheduler aborts a transaction to break a deadlock or to preserve serializability.</td><td>Restart the aborted transaction.</td></tr>
              <tr><td><strong>5. Physical problems / catastrophe</strong></td><td>Fire, flood, theft, sabotage, or an operator mounting the wrong tape.</td><td>Restore from an off-site backup.</td></tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ The Distinction That Gets Tested</div>
          <p>In a <strong>system crash</strong> the disk is fine and only volatile memory (RAM, buffers) is lost — so the log on disk can be used to repair everything. In a <strong>disk failure</strong> the stored data itself is gone, so no amount of log replay helps without a backup. Unit 6 treats the two cases completely differently.</p>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"What problems can occur when concurrent transactions execute? Explain with examples."</em> — near-certain, 8 marks. Give all four with their schedule tables.</li>
            <li><em>"What is a transaction? Why is concurrency control necessary?"</em> — definition + throughput/waiting time + the four problems named (5 marks).</li>
            <li><em>"Explain the different types of failures in a database system."</em> — the five-row table (5 marks).</li>
          </ul>
        </div>
      </div>
      `
    },

    /* ================================================================== */
    {
      id: "u5-transaction-concepts",
      title: "5.2 Transaction & System Concepts — States, Log and Commit Point",
      summary: "The read and write operations, the five transaction states with their transition diagram, the system log and its record types, and what the commit point really means.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 21 (Sec. 21.2) | Silberschatz Ch. 14</span>

        <h3>The Two Basic Operations</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:22%">Operation</th><th>What the DBMS Actually Does</th></tr></thead>
            <tbody>
              <tr><td><code>read_item(X)</code></td><td>1. Find the address of the disk block containing X. 2. Copy that block into a memory buffer (if it is not already there). 3. Copy X from the buffer into a program variable.</td></tr>
              <tr><td><code>write_item(X)</code></td><td>1. Find the address of the disk block containing X. 2. Copy that block into a memory buffer if needed. 3. Copy the program variable into the correct position in the buffer. 4. Eventually write the buffer back to disk — <strong>not necessarily immediately</strong>.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ Point 4 Is the Whole Reason Unit 6 Exists</div>
          <p>A <code>write</code> changes the copy in <strong>memory</strong>. The DBMS decides later when to flush that buffer to disk. So at the moment of a crash, the disk may hold changes from transactions that never committed, and may be missing changes from transactions that did. The recovery manager's job is to sort that out.</p>
        </div>

        <hr class="section-divider" />

        <h3>The Five Transaction States</h3>
        <div class="svg-figure">
          <svg viewBox="0 0 820 300" role="img" aria-label="Transaction state transition diagram">
            <defs>
              <marker id="u5arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
                <path d="M0,0 L10,4 L0,8 Z" fill="#6366f1"/>
              </marker>
              <marker id="u5arrowR" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
                <path d="M0,0 L10,4 L0,8 Z" fill="#f43f5e"/>
              </marker>
            </defs>

            <ellipse cx="90" cy="120" rx="66" ry="32" fill="rgba(99,102,241,0.18)" stroke="#6366f1" stroke-width="2"/>
            <text x="90" y="118" text-anchor="middle" font-size="13" font-weight="700">ACTIVE</text>
            <text x="90" y="134" text-anchor="middle" font-size="10" class="svg-muted">executing</text>

            <line x1="156" y1="120" x2="208" y2="120" stroke="#6366f1" stroke-width="2" marker-end="url(#u5arrow)"/>
            <text x="182" y="110" text-anchor="middle" font-size="10" class="svg-muted">last</text>
            <text x="182" y="122" text-anchor="middle" font-size="10" class="svg-muted">statement</text>

            <ellipse cx="290" cy="120" rx="80" ry="34" fill="rgba(6,182,212,0.18)" stroke="#06b6d4" stroke-width="2"/>
            <text x="290" y="116" text-anchor="middle" font-size="12" font-weight="700">PARTIALLY</text>
            <text x="290" y="132" text-anchor="middle" font-size="12" font-weight="700">COMMITTED</text>

            <line x1="370" y1="120" x2="428" y2="120" stroke="#6366f1" stroke-width="2" marker-end="url(#u5arrow)"/>
            <text x="399" y="110" text-anchor="middle" font-size="10" class="svg-muted">log forced</text>
            <text x="399" y="122" text-anchor="middle" font-size="10" class="svg-muted">to disk</text>

            <ellipse cx="516" cy="120" rx="76" ry="34" fill="rgba(16,185,129,0.20)" stroke="#10b981" stroke-width="2.5"/>
            <text x="516" y="118" text-anchor="middle" font-size="13" font-weight="700">COMMITTED</text>
            <text x="516" y="136" text-anchor="middle" font-size="10" class="svg-muted">permanent</text>

            <line x1="592" y1="120" x2="650" y2="120" stroke="#10b981" stroke-width="2" marker-end="url(#u5arrow)"/>
            <ellipse cx="722" cy="120" rx="66" ry="30" class="svg-panel" stroke-width="2"/>
            <text x="722" y="125" text-anchor="middle" font-size="13" font-weight="700">TERMINATED</text>

            <line x1="90" y1="152" x2="90" y2="212" stroke="#f43f5e" stroke-width="2" marker-end="url(#u5arrowR)"/>
            <text x="24" y="186" font-size="10" fill="#f43f5e">error /</text>
            <text x="24" y="198" font-size="10" fill="#f43f5e">abort</text>

            <line x1="290" y1="154" x2="180" y2="216" stroke="#f43f5e" stroke-width="2" marker-end="url(#u5arrowR)"/>
            <text x="250" y="196" font-size="10" fill="#f43f5e">cannot commit</text>

            <ellipse cx="150" cy="236" rx="66" ry="28" fill="rgba(244,63,94,0.18)" stroke="#f43f5e" stroke-width="2"/>
            <text x="150" y="241" text-anchor="middle" font-size="13" font-weight="700">FAILED</text>

            <line x1="216" y1="236" x2="290" y2="236" stroke="#f43f5e" stroke-width="2" marker-end="url(#u5arrowR)"/>
            <text x="253" y="228" text-anchor="middle" font-size="10" fill="#f43f5e">rollback</text>

            <ellipse cx="366" cy="236" rx="70" ry="28" fill="rgba(245,158,11,0.18)" stroke="#f59e0b" stroke-width="2"/>
            <text x="366" y="241" text-anchor="middle" font-size="13" font-weight="700">ABORTED</text>

            <path d="M 436 236 Q 580 236 700 150" fill="none" stroke="#f59e0b" stroke-width="2" marker-end="url(#u5arrow)"/>
            <text x="570" y="228" text-anchor="middle" font-size="10" class="svg-muted">kill or restart</text>
          </svg>
          <div class="figure-caption">Figure 5.3 (E&amp;N Fig. 21.4) — The transaction state transition diagram. Drawing this correctly is worth full marks on its own.</div>
        </div>

        <div class="note-figure">
          <img src="images/tp/unit5/transaction-states-simple.png" alt="Transaction state diagram: Begin to Active, Partially Committed, Committed, End; or Failed, Aborted, End" class="note-img" loading="lazy" />
          <div class="figure-caption">Figure 5.3b (Source: Tpoint Tech) — The same state diagram in the exact circle-and-arrow style many exam papers use. Compare it against the diagram above — both describe the same five states.</div>
        </div>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:22%">State</th><th>Meaning</th></tr></thead>
            <tbody>
              <tr><td><strong>1. Active</strong></td><td>The transaction has begun and is executing its read and write operations. This is where it spends nearly all its life.</td></tr>
              <tr><td><strong>2. Partially Committed</strong></td><td>The final statement has executed, but the changes may still be only in memory buffers. <strong>It is not yet safe.</strong></td></tr>
              <tr><td><strong>3. Committed</strong></td><td>The commit record has been forced to the log on disk. The changes are now <strong>permanent</strong> and will survive any crash.</td></tr>
              <tr><td><strong>4. Failed</strong></td><td>Normal execution can no longer proceed — because of an internal error, a constraint violation, or the scheduler aborting it.</td></tr>
              <tr><td><strong>5. Aborted</strong></td><td>The transaction has been rolled back and the database restored to its state before the transaction started. It may then be restarted or killed.</td></tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ Partially Committed vs Committed</div>
          <p>This is the single most-tested distinction in the diagram. <strong>Partially committed</strong> means "I have finished computing, but my changes might still be sitting in a memory buffer." A crash at that moment loses everything.</p>
          <p><strong>Committed</strong> means "my commit record is safely on disk." From that instant the change is guaranteed — that is the <em>durability</em> promise.</p>
        </div>

        <hr class="section-divider" />

        <h3>The System Log</h3>
        <div class="definition-box">
          <div class="definition-title">📌 Definition</div>
          <p>The <strong>system log</strong> (also called the journal or trail) is a sequential file kept on <strong>stable storage</strong> that records every change made to the database. If anything goes wrong, the log is the only source of truth used to repair the database.</p>
        </div>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:36%">Log Record</th><th>Meaning</th></tr></thead>
            <tbody>
              <tr><td><code>[start_transaction, T]</code></td><td>Transaction T has begun.</td></tr>
              <tr><td><code>[write_item, T, X, old_value, new_value]</code></td><td>T changed item X. <strong>Both values are recorded</strong> — the old one to UNDO with, the new one to REDO with.</td></tr>
              <tr><td><code>[read_item, T, X]</code></td><td>T read item X. Optional — not needed for recovery, only for auditing.</td></tr>
              <tr><td><code>[commit, T]</code></td><td>T completed successfully; its changes are permanent.</td></tr>
              <tr><td><code>[abort, T]</code></td><td>T was aborted; its changes must be undone.</td></tr>
              <tr><td><code>[checkpoint]</code></td><td>All buffers have been flushed to disk; everything before this point is safe.</td></tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 Why the Log Stores BOTH Old and New Values</div>
          <div class="formula-strip">old_value → used to UNDO &nbsp;·&nbsp; new_value → used to REDO</div>
          <p>After a crash, uncommitted transactions must be undone (write the old values back) and committed transactions must be redone (write the new values again). One log record carries everything needed for either direction. Unit 6 is built entirely on this idea.</p>
        </div>

        <h3>The Commit Point</h3>
        <div class="definition-box">
          <div class="definition-title">📌 Definition</div>
          <p>A transaction reaches its <strong>commit point</strong> when all its operations have completed successfully <em>and</em> all its log records have been <strong>written to the log on disk</strong>. Only then is <code>[commit, T]</code> written and the transaction declared committed.</p>
        </div>
        <p>The rule that makes this work is <strong>Write-Ahead Logging (WAL)</strong>: the log record describing a change must reach disk <em>before</em> the changed data page does. You will meet it formally in Unit 6.</p>

        <div class="learn-box world-box">
          <div class="learn-title">🌍 What This Means at an ATM</div>
          <p>The tiny pause after you confirm a withdrawal, before the receipt prints, is largely the system <em>forcing the log to disk</em>. The machine will not dispense cash until the commit record is physically stored — because after that point, no crash, power cut or reboot can undo the fact that you were debited.</p>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"Explain the transaction states with a neat state transition diagram."</em> — very common, 6–8 marks. Draw the diagram and write one line per state.</li>
            <li><em>"What is a system log? What information does it contain?"</em> — the definition + the record types table (5 marks).</li>
            <li><em>"What is a commit point?"</em> — definition + the WAL rule (3 marks).</li>
            <li><em>"Differentiate between partially committed and committed states."</em> — buffers in memory vs log forced to disk (3 marks).</li>
          </ul>
        </div>
      </div>
      `
    },

    /* ================================================================== */
    {
      id: "u5-acid",
      title: "5.3 Desirable Properties of Transactions — ACID",
      summary: "Atomicity, Consistency, Isolation and Durability: what each guarantees, which part of the DBMS enforces it, what breaks without it, and the SQL isolation levels.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 21 (Sec. 21.3) | Silberschatz Ch. 14</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p><strong>ACID</strong> is a list of four promises a database makes about every transaction. They are the reason you trust a bank's computer with your money.</p>
        </div>

        <div class="svg-figure">
          <svg viewBox="0 0 840 250" role="img" aria-label="The four ACID properties summarised">
            <rect x="20" y="30" width="190" height="180" rx="12" fill="rgba(99,102,241,0.14)" stroke="#6366f1" stroke-width="2"/>
            <text x="115" y="64" text-anchor="middle" font-size="34" font-weight="800" fill="#6366f1">A</text>
            <text x="115" y="92" text-anchor="middle" font-size="15" font-weight="700">Atomicity</text>
            <text x="115" y="122" text-anchor="middle" font-size="12" class="svg-muted">All or nothing.</text>
            <text x="115" y="142" text-anchor="middle" font-size="12" class="svg-muted">A transaction either</text>
            <text x="115" y="160" text-anchor="middle" font-size="12" class="svg-muted">fully happens or</text>
            <text x="115" y="178" text-anchor="middle" font-size="12" class="svg-muted">not at all.</text>
            <text x="115" y="200" text-anchor="middle" font-size="10" font-weight="700" fill="#6366f1">Recovery Manager</text>

            <rect x="226" y="30" width="190" height="180" rx="12" fill="rgba(16,185,129,0.14)" stroke="#10b981" stroke-width="2"/>
            <text x="321" y="64" text-anchor="middle" font-size="34" font-weight="800" fill="#10b981">C</text>
            <text x="321" y="92" text-anchor="middle" font-size="15" font-weight="700">Consistency</text>
            <text x="321" y="122" text-anchor="middle" font-size="12" class="svg-muted">Valid state in,</text>
            <text x="321" y="142" text-anchor="middle" font-size="12" class="svg-muted">valid state out.</text>
            <text x="321" y="160" text-anchor="middle" font-size="12" class="svg-muted">All constraints</text>
            <text x="321" y="178" text-anchor="middle" font-size="12" class="svg-muted">still hold.</text>
            <text x="321" y="200" text-anchor="middle" font-size="10" font-weight="700" fill="#10b981">Programmer + DBMS</text>

            <rect x="432" y="30" width="190" height="180" rx="12" fill="rgba(6,182,212,0.14)" stroke="#06b6d4" stroke-width="2"/>
            <text x="527" y="64" text-anchor="middle" font-size="34" font-weight="800" fill="#06b6d4">I</text>
            <text x="527" y="92" text-anchor="middle" font-size="15" font-weight="700">Isolation</text>
            <text x="527" y="122" text-anchor="middle" font-size="12" class="svg-muted">Each transaction</text>
            <text x="527" y="142" text-anchor="middle" font-size="12" class="svg-muted">behaves as if it</text>
            <text x="527" y="160" text-anchor="middle" font-size="12" class="svg-muted">were running alone.</text>
            <text x="527" y="200" text-anchor="middle" font-size="10" font-weight="700" fill="#06b6d4">Concurrency Control</text>

            <rect x="638" y="30" width="190" height="180" rx="12" fill="rgba(245,158,11,0.14)" stroke="#f59e0b" stroke-width="2"/>
            <text x="733" y="64" text-anchor="middle" font-size="34" font-weight="800" fill="#f59e0b">D</text>
            <text x="733" y="92" text-anchor="middle" font-size="15" font-weight="700">Durability</text>
            <text x="733" y="122" text-anchor="middle" font-size="12" class="svg-muted">Once committed,</text>
            <text x="733" y="142" text-anchor="middle" font-size="12" class="svg-muted">changes survive</text>
            <text x="733" y="160" text-anchor="middle" font-size="12" class="svg-muted">any crash,</text>
            <text x="733" y="178" text-anchor="middle" font-size="12" class="svg-muted">forever.</text>
            <text x="733" y="200" text-anchor="middle" font-size="10" font-weight="700" fill="#f59e0b">Recovery Manager</text>
          </svg>
          <div class="figure-caption">Figure 5.4 — The four ACID properties and the DBMS component responsible for each. Naming the responsible component earns extra marks.</div>
        </div>

        <hr class="section-divider" />

        <h3>The Four Properties in Detail</h3>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:16%">Property</th><th style="width:28%">Guarantee</th><th>What Breaks Without It</th><th style="width:20%">Enforced By</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>Atomicity</strong></td>
                <td>A transaction is an indivisible unit: either all its operations are reflected in the database, or none are.</td>
                <td>A crash mid-transfer leaves money debited from A but never credited to B. <strong>Rs. 5,000 vanishes.</strong></td>
                <td>Recovery manager, using UNDO from the log</td>
              </tr>
              <tr>
                <td><strong>Consistency</strong></td>
                <td>A transaction takes the database from one valid state to another; all integrity constraints and business rules remain satisfied.</td>
                <td>Total money in the bank changes when it should not; a course references a student who does not exist.</td>
                <td>The programmer (correct transaction logic) + the DBMS (constraints)</td>
              </tr>
              <tr>
                <td><strong>Isolation</strong></td>
                <td>Concurrent transactions do not interfere; the result is as if they ran one after another.</td>
                <td>All four concurrency problems from topic 5.1 — lost updates, dirty reads, incorrect summaries, unrepeatable reads.</td>
                <td>Concurrency control (locking / timestamps)</td>
              </tr>
              <tr>
                <td><strong>Durability</strong></td>
                <td>Once committed, the changes persist permanently, even if the system crashes a millisecond later.</td>
                <td>The ATM gives you a receipt, then a power cut erases the withdrawal — or your deposit.</td>
                <td>Recovery manager, using the log and REDO</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box analogy-box">
          <div class="learn-title">🏦 All Four, Told Through One Bank Transfer</div>
          <p>You transfer Rs. 5,000 from your account to your friend's.</p>
          <ul>
            <li><strong>Atomicity:</strong> if the power fails halfway, your account is <em>not</em> debited. The whole transfer is rolled back.</li>
            <li><strong>Consistency:</strong> before and after, the total money in the two accounts combined is unchanged. Money is neither created nor destroyed.</li>
            <li><strong>Isolation:</strong> if your friend checks their balance during the transfer, they see either the old balance or the new one — never a half-finished state.</li>
            <li><strong>Durability:</strong> once the app says "transfer successful", the bank's server can catch fire and the transfer still stands when it comes back up.</li>
          </ul>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 Memory Trick</div>
          <div class="mnemonic-phrase">A = All or nothing · C = Correct state · I = Independent · D = Data survives</div>
          <p>Another useful hook for the exam: <strong>A and D are the recovery manager's job; I is the concurrency controller's job; C is shared between the programmer and the DBMS.</strong></p>
        </div>

        <h3>Atomicity With Real Numbers</h3>
        <div class="img-grid-2col">
          <div class="note-figure">
            <img src="images/tp/unit5/atomicity-failed-example.png" alt="Account A debited 10 dollars successfully but account B credit fails - partial execution, no atomicity" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 5.4a (Source: Tpoint Tech) — Without atomicity: A is debited $10 (now $20 available) but the credit to B fails. $10 has simply vanished — partial execution.</div>
          </div>
          <div class="note-figure">
            <img src="images/tp/unit5/atomicity-success-example.png" alt="Account A debited 10 dollars and account B credited 10 dollars, both successful - complete execution, atomicity" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 5.4b (Source: Tpoint Tech) — With atomicity enforced: either both the debit from A and the credit to B complete, or (on failure) neither does. Complete execution, atomicity preserved.</div>
          </div>
        </div>

        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ Atomicity vs Consistency — The Classic Confusion</div>
          <ul>
            <li><strong>Atomicity</strong> is about <em>completeness</em>: did the whole transaction run, or none of it?</li>
            <li><strong>Consistency</strong> is about <em>correctness</em>: are the rules still satisfied afterwards?</li>
          </ul>
          <p>A transaction can be perfectly atomic and still leave the database inconsistent — if the programmer wrote it wrongly, for instance debiting Rs. 5,000 and crediting Rs. 500. The DBMS enforces atomicity for you; consistency is only partly its responsibility.</p>
        </div>

        <hr class="section-divider" />

        <h3>SQL Isolation Levels — Isolation Is Adjustable</h3>
        <p>Full isolation is expensive, because it means holding locks for a long time. SQL therefore lets you choose how much isolation you want, trading safety for speed.</p>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:24%">Isolation Level</th><th>Dirty Read</th><th>Unrepeatable Read</th><th>Phantom Read</th></tr></thead>
            <tbody>
              <tr><td><strong>READ UNCOMMITTED</strong></td><td style="color:var(--accent-rose);">Possible</td><td style="color:var(--accent-rose);">Possible</td><td style="color:var(--accent-rose);">Possible</td></tr>
              <tr><td><strong>READ COMMITTED</strong></td><td style="color:var(--accent-emerald);">Prevented</td><td style="color:var(--accent-rose);">Possible</td><td style="color:var(--accent-rose);">Possible</td></tr>
              <tr><td><strong>REPEATABLE READ</strong></td><td style="color:var(--accent-emerald);">Prevented</td><td style="color:var(--accent-emerald);">Prevented</td><td style="color:var(--accent-rose);">Possible</td></tr>
              <tr><td><strong>SERIALIZABLE</strong></td><td style="color:var(--accent-emerald);">Prevented</td><td style="color:var(--accent-emerald);">Prevented</td><td style="color:var(--accent-emerald);">Prevented</td></tr>
            </tbody>
          </table>
        </div>
        <p>A <strong>phantom read</strong> is the row-level version of an unrepeatable read: you run the same query twice and <em>new rows</em> have appeared that match your condition, because another transaction inserted them.</p>

        <div class="code-block">
          <div class="code-header"><span>Setting the isolation level</span></div>
          <div class="code-content"><pre>SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

BEGIN TRANSACTION;
    UPDATE account SET balance = balance - 5000 WHERE acc_no = 'A101';
    UPDATE account SET balance = balance + 5000 WHERE acc_no = 'B202';
COMMIT;</pre></div>
        </div>
        <p><strong>SERIALIZABLE</strong> is the safest and slowest; <strong>READ COMMITTED</strong> is the default in most systems and a reasonable balance for everyday work.</p>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"Explain the ACID properties of a transaction with examples."</em> — appears in nearly every paper, 6–8 marks. Use the bank transfer for all four, and name the component enforcing each.</li>
            <li><em>"Why is the isolation property important?"</em> — because without it the four concurrency problems occur; give one as an example (4 marks).</li>
            <li><em>"Explain the isolation levels defined in SQL."</em> — the four levels table (4–5 marks).</li>
            <li><em>"Differentiate between atomicity and durability."</em> — atomicity is all-or-nothing during execution; durability is permanence after commit (3 marks).</li>
          </ul>
        </div>
      </div>
      `
    }
  ]
});
