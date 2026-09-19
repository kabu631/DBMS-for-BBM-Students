/**
 * Unit 2 — Data Modeling Using the Entity-Relationship Model and the
 * Relational Model (10 Lecture Hours).
 *
 * Part 1 of 2: topics 2.1 – 2.4. Part 2 (unit-2b.js) adds 2.5 – 2.10 plus the
 * unit intro, exam corner and quiz.
 */

registerUnit({
  id: "unit-2",
  number: "Unit 2",
  title: "Data Modeling Using ER Model & Relational Model",
  subtitle: "Drawing the picture of a database before you build it — entities, attributes, relationships, EER, and turning the picture into tables",
  readingTime: "10 Lecture Hours (LHs)",
  description: "Using High-Level Conceptual Data Models for Database Design; Entity Types, Entity Sets, Attributes, and Keys; Relationship Types, Relationship Sets, Roles, and Structural Constraints; Weak Entity Types; ER Diagrams, Naming Conventions, and Design Issues; Relationship Types of Degree Higher Than Two; Concepts of Specialization and Generalization; Constraints and Characteristics of Specialization and Generalization; Converting ER Schema to Relational Schema; Structure of the Relational Database.",
  topics: [

    /* ================================================================== */
    /* 2.1                                                                 */
    /* ================================================================== */
    {
      id: "u2-design-process",
      title: "2.1 Database Design Process & High-Level Conceptual Data Models",
      summary: "The six phases of database design, what a conceptual model is, and why we draw an ER diagram before writing a single CREATE TABLE.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 3 (Sec. 3.1) | Silberschatz Ch. 6</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p>Before a house is built, an architect draws a <strong>plan on paper</strong>. Nobody starts laying bricks and hopes it works out.</p>
          <p>A database is the same. Before we type <code>CREATE TABLE</code>, we draw a picture of what the database must store — which things exist, what we know about each thing, and how those things are connected. That picture is called a <strong>conceptual data model</strong>, and the most popular way to draw it is the <strong>ER (Entity-Relationship) diagram</strong>.</p>
        </div>

        <div class="learn-box analogy-box">
          <div class="learn-title">🏠 Everyday Analogy</div>
          <p>Think of opening a small college.</p>
          <ul>
            <li>The <strong>things</strong> you must keep track of are students, teachers, courses, rooms → these become <strong>entities</strong>.</li>
            <li>The <strong>details</strong> you record about each student (name, roll number, address) → these become <strong>attributes</strong>.</li>
            <li>The <strong>connections</strong> — a student <em>enrolls in</em> a course, a teacher <em>teaches</em> a course → these become <strong>relationships</strong>.</li>
          </ul>
          <p>Draw those three things and you have drawn an ER diagram. That is genuinely all it is.</p>
        </div>

        <h3>The Six Phases of Database Design</h3>
        <p>Designing a database is not one single step. The textbook divides it into six ordered phases. A very common exam question is "explain the phases of database design", so learn this list in order.</p>

        <div class="svg-figure">
          <svg viewBox="0 0 860 420" role="img" aria-label="Flowchart of the six phases of database design">
            <defs>
              <marker id="u2arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
                <path d="M0,0 L10,4 L0,8 Z" fill="#6366f1"/>
              </marker>
            </defs>
            <rect x="290" y="10" width="280" height="46" rx="10" fill="rgba(99,102,241,0.18)" stroke="#6366f1"/>
            <text x="430" y="39" text-anchor="middle" font-size="15" font-weight="700">1. Requirements Collection &amp; Analysis</text>

            <line x1="430" y1="56" x2="430" y2="82" stroke="#6366f1" stroke-width="2" marker-end="url(#u2arrow)"/>

            <rect x="290" y="84" width="280" height="46" rx="10" fill="rgba(16,185,129,0.18)" stroke="#10b981"/>
            <text x="430" y="105" text-anchor="middle" font-size="15" font-weight="700">2. Conceptual Design</text>
            <text x="430" y="122" text-anchor="middle" font-size="12" class="svg-muted">draw the ER diagram — no DBMS chosen yet</text>

            <line x1="430" y1="130" x2="430" y2="156" stroke="#6366f1" stroke-width="2" marker-end="url(#u2arrow)"/>

            <rect x="290" y="158" width="280" height="46" rx="10" fill="rgba(6,182,212,0.18)" stroke="#06b6d4"/>
            <text x="430" y="179" text-anchor="middle" font-size="15" font-weight="700">3. Choice of DBMS</text>
            <text x="430" y="196" text-anchor="middle" font-size="12" class="svg-muted">MySQL? Oracle? PostgreSQL?</text>

            <line x1="430" y1="204" x2="430" y2="230" stroke="#6366f1" stroke-width="2" marker-end="url(#u2arrow)"/>

            <rect x="290" y="232" width="280" height="46" rx="10" fill="rgba(139,92,246,0.18)" stroke="#8b5cf6"/>
            <text x="430" y="253" text-anchor="middle" font-size="15" font-weight="700">4. Logical Design (Data Model Mapping)</text>
            <text x="430" y="270" text-anchor="middle" font-size="12" class="svg-muted">ER diagram → relational tables</text>

            <line x1="430" y1="278" x2="430" y2="304" stroke="#6366f1" stroke-width="2" marker-end="url(#u2arrow)"/>

            <rect x="290" y="306" width="280" height="46" rx="10" fill="rgba(245,158,11,0.18)" stroke="#f59e0b"/>
            <text x="430" y="327" text-anchor="middle" font-size="15" font-weight="700">5. Physical Design</text>
            <text x="430" y="344" text-anchor="middle" font-size="12" class="svg-muted">indexes, file organisation, storage</text>

            <line x1="430" y1="352" x2="430" y2="378" stroke="#6366f1" stroke-width="2" marker-end="url(#u2arrow)"/>

            <rect x="290" y="380" width="280" height="36" rx="10" fill="rgba(244,63,94,0.18)" stroke="#f43f5e"/>
            <text x="430" y="403" text-anchor="middle" font-size="15" font-weight="700">6. Implementation &amp; Tuning</text>

            <text x="150" y="110" text-anchor="middle" font-size="13" font-weight="700" class="svg-muted">DBMS-independent</text>
            <text x="150" y="130" text-anchor="middle" font-size="12" class="svg-muted">(pure design thinking)</text>
            <line x1="150" y1="145" x2="150" y2="200" class="svg-line" stroke-width="1" stroke-dasharray="4 4"/>
            <text x="710" y="270" text-anchor="middle" font-size="13" font-weight="700" class="svg-muted">DBMS-specific</text>
            <text x="710" y="290" text-anchor="middle" font-size="12" class="svg-muted">(actual product decisions)</text>
          </svg>
          <div class="figure-caption">Figure 2.1 — The six phases of database design. Phase 2 (the ER diagram) is the whole subject of this unit.</div>
        </div>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead>
              <tr><th style="width:26%">Phase</th><th>What Actually Happens</th><th>Output You Produce</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>1. Requirements Collection &amp; Analysis</strong></td><td>Interview the people who will use the system. Write down what data they keep and what questions they need answered.</td><td>A written requirements document (in plain English).</td></tr>
              <tr><td><strong>2. Conceptual Design</strong></td><td>Turn those English sentences into entities, attributes and relationships.</td><td><strong>ER / EER diagram</strong> (conceptual schema).</td></tr>
              <tr><td><strong>3. Choice of DBMS</strong></td><td>Decide the product — cost, features, staff skills, existing hardware.</td><td>A chosen DBMS (e.g. MySQL).</td></tr>
              <tr><td><strong>4. Logical Design</strong></td><td>Convert the ER diagram into the model the chosen DBMS understands — for a relational DBMS, into tables.</td><td>Relational schema (list of tables, keys, foreign keys).</td></tr>
              <tr><td><strong>5. Physical Design</strong></td><td>Decide how data is stored on disk: indexes, clustering, file organisation.</td><td>Internal/physical schema.</td></tr>
              <tr><td><strong>6. Implementation &amp; Tuning</strong></td><td>Write the actual SQL, load data, run the application, then measure and improve slow queries.</td><td>A working, tuned database.</td></tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 Memory Trick</div>
          <div class="mnemonic-phrase">R - C - C - L - P - I</div>
          <p><strong>R</strong>eally <strong>C</strong>lever <strong>C</strong>oders <strong>L</strong>ove <strong>P</strong>lanning <strong>I</strong>t →
          <strong>R</strong>equirements, <strong>C</strong>onceptual, <strong>C</strong>hoice of DBMS, <strong>L</strong>ogical, <strong>P</strong>hysical, <strong>I</strong>mplementation.</p>
        </div>

        <hr class="section-divider" />

        <h3>What is a "High-Level Conceptual Data Model"?</h3>

        <div class="definition-box">
          <div class="definition-title">📌 Definition</div>
          <p>A <strong>high-level (conceptual) data model</strong> is a set of concepts that describes the structure of a database in terms that are close to the way <em>users</em> think about data, rather than the way a computer stores it. It deliberately hides storage details, file formats and access paths.</p>
        </div>

        <p>"High-level" simply means <strong>far away from the hardware and close to the human</strong>. The three levels of data model, from most human to most machine-like:</p>

        <div class="grid-3col">
          <div class="feature-card">
            <h4>High-Level / Conceptual</h4>
            <p>Uses entities, attributes, relationships. Understandable by a non-technical client.<br><em>Example: the ER model.</em></p>
          </div>
          <div class="feature-card">
            <h4>Representational / Implementation</h4>
            <p>Still understandable, but maps directly onto a real DBMS.<br><em>Example: the relational model (tables).</em></p>
          </div>
          <div class="feature-card">
            <h4>Low-Level / Physical</h4>
            <p>Describes bytes, blocks, pointers and indexes on the disk.<br><em>Example: B+ tree file organisation.</em></p>
          </div>
        </div>

        <div class="learn-box world-box">
          <div class="learn-title">🌍 Why This Matters in Real Life</div>
          <p>An ER diagram is the one document a developer and a <em>non-technical</em> client can look at together. The client can point at a line and say "no, one patient can have <em>many</em> appointments", and the design is fixed in two seconds — before any code was written. Fixing the same mistake after the system is live can take weeks.</p>
        </div>

        <h3>The Three Building Blocks of the ER Model</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead>
              <tr><th>Building Block</th><th>Meaning in One Line</th><th>Symbol in the Diagram</th><th>Becomes (in SQL)</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Entity</strong></td><td>A "thing" we store data about.</td><td>Rectangle ▭</td><td>A table</td></tr>
              <tr><td><strong>Attribute</strong></td><td>A fact we know about that thing.</td><td>Ellipse ⬭</td><td>A column</td></tr>
              <tr><td><strong>Relationship</strong></td><td>A link between two things.</td><td>Diamond ◇</td><td>A foreign key (or a new table)</td></tr>
            </tbody>
          </table>
        </div>

        <div class="note-figure">
          <img src="images/tp/unit2/relationship-generic-notation.png" alt="Two entities A and B connected through a relationship R, each carrying its own attributes" class="note-img" loading="lazy" />
          <div class="figure-caption">Figure 2.2 (Source: Tpoint Tech) — The three building blocks together in one diagram: rectangles are entities (A, B), ellipses are their attributes, and the diamond (R) is the relationship connecting them. Every ER diagram, however large, is built entirely out of repeats of this one pattern.</div>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"Explain the phases of database design with a neat diagram."</em> — draw the 6-box flowchart and write one line per phase (6–8 marks).</li>
            <li><em>"What is a high-level conceptual data model? Why is it needed?"</em> — give the definition box above, then the three reasons: it is understandable by users, it is independent of any DBMS, and it catches design errors early (4–5 marks).</li>
          </ul>
        </div>

        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ Common Mistake</div>
          <p>Students often write that conceptual design happens <em>after</em> choosing the DBMS. It is the other way round: <strong>conceptual design comes first and deliberately ignores which DBMS will be used</strong>. That independence is the entire point — the same ER diagram could be implemented in MySQL, Oracle or even MongoDB.</p>
        </div>
      </div>
      `
    },

    /* ================================================================== */
    /* 2.2                                                                 */
    /* ================================================================== */
    {
      id: "u2-entities-attributes",
      title: "2.2 Entity Types, Entity Sets, Attributes & Keys",
      summary: "Entities vs entity sets, the full family of attributes (simple, composite, single/multivalued, derived, complex, NULL) and key attributes — with notation for each.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 3 (Sec. 3.3) | Silberschatz Ch. 6</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p>An <strong>entity</strong> is one single "thing" — <em>one particular student, Ramesh</em>.<br>
          An <strong>entity type</strong> is the <em>category</em> of that thing — <em>STUDENT</em>.<br>
          An <strong>entity set</strong> is <em>all</em> the students currently in the database.</p>
          <p>The word <strong>attribute</strong> just means "a detail we record". Name, age and address are attributes of a student.</p>
        </div>

        <div class="learn-box analogy-box">
          <div class="learn-title">📇 Everyday Analogy</div>
          <p>Picture a drawer of identical blank forms.</p>
          <ul>
            <li>The <strong>blank form design</strong> (the printed boxes: Name, Roll No, Address) = the <strong>entity type</strong>.</li>
            <li><strong>One filled-in form</strong> for Ramesh = one <strong>entity</strong>.</li>
            <li>The <strong>whole drawer</strong> of filled forms = the <strong>entity set</strong>.</li>
            <li>Each <strong>printed box</strong> on the form = an <strong>attribute</strong>.</li>
          </ul>
        </div>

        <h3>1. Entity, Entity Type and Entity Set</h3>

        <div class="definition-box">
          <div class="definition-title">📌 Definitions</div>
          <p><strong>Entity:</strong> a real-world object or concept that can be distinguished from all other objects. It may be <em>physical</em> (a person, a car, a book) or <em>conceptual</em> (a course, a job, a bank loan).</p>
          <p><strong>Entity Type:</strong> a collection of entities that have the same attributes. It is the <em>schema</em> (the definition), drawn as a rectangle.</p>
          <p><strong>Entity Set:</strong> the collection of all entities of a particular entity type present in the database at a given moment. It is the <em>extension</em> (the actual data).</p>
        </div>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>Term</th><th>It Is…</th><th>Changes Over Time?</th><th>Example</th></tr></thead>
            <tbody>
              <tr><td><strong>Entity Type</strong></td><td>The definition / schema</td><td>No — it is fixed by the designer</td><td>STUDENT (Roll, Name, Age)</td></tr>
              <tr><td><strong>Entity Set</strong></td><td>The current collection of data</td><td>Yes — grows and shrinks daily</td><td>{Ramesh, Sita, Hari, …}</td></tr>
              <tr><td><strong>Entity</strong></td><td>One member of the set</td><td>—</td><td>Ramesh, Roll 21, Age 20</td></tr>
            </tbody>
          </table>
        </div>

        <div class="img-grid-2col">
          <div class="note-figure">
            <img src="images/tp/unit2/entity-type-notation.png" alt="STUDENT entity type drawn as a plain rectangle" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 2.3 (Source: Tpoint Tech) — A regular (strong) entity type, STUDENT, drawn as a plain rectangle — the basic notation every entity type shares.</div>
          </div>
          <div class="note-figure">
            <img src="images/tp/unit2/entity-attributes-student.png" alt="STUDENT entity with its Name, Address, Id and Age attributes" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 2.4 (Source: Tpoint Tech) — The STUDENT entity type together with its attributes. Every real student who fits this pattern becomes one member of the STUDENT entity set.</div>
          </div>
        </div>

        <hr class="section-divider" />

        <h3>2. Types of Attributes — The Full Family</h3>
        <p>This is one of the most frequently asked questions in the whole subject. There are <strong>six</strong> kinds to know, and each has its own symbol.</p>

        <div class="svg-figure">
          <svg viewBox="0 0 880 280" role="img" aria-label="The six ER attribute notations drawn as ellipses">
            <!-- Simple -->
            <ellipse cx="90" cy="60" rx="72" ry="30" fill="rgba(99,102,241,0.15)" stroke="#6366f1" stroke-width="2"/>
            <text x="90" y="66" text-anchor="middle" font-size="14">Age</text>
            <text x="90" y="112" text-anchor="middle" font-size="12" font-weight="700" class="svg-muted">Simple (atomic)</text>

            <!-- Key -->
            <ellipse cx="265" cy="60" rx="72" ry="30" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="2"/>
            <text x="265" y="66" text-anchor="middle" font-size="14" text-decoration="underline">Roll_No</text>
            <text x="265" y="112" text-anchor="middle" font-size="12" font-weight="700" class="svg-muted">Key (underlined)</text>

            <!-- Multivalued -->
            <ellipse cx="440" cy="60" rx="72" ry="30" fill="rgba(6,182,212,0.12)" stroke="#06b6d4" stroke-width="2"/>
            <ellipse cx="440" cy="60" rx="65" ry="24" fill="none" stroke="#06b6d4" stroke-width="2"/>
            <text x="440" y="66" text-anchor="middle" font-size="14">Phone</text>
            <text x="440" y="112" text-anchor="middle" font-size="12" font-weight="700" class="svg-muted">Multivalued (double)</text>

            <!-- Derived -->
            <ellipse cx="615" cy="60" rx="72" ry="30" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6 4"/>
            <text x="615" y="66" text-anchor="middle" font-size="14">Age</text>
            <text x="615" y="112" text-anchor="middle" font-size="12" font-weight="700" class="svg-muted">Derived (dashed)</text>

            <!-- Composite -->
            <ellipse cx="790" cy="60" rx="72" ry="30" fill="rgba(139,92,246,0.15)" stroke="#8b5cf6" stroke-width="2"/>
            <text x="790" y="66" text-anchor="middle" font-size="14">Name</text>
            <text x="790" y="112" text-anchor="middle" font-size="12" font-weight="700" class="svg-muted">Composite</text>

            <!-- Composite children -->
            <line x1="760" y1="88" x2="700" y2="150" class="svg-line" stroke-width="1.5"/>
            <line x1="790" y1="90" x2="790" y2="150" class="svg-line" stroke-width="1.5"/>
            <line x1="820" y1="88" x2="862" y2="150" class="svg-line" stroke-width="1.5"/>
            <ellipse cx="690" cy="175" rx="48" ry="22" fill="rgba(139,92,246,0.10)" stroke="#8b5cf6" stroke-width="1.5"/>
            <text x="690" y="180" text-anchor="middle" font-size="11">First</text>
            <ellipse cx="790" cy="175" rx="48" ry="22" fill="rgba(139,92,246,0.10)" stroke="#8b5cf6" stroke-width="1.5"/>
            <text x="790" y="180" text-anchor="middle" font-size="11">Middle</text>
            <ellipse cx="862" cy="220" rx="40" ry="22" fill="rgba(139,92,246,0.10)" stroke="#8b5cf6" stroke-width="1.5"/>
            <text x="862" y="225" text-anchor="middle" font-size="11">Last</text>

            <text x="265" y="180" text-anchor="middle" font-size="12" class="svg-muted">A key attribute's value is unique</text>
            <text x="265" y="200" text-anchor="middle" font-size="12" class="svg-muted">for every entity in the set.</text>
            <text x="440" y="180" text-anchor="middle" font-size="12" class="svg-muted">Double ellipse = one entity may</text>
            <text x="440" y="200" text-anchor="middle" font-size="12" class="svg-muted">hold several values at once.</text>
            <text x="150" y="240" text-anchor="middle" font-size="12" class="svg-muted">Dashed = not stored; computed when needed.</text>
          </svg>
          <div class="figure-caption">Figure 2.5 — The standard ER notation for each kind of attribute. Learn the <em>shape</em>, not just the word: exams award marks for correct symbols.</div>
        </div>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead>
              <tr><th style="width:18%">Attribute Type</th><th style="width:16%">Notation</th><th>Meaning (Plain English)</th><th style="width:26%">Example</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Simple / Atomic</strong></td><td>Plain ellipse</td>
                <td>Cannot be broken into smaller meaningful parts.</td>
                <td><code>Age</code>, <code>Gender</code>, <code>Salary</code></td>
              </tr>
              <tr>
                <td><strong>Composite</strong></td><td>Ellipse with child ellipses hanging off it</td>
                <td>Can be split into smaller attributes that each mean something on their own.</td>
                <td><code>Name</code> → First, Middle, Last<br><code>Address</code> → Street, City, District</td>
              </tr>
              <tr>
                <td><strong>Single-valued</strong></td><td>Plain ellipse</td>
                <td>Holds exactly <em>one</em> value per entity.</td>
                <td>A student has one <code>Date_of_Birth</code></td>
              </tr>
              <tr>
                <td><strong>Multivalued</strong></td><td><strong>Double</strong> ellipse</td>
                <td>May hold <em>several</em> values for the same entity at the same time.</td>
                <td><code>Phone_No</code> (a person can have 3 SIMs), <code>Skills</code>, <code>Email</code></td>
              </tr>
              <tr>
                <td><strong>Derived</strong></td><td><strong>Dashed</strong> ellipse</td>
                <td>Not stored — calculated from another attribute whenever it is needed.</td>
                <td><code>Age</code> derived from <code>DOB</code>;<br><code>Total_Students</code> derived by counting</td>
              </tr>
              <tr>
                <td><strong>Complex</strong></td><td>Nested composite + multivalued</td>
                <td>A composite attribute that is also multivalued (or the other way round) — nesting of the two.</td>
                <td><code>{Address_Phone( {Phone}, Address(Street, City) )}</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="img-grid-3col">
          <div class="note-figure">
            <img src="images/tp/unit2/attribute-types-taxonomy.png" alt="Attribute broken down into Key, Composite, Multivalued, Derived and Simple attribute" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 2.6 (Source: Tpoint Tech) — The complete family of attribute types at a glance: Key, Composite, Multivalued, Derived and Simple.</div>
          </div>
          <div class="note-figure">
            <img src="images/tp/unit2/composite-attribute-name.png" alt="Composite attribute Name broken into First_Name, Middle_Name and Last_Name" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 2.7 (Source: Tpoint Tech) — A composite attribute, <code>Name</code>, broken into its component parts.</div>
          </div>
          <div class="note-figure">
            <img src="images/tp/unit2/multivalued-attribute-phone.png" alt="Multivalued attribute Phone_no drawn as a double ellipse" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 2.8 (Source: Tpoint Tech) — A multivalued attribute, <code>Phone_no</code>, drawn as a double ellipse.</div>
          </div>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 Memory Trick for the Symbols</div>
          <p><strong>Double</strong> ellipse → <strong>Double</strong> (many) values → <em>Multivalued</em>.<br>
          <strong>Dashed</strong> ellipse → <strong>D</strong>erived (both start with D, and dashes look "not really there", just like a value that is not really stored).<br>
          <strong>Underlined</strong> → the one that <strong>identifies</strong> → <em>Key</em>.</p>
        </div>

        <hr class="section-divider" />

        <h3>3. NULL Values</h3>
        <div class="definition-box">
          <div class="definition-title">📌 What NULL Really Means</div>
          <p><strong>NULL</strong> is used when an attribute has <em>no value</em> for a particular entity. It is <strong>not</strong> zero and <strong>not</strong> an empty string — it is the absence of a value. NULL arises in three situations:</p>
        </div>
        <div class="grid-3col">
          <div class="feature-card">
            <h4>1. Not Applicable</h4>
            <p>The attribute simply does not apply to this entity. <em>Example:</em> <code>College_Degree</code> for a student who is still in school.</p>
          </div>
          <div class="feature-card">
            <h4>2. Unknown — Missing</h4>
            <p>A value exists in the real world but we do not have it. <em>Example:</em> a customer's <code>Height</code> exists, we just never recorded it.</p>
          </div>
          <div class="feature-card">
            <h4>3. Unknown — Not Known If Exists</h4>
            <p>We do not even know whether a value exists. <em>Example:</em> a person's <code>Home_Phone</code> — they may not own one at all.</p>
          </div>
        </div>

        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ Common Mistake</div>
          <p>Writing "NULL = 0" in an exam loses marks. A salary of <code>0</code> means the person earns nothing; a salary of <code>NULL</code> means we do not know what they earn. These are completely different facts, and SQL treats them differently (you must use <code>IS NULL</code>, never <code>= NULL</code>).</p>
        </div>

        <hr class="section-divider" />

        <h3>4. Key Attributes</h3>
        <div class="definition-box">
          <div class="definition-title">📌 Definition</div>
          <p>A <strong>key attribute</strong> (also called a <em>uniqueness constraint</em>) is an attribute whose value is <strong>distinct for every single entity</strong> in the entity set. It is drawn by <u>underlining</u> the attribute name.</p>
        </div>
        <ul class="styled-list">
          <li>An entity type may have <strong>more than one</strong> key attribute — e.g. a STUDENT could be uniquely identified by <code>Roll_No</code> <em>and</em> by <code>Citizenship_No</code>. Both get underlined.</li>
          <li>A key can be <strong>composite</strong> — e.g. <code>(Vehicle_No, State)</code> together are unique even though neither is unique alone. In that case the <em>composite</em> attribute is underlined, not its parts.</li>
          <li>Some entity types have <strong>no</strong> key attribute of their own. These are <strong>weak entity types</strong>, covered in topic 2.4.</li>
        </ul>

        <div class="note-figure">
          <img src="images/tp/unit2/key-attribute-student-id.png" alt="STUDENT entity with the Id attribute underlined to show it is the key attribute" class="note-img" loading="lazy" />
          <div class="figure-caption">Figure 2.9 (Source: Tpoint Tech) — A key attribute is shown by underlining its name inside the ellipse; here <code>Id</code> is the key attribute of STUDENT.</div>
        </div>

        <div class="worked-example">
          <div class="we-title">✍️ Worked Example</div>
          <div class="we-question">Identify the attribute type of each of the following for an EMPLOYEE entity: <code>Emp_ID</code>, <code>Full_Name</code>, <code>Mobile_Numbers</code>, <code>Date_of_Birth</code>, <code>Age</code>, <code>Basic_Salary</code>.</div>
          <ol class="step-list">
            <li><strong>Emp_ID</strong> — every employee has a different one, so it identifies the entity → <strong>Key attribute</strong> (underlined ellipse).</li>
            <li><strong>Full_Name</strong> — can be split into First, Middle, Last, each meaningful → <strong>Composite attribute</strong>.</li>
            <li><strong>Mobile_Numbers</strong> — one employee may have two or three → <strong>Multivalued attribute</strong> (double ellipse).</li>
            <li><strong>Date_of_Birth</strong> — one value only, stored as it is → <strong>Simple, single-valued attribute</strong>.</li>
            <li><strong>Age</strong> — we never store it; we calculate it from Date_of_Birth and today's date → <strong>Derived attribute</strong> (dashed ellipse).</li>
            <li><strong>Basic_Salary</strong> — one atomic number → <strong>Simple, single-valued attribute</strong>.</li>
          </ol>
          <div class="we-answer"><strong>Answer summary:</strong> Emp_ID = key; Full_Name = composite; Mobile_Numbers = multivalued; Date_of_Birth = simple/single-valued; Age = derived; Basic_Salary = simple/single-valued.</div>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"Explain different types of attributes with suitable examples and notations."</em> — This is nearly guaranteed to appear. Draw all six ellipse symbols, give one example each (5–8 marks).</li>
            <li><em>"Differentiate between entity type and entity set."</em> — use the three-row table above (3–4 marks).</li>
            <li><em>"What is a NULL value? When does it occur?"</em> — definition + the three cases (3 marks).</li>
          </ul>
        </div>
      </div>
      `
    },

    /* ================================================================== */
    /* 2.3                                                                 */
    /* ================================================================== */
    {
      id: "u2-relationships",
      title: "2.3 Relationship Types, Sets, Roles & Structural Constraints",
      summary: "How entities connect: degree, role names, recursive relationships, cardinality ratios (1:1, 1:N, M:N), participation (total/partial) and the (min, max) notation.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 3 (Sec. 3.4) | Silberschatz Ch. 6</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p>A <strong>relationship</strong> is nothing more than a <em>verb</em> connecting two nouns.</p>
          <p>"A STUDENT <strong>enrolls in</strong> a COURSE." The two nouns are entities; the verb in the middle is the relationship, and we draw it as a diamond.</p>
          <p>Everything else in this topic is just answering one question about that verb: <strong>how many?</strong> How many courses can one student enroll in? How many students can one course hold? The answer is called the <strong>cardinality</strong>.</p>
        </div>

        <h3>1. Relationship Type, Relationship Set and Relationship Instance</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>Term</th><th>Meaning</th><th>Example</th></tr></thead>
            <tbody>
              <tr><td><strong>Relationship Type</strong></td><td>The <em>definition</em> of an association among entity types. Drawn as a diamond.</td><td><code>WORKS_FOR</code> between EMPLOYEE and DEPARTMENT</td></tr>
              <tr><td><strong>Relationship Set</strong></td><td>The current set of all relationship instances of that type.</td><td>All employee–department pairings stored today</td></tr>
              <tr><td><strong>Relationship Instance</strong></td><td>One single link between specific entities.</td><td>(Ramesh → Accounts Department)</td></tr>
            </tbody>
          </table>
        </div>

        <div class="note-figure">
          <img src="images/tp/unit2/relationship-employee-department.png" alt="EMPLOYEE works for DEPARTMENT relationship" class="note-img" loading="lazy" />
          <div class="figure-caption">Figure 2.10 (Source: Tpoint Tech) — A relationship type drawn as a diamond, connecting two entity rectangles: EMPLOYEE <em>works for</em> DEPARTMENT.</div>
        </div>

        <hr class="section-divider" />

        <h3>2. Degree of a Relationship</h3>
        <div class="definition-box">
          <div class="definition-title">📌 Definition</div>
          <p>The <strong>degree</strong> of a relationship type is the <strong>number of entity types that participate</strong> in it. Count the lines coming out of the diamond — that number is the degree.</p>
        </div>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>Degree</th><th>Name</th><th>Entity Types Involved</th><th>Example</th></tr></thead>
            <tbody>
              <tr><td><strong>1</strong></td><td>Unary (Recursive)</td><td>One — the same entity type twice</td><td>EMPLOYEE <em>supervises</em> EMPLOYEE</td></tr>
              <tr><td><strong>2</strong></td><td>Binary</td><td>Two</td><td>STUDENT <em>enrolls in</em> COURSE</td></tr>
              <tr><td><strong>3</strong></td><td>Ternary</td><td>Three</td><td>SUPPLIER <em>supplies</em> PART <em>to</em> PROJECT</td></tr>
              <tr><td><strong>4</strong></td><td>Quaternary</td><td>Four</td><td>DOCTOR–PATIENT–MEDICINE–PHARMACY</td></tr>
            </tbody>
          </table>
        </div>
        <p><strong>Binary relationships are by far the most common</strong> — around 95% of every real diagram you will ever draw.</p>

        <div class="img-grid-2col">
          <div class="note-figure">
            <img src="images/tp/unit2/recursive-relationship-manager-worker.png" alt="EMPLOYEE works for EMPLOYEE recursive relationship with Manager and worker role labels" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 2.11 (Source: Tpoint Tech) — A <strong>recursive (unary)</strong> relationship: EMPLOYEE works for EMPLOYEE. Both lines go back to the same rectangle, so role labels (Manager / worker) are added to remove ambiguity.</div>
          </div>
          <div class="note-figure">
            <img src="images/tp/unit2/binary-relationship-employee-project.png" alt="EMPLOYEE assigned PROJECT binary relationship" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 2.12 (Source: Tpoint Tech) — A standard binary relationship connecting two different entity types: EMPLOYEE <em>assigned</em> PROJECT.</div>
          </div>
        </div>

        <h3>3. Role Names</h3>
        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p>A <strong>role name</strong> is a label written on the line that says <em>"what part is this entity playing here?"</em></p>
          <p>In EMPLOYEE <em>supervises</em> EMPLOYEE, the same table appears twice — so we must label one line <strong>"supervisor"</strong> and the other <strong>"supervisee"</strong>. Without those labels the diagram is ambiguous.</p>
        </div>
        <p>Role names are <em>optional</em> for ordinary binary relationships (the entity type name itself is usually clear enough) but they are <strong>compulsory for recursive relationships</strong>.</p>

        <hr class="section-divider" />

        <h3>4. Structural Constraints — Part A: Cardinality Ratio</h3>
        <div class="definition-box">
          <div class="definition-title">📌 Definition</div>
          <p>The <strong>cardinality ratio</strong> of a binary relationship specifies the <strong>maximum number</strong> of relationship instances an entity can participate in. The four possibilities are <strong>1:1, 1:N, N:1 and M:N</strong>.</p>
        </div>

        <div class="svg-figure">
          <svg viewBox="0 0 880 400" role="img" aria-label="Diagrams of the four cardinality ratios">
            <!-- 1:1 -->
            <text x="220" y="24" text-anchor="middle" font-size="15" font-weight="700" fill="#10b981">1 : 1 — One to One</text>
            <rect x="60" y="40" width="110" height="42" rx="6" class="svg-panel" stroke-width="2"/>
            <text x="115" y="66" text-anchor="middle" font-size="13">EMPLOYEE</text>
            <polygon points="220,38 268,61 220,84 172,61" fill="rgba(16,185,129,0.18)" stroke="#10b981" stroke-width="2"/>
            <text x="220" y="65" text-anchor="middle" font-size="11">MANAGES</text>
            <rect x="270" y="40" width="110" height="42" rx="6" class="svg-panel" stroke-width="2"/>
            <text x="325" y="66" text-anchor="middle" font-size="13">DEPARTMENT</text>
            <line x1="170" y1="61" x2="172" y2="61" class="svg-line" stroke-width="2"/>
            <text x="163" y="52" font-size="13" font-weight="700" fill="#10b981">1</text>
            <text x="276" y="52" font-size="13" font-weight="700" fill="#10b981">1</text>
            <text x="220" y="104" text-anchor="middle" font-size="12" class="svg-muted">One employee manages one department, and</text>
            <text x="220" y="120" text-anchor="middle" font-size="12" class="svg-muted">one department has exactly one manager.</text>

            <!-- 1:N -->
            <text x="660" y="24" text-anchor="middle" font-size="15" font-weight="700" fill="#6366f1">1 : N — One to Many</text>
            <rect x="500" y="40" width="110" height="42" rx="6" class="svg-panel" stroke-width="2"/>
            <text x="555" y="66" text-anchor="middle" font-size="13">DEPARTMENT</text>
            <polygon points="660,38 708,61 660,84 612,61" fill="rgba(99,102,241,0.18)" stroke="#6366f1" stroke-width="2"/>
            <text x="660" y="65" text-anchor="middle" font-size="11">HAS</text>
            <rect x="710" y="40" width="110" height="42" rx="6" class="svg-panel" stroke-width="2"/>
            <text x="765" y="66" text-anchor="middle" font-size="13">EMPLOYEE</text>
            <text x="603" y="52" font-size="13" font-weight="700" fill="#6366f1">1</text>
            <text x="716" y="52" font-size="13" font-weight="700" fill="#6366f1">N</text>
            <text x="660" y="104" text-anchor="middle" font-size="12" class="svg-muted">One department has many employees, but each</text>
            <text x="660" y="120" text-anchor="middle" font-size="12" class="svg-muted">employee belongs to only one department.</text>

            <!-- N:1 -->
            <text x="220" y="184" text-anchor="middle" font-size="15" font-weight="700" fill="#06b6d4">N : 1 — Many to One</text>
            <rect x="60" y="200" width="110" height="42" rx="6" class="svg-panel" stroke-width="2"/>
            <text x="115" y="226" text-anchor="middle" font-size="13">STUDENT</text>
            <polygon points="220,198 268,221 220,244 172,221" fill="rgba(6,182,212,0.18)" stroke="#06b6d4" stroke-width="2"/>
            <text x="220" y="225" text-anchor="middle" font-size="11">STUDIES_IN</text>
            <rect x="270" y="200" width="110" height="42" rx="6" class="svg-panel" stroke-width="2"/>
            <text x="325" y="226" text-anchor="middle" font-size="13">COLLEGE</text>
            <text x="163" y="212" font-size="13" font-weight="700" fill="#06b6d4">N</text>
            <text x="276" y="212" font-size="13" font-weight="700" fill="#06b6d4">1</text>
            <text x="220" y="264" text-anchor="middle" font-size="12" class="svg-muted">Many students study in one college.</text>
            <text x="220" y="280" text-anchor="middle" font-size="12" class="svg-muted">(This is just 1:N read from the other side.)</text>

            <!-- M:N -->
            <text x="660" y="184" text-anchor="middle" font-size="15" font-weight="700" fill="#f59e0b">M : N — Many to Many</text>
            <rect x="500" y="200" width="110" height="42" rx="6" class="svg-panel" stroke-width="2"/>
            <text x="555" y="226" text-anchor="middle" font-size="13">STUDENT</text>
            <polygon points="660,198 708,221 660,244 612,221" fill="rgba(245,158,11,0.18)" stroke="#f59e0b" stroke-width="2"/>
            <text x="660" y="225" text-anchor="middle" font-size="11">ENROLLS</text>
            <rect x="710" y="200" width="110" height="42" rx="6" class="svg-panel" stroke-width="2"/>
            <text x="765" y="226" text-anchor="middle" font-size="13">COURSE</text>
            <text x="603" y="212" font-size="13" font-weight="700" fill="#f59e0b">M</text>
            <text x="716" y="212" font-size="13" font-weight="700" fill="#f59e0b">N</text>
            <text x="660" y="264" text-anchor="middle" font-size="12" class="svg-muted">One student takes many courses AND one</text>
            <text x="660" y="280" text-anchor="middle" font-size="12" class="svg-muted">course is taken by many students.</text>

            <!-- Participation -->
            <text x="440" y="326" text-anchor="middle" font-size="15" font-weight="700" fill="#f43f5e">Participation Constraint</text>
            <rect x="230" y="342" width="110" height="40" rx="6" class="svg-panel" stroke-width="2"/>
            <text x="285" y="367" text-anchor="middle" font-size="13">EMPLOYEE</text>
            <line x1="340" y1="359" x2="400" y2="359" stroke="#f43f5e" stroke-width="2"/>
            <line x1="340" y1="365" x2="400" y2="365" stroke="#f43f5e" stroke-width="2"/>
            <polygon points="440,340 486,362 440,384 394,362" fill="rgba(244,63,94,0.15)" stroke="#f43f5e" stroke-width="2"/>
            <text x="440" y="366" text-anchor="middle" font-size="10">WORKS_FOR</text>
            <line x1="486" y1="362" x2="546" y2="362" class="svg-line" stroke-width="2"/>
            <rect x="546" y="342" width="110" height="40" rx="6" class="svg-panel" stroke-width="2"/>
            <text x="601" y="367" text-anchor="middle" font-size="13">DEPARTMENT</text>
            <text x="370" y="332" text-anchor="middle" font-size="11" font-weight="700" fill="#f43f5e">double line = TOTAL</text>
            <text x="516" y="332" text-anchor="middle" font-size="11" font-weight="700" class="svg-muted">single line = PARTIAL</text>
          </svg>
          <div class="figure-caption">Figure 2.13 — The four cardinality ratios, plus participation shown as a single line (partial) versus a double line (total).</div>
        </div>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>Ratio</th><th>Read It As</th><th>Real Example</th><th>How It Becomes a Table (Unit 3)</th></tr></thead>
            <tbody>
              <tr><td><strong>1:1</strong></td><td>One of A relates to at most one of B, and vice versa.</td><td>Person ↔ Passport; Employee ↔ Department (manages)</td><td>Put the foreign key in either table (preferably the one with total participation).</td></tr>
              <tr><td><strong>1:N</strong></td><td>One of A relates to many of B; each B relates to one A.</td><td>Department → Employees; Mother → Children</td><td>Put the foreign key in the <strong>N side</strong> table.</td></tr>
              <tr><td><strong>N:1</strong></td><td>Same as 1:N, simply read from the opposite direction.</td><td>Employees → Department</td><td>Same as 1:N.</td></tr>
              <tr><td><strong>M:N</strong></td><td>Many of A relate to many of B.</td><td>Student ↔ Course; Author ↔ Book</td><td>Create a <strong>separate junction table</strong> holding both keys.</td></tr>
            </tbody>
          </table>
        </div>

        <div class="img-grid-2col">
          <div class="note-figure">
            <img src="images/tp/unit2/cardinality-1-n-scientist.png" alt="Scientist invents Invention, a 1:N relationship" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 2.14 (Source: Tpoint Tech) — A 1:N relationship: one Scientist <em>invents</em> many Inventions, but each invention has only one scientist.</div>
          </div>
          <div class="note-figure">
            <img src="images/tp/unit2/cardinality-m-n-employee-project.png" alt="Employee is assigned Project, an M:N relationship" class="note-img" loading="lazy" />
            <div class="figure-caption">Figure 2.15 (Source: Tpoint Tech) — An M:N relationship: many Employees <em>are assigned</em> to many Projects at once.</div>
          </div>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 How to Work Out the Ratio in 10 Seconds</div>
          <p>Ask the question <strong>twice</strong>, once from each side, and each time answer only "one" or "many":</p>
          <ol>
            <li>"Can one STUDENT enroll in many COURSEs?" → <strong>Yes, many.</strong></li>
            <li>"Can one COURSE hold many STUDENTs?" → <strong>Yes, many.</strong></li>
          </ol>
          <p>Many + many = <strong>M:N</strong>. One + many = <strong>1:N</strong>. One + one = <strong>1:1</strong>. That's the whole method.</p>
        </div>

        <hr class="section-divider" />

        <h3>5. Structural Constraints — Part B: Participation Constraint</h3>
        <div class="definition-box">
          <div class="definition-title">📌 Definition</div>
          <p>The <strong>participation constraint</strong> specifies whether the existence of an entity <em>depends</em> on it being related to another entity through the relationship. It answers the question: <strong>must every entity take part, or is taking part optional?</strong></p>
        </div>

        <div class="compare-grid">
          <div class="compare-card compare-good">
            <h4>Total Participation (Mandatory)</h4>
            <p>Every single entity in the set <strong>must</strong> participate. Also called an <strong>existence dependency</strong>.</p>
            <p><em>Notation:</em> <strong>double line</strong> between the entity and the diamond.</p>
            <p><em>Example:</em> every EMPLOYEE must work for some DEPARTMENT — you cannot be an employee of nowhere.</p>
          </div>
          <div class="compare-card compare-bad">
            <h4>Partial Participation (Optional)</h4>
            <p>Only <strong>some</strong> entities participate; others may not be related at all.</p>
            <p><em>Notation:</em> <strong>single line</strong>.</p>
            <p><em>Example:</em> only a few employees <em>manage</em> a department; most manage nothing.</p>
          </div>
        </div>

        <hr class="section-divider" />

        <h3>6. The (min, max) Notation</h3>
        <p>Cardinality and participation can be expressed together in one compact form by writing a pair <strong>(min, max)</strong> on each line.</p>

        <div class="formula-strip">
          (min, max) &nbsp;→&nbsp; min = fewest instances this entity MUST take part in &nbsp;|&nbsp; max = most it MAY take part in
        </div>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>Written As</th><th>Means</th><th>Equivalent Old Notation</th></tr></thead>
            <tbody>
              <tr><td><code>(0, 1)</code></td><td>Optional, at most one</td><td>Partial participation, cardinality 1</td></tr>
              <tr><td><code>(1, 1)</code></td><td>Compulsory, exactly one</td><td><strong>Total</strong> participation, cardinality 1</td></tr>
              <tr><td><code>(0, N)</code></td><td>Optional, may have many</td><td>Partial participation, cardinality N</td></tr>
              <tr><td><code>(1, N)</code></td><td>Compulsory, and may have many</td><td><strong>Total</strong> participation, cardinality N</td></tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 The One Rule That Unlocks (min, max)</div>
          <p><strong>If min = 0 → participation is PARTIAL. If min ≥ 1 → participation is TOTAL.</strong></p>
          <p>The <code>max</code> value tells you the cardinality ratio. So <code>(1, N)</code> on the EMPLOYEE side of WORKS_FOR says: every employee must work for at least one department (total) and could work for several.</p>
        </div>

        <div class="note-figure">
          <img src="images/tp/unit2/cardinality-min-max-department-employee.png" alt="DEPARTMENT 1(0,20) assigned N(1,1) EMPLOYEE using (min,max) notation" class="note-img" loading="lazy" />
          <div class="figure-caption">Figure 2.16 (Source: Tpoint Tech) — A relationship redrawn with (min, max) structural constraints: DEPARTMENT (0,20) — assigned — (1,1) EMPLOYEE. Read it as "each department has 0 to 20 employees; each employee belongs to exactly 1 department."</div>
        </div>

        <h3>7. Attributes of a Relationship Type</h3>
        <p>A relationship itself can carry attributes — facts that belong to the <em>connection</em> rather than to either entity.</p>
        <div class="learn-box analogy-box">
          <div class="learn-title">🎓 Example You Will Recognise</div>
          <p>STUDENT <em>enrolls in</em> COURSE — where do we store the <strong>grade</strong>?</p>
          <ul>
            <li>Not in STUDENT: a student has a different grade in every course.</li>
            <li>Not in COURSE: a course has a different grade for every student.</li>
            <li><strong>It belongs to the ENROLLS relationship itself.</strong> Draw an ellipse hanging off the diamond.</li>
          </ul>
          <p>Other classic examples: <code>Hours</code> on WORKS_ON, <code>Date_of_Issue</code> on BORROWS, <code>Quantity</code> on SUPPLIES.</p>
        </div>
        <p><strong>Important rule:</strong> for an <strong>M:N</strong> relationship, relationship attributes <em>must</em> stay on the relationship (they become columns of the junction table). For a <strong>1:N</strong> relationship they can be moved to the entity on the N side.</p>

        <div class="worked-example">
          <div class="we-title">✍️ Worked Example</div>
          <div class="we-question">For a hospital: "Each patient is admitted to exactly one ward. A ward holds many patients. Every patient must be in a ward, but a newly built ward may be empty." State the cardinality ratio, the participation of each side, and the (min, max) pairs.</div>
          <ol class="step-list">
            <li><strong>Ask from the PATIENT side:</strong> one patient → how many wards? "Exactly one" → the PATIENT side is <strong>1</strong>.</li>
            <li><strong>Ask from the WARD side:</strong> one ward → how many patients? "Many" → the WARD side is <strong>N</strong>.</li>
            <li>Therefore the cardinality ratio is <strong>1:N</strong> (WARD : PATIENT).</li>
            <li><strong>Participation of PATIENT:</strong> "Every patient must be in a ward" → <strong>Total</strong> → draw a double line → <code>(1, 1)</code>.</li>
            <li><strong>Participation of WARD:</strong> "A new ward may be empty" → <strong>Partial</strong> → single line → <code>(0, N)</code>.</li>
          </ol>
          <div class="we-answer"><strong>Answer:</strong> WARD —(0,N)— ADMITTED_TO —(1,1)— PATIENT. Cardinality 1:N; WARD has partial participation, PATIENT has total participation. When mapped to tables, <code>ward_id</code> becomes a NOT NULL foreign key in the PATIENT table.</div>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"What are structural constraints? Explain cardinality ratio and participation constraint with examples."</em> — the definition of both + the 4-ratio table + the total/partial comparison (6–8 marks).</li>
            <li><em>"Explain degree of a relationship with examples."</em> — the degree table with unary/binary/ternary (4 marks).</li>
            <li><em>"What is a recursive relationship? Why are role names necessary in it?"</em> — SUPERVISION example with supervisor/supervisee roles (3–4 marks).</li>
          </ul>
        </div>

        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ Common Mistakes</div>
          <ul>
            <li>Confusing <strong>cardinality</strong> (how many — the maximum) with <strong>participation</strong> (must you take part at all — the minimum). They are two different constraints and exams often ask you to state both.</li>
            <li>Putting the "1" and "N" on the wrong ends. The label goes on the line <em>next to</em> the entity whose count it describes — and many textbooks (including Elmasri) write "1" on the side of the entity that occurs <em>once</em> in each pairing. Always sanity-check by reading the sentence out loud.</li>
            <li>Forgetting that a relationship attribute on an M:N relationship <strong>cannot</strong> be moved into either entity table.</li>
          </ul>
        </div>
      </div>
      `
    },

    /* ================================================================== */
    /* 2.4                                                                 */
    /* ================================================================== */
    {
      id: "u2-weak-entities",
      title: "2.4 Weak Entity Types",
      summary: "Entities that cannot exist on their own: owner/identifying entity, identifying relationship, partial key (discriminator), notation, and how a weak entity becomes a table.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 3 (Sec. 3.5) | Silberschatz Ch. 6</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p>A <strong>weak entity</strong> is a thing that <em>cannot be identified by itself</em> — it only makes sense when you say which "parent" it belongs to.</p>
          <p>Say a hospital records the <strong>dependents</strong> (family members) of each employee. If you tell me only "the dependent is named Sita", I cannot find her — there could be twenty Sitas. But "Sita, the dependent <em>of employee E101</em>" points at exactly one person. Sita's record <strong>depends</strong> on the employee's record to be identified. That is a weak entity.</p>
        </div>

        <div class="learn-box analogy-box">
          <div class="learn-title">🏨 Everyday Analogy</div>
          <p><strong>Room number 203.</strong> On its own it is meaningless — hundreds of buildings have a room 203. But "room 203 <em>of Hotel Annapurna</em>" identifies exactly one room.</p>
          <p>ROOM is the <strong>weak entity</strong>, HOTEL is the <strong>owner (identifying) entity</strong>, and the room number is the <strong>partial key</strong> — unique only <em>within</em> its hotel.</p>
        </div>

        <h3>The Four Things You Must Name</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:24%">Term</th><th>Meaning</th><th style="width:24%">In the DEPENDENT Example</th></tr></thead>
            <tbody>
              <tr><td><strong>Weak Entity Type</strong></td><td>An entity type with no key attribute of its own. Drawn as a <strong>double rectangle</strong>.</td><td>DEPENDENT</td></tr>
              <tr><td><strong>Owner / Identifying Entity Type</strong></td><td>The strong entity whose key is borrowed to identify the weak entity.</td><td>EMPLOYEE</td></tr>
              <tr><td><strong>Identifying Relationship</strong></td><td>The relationship joining the two. Drawn as a <strong>double diamond</strong>. The weak entity always has <strong>total participation</strong> in it.</td><td>DEPENDENTS_OF</td></tr>
              <tr><td><strong>Partial Key (Discriminator)</strong></td><td>An attribute that is unique only <em>among the weak entities of one owner</em>. Drawn with a <strong>dashed underline</strong>.</td><td><code>Dependent_Name</code></td></tr>
            </tbody>
          </table>
        </div>

        <div class="svg-figure">
          <svg viewBox="0 0 840 250" role="img" aria-label="Weak entity notation: double rectangle, double diamond and dashed underlined partial key">
            <!-- Strong entity -->
            <rect x="40" y="90" width="150" height="56" rx="4" fill="rgba(99,102,241,0.15)" stroke="#6366f1" stroke-width="2.5"/>
            <text x="115" y="118" text-anchor="middle" font-size="15" font-weight="700">EMPLOYEE</text>
            <text x="115" y="136" text-anchor="middle" font-size="11" class="svg-muted">(strong / owner)</text>
            <ellipse cx="115" cy="38" rx="62" ry="24" fill="rgba(99,102,241,0.10)" stroke="#6366f1" stroke-width="1.5"/>
            <text x="115" y="43" text-anchor="middle" font-size="12" text-decoration="underline">Emp_ID</text>
            <line x1="115" y1="62" x2="115" y2="90" class="svg-line" stroke-width="1.5"/>

            <!-- Double line (total participation from weak side) -->
            <line x1="190" y1="114" x2="292" y2="114" class="svg-line" stroke-width="2"/>
            <text x="240" y="106" text-anchor="middle" font-size="12" font-weight="700" fill="#6366f1">1</text>

            <!-- Double diamond -->
            <polygon points="360,80 434,118 360,156 286,118" fill="rgba(244,63,94,0.15)" stroke="#f43f5e" stroke-width="2.5"/>
            <polygon points="360,90 418,118 360,146 302,118" fill="none" stroke="#f43f5e" stroke-width="2"/>
            <text x="360" y="122" text-anchor="middle" font-size="11" font-weight="700">DEPENDENTS_OF</text>
            <text x="360" y="182" text-anchor="middle" font-size="11" class="svg-muted">identifying relationship</text>
            <text x="360" y="198" text-anchor="middle" font-size="11" class="svg-muted">(double diamond)</text>

            <!-- Double line to weak entity = total participation -->
            <line x1="434" y1="111" x2="530" y2="111" stroke="#f43f5e" stroke-width="2"/>
            <line x1="434" y1="121" x2="530" y2="121" stroke="#f43f5e" stroke-width="2"/>
            <text x="482" y="102" text-anchor="middle" font-size="12" font-weight="700" fill="#f43f5e">N</text>
            <text x="482" y="142" text-anchor="middle" font-size="10" fill="#f43f5e">double line = TOTAL</text>

            <!-- Weak entity: double rectangle -->
            <rect x="530" y="86" width="160" height="60" rx="4" fill="rgba(244,63,94,0.15)" stroke="#f43f5e" stroke-width="2.5"/>
            <rect x="538" y="94" width="144" height="44" rx="3" fill="none" stroke="#f43f5e" stroke-width="2"/>
            <text x="610" y="114" text-anchor="middle" font-size="14" font-weight="700">DEPENDENT</text>
            <text x="610" y="130" text-anchor="middle" font-size="10" class="svg-muted">(weak — double rectangle)</text>

            <!-- Partial key -->
            <ellipse cx="610" cy="34" rx="76" ry="24" fill="rgba(244,63,94,0.10)" stroke="#f43f5e" stroke-width="1.5"/>
            <text x="610" y="39" text-anchor="middle" font-size="12">Dep_Name</text>
            <line x1="574" y1="45" x2="646" y2="45" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4 3"/>
            <line x1="610" y1="58" x2="610" y2="86" class="svg-line" stroke-width="1.5"/>
            <text x="760" y="30" font-size="11" class="svg-muted">partial key =</text>
            <text x="760" y="46" font-size="11" class="svg-muted">dashed underline</text>

            <text x="420" y="232" text-anchor="middle" font-size="12" class="svg-muted">Full key of DEPENDENT = Emp_ID (borrowed) + Dep_Name (partial key)</text>
          </svg>
          <div class="figure-caption">Figure 2.17 — The complete weak-entity notation. Three "doubles" appear together: double rectangle, double diamond, double line.</div>
        </div>

        <div class="note-figure">
          <img src="images/tp/unit2/weak-entity-loan-installment.png" alt="Loan and Installment weak entity example, Installment drawn as a double rectangle" class="note-img" loading="lazy" />
          <div class="figure-caption">Figure 2.18 (Source: Tpoint Tech) — Another weak entity example: INSTALLMENT (double rectangle) cannot be identified without its owner LOAN — "installment 1" only makes sense as "installment 1 of this loan."</div>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 Memory Trick: "Weak things come in doubles"</div>
          <div class="mnemonic-phrase">Double box · Double diamond · Double line</div>
          <p>A weak entity is drawn with a <strong>double rectangle</strong>, joined by a <strong>double diamond</strong>, using a <strong>double line</strong> (because participation is always total). If you draw all three doubles you cannot lose marks on the notation.</p>
        </div>

        <hr class="section-divider" />

        <h3>Strong Entity vs Weak Entity — Comparison</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>Basis</th><th>Strong (Regular) Entity</th><th>Weak Entity</th></tr></thead>
            <tbody>
              <tr><td><strong>Primary key</strong></td><td>Has its own key attribute.</td><td>Has no key of its own; only a partial key.</td></tr>
              <tr><td><strong>How it is identified</strong></td><td>By itself.</td><td>Owner's primary key + its own partial key.</td></tr>
              <tr><td><strong>Existence</strong></td><td>Exists independently.</td><td>Existence-dependent — delete the owner and it must go too.</td></tr>
              <tr><td><strong>Symbol</strong></td><td>Single rectangle.</td><td>Double rectangle.</td></tr>
              <tr><td><strong>Relationship symbol</strong></td><td>Single diamond.</td><td>Double diamond (identifying relationship).</td></tr>
              <tr><td><strong>Participation</strong></td><td>May be total or partial.</td><td><strong>Always total</strong> in the identifying relationship.</td></tr>
              <tr><td><strong>Key attribute notation</strong></td><td>Solid underline.</td><td>Dashed underline (partial key).</td></tr>
              <tr><td><strong>Example</strong></td><td>EMPLOYEE, STUDENT, HOTEL</td><td>DEPENDENT, ROOM, ORDER_LINE_ITEM</td></tr>
            </tbody>
          </table>
        </div>

        <h3>How a Weak Entity Becomes a Table</h3>
        <p>When you map a weak entity to the relational model, the primary key of the resulting table is <strong>composite</strong>: the owner's key plus the partial key.</p>

        <div class="code-block">
          <div class="code-header"><span>SQL — mapping the DEPENDENT weak entity</span></div>
          <div class="code-content"><pre>CREATE TABLE employee (
  emp_id   INT PRIMARY KEY,
  emp_name VARCHAR(60) NOT NULL
);

CREATE TABLE dependent (
  emp_id       INT,                      -- borrowed from the owner
  dep_name     VARCHAR(60),              -- the partial key
  relationship VARCHAR(20),
  birth_date   DATE,
  PRIMARY KEY (emp_id, dep_name),        -- composite key!
  FOREIGN KEY (emp_id) REFERENCES employee(emp_id)
      ON DELETE CASCADE                  -- owner deleted -> dependents deleted
);</pre></div>
        </div>

        <div class="learn-box world-box">
          <div class="learn-title">🌍 Notice the ON DELETE CASCADE</div>
          <p>That single clause is the SQL translation of "existence dependency". Because a dependent cannot exist without its employee, deleting the employee must automatically delete the dependents. This is the practical pay-off of correctly spotting a weak entity at design time.</p>
        </div>

        <div class="worked-example">
          <div class="we-title">✍️ Worked Example</div>
          <div class="we-question">A company stores SALES_ORDERs. Each order contains several LINE_ITEMs, numbered 1, 2, 3… within that order. Line item number 1 of order 5001 is a different item from line item number 1 of order 5002. Model LINE_ITEM.</div>
          <ol class="step-list">
            <li><strong>Can LINE_ITEM be identified on its own?</strong> No — "line item 1" is meaningless without knowing the order. So it is a <strong>weak entity</strong>.</li>
            <li><strong>Who is the owner?</strong> SALES_ORDER, whose key is <code>order_no</code>. The identifying relationship is CONTAINS, drawn as a double diamond.</li>
            <li><strong>What is the partial key?</strong> <code>line_no</code> — unique only inside one order. Underline it with a dashed line.</li>
            <li><strong>What is the full key?</strong> <code>(order_no, line_no)</code> — the owner's key plus the partial key.</li>
            <li><strong>Participation:</strong> every line item must belong to an order → total participation → double line on the LINE_ITEM side. Cardinality is 1:N (one order, many line items).</li>
          </ol>
          <div class="we-answer"><strong>Answer:</strong> <code>LINE_ITEM</code> is a weak entity owned by <code>SALES_ORDER</code> through the identifying relationship <code>CONTAINS</code>. Partial key = <code>line_no</code>; primary key of the mapped table = <code>(order_no, line_no)</code> with <code>order_no</code> as a foreign key declared <code>ON DELETE CASCADE</code>.</div>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"What is a weak entity type? Explain with a suitable ER diagram."</em> — definition + the four terms + draw the three doubles (5–6 marks).</li>
            <li><em>"Differentiate between strong entity and weak entity."</em> — use the 8-row comparison table (4–5 marks).</li>
            <li><em>"What is a partial key?"</em> — "an attribute that uniquely identifies weak entities belonging to the same owner; drawn with a dashed underline" (2 marks).</li>
          </ul>
        </div>

        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ Common Mistake</div>
          <p>Students mark an entity as "weak" just because it has a foreign key. That is wrong. Almost every table has foreign keys. An entity is weak <strong>only if it has no key attribute of its own</strong> and must borrow its owner's key to be identified. EMPLOYEE has a foreign key <code>dept_id</code>, but EMPLOYEE is <em>strong</em>, because <code>emp_id</code> already identifies it perfectly.</p>
        </div>
      </div>
      `
    }
  ]
});
