/**
 * Unit 4 — Relational Database Design (10 Lecture Hours).
 * Part 1 of 3: topics 4.1 and 4.2.
 */

registerUnit({
  id: "unit-4",
  number: "Unit 4",
  title: "Relational Database Design & Normalization",
  subtitle: "Spotting a badly designed table, proving it with functional dependencies, and repairing it step by step through 1NF, 2NF, 3NF, BCNF and beyond",
  readingTime: "10 Lecture Hours (LHs)",
  description: "Informal Design Guidelines for Relational Schemas; Functional Dependencies; Normal Forms Based on Primary Keys; General Definitions of Second and Third Normal Forms; Boyce-Codd Normal Form; Properties of Relational Decomposition.",
  topics: [

    /* ================================================================== */
    {
      id: "u4-design-guidelines",
      title: "4.1 Informal Design Guidelines & Update Anomalies",
      summary: "The four guidelines for judging a relational schema by eye, and the three anomalies — insertion, deletion and modification — that bad design causes.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 15 (Sec. 15.1) | Silberschatz Ch. 8</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p>You can put all your data in one giant table. It will <em>work</em> — and it will slowly ruin your database.</p>
          <p>The problem is <strong>repetition</strong>. If a department's name is written next to all 50 of its employees, then that name is stored 50 times. Change it, and you must change 50 rows; miss one, and the database now disagrees with itself. Worse, some facts become impossible to store at all, and deleting one row can destroy information you never meant to lose.</p>
          <p>These three problems are called the <strong>update anomalies</strong>, and this whole unit exists to eliminate them.</p>
        </div>

        <h3>The Problem Table</h3>
        <p>Everything in this unit will be explained using one deliberately bad table. Study it before reading on.</p>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead>
              <tr><th>Emp_ID</th><th>Emp_Name</th><th>Dept_ID</th><th>Dept_Name</th><th>Dept_Head</th><th>Project</th><th>Hours</th></tr>
            </thead>
            <tbody>
              <tr><td>E01</td><td>Ramesh</td><td>D01</td><td class="norm-highlight">Computer</td><td class="norm-highlight">Dr. Sharma</td><td>Website</td><td>12</td></tr>
              <tr><td>E01</td><td>Ramesh</td><td>D01</td><td class="norm-highlight">Computer</td><td class="norm-highlight">Dr. Sharma</td><td>Payroll</td><td>8</td></tr>
              <tr><td>E02</td><td>Sita</td><td>D01</td><td class="norm-highlight">Computer</td><td class="norm-highlight">Dr. Sharma</td><td>Website</td><td>20</td></tr>
              <tr><td>E03</td><td>Hari</td><td>D02</td><td>Civil</td><td>Dr. Karki</td><td>Bridge</td><td>15</td></tr>
            </tbody>
          </table>
        </div>
        <p>Look at the highlighted cells: "Computer" and "Dr. Sharma" are written <strong>three times</strong>. That single fact — which department D01 is and who heads it — has been duplicated. Every problem below flows from that one observation.</p>

        <hr class="section-divider" />

        <h3>The Three Update Anomalies</h3>

        <div class="grid-3col">
          <div class="feature-card" style="border-left:3px solid var(--accent-rose);">
            <h4>1. Insertion Anomaly</h4>
            <p><strong>You cannot record a fact because an unrelated fact is missing.</strong></p>
            <p>A new department "D03 – Electrical" is created but nobody works there yet. You cannot insert it: <code>Emp_ID</code> is part of the primary key and cannot be NULL.</p>
            <p><em>The department exists in real life but cannot exist in your database.</em></p>
          </div>
          <div class="feature-card" style="border-left:3px solid var(--accent-amber);">
            <h4>2. Deletion Anomaly</h4>
            <p><strong>Deleting one fact accidentally destroys another.</strong></p>
            <p>Hari (E03) resigns, so you delete his row. The Civil department, and the fact that Dr. Karki heads it, vanish from the database entirely.</p>
            <p><em>You lost information you never intended to delete.</em></p>
          </div>
          <div class="feature-card" style="border-left:3px solid var(--accent-secondary);">
            <h4>3. Modification (Update) Anomaly</h4>
            <p><strong>One real change requires many row changes.</strong></p>
            <p>Dr. Sharma is replaced by Dr. Gurung. You must update <em>every</em> row where Dept_ID = D01. Miss one and the database says D01 has two different heads.</p>
            <p><em>Slow, and a permanent source of inconsistency.</em></p>
          </div>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 Memory Trick</div>
          <div class="mnemonic-phrase">I · D · M — "I Don't Modify"</div>
          <p><strong>I</strong>nsertion: can't put it in. <strong>D</strong>eletion: lost too much. <strong>M</strong>odification: had to change it everywhere.</p>
          <p>In an exam, always answer with both the <em>name</em> and a <em>concrete example from the given table</em> — the example is where the marks are.</p>
        </div>

        <div class="worked-example">
          <div class="we-title">✍️ The Same Idea, in the Exact Form Your Handout Uses</div>
          <div class="we-question">A single unnormalized table stores student, course and instructor facts together: <code>STUDENT_COURSE(STUDENT_ID, STUDENT_NAME, COURSE, INSTRUCTOR, INSTRUCTOR_PHONE)</code>.</div>
          <div class="table-responsive">
            <table class="syllabus-table">
              <thead><tr><th>STUDENT_ID</th><th>STUDENT_NAME</th><th>COURSE</th><th>INSTRUCTOR</th><th>INSTRUCTOR_PHONE</th></tr></thead>
              <tbody>
                <tr><td>101</td><td>Ram</td><td>DBMS</td><td class="norm-highlight">Mr. Gurung</td><td class="norm-highlight">9841112233</td></tr>
                <tr><td>102</td><td>Sita</td><td>DBMS</td><td class="norm-highlight">Mr. Gurung</td><td class="norm-highlight">9841112233</td></tr>
                <tr><td>103</td><td>Hari</td><td>Networking</td><td>Ms. Karki</td><td>9851223344</td></tr>
                <tr><td>104</td><td>Gita</td><td>DBMS</td><td class="norm-highlight">Mr. Gurung</td><td class="norm-highlight">9841112233</td></tr>
              </tbody>
            </table>
          </div>
          <ol class="step-list">
            <li><strong>Insertion:</strong> the college hires Mr. Thapa to teach Statistics, but no student has enrolled yet. He cannot be inserted — <code>STUDENT_ID</code> is part of the row and cannot be invented.</li>
            <li><strong>Deletion:</strong> Hari is the only student in Networking. If he drops the course and his row is deleted, Ms. Karki and her phone number disappear too, even though she still works at the college.</li>
            <li><strong>Update:</strong> Mr. Gurung's number appears in three rows. Change it to 9847001122 and update all three — miss one and the table contradicts itself about his own phone number.</li>
          </ol>
          <div class="we-answer"><strong>The fix:</strong> split into <code>STUDENT_COURSE(STUDENT_ID, STUDENT_NAME, COURSE)</code> and <code>COURSE_INSTRUCTOR(COURSE, INSTRUCTOR, INSTRUCTOR_PHONE)</code>. Now Mr. Thapa can be added with zero students, deleting Hari's enrolment leaves Ms. Karki untouched, and Mr. Gurung's number is stored — and updated — exactly once.</div>
        </div>

        <hr class="section-divider" />

        <h3>The Four Informal Design Guidelines</h3>
        <p>Before any formal theory, these four rules let you judge a schema simply by looking at it. They are a standard exam question in their own right.</p>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:8%">#</th><th style="width:30%">Guideline</th><th>What It Means and Why</th></tr></thead>
            <tbody>
              <tr>
                <td><strong>1</strong></td>
                <td><strong>Make the semantics clear — one relation should describe one thing</strong></td>
                <td>Do not mix attributes of employees with attributes of departments in the same table. If you cannot explain a table in a single short sentence ("this table stores employees"), it is doing too much.</td>
              </tr>
              <tr>
                <td><strong>2</strong></td>
                <td><strong>Reduce redundant information, so as to avoid update anomalies</strong></td>
                <td>Every fact should be stored exactly once, in exactly one place. Repetition wastes space and, far more importantly, allows the copies to disagree.</td>
              </tr>
              <tr>
                <td><strong>3</strong></td>
                <td><strong>Reduce NULL values in tuples</strong></td>
                <td>Many NULLs mean the table is trying to describe things that do not all share the same attributes. NULLs also waste space, make aggregates misleading (<code>AVG</code> skips them) and are ambiguous — they could mean "unknown", "not applicable", or "unknown whether applicable".</td>
              </tr>
              <tr>
                <td><strong>4</strong></td>
                <td><strong>Disallow the possibility of generating spurious tuples</strong></td>
                <td>If a decomposition is done badly, re-joining the pieces produces <em>extra rows that were never in the original</em> — fabricated information. Always decompose so that the natural join reconstructs exactly the original data. This is the <strong>lossless join</strong> property of topic 4.7.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ Spurious Tuples Are the Worst Failure</div>
          <p>Redundancy makes a database <em>inconvenient</em>. Spurious tuples make it <strong>wrong</strong> — it reports facts that were never true. A design that produces them is unusable, no matter how tidy it looks, which is why guideline 4 is treated as non-negotiable.</p>
        </div>

        <div class="learn-box world-box">
          <div class="learn-title">🌍 Where This Bites in Real Life</div>
          <p>Nearly every "the system says two different things" complaint in a real organisation traces back to a modification anomaly: the same fact was stored in two places, one copy got updated and the other did not. Normalization is not academic tidiness — it is the reason a well-designed system cannot get into that state at all.</p>
        </div>

        <div class="worked-example">
          <div class="we-title">✍️ Worked Example</div>
          <div class="we-question">For <code>STUDENT_COURSE(Roll_No, Student_Name, Course_Code, Course_Name, Instructor, Instructor_Phone, Marks)</code>, identify the redundancy and give a concrete example of each of the three anomalies.</div>
          <ol class="step-list">
            <li><strong>Find the repeated facts.</strong> <code>Student_Name</code> repeats once per course the student takes. <code>Course_Name</code>, <code>Instructor</code> and <code>Instructor_Phone</code> repeat once per student enrolled in that course.</li>
            <li><strong>Insertion anomaly.</strong> A new course "DBMS-II" is announced but no student has enrolled yet. It cannot be inserted, because <code>Roll_No</code> is part of the primary key and cannot be NULL.</li>
            <li><strong>Deletion anomaly.</strong> The only student taking "Compiler Design" withdraws. Deleting that row erases the course, its instructor and the instructor's phone number from the database completely.</li>
            <li><strong>Modification anomaly.</strong> The instructor of DBMS changes their phone number. Every row for every DBMS student must be updated. Missing one leaves two different phone numbers recorded for the same person.</li>
            <li><strong>The cause.</strong> The table describes three different things at once — students, courses and enrolments — which breaks guideline 1, and the redundancy that follows breaks guideline 2.</li>
          </ol>
          <div class="we-answer"><strong>The fix (previewing topic 4.3):</strong> split into three relations — <code>STUDENT(<u>Roll_No</u>, Student_Name)</code>, <code>COURSE(<u>Course_Code</u>, Course_Name, Instructor, Instructor_Phone)</code> and <code>ENROLLMENT(<u>Roll_No</u>, <u>Course_Code</u>, Marks)</code>. Each fact is now stored exactly once, and all three anomalies disappear.</div>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"What are update anomalies? Explain the three types with examples."</em> — near-certain, 5–6 marks. Always give a concrete example from a table.</li>
            <li><em>"Explain the informal design guidelines for relational schemas."</em> — all four with one line of justification each (6 marks).</li>
            <li><em>"Why is redundancy undesirable in a database?"</em> — wasted space, plus the three anomalies, plus inconsistency (3–4 marks).</li>
          </ul>
        </div>
      </div>
      `
    },

    /* ================================================================== */
    {
      id: "u4-functional-dependencies",
      title: "4.2 Functional Dependencies, Armstrong's Axioms & Attribute Closure",
      summary: "The X → Y notation, types of dependency, Armstrong's six inference rules, computing attribute closure, finding all candidate keys, and minimal (canonical) cover.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 15 (Sec. 15.2) | Silberschatz Ch. 8</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p>A <strong>functional dependency</strong> answers one question: <em>"if I tell you this, can you tell me that — with certainty?"</em></p>
          <p>If I tell you a student's roll number, can you tell me their name? Yes, exactly one name. So we write:</p>
          <div class="formula-strip">Roll_No → Name &nbsp;&nbsp; ("Roll_No functionally determines Name")</div>
          <p>Now reverse it. If I tell you the name "Ramesh", can you tell me the roll number? No — there could be three students called Ramesh. So <code>Name → Roll_No</code> does <strong>not</strong> hold. Functional dependencies have a direction.</p>
        </div>

        <div class="learn-box analogy-box">
          <div class="learn-title">🔑 Everyday Analogy</div>
          <p>A functional dependency is a <strong>lookup guarantee</strong>. Think of a phone's contact list: give it a contact name and it returns exactly one number. <code>Contact → Number</code>.</p>
          <p>But give it a <em>number</em> and ask for the name, and if two contacts share an office number it cannot answer. The guarantee runs one way only.</p>
        </div>

        <div class="definition-box">
          <div class="definition-title">📌 Formal Definition</div>
          <p>For a relation R, a functional dependency <strong>X → Y</strong> holds if, for <strong>every</strong> pair of tuples t₁ and t₂ in R:</p>
          <p style="text-align:center;"><strong>if t₁[X] = t₂[X], then t₁[Y] = t₂[Y]</strong></p>
          <p>In words: any two rows that agree on X must also agree on Y. X is called the <em>determinant</em>; Y is the <em>dependent</em>.</p>
        </div>

        <div class="svg-figure">
          <svg viewBox="0 0 760 210" role="img" aria-label="Diagram showing that equal X values force equal Y values">
            <text x="380" y="24" text-anchor="middle" font-size="14" font-weight="700" class="svg-muted">X → Y means: same X ⟹ same Y</text>

            <rect x="120" y="44" width="120" height="32" fill="rgba(99,102,241,0.25)" stroke="#6366f1" stroke-width="1.5"/>
            <text x="180" y="65" text-anchor="middle" font-size="13" font-weight="700">Roll_No (X)</text>
            <rect x="240" y="44" width="150" height="32" fill="rgba(16,185,129,0.25)" stroke="#10b981" stroke-width="1.5"/>
            <text x="315" y="65" text-anchor="middle" font-size="13" font-weight="700">Name (Y)</text>
            <rect x="390" y="44" width="120" height="32" class="svg-panel" stroke-width="1.5"/>
            <text x="450" y="65" text-anchor="middle" font-size="13" font-weight="700">Age</text>

            <rect x="120" y="76" width="120" height="30" fill="rgba(99,102,241,0.12)" stroke="#6366f1" stroke-width="1"/>
            <text x="180" y="96" text-anchor="middle" font-size="12">101</text>
            <rect x="240" y="76" width="150" height="30" fill="rgba(16,185,129,0.12)" stroke="#10b981" stroke-width="1"/>
            <text x="315" y="96" text-anchor="middle" font-size="12">Ramesh</text>
            <rect x="390" y="76" width="120" height="30" class="svg-panel" stroke-width="1"/>
            <text x="450" y="96" text-anchor="middle" font-size="12">21</text>

            <rect x="120" y="106" width="120" height="30" fill="rgba(99,102,241,0.12)" stroke="#6366f1" stroke-width="1"/>
            <text x="180" y="126" text-anchor="middle" font-size="12">102</text>
            <rect x="240" y="106" width="150" height="30" fill="rgba(16,185,129,0.12)" stroke="#10b981" stroke-width="1"/>
            <text x="315" y="126" text-anchor="middle" font-size="12">Sita</text>
            <rect x="390" y="106" width="120" height="30" class="svg-panel" stroke-width="1"/>
            <text x="450" y="126" text-anchor="middle" font-size="12">20</text>

            <rect x="120" y="136" width="120" height="30" fill="rgba(99,102,241,0.12)" stroke="#6366f1" stroke-width="1"/>
            <text x="180" y="156" text-anchor="middle" font-size="12">101</text>
            <rect x="240" y="136" width="150" height="30" fill="rgba(16,185,129,0.12)" stroke="#10b981" stroke-width="1"/>
            <text x="315" y="156" text-anchor="middle" font-size="12">Ramesh</text>
            <rect x="390" y="136" width="120" height="30" class="svg-panel" stroke-width="1"/>
            <text x="450" y="156" text-anchor="middle" font-size="12">21</text>

            <path d="M 110 91 Q 90 128 110 151" fill="none" stroke="#f59e0b" stroke-width="2"/>
            <text x="64" y="126" text-anchor="middle" font-size="11" font-weight="700" fill="#f59e0b">same</text>
            <text x="64" y="142" text-anchor="middle" font-size="11" font-weight="700" fill="#f59e0b">X</text>

            <path d="M 524 91 Q 546 128 524 151" fill="none" stroke="#10b981" stroke-width="2"/>
            <text x="588" y="120" text-anchor="middle" font-size="11" font-weight="700" fill="#10b981">⟹ must be</text>
            <text x="588" y="136" text-anchor="middle" font-size="11" font-weight="700" fill="#10b981">the same Y</text>

            <text x="380" y="196" text-anchor="middle" font-size="12" class="svg-muted">If any row broke this rule, the dependency Roll_No → Name would not hold.</text>
          </svg>
          <div class="figure-caption">Figure 4.2 — To disprove a functional dependency you need only find <em>one</em> pair of rows with the same X but different Y.</div>
        </div>

        <hr class="section-divider" />

        <h3>Types of Functional Dependency</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:22%">Type</th><th>Definition</th><th style="width:30%">Example</th></tr></thead>
            <tbody>
              <tr><td><strong>Trivial FD</strong></td><td>X → Y where Y is a <em>subset</em> of X. Always true, and therefore useless.</td><td><code>{Roll_No, Name} → Name</code></td></tr>
              <tr><td><strong>Non-trivial FD</strong></td><td>X → Y where Y is <em>not</em> a subset of X. These are the interesting ones.</td><td><code>Roll_No → Name</code></td></tr>
              <tr><td><strong>Fully functional dependency</strong></td><td>X → Y holds, but no <em>proper subset</em> of X determines Y. Y depends on the <strong>whole</strong> of X.</td><td><code>{Roll_No, Course} → Marks</code></td></tr>
              <tr><td><strong>Partial dependency</strong></td><td>A non-key attribute depends on only <em>part</em> of a composite key. <strong>Removed by 2NF.</strong></td><td><code>{Roll_No, Course} → Student_Name</code>, when <code>Roll_No → Student_Name</code> alone</td></tr>
              <tr><td><strong>Transitive dependency</strong></td><td>X → Y and Y → Z, so X → Z indirectly, where Y is not a key. <strong>Removed by 3NF.</strong></td><td><code>Roll_No → Dept_ID → Dept_Name</code></td></tr>
              <tr><td><strong>Multivalued dependency (X ↠ Y)</strong></td><td>One X value determines a <em>set</em> of Y values, independent of the other attributes. <strong>Removed by 4NF.</strong></td><td><code>Course ↠ Book</code>, <code>Course ↠ Lecturer</code></td></tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 The Map of This Whole Unit</div>
          <div class="formula-strip">Partial dependency → fixed by 2NF · Transitive dependency → fixed by 3NF · Any non-key determinant → fixed by BCNF · Multivalued dependency → fixed by 4NF</div>
          <p>If you remember only this line, you can reason your way through almost any normalization question.</p>
        </div>

        <hr class="section-divider" />

        <h3>Armstrong's Axioms — The Inference Rules</h3>
        <p>Given a set of functional dependencies, these rules let you <em>derive</em> every other dependency that must also hold. The first three are the axioms; the other three are convenient shortcuts derived from them.</p>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:22%">Rule</th><th style="width:30%">Statement</th><th>Meaning in Plain English</th></tr></thead>
            <tbody>
              <tr><td><strong>1. Reflexivity</strong><br><em>(axiom)</em></td><td>If Y ⊆ X then X → Y</td><td>A set always determines its own parts. This generates the trivial dependencies.</td></tr>
              <tr><td><strong>2. Augmentation</strong><br><em>(axiom)</em></td><td>If X → Y then XZ → YZ</td><td>Adding the same extra attribute to both sides cannot break a dependency.</td></tr>
              <tr><td><strong>3. Transitivity</strong><br><em>(axiom)</em></td><td>If X → Y and Y → Z then X → Z</td><td>Dependencies chain together, like A tells you B and B tells you C.</td></tr>
              <tr><td><strong>4. Union</strong><br><em>(derived)</em></td><td>If X → Y and X → Z then X → YZ</td><td>If X determines two things separately, it determines them together.</td></tr>
              <tr><td><strong>5. Decomposition</strong><br><em>(derived)</em></td><td>If X → YZ then X → Y and X → Z</td><td>The reverse of union: a dependency can be split on the right-hand side.</td></tr>
              <tr><td><strong>6. Pseudo-transitivity</strong><br><em>(derived)</em></td><td>If X → Y and WY → Z then WX → Z</td><td>Transitivity when an extra attribute W has to be carried along.</td></tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 Memory Trick</div>
          <p>The three <strong>axioms</strong> are <strong>R-A-T</strong>: <strong>R</strong>eflexivity, <strong>A</strong>ugmentation, <strong>T</strong>ransitivity. The other three (Union, Decomposition, Pseudo-transitivity) are proved <em>from</em> them, so if an exam asks for "Armstrong's axioms" the essential three are R-A-T, and mentioning the derived rules earns extra credit.</p>
        </div>

        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ Decomposition Works on the RIGHT Side Only</div>
          <p><code>X → YZ</code> does give you <code>X → Y</code> and <code>X → Z</code>. ✔</p>
          <p><code>XY → Z</code> does <strong>not</strong> give you <code>X → Z</code> or <code>Y → Z</code>. ✘ That would mean half a key determines something the whole key barely determines — and it is precisely the assumption that produces wrong answers in normalization questions.</p>
        </div>

        <hr class="section-divider" />

        <h3>Attribute Closure — The Most Useful Technique in This Unit</h3>
        <div class="definition-box">
          <div class="definition-title">📌 Definition</div>
          <p>The <strong>closure of an attribute set X</strong>, written <strong>X⁺</strong>, is the set of all attributes that can be functionally determined by X using the given dependencies.</p>
          <p><strong>Why it matters:</strong> if X⁺ contains <em>every</em> attribute of the relation, then <strong>X is a super key</strong>. This is how you find candidate keys mechanically instead of guessing.</p>
        </div>

        <div class="worked-example">
          <div class="we-title">📐 The Algorithm</div>
          <ol class="step-list">
            <li><strong>Start</strong> with X⁺ = X itself.</li>
            <li><strong>Scan every dependency</strong> A → B in the set.</li>
            <li><strong>If A is already entirely inside X⁺</strong>, add all of B to X⁺.</li>
            <li><strong>Repeat</strong> the whole scan until one complete pass adds nothing new.</li>
            <li><strong>Check:</strong> if X⁺ = all attributes of R, then X is a super key. If additionally no proper subset of X is a super key, X is a <strong>candidate key</strong>.</li>
          </ol>
        </div>

        <div class="worked-example">
          <div class="we-title">✍️ Worked Example — Computing Closures and Finding Candidate Keys</div>
          <div class="we-question">R(A, B, C, D, E) with F = { A → BC, CD → E, B → D, E → A }. Find A⁺, (CD)⁺ and (BD)⁺, then list all candidate keys.</div>
          <ol class="step-list">
            <li><strong>Compute A⁺.</strong> Start: A⁺ = {A}. &nbsp;<code>A → BC</code>: A is in A⁺, so add B and C → {A,B,C}. &nbsp;<code>B → D</code>: B is in, add D → {A,B,C,D}. &nbsp;<code>CD → E</code>: both C and D are in, add E → {A,B,C,D,E}. Nothing left to add.<br><strong>A⁺ = {A,B,C,D,E} = all attributes → A is a super key.</strong></li>
            <li><strong>Is A a candidate key?</strong> Its only proper subset is the empty set, which determines nothing. So A is <strong>minimal</strong> → <strong>A is a candidate key.</strong></li>
            <li><strong>Compute (CD)⁺.</strong> Start {C,D}. <code>CD → E</code> → add E → {C,D,E}. <code>E → A</code> → add A → {A,C,D,E}. <code>A → BC</code> → add B → {A,B,C,D,E}. All attributes.<br><strong>CD is a super key.</strong> Check minimality: C⁺ = {C} only; D⁺ = {D} only. Neither half works alone → <strong>CD is a candidate key.</strong></li>
            <li><strong>Compute E⁺.</strong> Start {E}. <code>E → A</code> → {A,E}. <code>A → BC</code> → {A,B,C,E}. <code>B → D</code> → {A,B,C,D,E}. All attributes → <strong>E is a candidate key</strong> (minimal, being a single attribute).</li>
            <li><strong>Compute (BD)⁺.</strong> Start {B,D}. <code>B → D</code> adds D, already there. No other left-hand side is contained in {B,D}.<br><strong>(BD)⁺ = {B,D}</strong> — not all attributes, so <strong>BD is not a super key.</strong></li>
            <li><strong>Collect the results.</strong> The determinants that reach everything are A, E and CD.</li>
          </ol>
          <div class="we-answer"><strong>Answer:</strong> A⁺ = {A,B,C,D,E}; (CD)⁺ = {A,B,C,D,E}; (BD)⁺ = {B,D}.<br><strong>Candidate keys: A, E and CD.</strong><br><strong>Prime attributes</strong> (those appearing in some candidate key) = {A, C, D, E}. <strong>Non-prime</strong> = {B}. You will need this distinction in the next topic.</div>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 A Shortcut That Saves Time in Exams</div>
          <p>An attribute that <strong>never appears on the right-hand side</strong> of any dependency <em>must</em> be part of <strong>every</strong> candidate key — nothing can determine it, so it can only determine itself.</p>
          <p>Start by listing those attributes, compute their closure first, and you have usually found a candidate key in one step.</p>
        </div>

        <hr class="section-divider" />

        <h3>Equivalence of FD Sets and Minimal Cover</h3>
        <div class="definition-box">
          <div class="definition-title">📌 Definitions</div>
          <p><strong>Closure of F (F⁺):</strong> the set of <em>all</em> dependencies that can be inferred from F.</p>
          <p><strong>F and G are equivalent</strong> if F⁺ = G⁺ — that is, every dependency in F can be derived from G and vice versa. They describe exactly the same constraints.</p>
          <p><strong>Minimal (canonical) cover:</strong> the smallest set of dependencies equivalent to F. It must satisfy three conditions:</p>
          <ol>
            <li>Every right-hand side has <strong>exactly one attribute</strong>.</li>
            <li>No dependency can be <strong>removed</strong> without changing the closure (no redundant FDs).</li>
            <li>No attribute can be <strong>removed from a left-hand side</strong> without changing the closure (no extraneous attributes).</li>
          </ol>
        </div>

        <div class="worked-example">
          <div class="we-title">✍️ Worked Example — Finding a Minimal Cover</div>
          <div class="we-question">Find a minimal cover for F = { A → BC, B → C, A → B, AB → C }.</div>
          <ol class="step-list">
            <li><strong>Step 1 — split every right-hand side into single attributes.</strong><br>F becomes { A → B, A → C, B → C, A → B, AB → C }. Remove the exact duplicate <code>A → B</code>:<br>{ A → B, A → C, B → C, AB → C }.</li>
            <li><strong>Step 2 — remove extraneous attributes from left-hand sides.</strong> Look at <code>AB → C</code>. Is B needed? Compute A⁺ using the rest: A → B gives B, then B → C gives C. Since A alone already reaches C, <strong>B is extraneous</strong>, and <code>AB → C</code> collapses to <code>A → C</code> — which we already have. Drop it.<br>{ A → B, A → C, B → C }.</li>
            <li><strong>Step 3 — remove redundant dependencies.</strong> Test <code>A → C</code>: delete it and compute A⁺ from { A → B, B → C }. A⁺ = {A} → add B → add C = {A,B,C}. C is still reachable, so <strong>A → C is redundant</strong>. Remove it.<br>{ A → B, B → C }.</li>
            <li><strong>Re-test the survivors.</strong> Remove <code>A → B</code>: A⁺ = {A} only — B is lost, so it is needed. Remove <code>B → C</code>: B⁺ = {B} only — C is lost, so it is needed.</li>
            <li><strong>Both are essential, so we are done.</strong></li>
          </ol>
          <div class="we-answer"><strong>Minimal cover: F<sub>min</sub> = { A → B, B → C }.</strong> Four dependencies reduced to two, describing exactly the same constraints.</div>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"Define functional dependency. Explain its types with examples."</em> — the definition + the six types table (5–6 marks).</li>
            <li><em>"State and explain Armstrong's axioms."</em> — R-A-T plus the three derived rules (5 marks).</li>
            <li><em>"Given R and F, find all candidate keys."</em> — a very common numerical. Show every closure computation step by step; method marks are awarded even if the final answer slips.</li>
            <li><em>"Find the minimal cover of the given set of FDs."</em> — a 5–8 mark numerical. Always do the three steps in order: split, remove extraneous left-hand attributes, remove redundant FDs.</li>
          </ul>
        </div>
      </div>
      `
    }
  ]
});
