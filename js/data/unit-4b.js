/**
 * Unit 4 — Part 2: the normal forms
 *   4.3 Normalization and 1NF
 *   4.4 2NF and 3NF (including the general definitions)
 *   4.5 BCNF
 */

appendTopics("unit-4", [

  /* ==================================================================== */
  {
    id: "u4-1nf",
    title: "4.3 Normalization & First Normal Form (1NF)",
    summary: "What normalization is, why we do it, the ladder of normal forms, and 1NF: atomic values only — with both ways of removing a repeating group.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 15 (Sec. 15.3) | Silberschatz Ch. 8 | Codd (1970–74)</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p><strong>Normalization</strong> is the process of splitting one badly-designed table into several well-designed ones, so that every fact is stored exactly once.</p>
        <p>It is done in stages, called <strong>normal forms</strong>. Each stage removes one specific kind of problem, and each stage assumes the previous one is already done. You climb the ladder one rung at a time: 1NF, then 2NF, then 3NF, then BCNF.</p>
      </div>

      <div class="learn-box analogy-box">
        <div class="learn-title">🧹 Everyday Analogy</div>
        <p>Imagine one cupboard holding your clothes, kitchen utensils and books all mixed together. It "works", but finding anything is painful and you keep buying duplicates because you cannot see what you already own.</p>
        <p>Normalization is tidying: one cupboard for clothes, one for utensils, one for books — with a note saying where each thing lives. Nothing is lost; everything now has exactly one home.</p>
      </div>

      <h3>Why Normalize? The Objectives</h3>
      <ul class="styled-list">
        <li><strong>Eliminate redundancy</strong> — store each fact once and only once.</li>
        <li><strong>Eliminate the three update anomalies</strong> from topic 4.1.</li>
        <li><strong>Ensure data consistency</strong> — with one copy, copies cannot disagree.</li>
        <li><strong>Keep decompositions lossless</strong> — no information may be lost, and no spurious tuples created.</li>
        <li><strong>Simplify enforcement of integrity constraints.</strong></li>
      </ul>

      <h3>The Ladder of Normal Forms</h3>
      <div class="svg-figure">
        <svg viewBox="0 0 800 330" role="img" aria-label="The normal forms as nested levels, each removing one kind of dependency">
          <rect x="30" y="270" width="740" height="46" rx="8" fill="rgba(244,63,94,0.16)" stroke="#f43f5e" stroke-width="2"/>
          <text x="120" y="292" font-size="15" font-weight="700">Unnormalized (UNF)</text>
          <text x="120" y="309" font-size="11" class="svg-muted">repeating groups, multi-valued cells</text>

          <rect x="70" y="216" width="660" height="46" rx="8" fill="rgba(245,158,11,0.16)" stroke="#f59e0b" stroke-width="2"/>
          <text x="150" y="238" font-size="15" font-weight="700">1NF</text>
          <text x="210" y="238" font-size="12" class="svg-muted">— all values atomic, no repeating groups</text>
          <text x="150" y="255" font-size="11" class="svg-muted">removes: multi-valued cells</text>

          <rect x="110" y="162" width="580" height="46" rx="8" fill="rgba(16,185,129,0.16)" stroke="#10b981" stroke-width="2"/>
          <text x="190" y="184" font-size="15" font-weight="700">2NF</text>
          <text x="250" y="184" font-size="12" class="svg-muted">— 1NF + no partial dependency</text>
          <text x="190" y="201" font-size="11" class="svg-muted">removes: dependency on part of a composite key</text>

          <rect x="150" y="108" width="500" height="46" rx="8" fill="rgba(6,182,212,0.16)" stroke="#06b6d4" stroke-width="2"/>
          <text x="230" y="130" font-size="15" font-weight="700">3NF</text>
          <text x="290" y="130" font-size="12" class="svg-muted">— 2NF + no transitive dependency</text>
          <text x="230" y="147" font-size="11" class="svg-muted">removes: non-key determining non-key</text>

          <rect x="190" y="54" width="420" height="46" rx="8" fill="rgba(99,102,241,0.16)" stroke="#6366f1" stroke-width="2"/>
          <text x="270" y="76" font-size="15" font-weight="700">BCNF</text>
          <text x="340" y="76" font-size="12" class="svg-muted">— every determinant is a super key</text>
          <text x="270" y="93" font-size="11" class="svg-muted">the strict version of 3NF</text>

          <rect x="230" y="10" width="340" height="38" rx="8" fill="rgba(139,92,246,0.16)" stroke="#8b5cf6" stroke-width="2"/>
          <text x="310" y="34" font-size="15" font-weight="700">4NF → 5NF</text>
          <text x="400" y="34" font-size="12" class="svg-muted">— multivalued / join dependencies</text>
        </svg>
        <div class="figure-caption">Figure 4.5 — Each normal form sits inside the previous one. A relation in 3NF is automatically in 2NF and 1NF; the reverse is not true.</div>
      </div>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:12%">Form</th><th style="width:34%">Condition</th><th>Removes</th></tr></thead>
          <tbody>
            <tr><td><strong>1NF</strong></td><td>All attribute values are atomic; no repeating groups.</td><td>Multi-valued and composite cells.</td></tr>
            <tr><td><strong>2NF</strong></td><td>In 1NF, and every non-prime attribute is <em>fully</em> functionally dependent on every candidate key.</td><td><strong>Partial</strong> dependencies.</td></tr>
            <tr><td><strong>3NF</strong></td><td>In 2NF, and no non-prime attribute is transitively dependent on a candidate key.</td><td><strong>Transitive</strong> dependencies.</td></tr>
            <tr><td><strong>BCNF</strong></td><td>For every non-trivial FD X → Y, X is a super key.</td><td>Anomalies from overlapping candidate keys.</td></tr>
            <tr><td><strong>4NF</strong></td><td>In BCNF, and no non-trivial multivalued dependency.</td><td><strong>Multivalued</strong> dependencies.</td></tr>
            <tr><td><strong>5NF</strong></td><td>In 4NF, and every join dependency is implied by the candidate keys.</td><td><strong>Join</strong> dependencies.</td></tr>
          </tbody>
        </table>
      </div>

      <hr class="section-divider" />

      <h3>First Normal Form (1NF)</h3>
      <div class="definition-box">
        <div class="definition-title">📌 Definition</div>
        <p>A relation is in <strong>1NF</strong> if every attribute value is <strong>atomic</strong> — a single, indivisible value. There must be no repeating groups, no multi-valued cells, no nested relations, and no arrays inside a cell.</p>
      </div>

      <div class="compare-grid">
        <div class="compare-card compare-bad">
          <h4>✘ NOT in 1NF — multi-valued cells</h4>
          <table class="syllabus-table" style="font-size:0.82rem;">
            <thead><tr><th>Roll</th><th>Name</th><th>Phone</th></tr></thead>
            <tbody>
              <tr><td>101</td><td>Ramesh</td><td>9841111, 9852222</td></tr>
              <tr><td>102</td><td>Sita</td><td>9863333</td></tr>
            </tbody>
          </table>
          <p style="margin-top:8px;">Two phone numbers crammed into one cell. You cannot search, sort or count them, and adding a third means editing a string.</p>
        </div>
        <div class="compare-card compare-bad">
          <h4>✘ NOT in 1NF — repeating group</h4>
          <table class="syllabus-table" style="font-size:0.82rem;">
            <thead><tr><th>Roll</th><th>Phone1</th><th>Phone2</th><th>Phone3</th></tr></thead>
            <tbody>
              <tr><td>101</td><td>9841111</td><td>9852222</td><td>NULL</td></tr>
              <tr><td>102</td><td>9863333</td><td>NULL</td><td>NULL</td></tr>
            </tbody>
          </table>
          <p style="margin-top:8px;">Numbered columns are just as wrong: wasteful NULLs, an arbitrary limit of three, and "find who owns 9852222" needs three separate comparisons.</p>
        </div>
      </div>

      <h3>Two Ways to Reach 1NF</h3>
      <div class="compare-grid">
        <div class="compare-card compare-good">
          <h4>✔ Method 1 — separate table (recommended)</h4>
          <p><code>STUDENT(<u>Roll</u>, Name)</code></p>
          <table class="syllabus-table" style="font-size:0.82rem;">
            <thead><tr><th>Roll</th><th>Name</th></tr></thead>
            <tbody><tr><td>101</td><td>Ramesh</td></tr><tr><td>102</td><td>Sita</td></tr></tbody>
          </table>
          <p style="margin-top:8px;"><code>PHONE(<u>Roll</u>, <u>Phone</u>)</code></p>
          <table class="syllabus-table" style="font-size:0.82rem;">
            <thead><tr><th>Roll</th><th>Phone</th></tr></thead>
            <tbody><tr><td>101</td><td>9841111</td></tr><tr><td>101</td><td>9852222</td></tr><tr><td>102</td><td>9863333</td></tr></tbody>
          </table>
          <p style="margin-top:8px;">No limit on how many phones, no NULLs, no repetition of the name. This is exactly the rule from Unit 2 topic 2.10: a multivalued attribute becomes its own table.</p>
        </div>
        <div class="compare-card compare-bad">
          <h4>△ Method 2 — repeat the row</h4>
          <table class="syllabus-table" style="font-size:0.82rem;">
            <thead><tr><th>Roll</th><th>Name</th><th>Phone</th></tr></thead>
            <tbody>
              <tr><td>101</td><td>Ramesh</td><td>9841111</td></tr>
              <tr><td>101</td><td>Ramesh</td><td>9852222</td></tr>
              <tr><td>102</td><td>Sita</td><td>9863333</td></tr>
            </tbody>
          </table>
          <p style="margin-top:8px;">Technically 1NF (every cell is atomic), but "Ramesh" is now stored twice — redundancy that 2NF will have to clean up. Acceptable as an intermediate step in an exam answer, never as a final design.</p>
        </div>
      </div>

      <div class="note-figure">
        <img src="images/tp/unit4/normalization-steps-flowchart.png" alt="Flowchart from unnormalised form through 1NF, 2NF, 3NF, BCNF, 4NF to 5NF, with the rule removed at each step" class="note-img" loading="lazy" />
        <div class="figure-caption">Figure 4.6 (Source: Tpoint Tech) — The complete normalization pipeline. You are standing at the "Remove Repeating Groups" step, turning an Unnormalised Form into 1NF.</div>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ A Third Method Your Handout Warns Against: Fixed Columns</div>
        <p>Some students try to fix a multivalued attribute by adding numbered columns instead of a new table. Given <code>EMP_SKILL(EMP_ID, Skill)</code> where Skill holds a set like "DBMS, C, C++":</p>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>EMP_ID</th><th>Skill_1</th><th>Skill_2</th><th>Skill_3</th><th>Skill_4</th><th>Skill_5</th></tr></thead>
            <tbody>
              <tr><td>14</td><td>DBMS</td><td>C</td><td>C++</td><td>-</td><td>-</td></tr>
              <tr><td>20</td><td>JAVA</td><td>C</td><td>-</td><td>-</td><td>-</td></tr>
              <tr><td>12</td><td>DBMS</td><td>HTML</td><td>VB</td><td>MS OFFICE</td><td>-</td></tr>
            </tbody>
          </table>
        </div>
        <p>This is technically 1NF — every cell is now atomic — but it is a <strong>bad</strong> design: queries like "which employees know C?" become painful (you must check five columns), and the moment somebody has a sixth skill, the table structure itself has to change. <strong>Always prefer the separate-table method</strong> (Method 2 above) in a real design.</p>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ The Composite-Attribute Question</div>
        <p>Is <code>Address = "Baneshwor, Kathmandu, Bagmati"</code> in 1NF? It depends on how you will use it.</p>
        <ul>
          <li>If you never need to query by city, treat it as one atomic text value → 1NF is satisfied.</li>
          <li>If you need "all students from Kathmandu", it is <strong>not</strong> atomic for your purposes and must be split into <code>Street</code>, <code>City</code>, <code>Province</code>.</li>
        </ul>
        <p>In an exam, state your assumption in one line. That earns the mark either way.</p>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"What is normalization? Why is it needed?"</em> — definition + the objectives list (4–5 marks).</li>
          <li><em>"Define 1NF and convert the given table into 1NF."</em> — definition + the corrected tables. Show <strong>both</strong> the before and after tables (4–5 marks).</li>
          <li><em>"What is an atomic value?"</em> — a single indivisible value that cannot meaningfully be broken down further (2 marks).</li>
        </ul>
      </div>
    </div>
    `
  },

  /* ==================================================================== */
  {
    id: "u4-2nf-3nf",
    title: "4.4 Second & Third Normal Form (2NF, 3NF) — Including the General Definitions",
    summary: "Prime vs non-prime attributes, removing partial dependencies for 2NF, removing transitive dependencies for 3NF, the general definitions based on all candidate keys, and a full worked normalization.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 15 (Sec. 15.3, 15.4) | Silberschatz Ch. 8</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>Both of these normal forms remove one specific kind of wrong dependency.</p>
        <ul>
          <li><strong>2NF</strong> asks: <em>"does any ordinary column depend on only PART of the key?"</em> If yes, split it out.</li>
          <li><strong>3NF</strong> asks: <em>"does any ordinary column depend on ANOTHER ordinary column instead of the key?"</em> If yes, split it out.</li>
        </ul>
        <p>Both fixes are the same move: take the offending dependency, put it in its own table, and leave a foreign key behind.</p>
      </div>

      <h3>First, Two Words You Must Know</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:24%">Term</th><th>Meaning</th><th style="width:30%">Example</th></tr></thead>
          <tbody>
            <tr><td><strong>Prime attribute</strong></td><td>An attribute that is part of <em>some</em> candidate key.</td><td>In <code>R(A,B,C,D)</code> with key <code>AB</code>: A and B are prime.</td></tr>
            <tr><td><strong>Non-prime attribute</strong></td><td>An attribute that is part of <em>no</em> candidate key.</td><td>C and D are non-prime.</td></tr>
          </tbody>
        </table>
      </div>
      <p>Both 2NF and 3NF are stated in terms of <strong>non-prime</strong> attributes, so identify the candidate keys first — every normalization question begins there.</p>

      <hr class="section-divider" />

      <h3>Second Normal Form (2NF)</h3>
      <div class="definition-box">
        <div class="definition-title">📌 Definition</div>
        <p>A relation is in <strong>2NF</strong> if it is in 1NF and every <strong>non-prime attribute is fully functionally dependent</strong> on every candidate key — that is, <strong>no partial dependency</strong> exists.</p>
        <p>A <em>partial dependency</em> occurs when a non-prime attribute depends on only <em>part</em> of a composite candidate key.</p>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 The 2NF Shortcut Everyone Should Know</div>
        <div class="formula-strip">If every candidate key is a SINGLE attribute, the relation is automatically in 2NF.</div>
        <p>A partial dependency means "depends on part of the key" — and a one-column key has no parts. So <strong>2NF can only be violated when the key is composite.</strong> Check that first and you save minutes in an exam.</p>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ 2NF Worked Example</div>
        <div class="we-question"><code>ENROLLMENT(<u>Roll_No</u>, <u>Course_Code</u>, Student_Name, Course_Name, Marks)</code> with FDs:<br>
        Roll_No, Course_Code → Marks &nbsp;·&nbsp; Roll_No → Student_Name &nbsp;·&nbsp; Course_Code → Course_Name</div>
        <ol class="step-list">
          <li><strong>Identify the candidate key.</strong> Only <code>{Roll_No, Course_Code}</code> determines everything, so that is the key. It is <strong>composite</strong> — so 2NF is at risk.</li>
          <li><strong>Prime attributes:</strong> Roll_No, Course_Code. <strong>Non-prime:</strong> Student_Name, Course_Name, Marks.</li>
          <li><strong>Test each non-prime attribute against the key.</strong><br>
          • <code>Marks</code> needs <em>both</em> parts (a mark is per student per course) → <strong>fully dependent</strong> ✔<br>
          • <code>Student_Name</code> is determined by <code>Roll_No</code> alone → depends on <em>half</em> the key → <strong>partial dependency</strong> ✘<br>
          • <code>Course_Name</code> is determined by <code>Course_Code</code> alone → <strong>partial dependency</strong> ✘</li>
          <li><strong>Therefore the relation is in 1NF but NOT in 2NF.</strong></li>
          <li><strong>Decompose:</strong> move each partial dependency into its own relation, keeping the determinant as that relation's key.</li>
        </ol>
        <div class="we-answer"><strong>2NF decomposition:</strong><br>
        <code>STUDENT(<u>Roll_No</u>, Student_Name)</code><br>
        <code>COURSE(<u>Course_Code</u>, Course_Name)</code><br>
        <code>ENROLLMENT(<u>Roll_No</u>, <u>Course_Code</u>, Marks)</code><br>
        Student_Name is now stored once per student instead of once per enrolment, and a course can exist before anyone enrols in it — the insertion anomaly is gone.</div>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ The Same Idea, in the Exact Form Your Handout Uses</div>
        <div class="we-question">A school stores <code>TEACHER(TEACHER_ID, SUBJECT, TEACHER_AGE)</code>. A teacher can teach multiple subjects.</div>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>TEACHER_ID</th><th>SUBJECT</th><th>TEACHER_AGE</th></tr></thead>
            <tbody>
              <tr><td>25</td><td>Chemistry</td><td>30</td></tr>
              <tr><td>25</td><td>Biology</td><td>30</td></tr>
              <tr><td>47</td><td>English</td><td>35</td></tr>
              <tr><td>83</td><td>Math</td><td>38</td></tr>
              <tr><td>83</td><td>Computer</td><td>38</td></tr>
            </tbody>
          </table>
        </div>
        <ol class="step-list">
          <li>Because a teacher can teach several subjects, the primary key is the composite <code>(TEACHER_ID, SUBJECT)</code>.</li>
          <li><code>TEACHER_AGE</code> depends only on <code>TEACHER_ID</code> — not on the full key — so this is a <strong>partial dependency</strong>, and the table violates 2NF.</li>
        </ol>
        <div class="we-answer"><strong>Decomposition:</strong><br>
        <code>TEACHER_DETAIL(<u>TEACHER_ID</u>, TEACHER_AGE)</code><br>
        <code>TEACHER_SUBJECT(<u>TEACHER_ID</u>, <u>SUBJECT</u>)</code><br>
        In TEACHER_DETAIL, TEACHER_AGE now depends completely on TEACHER_ID. In TEACHER_SUBJECT, SUBJECT depends on the full (teacher, subject) pair. Both are in 2NF.</div>
      </div>

      <hr class="section-divider" />

      <h3>Third Normal Form (3NF)</h3>
      <div class="definition-box">
        <div class="definition-title">📌 Definition</div>
        <p>A relation is in <strong>3NF</strong> if it is in 2NF and <strong>no non-prime attribute is transitively dependent</strong> on any candidate key.</p>
        <p>A <em>transitive dependency</em> is the chain <strong>Key → A → B</strong> where A is not a candidate key and B is non-prime. In plain terms: one ordinary column is determining another ordinary column.</p>
      </div>

      <div class="svg-figure">
        <svg viewBox="0 0 760 180" role="img" aria-label="A transitive dependency chain and how it is decomposed">
          <text x="380" y="22" text-anchor="middle" font-size="14" font-weight="700" fill="#f43f5e">The problem: a transitive dependency</text>
          <rect x="60" y="44" width="130" height="40" rx="6" fill="rgba(99,102,241,0.2)" stroke="#6366f1" stroke-width="2"/>
          <text x="125" y="69" text-anchor="middle" font-size="13" font-weight="700">Emp_ID</text>
          <text x="125" y="100" text-anchor="middle" font-size="10" class="svg-muted">(the key)</text>

          <line x1="190" y1="64" x2="268" y2="64" stroke="#6366f1" stroke-width="2"/>
          <polygon points="268,64 258,59 258,69" fill="#6366f1"/>
          <text x="229" y="56" text-anchor="middle" font-size="11" class="svg-muted">determines</text>

          <rect x="270" y="44" width="130" height="40" rx="6" fill="rgba(245,158,11,0.2)" stroke="#f59e0b" stroke-width="2"/>
          <text x="335" y="69" text-anchor="middle" font-size="13" font-weight="700">Dept_ID</text>
          <text x="335" y="100" text-anchor="middle" font-size="10" class="svg-muted">(not a key!)</text>

          <line x1="400" y1="64" x2="478" y2="64" stroke="#f43f5e" stroke-width="2"/>
          <polygon points="478,64 468,59 468,69" fill="#f43f5e"/>
          <text x="439" y="56" text-anchor="middle" font-size="11" fill="#f43f5e">determines</text>

          <rect x="480" y="44" width="150" height="40" rx="6" fill="rgba(244,63,94,0.2)" stroke="#f43f5e" stroke-width="2"/>
          <text x="555" y="69" text-anchor="middle" font-size="13" font-weight="700">Dept_Name</text>
          <text x="555" y="100" text-anchor="middle" font-size="10" class="svg-muted">(non-prime)</text>

          <path d="M 125 88 Q 340 150 555 88" fill="none" stroke="#f43f5e" stroke-width="2" stroke-dasharray="6 4"/>
          <text x="340" y="146" text-anchor="middle" font-size="12" font-weight="700" fill="#f43f5e">Emp_ID → Dept_Name, but only indirectly = TRANSITIVE</text>
          <text x="340" y="168" text-anchor="middle" font-size="12" class="svg-muted">Fix: break the chain — put Dept_ID → Dept_Name in its own table.</text>
        </svg>
        <div class="figure-caption">Figure 4.7 — A transitive dependency. Dept_Name is really a fact about the <em>department</em>, so it should live in a DEPARTMENT table, not in EMPLOYEE.</div>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ 3NF Worked Example</div>
        <div class="we-question"><code>EMPLOYEE(<u>Emp_ID</u>, Emp_Name, Dept_ID, Dept_Name, Dept_Head)</code> with FDs:<br>
        Emp_ID → Emp_Name, Dept_ID &nbsp;·&nbsp; Dept_ID → Dept_Name, Dept_Head</div>
        <ol class="step-list">
          <li><strong>Candidate key:</strong> Emp_ID⁺ = {Emp_ID, Emp_Name, Dept_ID, Dept_Name, Dept_Head} = all attributes → <code>Emp_ID</code> is the only candidate key.</li>
          <li><strong>Check 2NF.</strong> The key is a single attribute, so no partial dependency is possible → <strong>already in 2NF</strong> ✔</li>
          <li><strong>Check 3NF.</strong> Look for a non-key attribute determining another non-key attribute. <code>Dept_ID → Dept_Name</code> — and Dept_ID is <em>not</em> a candidate key, while Dept_Name is non-prime.</li>
          <li><strong>So the chain is</strong> <code>Emp_ID → Dept_ID → Dept_Name</code> — a <strong>transitive dependency</strong>. The relation is <strong>not in 3NF</strong>.</li>
          <li><strong>Decompose:</strong> pull the offending dependency out into its own relation, with its determinant as the primary key, and leave that determinant behind as a foreign key.</li>
        </ol>
        <div class="we-answer"><strong>3NF decomposition:</strong><br>
        <code>EMPLOYEE(<u>Emp_ID</u>, Emp_Name, <em>Dept_ID</em>)</code> — Dept_ID is now a foreign key<br>
        <code>DEPARTMENT(<u>Dept_ID</u>, Dept_Name, Dept_Head)</code><br>
        Changing a department head is now a one-row update, an empty department can be created, and deleting the last employee no longer erases the department. All three anomalies from topic 4.1 are gone.</div>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ The Same Idea, in the Exact Form Your Handout Uses</div>
        <div class="we-question"><code>EMPLOYEE_DETAIL(EMP_ID, EMP_NAME, EMP_ZIP, EMP_STATE, EMP_CITY)</code>, candidate key <code>{EMP_ID}</code>.</div>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>EMP_ID</th><th>EMP_NAME</th><th>EMP_ZIP</th><th>EMP_STATE</th><th>EMP_CITY</th></tr></thead>
            <tbody>
              <tr><td>222</td><td>Shyam</td><td>44600</td><td>Bagmati</td><td>Kathmandu</td></tr>
              <tr><td>333</td><td>Gita</td><td>33700</td><td>Gandaki</td><td>Pokhara</td></tr>
              <tr><td>444</td><td>Hari</td><td>56613</td><td>Koshi</td><td>Biratnagar</td></tr>
              <tr><td>555</td><td>Sita</td><td>32907</td><td>Lumbini</td><td>Butwal</td></tr>
            </tbody>
          </table>
        </div>
        <ol class="step-list">
          <li><code>EMP_ID → EMP_ZIP</code> (each employee has one zip code), and <code>EMP_ZIP → EMP_STATE, EMP_CITY</code> (each zip code belongs to one state and city).</li>
          <li>So <code>EMP_STATE</code> and <code>EMP_CITY</code> depend on <code>EMP_ZIP</code>, which is itself only determined by <code>EMP_ID</code> — not a candidate key. This is a <strong>transitive dependency</strong>, and the table violates 3NF.</li>
        </ol>
        <div class="we-answer"><strong>Decomposition:</strong><br>
        <code>EMPLOYEE(<u>EMP_ID</u>, EMP_NAME, EMP_ZIP)</code><br>
        <code>EMPLOYEE_ZIP(<u>EMP_ZIP</u>, EMP_STATE, EMP_CITY)</code><br>
        Now EMP_NAME and EMP_ZIP depend directly on EMP_ID, and EMP_STATE/EMP_CITY depend directly on EMP_ZIP — no non-key attribute depends on another non-key attribute, so both relations are in 3NF.</div>
      </div>

      <div class="note-figure">
        <img src="images/tp/unit4/normal-forms-decomposition-table.png" alt="A relation R decomposed step by step through 1NF, 2NF, 3NF, 4NF and 5NF, splitting into more sub-relations at each stage" class="note-img" loading="lazy" />
        <div class="figure-caption">Figure 4.8 (Source: Tpoint Tech) — The general pattern behind every normalization: one relation R keeps splitting into more sub-relations at each stage, driven by the rule shown underneath (partial dependency removed for 2NF, transitive for 3NF, and so on).</div>
      </div>

      <hr class="section-divider" />

      <h3>The General Definitions of 2NF and 3NF</h3>
      <div class="learn-box simple-box">
        <div class="learn-title">💡 Why There Are Two Definitions</div>
        <p>The definitions above are stated with respect to the <strong>primary key</strong>. That is fine when there is only one candidate key. When a relation has <em>several</em> candidate keys, the definition must consider <strong>all of them</strong> — these are the <em>general</em> definitions, and the syllabus names them explicitly.</p>
      </div>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:12%">Form</th><th style="width:40%">Definition Based on the Primary Key</th><th>General Definition (all candidate keys)</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>2NF</strong></td>
              <td>Every non-prime attribute is fully functionally dependent on the <em>primary key</em>.</td>
              <td>Every non-prime attribute is fully functionally dependent on <strong>every candidate key</strong> of R.</td>
            </tr>
            <tr>
              <td><strong>3NF</strong></td>
              <td>No non-prime attribute is transitively dependent on the <em>primary key</em>.</td>
              <td>For every non-trivial FD X → A, either <strong>X is a super key</strong>, <strong>or</strong> <strong>A is a prime attribute</strong>.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 The General 3NF Test — Use This in Exams</div>
        <div class="formula-strip">For every FD X → A: &nbsp; X is a super key &nbsp;<strong>OR</strong>&nbsp; A is prime &nbsp;⟹&nbsp; 3NF is satisfied</div>
        <p>Go through the dependencies one at a time. If <em>every</em> one passes at least one of the two tests, the relation is in 3NF. If any dependency fails both, it is not.</p>
        <p>Note the second escape clause — "or A is prime". That is the <strong>only</strong> difference between 3NF and BCNF, which drops it entirely.</p>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Complete Worked Example — UNF all the way to 3NF</div>
        <div class="we-question">Normalize <code>ORDER_DETAIL(Order_No, Order_Date, Cust_ID, Cust_Name, Cust_City, {Item_Code, Item_Name, Qty, Unit_Price})</code> where the braces show a repeating group. FDs: Order_No → Order_Date, Cust_ID; Cust_ID → Cust_Name, Cust_City; Item_Code → Item_Name, Unit_Price; (Order_No, Item_Code) → Qty.</div>
        <ol class="step-list">
          <li><strong>Step 1 — reach 1NF.</strong> The repeating group of items breaks atomicity. Flatten it so each order-item pair is one row. The key becomes the composite <code>(Order_No, Item_Code)</code>:<br>
          <code>ORDER_DETAIL(<u>Order_No</u>, <u>Item_Code</u>, Order_Date, Cust_ID, Cust_Name, Cust_City, Item_Name, Qty, Unit_Price)</code></li>
          <li><strong>Step 2 — test 2NF.</strong> The key is composite, so check every non-prime attribute:<br>
          • <code>Order_Date</code>, <code>Cust_ID</code>, <code>Cust_Name</code>, <code>Cust_City</code> ← determined by <code>Order_No</code> alone → <strong>partial</strong> ✘<br>
          • <code>Item_Name</code>, <code>Unit_Price</code> ← determined by <code>Item_Code</code> alone → <strong>partial</strong> ✘<br>
          • <code>Qty</code> ← needs both → fully dependent ✔</li>
          <li><strong>Step 3 — decompose to 2NF.</strong> Each partial dependency becomes its own relation:<br>
          <code>ORDERS(<u>Order_No</u>, Order_Date, Cust_ID, Cust_Name, Cust_City)</code><br>
          <code>ITEM(<u>Item_Code</u>, Item_Name, Unit_Price)</code><br>
          <code>ORDER_ITEM(<u>Order_No</u>, <u>Item_Code</u>, Qty)</code></li>
          <li><strong>Step 4 — test 3NF on each new relation.</strong><br>
          • <code>ITEM</code>: only FD is Item_Code → …, and Item_Code is the key ✔ in 3NF.<br>
          • <code>ORDER_ITEM</code>: only FD is (Order_No, Item_Code) → Qty, the whole key ✔ in 3NF.<br>
          • <code>ORDERS</code>: <code>Cust_ID → Cust_Name, Cust_City</code>, and Cust_ID is <em>not</em> a candidate key while Cust_Name is non-prime → <strong>transitive dependency</strong> ✘</li>
          <li><strong>Step 5 — decompose ORDERS to 3NF.</strong> Split the customer facts into their own relation:<br>
          <code>ORDERS(<u>Order_No</u>, Order_Date, <em>Cust_ID</em>)</code><br>
          <code>CUSTOMER(<u>Cust_ID</u>, Cust_Name, Cust_City)</code></li>
        </ol>
        <div class="we-answer"><strong>Final 3NF schema (four relations):</strong><br>
        <code>CUSTOMER(<u>Cust_ID</u>, Cust_Name, Cust_City)</code><br>
        <code>ORDERS(<u>Order_No</u>, Order_Date, <em>Cust_ID</em>)</code><br>
        <code>ITEM(<u>Item_Code</u>, Item_Name, Unit_Price)</code><br>
        <code>ORDER_ITEM(<u>Order_No</u>, <u>Item_Code</u>, Qty)</code><br>
        Every fact is now stored exactly once, and joining the four relations reconstructs the original data exactly.</div>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ Exam Technique for Normalization Questions</div>
        <ol>
          <li><strong>Always find the candidate keys first.</strong> Every test depends on them. Show the closure working.</li>
          <li><strong>Test the forms in order</strong> — 1NF, then 2NF, then 3NF. Do not jump straight to 3NF.</li>
          <li><strong>Name the violation explicitly:</strong> "<code>Cust_ID → Cust_Name</code> is a transitive dependency because Cust_ID is not a candidate key." That sentence is where the marks are.</li>
          <li><strong>Show the decomposed tables with keys underlined</strong> and foreign keys marked.</li>
          <li><strong>Do not over-decompose.</strong> Splitting relations that were already fine loses marks.</li>
        </ol>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"Normalize the given relation up to 3NF."</em> — the single most common question in this unit, worth 8–12 marks. Show every step.</li>
          <li><em>"Define 2NF and 3NF with examples."</em> — both definitions, plus a violating table and its fix (6 marks).</li>
          <li><em>"What is a partial dependency? What is a transitive dependency?"</em> — definition + example each (4 marks).</li>
          <li><em>"State the general definitions of 2NF and 3NF."</em> — explicitly named in the syllabus: the versions based on <em>all</em> candidate keys (4–5 marks).</li>
        </ul>
      </div>
    </div>
    `
  },

  /* ==================================================================== */
  {
    id: "u4-bcnf",
    title: "4.5 Boyce-Codd Normal Form (BCNF)",
    summary: "The strict form of 3NF: every determinant must be a super key. When 3NF is not enough, the classic overlapping-candidate-key example, and the trade-off against dependency preservation.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 15 (Sec. 15.5) | Silberschatz Ch. 8</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>3NF has a loophole. Its rule says a dependency X → A is acceptable if X is a super key <strong>or</strong> A is a prime attribute. That second escape clause lets a few awkward cases slip through and still cause anomalies.</p>
        <p><strong>BCNF simply deletes the loophole.</strong> Its rule is one line:</p>
        <div class="formula-strip">For every non-trivial FD X → Y, &nbsp; X must be a SUPER KEY. No exceptions.</div>
      </div>

      <div class="learn-box analogy-box">
        <div class="learn-title">🚦 Everyday Analogy</div>
        <p>3NF is a rule that says "you must stop at the red light, <em>unless</em> you are an ambulance". BCNF removes the exception: everybody stops. It is stricter, catches the last few problem cases — and occasionally costs you something (as you will see below), which is why 3NF is still widely used in practice.</p>
      </div>

      <h3>3NF vs BCNF Side by Side</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:20%">Basis</th><th>3NF</th><th>BCNF</th></tr></thead>
          <tbody>
            <tr><td><strong>Rule for X → A</strong></td><td>X is a super key <strong>OR</strong> A is prime</td><td>X <strong>must</strong> be a super key</td></tr>
            <tr><td><strong>Strictness</strong></td><td>Weaker</td><td>Stronger — every BCNF relation is in 3NF, but not the reverse</td></tr>
            <tr><td><strong>Redundancy</strong></td><td>A little may remain</td><td>Eliminates redundancy arising from functional dependencies</td></tr>
            <tr><td><strong>Lossless join</strong></td><td>Always achievable</td><td>Always achievable</td></tr>
            <tr><td><strong>Dependency preservation</strong></td><td><strong>Always achievable</strong></td><td><strong>Not always achievable</strong> — this is the trade-off</td></tr>
            <tr><td><strong>When they differ</strong></td><td colspan="2">Only when the relation has <strong>multiple overlapping candidate keys</strong>. Otherwise 3NF and BCNF are the same thing.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 When Do You Even Need to Check BCNF?</div>
        <p>If a relation has <strong>only one candidate key</strong>, then 3NF and BCNF are <em>equivalent</em> — pass 3NF and you have passed BCNF automatically.</p>
        <p>BCNF only becomes a separate question when there are <strong>two or more candidate keys that share an attribute</strong>. Spot that pattern and you know the question is testing BCNF.</p>
      </div>

      <hr class="section-divider" />

      <h3>The Classic Example — 3NF but Not BCNF</h3>
      <div class="worked-example">
        <div class="we-title">✍️ Worked Example</div>
        <div class="we-question"><code>CLASS(Student, Subject, Teacher)</code> with the business rules:<br>
        • Each teacher teaches exactly one subject → <strong>Teacher → Subject</strong><br>
        • For a given subject, a student is taught by exactly one teacher → <strong>(Student, Subject) → Teacher</strong><br>
        Check 3NF and BCNF.</div>
        <ol class="step-list">
          <li><strong>Find the candidate keys.</strong><br>
          • <code>(Student, Subject)⁺</code> = {Student, Subject} + Teacher = all three → super key, and neither half works alone → <strong>candidate key</strong>.<br>
          • <code>(Student, Teacher)⁺</code> = {Student, Teacher} + Subject (from Teacher → Subject) = all three → <strong>candidate key</strong>.</li>
          <li><strong>Note the overlap.</strong> The two candidate keys are <code>{Student, Subject}</code> and <code>{Student, Teacher}</code> — they share <code>Student</code>. This is the warning sign that BCNF may be violated.</li>
          <li><strong>Prime attributes:</strong> Student, Subject, Teacher — <em>all three</em> are prime. There are no non-prime attributes at all.</li>
          <li><strong>Check 3NF.</strong> 2NF holds (no non-prime attributes, so no partial dependency is possible). For 3NF, test <code>Teacher → Subject</code>: Teacher is not a super key ✘, <em>but</em> Subject <strong>is prime</strong> ✔ — so it passes via the second clause. <strong>The relation IS in 3NF.</strong></li>
          <li><strong>Check BCNF.</strong> The same dependency <code>Teacher → Subject</code> is non-trivial, and Teacher is <strong>not a super key</strong> (Teacher⁺ = {Teacher, Subject}, which misses Student). BCNF offers no escape clause → <strong>the relation is NOT in BCNF.</strong></li>
          <li><strong>Show the anomaly this causes.</strong> Suppose a new teacher, Mr. Rana, is hired to teach Physics but has no students yet. You cannot record "Rana teaches Physics" — <code>Student</code> is part of the key and cannot be NULL. That is an insertion anomaly surviving inside a 3NF relation, which is exactly why BCNF exists.</li>
          <li><strong>Decompose.</strong> Take the offending dependency into its own relation: <code>TEACHES(<u>Teacher</u>, Subject)</code>, and keep the rest: <code>STUDENT_TEACHER(<u>Student</u>, <u>Teacher</u>)</code>.</li>
        </ol>
        <div class="we-answer"><strong>Answer:</strong> CLASS is in 3NF (Subject is prime) but not in BCNF (Teacher is not a super key).<br>
        <strong>BCNF decomposition:</strong> <code>TEACHES(<u>Teacher</u>, Subject)</code> and <code>STUDENT_TEACHER(<u>Student</u>, <u>Teacher</u>)</code>.<br>
        The join is lossless because <code>Teacher</code> is a key of TEACHES. <strong>However</strong>, the dependency <code>(Student, Subject) → Teacher</code> can no longer be checked from either relation alone — so this decomposition is <strong>not dependency preserving</strong>, which is precisely the price BCNF sometimes charges.</div>
      </div>

      <div class="learn-box world-box">
        <div class="learn-title">🌍 Why Industry Often Stops at 3NF</div>
        <p>Because BCNF cannot always preserve dependencies, enforcing a lost constraint would require joining the tables back together on every insert — expensive and awkward. Most production databases therefore normalise to <strong>3NF</strong>, and go to BCNF only where the residual redundancy actually causes trouble.</p>
        <p>Some systems deliberately go the other way and <em>denormalise</em> — reintroducing redundancy on purpose to make reporting queries faster, accepting the update cost. Normalization is a tool, not a religion, and saying so in an exam answer shows understanding.</p>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ The Same Idea, in the Exact Form Your Handout Uses</div>
        <div class="we-question">A company's employees can work in more than one department: <code>EMPLOYEE(EMP_ID, EMP_COUNTRY, EMP_DEPT, DEPT_TYPE, EMP_DEPT_NO)</code>, with FDs <code>EMP_ID → EMP_COUNTRY</code> and <code>EMP_DEPT → {DEPT_TYPE, EMP_DEPT_NO}</code>.</div>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>EMP_ID</th><th>EMP_COUNTRY</th><th>EMP_DEPT</th><th>DEPT_TYPE</th><th>EMP_DEPT_NO</th></tr></thead>
            <tbody>
              <tr><td>264</td><td>Nepal</td><td>Designing</td><td>D394</td><td>283</td></tr>
              <tr><td>264</td><td>Nepal</td><td>Testing</td><td>D394</td><td>300</td></tr>
              <tr><td>364</td><td>India</td><td>Stores</td><td>D283</td><td>232</td></tr>
              <tr><td>364</td><td>India</td><td>Developing</td><td>D283</td><td>549</td></tr>
            </tbody>
          </table>
        </div>
        <ol class="step-list">
          <li>Because an employee can belong to several departments, the candidate key is the composite <code>{EMP_ID, EMP_DEPT}</code>.</li>
          <li><code>EMP_ID → EMP_COUNTRY</code> is a valid FD, but <code>EMP_ID</code> alone is <strong>not</strong> a super key (it does not determine EMP_DEPT). Likewise <code>EMP_DEPT → {DEPT_TYPE, EMP_DEPT_NO}</code>, and <code>EMP_DEPT</code> alone is not a super key either.</li>
          <li>Both determinants fail the super-key test, so the relation <strong>violates BCNF</strong>.</li>
        </ol>
        <div class="we-answer"><strong>Decomposition:</strong><br>
        <code>EMP_COUNTRY(<u>EMP_ID</u>, EMP_COUNTRY)</code><br>
        <code>EMP_DEPT(<u>EMP_DEPT</u>, DEPT_TYPE, EMP_DEPT_NO)</code><br>
        <code>EMP_DEPT_MAPPING(<u>EMP_ID</u>, <u>EMP_DEPT</u>)</code> — links employees to the departments they work in<br>
        Every determinant is now a key of its own relation, so all three are in BCNF.</div>
      </div>

      <h3>The BCNF Decomposition Algorithm</h3>
      <div class="worked-example">
        <div class="we-title">📐 Procedure</div>
        <ol class="step-list">
          <li>Find all candidate keys of R.</li>
          <li>Find a non-trivial dependency <strong>X → Y</strong> where X is <em>not</em> a super key. If none exists, R is already in BCNF — stop.</li>
          <li>Decompose R into two relations: <strong>R₁ = (X ∪ Y)</strong> and <strong>R₂ = (R − Y) ∪ X</strong> — that is, R with Y removed but X kept, so the two can be joined back.</li>
          <li>Repeat from step 1 on <strong>each</strong> resulting relation until all of them are in BCNF.</li>
          <li>The result is always <strong>lossless</strong>, because X is a key of R₁ and remains the common attribute. Dependency preservation is <em>not</em> guaranteed — check it and say so.</li>
        </ol>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"Define BCNF. Give an example of a relation that is in 3NF but not in BCNF."</em> — an extremely common 6–8 mark question. The CLASS(Student, Subject, Teacher) example above is the standard answer.</li>
          <li><em>"Differentiate between 3NF and BCNF."</em> — the comparison table, and be sure to mention that BCNF may sacrifice dependency preservation (4–5 marks).</li>
          <li><em>"Normalize the given relation to BCNF."</em> — apply the algorithm, state the candidate keys, and comment on losslessness and dependency preservation (8–10 marks).</li>
        </ul>
      </div>
    </div>
    `
  }
]);
