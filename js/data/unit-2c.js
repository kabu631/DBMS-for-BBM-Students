/**
 * Unit 2 — Part 3: EER modelling
 *   2.8 Specialization and Generalization
 *   2.9 Constraints and characteristics of specialization/generalization,
 *       plus categories (union types) and aggregation
 */

appendTopics("unit-2", [

  /* ==================================================================== */
  /* 2.8                                                                   */
  /* ==================================================================== */
  {
    id: "u2-spec-gen",
    title: "2.8 Specialization & Generalization (Enhanced ER Model)",
    summary: "Superclass/subclass, the IS-A relationship, attribute inheritance, top-down specialization vs bottom-up generalization, and when to use each.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 4 (Sec. 4.1–4.3) | Silberschatz Ch. 7</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>Sometimes one entity type contains groups that are <strong>almost the same but not quite</strong>.</p>
        <p>All employees share a name, an ID and a salary. But <em>engineers</em> also have an engineering-licence number, <em>drivers</em> also have a driving-licence number, and <em>secretaries</em> have typing speed. Repeating all the shared columns three times would be wasteful, and leaving the special columns out would lose information.</p>
        <p>The answer: keep one <strong>general</strong> entity (EMPLOYEE) holding the shared facts, and hang <strong>specialised</strong> entities beneath it holding only the extra facts. That is all specialization and generalization are.</p>
      </div>

      <div class="learn-box analogy-box">
        <div class="learn-title">🚗 Everyday Analogy</div>
        <p>Think of the word <strong>VEHICLE</strong>. Every vehicle has a registration number, a colour and an owner.</p>
        <p>But a <strong>CAR</strong> also has a number of seats, and a <strong>TRUCK</strong> also has a load capacity in tonnes. CAR and TRUCK are both <em>kinds of</em> vehicle — they inherit everything a vehicle has and then add their own extras.</p>
        <p>If someone asks you "is a car a vehicle?" and the answer is yes, you are looking at an <strong>IS-A relationship</strong>.</p>
      </div>

      <h3>Core Vocabulary</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:24%">Term</th><th>Meaning</th><th style="width:26%">Example</th></tr></thead>
          <tbody>
            <tr><td><strong>Superclass (Parent)</strong></td><td>The general entity type holding the attributes common to everyone.</td><td>EMPLOYEE, VEHICLE, ACCOUNT</td></tr>
            <tr><td><strong>Subclass (Child)</strong></td><td>A specialised group within the superclass, holding extra attributes of its own.</td><td>ENGINEER, CAR, SAVINGS_ACCOUNT</td></tr>
            <tr><td><strong>IS-A Relationship</strong></td><td>The link between a subclass and its superclass. Drawn as a triangle or a circle with a ⊂ subset symbol.</td><td>"An ENGINEER <em>is a</em> EMPLOYEE"</td></tr>
            <tr><td><strong>Attribute Inheritance</strong></td><td>A subclass automatically owns every attribute and every relationship of its superclass, without redeclaring them.</td><td>ENGINEER automatically has Emp_ID, Name, Salary</td></tr>
            <tr><td><strong>Specialization</strong></td><td><strong>Top-down.</strong> Start with one general entity and split it into subclasses.</td><td>EMPLOYEE → {ENGINEER, DRIVER, SECRETARY}</td></tr>
            <tr><td><strong>Generalization</strong></td><td><strong>Bottom-up.</strong> Start with several similar entities and merge their common parts into a new superclass.</td><td>{CAR, TRUCK} → VEHICLE</td></tr>
          </tbody>
        </table>
      </div>

      <div class="svg-figure">
        <svg viewBox="0 0 840 400" role="img" aria-label="Specialization hierarchy of EMPLOYEE into ENGINEER, DRIVER and SECRETARY">
          <!-- Superclass -->
          <rect x="330" y="40" width="180" height="56" rx="6" fill="rgba(99,102,241,0.18)" stroke="#6366f1" stroke-width="2.5"/>
          <text x="420" y="66" text-anchor="middle" font-size="16" font-weight="700">EMPLOYEE</text>
          <text x="420" y="85" text-anchor="middle" font-size="11" class="svg-muted">superclass</text>

          <ellipse cx="140" cy="40" rx="64" ry="22" fill="rgba(99,102,241,0.10)" stroke="#6366f1" stroke-width="1.5"/>
          <text x="140" y="45" text-anchor="middle" font-size="11" text-decoration="underline">Emp_ID</text>
          <ellipse cx="140" cy="92" rx="64" ry="22" fill="rgba(99,102,241,0.10)" stroke="#6366f1" stroke-width="1.5"/>
          <text x="140" y="97" text-anchor="middle" font-size="11">Name</text>
          <ellipse cx="140" cy="144" rx="64" ry="22" fill="rgba(99,102,241,0.10)" stroke="#6366f1" stroke-width="1.5"/>
          <text x="140" y="149" text-anchor="middle" font-size="11">Salary</text>
          <line x1="204" y1="44" x2="330" y2="56" class="svg-line" stroke-width="1.3"/>
          <line x1="204" y1="92" x2="330" y2="70" class="svg-line" stroke-width="1.3"/>
          <line x1="204" y1="140" x2="330" y2="84" class="svg-line" stroke-width="1.3"/>
          <text x="140" y="182" text-anchor="middle" font-size="11" class="svg-muted">shared attributes —</text>
          <text x="140" y="198" text-anchor="middle" font-size="11" class="svg-muted">inherited by all subclasses</text>

          <!-- Circle with subset symbol -->
          <line x1="420" y1="96" x2="420" y2="140" class="svg-line" stroke-width="2"/>
          <circle cx="420" cy="162" r="22" fill="rgba(139,92,246,0.18)" stroke="#8b5cf6" stroke-width="2.5"/>
          <text x="420" y="169" text-anchor="middle" font-size="18" font-weight="700" fill="#8b5cf6">d</text>
          <text x="470" y="150" font-size="11" class="svg-muted">circle = specialization</text>
          <text x="470" y="166" font-size="11" class="svg-muted">d = disjoint (see 2.9)</text>

          <!-- Subset arcs -->
          <path d="M 420 184 L 420 214" class="svg-line" stroke-width="2" fill="none"/>
          <line x1="180" y1="240" x2="660" y2="240" class="svg-line" stroke-width="2"/>
          <line x1="420" y1="214" x2="420" y2="240" class="svg-line" stroke-width="2"/>

          <line x1="180" y1="240" x2="180" y2="285" class="svg-line" stroke-width="2"/>
          <line x1="420" y1="240" x2="420" y2="285" class="svg-line" stroke-width="2"/>
          <line x1="660" y1="240" x2="660" y2="285" class="svg-line" stroke-width="2"/>
          <text x="196" y="262" font-size="16" font-weight="700" fill="#8b5cf6">⊂</text>
          <text x="436" y="262" font-size="16" font-weight="700" fill="#8b5cf6">⊂</text>
          <text x="676" y="262" font-size="16" font-weight="700" fill="#8b5cf6">⊂</text>

          <!-- Subclasses -->
          <rect x="100" y="286" width="160" height="50" rx="6" fill="rgba(16,185,129,0.16)" stroke="#10b981" stroke-width="2"/>
          <text x="180" y="316" text-anchor="middle" font-size="14" font-weight="700">ENGINEER</text>
          <rect x="340" y="286" width="160" height="50" rx="6" fill="rgba(6,182,212,0.16)" stroke="#06b6d4" stroke-width="2"/>
          <text x="420" y="316" text-anchor="middle" font-size="14" font-weight="700">DRIVER</text>
          <rect x="580" y="286" width="160" height="50" rx="6" fill="rgba(245,158,11,0.16)" stroke="#f59e0b" stroke-width="2"/>
          <text x="660" y="316" text-anchor="middle" font-size="14" font-weight="700">SECRETARY</text>

          <text x="180" y="360" text-anchor="middle" font-size="11" class="svg-muted">+ Eng_Licence_No</text>
          <text x="420" y="360" text-anchor="middle" font-size="11" class="svg-muted">+ Driving_Licence_No</text>
          <text x="660" y="360" text-anchor="middle" font-size="11" class="svg-muted">+ Typing_Speed</text>

          <text x="420" y="390" text-anchor="middle" font-size="12" class="svg-muted">Read downward = SPECIALIZATION (top-down) &nbsp;·&nbsp; Read upward = GENERALIZATION (bottom-up)</text>
        </svg>
        <div class="figure-caption">Figure 2.25 — A specialization of EMPLOYEE. The same picture read from the bottom up is a generalization. The circle carries the constraint symbol explained in topic 2.9.</div>
      </div>

      <div class="img-grid-2col">
        <div class="note-figure">
          <img src="images/tp/unit2/specialization-employee-tester-developer.png" alt="EMPLOYEE specialized IS A Tester and Developer" class="note-img" loading="lazy" />
          <div class="figure-caption">Figure 2.26 (Source: Tpoint Tech) — Specialization: EMPLOYEE is split top-down into TESTER and DEVELOPER through an IS-A relationship.</div>
        </div>
        <div class="note-figure">
          <img src="images/tp/unit2/generalization-person-isa-faculty-student.png" alt="FACULTY and STUDENT generalized upward into PERSON through IS A" class="note-img" loading="lazy" />
          <div class="figure-caption">Figure 2.27 (Source: Tpoint Tech) — Generalization: FACULTY and STUDENT are merged upward into the superclass PERSON through the same IS-A relationship, just read bottom-up.</div>
        </div>
      </div>

      <hr class="section-divider" />

      <h3>Specialization vs Generalization — The Difference That Gets Asked</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th>Basis</th><th>Specialization</th><th>Generalization</th></tr></thead>
          <tbody>
            <tr><td><strong>Direction</strong></td><td>Top-down</td><td>Bottom-up</td></tr>
            <tr><td><strong>Starting point</strong></td><td>One general entity type already exists</td><td>Several specific entity types already exist</td></tr>
            <tr><td><strong>Process</strong></td><td>Split it into subclasses based on a distinguishing characteristic</td><td>Extract the common attributes into a new superclass</td></tr>
            <tr><td><strong>Result</strong></td><td>New <em>subclasses</em> are created</td><td>A new <em>superclass</em> is created</td></tr>
            <tr><td><strong>Number of entities</strong></td><td>Increases (one becomes many)</td><td>Reduces duplication (many share one parent)</td></tr>
            <tr><td><strong>Driven by</strong></td><td>Differences between groups</td><td>Similarities between groups</td></tr>
            <tr><td><strong>Analogy</strong></td><td>Cutting a cake into slices</td><td>Collecting slices back onto one plate</td></tr>
            <tr><td><strong>Example</strong></td><td>PERSON → STUDENT, TEACHER</td><td>CAR, TRUCK → VEHICLE</td></tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 Memory Trick</div>
        <div class="mnemonic-phrase">SPECIALization = SPLIT (both start with SP)</div>
        <p><strong>GENERAL</strong>ization makes things more <strong>general</strong> — it moves <em>up</em> to the general parent. Specialization moves <em>down</em> to the special children.</p>
      </div>

      <h3>Attribute Inheritance — What Exactly Is Inherited?</h3>
      <div class="definition-box">
        <div class="definition-title">📌 The Inheritance Rule</div>
        <p>An entity that is a member of a subclass inherits <strong>all attributes</strong> of its superclass <em>and</em> <strong>all relationships</strong> the superclass participates in. It is still the same real-world entity — it simply plays an additional, more specific role.</p>
      </div>
      <ul class="styled-list">
        <li>ENGINEER does <strong>not</strong> redeclare <code>Emp_ID</code>, <code>Name</code> or <code>Salary</code> — it already has them.</li>
        <li>If EMPLOYEE participates in WORKS_FOR DEPARTMENT, then every ENGINEER also works for a department automatically.</li>
        <li>Inheritance flows <strong>downward only</strong>. An EMPLOYEE does not get the engineer's licence number.</li>
        <li>The subclass has <strong>no key attribute of its own</strong> — it uses the superclass's primary key.</li>
      </ul>

      <div class="learn-box world-box">
        <div class="learn-title">🌍 Where You Have Already Seen This</div>
        <p>If you have met object-oriented programming, this is exactly a parent class and its child classes. <code>class Engineer extends Employee</code> is the code version of an IS-A relationship. The EER model borrowed the idea from OOP in the 1980s, which is why the vocabulary — inheritance, superclass, subclass — is identical.</p>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Worked Example</div>
        <div class="we-question">A bank keeps SAVINGS_ACCOUNT (acc_no, holder, balance, interest_rate) and CURRENT_ACCOUNT (acc_no, holder, balance, overdraft_limit). Improve the design and say which process you used.</div>
        <ol class="step-list">
          <li><strong>Look for repetition.</strong> <code>acc_no</code>, <code>holder</code> and <code>balance</code> appear in both entity types — a clear signal.</li>
          <li><strong>Decide the direction.</strong> Two specific entity types already exist and we want to pull out what they share → this is <strong>bottom-up</strong> → <strong>generalization</strong>.</li>
          <li><strong>Create the superclass:</strong> <code>ACCOUNT(<u>acc_no</u>, holder, balance)</code>.</li>
          <li><strong>Keep only the differences in the subclasses:</strong> SAVINGS_ACCOUNT keeps <code>interest_rate</code>; CURRENT_ACCOUNT keeps <code>overdraft_limit</code>. Both inherit the other three attributes.</li>
          <li><strong>Draw the IS-A link</strong> from the circle under ACCOUNT down to both subclasses.</li>
        </ol>
        <div class="we-answer"><strong>Answer:</strong> apply <strong>generalization</strong> to produce the superclass <code>ACCOUNT(acc_no, holder, balance)</code> with subclasses <code>SAVINGS_ACCOUNT(interest_rate)</code> and <code>CURRENT_ACCOUNT(overdraft_limit)</code> connected by an IS-A relationship. Common facts are now stored once instead of twice.</div>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"Explain specialization and generalization with suitable diagrams."</em> — very common. Draw the EMPLOYEE hierarchy, then the CAR/TRUCK → VEHICLE hierarchy, and finish with the comparison table (6–8 marks).</li>
          <li><em>"What is attribute inheritance in the EER model?"</em> — the inheritance rule + one example (3 marks).</li>
          <li><em>"What is an IS-A relationship?"</em> — definition + notation (2 marks).</li>
        </ul>
      </div>
    </div>
    `
  },

  /* ==================================================================== */
  /* 2.9                                                                   */
  /* ==================================================================== */
  {
    id: "u2-spec-gen-constraints",
    title: "2.9 Constraints & Characteristics of Specialization / Generalization",
    summary: "Disjoint vs overlapping, total vs partial, the four combinations, specialization hierarchies and lattices, multiple inheritance, union types (categories) and aggregation.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 4 (Sec. 4.3–4.5) | Silberschatz Ch. 7</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>Once you have split an entity into subclasses, two natural questions follow:</p>
        <ol>
          <li><strong>"Can one thing belong to two subclasses at the same time?"</strong> → the <strong>disjointness</strong> constraint (d or o).</li>
          <li><strong>"Must every thing belong to at least one subclass?"</strong> → the <strong>completeness</strong> constraint (total or partial).</li>
        </ol>
        <p>Answer those two questions and you have fully specified the specialization. That is the whole topic.</p>
      </div>

      <h3>Constraint 1 — Disjointness: Disjoint (d) vs Overlapping (o)</h3>
      <div class="compare-grid">
        <div class="compare-card compare-good">
          <h4>Disjoint — symbol <strong>d</strong></h4>
          <p>An entity can belong to <strong>at most one</strong> subclass.</p>
          <p><em>Example:</em> a VEHICLE is either a CAR or a TRUCK — never both at once.</p>
          <p><em>Another:</em> an EMPLOYEE is paid either HOURLY or SALARIED, not both.</p>
        </div>
        <div class="compare-card compare-bad">
          <h4>Overlapping — symbol <strong>o</strong></h4>
          <p>An entity may belong to <strong>several</strong> subclasses simultaneously.</p>
          <p><em>Example:</em> a PERSON in a university may be both a STUDENT <em>and</em> an EMPLOYEE (a teaching assistant).</p>
          <p><em>Another:</em> a PART may be both MANUFACTURED and PURCHASED.</p>
        </div>
      </div>

      <div class="note-figure">
        <img src="images/tp/unit2/specialization-product-full-hierarchy.png" alt="PRODUCT specialized into Electronics, Clothing and Books, each with its own extra attributes" class="note-img" loading="lazy" />
        <div class="figure-caption">Figure 2.28 (Source: Tpoint Tech) — A worked disjoint specialization: PRODUCT splits into ELECTRONICS, CLOTHING and BOOKS. Every product belongs to exactly one of the three — never two at once.</div>
      </div>

      <h3>Constraint 2 — Completeness: Total vs Partial</h3>
      <div class="compare-grid">
        <div class="compare-card compare-good">
          <h4>Total Specialization — <strong>double line</strong></h4>
          <p><strong>Every</strong> entity of the superclass must belong to at least one subclass. No entity is left over.</p>
          <p><em>Example:</em> every VEHICLE must be a CAR or a TRUCK — there is no third option.</p>
        </div>
        <div class="compare-card compare-bad">
          <h4>Partial Specialization — <strong>single line</strong></h4>
          <p>Some entities of the superclass may belong to <strong>no</strong> subclass at all.</p>
          <p><em>Example:</em> an EMPLOYEE might be a MANAGER or an ENGINEER — or just an ordinary employee who is neither.</p>
        </div>
      </div>

      <div class="note-figure">
        <img src="images/tp/unit2/generalization-employee-er-diagram.png" alt="Clerk, lab-assistant and Engineer generalized into Employee with an ER diagram" class="note-img" loading="lazy" />
        <div class="figure-caption">Figure 2.29 (Source: Tpoint Tech) — A total specialization drawn as a full ER diagram: every CLERK, LAB-ASSISTANT and ENGINEER is an EMPLOYEE, and (in this design) every employee falls into one of the three — nobody is left outside all three ovals.</div>
      </div>

      <hr class="section-divider" />

      <h3>The Four Combinations — Learn This Table</h3>
      <p>Because the two constraints are independent, there are exactly <strong>four</strong> possible kinds of specialization. Exams love asking you to classify an example.</p>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead>
            <tr><th style="width:22%">Combination</th><th style="width:18%">Notation</th><th>Meaning</th><th style="width:28%">Example</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>1. Disjoint + Total</strong></td><td><code>d</code> + double line</td>
              <td>Every entity is in exactly <strong>one</strong> subclass.</td>
              <td>Every VEHICLE is either a CAR or a TRUCK, and nothing else.</td>
            </tr>
            <tr>
              <td><strong>2. Disjoint + Partial</strong></td><td><code>d</code> + single line</td>
              <td>Every entity is in <strong>at most one</strong> subclass — possibly none.</td>
              <td>An EMPLOYEE may be a MANAGER or an ENGINEER, or neither, but never both.</td>
            </tr>
            <tr>
              <td><strong>3. Overlapping + Total</strong></td><td><code>o</code> + double line</td>
              <td>Every entity is in <strong>at least one</strong> subclass, possibly several.</td>
              <td>Every PART is MANUFACTURED or PURCHASED, and some are both.</td>
            </tr>
            <tr>
              <td><strong>4. Overlapping + Partial</strong></td><td><code>o</code> + single line</td>
              <td>The loosest case: an entity may be in none, one, or many subclasses.</td>
              <td>A PERSON at a university may be a STUDENT, an EMPLOYEE, both, or just a visitor.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="svg-figure">
        <svg viewBox="0 0 760 300" role="img" aria-label="Venn diagrams of disjoint versus overlapping specialization">
          <text x="190" y="26" text-anchor="middle" font-size="15" font-weight="700" fill="#10b981">Disjoint (d)</text>
          <ellipse cx="190" cy="150" rx="170" ry="106" fill="none" class="svg-stroke" stroke-width="2" stroke-dasharray="6 4"/>
          <text x="190" y="66" text-anchor="middle" font-size="12" class="svg-muted">superclass VEHICLE</text>
          <circle cx="125" cy="165" r="62" fill="rgba(16,185,129,0.20)" stroke="#10b981" stroke-width="2"/>
          <text x="125" y="170" text-anchor="middle" font-size="13" font-weight="700">CAR</text>
          <circle cx="258" cy="165" r="62" fill="rgba(6,182,212,0.20)" stroke="#06b6d4" stroke-width="2"/>
          <text x="258" y="170" text-anchor="middle" font-size="13" font-weight="700">TRUCK</text>
          <text x="190" y="278" text-anchor="middle" font-size="12" class="svg-muted">circles never touch — no entity in both</text>

          <text x="570" y="26" text-anchor="middle" font-size="15" font-weight="700" fill="#f59e0b">Overlapping (o)</text>
          <ellipse cx="570" cy="150" rx="170" ry="106" fill="none" class="svg-stroke" stroke-width="2" stroke-dasharray="6 4"/>
          <text x="570" y="66" text-anchor="middle" font-size="12" class="svg-muted">superclass PERSON</text>
          <circle cx="522" cy="165" r="66" fill="rgba(245,158,11,0.22)" stroke="#f59e0b" stroke-width="2"/>
          <circle cx="618" cy="165" r="66" fill="rgba(139,92,246,0.22)" stroke="#8b5cf6" stroke-width="2"/>
          <text x="488" y="170" text-anchor="middle" font-size="12" font-weight="700">STUDENT</text>
          <text x="656" y="170" text-anchor="middle" font-size="12" font-weight="700">EMPLOYEE</text>
          <text x="570" y="200" text-anchor="middle" font-size="10" font-weight="700" class="svg-muted">both</text>
          <text x="570" y="278" text-anchor="middle" font-size="12" class="svg-muted">shaded overlap = teaching assistants</text>
        </svg>
        <div class="figure-caption">Figure 2.30 — Disjoint subclasses never share members; overlapping subclasses do. The dashed outer ellipse is the superclass.</div>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 Memory Trick</div>
        <p><strong>d</strong> = <strong>d</strong>isjoint = <strong>d</strong>ivided, no sharing.<br>
        <strong>o</strong> = <strong>o</strong>verlapping = the letter <strong>o</strong> literally looks like two circles crossing.<br>
        <strong>Double line = total</strong> — exactly the same rule you already learned for total participation in topic 2.3. Double always means "compulsory".</p>
      </div>

      <hr class="section-divider" />

      <h3>Specialization Hierarchy vs Specialization Lattice</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:26%">Structure</th><th>Rule</th><th>Consequence</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Specialization Hierarchy</strong></td>
              <td>Every subclass has <strong>exactly one</strong> superclass. The shape is a tree.</td>
              <td>Single inheritance only.</td>
            </tr>
            <tr>
              <td><strong>Specialization Lattice</strong></td>
              <td>A subclass may have <strong>more than one</strong> superclass — a <em>shared subclass</em>.</td>
              <td><strong>Multiple inheritance</strong>: the subclass inherits attributes from every parent.</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p><strong>Classic lattice example:</strong> <code>ENGINEERING_MANAGER</code> is a subclass of <em>both</em> <code>ENGINEER</code> and <code>MANAGER</code> (and, through them, of <code>EMPLOYEE</code>). It inherits the engineering licence <em>and</em> the management allowance.</p>

      <hr class="section-divider" />

      <h3>Union Types (Categories)</h3>
      <div class="definition-box">
        <div class="definition-title">📌 Definition</div>
        <p>A <strong>category</strong> (or <strong>union type</strong>) is a subclass whose members come from the <strong>union of several different superclasses</strong>. Notation: a circle containing the letter <strong>∪</strong>.</p>
      </div>
      <div class="learn-box analogy-box">
        <div class="learn-title">🚙 Example</div>
        <p>A vehicle-registration office registers vehicles owned by a PERSON, a BANK, or a COMPANY. The entity <code>OWNER</code> is therefore the <em>union</em> of those three completely different entity types:</p>
        <p><code>OWNER = PERSON ∪ BANK ∪ COMPANY</code></p>
        <p>The key difference from ordinary inheritance: a category member inherits from <strong>only the one superclass it actually came from</strong> — an owner who is a company does not inherit a person's date of birth. This is called <strong>selective inheritance</strong>.</p>
      </div>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th>Basis</th><th>Shared Subclass (Lattice)</th><th>Category / Union Type</th></tr></thead>
          <tbody>
            <tr><td><strong>Relationship of superclasses</strong></td><td>The superclasses are related — they usually share an ancestor.</td><td>The superclasses are completely unrelated entity types.</td></tr>
            <tr><td><strong>Membership</strong></td><td>A member belongs to <strong>all</strong> superclasses at once (intersection).</td><td>A member belongs to <strong>exactly one</strong> superclass (union).</td></tr>
            <tr><td><strong>Inheritance</strong></td><td>Multiple inheritance — inherits from every parent.</td><td>Selective inheritance — inherits only from its own parent.</td></tr>
            <tr><td><strong>Symbol</strong></td><td>Ordinary ⊂ arcs from several parents.</td><td>Circle containing <strong>∪</strong>.</td></tr>
          </tbody>
        </table>
      </div>

      <hr class="section-divider" />

      <h3>Aggregation</h3>
      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p><strong>Aggregation</strong> solves one specific problem: the ER model does not normally let you draw a relationship <em>between a relationship and an entity</em>. Aggregation lets you treat an entire relationship as if it were a single entity, so you can then relate <em>that</em> to something else.</p>
      </div>
      <div class="learn-box analogy-box">
        <div class="learn-title">🏥 Example</div>
        <p>"A <strong>DOCTOR treats a PATIENT</strong>" is a relationship. Now we want to record: "…and a particular <strong>TEST</strong> was ordered <em>for that treatment</em>."</p>
        <p>The test is not linked to the doctor alone, nor to the patient alone — it is linked to the <em>treatment event</em>. So we draw a box around <code>DOCTOR—TREATS—PATIENT</code>, treat that whole box as one abstract entity, and connect TEST to it.</p>
      </div>

      <div class="svg-figure">
        <svg viewBox="0 0 760 320" role="img" aria-label="Aggregation: a box drawn around a relationship so it can be related to another entity">
          <rect x="40" y="40" width="440" height="160" rx="10" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="8 5"/>
          <text x="260" y="30" text-anchor="middle" font-size="13" font-weight="700" fill="#f59e0b">aggregation — treat this whole box as ONE entity</text>

          <rect x="70" y="95" width="130" height="50" rx="6" class="svg-panel" stroke-width="2"/>
          <text x="135" y="125" text-anchor="middle" font-size="14" font-weight="700">DOCTOR</text>

          <polygon points="290,85 350,120 290,155 230,120" fill="rgba(99,102,241,0.18)" stroke="#6366f1" stroke-width="2"/>
          <text x="290" y="124" text-anchor="middle" font-size="12" font-weight="700">TREATS</text>

          <rect x="350" y="95" width="120" height="50" rx="6" class="svg-panel" stroke-width="2"/>
          <text x="410" y="125" text-anchor="middle" font-size="14" font-weight="700">PATIENT</text>

          <line x1="200" y1="120" x2="230" y2="120" class="svg-line" stroke-width="2"/>
          <line x1="350" y1="120" x2="350" y2="120" class="svg-line" stroke-width="2"/>

          <line x1="260" y1="200" x2="260" y2="232" class="svg-line" stroke-width="2"/>
          <polygon points="330,212 390,247 330,282 270,247" fill="rgba(16,185,129,0.18)" stroke="#10b981" stroke-width="2"/>
          <text x="330" y="251" text-anchor="middle" font-size="11" font-weight="700">REQUIRES</text>
          <line x1="260" y1="232" x2="272" y2="240" class="svg-line" stroke-width="2"/>

          <rect x="440" y="222" width="130" height="50" rx="6" class="svg-panel" stroke-width="2"/>
          <text x="505" y="252" text-anchor="middle" font-size="14" font-weight="700">TEST</text>
          <line x1="390" y1="247" x2="440" y2="247" class="svg-line" stroke-width="2"/>

          <text x="640" y="120" text-anchor="middle" font-size="12" class="svg-muted">Without aggregation you</text>
          <text x="640" y="138" text-anchor="middle" font-size="12" class="svg-muted">could not draw a line from</text>
          <text x="640" y="156" text-anchor="middle" font-size="12" class="svg-muted">TEST to a diamond.</text>
        </svg>
        <div class="figure-caption">Figure 2.32 — Aggregation. The dashed box turns the TREATS relationship into a single abstract entity that REQUIRES can then connect to.</div>
      </div>

      <div class="note-figure">
        <img src="images/tp/unit2/aggregation-patient-doctor-diagnosis.png" alt="Patient, Diagnosis, Doctor aggregated and then connected to Patient History through Filling" class="note-img" loading="lazy" />
        <div class="figure-caption">Figure 2.33 (Source: Tpoint Tech) — A second aggregation example: PATIENT–DIAGNOSIS–DOCTOR is aggregated into one abstract entity, which the FILLING relationship then connects to PATIENT_HISTORY — the same trick used for DOCTOR–TREATS–PATIENT–REQUIRES–TEST above.</div>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Worked Example</div>
        <div class="we-question">A university models PERSON with subclasses STUDENT and STAFF. Some research assistants are both. Every person in the database is either a student or a staff member. State the two constraints and draw the notation.</div>
        <ol class="step-list">
          <li><strong>Can one person be in both subclasses?</strong> Yes — research assistants are both students and staff → <strong>overlapping</strong> → put <code>o</code> in the circle.</li>
          <li><strong>Must every person be in at least one subclass?</strong> Yes — "every person is either a student or staff" → <strong>total</strong> → draw a <strong>double line</strong> from PERSON to the circle.</li>
          <li><strong>Classify:</strong> this is combination 3 from the table — <strong>overlapping + total</strong>.</li>
          <li><strong>Draw:</strong> PERSON rectangle → double line down → circle containing <code>o</code> → two ⊂ arcs down to STUDENT and STAFF rectangles.</li>
          <li><strong>Note the inheritance:</strong> both subclasses inherit <code>person_id</code>, <code>name</code> and <code>address</code>; each adds only its own extras.</li>
        </ol>
        <div class="we-answer"><strong>Answer:</strong> an <strong>overlapping, total</strong> specialization — symbol <code>o</code> inside the circle, connected to PERSON by a double line.</div>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"Explain the constraints on specialization and generalization."</em> — the two constraints, the four-combination table, and the notation diagram (6–8 marks).</li>
          <li><em>"Differentiate between disjoint and overlapping specialization."</em> — the comparison cards + Venn diagram (4 marks).</li>
          <li><em>"What is aggregation? Why is it needed in the ER model?"</em> — "because ER does not allow a relationship to participate in another relationship" + the hospital example (4–5 marks).</li>
          <li><em>"What is a category / union type? How does it differ from a shared subclass?"</em> — the OWNER example + the comparison table (4 marks).</li>
        </ul>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ Common Mistake</div>
        <p>Mixing up the two constraints. They answer completely different questions:</p>
        <ul>
          <li><strong>d / o</strong> is about <em>overlap between subclasses</em> — can a thing be in two boxes?</li>
          <li><strong>total / partial</strong> is about <em>coverage of the superclass</em> — is any thing left outside all boxes?</li>
        </ul>
        <p>Every specialization needs an answer to <em>both</em>, which is why there are four combinations and not two.</p>
      </div>
    </div>
    `
  }
]);
