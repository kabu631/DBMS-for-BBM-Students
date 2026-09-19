/**
 * Unit 2 — Part 2 of 3: topics 2.5 – 2.7
 *   2.5 ER diagram notation, naming conventions and design issues
 *   2.6 Relationship types of degree higher than two
 *   2.7 Relational keys
 */

appendTopics("unit-2", [

  /* ==================================================================== */
  /* 2.5                                                                   */
  /* ==================================================================== */
  {
    id: "u2-er-notation-design",
    title: "2.5 ER Diagram Notation, Naming Conventions & Design Issues",
    summary: "The complete symbol sheet, the naming rules that keep a diagram readable, and the four classic design choices: attribute vs entity, entity vs relationship, binary vs ternary, and where to place an attribute.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 3 (Sec. 3.6, 3.7) | Silberschatz Ch. 6</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>By now you know all the pieces. This topic is about <strong>drawing them neatly and choosing between two designs that both "work"</strong>.</p>
        <p>Two designers given the same requirements will produce slightly different diagrams. Neither is "wrong" — but one is usually easier to live with. This topic gives you the rules for picking the better one, which is exactly what exam questions like "discuss the design issues in ER modelling" are testing.</p>
      </div>

      <h3>1. The Complete ER Symbol Sheet</h3>
      <p>Every symbol you need, in one table. Learn this and you can read or draw any ER diagram in the exam.</p>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:22%">Symbol</th><th style="width:26%">Represents</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td><strong>Rectangle</strong> ▭</td><td>Entity type</td><td>The nouns of your system.</td></tr>
            <tr><td><strong>Double rectangle</strong></td><td>Weak entity type</td><td>Cannot be identified on its own.</td></tr>
            <tr><td><strong>Ellipse</strong> ⬭</td><td>Attribute</td><td>Attached by a plain line to its entity.</td></tr>
            <tr><td><strong>Underlined ellipse</strong></td><td>Key attribute</td><td>Solid underline.</td></tr>
            <tr><td><strong>Dashed-underlined ellipse</strong></td><td>Partial key</td><td>Belongs to a weak entity.</td></tr>
            <tr><td><strong>Double ellipse</strong></td><td>Multivalued attribute</td><td>Several values at once.</td></tr>
            <tr><td><strong>Dashed ellipse</strong></td><td>Derived attribute</td><td>Calculated, never stored.</td></tr>
            <tr><td><strong>Ellipse with sub-ellipses</strong></td><td>Composite attribute</td><td>Children hang below the parent.</td></tr>
            <tr><td><strong>Diamond</strong> ◇</td><td>Relationship type</td><td>The verbs of your system.</td></tr>
            <tr><td><strong>Double diamond</strong></td><td>Identifying relationship</td><td>Connects a weak entity to its owner.</td></tr>
            <tr><td><strong>Single line</strong></td><td>Partial participation</td><td>Taking part is optional.</td></tr>
            <tr><td><strong>Double line</strong></td><td>Total participation</td><td>Taking part is compulsory.</td></tr>
            <tr><td><strong>1, N, M on lines</strong></td><td>Cardinality ratio</td><td>Or written as (min, max).</td></tr>
            <tr><td><strong>Line with an arrow</strong></td><td>"At most one" (Silberschatz style)</td><td>Arrow points to the "one" side.</td></tr>
            <tr><td><strong>Circle with ⊂ / d / o</strong></td><td>Specialization (EER)</td><td>Covered in topic 2.8.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="note-figure">
        <img src="images/tp/unit2/er-model-taxonomy.png" alt="ER Model broken down into Entity (Strong/Weak), Attribute (Key/Composite/Multivalued/Derived/Simple) and Relationship (1:1/1:N/N:1/M:N)" class="note-img" loading="lazy" />
        <div class="figure-caption">Figure 2.19 (Source: Tpoint Tech) — The whole ER model in one glance: every construct you have learned falls under Entity, Attribute or Relationship. This single tree is worth printing and sticking on your wall before the exam.</div>
      </div>

      <hr class="section-divider" />

      <h3>2. Naming Conventions</h3>
      <p>Marks are quietly lost for messy naming. Follow these five rules and your diagram reads like a sentence.</p>

      <div class="grid-2col">
        <div class="feature-card">
          <h4>① Entity names — singular nouns, UPPERCASE</h4>
          <p>Write <code>STUDENT</code>, not <code>Students</code> or <code>student_table</code>. The rectangle represents the <em>type</em>, which is singular.</p>
        </div>
        <div class="feature-card">
          <h4>② Relationship names — verbs</h4>
          <p>Write <code>WORKS_FOR</code>, <code>ENROLLS_IN</code>, <code>SUPPLIES</code>. A relationship called "STUDENT_COURSE" tells the reader nothing.</p>
        </div>
        <div class="feature-card">
          <h4>③ Attribute names — singular, Capitalised</h4>
          <p><code>Emp_Name</code>, <code>Date_of_Birth</code>. Exception: a multivalued attribute may be named in the plural, e.g. <code>Phone_Numbers</code>.</p>
        </div>
        <div class="feature-card">
          <h4>④ Read left-to-right, top-to-bottom</h4>
          <p>Place entities so the relationship name reads naturally in that direction: <code>EMPLOYEE → WORKS_FOR → DEPARTMENT</code>.</p>
        </div>
        <div class="feature-card">
          <h4>⑤ Use the requirement document's own words</h4>
          <p>If the client says "patient" everywhere, do not rename it "customer". The diagram must be reviewable by the client.</p>
        </div>
        <div class="feature-card">
          <h4>⑥ Avoid crossing lines</h4>
          <p>Rearrange boxes until lines do not cross. A diagram nobody can follow has failed its only job.</p>
        </div>
      </div>

      <hr class="section-divider" />

      <h3>3. Design Issues — Choosing Between Two Valid Designs</h3>
      <p>These four questions come up in every real design, and they are a favourite long-answer exam question.</p>

      <h4 style="margin-top:18px;">Issue 1 — Should this be an Attribute or an Entity?</h4>
      <div class="compare-grid">
        <div class="compare-card compare-bad">
          <h4>As an attribute</h4>
          <p><code>EMPLOYEE(Emp_ID, Name, Dept_Name)</code></p>
          <p>Simple, but the department's own details (location, budget, head) have nowhere to live, and the department name is repeated in every employee row.</p>
        </div>
        <div class="compare-card compare-good">
          <h4>As a separate entity</h4>
          <p><code>EMPLOYEE — WORKS_FOR — DEPARTMENT</code></p>
          <p>Department now has its own attributes, no repetition, and it can be related to other entities too.</p>
        </div>
      </div>
      <div class="learn-box memory-box">
        <div class="learn-title">🧠 The Deciding Rule</div>
        <p>Make it an <strong>entity</strong> if it has <strong>attributes of its own</strong>, or if it takes part in <strong>relationships of its own</strong>. Otherwise leave it as a simple attribute.</p>
      </div>

      <h4 style="margin-top:22px;">Issue 2 — Should this be an Entity or a Relationship?</h4>
      <p>"A student <em>registers for</em> a course" — is REGISTRATION a relationship, or is it an entity in its own right?</p>
      <ul class="styled-list">
        <li>If it only <strong>links</strong> two things → keep it a <strong>relationship</strong> (a diamond).</li>
        <li>If it has its <strong>own identity</strong> and needs to relate to <em>other</em> entities (e.g. a REGISTRATION generates a PAYMENT and has a RECEIPT) → promote it to an <strong>entity</strong>.</li>
      </ul>
      <p>A useful test: <em>can you point at one of them and give it a number?</em> "Registration number 4417" sounds natural → make it an entity. "Works-for number 12" sounds absurd → keep it a relationship.</p>

      <h4 style="margin-top:22px;">Issue 3 — Binary or Ternary relationship?</h4>
      <p>Covered in detail in topic 2.6. Short version: <strong>prefer binary relationships unless the fact genuinely involves all three entities at once</strong>.</p>

      <h4 style="margin-top:22px;">Issue 4 — Where should this attribute be placed?</h4>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th>Situation</th><th>Where the Attribute Belongs</th><th>Example</th></tr></thead>
          <tbody>
            <tr><td>The fact describes one entity only</td><td>On that entity</td><td><code>Salary</code> → EMPLOYEE</td></tr>
            <tr><td>The fact only exists because of the link, relationship is 1:N</td><td>On the relationship, or move it to the entity on the N side</td><td><code>Start_Date</code> on WORKS_FOR</td></tr>
            <tr><td>The fact only exists because of the link, relationship is M:N</td><td><strong>Must</strong> stay on the relationship</td><td><code>Grade</code> on ENROLLS, <code>Hours</code> on WORKS_ON</td></tr>
          </tbody>
        </table>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Worked Example</div>
        <div class="we-question">A library says: "We record each book's title, ISBN, and publisher. For each publisher we also need the address and contact person. A member borrows a book on a date and returns it on another date." Critique the naive design <code>BOOK(ISBN, Title, Publisher_Name, Publisher_Address)</code> and produce a better one.</div>
        <ol class="step-list">
          <li><strong>Spot the problem:</strong> <code>Publisher_Address</code> is a fact about the <em>publisher</em>, not about the book. Storing it on BOOK repeats the same address on every book from that publisher.</li>
          <li><strong>Apply the Issue-1 rule:</strong> Publisher has attributes of its own (address, contact person) → it must be promoted from an attribute to an <strong>entity</strong>.</li>
          <li><strong>Add the relationship:</strong> <code>PUBLISHER —1— PUBLISHES —N— BOOK</code>. One publisher publishes many books; each book has one publisher.</li>
          <li><strong>Handle borrowing:</strong> "borrows on a date and returns on another date" — a member borrows many books over time and a book is borrowed by many members over time → <strong>M:N</strong>.</li>
          <li><strong>Apply the Issue-4 rule:</strong> <code>Issue_Date</code> and <code>Return_Date</code> describe neither the member alone nor the book alone; the relationship is M:N, so they <strong>must</strong> be attributes of the BORROWS relationship.</li>
        </ol>
        <div class="we-answer"><strong>Better design:</strong><br>
        <code>PUBLISHER(<u>Pub_ID</u>, Pub_Name, Address, Contact_Person)</code><br>
        <code>BOOK(<u>ISBN</u>, Title)</code><br>
        <code>MEMBER(<u>Member_ID</u>, Name)</code><br>
        Relationships: <code>PUBLISHER —1:N— PUBLISHES — BOOK</code> and <code>MEMBER —M:N— BORROWS(Issue_Date, Return_Date)— BOOK</code>.</div>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"Discuss the design issues in ER modelling."</em> — cover all four issues, one short example each (6–8 marks).</li>
          <li><em>"When should a concept be modelled as an entity rather than an attribute?"</em> — the deciding rule + example (3 marks).</li>
          <li><em>"Draw the ER diagram for the following case study…"</em> — 10–15 marks in almost every paper. Use the symbol sheet, label every cardinality, and mark total participation with double lines.</li>
        </ul>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ Exam-Day Checklist for Any ER Diagram You Draw</div>
        <ol>
          <li>Is every entity a <strong>rectangle</strong> with a <strong>singular, uppercase noun</strong>?</li>
          <li>Does every entity have its key attribute <strong>underlined</strong>?</li>
          <li>Is every relationship a <strong>diamond with a verb</strong>?</li>
          <li>Is a cardinality ratio (1, N, M) written on <strong>every</strong> relationship line?</li>
          <li>Have you marked total participation with <strong>double lines</strong> where required?</li>
          <li>Are multivalued attributes double ellipses and derived attributes dashed?</li>
        </ol>
        <p>Six ticks = full notation marks, even if your design differs slightly from the model answer.</p>
      </div>
    </div>
    `
  },

  /* ==================================================================== */
  /* 2.6                                                                   */
  /* ==================================================================== */
  {
    id: "u2-higher-degree",
    title: "2.6 Relationship Types of Degree Higher Than Two",
    summary: "Ternary and n-ary relationships: when you genuinely need one, why three binaries are not the same thing, constraints on n-ary relationships, and how to map them to tables.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 3 (Sec. 3.9) | Silberschatz Ch. 6</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>Most relationships connect <strong>two</strong> entities. Sometimes a single fact only makes sense when <strong>three</strong> entities are named together.</p>
        <p>Example: <em>"Supplier Ram supplies bolts to the Bridge Project."</em> Remove any one of the three names and the sentence stops being a fact. That is a <strong>ternary relationship</strong> — one diamond with three lines coming out of it.</p>
      </div>

      <div class="learn-box analogy-box">
        <div class="learn-title">🍽️ Everyday Analogy</div>
        <p>A restaurant booking: <em>"Table 7, at 8 pm, for the Sharma family."</em></p>
        <p>You cannot split that into three separate facts — "table 7 exists", "8 pm exists", "the Sharma family exists" — and get the booking back. The three only mean something <strong>together</strong>. That is the test for a ternary relationship.</p>
      </div>

      <h3>The Classic Example: SUPPLY</h3>
      <div class="svg-figure">
        <svg viewBox="0 0 800 340" role="img" aria-label="Ternary relationship SUPPLY connecting SUPPLIER, PART and PROJECT">
          <rect x="40" y="30" width="140" height="50" rx="6" class="svg-panel" stroke-width="2"/>
          <text x="110" y="60" text-anchor="middle" font-size="14" font-weight="700">SUPPLIER</text>

          <rect x="620" y="30" width="140" height="50" rx="6" class="svg-panel" stroke-width="2"/>
          <text x="690" y="60" text-anchor="middle" font-size="14" font-weight="700">PROJECT</text>

          <rect x="330" y="270" width="140" height="50" rx="6" class="svg-panel" stroke-width="2"/>
          <text x="400" y="300" text-anchor="middle" font-size="14" font-weight="700">PART</text>

          <polygon points="400,110 480,155 400,200 320,155" fill="rgba(139,92,246,0.2)" stroke="#8b5cf6" stroke-width="2.5"/>
          <text x="400" y="160" text-anchor="middle" font-size="14" font-weight="700">SUPPLY</text>

          <line x1="180" y1="62" x2="322" y2="145" class="svg-line" stroke-width="2"/>
          <line x1="478" y1="145" x2="620" y2="62" class="svg-line" stroke-width="2"/>
          <line x1="400" y1="200" x2="400" y2="270" class="svg-line" stroke-width="2"/>

          <text x="238" y="94" font-size="14" font-weight="700" fill="#8b5cf6">M</text>
          <text x="552" y="94" font-size="14" font-weight="700" fill="#8b5cf6">N</text>
          <text x="412" y="240" font-size="14" font-weight="700" fill="#8b5cf6">P</text>

          <ellipse cx="580" cy="200" rx="66" ry="24" fill="rgba(139,92,246,0.10)" stroke="#8b5cf6" stroke-width="1.5"/>
          <text x="580" y="205" text-anchor="middle" font-size="12">Quantity</text>
          <line x1="480" y1="172" x2="518" y2="192" class="svg-line" stroke-width="1.5"/>

          <text x="400" y="30" text-anchor="middle" font-size="12" class="svg-muted">One fact: "this supplier supplied this part to this project"</text>
        </svg>
        <div class="figure-caption">Figure 2.20 — A ternary relationship. The diamond has three lines, the cardinality is written M:N:P, and <code>Quantity</code> is an attribute of the relationship itself.</div>
      </div>

      <div class="note-figure">
        <img src="images/tp/unit2/ternary-relationship-employee-job-branch.png" alt="EMPLOYEE, JOB and BRANCH connected through the ternary relationship works for" class="note-img" loading="lazy" />
        <div class="figure-caption">Figure 2.21 (Source: Tpoint Tech) — Another genuine ternary relationship: EMPLOYEE–JOB–BRANCH, connected by a single diamond "works for". Exactly like SUPPLY, the fact only makes sense with all three names present together.</div>
      </div>

      <hr class="section-divider" />

      <h3>Why Three Binary Relationships Are NOT the Same Thing</h3>
      <p>This is the single most important point of the topic, and it is where exam marks are won.</p>

      <div class="compare-grid">
        <div class="compare-card compare-good">
          <h4>✔ One ternary SUPPLY(S, P, J)</h4>
          <p>Stores the fact: <em>"Ram supplied bolts to the Bridge project."</em></p>
          <p>The three names are locked together in one row. Nothing is lost.</p>
        </div>
        <div class="compare-card compare-bad">
          <h4>✘ Three binaries: CAN_SUPPLY(S,P), USES(P,J), WORKS_ON(S,J)</h4>
          <p>Stores only: <em>"Ram can supply bolts", "the Bridge project uses bolts", "Ram works on the Bridge project."</em></p>
          <p>All three can be true while Ram actually supplied the bolts to a <em>different</em> project, and cement to the Bridge. <strong>The combined fact is lost.</strong></p>
        </div>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 The One-Sentence Test</div>
        <p>Write the fact as an English sentence. <strong>Delete one entity name.</strong> If the sentence still carries a complete, useful fact, you do not need a ternary — use binaries. If the sentence collapses into nonsense, you need the ternary.</p>
      </div>

      <h3>Cardinality on an n-ary Relationship</h3>
      <div class="definition-box">
        <div class="definition-title">📌 How to Read M:N:P</div>
        <p>For an n-ary relationship, the cardinality written next to one entity means: <strong>"for each fixed combination of all the OTHER entities, how many of this entity can appear?"</strong></p>
      </div>
      <p>So in SUPPLY, if PROJECT is labelled <strong>1</strong>, it means: for a given (supplier, part) pair, there is at most <strong>one</strong> project. In practice most n-ary relationships are M:N:P (many on every side).</p>

      <h3>Mapping an n-ary Relationship to Tables</h3>
      <p>The rule is simple and does not change with the cardinality: <strong>an n-ary relationship always becomes its own table</strong> whose primary key is the combination of all the participating keys.</p>

      <div class="code-block">
        <div class="code-header"><span>SQL — mapping the ternary SUPPLY relationship</span></div>
        <div class="code-content"><pre>CREATE TABLE supplier (sup_id  INT PRIMARY KEY, sup_name VARCHAR(60));
CREATE TABLE part     (part_id INT PRIMARY KEY, part_name VARCHAR(60));
CREATE TABLE project  (proj_id INT PRIMARY KEY, proj_name VARCHAR(60));

-- The ternary relationship becomes its own table:
CREATE TABLE supply (
  sup_id   INT,
  part_id  INT,
  proj_id  INT,
  quantity INT NOT NULL,                       -- relationship attribute
  PRIMARY KEY (sup_id, part_id, proj_id),      -- all three keys together
  FOREIGN KEY (sup_id)  REFERENCES supplier(sup_id),
  FOREIGN KEY (part_id) REFERENCES part(part_id),
  FOREIGN KEY (proj_id) REFERENCES project(proj_id)
);</pre></div>
      </div>

      <div class="learn-box world-box">
        <div class="learn-title">🌍 In Practice</div>
        <p>Ternary relationships are real but uncommon — perhaps one in every twenty relationships. Quaternary (degree 4) relationships are rarer still. If your diagram is full of ternary diamonds, you have almost certainly missed an entity that should have been promoted (see design Issue 2 in topic 2.5).</p>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Worked Example</div>
        <div class="we-question">A hospital records: "Doctor Sharma prescribed Paracetamol to patient Sita." Should this be one ternary relationship or three binary relationships? Justify and give the table.</div>
        <ol class="step-list">
          <li><strong>Write the fact and delete one name.</strong> "Doctor Sharma prescribed Paracetamol" — to whom? Incomplete. "Paracetamol was prescribed to Sita" — by whom? Incomplete.</li>
          <li><strong>Conclusion:</strong> the fact only survives when all three are present → a genuine <strong>ternary relationship</strong> PRESCRIBES(DOCTOR, MEDICINE, PATIENT).</li>
          <li><strong>Check for relationship attributes:</strong> dosage and date belong to the prescription event, not to the doctor, the medicine or the patient alone → attributes of the relationship.</li>
          <li><strong>Cardinality:</strong> a doctor prescribes many medicines to many patients; a medicine is prescribed by many doctors to many patients → <strong>M:N:P</strong>.</li>
          <li><strong>Map to a table</strong> with a composite key of all three foreign keys — plus <code>date</code> in the key if the same prescription can be repeated on different days.</li>
        </ol>
        <div class="we-answer"><strong>Answer:</strong> one ternary relationship <code>PRESCRIBES(doctor_id, medicine_id, patient_id, dosage, presc_date)</code> with primary key <code>(doctor_id, medicine_id, patient_id, presc_date)</code>. Three binaries would lose the link between <em>which</em> doctor gave <em>which</em> medicine to <em>which</em> patient.</div>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"Explain relationship types of degree higher than two with an example."</em> — the SUPPLY diagram + the "three binaries lose information" argument (5–6 marks).</li>
          <li><em>"Differentiate between a ternary relationship and three binary relationships."</em> — the comparison cards above; always include a concrete counter-example (4–5 marks).</li>
        </ul>
      </div>
    </div>
    `
  },

  /* ==================================================================== */
  /* 2.7                                                                   */
  /* ==================================================================== */
  {
    id: "u2-keys",
    title: "2.7 Relational Keys — Super, Candidate, Primary, Alternate, Composite, Foreign & Surrogate",
    summary: "Every kind of key, how they nest inside each other, how to find candidate keys from a table, and the rules a primary key and a foreign key must obey.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 5 | Silberschatz Ch. 2</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>A <strong>key</strong> is simply a column (or a group of columns) that lets you point at <strong>exactly one row</strong> and never accidentally two.</p>
        <p>Every different key name you are about to learn is answering the same question — "which columns identify a row?" — just with a different amount of extra baggage attached.</p>
      </div>

      <div class="learn-box analogy-box">
        <div class="learn-title">🪪 Everyday Analogy — Identifying a Person in Nepal</div>
        <ul>
          <li><strong>Citizenship number</strong> alone identifies you → a <em>candidate key</em>.</li>
          <li><strong>Passport number</strong> alone also identifies you → another <em>candidate key</em>.</li>
          <li><strong>Citizenship number + your name + your shoe size</strong> also identifies you, but with useless extra baggage → a <em>super key</em>.</li>
          <li>The government picks <strong>one</strong> of them for official forms → the <em>primary key</em>.</li>
          <li>The one it did not pick is still perfectly valid → the <em>alternate key</em>.</li>
        </ul>
      </div>

      <h3>The Key Hierarchy — One Picture That Explains Everything</h3>
      <div class="svg-figure">
        <svg viewBox="0 0 700 330" role="img" aria-label="Nested circles showing super key contains candidate key contains primary key">
          <ellipse cx="350" cy="165" rx="330" ry="150" fill="rgba(99,102,241,0.10)" stroke="#6366f1" stroke-width="2"/>
          <text x="350" y="42" text-anchor="middle" font-size="16" font-weight="700" fill="#6366f1">SUPER KEYS</text>
          <text x="350" y="62" text-anchor="middle" font-size="12" class="svg-muted">any set of columns that is unique (extra columns allowed)</text>

          <ellipse cx="350" cy="190" rx="238" ry="105" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" stroke-width="2"/>
          <text x="350" y="112" text-anchor="middle" font-size="15" font-weight="700" fill="#06b6d4">CANDIDATE KEYS</text>
          <text x="350" y="130" text-anchor="middle" font-size="12" class="svg-muted">minimal super keys — remove any column and uniqueness breaks</text>

          <ellipse cx="270" cy="212" rx="118" ry="64" fill="rgba(16,185,129,0.16)" stroke="#10b981" stroke-width="2"/>
          <text x="270" y="206" text-anchor="middle" font-size="14" font-weight="700" fill="#10b981">PRIMARY KEY</text>
          <text x="270" y="226" text-anchor="middle" font-size="11" class="svg-muted">the one you chose</text>

          <ellipse cx="480" cy="212" rx="108" ry="58" fill="rgba(245,158,11,0.16)" stroke="#f59e0b" stroke-width="2"/>
          <text x="480" y="206" text-anchor="middle" font-size="14" font-weight="700" fill="#f59e0b">ALTERNATE KEYS</text>
          <text x="480" y="226" text-anchor="middle" font-size="11" class="svg-muted">the ones you did not</text>

          <text x="350" y="308" text-anchor="middle" font-size="13" class="svg-muted">Every candidate key is a super key. Exactly one candidate key is promoted to primary key.</text>
        </svg>
        <div class="figure-caption">Figure 2.22 — The nesting of keys. If you can redraw these three circles from memory, you can answer any key question in the exam.</div>
      </div>

      <hr class="section-divider" />

      <h3>Sample Table Used Throughout This Topic</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th>Roll_No</th><th>Citizenship_No</th><th>Name</th><th>Email</th><th>Dept_ID</th></tr></thead>
          <tbody>
            <tr><td>101</td><td>27-01-75-00121</td><td>Ramesh Thapa</td><td>ramesh@clg.edu.np</td><td>D01</td></tr>
            <tr><td>102</td><td>27-01-75-00988</td><td>Sita Karki</td><td>sita@clg.edu.np</td><td>D02</td></tr>
            <tr><td>103</td><td>31-02-76-00455</td><td>Ramesh Thapa</td><td>ramesh2@clg.edu.np</td><td>D01</td></tr>
          </tbody>
        </table>
      </div>
      <p>Notice row 1 and row 3 share the same <code>Name</code> — proof that <code>Name</code> can never be a key.</p>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:16%">Key Type</th><th style="width:30%">Definition</th><th>In the STUDENT Table Above</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>Super Key</strong></td>
              <td>Any set of one or more attributes whose combined values are unique for every row. Extra, unnecessary attributes are allowed.</td>
              <td><code>{Roll_No}</code>, <code>{Roll_No, Name}</code>, <code>{Citizenship_No, Email, Name}</code> — there are dozens.</td>
            </tr>
            <tr>
              <td><strong>Candidate Key</strong></td>
              <td>A <strong>minimal</strong> super key — no attribute can be removed without losing uniqueness.</td>
              <td><code>{Roll_No}</code>, <code>{Citizenship_No}</code>, <code>{Email}</code> — three candidate keys.</td>
            </tr>
            <tr>
              <td><strong>Primary Key (PK)</strong></td>
              <td>The one candidate key the designer chooses to identify rows. Must be <strong>unique</strong> and <strong>NOT NULL</strong>.</td>
              <td><code>Roll_No</code> (short, stable, never changes).</td>
            </tr>
            <tr>
              <td><strong>Alternate Key</strong></td>
              <td>Every candidate key that was <em>not</em> chosen as the primary key. Usually enforced with <code>UNIQUE</code>.</td>
              <td><code>Citizenship_No</code> and <code>Email</code>.</td>
            </tr>
            <tr>
              <td><strong>Composite Key</strong></td>
              <td>A key made of <strong>two or more</strong> attributes together, because no single attribute is unique on its own.</td>
              <td>In a marks table: <code>(Roll_No, Subject_Code)</code>.</td>
            </tr>
            <tr>
              <td><strong>Foreign Key (FK)</strong></td>
              <td>An attribute in one table that refers to the primary key of another table. It creates the actual link between tables.</td>
              <td><code>Dept_ID</code> referring to <code>DEPARTMENT(Dept_ID)</code>.</td>
            </tr>
            <tr>
              <td><strong>Surrogate Key</strong></td>
              <td>An artificial, system-generated number with no real-world meaning, added purely to act as a simple primary key.</td>
              <td>An auto-increment <code>Student_SK</code> column.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="img-grid-2col">
        <div class="note-figure">
          <img src="images/tp/unit2/keys-taxonomy-rings.png" alt="Keys taxonomy: Primary, Candidate, Super, Foreign, Alternate, Composite and Artificial key" class="note-img" loading="lazy" />
          <div class="figure-caption">Figure 2.23 (Source: Tpoint Tech) — The complete taxonomy of keys used in the relational model.</div>
        </div>
        <div class="note-figure">
          <img src="images/tp/unit2/foreign-key-employee-department.png" alt="Foreign key Department_ID in the EMPLOYEE table pointing at the DEPARTMENT table" class="note-img" loading="lazy" />
          <div class="figure-caption">Figure 2.24 (Source: Tpoint Tech) — A foreign key (<code>Department_ID</code>) in the child table pointing at the primary key of the parent table.</div>
        </div>
      </div>

      <hr class="section-divider" />

      <h3>Every Key Type, on the Same EMPLOYEE Table</h3>
      <p>Seeing every key type applied to one consistent example makes the differences click. All six diagrams below use the same <code>EMPLOYEE(Employee_ID, Employee_Name, Employee_Address, Passport_Number, License_Number, SSN)</code> table.</p>

      <div class="img-grid-3col">
        <div class="note-figure">
          <img src="images/tp/unit2/super-key-employee.png" alt="Employee_ID and Employee_Name together marked as a super key" class="note-img" loading="lazy" />
          <div class="figure-caption">Super key — {Employee_ID, Employee_Name} is unique, even though Employee_Name is unnecessary baggage.</div>
        </div>
        <div class="note-figure">
          <img src="images/tp/unit2/candidate-key-employee.png" alt="Passport_Number, License_Number and SSN each bracketed as candidate keys" class="note-img" loading="lazy" />
          <div class="figure-caption">Candidate keys — Passport_Number, License_Number and SSN are each minimal on their own.</div>
        </div>
        <div class="note-figure">
          <img src="images/tp/unit2/primary-key-employee.png" alt="Employee_ID marked as the primary key with an arrow" class="note-img" loading="lazy" />
          <div class="figure-caption">Primary key — Employee_ID is the one candidate key chosen to identify every row.</div>
        </div>
        <div class="note-figure">
          <img src="images/tp/unit2/alternate-key-employee.png" alt="Employee_ID as primary key and PAN_No as alternate key, both candidate keys" class="note-img" loading="lazy" />
          <div class="figure-caption">Alternate key — PAN_No was also a candidate key, but was not chosen as primary.</div>
        </div>
        <div class="note-figure">
          <img src="images/tp/unit2/composite-key-employee.png" alt="Emp_Id, Emp_Role and Proj_Id together forming a composite key" class="note-img" loading="lazy" />
          <div class="figure-caption">Composite key — (Emp_Id, Emp_Role, Proj_Id) together identify a row; no single one of them does alone.</div>
        </div>
        <div class="note-figure">
          <img src="images/tp/unit2/surrogate-key-employee.png" alt="An artificial Row_Id column added purely to act as a key" class="note-img" loading="lazy" />
          <div class="figure-caption">Surrogate key — Row_Id is an artificial, system-generated identifier with no business meaning.</div>
        </div>
      </div>

      <hr class="section-divider" />

      <h3>Rules a Primary Key Must Obey</h3>
      <ul class="styled-list">
        <li><strong>Unique:</strong> no two rows may share the same value.</li>
        <li><strong>Not NULL:</strong> this is the <em>entity integrity rule</em> — you cannot identify a row by a value that is missing.</li>
        <li><strong>Stable:</strong> its value should never need to change. (This is why phone numbers and email addresses make poor primary keys.)</li>
        <li><strong>Minimal:</strong> use the fewest columns that do the job.</li>
        <li><strong>Only one per table.</strong> A table has exactly one primary key, though it may consist of several columns.</li>
      </ul>

      <h3>Rules a Foreign Key Must Obey</h3>
      <ul class="styled-list">
        <li>Its value must either <strong>match an existing primary key value</strong> in the referenced table, or be <strong>NULL</strong>. This is the <em>referential integrity rule</em>.</li>
        <li>A table may have <strong>many</strong> foreign keys.</li>
        <li>A foreign key <em>may</em> contain duplicates (many employees can share one <code>dept_id</code>) and <em>may</em> be NULL (unless declared NOT NULL).</li>
        <li>A foreign key may refer back to the <strong>same</strong> table — that is how a recursive relationship such as <code>manager_id</code> is stored.</li>
      </ul>

      <div class="code-block">
        <div class="code-header"><span>SQL — declaring every kind of key</span></div>
        <div class="code-content"><pre>CREATE TABLE department (
  dept_id   CHAR(3) PRIMARY KEY,
  dept_name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE student (
  roll_no        INT PRIMARY KEY,           -- primary key
  citizenship_no VARCHAR(20) UNIQUE,        -- alternate key
  email          VARCHAR(80) UNIQUE,        -- alternate key
  name           VARCHAR(60) NOT NULL,
  dept_id        CHAR(3),
  FOREIGN KEY (dept_id) REFERENCES department(dept_id)   -- foreign key
);

CREATE TABLE marks (
  roll_no      INT,
  subject_code CHAR(6),
  score        DECIMAL(5,2),
  PRIMARY KEY (roll_no, subject_code),      -- composite primary key
  FOREIGN KEY (roll_no) REFERENCES student(roll_no)
);</pre></div>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Worked Example — Finding Candidate Keys</div>
        <div class="we-question">For <code>EMPLOYEE(Emp_ID, PAN_No, Email, Name, Dept_ID)</code> where Emp_ID, PAN_No and Email are each unique, list two super keys, all candidate keys, choose a primary key, and name the alternate keys.</div>
        <ol class="step-list">
          <li><strong>Find what is unique on its own:</strong> Emp_ID ✔, PAN_No ✔, Email ✔. Name ✘ (two people can share a name), Dept_ID ✘ (many employees per department).</li>
          <li><strong>Super keys</strong> = any unique set, baggage allowed. Examples: <code>{Emp_ID}</code>, <code>{Emp_ID, Name}</code>, <code>{PAN_No, Dept_ID, Name}</code>.</li>
          <li><strong>Candidate keys</strong> = the minimal ones. Strip the baggage: <code>{Emp_ID}</code>, <code>{PAN_No}</code>, <code>{Email}</code>. Each loses uniqueness if you remove its only column, so all three are minimal.</li>
          <li><strong>Choose the primary key.</strong> Prefer short, numeric, stable and never-changing → <code>Emp_ID</code>. (Email is a poor choice: people change email addresses.)</li>
          <li><strong>Alternate keys</strong> are the leftovers: <code>PAN_No</code> and <code>Email</code>, each declared <code>UNIQUE</code>.</li>
        </ol>
        <div class="we-answer"><strong>Answer:</strong> Candidate keys = {Emp_ID}, {PAN_No}, {Email}. Primary key = Emp_ID. Alternate keys = PAN_No, Email. <code>Dept_ID</code> is a foreign key, not a candidate key.</div>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 Memory Trick</div>
        <p><strong>Super</strong> key = <strong>S</strong>urplus allowed.<br>
        <strong>Candidate</strong> key = has "<strong>cand</strong>idated" (applied) for the job, and is lean enough to do it.<br>
        <strong>Primary</strong> key = the candidate that <strong>won the election</strong>.<br>
        <strong>Alternate</strong> key = the candidate that <strong>lost but is still qualified</strong>.</p>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"Define super key, candidate key, primary key, alternate key and foreign key with examples."</em> — near-certain question. Draw the three nested circles and use one sample table for all five (6–8 marks).</li>
          <li><em>"Given the relation R(A,B,C,D) with these dependencies, find all candidate keys."</em> — a numerical question; see Unit 4 topic 4.2 for the attribute-closure method.</li>
          <li><em>"Why must a primary key be NOT NULL?"</em> — entity integrity: a missing value cannot identify a row (2 marks).</li>
        </ul>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ Common Mistakes</div>
        <ul>
          <li>Saying "every super key is a candidate key". It is the other way round: <strong>every candidate key is a super key</strong>, but a super key with extra columns is not minimal, so it is not a candidate key.</li>
          <li>Claiming a foreign key must be unique. It must not be — that is precisely how one department holds many employees.</li>
          <li>Forgetting that a composite <em>primary</em> key means <em>all</em> its columns must be NOT NULL.</li>
        </ul>
      </div>
    </div>
    `
  }
]);
