/**
 * Unit 5 — Part 2 (final): topics 5.4 – 5.6, plus the unit intro,
 * exam corner, self-test quiz and glossary terms.
 */

appendTopics("unit-5", [

  /* ==================================================================== */
  {
    id: "u5-serializability",
    title: "5.4 Schedules & Serializability",
    summary: "Serial vs non-serial schedules, conflicting operations, conflict serializability tested with a precedence graph, view serializability, and recoverable/cascadeless/strict schedules.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 21 (Sec. 21.4, 21.5) | Silberschatz Ch. 14</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>A <strong>schedule</strong> is simply the order in which the operations of several transactions actually get executed.</p>
        <p>We know one order is always safe: run the transactions <strong>one completely after another</strong> (a <em>serial</em> schedule). It is correct, but slow.</p>
        <p>So the real question becomes: <em>"which interleaved schedules give the same result as some serial order?"</em> Those are called <strong>serializable</strong>, and they are exactly the schedules a DBMS is allowed to run.</p>
      </div>

      <div class="learn-box analogy-box">
        <div class="learn-title">🍳 Everyday Analogy</div>
        <p>Cooking two dishes. Doing dish 1 completely, then dish 2, definitely works — that is <em>serial</em>. But while the rice boils you can chop vegetables for the other dish. That is <em>interleaving</em>, and it is fine <strong>as long as the final two dishes taste the same as if you had cooked them one at a time</strong>.</p>
        <p>If interleaving makes you put salt in the wrong pot, the schedule was not serializable.</p>
      </div>

      <h3>Serial vs Non-Serial Schedules</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:24%">Type</th><th>Definition</th><th style="width:22%">Correct?</th></tr></thead>
          <tbody>
            <tr><td><strong>Serial schedule</strong></td><td>Every transaction runs from start to finish before the next begins; no interleaving.</td><td>Always correct, but wastes the CPU.</td></tr>
            <tr><td><strong>Non-serial schedule</strong></td><td>Operations of different transactions are interleaved.</td><td>Efficient, but correct <em>only if serializable</em>.</td></tr>
            <tr><td><strong>Serializable schedule</strong></td><td>A non-serial schedule whose effect is equivalent to <em>some</em> serial schedule.</td><td><strong>Correct and efficient — the goal.</strong></td></tr>
          </tbody>
        </table>
      </div>
      <p>For <em>n</em> transactions there are <em>n!</em> possible serial schedules. A schedule is serializable if it is equivalent to <strong>any one</strong> of them — it does not matter which.</p>

      <hr class="section-divider" />

      <h3>Conflicting Operations</h3>
      <div class="definition-box">
        <div class="definition-title">📌 Definition</div>
        <p>Two operations <strong>conflict</strong> if all three of these hold:</p>
        <ol>
          <li>They belong to <strong>different</strong> transactions,</li>
          <li>They access the <strong>same</strong> data item, and</li>
          <li><strong>At least one of them is a write.</strong></li>
        </ol>
      </div>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:26%">Pair (on the same item)</th><th style="width:20%">Conflict?</th><th>Why</th></tr></thead>
          <tbody>
            <tr><td><code>read(X)</code> — <code>read(X)</code></td><td style="color:var(--accent-emerald);">No</td><td>Reading changes nothing; the order does not matter.</td></tr>
            <tr><td><code>read(X)</code> — <code>write(X)</code></td><td style="color:var(--accent-rose);"><strong>Yes</strong></td><td>Reading before or after the write gives different values.</td></tr>
            <tr><td><code>write(X)</code> — <code>read(X)</code></td><td style="color:var(--accent-rose);"><strong>Yes</strong></td><td>Same reason, reversed.</td></tr>
            <tr><td><code>write(X)</code> — <code>write(X)</code></td><td style="color:var(--accent-rose);"><strong>Yes</strong></td><td>Whichever writes last determines the final value.</td></tr>
            <tr><td>Any operations on <em>different</em> items</td><td style="color:var(--accent-emerald);">No</td><td>They cannot affect each other.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 Memory Trick</div>
        <div class="formula-strip">Different transactions + Same data item + At least one WRITE = CONFLICT</div>
        <p>Only <strong>read–read</strong> is safe. Every other combination on the same item conflicts. If you remember "two reads never conflict", you can work out the rest.</p>
      </div>

      <hr class="section-divider" />

      <h3>Conflict Serializability and the Precedence Graph</h3>
      <div class="definition-box">
        <div class="definition-title">📌 Definition</div>
        <p>A schedule is <strong>conflict serializable</strong> if it can be transformed into a serial schedule by swapping <em>non-conflicting</em> adjacent operations.</p>
        <p>Rather than trying all the swaps, we test it with a <strong>precedence graph</strong> (also called a serialization graph).</p>
      </div>

      <div class="worked-example">
        <div class="we-title">📐 The Precedence Graph Algorithm</div>
        <ol class="step-list">
          <li><strong>Draw one node</strong> for every transaction in the schedule.</li>
          <li><strong>Draw an edge Tᵢ → Tⱼ</strong> whenever an operation of Tᵢ comes <em>before</em> a conflicting operation of Tⱼ in the schedule. In other words, whenever Tᵢ must come first.</li>
          <li><strong>Look for a cycle.</strong>
            <ul>
              <li><strong>No cycle</strong> → the schedule <strong>IS</strong> conflict serializable.</li>
              <li><strong>Cycle present</strong> → it is <strong>NOT</strong> conflict serializable.</li>
            </ul>
          </li>
          <li><strong>If there is no cycle,</strong> a <strong>topological sort</strong> of the graph gives the equivalent serial order.</li>
        </ol>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Worked Example 1 — A Serializable Schedule</div>
        <div class="we-question">S₁: r₁(A), w₁(A), r₂(A), w₂(A), r₁(B), w₁(B), r₂(B), w₂(B)<br>(subscripts show the transaction number)</div>
        <ol class="step-list">
          <li><strong>List the conflicting pairs on item A.</strong> w₁(A) comes before r₂(A) — a write–read conflict → edge <strong>T₁ → T₂</strong>. w₁(A) before w₂(A) → also T₁ → T₂. r₁(A) before w₂(A) → also T₁ → T₂.</li>
          <li><strong>Now item B.</strong> w₁(B) before r₂(B), and w₁(B) before w₂(B) → again <strong>T₁ → T₂</strong>.</li>
          <li><strong>Draw the graph.</strong> Two nodes, T₁ and T₂, with a single edge T₁ → T₂. Nothing goes back from T₂ to T₁.</li>
          <li><strong>Check for a cycle.</strong> There is none — the graph is a simple arrow.</li>
          <li><strong>Conclusion:</strong> the schedule <strong>is conflict serializable</strong>, and the topological order is T₁ then T₂.</li>
        </ol>
        <div class="we-answer"><strong>Answer:</strong> S₁ is conflict serializable and equivalent to the serial schedule <strong>T₁ → T₂</strong>.</div>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Worked Example 2 — A Non-Serializable Schedule</div>
        <div class="we-question">S₂: r₁(A), w₂(A), w₂(B), w₁(B)</div>
        <ol class="step-list">
          <li><strong>Item A:</strong> r₁(A) comes before w₂(A). A read followed by a write from another transaction is a conflict → edge <strong>T₁ → T₂</strong>.</li>
          <li><strong>Item B:</strong> w₂(B) comes before w₁(B). Two writes conflict → edge <strong>T₂ → T₁</strong>.</li>
          <li><strong>Draw the graph.</strong> T₁ → T₂ <em>and</em> T₂ → T₁.</li>
          <li><strong>Check for a cycle.</strong> T₁ → T₂ → T₁ is a cycle.</li>
          <li><strong>Interpret it.</strong> The graph is saying "T₁ must run before T₂" <em>and</em> "T₂ must run before T₁" — an impossible requirement. No serial order can produce this result.</li>
        </ol>
        <div class="we-answer"><strong>Answer:</strong> S₂ is <strong>not</strong> conflict serializable, because the precedence graph contains the cycle T₁ → T₂ → T₁.</div>
      </div>

      <div class="svg-figure">
        <svg viewBox="0 0 700 220" role="img" aria-label="Two precedence graphs, one acyclic and one with a cycle">
          <defs>
            <marker id="u5pg1" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="#10b981"/></marker>
            <marker id="u5pg2" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0,0 L10,4 L0,8 Z" fill="#f43f5e"/></marker>
          </defs>

          <text x="170" y="28" text-anchor="middle" font-size="14" font-weight="700" fill="#10b981">No cycle → SERIALIZABLE</text>
          <circle cx="96" cy="110" r="34" fill="rgba(16,185,129,0.18)" stroke="#10b981" stroke-width="2"/>
          <text x="96" y="116" text-anchor="middle" font-size="15" font-weight="700">T₁</text>
          <circle cx="248" cy="110" r="34" fill="rgba(16,185,129,0.18)" stroke="#10b981" stroke-width="2"/>
          <text x="248" y="116" text-anchor="middle" font-size="15" font-weight="700">T₂</text>
          <line x1="130" y1="110" x2="208" y2="110" stroke="#10b981" stroke-width="2.5" marker-end="url(#u5pg1)"/>
          <text x="170" y="100" text-anchor="middle" font-size="11" class="svg-muted">A, B</text>
          <text x="170" y="176" text-anchor="middle" font-size="12" class="svg-muted">Equivalent serial order:</text>
          <text x="170" y="194" text-anchor="middle" font-size="13" font-weight="700" fill="#10b981">T₁ → T₂</text>

          <line x1="350" y1="40" x2="350" y2="200" class="svg-line" stroke-width="1" stroke-dasharray="5 5"/>

          <text x="526" y="28" text-anchor="middle" font-size="14" font-weight="700" fill="#f43f5e">Cycle → NOT serializable</text>
          <circle cx="452" cy="110" r="34" fill="rgba(244,63,94,0.18)" stroke="#f43f5e" stroke-width="2"/>
          <text x="452" y="116" text-anchor="middle" font-size="15" font-weight="700">T₁</text>
          <circle cx="604" cy="110" r="34" fill="rgba(244,63,94,0.18)" stroke="#f43f5e" stroke-width="2"/>
          <text x="604" y="116" text-anchor="middle" font-size="15" font-weight="700">T₂</text>
          <path d="M 480 94 Q 528 64 576 94" fill="none" stroke="#f43f5e" stroke-width="2.5" marker-end="url(#u5pg2)"/>
          <text x="528" y="60" text-anchor="middle" font-size="11" fill="#f43f5e">A</text>
          <path d="M 576 128 Q 528 158 480 128" fill="none" stroke="#f43f5e" stroke-width="2.5" marker-end="url(#u5pg2)"/>
          <text x="528" y="176" text-anchor="middle" font-size="11" fill="#f43f5e">B</text>
          <text x="526" y="200" text-anchor="middle" font-size="12" font-weight="700" fill="#f43f5e">No serial order is possible</text>
        </svg>
        <div class="figure-caption">Figure 5.5 — The precedence graph test. One arrow between the nodes is fine; arrows in both directions form a cycle and rule the schedule out.</div>
      </div>

      <hr class="section-divider" />

      <h3>View Serializability</h3>
      <div class="definition-box">
        <div class="definition-title">📌 Definition</div>
        <p>Two schedules are <strong>view equivalent</strong> if all three conditions hold:</p>
        <ol>
          <li><strong>Initial reads match</strong> — if Tᵢ reads the initial value of X in one schedule, it does so in the other too.</li>
          <li><strong>Read-from relationships match</strong> — if Tᵢ reads a value of X written by Tⱼ in one schedule, the same is true in the other.</li>
          <li><strong>Final writes match</strong> — whichever transaction performs the last write on X does so in both schedules.</li>
        </ol>
        <p>A schedule is <strong>view serializable</strong> if it is view equivalent to some serial schedule.</p>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 The Relationship You Must State</div>
        <div class="formula-strip">Every conflict serializable schedule is view serializable, but NOT the reverse.</div>
        <p>View serializability is the <strong>broader</strong> class — it accepts some schedules that conflict serializability rejects, specifically those containing <strong>blind writes</strong> (a transaction writing an item it never read).</p>
        <p>So why is conflict serializability used in practice? Because testing for view serializability is an <strong>NP-complete</strong> problem, while the precedence-graph test is fast. DBMSs choose the test they can actually afford to run.</p>
      </div>

      <hr class="section-divider" />

      <h3>Recoverable, Cascadeless and Strict Schedules</h3>
      <p>Serializability keeps the data <em>correct</em>. These three properties keep it <em>recoverable</em> after an abort — a separate concern.</p>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:24%">Schedule Type</th><th>Rule</th><th style="width:26%">Problem It Prevents</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Recoverable</strong></td>
              <td>If Tⱼ reads a value written by Tᵢ, then Tⱼ may commit only <strong>after</strong> Tᵢ commits.</td>
              <td>Committing on the basis of data that is later rolled back — which cannot be fixed.</td>
            </tr>
            <tr>
              <td><strong>Cascadeless</strong><br>(avoids cascading rollback)</td>
              <td>A transaction may read only values written by <strong>committed</strong> transactions.</td>
              <td>One abort forcing a chain of other aborts.</td>
            </tr>
            <tr>
              <td><strong>Strict</strong></td>
              <td>A transaction may neither read nor write an item until the transaction that last wrote it has committed or aborted.</td>
              <td>Everything above, and makes recovery simple — undo is just restoring the before-image.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 The Nesting</div>
        <div class="formula-strip">Strict ⊂ Cascadeless ⊂ Recoverable</div>
        <p>Every strict schedule is cascadeless, and every cascadeless schedule is recoverable. Strict is the most restrictive and the safest — and it is exactly what <strong>Strict 2PL</strong> in the next topic produces.</p>
      </div>

      <h3>Three Schedules, Traced With Real Numbers</h3>
      <p>Each trace below follows T1 and T2 reading and writing item A, showing each transaction's private buffer alongside the actual database value.</p>
      <div class="img-grid-3col">
        <div class="note-figure">
          <img src="images/tp/unit5/schedule-irrecoverable-example.png" alt="T2 commits before T1, even though T2 read a value T1 wrote - irrecoverable schedule" class="note-img" loading="lazy" />
          <div class="figure-caption">Irrecoverable — T2 reads T1's uncommitted A and <strong>commits before T1 does</strong>. If T1 now fails, T2 cannot be undone: it already committed on a value that never became permanent.</div>
        </div>
        <div class="note-figure">
          <img src="images/tp/unit5/schedule-recoverable-example.png" alt="T1 commits, and only afterward does T2 commit - recoverable but not cascadeless" class="note-img" loading="lazy" />
          <div class="figure-caption">Recoverable (but not cascadeless) — T2 waits until <strong>T1 commits</strong> before committing itself. Safe, but T2 read A before T1's commit, so a T1 failure before that point would still force T2 to roll back too.</div>
        </div>
        <div class="note-figure">
          <img src="images/tp/unit5/schedule-cascadeless-example.png" alt="T1 commits before T2 even reads the value - cascadeless schedule" class="note-img" loading="lazy" />
          <div class="figure-caption">Cascadeless — T1 commits <strong>before</strong> T2 even reads A. T2 never sees an uncommitted value, so T1 failing can never drag T2 down with it.</div>
        </div>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"Check whether the given schedule is conflict serializable. If yes, give the equivalent serial schedule."</em> — an extremely common 6–8 mark numerical. Draw the precedence graph and show every edge with its reason.</li>
          <li><em>"What is a serializable schedule? Differentiate between conflict and view serializability."</em> — definitions, the "conflict ⊂ view" relationship, and the blind-write point (6 marks).</li>
          <li><em>"When do two operations conflict?"</em> — the three conditions (3 marks).</li>
          <li><em>"Explain recoverable and cascadeless schedules."</em> — the table + the nesting (4–5 marks).</li>
        </ul>
      </div>
    </div>
    `
  },

  /* ==================================================================== */
  {
    id: "u5-two-phase-locking",
    title: "5.5 Lock-Based Concurrency Control & Two-Phase Locking (2PL)",
    summary: "Shared and exclusive locks, the compatibility matrix, why locking alone is not enough, the two phases of 2PL and its four variants, plus deadlock, starvation and their handling.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 22 (Sec. 22.1) | Silberschatz Ch. 15</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>A <strong>lock</strong> is a claim a transaction places on a data item, saying "I am using this — wait your turn."</p>
        <p>There are two kinds, and the difference is common sense: many people can <em>read</em> a notice board at once, but only one person at a time may <em>write</em> on it.</p>
      </div>

      <h3>The Two Lock Modes</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:24%">Lock</th><th>Also Called</th><th>Permits</th><th style="width:26%">Shareable?</th></tr></thead>
          <tbody>
            <tr><td><strong>Shared (S)</strong></td><td>Read lock</td><td>Reading only</td><td><strong>Yes</strong> — many transactions may hold an S lock on the same item at once.</td></tr>
            <tr><td><strong>Exclusive (X)</strong></td><td>Write lock</td><td>Reading <em>and</em> writing</td><td><strong>No</strong> — only one transaction may hold it, and no S locks may coexist with it.</td></tr>
          </tbody>
        </table>
      </div>

      <h3>The Lock Compatibility Matrix</h3>
      <div class="svg-figure">
        <svg viewBox="0 0 560 220" role="img" aria-label="Lock compatibility matrix for shared and exclusive locks">
          <text x="280" y="26" text-anchor="middle" font-size="13" font-weight="700" class="svg-muted">Can T₂ get this lock, when T₁ already holds that one?</text>
          <rect x="180" y="44" width="140" height="42" fill="rgba(99,102,241,0.2)" stroke="#6366f1" stroke-width="1.5"/>
          <text x="250" y="70" text-anchor="middle" font-size="14" font-weight="700">T₂ wants S</text>
          <rect x="320" y="44" width="140" height="42" fill="rgba(99,102,241,0.2)" stroke="#6366f1" stroke-width="1.5"/>
          <text x="390" y="70" text-anchor="middle" font-size="14" font-weight="700">T₂ wants X</text>

          <rect x="40" y="86" width="140" height="56" fill="rgba(99,102,241,0.2)" stroke="#6366f1" stroke-width="1.5"/>
          <text x="110" y="119" text-anchor="middle" font-size="14" font-weight="700">T₁ holds S</text>
          <rect x="180" y="86" width="140" height="56" fill="rgba(16,185,129,0.22)" stroke="#10b981" stroke-width="2"/>
          <text x="250" y="113" text-anchor="middle" font-size="16" font-weight="700" fill="#10b981">✔ YES</text>
          <text x="250" y="131" text-anchor="middle" font-size="10" class="svg-muted">reads don't clash</text>
          <rect x="320" y="86" width="140" height="56" fill="rgba(244,63,94,0.22)" stroke="#f43f5e" stroke-width="2"/>
          <text x="390" y="113" text-anchor="middle" font-size="16" font-weight="700" fill="#f43f5e">✘ NO</text>
          <text x="390" y="131" text-anchor="middle" font-size="10" class="svg-muted">must wait</text>

          <rect x="40" y="142" width="140" height="56" fill="rgba(99,102,241,0.2)" stroke="#6366f1" stroke-width="1.5"/>
          <text x="110" y="175" text-anchor="middle" font-size="14" font-weight="700">T₁ holds X</text>
          <rect x="180" y="142" width="140" height="56" fill="rgba(244,63,94,0.22)" stroke="#f43f5e" stroke-width="2"/>
          <text x="250" y="169" text-anchor="middle" font-size="16" font-weight="700" fill="#f43f5e">✘ NO</text>
          <text x="250" y="187" text-anchor="middle" font-size="10" class="svg-muted">must wait</text>
          <rect x="320" y="142" width="140" height="56" fill="rgba(244,63,94,0.22)" stroke="#f43f5e" stroke-width="2"/>
          <text x="390" y="169" text-anchor="middle" font-size="16" font-weight="700" fill="#f43f5e">✘ NO</text>
          <text x="390" y="187" text-anchor="middle" font-size="10" class="svg-muted">must wait</text>
        </svg>
        <div class="figure-caption">Figure 5.7 — The lock compatibility matrix. Only <strong>shared–shared</strong> is compatible; every other combination forces a wait.</div>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 Memory Trick</div>
        <p>Only <strong>S with S</strong> is allowed. Notice this mirrors the conflict rule from topic 5.4 exactly: read–read never conflicts, everything involving a write does. Locking is simply the <em>mechanism</em> that enforces the conflict rule.</p>
      </div>

      <hr class="section-divider" />

      <h3>Why Locking Alone Is Not Enough</h3>
      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ The Problem With Naive Locking</div>
        <p>Suppose a transaction locks an item, uses it, unlocks it, then later locks a second item. Between the unlock and the next lock, <em>another transaction can slip in and change the first item</em> — and the resulting schedule may not be serializable, even though every access was properly locked.</p>
        <p><strong>Two-Phase Locking fixes this by controlling <em>when</em> locks may be released, not just requiring that they be taken.</strong></p>
      </div>

      <h3>The Two-Phase Locking (2PL) Protocol</h3>
      <div class="definition-box">
        <div class="definition-title">📌 The Rule</div>
        <p>Every transaction must issue its lock and unlock requests in two phases:</p>
        <ol>
          <li><strong>Growing (expanding) phase</strong> — the transaction may <strong>acquire</strong> locks, but may <strong>not release</strong> any.</li>
          <li><strong>Shrinking (contracting) phase</strong> — the transaction may <strong>release</strong> locks, but may <strong>not acquire</strong> any new ones.</li>
        </ol>
        <p>The moment it releases its first lock, it has entered the shrinking phase permanently. The point where it holds the most locks is called the <strong>lock point</strong>.</p>
      </div>

      <div class="svg-figure">
        <svg viewBox="0 0 700 260" role="img" aria-label="Graph of locks held over time showing the growing and shrinking phases of 2PL">
          <line x1="70" y1="210" x2="650" y2="210" class="svg-stroke" stroke-width="2"/>
          <line x1="70" y1="210" x2="70" y2="40" class="svg-stroke" stroke-width="2"/>
          <text x="360" y="240" text-anchor="middle" font-size="12" class="svg-muted">time →</text>
          <text x="30" y="125" text-anchor="middle" font-size="12" class="svg-muted" transform="rotate(-90 30 125)">locks held</text>

          <polyline points="70,210 130,180 190,150 250,120 310,70 370,70 430,110 490,150 550,180 610,210"
                    fill="none" stroke="#6366f1" stroke-width="3"/>
          <circle cx="340" cy="70" r="6" fill="#f59e0b" stroke="#f59e0b" stroke-width="2"/>
          <text x="340" y="52" text-anchor="middle" font-size="12" font-weight="700" fill="#f59e0b">LOCK POINT</text>

          <rect x="70" y="220" width="270" height="4" fill="#10b981"/>
          <text x="205" y="256" text-anchor="middle" font-size="13" font-weight="700" fill="#10b981">GROWING — acquire only</text>
          <rect x="340" y="220" width="270" height="4" fill="#f43f5e"/>
          <text x="475" y="256" text-anchor="middle" font-size="13" font-weight="700" fill="#f43f5e">SHRINKING — release only</text>

          <text x="150" y="150" font-size="11" class="svg-muted">lock(A)</text>
          <text x="210" y="122" font-size="11" class="svg-muted">lock(B)</text>
          <text x="430" y="96" font-size="11" class="svg-muted">unlock(A)</text>
          <text x="500" y="136" font-size="11" class="svg-muted">unlock(B)</text>
        </svg>
        <div class="figure-caption">Figure 5.8 (based on E&amp;N Fig. 22.4) — Locks held over time under 2PL. Once the curve starts falling it can never rise again.</div>
      </div>

      <div class="note-figure">
        <img src="images/tp/unit5/two-phase-locking-graph.png" alt="Simple trapezoid graph: lock is attained, held flat, then released, plotted against time from T Begin to T End" class="note-img" loading="lazy" />
        <div class="figure-caption">Figure 5.8b (Source: Tpoint Tech) — The same shape drawn simply: locks rise during the growing phase, plateau, then fall during the shrinking phase — never the other way round.</div>
      </div>

      <div class="learn-box world-box">
        <div class="learn-title">🌍 The Guarantee 2PL Gives</div>
        <p><strong>If every transaction follows 2PL, then every resulting schedule is conflict serializable.</strong> That is the theorem, and it is why 2PL is the most widely used concurrency control protocol in the world.</p>
        <p>But note the direction: 2PL <em>guarantees</em> serializability, yet some serializable schedules are not produced by 2PL. The protocol is <strong>sufficient, not necessary</strong> — it is a safe but slightly conservative rule.</p>
      </div>

      <div class="note-figure">
        <img src="images/tp/unit5/two-phase-locking-trace-example.png" alt="T1 and T2 lock and unlock trace: LOCK-S(A), LOCK-S(A), LOCK-X(B), UNLOCK(A), LOCK-X(C), UNLOCK(B), UNLOCK(A), UNLOCK(C)" class="note-img" loading="lazy" />
        <div class="figure-caption">Figure 5.9 (Source: Tpoint Tech) — A real lock/unlock trace obeying 2PL. Read down each column: T1 only ever unlocks (row 4 onward) after it stops locking (row 2 onward) — once it releases A at row 4, it never asks for a new lock again.</div>
      </div>

      <h3>The Four Variants of 2PL</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:22%">Variant</th><th>Rule</th><th style="width:30%">Trade-off</th></tr></thead>
          <tbody>
            <tr><td><strong>Basic 2PL</strong></td><td>The two phases as described above.</td><td>Guarantees serializability, but is vulnerable to <strong>cascading rollback</strong> and deadlock.</td></tr>
            <tr><td><strong>Conservative (Static) 2PL</strong></td><td>Acquire <strong>all</strong> locks <em>before</em> the transaction begins; if any is unavailable, wait and take none.</td><td><strong>Deadlock-free</strong> — but requires knowing every item in advance, and concurrency is poor.</td></tr>
            <tr><td><strong>Strict 2PL</strong></td><td>Hold all <strong>exclusive (write)</strong> locks until the transaction commits or aborts.</td><td>Prevents cascading rollback; produces strict schedules. <strong>The most commonly used in practice.</strong></td></tr>
            <tr><td><strong>Rigorous 2PL</strong></td><td>Hold <strong>all</strong> locks — shared and exclusive — until commit or abort.</td><td>Simplest to implement and reason about; slightly less concurrency than strict.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 Distinguishing Strict from Rigorous</div>
        <div class="formula-strip">Strict holds only the X locks to the end · Rigorous holds ALL locks to the end</div>
        <p>And the one deadlock-free variant is <strong>Conservative</strong>, because taking all locks at once means a transaction never holds one while waiting for another.</p>
      </div>

      <div class="img-grid-2col">
        <div class="note-figure">
          <img src="images/tp/unit5/pre-claiming-lock-graph.png" alt="Graph showing a lock attained right at T Begin and released right at T End - conservative 2PL" class="note-img" loading="lazy" />
          <div class="figure-caption">Conservative (pre-claiming) 2PL — every lock is attained right at T Begin, before any work starts, and released only at T End.</div>
        </div>
        <div class="note-figure">
          <img src="images/tp/unit5/strict-two-phase-locking-graph.png" alt="Graph showing locks attained gradually during the transaction but all released together only at commit" class="note-img" loading="lazy" />
          <div class="figure-caption">Strict 2PL — locks are attained gradually as the transaction needs them, but every one is held until the transaction commits, then released together.</div>
        </div>
      </div>

      <hr class="section-divider" />

      <h3>Deadlock</h3>
      <div class="definition-box">
        <div class="definition-title">📌 Definition</div>
        <p>A <strong>deadlock</strong> occurs when two or more transactions are each waiting for a lock held by another, so none of them can ever proceed.</p>
      </div>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:12%">Time</th><th style="width:38%">T₁</th><th>T₂</th></tr></thead>
          <tbody>
            <tr><td>t1</td><td>lock-X(A) — granted</td><td></td></tr>
            <tr><td>t2</td><td></td><td>lock-X(B) — granted</td></tr>
            <tr><td>t3</td><td style="color:var(--accent-rose);">lock-X(B) — <strong>waits for T₂</strong></td><td></td></tr>
            <tr><td>t4</td><td></td><td style="color:var(--accent-rose);">lock-X(A) — <strong>waits for T₁</strong></td></tr>
            <tr><td colspan="3" style="text-align:center; color:var(--accent-rose);"><strong>Both wait forever — DEADLOCK</strong></td></tr>
          </tbody>
        </table>
      </div>

      <h4 style="margin-top:20px;">Handling Deadlock — Three Approaches</h4>
      <div class="grid-3col">
        <div class="feature-card">
          <h4>1. Deadlock Prevention</h4>
          <p>Design the protocol so deadlock is impossible. Methods: conservative 2PL (take all locks up front), or timestamp-based schemes:</p>
          <ul>
            <li><strong>Wait-Die</strong> — an <em>older</em> transaction waits for a younger one; a <em>younger</em> one is killed and restarted. (Non-preemptive.)</li>
            <li><strong>Wound-Wait</strong> — an <em>older</em> transaction forces the younger one to abort ("wounds" it); a <em>younger</em> one waits. (Preemptive.)</li>
          </ul>
        </div>
        <div class="feature-card">
          <h4>2. Deadlock Detection</h4>
          <p>Allow deadlocks, then find them using a <strong>wait-for graph</strong>: a node per transaction, an edge Tᵢ → Tⱼ when Tᵢ waits for a lock held by Tⱼ. <strong>A cycle means a deadlock.</strong></p>
          <p>Break it by choosing a <em>victim</em> to abort — usually the one that has done the least work or holds the fewest locks.</p>
        </div>
        <div class="feature-card">
          <h4>3. Timeout</h4>
          <p>The simplest method: if a transaction waits longer than a set time, assume deadlock and abort it.</p>
          <p>Easy to implement, but the timeout is hard to tune — too short and healthy transactions are killed, too long and the system stalls.</p>
        </div>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 Wait-Die vs Wound-Wait — Remember It This Way</div>
        <p>In both schemes, <strong>the older transaction is always favoured</strong> (older = smaller timestamp = has been waiting longest, so it deserves priority and this prevents starvation).</p>
        <ul>
          <li><strong>Wait-Die:</strong> the old one is patient — it <em>waits</em>. The young one <em>dies</em>.</li>
          <li><strong>Wound-Wait:</strong> the old one is aggressive — it <em>wounds</em> (aborts) the young one. The young one <em>waits</em>.</li>
        </ul>
        <p>The name tells you what happens to the <strong>requesting</strong> transaction in each case.</p>
      </div>

      <div class="img-grid-2col">
        <div class="note-figure">
          <img src="images/tp/unit5/deadlock-student-grade-example.png" alt="T1 holds Student and requests Grade; T2 holds Grade and requests Student - a deadlock" class="note-img" loading="lazy" />
          <div class="figure-caption">Figure 5.10a (Source: Tpoint Tech) — A concrete deadlock: T1 holds Student and requests Grade; T2 holds Grade and requests Student. Neither can ever proceed.</div>
        </div>
        <div class="note-figure">
          <img src="images/tp/unit5/wait-for-graph.png" alt="T1 waits for lock on R1 held by T2; T2 waits for lock on R2 held by T1, forming a cycle" class="note-img" loading="lazy" />
          <div class="figure-caption">Figure 5.10b (Source: Tpoint Tech) — The same situation drawn as a wait-for graph. The cycle T1 → T2 → T1 <em>is</em> the deadlock.</div>
        </div>
      </div>

      <h3>Starvation</h3>
      <div class="definition-box">
        <div class="definition-title">📌 Definition</div>
        <p><strong>Starvation</strong> occurs when a transaction waits indefinitely while others repeatedly overtake it — for example, a transaction wanting an exclusive lock while a continuous stream of readers keeps renewing shared locks.</p>
        <p><strong>Solutions:</strong> use a <strong>first-come-first-served</strong> queue for lock requests; raise the priority of a transaction the longer it waits; or, when choosing deadlock victims, avoid repeatedly picking the same transaction.</p>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ Deadlock vs Starvation</div>
        <ul>
          <li><strong>Deadlock:</strong> transactions wait for <em>each other</em> in a cycle. Nobody can ever proceed. Requires intervention.</li>
          <li><strong>Starvation:</strong> one transaction waits while others <em>do</em> proceed. The system is working; this transaction is just never scheduled.</li>
        </ul>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"Explain the two-phase locking protocol. What are its variants?"</em> — the two phases, the graph, the guarantee, and the four variants (8 marks).</li>
          <li><em>"What is a deadlock? How is it detected and prevented?"</em> — the example table, the wait-for graph, and wait-die/wound-wait (6–8 marks).</li>
          <li><em>"Differentiate between shared and exclusive locks."</em> — the compatibility matrix (3–4 marks).</li>
          <li><em>"Does 2PL guarantee serializability? Does it prevent deadlock?"</em> — yes to the first, <strong>no</strong> to the second (only conservative 2PL is deadlock-free). A favourite catch question (3 marks).</li>
        </ul>
      </div>
    </div>
    `
  },

  /* ==================================================================== */
  {
    id: "u5-timestamp-ordering",
    title: "5.6 Timestamp Ordering & Other Concurrency Control Techniques",
    summary: "The timestamp ordering protocol with read_TS and write_TS, Thomas's write rule, multiversion concurrency control, optimistic (validation) techniques, and granularity of locking.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 22 (Sec. 22.2–22.6) | Silberschatz Ch. 15</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>Locking makes transactions <em>wait</em>. <strong>Timestamp ordering</strong> takes a completely different approach: give every transaction a number when it starts, and then insist that the database behaves as if the transactions ran in <strong>numerical order</strong>.</p>
        <p>Nobody waits. If an operation would break that order, the transaction is simply <strong>aborted and restarted</strong> with a new timestamp.</p>
      </div>

      <div class="learn-box analogy-box">
        <div class="learn-title">🎫 Everyday Analogy</div>
        <p>A token queue at a bank. You take a numbered ticket on arrival. Service must happen in ticket order. If someone with ticket 47 somehow tries to be served after ticket 52 has already been dealt with, they are sent back to take a fresh ticket.</p>
      </div>

      <h3>The Three Values You Need</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:24%">Symbol</th><th>Meaning</th></tr></thead>
          <tbody>
            <tr><td><strong>TS(T)</strong></td><td>The timestamp of transaction T — assigned when it starts. An older transaction has a <em>smaller</em> timestamp.</td></tr>
            <tr><td><strong>read_TS(X)</strong></td><td>The largest timestamp among all transactions that have successfully <strong>read</strong> item X.</td></tr>
            <tr><td><strong>write_TS(X)</strong></td><td>The largest timestamp among all transactions that have successfully <strong>written</strong> item X.</td></tr>
          </tbody>
        </table>
      </div>

      <h3>The Basic Timestamp Ordering Rules</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:22%">T wants to…</th><th style="width:34%">Reject if…</th><th>Why, and What Happens</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>read(X)</strong></td>
              <td><code>TS(T) &lt; write_TS(X)</code></td>
              <td>A <em>younger</em> transaction has already overwritten X, so the value T should have read is gone. <strong>Abort T and restart it</strong> with a new timestamp. Otherwise allow it, and set <code>read_TS(X) = max(read_TS(X), TS(T))</code>.</td>
            </tr>
            <tr>
              <td><strong>write(X)</strong></td>
              <td><code>TS(T) &lt; read_TS(X)</code><br>or<br><code>TS(T) &lt; write_TS(X)</code></td>
              <td>A younger transaction has already read or written X, so T's write arrives too late and would invalidate it. <strong>Abort T and restart it.</strong> Otherwise allow it, and set <code>write_TS(X) = TS(T)</code>.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 The Rule in One Sentence</div>
        <div class="formula-strip">A transaction is aborted if it tries to do something that a YOUNGER transaction has already done.</div>
        <p>Because the younger one has already acted, letting the older one proceed would mean the database no longer reflects timestamp order. The older one must go back and take a new ticket.</p>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Worked Example</div>
        <div class="we-question">TS(T₁) = 10, TS(T₂) = 20. Initially read_TS(X) = 0 and write_TS(X) = 0. The operations occur in this order: r₂(X), w₁(X). What happens?</div>
        <ol class="step-list">
          <li><strong>r₂(X):</strong> apply the read rule — is TS(T₂) = 20 &lt; write_TS(X) = 0? No. <strong>Allowed.</strong> Update read_TS(X) = max(0, 20) = <strong>20</strong>.</li>
          <li><strong>w₁(X):</strong> apply the write rule — is TS(T₁) = 10 &lt; read_TS(X) = 20? <strong>Yes.</strong></li>
          <li><strong>Interpret it.</strong> T₂, which is younger, has already read X. If the older T₁ were now allowed to change X, T₂ would have read a value that (in timestamp order) it should never have seen.</li>
          <li><strong>Action:</strong> <strong>T₁ is aborted and restarted</strong> with a fresh, larger timestamp.</li>
        </ol>
        <div class="we-answer"><strong>Answer:</strong> r₂(X) is permitted; w₁(X) is rejected and T₁ is rolled back, because TS(T₁) &lt; read_TS(X).</div>
      </div>

      <h3>Thomas's Write Rule — An Optimisation</h3>
      <div class="learn-box simple-box">
        <div class="learn-title">💡 The Idea</div>
        <p>If the only violation is <code>TS(T) &lt; write_TS(X)</code> — meaning a younger transaction has already written a <em>newer</em> value — then T's write is simply <strong>obsolete</strong>. Nobody will ever read it, because it would immediately be replaced.</p>
        <p>So instead of aborting T, <strong>just ignore that single write</strong> and let T carry on. This is called an <em>outdated write</em>, and skipping it allows more schedules to succeed.</p>
      </div>

      <hr class="section-divider" />

      <h3>Locking vs Timestamp Ordering</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:24%">Basis</th><th>Two-Phase Locking</th><th>Timestamp Ordering</th></tr></thead>
          <tbody>
            <tr><td><strong>Approach</strong></td><td>Pessimistic — prevent conflicts by waiting.</td><td>Optimistic about waiting — detect conflicts and abort.</td></tr>
            <tr><td><strong>Transactions wait?</strong></td><td>Yes</td><td><strong>Never</strong></td></tr>
            <tr><td><strong>Deadlock possible?</strong></td><td><strong>Yes</strong></td><td><strong>No</strong> — nobody waits, so no cycle can form.</td></tr>
            <tr><td><strong>Starvation possible?</strong></td><td>Yes</td><td>Yes — a transaction may be repeatedly restarted.</td></tr>
            <tr><td><strong>Serial order produced</strong></td><td>Determined by the lock points.</td><td>Determined in advance by timestamp order.</td></tr>
            <tr><td><strong>Main cost</strong></td><td>Waiting and deadlock handling.</td><td>Wasted work from cascading restarts.</td></tr>
          </tbody>
        </table>
      </div>

      <hr class="section-divider" />

      <h3>Multiversion Concurrency Control (MVCC)</h3>
      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>Instead of overwriting a data item, the DBMS keeps <strong>several versions</strong> of it. A reader is given the version that was current when its transaction started, while a writer creates a new version.</p>
        <p>The pay-off is enormous: <strong>readers never block writers, and writers never block readers.</strong></p>
      </div>
      <div class="learn-box world-box">
        <div class="learn-title">🌍 This Is What Real Databases Use</div>
        <p>PostgreSQL, Oracle and MySQL's InnoDB engine all use MVCC. It is the reason a long-running report can run for ten minutes on a busy production database without freezing everyone else out — the report simply reads a consistent snapshot from the moment it began.</p>
        <p>The cost is storage: old versions must be kept until no transaction needs them, then cleaned up by a background process (PostgreSQL calls this <em>vacuuming</em>).</p>
      </div>

      <h3>Optimistic (Validation-Based) Concurrency Control</h3>
      <div class="learn-box simple-box">
        <div class="learn-title">💡 The Idea</div>
        <p>Assume conflicts are rare. Let transactions run with <strong>no checks at all</strong> on a private local copy, and only verify at the end. Each transaction passes through three phases:</p>
      </div>
      <div class="grid-3col">
        <div class="feature-card">
          <h4>1. Read Phase</h4>
          <p>The transaction reads from the database and performs all its updates on <strong>local copies</strong>. The real database is untouched.</p>
        </div>
        <div class="feature-card">
          <h4>2. Validation Phase</h4>
          <p>Before committing, check whether the transaction conflicted with any other that committed meanwhile. If it did, <strong>abort and restart</strong>.</p>
        </div>
        <div class="feature-card">
          <h4>3. Write Phase</h4>
          <p>If validation succeeded, copy the local updates into the actual database and commit.</p>
        </div>
      </div>
      <p><strong>Best for:</strong> read-heavy workloads where conflicts genuinely are rare. <strong>Worst for:</strong> high-contention systems, where most transactions reach validation only to be thrown away — the work is wasted late rather than avoided early.</p>

      <hr class="section-divider" />

      <h3>Granularity of Data Items</h3>
      <div class="learn-box simple-box">
        <div class="learn-title">💡 What Size Should a Lock Be?</div>
        <p>You can lock a whole database, one table, one page, one row, or one field. This choice is called <strong>granularity</strong>, and it is a direct trade-off.</p>
      </div>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:26%">Granularity</th><th>Concurrency</th><th>Locking Overhead</th></tr></thead>
          <tbody>
            <tr><td><strong>Coarse</strong> (whole table)</td><td>Low — one lock blocks everybody</td><td>Low — few locks to manage</td></tr>
            <tr><td><strong>Fine</strong> (single row or field)</td><td>High — many transactions proceed at once</td><td>High — thousands of locks to track</td></tr>
          </tbody>
        </table>
      </div>
      <p>Real systems use <strong>multiple granularity locking</strong> with a hierarchy (database → file → page → record) and <strong>intention locks</strong> (IS, IX, SIX) placed on the higher levels to record that a lock exists somewhere below — so the DBMS can tell instantly whether a table-level lock would conflict, without inspecting every row.</p>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"Explain the timestamp ordering protocol with an example."</em> — the read and write rules plus a worked trace (6–8 marks).</li>
          <li><em>"Differentiate between lock-based and timestamp-based concurrency control."</em> — the comparison table; the key point is that timestamp ordering is deadlock-free (5 marks).</li>
          <li><em>"What is Thomas's write rule?"</em> — ignore an obsolete write instead of aborting the transaction (3 marks).</li>
          <li><em>"Explain optimistic concurrency control."</em> — the three phases and when it is appropriate (5 marks).</li>
          <li><em>"What is granularity of locking?"</em> — the concurrency/overhead trade-off + intention locks (4 marks).</li>
        </ul>
      </div>
    </div>
    `
  }
]);

/* ====================================================================== */
/* Unit 5 extras                                                          */
/* ====================================================================== */

registerUnitExtras("unit-5", {
  simpleIntro: {
    heading: "What This Unit Is Really About",
    text: "<p>Units 1–4 assumed one calm user at a time. This unit asks the uncomfortable question: <strong>what happens when a thousand people use the database at once, and the power goes out halfway through?</strong></p><p>The story has three parts. First you see the <em>problems</em> — four specific ways concurrent transactions corrupt each other's data (5.1). Then you meet the <em>promises</em> the database makes to prevent them: the ACID properties, and the log and state machine that make those promises keepable (5.2, 5.3). Finally you learn the <em>mechanisms</em> — serializability as the definition of correctness (5.4), and the two great families of protocol that enforce it: locking with 2PL (5.5) and timestamp ordering (5.6).</p><p>Questions here are a mix of theory (ACID, transaction states) and numericals (test this schedule for serializability, trace these timestamps). Both types appear in every paper.</p>",
    goals: [
      "Define a transaction and explain why concurrency control is necessary.",
      "Describe all four concurrency problems with a two-transaction schedule for each.",
      "Draw the transaction state transition diagram and explain the system log.",
      "Explain the ACID properties and name the DBMS component that enforces each.",
      "Test any schedule for conflict serializability using a precedence graph.",
      "Explain recoverable, cascadeless and strict schedules.",
      "Apply the two-phase locking protocol and distinguish its four variants.",
      "Detect and prevent deadlock using wait-for graphs, wait-die and wound-wait.",
      "Apply the timestamp ordering rules and Thomas's write rule."
    ]
  },

  examCorner: {
    mustKnow: [
      "Definition of a transaction; interleaved vs parallel",
      "Lost update, dirty read, incorrect summary, unrepeatable read",
      "Types of failure (transaction, system crash, disk, concurrency, catastrophe)",
      "The five transaction states and the transition diagram",
      "System log record types; why old and new values are both stored",
      "Commit point and write-ahead logging",
      "ACID — and which component enforces each property",
      "SQL isolation levels",
      "Serial, non-serial and serializable schedules",
      "When two operations conflict",
      "Precedence graph test for conflict serializability",
      "Conflict vs view serializability; blind writes",
      "Recoverable ⊃ cascadeless ⊃ strict schedules",
      "Shared and exclusive locks; the compatibility matrix",
      "2PL: growing and shrinking phases; the four variants",
      "Deadlock: wait-for graph, wait-die, wound-wait; starvation",
      "Timestamp ordering rules; Thomas's write rule",
      "MVCC, optimistic concurrency control, granularity"
    ],
    questions: [
      {
        q: "What is a transaction? Explain the ACID properties with a suitable example.",
        marks: "8",
        a: "<p>A <strong>transaction</strong> is a logical unit of database processing consisting of one or more operations that must be executed as a single indivisible unit — all of them, or none.</p><p>Take a transfer of Rs. 5,000 from account A to account B:</p><ul><li><strong>Atomicity</strong> — either both the debit from A and the credit to B happen, or neither does. If the system crashes after the debit, the recovery manager undoes it using the log. Without atomicity, money vanishes.</li><li><strong>Consistency</strong> — the transaction takes the database from one valid state to another; the total of A + B is unchanged and all integrity constraints still hold. Ensured jointly by the programmer's correct logic and the DBMS's constraints.</li><li><strong>Isolation</strong> — concurrent transactions do not see each other's intermediate states. Someone checking B's balance sees either the old or the new value, never a half-completed transfer. Enforced by the concurrency control subsystem.</li><li><strong>Durability</strong> — once the transaction commits, its effects survive any subsequent failure, because the commit record was forced to the log on disk. Enforced by the recovery manager.</li></ul><p>Memory hook: A and D are the recovery manager's responsibility, I belongs to concurrency control, and C is shared between the programmer and the DBMS.</p>"
      },
      {
        q: "Explain the problems that arise when concurrent transactions execute without control.",
        marks: "8",
        a: "<p><strong>1. Lost update.</strong> Two transactions read the same item, both modify it, and the second write overwrites the first. If T₁ adds 500 and T₂ subtracts 200 from a balance of 1000, both reading 1000 first, the final value is 800 instead of the correct 1300 — T₁'s update is lost.</p><p><strong>2. Dirty read (temporary update).</strong> T₂ reads a value written by T₁ before T₁ commits. If T₁ then rolls back, T₂ has used a value that never officially existed. If T₂ has already committed, the error cannot be undone; forcing T₂ to abort too is called <em>cascading rollback</em>.</p><p><strong>3. Incorrect summary (inconsistent analysis).</strong> One transaction computes an aggregate while another is midway through updating records, so the summary includes some records before the update and others after. A total that should be 3000 comes out as 3500.</p><p><strong>4. Unrepeatable read.</strong> A transaction reads the same item twice and gets different values, because another transaction modified and committed it in between — so the reading transaction's own view of the database is inconsistent.</p><p>All four are prevented by enforcing the <strong>isolation</strong> property through concurrency control.</p>"
      },
      {
        q: "Explain the states of a transaction with a neat state transition diagram.",
        marks: "6",
        a: "<p>The diagram has five states: <strong>Active → Partially Committed → Committed → Terminated</strong>, with <strong>Failed → Aborted</strong> branching off.</p><ul><li><strong>Active</strong> — the initial state; the transaction is executing its read and write operations.</li><li><strong>Partially committed</strong> — the final statement has been executed, but the changes may still be in memory buffers, so they are not yet safe. A crash here loses everything.</li><li><strong>Committed</strong> — the commit record has been forced to the log on disk; the changes are now permanent and will survive any failure.</li><li><strong>Failed</strong> — normal execution can no longer proceed, because of an internal error, a constraint violation, or the scheduler aborting the transaction.</li><li><strong>Aborted</strong> — the transaction has been rolled back and the database restored to its state before it began. It may then be restarted or killed.</li></ul><p><strong>Transitions:</strong> Active → Partially committed (last statement executes); Partially committed → Committed (log forced to disk); Active or Partially committed → Failed (error); Failed → Aborted (rollback complete); Aborted → restart or kill.</p><p>The key distinction to state explicitly is <strong>partially committed vs committed</strong>: buffers still in memory versus commit record safely on disk.</p>"
      },
      {
        q: "Check whether the schedule S: r1(A), w1(A), r2(A), w2(A), r1(B), w1(B), r2(B), w2(B) is conflict serializable.",
        marks: "6",
        a: "<p><strong>Method:</strong> build the precedence graph. Draw a node per transaction, and an edge Tᵢ → Tⱼ whenever an operation of Tᵢ precedes a conflicting operation of Tⱼ. Two operations conflict if they belong to different transactions, access the same item, and at least one is a write.</p><p><strong>Conflicts on A:</strong> r₁(A) before w₂(A) → T₁ → T₂; w₁(A) before r₂(A) → T₁ → T₂; w₁(A) before w₂(A) → T₁ → T₂.</p><p><strong>Conflicts on B:</strong> r₁(B) before w₂(B) → T₁ → T₂; w₁(B) before r₂(B) → T₁ → T₂; w₁(B) before w₂(B) → T₁ → T₂.</p><p><strong>Graph:</strong> two nodes with a single edge T₁ → T₂. There is no edge from T₂ back to T₁.</p><p><strong>Conclusion:</strong> the graph is acyclic, so the schedule <strong>is conflict serializable</strong>. A topological sort gives the equivalent serial schedule <strong>T₁ followed by T₂</strong>.</p>"
      },
      {
        q: "Explain the two-phase locking protocol and its variants. Does it guarantee freedom from deadlock?",
        marks: "8",
        a: "<p><strong>2PL</strong> requires every transaction to obtain all its locks before releasing any. It has two phases:</p><ul><li><strong>Growing phase</strong> — the transaction may acquire locks but may not release any.</li><li><strong>Shrinking phase</strong> — the transaction may release locks but may not acquire new ones.</li></ul><p>The moment of maximum locks held is the <strong>lock point</strong>. <strong>Theorem:</strong> if every transaction follows 2PL, every resulting schedule is conflict serializable.</p><p><strong>Variants:</strong></p><ul><li><strong>Basic 2PL</strong> — as above; still allows cascading rollback and deadlock.</li><li><strong>Conservative (static) 2PL</strong> — acquire all locks before starting; if any is unavailable, take none and wait. <strong>Deadlock-free</strong>, but needs advance knowledge of all items and reduces concurrency.</li><li><strong>Strict 2PL</strong> — hold all exclusive locks until commit or abort; prevents cascading rollback. Most widely used in practice.</li><li><strong>Rigorous 2PL</strong> — hold all locks, shared and exclusive, until commit or abort; simplest to implement.</li></ul><p><strong>Does 2PL prevent deadlock? No.</strong> Basic, strict and rigorous 2PL are all vulnerable: T₁ can hold A and wait for B while T₂ holds B and waits for A. Only <strong>conservative 2PL</strong> is deadlock-free, because it acquires everything at once and so never holds a lock while waiting.</p>"
      },
      {
        q: "What is a deadlock? Explain the techniques used to handle it.",
        marks: "8",
        a: "<p>A <strong>deadlock</strong> is a state in which two or more transactions each wait for a lock held by another, so none can ever proceed. Example: T₁ locks A and requests B; T₂ locks B and requests A.</p><p><strong>1. Deadlock prevention</strong> — design the protocol so deadlock cannot occur:</p><ul><li><strong>Conservative 2PL</strong> — acquire all locks before starting.</li><li><strong>Wait-Die</strong> (non-preemptive) — if an older transaction requests an item held by a younger one, it <em>waits</em>; if a younger one requests an item held by an older one, it is <em>aborted (dies)</em> and restarted with the same timestamp.</li><li><strong>Wound-Wait</strong> (preemptive) — if an older transaction requests an item held by a younger one, it <em>wounds</em> (aborts) the younger; if a younger requests from an older, it <em>waits</em>.</li></ul><p>Both schemes favour older transactions, which also prevents starvation.</p><p><strong>2. Deadlock detection</strong> — allow deadlocks and detect them with a <strong>wait-for graph</strong>: a node per transaction and an edge Tᵢ → Tⱼ when Tᵢ waits for a lock held by Tⱼ. <strong>A cycle indicates a deadlock.</strong> One transaction is then chosen as the victim and aborted — normally the one that has done the least work.</p><p><strong>3. Timeout</strong> — abort any transaction that waits longer than a fixed period. Simple, but the threshold is difficult to tune.</p><p><strong>Starvation</strong> is different: a transaction waits indefinitely while others do proceed. It is solved with first-come-first-served queues, priority ageing, or avoiding repeatedly choosing the same victim.</p>"
      },
      {
        q: "Explain the timestamp ordering protocol. How does it differ from locking?",
        marks: "8",
        a: "<p>In <strong>timestamp ordering</strong>, each transaction T receives a unique timestamp TS(T) when it starts; an older transaction has a smaller timestamp. Each data item X carries <strong>read_TS(X)</strong> (the largest timestamp of any transaction that read X) and <strong>write_TS(X)</strong> (the largest that wrote X). The protocol forces the schedule to be equivalent to executing transactions in timestamp order.</p><p><strong>Read rule:</strong> if TS(T) &lt; write_TS(X), abort and restart T (a younger transaction has already overwritten the value T should see). Otherwise allow the read and set read_TS(X) = max(read_TS(X), TS(T)).</p><p><strong>Write rule:</strong> if TS(T) &lt; read_TS(X) or TS(T) &lt; write_TS(X), abort and restart T. Otherwise allow the write and set write_TS(X) = TS(T).</p><p><strong>Thomas's write rule</strong> optimises this: if the only violation is TS(T) &lt; write_TS(X), the write is merely obsolete, so it can simply be <em>ignored</em> instead of aborting T.</p><p><strong>Differences from locking:</strong></p><ul><li>Locking makes transactions <strong>wait</strong>; timestamp ordering <strong>never waits</strong> — it aborts and restarts instead.</li><li>Locking can <strong>deadlock</strong>; timestamp ordering <strong>cannot</strong>, since no transaction ever waits for another.</li><li>Under locking the serial order emerges from the lock points; under timestamp ordering it is fixed in advance by the timestamps.</li><li>Locking's cost is waiting and deadlock handling; timestamp ordering's cost is wasted work from restarts.</li></ul>"
      }
    ]
  },

  quiz: [
    {
      q: "A transaction that is executed either completely or not at all satisfies which ACID property?",
      opts: ["Atomicity", "Consistency", "Isolation", "Durability"],
      correct: 0,
      explain: "Atomicity is the all-or-nothing rule, enforced by the recovery manager using UNDO from the log."
    },
    {
      q: "Two transactions read a balance of 1000, one adds 500 and the other subtracts 200, and the final value is 800. This is the:",
      opts: ["Lost update problem", "Dirty read problem", "Unrepeatable read problem", "Phantom read problem"],
      correct: 0,
      explain: "The correct result is 1300. The second write overwrote the first because both worked from the same stale copy — the classic lost update."
    },
    {
      q: "Reading a value written by a transaction that has not yet committed is called a:",
      opts: ["Dirty read", "Lost update", "Incorrect summary", "Blind write"],
      correct: 0,
      explain: "If the writing transaction later rolls back, the reader has used a value that never officially existed — and may need to be rolled back too (cascading rollback)."
    },
    {
      q: "In which state has a transaction executed its final statement but may still have changes only in memory buffers?",
      opts: ["Partially committed", "Committed", "Active", "Aborted"],
      correct: 0,
      explain: "Only after the commit record is forced to the log on disk does the transaction become truly Committed — and durable."
    },
    {
      q: "Why does a log record store both the old and the new value of an item?",
      opts: [
        "The old value is used for UNDO and the new value for REDO",
        "To save disk space",
        "To detect deadlock",
        "To assign timestamps"
      ],
      correct: 0,
      explain: "Recovery must undo uncommitted transactions (restore old values) and redo committed ones (reapply new values). One record supports both directions."
    },
    {
      q: "Two operations conflict if they are from different transactions, access the same item, and:",
      opts: ["At least one of them is a write", "Both are reads", "Both are writes", "Neither is a write"],
      correct: 0,
      explain: "Only read–read is non-conflicting. Read–write, write–read and write–write all conflict, because the order changes the outcome."
    },
    {
      q: "A schedule is conflict serializable if its precedence graph:",
      opts: ["Has no cycle", "Has a cycle", "Has no edges", "Is fully connected"],
      correct: 0,
      explain: "A cycle means T₁ must precede T₂ and T₂ must precede T₁ at once, which no serial order can satisfy. No cycle means a topological sort gives the equivalent serial order."
    },
    {
      q: "The relationship between conflict and view serializability is:",
      opts: [
        "Every conflict serializable schedule is view serializable, but not the reverse",
        "Every view serializable schedule is conflict serializable",
        "They are exactly the same",
        "They are completely unrelated"
      ],
      correct: 0,
      explain: "View serializability is broader, accepting some schedules with blind writes. DBMSs still test for conflict serializability because testing view serializability is NP-complete."
    },
    {
      q: "Which lock combination on the same item is compatible?",
      opts: ["Shared with Shared", "Shared with Exclusive", "Exclusive with Shared", "Exclusive with Exclusive"],
      correct: 0,
      explain: "Only S–S is compatible — which mirrors the conflict rule exactly, since read–read is the only non-conflicting pair."
    },
    {
      q: "In the two-phase locking protocol, the shrinking phase is when a transaction:",
      opts: [
        "Releases locks but cannot acquire any new ones",
        "Acquires locks but cannot release any",
        "Commits its changes",
        "Waits for a deadlock to be resolved"
      ],
      correct: 0,
      explain: "Once the first lock is released the transaction is in the shrinking phase permanently. This ordering rule is exactly what guarantees conflict serializability."
    },
    {
      q: "Which variant of 2PL is guaranteed to be free of deadlock?",
      opts: ["Conservative (static) 2PL", "Basic 2PL", "Strict 2PL", "Rigorous 2PL"],
      correct: 0,
      explain: "Conservative 2PL takes every lock before starting, so a transaction never holds one lock while waiting for another — and no wait cycle can form."
    },
    {
      q: "Strict 2PL differs from rigorous 2PL in that strict 2PL holds until commit:",
      opts: ["Only exclusive locks", "All locks", "Only shared locks", "No locks"],
      correct: 0,
      explain: "Strict holds only the write locks to the end; rigorous holds shared locks too, giving slightly less concurrency but simpler reasoning."
    },
    {
      q: "A cycle in the wait-for graph indicates:",
      opts: ["A deadlock", "A serializable schedule", "Starvation", "A dirty read"],
      correct: 0,
      explain: "Don't confuse the two graphs: a cycle in the PRECEDENCE graph means non-serializable; a cycle in the WAIT-FOR graph means deadlock."
    },
    {
      q: "Under Wound-Wait, when an older transaction requests an item held by a younger one:",
      opts: [
        "The younger transaction is aborted",
        "The older transaction waits",
        "Both are aborted",
        "The request is queued forever"
      ],
      correct: 0,
      explain: "Wound-Wait is preemptive: the old one wounds the young one. In Wait-Die the old one waits instead and the young one dies. Both schemes favour older transactions."
    },
    {
      q: "In timestamp ordering, a write by T on X is rejected if:",
      opts: [
        "TS(T) < read_TS(X) or TS(T) < write_TS(X)",
        "TS(T) > read_TS(X)",
        "T holds no lock on X",
        "X has never been read"
      ],
      correct: 0,
      explain: "A younger transaction has already read or written X, so T's write arrives too late. T is aborted and restarted with a new timestamp."
    },
    {
      q: "Timestamp ordering is free from deadlock because:",
      opts: [
        "Transactions never wait — they are aborted and restarted instead",
        "It uses only shared locks",
        "Each transaction locks everything in advance",
        "It allows only serial schedules"
      ],
      correct: 0,
      explain: "Deadlock needs a cycle of transactions waiting for each other. With no waiting there can be no cycle — though starvation from repeated restarts is still possible."
    }
  ]
});

registerGlossary("Unit 5", [
  ["Transaction", "A logical unit of database processing that must execute completely or not at all."],
  ["Interleaved Execution", "Rapid switching between transactions on one CPU; the source of concurrency problems."],
  ["Lost Update", "One transaction's write is overwritten by another that read a stale value."],
  ["Dirty Read", "Reading a value written by a transaction that has not yet committed."],
  ["Cascading Rollback", "One abort forcing other transactions that read its data to abort too."],
  ["Incorrect Summary", "An aggregate computed while another transaction is midway through updating records."],
  ["Unrepeatable Read", "Reading the same item twice within one transaction and getting different values."],
  ["Phantom Read", "A repeated query returning new rows inserted by another transaction."],
  ["System Log", "A sequential record on stable storage of every change, used for recovery."],
  ["Commit Point", "The moment all of a transaction's log records have been forced to disk."],
  ["Atomicity", "All operations of a transaction take effect, or none do."],
  ["Consistency", "A transaction moves the database from one valid state to another."],
  ["Isolation", "Concurrent transactions do not see each other's intermediate states."],
  ["Durability", "Committed changes survive any subsequent failure."],
  ["Schedule", "The order in which the operations of concurrent transactions are executed."],
  ["Serial Schedule", "Transactions execute one completely after another, with no interleaving."],
  ["Serializable Schedule", "An interleaved schedule whose effect equals some serial schedule."],
  ["Conflicting Operations", "Operations from different transactions on the same item where at least one is a write."],
  ["Precedence Graph", "A graph used to test conflict serializability; a cycle means not serializable."],
  ["View Serializability", "A broader equivalence based on initial reads, read-from pairs and final writes."],
  ["Blind Write", "Writing an item without having read it; accepted by view but not conflict serializability."],
  ["Recoverable Schedule", "A transaction commits only after every transaction it read from has committed."],
  ["Cascadeless Schedule", "Transactions read only values written by committed transactions."],
  ["Strict Schedule", "No item is read or written until the transaction that last wrote it ends."],
  ["Shared Lock (S)", "A read lock; several transactions may hold one on the same item."],
  ["Exclusive Lock (X)", "A write lock; only one transaction may hold it, with no shared locks alongside."],
  ["Two-Phase Locking", "A protocol with a growing phase (acquire only) and a shrinking phase (release only)."],
  ["Lock Point", "The instant at which a transaction holds its maximum number of locks."],
  ["Strict 2PL", "2PL that holds all exclusive locks until commit or abort; prevents cascading rollback."],
  ["Conservative 2PL", "2PL that acquires all locks before starting; the only deadlock-free variant."],
  ["Deadlock", "Two or more transactions each waiting for a lock held by another, so none can proceed."],
  ["Wait-For Graph", "A graph of which transaction waits for which; a cycle indicates a deadlock."],
  ["Wait-Die", "Deadlock prevention in which the older transaction waits and the younger is aborted."],
  ["Wound-Wait", "Deadlock prevention in which the older transaction aborts the younger, which then waits."],
  ["Starvation", "A transaction waiting indefinitely while others repeatedly proceed ahead of it."],
  ["Timestamp Ordering", "A protocol forcing the schedule to match the order in which transactions started."],
  ["Thomas's Write Rule", "Ignoring an obsolete write instead of aborting the transaction that issued it."],
  ["MVCC", "Multiversion concurrency control: keeping several versions so readers never block writers."],
  ["Optimistic Concurrency Control", "Read, validate, write phases — conflicts are checked only at commit time."],
  ["Granularity", "The size of the data item that is locked, trading concurrency against lock overhead."]
]);
