/**
 * Unit 2 — Part 4 (final): topics 2.10 and 2.11, plus the unit's
 * plain-language intro, exam corner, self-test quiz and glossary terms.
 */

appendTopics("unit-2", [

  /* ==================================================================== */
  /* 2.10                                                                  */
  /* ==================================================================== */
  {
    id: "u2-er-to-relational",
    title: "2.10 Converting an ER Schema to a Relational Schema",
    summary: "The seven-step mapping algorithm that turns any ER/EER diagram into CREATE TABLE statements — with a complete worked conversion of a university schema.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 9 (Sec. 9.1, 9.2) | Silberschatz Ch. 6</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>You have drawn a beautiful ER diagram. A computer cannot read a diagram — it needs <strong>tables</strong>. This topic is the recipe for turning one into the other.</p>
        <p>The good news: it is a <strong>mechanical procedure</strong>. Follow seven steps in order and the tables come out correct every time. There is no creativity required and no room for guesswork — which is exactly why it is such a popular exam question.</p>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 The Whole Algorithm in Three Lines</div>
        <p><strong>Entities become tables.</strong><br>
        <strong>Attributes become columns.</strong><br>
        <strong>Relationships become foreign keys — except M:N and n-ary, which become their own tables.</strong></p>
        <p>If you remember nothing else, those three lines will earn you most of the marks. The seven steps below just spell out the details.</p>
      </div>

      <h3>The Seven-Step Mapping Algorithm</h3>

      <div class="worked-example">
        <div class="we-title">📐 Step-by-Step Procedure</div>
        <ol class="step-list">
          <li>
            <strong>Step 1 — Map regular (strong) entity types.</strong><br>
            For each strong entity type, create a table. Include all its <em>simple</em> attributes. For a <em>composite</em> attribute, include only its simple component parts (store <code>street</code>, <code>city</code>, <code>district</code> — not <code>address</code>). Choose one key attribute as the <strong>PRIMARY KEY</strong>.
          </li>
          <li>
            <strong>Step 2 — Map weak entity types.</strong><br>
            Create a table containing the weak entity's own attributes, <em>plus</em> the primary key of its owner as a <strong>foreign key</strong>. The primary key is the <strong>combination</strong> of the owner's key and the weak entity's partial key. Add <code>ON DELETE CASCADE</code> to enforce the existence dependency.
          </li>
          <li>
            <strong>Step 3 — Map binary 1:1 relationships.</strong><br>
            Choose one of the two tables and place the other's primary key into it as a foreign key. <em>Preference:</em> pick the side with <strong>total participation</strong>, so the foreign key is never NULL. Any attributes of the relationship go into the same table.
          </li>
          <li>
            <strong>Step 4 — Map binary 1:N relationships.</strong><br>
            Place the primary key of the entity on the <strong>"1" side</strong> into the table on the <strong>"N" side</strong> as a foreign key. Relationship attributes also go into the N-side table. <em>Never do the reverse</em> — a column cannot hold many values.
          </li>
          <li>
            <strong>Step 5 — Map binary M:N relationships.</strong><br>
            Create a <strong>brand-new table</strong> (a junction or bridge table). Put in it the primary keys of <em>both</em> participating tables as foreign keys, plus every attribute of the relationship. The primary key is the <strong>combination</strong> of the two foreign keys.
          </li>
          <li>
            <strong>Step 6 — Map multivalued attributes.</strong><br>
            Create a <strong>separate table</strong> for each multivalued attribute. It holds the attribute itself plus the primary key of the owning entity as a foreign key. Its primary key is the combination of both.
          </li>
          <li>
            <strong>Step 7 — Map n-ary relationships (degree &gt; 2).</strong><br>
            Create a new table holding the primary keys of <strong>all</strong> participating entity types as foreign keys, plus any relationship attributes. The primary key is normally the combination of all those foreign keys.
          </li>
        </ol>
      </div>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead>
            <tr><th style="width:24%">ER Construct</th><th style="width:30%">Becomes in the Relational Model</th><th>Quick Rule</th></tr>
          </thead>
          <tbody>
            <tr><td>Strong entity type</td><td>A table</td><td>Key attribute → PRIMARY KEY</td></tr>
            <tr><td>Weak entity type</td><td>A table with a composite key</td><td>Owner's PK + partial key</td></tr>
            <tr><td>Simple attribute</td><td>A column</td><td>One-to-one</td></tr>
            <tr><td>Composite attribute</td><td>Several columns (one per leaf)</td><td>Drop the parent name</td></tr>
            <tr><td>Multivalued attribute</td><td><strong>A separate table</strong></td><td>Never a repeating column</td></tr>
            <tr><td>Derived attribute</td><td><strong>Nothing</strong> (usually not stored)</td><td>Compute it in the query, or use a view</td></tr>
            <tr><td>1:1 relationship</td><td>A foreign key in either table</td><td>Prefer the total-participation side</td></tr>
            <tr><td>1:N relationship</td><td>A foreign key in the <strong>N-side</strong> table</td><td>"Many carries the one"</td></tr>
            <tr><td>M:N relationship</td><td><strong>A new junction table</strong></td><td>PK = both foreign keys together</td></tr>
            <tr><td>n-ary relationship</td><td><strong>A new table</strong></td><td>PK = all participating keys</td></tr>
            <tr><td>Relationship attribute</td><td>A column in whichever table the relationship landed in</td><td>M:N → junction table</td></tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 The One Rule Students Forget</div>
        <div class="mnemonic-phrase">"Many carries the One"</div>
        <p>In a 1:N relationship the foreign key <strong>always</strong> goes in the table on the <strong>many</strong> side. One department has 50 employees — you cannot fit 50 employee IDs into one column of the DEPARTMENT row, but each of the 50 employee rows can easily hold one <code>dept_id</code>.</p>
      </div>

      <hr class="section-divider" />

      <h3>Complete Worked Conversion — A University Schema</h3>

      <div class="worked-example">
        <div class="we-title">✍️ The ER Design We Will Convert</div>
        <div class="we-question">
          <strong>Entities:</strong><br>
          • <code>DEPARTMENT</code>(<u>dept_id</u>, dept_name, phone)<br>
          • <code>STUDENT</code>(<u>roll_no</u>, name[first, last], DOB, <em>age (derived)</em>, {email} <em>(multivalued)</em>)<br>
          • <code>COURSE</code>(<u>course_code</u>, title, credit_hours)<br>
          • <code>GUARDIAN</code>(<span style="text-decoration:underline dotted">guardian_name</span>, relation, phone) — <strong>weak entity</strong> owned by STUDENT<br><br>
          <strong>Relationships:</strong><br>
          • DEPARTMENT <strong>1 : N</strong> STUDENT (BELONGS_TO) — student participation is total<br>
          • STUDENT <strong>M : N</strong> COURSE (ENROLLS, with attribute <code>grade</code>)<br>
          • DEPARTMENT <strong>1 : 1</strong> STUDENT (HEADED_BY — one student is the department representative)
        </div>
        <ol class="step-list">
          <li><strong>Step 1 — strong entities.</strong> Create <code>department</code>, <code>student</code>, <code>course</code>. Composite <code>name</code> becomes two columns <code>first_name</code> and <code>last_name</code>. The derived attribute <code>age</code> is <strong>not stored</strong>.</li>
          <li><strong>Step 2 — weak entity.</strong> Create <code>guardian</code> with <code>roll_no</code> borrowed from the owner. Primary key = <code>(roll_no, guardian_name)</code>, with <code>ON DELETE CASCADE</code>.</li>
          <li><strong>Step 3 — the 1:1 HEADED_BY.</strong> Put <code>rep_roll_no</code> into <code>department</code> as a UNIQUE foreign key (UNIQUE is what enforces the "1:1" part).</li>
          <li><strong>Step 4 — the 1:N BELONGS_TO.</strong> "Many carries the one": <code>dept_id</code> goes into <code>student</code>. Because student participation is <em>total</em>, declare it <code>NOT NULL</code>.</li>
          <li><strong>Step 5 — the M:N ENROLLS.</strong> Create the junction table <code>enrolls(roll_no, course_code, grade)</code> with primary key <code>(roll_no, course_code)</code>. The relationship attribute <code>grade</code> lives here.</li>
          <li><strong>Step 6 — the multivalued <code>email</code>.</strong> Create <code>student_email(roll_no, email)</code> with primary key <code>(roll_no, email)</code>. It must not be a column of <code>student</code>.</li>
          <li><strong>Step 7 — n-ary relationships.</strong> There are none in this design, so nothing to do.</li>
        </ol>
      </div>

      <div class="code-block">
        <div class="code-header">
          <span>The resulting relational schema</span>
          <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- The playground ships with student, course and teacher tables.\\n-- Try the same ideas on them:\\nSELECT s.sid, s.name, c.cname\\nFROM student s JOIN course c ON c.sid = s.sid\\nORDER BY s.sid;')">⚡ Try a JOIN in the Playground</button>
        </div>
        <div class="code-content"><pre>-- Step 1: strong entities
CREATE TABLE department (
  dept_id     CHAR(4) PRIMARY KEY,
  dept_name   VARCHAR(60) NOT NULL,
  phone       VARCHAR(15),
  rep_roll_no INT UNIQUE                -- Step 3: the 1:1 relationship
);

CREATE TABLE student (
  roll_no    INT PRIMARY KEY,
  first_name VARCHAR(40) NOT NULL,      -- composite attribute, flattened
  last_name  VARCHAR(40) NOT NULL,
  dob        DATE,
  -- age is DERIVED: never stored, computed when queried
  dept_id    CHAR(4) NOT NULL,          -- Step 4: 1:N, FK on the N side
  FOREIGN KEY (dept_id) REFERENCES department(dept_id)
);

CREATE TABLE course (
  course_code  CHAR(8) PRIMARY KEY,
  title        VARCHAR(80) NOT NULL,
  credit_hours INT
);

-- Step 2: weak entity -> composite primary key
CREATE TABLE guardian (
  roll_no       INT,
  guardian_name VARCHAR(60),
  relation      VARCHAR(20),
  phone         VARCHAR(15),
  PRIMARY KEY (roll_no, guardian_name),
  FOREIGN KEY (roll_no) REFERENCES student(roll_no) ON DELETE CASCADE
);

-- Step 5: M:N relationship -> its own junction table
CREATE TABLE enrolls (
  roll_no     INT,
  course_code CHAR(8),
  grade       CHAR(2),                  -- attribute OF the relationship
  PRIMARY KEY (roll_no, course_code),
  FOREIGN KEY (roll_no)     REFERENCES student(roll_no),
  FOREIGN KEY (course_code) REFERENCES course(course_code)
);

-- Step 6: multivalued attribute -> its own table
CREATE TABLE student_email (
  roll_no INT,
  email   VARCHAR(80),
  PRIMARY KEY (roll_no, email),
  FOREIGN KEY (roll_no) REFERENCES student(roll_no) ON DELETE CASCADE
);</pre></div>
      </div>

      <div class="we-answer" style="margin-top:0;"><strong>Result:</strong> 4 entities + 1 M:N relationship + 1 multivalued attribute produced <strong>6 tables</strong>. Count them in the exam: entities + M:N relationships + multivalued attributes + n-ary relationships = number of tables.</div>

      <div class="note-figure">
        <img src="images/tp/unit2/generalization-employee-table-mapping.png" alt="Employee superclass table mapped into three separate subclass tables sharing the same key" class="note-img" loading="lazy" />
        <div class="figure-caption">Figure 2.34 (Source: Tpoint Tech) — The mapping algorithm in action on a smaller example: the EMPLOYEE superclass table on the left is split into three subclass tables on the right, each still carrying the shared id so they can be joined back together.</div>
      </div>

      <hr class="section-divider" />

      <h3>Mapping EER Constructs (Specialization / Generalization)</h3>
      <p>Subclasses need an eighth step. There are four standard options — you will usually be asked for options A and B.</p>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:26%">Option</th><th>How It Works</th><th>Best When</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>A. Multiple relations — superclass + subclasses</strong></td>
              <td>One table for the superclass, plus one table per subclass containing only the extra attributes and the inherited primary key.</td>
              <td>Works in <strong>every</strong> case — the safe default answer.</td>
            </tr>
            <tr>
              <td><strong>B. Multiple relations — subclasses only</strong></td>
              <td>No superclass table. Each subclass table repeats all the inherited attributes.</td>
              <td>Only when the specialization is <strong>total and disjoint</strong>.</td>
            </tr>
            <tr>
              <td><strong>C. Single relation with one type attribute</strong></td>
              <td>One big table with a <code>type</code> column; attributes not applicable to a row are NULL.</td>
              <td>Specialization is <strong>disjoint</strong> and subclasses have few extra attributes.</td>
            </tr>
            <tr>
              <td><strong>D. Single relation with multiple boolean flags</strong></td>
              <td>One big table with a yes/no flag column per subclass.</td>
              <td>Specialization is <strong>overlapping</strong>.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ The Four Mistakes That Cost Marks</div>
        <ol>
          <li><strong>Putting the foreign key on the "1" side of a 1:N relationship.</strong> It must go on the N side.</li>
          <li><strong>Keeping a multivalued attribute as a column.</strong> A column holds one value. Three phone numbers need three rows in a separate table — never <code>phone1, phone2, phone3</code>.</li>
          <li><strong>Storing a derived attribute.</strong> If <code>age</code> is derived from <code>dob</code>, do not create an <code>age</code> column; it goes stale every birthday.</li>
          <li><strong>Forgetting the relationship's own attributes.</strong> <code>grade</code> must appear in the junction table, or the information is silently lost.</li>
        </ol>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"Explain the algorithm for converting an ER diagram into a relational schema."</em> — write the seven steps with one example each (8–10 marks).</li>
          <li><em>"Convert the given ER diagram into relational tables."</em> — a very common 10–15 mark question. Show the table structures, underline primary keys, mark foreign keys with arrows or a footnote.</li>
          <li><em>"How is a multivalued attribute represented in the relational model?"</em> — a separate table with a composite key (3 marks).</li>
        </ul>
      </div>
    </div>
    `
  },

  /* ==================================================================== */
  /* 2.11                                                                  */
  /* ==================================================================== */
  {
    id: "u2-relational-structure",
    title: "2.11 Structure of the Relational Database & Integrity Constraints",
    summary: "Relation, tuple, attribute, domain, degree and cardinality; the properties every relation must satisfy; and the three integrity constraints with the referential actions.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 5 | Silberschatz Ch. 2 | Codd (1970)</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>The <strong>relational model</strong>, invented by E. F. Codd at IBM in 1970, says something surprisingly simple: <strong>store everything in tables</strong>. That is the entire idea, and it is why the relational model beat every competitor.</p>
        <p>The formal vocabulary just gives posh names to the parts of a table: a table is a <em>relation</em>, a row is a <em>tuple</em>, a column is an <em>attribute</em>, and the set of allowed values for a column is its <em>domain</em>.</p>
      </div>

      <h3>The Vocabulary — Formal Name vs Everyday Name</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:20%">Formal Term</th><th style="width:18%">Everyday Term</th><th>Meaning</th><th style="width:22%">Example</th></tr></thead>
          <tbody>
            <tr><td><strong>Relation</strong></td><td>Table</td><td>A two-dimensional table of related data.</td><td>The <code>student</code> table</td></tr>
            <tr><td><strong>Tuple</strong></td><td>Row / Record</td><td>One single entity instance — one horizontal line of the table.</td><td>(101, Ramesh, 20, D01)</td></tr>
            <tr><td><strong>Attribute</strong></td><td>Column / Field</td><td>A named property; one vertical slice of the table.</td><td><code>name</code>, <code>age</code></td></tr>
            <tr><td><strong>Domain</strong></td><td>Data type + allowed values</td><td>The set of atomic values an attribute may take.</td><td><code>age</code> → integers 16–80</td></tr>
            <tr><td><strong>Degree (Arity)</strong></td><td>Number of columns</td><td>How many attributes the relation has.</td><td>4 columns → degree 4</td></tr>
            <tr><td><strong>Cardinality</strong></td><td>Number of rows</td><td>How many tuples the relation currently holds.</td><td>3 rows → cardinality 3</td></tr>
            <tr><td><strong>Relation Schema</strong></td><td>Table structure</td><td>The <em>definition</em>: name + list of attributes. Written <code>STUDENT(roll_no, name, age)</code>.</td><td>Fixed by the designer</td></tr>
            <tr><td><strong>Relation Instance / State</strong></td><td>Table contents</td><td>The set of tuples stored at a particular moment.</td><td>Changes every time you INSERT</td></tr>
            <tr><td><strong>NULL</strong></td><td>Empty cell</td><td>Value unknown, missing or not applicable.</td><td>An unrecorded phone number</td></tr>
          </tbody>
        </table>
      </div>

      <div class="svg-figure">
        <svg viewBox="0 0 780 300" role="img" aria-label="An annotated table showing tuple, attribute, degree and cardinality">
          <!-- header row -->
          <rect x="140" y="70" width="130" height="40" fill="rgba(99,102,241,0.25)" stroke="#6366f1" stroke-width="1.5"/>
          <rect x="270" y="70" width="150" height="40" fill="rgba(99,102,241,0.25)" stroke="#6366f1" stroke-width="1.5"/>
          <rect x="420" y="70" width="90" height="40" fill="rgba(99,102,241,0.25)" stroke="#6366f1" stroke-width="1.5"/>
          <rect x="510" y="70" width="110" height="40" fill="rgba(99,102,241,0.25)" stroke="#6366f1" stroke-width="1.5"/>
          <text x="205" y="95" text-anchor="middle" font-size="13" font-weight="700">roll_no</text>
          <text x="345" y="95" text-anchor="middle" font-size="13" font-weight="700">name</text>
          <text x="465" y="95" text-anchor="middle" font-size="13" font-weight="700">age</text>
          <text x="565" y="95" text-anchor="middle" font-size="13" font-weight="700">dept_id</text>

          <!-- data rows -->
          <rect x="140" y="110" width="480" height="36" class="svg-panel" stroke-width="1.2"/>
          <rect x="140" y="146" width="480" height="36" fill="rgba(16,185,129,0.14)" stroke="#10b981" stroke-width="2"/>
          <rect x="140" y="182" width="480" height="36" class="svg-panel" stroke-width="1.2"/>
          <text x="205" y="133" text-anchor="middle" font-size="12">101</text>
          <text x="345" y="133" text-anchor="middle" font-size="12">Ramesh Thapa</text>
          <text x="465" y="133" text-anchor="middle" font-size="12">20</text>
          <text x="565" y="133" text-anchor="middle" font-size="12">D01</text>
          <text x="205" y="169" text-anchor="middle" font-size="12">102</text>
          <text x="345" y="169" text-anchor="middle" font-size="12">Sita Karki</text>
          <text x="465" y="169" text-anchor="middle" font-size="12">21</text>
          <text x="565" y="169" text-anchor="middle" font-size="12">D02</text>
          <text x="205" y="205" text-anchor="middle" font-size="12">103</text>
          <text x="345" y="205" text-anchor="middle" font-size="12">Hari Gurung</text>
          <text x="465" y="205" text-anchor="middle" font-size="12">19</text>
          <text x="565" y="205" text-anchor="middle" font-size="12">D01</text>

          <!-- labels -->
          <text x="70" y="90" text-anchor="middle" font-size="12" font-weight="700" fill="#6366f1">ATTRIBUTES</text>
          <text x="70" y="106" text-anchor="middle" font-size="11" class="svg-muted">(columns)</text>
          <text x="70" y="169" text-anchor="middle" font-size="12" font-weight="700" fill="#10b981">TUPLE</text>
          <text x="70" y="185" text-anchor="middle" font-size="11" class="svg-muted">(one row)</text>
          <line x1="110" y1="165" x2="138" y2="165" stroke="#10b981" stroke-width="2"/>

          <line x1="140" y1="46" x2="620" y2="46" stroke="#f59e0b" stroke-width="2"/>
          <line x1="140" y1="40" x2="140" y2="52" stroke="#f59e0b" stroke-width="2"/>
          <line x1="620" y1="40" x2="620" y2="52" stroke="#f59e0b" stroke-width="2"/>
          <text x="380" y="34" text-anchor="middle" font-size="12" font-weight="700" fill="#f59e0b">DEGREE = 4 (number of columns)</text>

          <line x1="654" y1="110" x2="654" y2="218" stroke="#8b5cf6" stroke-width="2"/>
          <line x1="648" y1="110" x2="660" y2="110" stroke="#8b5cf6" stroke-width="2"/>
          <line x1="648" y1="218" x2="660" y2="218" stroke="#8b5cf6" stroke-width="2"/>
          <text x="712" y="158" text-anchor="middle" font-size="12" font-weight="700" fill="#8b5cf6">CARDINALITY</text>
          <text x="712" y="176" text-anchor="middle" font-size="12" font-weight="700" fill="#8b5cf6">= 3 rows</text>

          <text x="380" y="252" text-anchor="middle" font-size="12" class="svg-muted">RELATION SCHEMA: STUDENT(roll_no, name, age, dept_id) — the structure, fixed</text>
          <text x="380" y="272" text-anchor="middle" font-size="12" class="svg-muted">RELATION INSTANCE: the three tuples above — the contents, always changing</text>
        </svg>
        <div class="figure-caption">Figure 2.36 — Every relational-model term on one annotated table. Note that degree counts <em>columns</em> and cardinality counts <em>rows</em> — a classic exam trap.</div>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ Degree vs Cardinality — Don't Swap Them</div>
        <p><strong>De</strong>gree → <strong>de</strong>finition → about the <em>columns</em> (part of the schema).<br>
        <strong>Cardinality</strong> → <strong>counting</strong> the rows (part of the data).</p>
        <p>Careful: the word "cardinality" also means something else in the ER model (the 1:N ratio). In the relational model it means <em>number of tuples</em>. Read the question to see which one is being asked.</p>
      </div>

      <hr class="section-divider" />

      <h3>Properties Every Relation Must Satisfy</h3>
      <p>Codd defined six properties. A table that breaks any of them is not a valid relation.</p>

      <div class="grid-2col">
        <div class="feature-card">
          <h4>1. Every cell holds a single atomic value</h4>
          <p>No lists, no nested tables. This is what "first normal form" means (Unit 4). <code>phone = '981,982'</code> is illegal.</p>
        </div>
        <div class="feature-card">
          <h4>2. All values in a column come from the same domain</h4>
          <p>An <code>age</code> column contains only ages — never a date, never a name.</p>
        </div>
        <div class="feature-card">
          <h4>3. Every attribute name is unique within the relation</h4>
          <p>You cannot have two columns both called <code>name</code> in the same table.</p>
        </div>
        <div class="feature-card">
          <h4>4. The order of tuples is irrelevant</h4>
          <p>A relation is a <em>set</em> of tuples. Rows have no "position". This is why you must use <code>ORDER BY</code> if you want a specific order.</p>
        </div>
        <div class="feature-card">
          <h4>5. The order of attributes is irrelevant</h4>
          <p>Columns are identified by name, not by position.</p>
        </div>
        <div class="feature-card">
          <h4>6. No two tuples are identical</h4>
          <p>Because a relation is a set, duplicate rows cannot exist — guaranteed by the primary key.</p>
        </div>
      </div>

      <div class="note-figure">
        <img src="images/tp/unit2/relational-model-non-atomic-example.png" alt="An EMPLOYEE table with two addresses crammed into a single Address cell" class="note-img" loading="lazy" />
        <div class="figure-caption">Figure 2.37 (Source: Tpoint Tech) — A relation that breaks property 1: the <code>Address</code> cell for employee 102 holds two values at once. A valid relation would split this into a separate row, or a separate table, so every cell stays atomic.</div>
      </div>

      <hr class="section-divider" />

      <h3>The Three Integrity Constraints</h3>
      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>Integrity constraints are the database's <strong>rules that keep the data sensible</strong>. Instead of trusting every programmer to remember "don't enter a negative salary", you tell the DBMS the rule once and it enforces it forever, for every application.</p>
      </div>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:22%">Constraint</th><th>Rule</th><th style="width:30%">What It Prevents</th></tr></thead>
          <tbody>
            <tr>
              <td><strong>1. Domain Integrity</strong></td>
              <td>Every value in a column must belong to that column's declared domain (correct data type, within the allowed range, NOT NULL if required).</td>
              <td>Storing "twenty" in an integer <code>age</code> column, or an age of −5.</td>
            </tr>
            <tr>
              <td><strong>2. Entity Integrity</strong></td>
              <td>No part of a primary key may be <strong>NULL</strong>.</td>
              <td>A row nobody can identify or refer to.</td>
            </tr>
            <tr>
              <td><strong>3. Referential Integrity</strong></td>
              <td>Every foreign-key value must either match an existing primary-key value in the referenced table, or be entirely NULL.</td>
              <td>An "orphan" row — an employee in department D99 when no department D99 exists.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>Referential Actions — What Happens on DELETE or UPDATE?</h3>
      <p>If you delete a department that still has employees, referential integrity would break. SQL lets you choose what the DBMS should do.</p>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:22%">Action</th><th>Behaviour When the Parent Row Is Deleted/Updated</th><th style="width:26%">Use It When</th></tr></thead>
          <tbody>
            <tr><td><code>RESTRICT</code> / <code>NO ACTION</code></td><td>Reject the operation with an error. <strong>This is the default.</strong></td><td>The child rows genuinely block the delete (safest).</td></tr>
            <tr><td><code>CASCADE</code></td><td>Delete (or update) the child rows automatically too.</td><td>The child cannot exist without the parent — e.g. a weak entity.</td></tr>
            <tr><td><code>SET NULL</code></td><td>Set the child's foreign key to NULL.</td><td>The link is optional — e.g. an employee may temporarily have no department.</td></tr>
            <tr><td><code>SET DEFAULT</code></td><td>Set the child's foreign key to its declared default value.</td><td>There is a sensible fallback, e.g. an "Unassigned" department.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="code-block">
        <div class="code-header"><span>SQL — declaring all three integrity constraints</span></div>
        <div class="code-content"><pre>CREATE TABLE department (
  dept_id   CHAR(4) PRIMARY KEY,                 -- ENTITY integrity
  dept_name VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE employee (
  emp_id  INT PRIMARY KEY,                       -- ENTITY integrity
  name    VARCHAR(60) NOT NULL,                  -- DOMAIN integrity
  age     INT CHECK (age BETWEEN 18 AND 65),     -- DOMAIN integrity
  salary  DECIMAL(10,2) CHECK (salary > 0),      -- DOMAIN integrity
  dept_id CHAR(4),
  FOREIGN KEY (dept_id) REFERENCES department(dept_id)   -- REFERENTIAL
      ON DELETE SET NULL                         -- referential action
      ON UPDATE CASCADE
);</pre></div>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Worked Example</div>
        <div class="we-question">Given <code>STUDENT(roll_no, name, dept_id)</code> with 3 columns and 50 rows, and <code>DEPARTMENT(dept_id, dept_name)</code>: state the degree and cardinality of STUDENT, and say which operations below are rejected and by which constraint.<br>
        (a) <code>INSERT INTO student VALUES (NULL, 'Gita', 'D01');</code><br>
        (b) <code>INSERT INTO student VALUES (204, 'Gita', 'D99');</code> where D99 does not exist<br>
        (c) <code>DELETE FROM department WHERE dept_id = 'D01';</code> while students still reference D01</div>
        <ol class="step-list">
          <li><strong>Degree = 3</strong> (roll_no, name, dept_id — count the columns). <strong>Cardinality = 50</strong> (count the rows).</li>
          <li><strong>(a)</strong> <code>roll_no</code> is the primary key and the value supplied is NULL → violates <strong>entity integrity</strong> → rejected.</li>
          <li><strong>(b)</strong> <code>dept_id = 'D99'</code> does not exist in the parent table → violates <strong>referential integrity</strong> → rejected (this would create an orphan row).</li>
          <li><strong>(c)</strong> Depends on the declared referential action: with the default <code>RESTRICT</code> it is <strong>rejected</strong>; with <code>ON DELETE CASCADE</code> the students are deleted too; with <code>ON DELETE SET NULL</code> their <code>dept_id</code> becomes NULL.</li>
        </ol>
        <div class="we-answer"><strong>Answer:</strong> Degree 3, cardinality 50. (a) rejected by entity integrity; (b) rejected by referential integrity; (c) behaviour depends on the referential action, defaulting to rejection.</div>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"Define relation, tuple, attribute, domain, degree and cardinality with an example."</em> — draw the annotated table (5–6 marks).</li>
          <li><em>"Explain the integrity constraints in the relational model."</em> — all three with a violation example each (6 marks).</li>
          <li><em>"State the properties of a relation."</em> — the six properties (4 marks).</li>
          <li><em>"What is referential integrity? Explain the actions taken when a referenced tuple is deleted."</em> — definition + the four referential actions (5 marks).</li>
        </ul>
      </div>
    </div>
    `
  }
]);

/* ====================================================================== */
/* Unit 2 extras — plain-language intro, exam corner and self-test quiz    */
/* ====================================================================== */

registerUnitExtras("unit-2", {
  simpleIntro: {
    heading: "What This Unit Is Really About",
    text: "<p>This unit teaches you to <strong>draw a database before you build it</strong>, and then to <strong>turn that drawing into tables</strong>.</p><p>Everything here is one continuous story: you list the things you need to store (entities), the details about them (attributes), and how they connect (relationships). You draw that as an ER diagram. You refine it with inheritance when some things are special kinds of other things (EER). Finally you run a seven-step recipe that converts the picture into <code>CREATE TABLE</code> statements. At 10 lecture hours it is the largest conceptual unit in the course, and questions from it appear in every paper.</p>",
    goals: [
      "Draw a correct ER diagram for any case study, with proper symbols for every attribute and constraint.",
      "State the cardinality ratio and participation constraint of any relationship, in both 1:N and (min, max) notation.",
      "Recognise a weak entity and give it a correct composite key.",
      "Apply specialization and generalization, and state the disjoint/overlapping and total/partial constraints.",
      "Convert any ER diagram into relational tables using the seven-step algorithm.",
      "Define every relational-model term and the three integrity constraints."
    ]
  },

  examCorner: {
    mustKnow: [
      "Entity vs entity type vs entity set",
      "All six attribute types and their symbols",
      "Degree of a relationship (unary, binary, ternary)",
      "Cardinality ratio: 1:1, 1:N, M:N",
      "Participation: total (double line) vs partial (single line)",
      "(min, max) notation — min=0 means partial",
      "Weak entity: double rectangle, double diamond, partial key",
      "Super, candidate, primary, alternate, composite, foreign, surrogate key",
      "Specialization (top-down) vs generalization (bottom-up)",
      "Disjoint (d) / overlapping (o); total / partial specialization",
      "Aggregation and union types (categories)",
      "The seven-step ER-to-relational mapping algorithm",
      "Relation, tuple, attribute, domain, degree, cardinality",
      "Entity integrity, referential integrity, domain integrity"
    ],
    questions: [
      {
        q: "Explain different types of attributes used in the ER model with suitable examples and notation.",
        marks: "8",
        a: "<p>Give the definition of an attribute, then cover all six types:</p><ul><li><strong>Simple (atomic)</strong> — cannot be divided further. Plain ellipse. <em>Example:</em> Age, Gender.</li><li><strong>Composite</strong> — divisible into meaningful parts. Ellipse with child ellipses. <em>Example:</em> Name → First, Middle, Last.</li><li><strong>Single-valued</strong> — exactly one value per entity. <em>Example:</em> Date_of_Birth.</li><li><strong>Multivalued</strong> — several values at once. Double ellipse. <em>Example:</em> Phone_No.</li><li><strong>Derived</strong> — computed, not stored. Dashed ellipse. <em>Example:</em> Age derived from DOB.</li><li><strong>Complex</strong> — nesting of composite and multivalued, e.g. {Address_Phone({Phone}, Address(Street, City))}.</li></ul><p>Add that a <strong>key attribute</strong> is shown by underlining, and a <strong>partial key</strong> by a dashed underline. Draw all the ellipse shapes — the symbols carry marks.</p>"
      },
      {
        q: "What are structural constraints? Explain cardinality ratio and participation constraint with examples.",
        marks: "8",
        a: "<p><strong>Structural constraints</strong> limit the possible combinations of entities that may take part in a relationship. There are two of them.</p><p><strong>1. Cardinality ratio</strong> — the <em>maximum</em> number of relationship instances an entity may participate in. Four cases:</p><ul><li><strong>1:1</strong> — Employee MANAGES Department.</li><li><strong>1:N</strong> — Department HAS Employees.</li><li><strong>N:1</strong> — the same, read from the other side.</li><li><strong>M:N</strong> — Student ENROLLS_IN Course.</li></ul><p><strong>2. Participation constraint</strong> — whether an entity's existence depends on the relationship, i.e. the <em>minimum</em>.</p><ul><li><strong>Total (mandatory)</strong> — every entity must participate. Drawn with a <strong>double line</strong>. <em>Example:</em> every EMPLOYEE must work for some DEPARTMENT.</li><li><strong>Partial (optional)</strong> — only some entities participate. Single line. <em>Example:</em> only a few employees manage a department.</li></ul><p>Both can be written together as <strong>(min, max)</strong>: min = 0 → partial; min ≥ 1 → total. So (1,1) on the EMPLOYEE side of WORKS_FOR means total participation with cardinality 1.</p>"
      },
      {
        q: "What is a weak entity type? Explain with a suitable ER diagram and show how it is mapped to a relation.",
        marks: "8",
        a: "<p>A <strong>weak entity type</strong> has no key attribute of its own, so it cannot be identified without reference to another entity.</p><p>Four associated terms:</p><ul><li><strong>Owner / identifying entity type</strong> — the strong entity whose key is borrowed (EMPLOYEE).</li><li><strong>Identifying relationship</strong> — drawn as a <strong>double diamond</strong> (DEPENDENTS_OF).</li><li><strong>Partial key (discriminator)</strong> — unique only within one owner; drawn with a <strong>dashed underline</strong> (Dependent_Name).</li><li><strong>Total participation</strong> — always, shown by a <strong>double line</strong>.</li></ul><p><strong>Notation:</strong> double rectangle, double diamond, double line.</p><p><strong>Mapping:</strong> create a table with the weak entity's attributes plus the owner's primary key as a foreign key. The primary key is the combination of the two:</p><p><code>DEPENDENT(<u>emp_id</u>, <u>dep_name</u>, relationship, birth_date)</code>, with <code>emp_id</code> a foreign key declared <code>ON DELETE CASCADE</code>.</p>"
      },
      {
        q: "Differentiate between specialization and generalization. Explain the constraints that apply to them.",
        marks: "10",
        a: "<p><strong>Specialization</strong> is a <em>top-down</em> process: start from one general entity type and split it into subclasses based on a distinguishing characteristic (EMPLOYEE → ENGINEER, DRIVER, SECRETARY). It is driven by <em>differences</em>.</p><p><strong>Generalization</strong> is a <em>bottom-up</em> process: start from several specific entity types and extract their common attributes into a new superclass (CAR, TRUCK → VEHICLE). It is driven by <em>similarities</em>.</p><p>Both create an <strong>IS-A relationship</strong> and both give the subclass <strong>attribute inheritance</strong> — a subclass automatically owns all attributes and relationships of its superclass.</p><p><strong>Two constraints apply:</strong></p><ul><li><strong>Disjointness</strong> — <code>d</code> (disjoint: an entity may belong to at most one subclass, e.g. CAR or TRUCK) vs <code>o</code> (overlapping: an entity may belong to several, e.g. a person who is both STUDENT and EMPLOYEE).</li><li><strong>Completeness</strong> — <strong>total</strong> (double line: every superclass entity must belong to some subclass) vs <strong>partial</strong> (single line: some may belong to none).</li></ul><p>These combine into four cases: disjoint+total, disjoint+partial, overlapping+total, overlapping+partial.</p>"
      },
      {
        q: "Explain the algorithm for converting an ER schema into a relational schema.",
        marks: "10",
        a: "<ol><li><strong>Map regular entity types</strong> — one table each, include simple attributes and the simple components of composite attributes; choose a primary key.</li><li><strong>Map weak entity types</strong> — one table including the owner's primary key as a foreign key; the primary key is owner's key + partial key; use ON DELETE CASCADE.</li><li><strong>Map binary 1:1 relationships</strong> — place one side's primary key into the other table as a foreign key, preferring the side with total participation.</li><li><strong>Map binary 1:N relationships</strong> — place the primary key of the 1-side into the table on the N-side as a foreign key (\"many carries the one\").</li><li><strong>Map binary M:N relationships</strong> — create a new junction table containing both primary keys as foreign keys plus the relationship's attributes; the primary key is the combination of both foreign keys.</li><li><strong>Map multivalued attributes</strong> — one separate table per multivalued attribute, holding the attribute plus the owner's primary key; key = both together.</li><li><strong>Map n-ary relationships</strong> — a new table holding the primary keys of all participating entity types plus the relationship's attributes.</li></ol><p>For EER constructs add an eighth step with four options, of which \"superclass table plus one table per subclass\" always works.</p>"
      },
      {
        q: "Define super key, candidate key, primary key, alternate key and foreign key with examples.",
        marks: "6",
        a: "<p>Using <code>STUDENT(Roll_No, Citizenship_No, Email, Name, Dept_ID)</code>:</p><ul><li><strong>Super key</strong> — any set of attributes that uniquely identifies a tuple; extra attributes allowed. <em>Example:</em> {Roll_No}, {Roll_No, Name}.</li><li><strong>Candidate key</strong> — a <em>minimal</em> super key; removing any attribute destroys uniqueness. <em>Example:</em> {Roll_No}, {Citizenship_No}, {Email}.</li><li><strong>Primary key</strong> — the candidate key chosen by the designer to identify tuples; must be unique and NOT NULL. <em>Example:</em> Roll_No.</li><li><strong>Alternate key</strong> — the candidate keys not chosen as primary. <em>Example:</em> Citizenship_No, Email.</li><li><strong>Foreign key</strong> — an attribute referring to the primary key of another relation; enforces referential integrity and may be NULL or duplicated. <em>Example:</em> Dept_ID referencing DEPARTMENT.</li></ul><p>Relationship: every candidate key is a super key, and exactly one candidate key becomes the primary key.</p>"
      },
      {
        q: "Explain the integrity constraints of the relational model with examples.",
        marks: "6",
        a: "<ul><li><strong>Domain integrity</strong> — every value must come from the attribute's declared domain (correct type and range). <em>Violation:</em> storing 'twenty' or −5 in an integer <code>age</code> column restricted to 18–65.</li><li><strong>Entity integrity</strong> — no part of a primary key may be NULL, because a missing value cannot identify a tuple. <em>Violation:</em> inserting a student with <code>roll_no = NULL</code>.</li><li><strong>Referential integrity</strong> — every foreign key value must match an existing primary key value in the referenced relation, or be wholly NULL. <em>Violation:</em> an employee with <code>dept_id = 'D99'</code> when no such department exists (an orphan tuple).</li></ul><p>When a referenced tuple is deleted or updated, SQL offers four <strong>referential actions</strong>: RESTRICT/NO ACTION (reject — the default), CASCADE (propagate), SET NULL, and SET DEFAULT.</p>"
      },
      {
        q: "What is aggregation in the EER model? Why is it required?",
        marks: "5",
        a: "<p>The basic ER model does not permit a <strong>relationship to participate in another relationship</strong> — a line cannot be drawn from an entity to a diamond. <strong>Aggregation</strong> removes this limitation by treating an entire relationship (together with its participating entities) as a single higher-level abstract entity, which can then take part in further relationships.</p><p><em>Example:</em> DOCTOR—TREATS—PATIENT is a relationship. To record which TEST was ordered for a particular treatment, we aggregate DOCTOR-TREATS-PATIENT into one abstract entity (drawn by enclosing it in a dashed box) and connect TEST to it through a REQUIRES relationship.</p><p>Without aggregation the test could only be linked to the doctor or to the patient separately, which loses the fact that it belonged to <em>that specific treatment</em>.</p>"
      }
    ]
  },

  quiz: [
    {
      q: "In an ER diagram, a multivalued attribute is represented by:",
      opts: ["A double ellipse", "A dashed ellipse", "A double rectangle", "An underlined ellipse"],
      correct: 0,
      explain: "A double ellipse means multivalued. A dashed ellipse is derived, a double rectangle is a weak entity, and an underline marks a key attribute."
    },
    {
      q: "A relationship in which an entity type participates with itself is called:",
      opts: ["A recursive (unary) relationship", "A ternary relationship", "An identifying relationship", "A weak relationship"],
      correct: 0,
      explain: "EMPLOYEE supervises EMPLOYEE is recursive. Role names such as 'supervisor' and 'supervisee' are compulsory here to remove ambiguity."
    },
    {
      q: "In a 1:N relationship between DEPARTMENT and EMPLOYEE, the foreign key is placed in:",
      opts: ["The EMPLOYEE table (the N side)", "The DEPARTMENT table (the 1 side)", "A new junction table", "Both tables"],
      correct: 0,
      explain: "'Many carries the one.' One department has many employees, so each employee row stores one dept_id. The reverse is impossible — a single column cannot hold many employee IDs."
    },
    {
      q: "A weak entity type is characterised by:",
      opts: [
        "Having no key attribute of its own",
        "Having a foreign key",
        "Participating in many relationships",
        "Having only derived attributes"
      ],
      correct: 0,
      explain: "Having a foreign key does not make an entity weak — almost every table has one. A weak entity must borrow its owner's primary key because it has no key of its own."
    },
    {
      q: "Which notation indicates TOTAL participation?",
      opts: ["A double line between the entity and the relationship", "A double ellipse", "A double diamond", "An arrow on the line"],
      correct: 0,
      explain: "A double line means participation is mandatory. A double diamond is an identifying relationship, and a double ellipse is a multivalued attribute."
    },
    {
      q: "Which of these is a minimal super key?",
      opts: ["Candidate key", "Foreign key", "Surrogate key", "Composite key"],
      correct: 0,
      explain: "A candidate key is by definition a minimal super key — remove any attribute and it stops being unique. The primary key is the candidate key the designer selects."
    },
    {
      q: "In the (min, max) notation, what does a min value of 0 indicate?",
      opts: ["Partial participation", "Total participation", "A cardinality ratio of 1:1", "A weak entity"],
      correct: 0,
      explain: "min = 0 means an entity need not participate at all, which is exactly partial participation. min ≥ 1 means total participation."
    },
    {
      q: "The process of creating a superclass from several similar existing entity types is called:",
      opts: ["Generalization", "Specialization", "Aggregation", "Normalization"],
      correct: 0,
      explain: "Generalization is bottom-up (CAR, TRUCK → VEHICLE). Specialization is the top-down opposite. Remember: SPECIALization = SPlit."
    },
    {
      q: "The letter 'd' inside the specialization circle of an EER diagram means:",
      opts: [
        "Subclasses are disjoint — an entity can belong to at most one",
        "The specialization is derived",
        "The specialization is a duplicate",
        "Subclasses may overlap"
      ],
      correct: 0,
      explain: "'d' is disjoint, 'o' is overlapping. This is a separate question from total vs partial, which is shown by a double vs single line."
    },
    {
      q: "An M:N relationship between STUDENT and COURSE with an attribute 'grade' is mapped to:",
      opts: [
        "A new junction table containing both keys plus grade",
        "A foreign key in STUDENT",
        "A foreign key in COURSE",
        "A grade column added to both tables"
      ],
      correct: 0,
      explain: "M:N always needs a third table. 'grade' belongs to the relationship, so it becomes a column of that junction table — it cannot live in STUDENT or COURSE."
    },
    {
      q: "The number of attributes (columns) in a relation is called its:",
      opts: ["Degree", "Cardinality", "Domain", "Instance"],
      correct: 0,
      explain: "Degree counts columns; cardinality counts rows. A handy hook: DEgree → DEfinition → the schema side."
    },
    {
      q: "Entity integrity states that:",
      opts: [
        "No part of a primary key may be NULL",
        "Every foreign key must match a primary key",
        "Every value must be from the correct domain",
        "No two tables may share a column name"
      ],
      correct: 0,
      explain: "Entity integrity protects the primary key. Referential integrity is the rule about foreign keys matching, and domain integrity is about allowed values."
    },
    {
      q: "A derived attribute such as Age (computed from Date_of_Birth) is mapped to:",
      opts: [
        "Nothing — it is normally not stored at all",
        "A separate table",
        "A column with a NOT NULL constraint",
        "A composite primary key"
      ],
      correct: 0,
      explain: "Storing a derived value makes it go stale — Age would be wrong the day after every birthday. Compute it in the query or expose it through a view."
    },
    {
      q: "Aggregation is needed in the EER model because:",
      opts: [
        "A relationship cannot directly participate in another relationship",
        "Weak entities have no key",
        "Multivalued attributes cannot be stored",
        "Subclasses cannot inherit attributes"
      ],
      correct: 0,
      explain: "Aggregation wraps a whole relationship into one abstract entity so that another relationship can be attached to it — as with TEST attached to the DOCTOR-TREATS-PATIENT treatment."
    },
    {
      q: "Which referential action automatically deletes child rows when the parent row is deleted?",
      opts: ["ON DELETE CASCADE", "ON DELETE SET NULL", "ON DELETE RESTRICT", "ON DELETE NO ACTION"],
      correct: 0,
      explain: "CASCADE propagates the delete — the standard choice for a weak entity, whose existence depends on its owner. RESTRICT (the default) rejects the delete instead."
    }
  ]
});

registerGlossary("Unit 2", [
  ["Entity", "A real-world object or concept that can be distinguished from all other objects, e.g. a particular student."],
  ["Entity Type", "The definition (schema) shared by a group of entities with the same attributes; drawn as a rectangle."],
  ["Entity Set", "The collection of all entities of one entity type currently stored in the database."],
  ["Attribute", "A property or detail recorded about an entity; drawn as an ellipse."],
  ["Composite Attribute", "An attribute divisible into smaller meaningful attributes, e.g. Name → First, Middle, Last."],
  ["Multivalued Attribute", "An attribute that may hold several values at once for one entity; drawn as a double ellipse."],
  ["Derived Attribute", "An attribute calculated from other stored data rather than stored itself; drawn as a dashed ellipse."],
  ["Key Attribute", "An attribute whose value is distinct for every entity in the set; drawn underlined."],
  ["Relationship", "An association among two or more entities; drawn as a diamond containing a verb."],
  ["Degree of a Relationship", "The number of entity types participating in it: unary (1), binary (2), ternary (3)."],
  ["Role Name", "A label on a relationship line stating the part an entity plays; compulsory in recursive relationships."],
  ["Cardinality Ratio", "The maximum number of relationship instances an entity can take part in: 1:1, 1:N, N:1 or M:N."],
  ["Participation Constraint", "Whether an entity must take part in a relationship: total (double line) or partial (single line)."],
  ["(min, max) Notation", "A compact way to write both constraints on one line; min = 0 means partial, min ≥ 1 means total."],
  ["Weak Entity Type", "An entity type with no key attribute of its own; drawn as a double rectangle."],
  ["Identifying Relationship", "The relationship connecting a weak entity to its owner; drawn as a double diamond."],
  ["Partial Key", "An attribute that identifies weak entities belonging to the same owner; drawn with a dashed underline."],
  ["Super Key", "Any set of attributes whose values are unique for every tuple; extra attributes are permitted."],
  ["Candidate Key", "A minimal super key — no attribute can be removed without losing uniqueness."],
  ["Primary Key", "The candidate key chosen to identify tuples; must be unique and NOT NULL."],
  ["Alternate Key", "A candidate key that was not chosen as the primary key; usually enforced with UNIQUE."],
  ["Foreign Key", "An attribute referring to the primary key of another relation, creating the link between tables."],
  ["Surrogate Key", "An artificial, system-generated identifier with no real-world meaning."],
  ["Specialization", "The top-down process of splitting a superclass into subclasses based on differences."],
  ["Generalization", "The bottom-up process of extracting the common attributes of several entity types into a new superclass."],
  ["IS-A Relationship", "The link between a subclass and its superclass, e.g. 'an ENGINEER is an EMPLOYEE'."],
  ["Attribute Inheritance", "A subclass automatically owns all attributes and relationships of its superclass."],
  ["Disjoint Constraint (d)", "An entity may belong to at most one subclass of a specialization."],
  ["Overlapping Constraint (o)", "An entity may belong to several subclasses at the same time."],
  ["Total Specialization", "Every entity of the superclass must belong to at least one subclass; drawn with a double line."],
  ["Specialization Lattice", "A structure where a subclass has more than one superclass, giving multiple inheritance."],
  ["Category (Union Type)", "A subclass whose members come from the union of several unrelated superclasses; symbol ∪."],
  ["Aggregation", "Treating an entire relationship as a single abstract entity so it can participate in another relationship."],
  ["Relation", "The formal name for a table in the relational model."],
  ["Tuple", "The formal name for a row of a relation."],
  ["Domain", "The set of atomic values an attribute is permitted to take."],
  ["Degree (Arity)", "The number of attributes (columns) in a relation."],
  ["Cardinality (Relational)", "The number of tuples (rows) currently in a relation."],
  ["Entity Integrity", "The rule that no part of a primary key may be NULL."],
  ["Referential Integrity", "The rule that a foreign key value must match an existing primary key value, or be NULL."],
  ["Domain Integrity", "The rule that every value must belong to its attribute's declared domain."]
]);
