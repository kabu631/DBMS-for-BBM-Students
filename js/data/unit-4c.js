/**
 * Unit 4 — Part 3 (final): topics 4.6 and 4.7, plus the unit intro,
 * exam corner, self-test quiz and glossary terms.
 */

appendTopics("unit-4", [

  /* ==================================================================== */
  {
    id: "u4-4nf-5nf",
    title: "4.6 Higher Normal Forms — 4NF & 5NF",
    summary: "Multivalued dependencies and 4NF, join dependencies and 5NF (project-join normal form), and why these are rarely needed in practice.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 15 (Sec. 15.6, 15.7) | Silberschatz Ch. 8</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>1NF to BCNF all deal with <em>functional</em> dependencies — "this value determines that value". But redundancy can survive even in BCNF, caused by a different beast: two <strong>independent</strong> multi-valued facts crammed into the same table.</p>
        <p>4NF removes that. 5NF goes one step further and deals with facts that can only be reconstructed by joining three or more tables. Both are worth a few marks and are usually short questions.</p>
      </div>

      <h3>Multivalued Dependency and 4NF</h3>
      <div class="definition-box">
        <div class="definition-title">📌 Multivalued Dependency (MVD)</div>
        <p><strong>X ↠ Y</strong> ("X multi-determines Y") holds when, for each value of X, there is a <em>set</em> of Y values that is entirely <strong>independent</strong> of the other attributes of the relation.</p>
        <p>MVDs always come in pairs: if X ↠ Y holds in R(X, Y, Z), then X ↠ Z holds too.</p>
      </div>

      <div class="learn-box analogy-box">
        <div class="learn-title">📚 The Standard Example</div>
        <p>A course has a set of prescribed <strong>books</strong> and a set of assigned <strong>lecturers</strong>. The books have nothing to do with which lecturer teaches — the two lists are completely independent. Putting both in one table forces you to write every combination:</p>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>Course</th><th>Book</th><th>Lecturer</th></tr></thead>
            <tbody>
              <tr><td>DBMS</td><td>Elmasri</td><td>Sharma</td></tr>
              <tr><td>DBMS</td><td>Elmasri</td><td>Karki</td></tr>
              <tr><td>DBMS</td><td>Silberschatz</td><td>Sharma</td></tr>
              <tr><td>DBMS</td><td>Silberschatz</td><td>Karki</td></tr>
            </tbody>
          </table>
        </div>
        <p>2 books × 2 lecturers = <strong>4 rows to state 4 simple facts</strong>. Add a third book and you must add two more rows — one per lecturer — or the table becomes inconsistent. That is the MVD anomaly.</p>
      </div>

      <div class="definition-box">
        <div class="definition-title">📌 Fourth Normal Form (4NF)</div>
        <p>A relation is in <strong>4NF</strong> if it is in BCNF and, for every non-trivial multivalued dependency X ↠ Y, <strong>X is a super key</strong>.</p>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Worked Example</div>
        <div class="we-question">Is <code>COURSE_INFO(Course, Book, Lecturer)</code> in 4NF? If not, decompose it.</div>
        <ol class="step-list">
          <li><strong>Find the key.</strong> No attribute determines any other, so the only candidate key is all three attributes: <code>(Course, Book, Lecturer)</code>.</li>
          <li><strong>Check BCNF.</strong> There are no non-trivial <em>functional</em> dependencies at all, so no determinant can fail the super-key test → <strong>the relation IS in BCNF</strong>.</li>
          <li><strong>Check for MVDs.</strong> <code>Course ↠ Book</code> holds: for each course there is a set of books, independent of the lecturers. Likewise <code>Course ↠ Lecturer</code>.</li>
          <li><strong>Apply the 4NF test.</strong> Is <code>Course</code> a super key? No — Course⁺ = {Course}. The MVD is non-trivial and its left side is not a super key → <strong>not in 4NF</strong>.</li>
          <li><strong>Decompose</strong> by separating the two independent facts into their own relations.</li>
        </ol>
        <div class="we-answer"><strong>4NF decomposition:</strong><br>
        <code>COURSE_BOOK(<u>Course</u>, <u>Book</u>)</code> — 2 rows<br>
        <code>COURSE_LECTURER(<u>Course</u>, <u>Lecturer</u>)</code> — 2 rows<br>
        Four rows became four rows, but now adding a third book is <strong>one</strong> insert instead of two, and the combinatorial explosion disappears. Joining the two relations reconstructs the original table exactly, so the decomposition is lossless.</div>
      </div>

      <hr class="section-divider" />

      <h3>Join Dependency and 5NF</h3>
      <div class="definition-box">
        <div class="definition-title">📌 Definitions</div>
        <p>A <strong>join dependency</strong> exists in R if R can be decomposed into three or more relations that, when joined back together, reproduce R exactly — but <em>no decomposition into only two</em> relations does so.</p>
        <p>A relation is in <strong>5NF</strong> (also called <strong>Project-Join Normal Form, PJNF</strong>) if it is in 4NF and every join dependency in it is implied by its candidate keys.</p>
      </div>

      <div class="learn-box analogy-box">
        <div class="learn-title">🏪 The Standard Example</div>
        <p><code>SUPPLY(Supplier, Part, Project)</code> with the business rule: <em>if a supplier supplies a part, and that part is used by a project, and the supplier supplies that project, then the supplier supplies that part to that project.</em></p>
        <p>Under that rule the table can be split three ways — <code>SP(Supplier, Part)</code>, <code>PJ(Part, Project)</code>, <code>SJ(Supplier, Project)</code> — and joining all three restores the original. Splitting it only two ways loses information. That is a join dependency, and removing it is 5NF.</p>
      </div>

      <div class="learn-box world-box">
        <div class="learn-title">🌍 How Much Does This Matter in Practice?</div>
        <p>Very little. The overwhelming majority of real databases stop at <strong>3NF or BCNF</strong>. 4NF occasionally matters where independent multi-valued facts genuinely appear; genuine 5NF cases are rare enough that most working developers never meet one.</p>
        <p>Know the definitions and the two standard examples — that is exactly what the exam asks for.</p>
      </div>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:12%">Form</th><th style="width:30%">Deals With</th><th>One-Line Rule</th></tr></thead>
          <tbody>
            <tr><td><strong>BCNF</strong></td><td>Functional dependencies</td><td>Every determinant is a super key.</td></tr>
            <tr><td><strong>4NF</strong></td><td>Multivalued dependencies</td><td>In BCNF, and every non-trivial MVD has a super key on the left.</td></tr>
            <tr><td><strong>5NF</strong></td><td>Join dependencies</td><td>In 4NF, and every join dependency follows from the candidate keys.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"What is a multivalued dependency? Define 4NF with an example."</em> — the Course/Book/Lecturer table and its decomposition (5–6 marks).</li>
          <li><em>"Define 5NF / join dependency."</em> — the definition plus the SUPPLY example (3–4 marks).</li>
          <li><em>"Explain all the normal forms."</em> — a long question; give the one-line rule and one example for each of 1NF through 5NF (10 marks).</li>
        </ul>
      </div>
    </div>
    `
  },

  /* ==================================================================== */
  {
    id: "u4-decomposition",
    title: "4.7 Properties of Relational Decomposition",
    summary: "Lossless (non-additive) join and dependency preservation: what they mean, how to test for them, spurious tuples, and why BCNF sometimes forces a choice between them.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 16 (Sec. 16.2) | Silberschatz Ch. 8</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>Normalization splits tables up. But splitting can go wrong in two different ways, so every decomposition must be checked against two properties:</p>
        <ul>
          <li><strong>Lossless join</strong> — when I join the pieces back together, do I get <em>exactly</em> the original data? Not less, and crucially <strong>not more</strong>.</li>
          <li><strong>Dependency preservation</strong> — can I still enforce all my original rules by checking each new table on its own, without joining them first?</li>
        </ul>
        <p>The first is <strong>compulsory</strong>. The second is highly desirable but occasionally has to be given up.</p>
      </div>

      <hr class="section-divider" />

      <h3>Property 1 — Lossless (Non-Additive) Join</h3>
      <div class="definition-box">
        <div class="definition-title">📌 Definition</div>
        <p>A decomposition of R into R₁ and R₂ is <strong>lossless</strong> if, for every legal instance of R:</p>
        <p style="text-align:center;"><strong>R₁ ⋈ R₂ = R</strong></p>
        <p>If the join produces <em>extra</em> rows that were never in R, those are <strong>spurious tuples</strong> and the decomposition is <strong>lossy</strong>.</p>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ "Lossy" Actually Means "Gains Fake Rows"</div>
        <p>The name is misleading. A lossy decomposition does not lose rows — joining always gives you back at least what you started with. What it loses is <strong>information</strong>: the join adds rows that were never true, so you can no longer tell which of the rows are real. That is worse than losing data, because the database now lies to you.</p>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ A Lossy Decomposition — What Goes Wrong</div>
        <div class="we-question">Original <code>EMP(Name, Dept, Project)</code>:</div>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>Name</th><th>Dept</th><th>Project</th></tr></thead>
            <tbody>
              <tr><td>Ramesh</td><td>Computer</td><td>Website</td></tr>
              <tr><td>Sita</td><td>Computer</td><td>Payroll</td></tr>
            </tbody>
          </table>
        </div>
        <ol class="step-list">
          <li><strong>Decompose badly</strong> into <code>R₁(Name, Dept)</code> and <code>R₂(Dept, Project)</code>. The only common attribute is <code>Dept</code>.</li>
          <li><strong>R₁ =</strong> {(Ramesh, Computer), (Sita, Computer)}. &nbsp;<strong>R₂ =</strong> {(Computer, Website), (Computer, Payroll)}.</li>
          <li><strong>Join them on Dept.</strong> Both R₁ rows have Dept = Computer, and both R₂ rows have Dept = Computer, so every combination is produced: <strong>2 × 2 = 4 rows.</strong></li>
          <li><strong>Result:</strong> (Ramesh, Computer, Website), (Ramesh, Computer, <span style="color:var(--accent-rose)">Payroll</span>), (Sita, Computer, <span style="color:var(--accent-rose)">Website</span>), (Sita, Computer, Payroll).</li>
          <li><strong>Two of those are fabricated.</strong> Ramesh never worked on Payroll. The database now asserts something false.</li>
          <li><strong>Why it failed:</strong> the common attribute <code>Dept</code> is not a key of either relation, so it cannot pin the rows back together correctly.</li>
        </ol>
        <div class="we-answer"><strong>Lesson:</strong> decomposing on a non-key common attribute produces spurious tuples. Always test for losslessness before accepting a decomposition.</div>
      </div>

      <div class="definition-box">
        <div class="definition-title">📌 The Lossless Join Test (for two relations)</div>
        <p>A decomposition of R into R₁ and R₂ is lossless <strong>if and only if</strong> the common attributes form a key of at least one of them. Formally, at least one of these must hold:</p>
        <div class="formula-strip">(R₁ ∩ R₂) → R₁ &nbsp;&nbsp;<strong>OR</strong>&nbsp;&nbsp; (R₁ ∩ R₂) → R₂</div>
        <p>In words: the attributes shared by the two relations must functionally determine <strong>all</strong> the attributes of at least one of them.</p>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Applying the Test</div>
        <div class="we-question">R(A, B, C, D) with F = { A → B, A → C, C → D }. Is the decomposition R₁(A, B, C) and R₂(C, D) lossless?</div>
        <ol class="step-list">
          <li><strong>Find the common attributes:</strong> R₁ ∩ R₂ = {A, B, C} ∩ {C, D} = <strong>{C}</strong>.</li>
          <li><strong>Compute C⁺</strong> using F: start {C}; <code>C → D</code> adds D → {C, D}. Nothing more applies.</li>
          <li><strong>Test against R₂:</strong> does {C, D} contain all of R₂ = {C, D}? <strong>Yes</strong> — so <code>C → R₂</code> holds.</li>
          <li><strong>The condition is satisfied,</strong> so the decomposition is <strong>lossless</strong>. (We did not even need to test R₁ — either one suffices.)</li>
          <li><strong>Sanity check:</strong> C is the primary key of R₂, so each C value matches exactly one R₂ row and the join cannot multiply rows.</li>
        </ol>
        <div class="we-answer"><strong>Answer:</strong> lossless, because the common attribute C is a key of R₂.</div>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ The Same Idea, in the Exact Form Your Handout Uses — Same Table, Two Different Splits</div>
        <div class="we-question">Original table <code>R(A, B, C)</code> with <code>B → C</code>:</div>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>A</th><th>B</th><th>C</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>X</td><td>P</td></tr>
              <tr><td>2</td><td>X</td><td>P</td></tr>
              <tr><td>1</td><td>Y</td><td>Q</td></tr>
            </tbody>
          </table>
        </div>
        <div class="compare-grid">
          <div class="compare-card compare-bad">
            <h4>✘ Split into R₁(A,B) and R₂(A,C)</h4>
            <p>Common attribute: <code>A</code>. But A = 1 appears twice in R₁ (paired with X and Y) and twice in R₂ (paired with P and Q) — A is <strong>not</strong> a key of either piece.</p>
            <p>Joining back on A produces <strong>5 rows</strong>, including the fabricated (1, Y, P) and (1, X, Q) — neither ever existed in the original.</p>
            <p><strong>⟹ LOSSY</strong></p>
          </div>
          <div class="compare-card compare-good">
            <h4>✔ Split into R₁(A,B) and R₂(B,C)</h4>
            <p>Common attribute: <code>B</code>. Since <code>B → C</code> holds, each value of B (X or Y) maps to exactly one C — B <strong>is</strong> effectively a key of R₂(B,C).</p>
            <p>Joining back on B reproduces the original 3 rows <strong>exactly</strong> — nothing extra, nothing missing.</p>
            <p><strong>⟹ LOSSLESS</strong></p>
          </div>
        </div>
        <div class="we-answer"><strong>The lesson in one line:</strong> the same table can be decomposed well or badly. Losslessness depends entirely on <em>which</em> attribute you split on — always check that the shared attribute is a key of at least one side.</div>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ A Second Handout Example — Splitting on the Wrong Column</div>
        <div class="we-question">Original table <code>Employee(EmpID, EmpName, Dept)</code>, where two different employees happen to share the name "Ram":</div>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>EmpID</th><th>EmpName</th><th>Dept</th></tr></thead>
            <tbody>
              <tr><td>1</td><td>Ram</td><td>Sales</td></tr>
              <tr><td>2</td><td>Ram</td><td>HR</td></tr>
              <tr><td>3</td><td>Shyam</td><td>IT</td></tr>
            </tbody>
          </table>
        </div>
        <div class="compare-grid">
          <div class="compare-card compare-good">
            <h4>✔ Split on EmpID (a key)</h4>
            <p><code>Emp_Name(EmpID, EmpName)</code> and <code>Emp_Dept(EmpID, Dept)</code>. EmpID uniquely identifies every row, so joining back on EmpID reproduces exactly the original 3 rows.</p>
            <p><strong>⟹ LOSSLESS</strong></p>
          </div>
          <div class="compare-card compare-bad">
            <h4>✘ Split on EmpName (not a key)</h4>
            <p><code>Name_Dept(EmpName, Dept)</code> and <code>ID_Name(EmpID, EmpName)</code>. "Ram" appears twice, so joining back on EmpName produces <strong>5 rows</strong> — including (1, Ram, HR) and (2, Ram, Sales), falsely suggesting employee 1 also works in HR.</p>
            <p><strong>⟹ LOSSY</strong></p>
          </div>
        </div>
        <div class="we-answer"><strong>Rule confirmed again:</strong> EmpID uniquely determines EmpName and Dept, so splitting on EmpID is safe. EmpName does not uniquely determine EmpID (duplicate names exist), so splitting on EmpName is not.</div>
      </div>

      <div class="note-figure">
        <img src="images/tp/unit4/decomposition-lossless-dependency-tree.png" alt="Decomposition branches into Lossless Decomposition and Dependency Preserving" class="note-img" loading="lazy" />
        <div class="figure-caption">Figure 4.9 (Source: Tpoint Tech) — Every decomposition is judged against these two properties. Lossless join is compulsory; dependency preservation is desirable but, as topic 4.5 showed with BCNF, not always achievable.</div>
      </div>

      <hr class="section-divider" />

      <h3>Property 2 — Dependency Preservation</h3>
      <div class="definition-box">
        <div class="definition-title">📌 Definition</div>
        <p>A decomposition of R into R₁, R₂, …, R<sub>n</sub> is <strong>dependency preserving</strong> if the union of the dependencies that can be enforced on the individual relations is equivalent to the original set F:</p>
        <div class="formula-strip">(F₁ ∪ F₂ ∪ … ∪ F<sub>n</sub>)⁺ = F⁺</div>
        <p>Practically: every original business rule can still be checked by looking at <strong>one table at a time</strong>, with no join required.</p>
      </div>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 Why It Matters</div>
        <p>If a dependency is lost, the DBMS can no longer enforce that rule with a simple constraint. To check it, the system would have to join the tables together on <em>every single insert</em> — slow, awkward, and easy to get wrong. So bad data can creep in.</p>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ A Decomposition That Loses a Dependency</div>
        <div class="we-question">Recall <code>CLASS(Student, Subject, Teacher)</code> from topic 4.5, with F = { Teacher → Subject, (Student, Subject) → Teacher }, decomposed for BCNF into <code>TEACHES(Teacher, Subject)</code> and <code>STUDENT_TEACHER(Student, Teacher)</code>. Check both properties.</div>
        <ol class="step-list">
          <li><strong>Lossless?</strong> Common attributes = {Teacher}. Teacher⁺ = {Teacher, Subject} = all of TEACHES → the condition holds → <strong>lossless</strong> ✔</li>
          <li><strong>Which dependencies survive?</strong> <code>Teacher → Subject</code> lives entirely inside TEACHES ✔ and can be enforced there.</li>
          <li><strong>Test the second dependency.</strong> <code>(Student, Subject) → Teacher</code> involves all three attributes, but no single relation contains all three — TEACHES lacks Student, STUDENT_TEACHER lacks Subject.</li>
          <li><strong>So it cannot be checked on either relation alone</strong> → <strong>the decomposition is NOT dependency preserving</strong> ✘</li>
          <li><strong>The consequence:</strong> nothing now stops the database recording that a student is taught the same subject by two different teachers — the very rule the original design guaranteed.</li>
        </ol>
        <div class="we-answer"><strong>Answer:</strong> lossless ✔ but not dependency preserving ✘. This is the standard illustration that <strong>BCNF cannot always deliver both properties</strong>, whereas 3NF always can.</div>
      </div>

      <hr class="section-divider" />

      <h3>The Guarantee Table — Learn This</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:26%">Target Normal Form</th><th>Lossless Join</th><th>Dependency Preservation</th></tr></thead>
          <tbody>
            <tr><td><strong>3NF</strong></td><td>✔ Always achievable</td><td>✔ <strong>Always achievable</strong></td></tr>
            <tr><td><strong>BCNF</strong></td><td>✔ Always achievable</td><td>✘ <strong>Not always achievable</strong></td></tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 The Sentence That Answers Half the Exam Questions Here</div>
        <div class="formula-strip">3NF gives you both properties. BCNF gives you less redundancy, but may cost you dependency preservation.</div>
        <p>That single trade-off is why 3NF remains the practical target for most real systems, and why questions comparing 3NF with BCNF nearly always expect you to mention it.</p>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"What is lossless join decomposition? Explain with an example."</em> — the definition, the test, and the spurious-tuple example (6 marks).</li>
          <li><em>"What are spurious tuples?"</em> — rows produced by a join that were never in the original relation, caused by decomposing on a non-key attribute (3 marks).</li>
          <li><em>"Check whether the given decomposition is lossless and dependency preserving."</em> — a common 6–8 mark numerical. Show the intersection, compute its closure, then check each dependency against each relation.</li>
          <li><em>"Explain the properties of relational decomposition."</em> — both properties + the guarantee table (5–6 marks).</li>
        </ul>
      </div>
    </div>
    `
  }
]);

/* ====================================================================== */
/* Unit 4 extras                                                          */
/* ====================================================================== */

registerUnitExtras("unit-4", {
  simpleIntro: {
    heading: "What This Unit Is Really About",
    text: `<p>This unit answers one practical question: <strong>how do I know whether my table design is any good, and how do I fix it if it is not?</strong></p><p>The story runs in a straight line. First you learn to <em>spot</em> a bad design by the anomalies it causes (4.1). Then you learn the notation to <em>prove</em> it is bad — functional dependencies (4.2). Then you <em>repair</em> it in stages: 1NF makes every cell atomic, 2NF removes dependence on part of a key, 3NF removes one ordinary column depending on another, and BCNF closes 3NF's last loophole. Finally you learn the two tests that tell you whether your repair was legitimate: lossless join and dependency preservation.</p><p>Nearly every question in this unit is a <strong>numerical</strong> — you are given a relation and some dependencies and asked to work. Practise on paper: the marks are in the steps, not just the final answer.</p>
    <div class="interactive-practice-cta" style="margin: 18px 0; padding: 18px 22px; background: linear-gradient(135deg, rgba(59,130,246,0.12), rgba(168,85,247,0.12)); border: 1px solid rgba(59,130,246,0.3); border-radius: 12px; display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;">
      <div>
        <div style="font-weight: 700; color: var(--accent-blue); font-size: 1.05rem; margin-bottom: 4px;">🧩 Test Yourself: 60 Normalization Practice Problems</div>
        <div style="color: var(--text-secondary); font-size: 0.88rem;">Practise Closures, Candidate Keys, 1NF, 2NF, and 3NF step-by-step in our dedicated practice portal.</div>
      </div>
      <a href="#normalization" class="btn-primary" style="text-decoration: none; padding: 8px 18px; white-space: nowrap;">Open Normalization Portal →</a>
    </div>`,
    goals: [
      "Identify insertion, deletion and modification anomalies in a given table and explain their cause.",
      "State the four informal design guidelines.",
      "Write functional dependencies, apply Armstrong's axioms, and compute attribute closures.",
      "Find all candidate keys of a relation, and identify prime and non-prime attributes.",
      "Find the minimal (canonical) cover of a set of dependencies.",
      "Normalize any given relation step by step through 1NF, 2NF, 3NF and BCNF.",
      "State the general definitions of 2NF and 3NF based on all candidate keys.",
      "Test a decomposition for lossless join and dependency preservation."
    ]
  },

  examCorner: {
    mustKnow: [
      "The three update anomalies with examples",
      "The four informal design guidelines",
      "Functional dependency X → Y and its types",
      "Partial vs transitive vs full functional dependency",
      "Armstrong's axioms (R-A-T + 3 derived)",
      "Attribute closure X⁺ and finding candidate keys",
      "Prime vs non-prime attributes",
      "Minimal / canonical cover — the three steps",
      "1NF: atomic values",
      "2NF: no partial dependency",
      "3NF: no transitive dependency",
      "General definitions of 2NF and 3NF",
      "BCNF: every determinant is a super key",
      "3NF vs BCNF and the dependency-preservation trade-off",
      "4NF (multivalued dependency), 5NF (join dependency)",
      "Lossless join test and spurious tuples",
      "Dependency preservation"
    ],
    questions: [
      {
        q: "What are update anomalies? Explain the three types with a suitable example.",
        marks: "6",
        a: "<p><strong>Update anomalies</strong> are problems that arise when the same fact is stored redundantly in a relation, so that a single real-world change requires many row changes — or becomes impossible.</p><p>Consider <code>EMP_DEPT(Emp_ID, Emp_Name, Dept_ID, Dept_Name, Dept_Head)</code>, where the department name and head repeat for every employee of that department.</p><ul><li><strong>Insertion anomaly</strong> — a new department with no employees yet cannot be recorded, because Emp_ID is part of the primary key and cannot be NULL. The department exists in reality but not in the database.</li><li><strong>Deletion anomaly</strong> — if the last employee of a department resigns and their row is deleted, the department's name and head disappear with it. Information is lost that was never meant to be deleted.</li><li><strong>Modification anomaly</strong> — if a department head changes, every row for that department must be updated. If any is missed, the database records two different heads for one department, which is inconsistent.</li></ul><p>All three are caused by storing one fact (the department's details) many times. Decomposing into <code>EMPLOYEE(Emp_ID, Emp_Name, Dept_ID)</code> and <code>DEPARTMENT(Dept_ID, Dept_Name, Dept_Head)</code> removes all three.</p>"
      },
      {
        q: "Define functional dependency. Explain full, partial and transitive dependency with examples.",
        marks: "6",
        a: "<p>A <strong>functional dependency</strong> X → Y holds in relation R if, for any two tuples that agree on X, they must also agree on Y. X is the determinant, Y the dependent.</p><ul><li><strong>Full functional dependency</strong> — Y depends on the whole of X, and on no proper subset of it. <em>Example:</em> in ENROLLMENT(Roll_No, Course_Code, Marks), <code>{Roll_No, Course_Code} → Marks</code>, since a mark needs both.</li><li><strong>Partial dependency</strong> — a non-prime attribute depends on only part of a composite candidate key. <em>Example:</em> in the same relation, <code>Roll_No → Student_Name</code> means Student_Name depends on half the key. Removed by <strong>2NF</strong>.</li><li><strong>Transitive dependency</strong> — X → Y and Y → Z where Y is not a candidate key and Z is non-prime, so X → Z holds indirectly. <em>Example:</em> <code>Emp_ID → Dept_ID → Dept_Name</code>. Removed by <strong>3NF</strong>.</li></ul><p>A dependency is <strong>trivial</strong> if the right side is a subset of the left (e.g. <code>{A,B} → A</code>); otherwise it is non-trivial.</p>"
      },
      {
        q: "Given R(A, B, C, D, E) with F = {A → BC, CD → E, B → D, E → A}, find all candidate keys.",
        marks: "6",
        a: "<p>Use attribute closure. An attribute set X is a super key if X⁺ contains all attributes; it is a candidate key if in addition no proper subset is a super key.</p><ul><li><strong>A⁺:</strong> {A} → (A→BC) {A,B,C} → (B→D) {A,B,C,D} → (CD→E) {A,B,C,D,E}. All attributes, and A is a single attribute so it is minimal → <strong>A is a candidate key.</strong></li><li><strong>E⁺:</strong> {E} → (E→A) {A,E} → (A→BC) {A,B,C,E} → (B→D) {A,B,C,D,E}. → <strong>E is a candidate key.</strong></li><li><strong>(CD)⁺:</strong> {C,D} → (CD→E) {C,D,E} → (E→A) {A,C,D,E} → (A→BC) {A,B,C,D,E}. Check minimality: C⁺={C}, D⁺={D}, neither is a super key → <strong>CD is a candidate key.</strong></li><li><strong>B⁺:</strong> {B} → (B→D) {B,D}. Not all attributes → B alone is not a key.</li></ul><p><strong>Candidate keys: A, E and CD.</strong><br><strong>Prime attributes:</strong> {A, C, D, E}. <strong>Non-prime:</strong> {B}.</p>"
      },
      {
        q: "Normalize the relation STUDENT(Roll_No, Name, Course_Code, Course_Name, Instructor, Instructor_Dept) up to 3NF, stating the violations at each stage.",
        marks: "10",
        a: "<p><strong>FDs:</strong> Roll_No → Name; Course_Code → Course_Name, Instructor; Instructor → Instructor_Dept; (Roll_No, Course_Code) is the candidate key.</p><p><strong>1NF:</strong> assume all values are atomic → already in 1NF.</p><p><strong>2NF check:</strong> the key is composite, so look for partial dependencies.<br>• <code>Roll_No → Name</code> — Name depends on part of the key → <strong>partial dependency, violates 2NF.</strong><br>• <code>Course_Code → Course_Name, Instructor</code> — also partial → <strong>violates 2NF.</strong></p><p><strong>2NF decomposition:</strong><br><code>STUDENT(<u>Roll_No</u>, Name)</code><br><code>COURSE(<u>Course_Code</u>, Course_Name, Instructor, Instructor_Dept)</code><br><code>ENROLLMENT(<u>Roll_No</u>, <u>Course_Code</u>)</code></p><p><strong>3NF check:</strong> in COURSE, <code>Course_Code → Instructor → Instructor_Dept</code>. Instructor is not a candidate key and Instructor_Dept is non-prime → <strong>transitive dependency, violates 3NF.</strong></p><p><strong>3NF decomposition — final schema:</strong><br><code>STUDENT(<u>Roll_No</u>, Name)</code><br><code>COURSE(<u>Course_Code</u>, Course_Name, <em>Instructor</em>)</code><br><code>INSTRUCTOR(<u>Instructor</u>, Instructor_Dept)</code><br><code>ENROLLMENT(<u>Roll_No</u>, <u>Course_Code</u>)</code></p><p>Each fact is now stored once, and all three anomalies are eliminated.</p>"
      },
      {
        q: "Define BCNF. Give an example of a relation in 3NF but not in BCNF, and decompose it.",
        marks: "8",
        a: "<p>A relation is in <strong>BCNF</strong> if for every non-trivial functional dependency X → Y, <strong>X is a super key</strong>. It is stricter than 3NF, which also accepts a dependency when the right-hand attribute is prime.</p><p><strong>Example:</strong> <code>CLASS(Student, Subject, Teacher)</code> with the rules: each teacher teaches exactly one subject (<code>Teacher → Subject</code>), and for a given subject a student has exactly one teacher (<code>(Student, Subject) → Teacher</code>).</p><p><strong>Candidate keys:</strong> {Student, Subject} and {Student, Teacher}. All three attributes are therefore prime; there are no non-prime attributes.</p><p><strong>3NF?</strong> For <code>Teacher → Subject</code>: Teacher is not a super key, <em>but</em> Subject is a prime attribute, so the dependency passes 3NF's second condition → <strong>the relation is in 3NF.</strong></p><p><strong>BCNF?</strong> The same dependency <code>Teacher → Subject</code> has a determinant that is not a super key, and BCNF allows no exception → <strong>the relation is not in BCNF.</strong></p><p><strong>Decomposition:</strong> <code>TEACHES(<u>Teacher</u>, Subject)</code> and <code>STUDENT_TEACHER(<u>Student</u>, <u>Teacher</u>)</code>.</p><p>This is <strong>lossless</strong> (Teacher is a key of TEACHES) but <strong>not dependency preserving</strong>, since <code>(Student, Subject) → Teacher</code> spans both relations and can no longer be checked on either alone. This illustrates the standard 3NF/BCNF trade-off.</p>"
      },
      {
        q: "What is lossless join decomposition? How is it tested? What are spurious tuples?",
        marks: "6",
        a: "<p>A decomposition of R into R₁ and R₂ is <strong>lossless (non-additive)</strong> if joining the two relations reproduces exactly the original relation: <strong>R₁ ⋈ R₂ = R</strong>. If the join yields additional rows that were never in R, those extra rows are <strong>spurious tuples</strong> and the decomposition is <strong>lossy</strong>.</p><p><strong>Test:</strong> the decomposition is lossless if and only if the common attributes functionally determine all attributes of at least one of the relations:</p><p style='text-align:center'><code>(R₁ ∩ R₂) → R₁ &nbsp; OR &nbsp; (R₁ ∩ R₂) → R₂</code></p><p>Equivalently, the common attribute set must be a super key of at least one of the two relations.</p><p><strong>Example of failure:</strong> EMP(Name, Dept, Project) with rows (Ramesh, Computer, Website) and (Sita, Computer, Payroll), split into R₁(Name, Dept) and R₂(Dept, Project). The common attribute Dept is a key of neither, so the join produces 2 × 2 = 4 rows, including the false (Ramesh, Computer, Payroll) and (Sita, Computer, Website). The database now asserts facts that were never true.</p><p>Losslessness is a <strong>mandatory</strong> property of any decomposition; dependency preservation is desirable but is not always achievable when decomposing to BCNF.</p>"
      },
      {
        q: "Find the minimal cover of F = {A → BC, B → C, A → B, AB → C}.",
        marks: "6",
        a: "<p><strong>Step 1 — make every right-hand side a single attribute.</strong><br>F becomes {A → B, A → C, B → C, A → B, AB → C}; removing the duplicate gives {A → B, A → C, B → C, AB → C}.</p><p><strong>Step 2 — remove extraneous attributes from left-hand sides.</strong><br>In <code>AB → C</code>, test whether B is needed: using the other dependencies, A⁺ = {A} → B (A→B) → C (B→C) = {A,B,C}. Since A alone already determines C, B is extraneous, and <code>AB → C</code> reduces to <code>A → C</code>, which is already present. Drop it.<br>F = {A → B, A → C, B → C}.</p><p><strong>Step 3 — remove redundant dependencies.</strong><br>Test <code>A → C</code>: remove it and compute A⁺ from {A → B, B → C} = {A, B, C}. C is still derivable, so <code>A → C</code> is redundant → remove.<br>F = {A → B, B → C}.<br>Test <code>A → B</code>: removing it gives A⁺ = {A}, losing B → it is required.<br>Test <code>B → C</code>: removing it gives B⁺ = {B}, losing C → it is required.</p><p><strong>Minimal cover: F<sub>min</sub> = { A → B, B → C }.</strong></p>"
      }
    ]
  },

  quiz: [
    {
      q: "A new department with no employees yet cannot be added to EMP_DEPT(Emp_ID, ..., Dept_ID, Dept_Name). This is an:",
      opts: ["Insertion anomaly", "Deletion anomaly", "Modification anomaly", "Referential integrity violation"],
      correct: 0,
      explain: "You cannot record one fact (the department) because another fact (an employee) is missing — the definition of an insertion anomaly."
    },
    {
      q: "In X → Y, X is called the:",
      opts: ["Determinant", "Dependent", "Candidate key", "Prime attribute"],
      correct: 0,
      explain: "X determines Y, so X is the determinant and Y the dependent. Note that a determinant need not be a key — in BCNF it must be."
    },
    {
      q: "Which of Armstrong's axioms states that if X → Y and Y → Z then X → Z?",
      opts: ["Transitivity", "Reflexivity", "Augmentation", "Union"],
      correct: 0,
      explain: "The three axioms are Reflexivity, Augmentation and Transitivity (R-A-T). Union, Decomposition and Pseudo-transitivity are derived from them."
    },
    {
      q: "If X⁺ (the closure of X) contains every attribute of R, then X is:",
      opts: ["A super key", "Always a candidate key", "A foreign key", "A prime attribute"],
      correct: 0,
      explain: "Reaching every attribute makes X a super key. It is a candidate key only if no proper subset of X is also a super key — that is, if it is minimal."
    },
    {
      q: "A relation is in 1NF if:",
      opts: [
        "All attribute values are atomic",
        "It has no partial dependency",
        "It has no transitive dependency",
        "Every determinant is a super key"
      ],
      correct: 0,
      explain: "1NF is about atomic values only — no repeating groups and no multi-valued cells. The other options define 2NF, 3NF and BCNF."
    },
    {
      q: "Second normal form removes:",
      opts: ["Partial dependencies", "Transitive dependencies", "Multivalued dependencies", "Join dependencies"],
      correct: 0,
      explain: "2NF removes dependence on part of a composite key. A relation whose every candidate key is a single attribute is automatically in 2NF."
    },
    {
      q: "Emp_ID → Dept_ID → Dept_Name, where Dept_ID is not a key, is an example of:",
      opts: ["A transitive dependency", "A partial dependency", "A trivial dependency", "A multivalued dependency"],
      correct: 0,
      explain: "A non-key attribute is determining another non-key attribute, so the key determines Dept_Name only indirectly. 3NF exists to remove exactly this."
    },
    {
      q: "The general definition of 3NF says that for every FD X → A, either X is a super key or:",
      opts: ["A is a prime attribute", "A is non-prime", "X is a foreign key", "A is atomic"],
      correct: 0,
      explain: "That second escape clause is the only difference between 3NF and BCNF — BCNF removes it, requiring X to be a super key in every case."
    },
    {
      q: "A relation is in BCNF if, for every non-trivial FD X → Y:",
      opts: ["X is a super key", "Y is prime", "X is non-prime", "Y is atomic"],
      correct: 0,
      explain: "BCNF's rule is a single line with no exceptions: every determinant must be a super key."
    },
    {
      q: "3NF and BCNF can only differ when the relation has:",
      opts: [
        "Multiple overlapping candidate keys",
        "A single candidate key",
        "No functional dependencies",
        "Only composite attributes"
      ],
      correct: 0,
      explain: "With one candidate key the two forms are equivalent. Overlapping candidate keys are the signal that a question is really testing BCNF."
    },
    {
      q: "Which property is ALWAYS achievable when decomposing to 3NF but NOT always to BCNF?",
      opts: ["Dependency preservation", "Lossless join", "Atomicity", "Redundancy removal"],
      correct: 0,
      explain: "Both forms guarantee a lossless join. Only 3NF also guarantees that every original dependency can still be enforced on a single relation."
    },
    {
      q: "Spurious tuples are:",
      opts: [
        "Extra rows produced by joining a badly decomposed relation, which were never in the original",
        "Rows containing NULL values",
        "Duplicate rows removed by DISTINCT",
        "Rows violating a CHECK constraint"
      ],
      correct: 0,
      explain: "They appear when the common attribute of a decomposition is a key of neither relation, so the join pairs rows that were never related."
    },
    {
      q: "A decomposition of R into R₁ and R₂ is lossless if:",
      opts: [
        "The common attributes form a super key of R₁ or of R₂",
        "R₁ and R₂ have no attributes in common",
        "Both relations are in 3NF",
        "R₁ and R₂ have the same number of rows"
      ],
      correct: 0,
      explain: "(R₁ ∩ R₂) → R₁ or (R₁ ∩ R₂) → R₂. If the shared attributes are a key of one side, each value matches exactly one row and the join cannot fabricate tuples."
    },
    {
      q: "Fourth normal form deals with:",
      opts: ["Multivalued dependencies", "Functional dependencies", "Join dependencies", "Partial dependencies"],
      correct: 0,
      explain: "4NF removes independent multi-valued facts stored in one relation (the Course/Book/Lecturer case). 5NF deals with join dependencies."
    },
    {
      q: "In ENROLLMENT(Roll_No, Course_Code, Marks) with key {Roll_No, Course_Code}, the attribute Marks is:",
      opts: ["Non-prime and fully functionally dependent on the key", "Prime", "Partially dependent", "Transitively dependent"],
      correct: 0,
      explain: "Marks belongs to no candidate key, so it is non-prime, and it genuinely needs both key attributes — a mark exists per student per course."
    }
  ]
});

registerGlossary("Unit 4", [
  ["Normalization", "The process of decomposing relations to remove redundancy and update anomalies."],
  ["Insertion Anomaly", "Being unable to record one fact because an unrelated fact is missing."],
  ["Deletion Anomaly", "Losing information unintentionally when a row is deleted."],
  ["Modification Anomaly", "Needing to change many rows to record one real-world change, risking inconsistency."],
  ["Functional Dependency (X → Y)", "Any two tuples agreeing on X must also agree on Y."],
  ["Determinant", "The left-hand side of a functional dependency."],
  ["Trivial FD", "X → Y where Y is a subset of X; always true and therefore uninformative."],
  ["Full Functional Dependency", "Y depends on the whole of X and on no proper subset of it."],
  ["Partial Dependency", "A non-prime attribute depending on only part of a composite key; removed by 2NF."],
  ["Transitive Dependency", "Key → A → B where A is not a key and B is non-prime; removed by 3NF."],
  ["Multivalued Dependency (X ↠ Y)", "X determines a set of Y values independent of the other attributes; removed by 4NF."],
  ["Armstrong's Axioms", "Reflexivity, Augmentation and Transitivity — the sound and complete inference rules for FDs."],
  ["Attribute Closure (X⁺)", "The set of all attributes determined by X; used to find candidate keys."],
  ["Prime Attribute", "An attribute belonging to at least one candidate key."],
  ["Non-Prime Attribute", "An attribute belonging to no candidate key."],
  ["Minimal Cover", "The smallest equivalent set of FDs: single right-hand sides, no redundant FDs, no extraneous left attributes."],
  ["1NF", "Every attribute value is atomic; no repeating groups."],
  ["2NF", "In 1NF and every non-prime attribute is fully dependent on every candidate key."],
  ["3NF", "In 2NF with no transitive dependency; generally, for each X → A either X is a super key or A is prime."],
  ["BCNF", "For every non-trivial FD X → Y, X must be a super key — 3NF with no exceptions."],
  ["4NF", "In BCNF with no non-trivial multivalued dependency whose determinant is not a super key."],
  ["5NF (PJNF)", "In 4NF and every join dependency is implied by the candidate keys."],
  ["Lossless Join", "A decomposition whose natural join reproduces exactly the original relation."],
  ["Spurious Tuples", "False rows created by joining a lossy decomposition."],
  ["Dependency Preservation", "Every original functional dependency can still be enforced on a single decomposed relation."],
  ["Denormalization", "Deliberately reintroducing redundancy to speed up read-heavy queries."]
]);
