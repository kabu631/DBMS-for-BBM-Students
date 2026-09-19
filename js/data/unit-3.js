/**
 * Unit 3 — SQL (12 Lecture Hours). Part 1 of 2: topics 3.1 – 3.4.
 *
 * Every "Run in Playground" button uses the three tables that ship with the
 * SQL Playground (student, course, teacher), so each example really executes.
 */

registerUnit({
  id: "unit-3",
  number: "Unit 3",
  title: "SQL — Structured Query Language",
  subtitle: "Creating tables, protecting them with constraints, and asking the database questions — from a one-line SELECT to multi-table joins, grouping and subqueries",
  readingTime: "12 Lecture Hours (LHs)",
  description: "Data Definition and Data Types; Specifying Constraints; Basic Retrieval Queries; Complex Retrieval Queries; INSERT, DELETE, and UPDATE Statements; Views.",
  topics: [

    /* ================================================================== */
    {
      id: "u3-intro-ddl",
      title: "3.1 Introduction to SQL, Data Definition & Data Types",
      summary: "What SQL is, its four sub-languages, every common data type, and the DDL commands CREATE, ALTER, DROP, TRUNCATE and RENAME.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 6 | Silberschatz Ch. 3 | ISO/IEC SQL Standard</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p><strong>SQL</strong> (say it "sequel" or "ess-cue-ell") is the language you use to <em>talk to</em> a relational database. It is deliberately close to English:</p>
          <p><code>SELECT name FROM student WHERE age &gt; 21;</code> reads as "select the name from the student table where the age is greater than 21." You are not writing a program — you are writing a <strong>request</strong>.</p>
        </div>

        <div class="learn-box analogy-box">
          <div class="learn-title">🍽️ Everyday Analogy</div>
          <p>SQL is like ordering in a restaurant. You say <em>what</em> you want ("a plate of momo, no chilli"), not <em>how</em> to make it. The kitchen (the DBMS query optimiser) works out the fastest way to prepare it.</p>
          <p>This is why SQL is called a <strong>declarative</strong> language — you declare the result you want, and the DBMS figures out the procedure.</p>
        </div>

        <h3>The Four Sub-Languages of SQL</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:14%">Sub-Language</th><th style="width:20%">Full Name</th><th>Purpose</th><th style="width:28%">Commands</th></tr></thead>
            <tbody>
              <tr><td><span class="lang-badge lang-badge-ddl">DDL</span></td><td>Data Definition Language</td><td>Defines and changes the <strong>structure</strong> of the database. Auto-committed — you cannot roll a DDL statement back.</td><td><code>CREATE</code>, <code>ALTER</code>, <code>DROP</code>, <code>TRUNCATE</code>, <code>RENAME</code></td></tr>
              <tr><td><span class="lang-badge lang-badge-dml">DML</span></td><td>Data Manipulation Language</td><td>Works with the <strong>data itself</strong> — reading and changing rows.</td><td><code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code></td></tr>
              <tr><td><span class="lang-badge lang-badge-dcl">DCL</span></td><td>Data Control Language</td><td>Controls <strong>who is allowed</strong> to do what.</td><td><code>GRANT</code>, <code>REVOKE</code></td></tr>
              <tr><td><span class="lang-badge lang-badge-tcl">TCL</span></td><td>Transaction Control Language</td><td>Groups statements into all-or-nothing <strong>transactions</strong>.</td><td><code>COMMIT</code>, <code>ROLLBACK</code>, <code>SAVEPOINT</code></td></tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 Memory Trick</div>
          <div class="mnemonic-phrase">D-D-D-T: Define · Do · Decide · Transact</div>
          <p><strong>DD</strong>L <strong>D</strong>efines the structure. <strong>DM</strong>L <strong>D</strong>oes things to the data. <strong>DC</strong>L <strong>D</strong>ecides who may do it. <strong>TC</strong>L makes it stick (or undoes it).</p>
          <p>Handy exam fact: <code>SELECT</code> is <strong>DML</strong>, not DDL — a surprising number of marks are lost here. Some books call it DQL (Data Query Language); either answer is accepted, but never call it DDL.</p>
        </div>

        <hr class="section-divider" />

        <h3>SQL Data Types</h3>
        <p>Choosing the right type is the first decision of any table design. It controls how much space a row uses and which values the DBMS will refuse.</p>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:16%">Category</th><th style="width:20%">Type</th><th>Meaning</th><th style="width:24%">Example Column</th></tr></thead>
            <tbody>
              <tr><td rowspan="5"><strong>Numeric</strong></td><td><code>INT</code> / <code>INTEGER</code></td><td>Whole number, 4 bytes (about ±2.1 billion).</td><td><code>roll_no INT</code></td></tr>
              <tr><td><code>SMALLINT</code> / <code>TINYINT</code></td><td>Smaller whole numbers — saves space.</td><td><code>age TINYINT</code></td></tr>
              <tr><td><code>DECIMAL(p, s)</code> / <code>NUMERIC</code></td><td><strong>Exact</strong> fixed-point number: <em>p</em> total digits, <em>s</em> after the point. <strong>Always use this for money.</strong></td><td><code>fees DECIMAL(9,2)</code></td></tr>
              <tr><td><code>FLOAT</code> / <code>REAL</code> / <code>DOUBLE</code></td><td><strong>Approximate</strong> floating-point. Fast but rounds — never use for currency.</td><td><code>temperature FLOAT</code></td></tr>
              <tr><td><code>BIGINT</code></td><td>Very large whole numbers, 8 bytes.</td><td><code>contact BIGINT</code></td></tr>
              <tr><td rowspan="3"><strong>Character</strong></td><td><code>CHAR(n)</code></td><td><strong>Fixed</strong> length; shorter values are padded with spaces. Use when the length never varies.</td><td><code>semester CHAR(8)</code></td></tr>
              <tr><td><code>VARCHAR(n)</code></td><td><strong>Variable</strong> length up to <em>n</em>; stores only what you put in. The everyday choice.</td><td><code>name VARCHAR(60)</code></td></tr>
              <tr><td><code>TEXT</code> / <code>CLOB</code></td><td>Very long text such as a description or an article.</td><td><code>remarks TEXT</code></td></tr>
              <tr><td rowspan="4"><strong>Date &amp; Time</strong></td><td><code>DATE</code></td><td>Calendar date: YYYY-MM-DD.</td><td><code>dob DATE</code></td></tr>
              <tr><td><code>TIME</code></td><td>Time of day: HH:MM:SS.</td><td><code>class_time TIME</code></td></tr>
              <tr><td><code>TIMESTAMP</code> / <code>DATETIME</code></td><td>Date and time together — the usual choice for "when did this happen".</td><td><code>created_at TIMESTAMP</code></td></tr>
              <tr><td><code>INTERVAL</code></td><td>A span of time (e.g. 3 days).</td><td><code>duration INTERVAL</code></td></tr>
              <tr><td rowspan="2"><strong>Other</strong></td><td><code>BOOLEAN</code></td><td>TRUE / FALSE / UNKNOWN.</td><td><code>is_active BOOLEAN</code></td></tr>
              <tr><td><code>BLOB</code> / <code>BINARY</code></td><td>Binary data such as an image or a PDF.</td><td><code>photo BLOB</code></td></tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ Two Type Choices That Cause Real Bugs</div>
          <ul>
            <li><strong>Never store money in FLOAT.</strong> <code>0.1 + 0.2</code> in floating point is not exactly <code>0.3</code>. Bank balances slowly drift. Use <code>DECIMAL(p,s)</code>, which stores the digits exactly.</li>
            <li><strong>Never store a phone number in an INT.</strong> Leading zeros are silently destroyed ("0148…" becomes "148…") and you can never do arithmetic on a phone number anyway. Use <code>VARCHAR</code>.</li>
          </ul>
        </div>

        <hr class="section-divider" />

        <h3>CREATE TABLE — Defining a Table</h3>
        <div class="code-block">
          <div class="code-header"><span>Syntax</span></div>
          <div class="code-content"><pre>CREATE TABLE table_name (
    column1  datatype  [constraints],
    column2  datatype  [constraints],
    ...
    [table-level constraints]
);</pre></div>
        </div>

        <div class="code-block">
          <div class="code-header">
            <span>The three tables used throughout this unit</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- The three tables are already loaded. Look at them:\\nSELECT * FROM student LIMIT 5;')">⚡ See the data</button>
          </div>
          <div class="code-content"><pre>CREATE TABLE student (
    sid      INTEGER PRIMARY KEY,
    name     VARCHAR(255) NOT NULL,
    address  VARCHAR(255),
    age      TINYINT,
    fees     DECIMAL(9,2) CHECK (fees >= 20000.00),
    contact  BIGINT UNIQUE,
    semester CHAR(8) DEFAULT '6th'
);

CREATE TABLE course (
    cid      INTEGER PRIMARY KEY,
    cname    VARCHAR(50) NOT NULL,
    duration TINYINT NOT NULL,
    sid      INTEGER,
    FOREIGN KEY (sid) REFERENCES student(sid)
);

CREATE TABLE teacher (
    tid    INTEGER PRIMARY KEY,
    tname  VARCHAR(40) NOT NULL,
    salary DECIMAL(8,2) NOT NULL,
    cid    INTEGER,
    FOREIGN KEY (cid) REFERENCES course(cid)
);</pre></div>
        </div>

        <h3>ALTER TABLE — Changing an Existing Table</h3>
        <p><code>ALTER</code> changes the <em>structure</em> without destroying the rows already stored.</p>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:30%">Operation</th><th>Statement</th></tr></thead>
            <tbody>
              <tr><td>Add a column</td><td><code>ALTER TABLE student ADD email VARCHAR(80);</code></td></tr>
              <tr><td>Remove a column</td><td><code>ALTER TABLE student DROP COLUMN email;</code></td></tr>
              <tr><td>Change a column's type</td><td><code>ALTER TABLE student MODIFY age SMALLINT;</code></td></tr>
              <tr><td>Rename a column</td><td><code>ALTER TABLE student RENAME COLUMN name TO full_name;</code></td></tr>
              <tr><td>Add a constraint</td><td><code>ALTER TABLE student ADD CONSTRAINT chk_age CHECK (age &gt;= 16);</code></td></tr>
              <tr><td>Remove a constraint</td><td><code>ALTER TABLE student DROP CONSTRAINT chk_age;</code></td></tr>
            </tbody>
          </table>
        </div>

        <h3>DROP vs TRUNCATE vs DELETE — The Classic Comparison</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>Basis</th><th><code>DROP TABLE</code></th><th><code>TRUNCATE TABLE</code></th><th><code>DELETE FROM</code></th></tr></thead>
            <tbody>
              <tr><td><strong>Language</strong></td><td>DDL</td><td>DDL</td><td><strong>DML</strong></td></tr>
              <tr><td><strong>Removes</strong></td><td>Rows <em>and</em> the table structure</td><td>All rows; structure stays</td><td>Selected rows (or all)</td></tr>
              <tr><td><strong>WHERE clause</strong></td><td>Not allowed</td><td>Not allowed</td><td><strong>Allowed</strong></td></tr>
              <tr><td><strong>Can be rolled back</strong></td><td>No (auto-commit)</td><td>No (auto-commit)</td><td><strong>Yes</strong>, before COMMIT</td></tr>
              <tr><td><strong>Speed</strong></td><td>Fast</td><td>Very fast (deallocates pages)</td><td>Slower (logs every row)</td></tr>
              <tr><td><strong>Fires triggers</strong></td><td>No</td><td>No</td><td><strong>Yes</strong></td></tr>
              <tr><td><strong>After running</strong></td><td>The table no longer exists</td><td>An empty table remains</td><td>The table remains with the surviving rows</td></tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 Memory Trick</div>
          <p><strong>DELETE</strong> = deleting sentences from a page — you choose which, and you can undo.<br>
          <strong>TRUNCATE</strong> = tearing the whole page out but keeping the notebook.<br>
          <strong>DROP</strong> = throwing the entire notebook in the fire.</p>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"Differentiate between DROP, TRUNCATE and DELETE."</em> — almost guaranteed. Reproduce the seven-row table (4–6 marks).</li>
            <li><em>"Explain SQL data types with examples."</em> — the four categories with two examples each (4–5 marks).</li>
            <li><em>"Write SQL statements to create the following tables with appropriate data types and constraints."</em> — a standard 5–8 mark numerical.</li>
          </ul>
        </div>
      </div>
      `
    },

    /* ================================================================== */
    {
      id: "u3-constraints",
      title: "3.2 Specifying Constraints in SQL",
      summary: "NOT NULL, UNIQUE, PRIMARY KEY, FOREIGN KEY, CHECK and DEFAULT — what each protects against, column-level vs table-level syntax, and the referential actions.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 6 (Sec. 6.1, 6.2) | Silberschatz Ch. 4</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p>A <strong>constraint</strong> is a rule you give the database once, and it enforces forever, for everybody.</p>
          <p>Without constraints you would have to write "check the age is not negative" inside every single program that touches the table — the website, the mobile app, the reporting tool, the import script. Miss one, and bad data gets in. With a constraint, the database itself refuses. There is no way around it.</p>
        </div>

        <div class="learn-box analogy-box">
          <div class="learn-title">🚪 Everyday Analogy</div>
          <p>A constraint is a <strong>security guard at the door</strong>, not a note pinned to the wall asking people to behave. The guard physically stops anything that breaks the rule, no matter which entrance it came through.</p>
        </div>

        <h3>The Six Constraints</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:16%">Constraint</th><th>What It Enforces</th><th style="width:24%">Stops You From…</th><th style="width:14%">NULLs?</th></tr></thead>
            <tbody>
              <tr><td><code>NOT NULL</code></td><td>The column must always have a value.</td><td>Saving a student with no name.</td><td>Not allowed</td></tr>
              <tr><td><code>UNIQUE</code></td><td>No two rows may share the same value.</td><td>Two students with the same phone number.</td><td>Allowed (usually one NULL)</td></tr>
              <tr><td><code>PRIMARY KEY</code></td><td>UNIQUE <strong>and</strong> NOT NULL together. One per table.</td><td>Two rows nobody can tell apart.</td><td>Never</td></tr>
              <tr><td><code>FOREIGN KEY</code></td><td>The value must exist in the referenced table's primary key.</td><td>A course belonging to a student who does not exist.</td><td>Allowed</td></tr>
              <tr><td><code>CHECK</code></td><td>A condition you write must be true for every row.</td><td>A negative salary, or an age of 300.</td><td>Passes if NULL</td></tr>
              <tr><td><code>DEFAULT</code></td><td>Supplies a value when the INSERT does not give one.</td><td>Blank semesters on every new record.</td><td>—</td></tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 The One Line That Explains PRIMARY KEY</div>
          <div class="formula-strip">PRIMARY KEY = UNIQUE + NOT NULL (and only one per table)</div>
          <p>That is the complete definition. Everything else follows: a table can have many UNIQUE columns but only one PRIMARY KEY, and UNIQUE permits a NULL while PRIMARY KEY never does.</p>
        </div>

        <h3>Column-Level vs Table-Level Syntax</h3>
        <div class="compare-grid">
          <div class="compare-card compare-good">
            <h4>Column level — written beside the column</h4>
            <p>Shorter, and the usual choice for single-column rules.</p>
            <div class="code-block"><div class="code-content"><pre>CREATE TABLE student (
  sid  INT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  age  INT CHECK (age >= 16)
);</pre></div></div>
          </div>
          <div class="compare-card compare-good">
            <h4>Table level — written after all columns</h4>
            <p><strong>Compulsory</strong> when the constraint spans more than one column, and lets you name the constraint.</p>
            <div class="code-block"><div class="code-content"><pre>CREATE TABLE enrolls (
  roll_no     INT,
  course_code CHAR(8),
  grade       CHAR(2),
  CONSTRAINT pk_enrolls
      PRIMARY KEY (roll_no, course_code)
);</pre></div></div>
          </div>
        </div>

        <div class="learn-box world-box">
          <div class="learn-title">🌍 Why Name Your Constraints</div>
          <p>Compare two error messages a user might see:</p>
          <ul>
            <li><code>ERROR: check constraint "sys_c0012893" violated</code> — useless.</li>
            <li><code>ERROR: check constraint "chk_fees_minimum" violated</code> — instantly tells the developer what went wrong.</li>
          </ul>
          <p>You also need the name in order to drop the constraint later: <code>ALTER TABLE student DROP CONSTRAINT chk_fees_minimum;</code></p>
        </div>

        <hr class="section-divider" />

        <h3>A Fully Constrained Table</h3>
        <div class="code-block">
          <div class="code-header">
            <span>Every constraint in one example</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- The student table has CHECK (fees >= 20000).\\n-- This INSERT must be rejected:\\nINSERT INTO student (sid, name, fees) VALUES (999, \\'Test Student\\', 100.00);')">⚡ Watch a CHECK reject an INSERT</button>
          </div>
          <div class="code-content"><pre>CREATE TABLE department (
    dept_id   CHAR(4)     PRIMARY KEY,
    dept_name VARCHAR(60) NOT NULL UNIQUE
);

CREATE TABLE employee (
    emp_id     INT          PRIMARY KEY,               -- unique + not null
    emp_name   VARCHAR(60)  NOT NULL,                  -- must be supplied
    email      VARCHAR(80)  UNIQUE,                    -- no duplicates
    age        INT          CHECK (age BETWEEN 18 AND 60),
    salary     DECIMAL(10,2) NOT NULL CHECK (salary > 0),
    join_date  DATE         DEFAULT CURRENT_DATE,      -- filled automatically
    dept_id    CHAR(4),

    CONSTRAINT fk_emp_dept                             -- named, table level
        FOREIGN KEY (dept_id) REFERENCES department(dept_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT chk_senior_salary                       -- multi-column CHECK
        CHECK (age < 50 OR salary >= 50000)
);</pre></div>
        </div>

        <h3>Referential Actions — ON DELETE / ON UPDATE</h3>
        <p>When you delete a department that still has employees, what should happen? You decide at design time.</p>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:22%">Action</th><th>Behaviour</th><th style="width:30%">Choose It When</th></tr></thead>
            <tbody>
              <tr><td><code>NO ACTION</code> / <code>RESTRICT</code></td><td>Reject the delete with an error. <strong>The default.</strong></td><td>You want the safest behaviour — nothing disappears by surprise.</td></tr>
              <tr><td><code>CASCADE</code></td><td>Delete the child rows too.</td><td>The child cannot exist without the parent (weak entities, order line items).</td></tr>
              <tr><td><code>SET NULL</code></td><td>Set the child's foreign key to NULL.</td><td>The link is optional — an employee can temporarily have no department.</td></tr>
              <tr><td><code>SET DEFAULT</code></td><td>Set the child's foreign key to its DEFAULT value.</td><td>There is a fallback row such as an "Unassigned" department.</td></tr>
            </tbody>
          </table>
        </div>

        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ Careful With CASCADE</div>
          <p><code>ON DELETE CASCADE</code> is powerful and genuinely dangerous. Deleting one department row can silently remove thousands of employee rows — and, if those tables cascade further, their children too. Use it only where the dependency is genuinely existential, and never as a way of avoiding a "cannot delete" error message.</p>
        </div>

        <h3>NULL and Constraints — The Trap</h3>
        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ A CHECK Constraint Does NOT Reject NULL</div>
          <p>A CHECK constraint rejects a row only when the condition evaluates to <strong>FALSE</strong>. With a NULL the condition evaluates to <strong>UNKNOWN</strong>, which is not FALSE — so the row is <em>accepted</em>.</p>
          <p><code>age INT CHECK (age &gt;= 18)</code> will happily accept a row with <code>age = NULL</code>. If age must always be present, you must write <code>age INT NOT NULL CHECK (age &gt;= 18)</code>.</p>
        </div>

        <div class="worked-example">
          <div class="we-title">✍️ Worked Example</div>
          <div class="we-question">Create a <code>library_member</code> table where: member_id identifies the row; name is compulsory; email must be unique; membership_type may only be 'Student', 'Staff' or 'Public'; fine_amount cannot be negative and starts at 0; join_date defaults to today; and each member belongs to a branch whose deletion must not be allowed while members remain.</div>
          <ol class="step-list">
            <li><strong>member_id identifies the row</strong> → <code>PRIMARY KEY</code> (which gives UNIQUE + NOT NULL automatically).</li>
            <li><strong>name is compulsory</strong> → <code>NOT NULL</code>.</li>
            <li><strong>email must be unique</strong> → <code>UNIQUE</code>. Not a primary key, because we already chose member_id — so this is an <em>alternate key</em>.</li>
            <li><strong>membership_type restricted to a list</strong> → <code>CHECK (membership_type IN ('Student','Staff','Public'))</code>.</li>
            <li><strong>fine cannot be negative, starts at 0</strong> → two rules working together: <code>DEFAULT 0</code> and <code>CHECK (fine_amount &gt;= 0)</code>.</li>
            <li><strong>join_date defaults to today</strong> → <code>DEFAULT CURRENT_DATE</code>.</li>
            <li><strong>branch deletion must be blocked</strong> → a <code>FOREIGN KEY</code> with <code>ON DELETE RESTRICT</code>.</li>
          </ol>
          <div class="code-block"><div class="code-content"><pre>CREATE TABLE library_member (
    member_id       INT PRIMARY KEY,
    name            VARCHAR(60) NOT NULL,
    email           VARCHAR(80) UNIQUE,
    membership_type VARCHAR(10) NOT NULL
        CHECK (membership_type IN ('Student', 'Staff', 'Public')),
    fine_amount     DECIMAL(8,2) DEFAULT 0 CHECK (fine_amount >= 0),
    join_date       DATE DEFAULT CURRENT_DATE,
    branch_id       INT,
    CONSTRAINT fk_member_branch
        FOREIGN KEY (branch_id) REFERENCES branch(branch_id)
        ON DELETE RESTRICT
);</pre></div></div>
          <div class="we-answer"><strong>Note:</strong> <code>membership_type</code> carries <em>two</em> constraints (NOT NULL and CHECK) because a CHECK alone would let a NULL through.</div>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"Explain the different integrity constraints in SQL with examples."</em> — all six, with the SQL for each (6–8 marks).</li>
            <li><em>"Differentiate between PRIMARY KEY and UNIQUE."</em> — PK is unique + not null, only one per table; UNIQUE permits a NULL and you may have many (3 marks).</li>
            <li><em>"What are referential actions? Explain with examples."</em> — the four actions table (4 marks).</li>
            <li><em>"Write the SQL to create the given tables with the stated constraints."</em> — a standard 6–10 mark numerical.</li>
          </ul>
        </div>
      </div>
      `
    },

    /* ================================================================== */
    {
      id: "u3-basic-retrieval",
      title: "3.3 Basic Retrieval Queries — SELECT",
      summary: "The SELECT-FROM-WHERE block, DISTINCT, all the WHERE operators, LIKE patterns, NULL handling, aliases, calculated columns and ORDER BY — with the clause execution order.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 6 (Sec. 6.3) | Silberschatz Ch. 3</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p>Every question you ask a database has the same three parts:</p>
          <ul>
            <li><strong>SELECT</strong> — <em>which columns</em> do you want to see?</li>
            <li><strong>FROM</strong> — <em>which table</em> are they in?</li>
            <li><strong>WHERE</strong> — <em>which rows</em> should be included?</li>
          </ul>
          <p>Master this one block and you can already answer most exam questions. Everything later in the unit is an addition to it.</p>
        </div>

        <div class="code-block">
          <div class="code-header"><span>The basic syntax</span></div>
          <div class="code-content"><pre>SELECT   [DISTINCT] column_list
FROM     table_name
[WHERE   condition]
[ORDER BY column [ASC | DESC]];</pre></div>
        </div>

        <h3>Your First Queries</h3>
        <div class="code-block">
          <div class="code-header">
            <span>Getting started</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('SELECT * FROM student;')">⚡ Run</button>
          </div>
          <div class="code-content"><pre>-- Every column, every row
SELECT * FROM student;

-- Only the columns you need (always preferable in real systems)
SELECT sid, name, age FROM student;

-- Only the rows you need
SELECT name, fees FROM student WHERE fees > 25000;</pre></div>
        </div>

        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ About <code>SELECT *</code></div>
          <p>It is perfect for exploring, and fine in an exam answer when the question says "display all details". In real applications, list the columns you actually need: <code>SELECT *</code> moves data you will never use across the network, and it quietly breaks your program the day someone adds a column.</p>
        </div>

        <h3>DISTINCT — Removing Duplicate Rows</h3>
        <div class="code-block">
          <div class="code-header">
            <span>DISTINCT</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- With duplicates:\\nSELECT age FROM student ORDER BY age;\\n\\n-- Duplicates removed:\\nSELECT DISTINCT age FROM student ORDER BY age;')">⚡ Compare both</button>
          </div>
          <div class="code-content"><pre>SELECT DISTINCT age FROM student;

-- DISTINCT applies to the WHOLE row, not one column:
SELECT DISTINCT age, semester FROM student;
-- returns each unique COMBINATION of age and semester</pre></div>
        </div>

        <hr class="section-divider" />

        <h3>WHERE — All the Operators</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:18%">Operator</th><th style="width:26%">Meaning</th><th>Example</th></tr></thead>
            <tbody>
              <tr><td><code>=</code> <code>&lt;&gt;</code> <code>!=</code></td><td>Equal / not equal</td><td><code>WHERE semester = '6th'</code></td></tr>
              <tr><td><code>&gt;</code> <code>&lt;</code> <code>&gt;=</code> <code>&lt;=</code></td><td>Comparison</td><td><code>WHERE fees &gt;= 25000</code></td></tr>
              <tr><td><code>BETWEEN … AND …</code></td><td>Within a range, <strong>inclusive</strong> of both ends</td><td><code>WHERE age BETWEEN 20 AND 22</code></td></tr>
              <tr><td><code>IN (…)</code></td><td>Matches any value in a list</td><td><code>WHERE age IN (20, 22, 24)</code></td></tr>
              <tr><td><code>NOT IN (…)</code></td><td>Matches none of the listed values</td><td><code>WHERE sid NOT IN (101, 102)</code></td></tr>
              <tr><td><code>LIKE</code></td><td>Pattern matching on text</td><td><code>WHERE name LIKE 'A%'</code></td></tr>
              <tr><td><code>IS NULL</code> / <code>IS NOT NULL</code></td><td>Tests for a missing value</td><td><code>WHERE address IS NULL</code></td></tr>
              <tr><td><code>AND</code> <code>OR</code> <code>NOT</code></td><td>Combine conditions</td><td><code>WHERE age &gt; 20 AND fees &lt; 30000</code></td></tr>
            </tbody>
          </table>
        </div>

        <h3>LIKE — Pattern Matching</h3>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:12%">Wildcard</th><th style="width:30%">Matches</th><th>Example and Meaning</th></tr></thead>
            <tbody>
              <tr><td><code>%</code></td><td><strong>Any number</strong> of characters (including none)</td><td><code>'A%'</code> → starts with A &nbsp;·&nbsp; <code>'%a'</code> → ends with a &nbsp;·&nbsp; <code>'%ar%'</code> → contains "ar"</td></tr>
              <tr><td><code>_</code></td><td><strong>Exactly one</strong> character</td><td><code>'_a%'</code> → second letter is "a" &nbsp;·&nbsp; <code>'___'</code> → exactly three characters long</td></tr>
            </tbody>
          </table>
        </div>

        <div class="code-block">
          <div class="code-header">
            <span>LIKE in practice</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- Students whose name starts with A\\nSELECT sid, name FROM student WHERE name LIKE \\'A%\\';\\n\\n-- Students living in Kathmandu\\nSELECT name, address FROM student WHERE address LIKE \\'%Kathmandu%\\';')">⚡ Run both</button>
          </div>
          <div class="code-content"><pre>SELECT name FROM student WHERE name LIKE 'A%';        -- Aarav, Anjali
SELECT name FROM student WHERE name LIKE '%Sharma';   -- ends with Sharma
SELECT name FROM student WHERE address LIKE '%Kathmandu%';
SELECT name FROM student WHERE name LIKE '_i%';       -- 2nd letter is i</pre></div>
        </div>

        <div class="learn-box memory-box">
          <div class="learn-title">🧠 Memory Trick for Wildcards</div>
          <p><strong>%</strong> is the <em>percent</em> sign — a percentage can be anything from 0 to 100, so it stands for <strong>any number</strong> of characters.<br>
          <strong>_</strong> is a single underscore — one blank on a form — so it stands for <strong>exactly one</strong> character.</p>
        </div>

        <hr class="section-divider" />

        <h3>Working With NULL</h3>
        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ The Single Most Common SQL Mistake in Exams</div>
          <div class="compare-grid">
            <div class="compare-card compare-bad">
              <h4>✘ Wrong</h4>
              <p><code>WHERE address = NULL</code></p>
              <p>Always returns <strong>zero rows</strong>. NULL means "unknown", and "is this unknown value equal to that unknown value?" is itself unknown — never true.</p>
            </div>
            <div class="compare-card compare-good">
              <h4>✔ Correct</h4>
              <p><code>WHERE address IS NULL</code></p>
              <p><code>IS NULL</code> and <code>IS NOT NULL</code> are the only correct way to test for a missing value.</p>
            </div>
          </div>
        </div>

        <div class="code-block">
          <div class="code-header">
            <span>NULL handling</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- Wrong: returns nothing\\nSELECT name FROM student WHERE address = NULL;\\n\\n-- Correct: finds the students with no address\\nSELECT sid, name FROM student WHERE address IS NULL;')">⚡ See the difference</button>
          </div>
          <div class="code-content"><pre>SELECT sid, name FROM student WHERE address IS NULL;
SELECT sid, name FROM student WHERE address IS NOT NULL;

-- Substitute a readable value for NULL:
SELECT name, COALESCE(address, 'Not provided') AS address
FROM student;</pre></div>
        </div>

        <h3>Three-Valued Logic</h3>
        <p>Because NULL exists, SQL conditions can be <strong>TRUE, FALSE or UNKNOWN</strong>. A row is returned only when the WHERE clause is TRUE — UNKNOWN behaves like FALSE for filtering, but not for <code>NOT</code>.</p>
        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th>Expression</th><th>Result</th><th>Why</th></tr></thead>
            <tbody>
              <tr><td><code>NULL = NULL</code></td><td>UNKNOWN</td><td>Two unknown values may or may not be the same.</td></tr>
              <tr><td><code>NULL &gt; 5</code></td><td>UNKNOWN</td><td>Cannot compare against something unknown.</td></tr>
              <tr><td><code>TRUE AND UNKNOWN</code></td><td>UNKNOWN</td><td>The result depends on the unknown part.</td></tr>
              <tr><td><code>FALSE AND UNKNOWN</code></td><td><strong>FALSE</strong></td><td>Already false, whatever the unknown turns out to be.</td></tr>
              <tr><td><code>TRUE OR UNKNOWN</code></td><td><strong>TRUE</strong></td><td>Already true, whatever the unknown turns out to be.</td></tr>
              <tr><td><code>NOT UNKNOWN</code></td><td>UNKNOWN</td><td>The opposite of "don't know" is still "don't know".</td></tr>
            </tbody>
          </table>
        </div>

        <hr class="section-divider" />

        <h3>Aliases and Calculated Columns</h3>
        <div class="code-block">
          <div class="code-header">
            <span>AS and arithmetic</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('SELECT\\n    name       AS student_name,\\n    fees       AS current_fees,\\n    fees * 0.10 AS discount,\\n    fees - (fees * 0.10) AS payable\\nFROM student\\nORDER BY payable DESC;')">⚡ Run</button>
          </div>
          <div class="code-content"><pre>SELECT
    name                 AS student_name,   -- column alias
    fees                 AS current_fees,
    fees * 0.10          AS discount,       -- calculated column
    fees - (fees * 0.10) AS payable
FROM student AS s                           -- table alias
WHERE s.fees > 25000
ORDER BY payable DESC;</pre></div>
        </div>
        <p>Use double quotes when an alias contains a space: <code>AS "Total Payable"</code>. Aliases are also what make joins readable, as you will see in topic 3.4.</p>

        <h3>ORDER BY — Sorting the Result</h3>
        <div class="code-block">
          <div class="code-header">
            <span>Sorting</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- Highest fees first, and within equal fees sort by name\\nSELECT name, age, fees FROM student\\nORDER BY fees DESC, name ASC;')">⚡ Run</button>
          </div>
          <div class="code-content"><pre>SELECT name, fees FROM student ORDER BY fees;        -- ASC is the default
SELECT name, fees FROM student ORDER BY fees DESC;   -- highest first
SELECT name, age, fees FROM student
ORDER BY age ASC, fees DESC;                         -- sort within a sort
SELECT name, fees FROM student ORDER BY 2 DESC;      -- by column position
SELECT name, fees FROM student ORDER BY fees DESC LIMIT 5;  -- top 5</pre></div>
        </div>
        <div class="learn-box world-box">
          <div class="learn-title">🌍 Rows Have No Natural Order</div>
          <p>A relation is a <em>set</em>, so the DBMS is free to return rows in any order it likes. If your answer depends on the order, you <strong>must</strong> write <code>ORDER BY</code>. Never assume rows come back in the order you inserted them.</p>
        </div>

        <hr class="section-divider" />

        <h3>The Order SQL Actually Executes Clauses</h3>
        <p>You <em>write</em> SELECT first, but the database <em>runs</em> it almost last. Knowing the real order explains several rules that otherwise look arbitrary.</p>

        <div class="svg-figure">
          <svg viewBox="0 0 860 210" role="img" aria-label="The logical execution order of SQL clauses">
            <defs>
              <marker id="u3arrow" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
                <path d="M0,0 L9,3.5 L0,7 Z" fill="#6366f1"/>
              </marker>
            </defs>
            <text x="430" y="22" text-anchor="middle" font-size="13" font-weight="700" class="svg-muted">How you WRITE it</text>
            <text x="60" y="52" font-size="13" font-family="monospace">SELECT</text>
            <text x="180" y="52" font-size="13" font-family="monospace">FROM</text>
            <text x="290" y="52" font-size="13" font-family="monospace">WHERE</text>
            <text x="410" y="52" font-size="13" font-family="monospace">GROUP BY</text>
            <text x="550" y="52" font-size="13" font-family="monospace">HAVING</text>
            <text x="680" y="52" font-size="13" font-family="monospace">ORDER BY</text>

            <text x="430" y="98" text-anchor="middle" font-size="13" font-weight="700" fill="#6366f1">How the DATABASE RUNS it</text>

            <rect x="20" y="115" width="118" height="42" rx="8" fill="rgba(99,102,241,0.18)" stroke="#6366f1"/>
            <text x="79" y="134" text-anchor="middle" font-size="12" font-weight="700">1. FROM</text>
            <text x="79" y="150" text-anchor="middle" font-size="10" class="svg-muted">get the tables</text>

            <line x1="138" y1="136" x2="158" y2="136" stroke="#6366f1" stroke-width="2" marker-end="url(#u3arrow)"/>
            <rect x="160" y="115" width="118" height="42" rx="8" fill="rgba(6,182,212,0.18)" stroke="#06b6d4"/>
            <text x="219" y="134" text-anchor="middle" font-size="12" font-weight="700">2. WHERE</text>
            <text x="219" y="150" text-anchor="middle" font-size="10" class="svg-muted">filter rows</text>

            <line x1="278" y1="136" x2="298" y2="136" stroke="#6366f1" stroke-width="2" marker-end="url(#u3arrow)"/>
            <rect x="300" y="115" width="118" height="42" rx="8" fill="rgba(16,185,129,0.18)" stroke="#10b981"/>
            <text x="359" y="134" text-anchor="middle" font-size="12" font-weight="700">3. GROUP BY</text>
            <text x="359" y="150" text-anchor="middle" font-size="10" class="svg-muted">form groups</text>

            <line x1="418" y1="136" x2="438" y2="136" stroke="#6366f1" stroke-width="2" marker-end="url(#u3arrow)"/>
            <rect x="440" y="115" width="118" height="42" rx="8" fill="rgba(245,158,11,0.18)" stroke="#f59e0b"/>
            <text x="499" y="134" text-anchor="middle" font-size="12" font-weight="700">4. HAVING</text>
            <text x="499" y="150" text-anchor="middle" font-size="10" class="svg-muted">filter groups</text>

            <line x1="558" y1="136" x2="578" y2="136" stroke="#6366f1" stroke-width="2" marker-end="url(#u3arrow)"/>
            <rect x="580" y="115" width="118" height="42" rx="8" fill="rgba(139,92,246,0.18)" stroke="#8b5cf6"/>
            <text x="639" y="134" text-anchor="middle" font-size="12" font-weight="700">5. SELECT</text>
            <text x="639" y="150" text-anchor="middle" font-size="10" class="svg-muted">pick columns</text>

            <line x1="698" y1="136" x2="718" y2="136" stroke="#6366f1" stroke-width="2" marker-end="url(#u3arrow)"/>
            <rect x="720" y="115" width="118" height="42" rx="8" fill="rgba(244,63,94,0.18)" stroke="#f43f5e"/>
            <text x="779" y="134" text-anchor="middle" font-size="12" font-weight="700">6. ORDER BY</text>
            <text x="779" y="150" text-anchor="middle" font-size="10" class="svg-muted">sort the result</text>

            <text x="430" y="188" text-anchor="middle" font-size="12" class="svg-muted">This is why WHERE cannot use a column alias (SELECT has not run yet),</text>
            <text x="430" y="204" text-anchor="middle" font-size="12" class="svg-muted">but ORDER BY can (it runs after SELECT).</text>
          </svg>
          <div class="figure-caption">Figure 3.1 — The logical execution order. Memorise it as <strong>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY</strong>.</div>
        </div>

        <div class="worked-example">
          <div class="we-title">✍️ Worked Example</div>
          <div class="we-question">Write a query to list the name, age and fees of students aged between 20 and 22 whose name contains the letter "a", who have an address recorded, showing a 5% discounted fee, sorted by the discounted fee from highest to lowest.</div>
          <ol class="step-list">
            <li><strong>FROM</strong> — only one table is involved: <code>FROM student</code>.</li>
            <li><strong>WHERE, condition 1</strong> — "between 20 and 22" maps directly to <code>age BETWEEN 20 AND 22</code> (inclusive at both ends).</li>
            <li><strong>Condition 2</strong> — "contains the letter a" → <code>name LIKE '%a%'</code>. The % on both sides means "anything, then a, then anything".</li>
            <li><strong>Condition 3</strong> — "has an address recorded" → <code>address IS NOT NULL</code>. Never write <code>address != NULL</code>.</li>
            <li><strong>SELECT</strong> — the calculated column: <code>fees - (fees * 0.05) AS discounted_fee</code>, or equivalently <code>fees * 0.95</code>.</li>
            <li><strong>ORDER BY</strong> — highest first → <code>ORDER BY discounted_fee DESC</code>. This is legal because ORDER BY runs <em>after</em> SELECT, so the alias already exists.</li>
          </ol>
          <div class="code-block">
            <div class="code-header">
              <span>Answer</span>
              <button class="run-in-playground-badge" onclick="app.loadCustomQuery('SELECT\\n    name,\\n    age,\\n    fees,\\n    fees - (fees * 0.05) AS discounted_fee\\nFROM student\\nWHERE age BETWEEN 20 AND 22\\n  AND name LIKE \\'%a%\\'\\n  AND address IS NOT NULL\\nORDER BY discounted_fee DESC;')">⚡ Run it</button>
            </div>
            <div class="code-content"><pre>SELECT
    name,
    age,
    fees,
    fees - (fees * 0.05) AS discounted_fee
FROM student
WHERE age BETWEEN 20 AND 22
  AND name LIKE '%a%'
  AND address IS NOT NULL
ORDER BY discounted_fee DESC;</pre></div>
          </div>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li>Most SQL questions are <em>"write a query to…"</em> numericals worth 2–4 marks each, usually five or six of them. Practise writing them by hand.</li>
            <li><em>"Explain the SELECT statement with all its clauses."</em> — the syntax block + one example per clause (5–6 marks).</li>
            <li><em>"What is the difference between WHERE and HAVING?"</em> — see topic 3.5; the execution-order diagram is the clean explanation.</li>
            <li><em>"How is NULL handled in SQL?"</em> — IS NULL vs = NULL, plus three-valued logic (4 marks).</li>
          </ul>
        </div>
      </div>
      `
    },

    /* ================================================================== */
    {
      id: "u3-joins",
      title: "3.4 Complex Retrieval Queries — JOINs",
      summary: "Combining tables: the Cartesian product, inner join, left/right/full outer joins, self joins and natural joins — each with a diagram and a runnable example.",
      content: `
      <div class="content-block">
        <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 6 (Sec. 6.4) | Silberschatz Ch. 4</span>

        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p>Because a good design splits data across several tables, most real questions need data from more than one of them. A <strong>JOIN</strong> glues rows from two tables together using a column they share.</p>
          <p>The <code>student</code> table knows each student's name. The <code>course</code> table knows which courses exist and holds a <code>sid</code> saying which student took it. To print "Aarav Sharma — Database Management Systems", you must join them on <code>sid</code>.</p>
        </div>

        <div class="learn-box analogy-box">
          <div class="learn-title">🧾 Everyday Analogy</div>
          <p>Imagine two lists. One has <em>roll number → name</em>. The other has <em>roll number → marks</em>. To produce a report of <em>name → marks</em>, you line the two lists up by roll number and read across.</p>
          <p>That "line them up by the shared column" step is a JOIN. The shared column is called the <strong>join key</strong>.</p>
        </div>

        <h3>The Join Family at a Glance</h3>
        <div class="svg-figure">
          <svg viewBox="0 0 880 250" role="img" aria-label="Venn diagrams of inner, left, right and full outer joins">
            <!-- INNER -->
            <text x="110" y="24" text-anchor="middle" font-size="14" font-weight="700" fill="#10b981">INNER JOIN</text>
            <circle cx="82" cy="110" r="52" fill="none" stroke="#6366f1" stroke-width="2"/>
            <circle cx="138" cy="110" r="52" fill="none" stroke="#06b6d4" stroke-width="2"/>
            <path d="M 110 66 A 52 52 0 0 1 110 154 A 52 52 0 0 1 110 66 Z" fill="rgba(16,185,129,0.45)"/>
            <text x="62" y="115" text-anchor="middle" font-size="12" font-weight="700">A</text>
            <text x="158" y="115" text-anchor="middle" font-size="12" font-weight="700">B</text>
            <text x="110" y="192" text-anchor="middle" font-size="11" class="svg-muted">only rows that match</text>
            <text x="110" y="208" text-anchor="middle" font-size="11" class="svg-muted">in BOTH tables</text>

            <!-- LEFT -->
            <text x="330" y="24" text-anchor="middle" font-size="14" font-weight="700" fill="#6366f1">LEFT OUTER JOIN</text>
            <circle cx="302" cy="110" r="52" fill="rgba(99,102,241,0.40)" stroke="#6366f1" stroke-width="2"/>
            <circle cx="358" cy="110" r="52" fill="none" stroke="#06b6d4" stroke-width="2"/>
            <text x="282" y="115" text-anchor="middle" font-size="12" font-weight="700">A</text>
            <text x="378" y="115" text-anchor="middle" font-size="12" font-weight="700">B</text>
            <text x="330" y="192" text-anchor="middle" font-size="11" class="svg-muted">ALL of A, plus matches</text>
            <text x="330" y="208" text-anchor="middle" font-size="11" class="svg-muted">from B (NULL if none)</text>

            <!-- RIGHT -->
            <text x="550" y="24" text-anchor="middle" font-size="14" font-weight="700" fill="#06b6d4">RIGHT OUTER JOIN</text>
            <circle cx="522" cy="110" r="52" fill="none" stroke="#6366f1" stroke-width="2"/>
            <circle cx="578" cy="110" r="52" fill="rgba(6,182,212,0.40)" stroke="#06b6d4" stroke-width="2"/>
            <text x="502" y="115" text-anchor="middle" font-size="12" font-weight="700">A</text>
            <text x="598" y="115" text-anchor="middle" font-size="12" font-weight="700">B</text>
            <text x="550" y="192" text-anchor="middle" font-size="11" class="svg-muted">ALL of B, plus matches</text>
            <text x="550" y="208" text-anchor="middle" font-size="11" class="svg-muted">from A (NULL if none)</text>

            <!-- FULL -->
            <text x="770" y="24" text-anchor="middle" font-size="14" font-weight="700" fill="#8b5cf6">FULL OUTER JOIN</text>
            <circle cx="742" cy="110" r="52" fill="rgba(139,92,246,0.40)" stroke="#8b5cf6" stroke-width="2"/>
            <circle cx="798" cy="110" r="52" fill="rgba(139,92,246,0.40)" stroke="#8b5cf6" stroke-width="2"/>
            <text x="722" y="115" text-anchor="middle" font-size="12" font-weight="700">A</text>
            <text x="818" y="115" text-anchor="middle" font-size="12" font-weight="700">B</text>
            <text x="770" y="192" text-anchor="middle" font-size="11" class="svg-muted">everything from both,</text>
            <text x="770" y="208" text-anchor="middle" font-size="11" class="svg-muted">matched where possible</text>
          </svg>
          <div class="figure-caption">Figure 3.2 — The four main joins. The shaded area is what ends up in the result. Draw these circles in the exam; they earn marks on their own.</div>
        </div>

        <div class="table-responsive">
          <table class="syllabus-table">
            <thead><tr><th style="width:20%">Join</th><th>Returns</th><th style="width:30%">Use It When</th></tr></thead>
            <tbody>
              <tr><td><strong>CROSS JOIN</strong><br>(Cartesian product)</td><td><em>Every</em> row of A paired with <em>every</em> row of B. 15 × 15 = 225 rows.</td><td>Almost never on purpose — usually a bug caused by forgetting the join condition.</td></tr>
              <tr><td><strong>INNER JOIN</strong></td><td>Only rows where the join condition is true in both tables.</td><td>The default choice: "show me students <em>and</em> their courses".</td></tr>
              <tr><td><strong>LEFT OUTER JOIN</strong></td><td>All rows of the left table; unmatched right-side columns become NULL.</td><td>"Show me <em>every</em> student, even the ones with no course."</td></tr>
              <tr><td><strong>RIGHT OUTER JOIN</strong></td><td>All rows of the right table; unmatched left-side columns become NULL.</td><td>"Show me <em>every</em> course, even those with no student."</td></tr>
              <tr><td><strong>FULL OUTER JOIN</strong></td><td>All rows of both tables, matched where possible.</td><td>Reconciling two lists to find what is missing from each.</td></tr>
              <tr><td><strong>SELF JOIN</strong></td><td>A table joined to itself using two aliases.</td><td>Recursive relationships: "who is each employee's manager?"</td></tr>
              <tr><td><strong>NATURAL JOIN</strong></td><td>An inner join that automatically matches <em>all</em> columns with the same name.</td><td>Convenient but risky — see the warning below.</td></tr>
            </tbody>
          </table>
        </div>

        <hr class="section-divider" />

        <h3>1. INNER JOIN — The Workhorse</h3>
        <div class="code-block">
          <div class="code-header">
            <span>Students and the courses they take</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('SELECT s.sid, s.name, c.cname, c.duration\\nFROM student s\\nINNER JOIN course c ON s.sid = c.sid\\nORDER BY s.sid;')">⚡ Run</button>
          </div>
          <div class="code-content"><pre>SELECT s.sid, s.name, c.cname, c.duration
FROM   student s
INNER JOIN course c ON s.sid = c.sid
ORDER BY s.sid;

-- The older comma syntax does exactly the same thing:
SELECT s.sid, s.name, c.cname
FROM   student s, course c
WHERE  s.sid = c.sid;</pre></div>
        </div>
        <p>Both forms are correct in an exam. The <code>JOIN … ON</code> form is preferred because the join condition is kept separate from the filtering conditions, which makes long queries far easier to read.</p>

        <h3>2. LEFT OUTER JOIN — Keeping the Unmatched Rows</h3>
        <div class="code-block">
          <div class="code-header">
            <span>Every student, even those with no course</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('SELECT s.sid, s.name, c.cname\\nFROM student s\\nLEFT JOIN course c ON s.sid = c.sid\\nORDER BY s.sid;\\n\\n-- Notice the NULLs: those students have no course row.')">⚡ Run and look for the NULLs</button>
          </div>
          <div class="code-content"><pre>SELECT s.sid, s.name, c.cname
FROM   student s
LEFT JOIN course c ON s.sid = c.sid
ORDER BY s.sid;

-- A very common pattern: find rows that have NO match at all
SELECT s.sid, s.name
FROM   student s
LEFT JOIN course c ON s.sid = c.sid
WHERE  c.cid IS NULL;          -- students taking no course</pre></div>
        </div>
        <div class="learn-box memory-box">
          <div class="learn-title">🧠 The "Anti-Join" Pattern Worth Memorising</div>
          <p><strong>LEFT JOIN + WHERE right_column IS NULL</strong> = "find the rows in the left table that have <em>no</em> match in the right table."</p>
          <p>Students with no course, customers who never ordered, courses with no teacher — all the same pattern, and it appears in exams regularly.</p>
        </div>

        <h3>3. RIGHT OUTER JOIN</h3>
        <div class="code-block">
          <div class="code-header">
            <span>Every course, even unassigned ones</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- SQLite has no RIGHT JOIN, so swap the tables\\n-- and use a LEFT JOIN - the result is identical:\\nSELECT c.cid, c.cname, s.name AS student_name\\nFROM course c\\nLEFT JOIN student s ON s.sid = c.sid\\nORDER BY c.cid;')">⚡ Run the equivalent</button>
          </div>
          <div class="code-content"><pre>SELECT s.name, c.cname
FROM   student s
RIGHT JOIN course c ON s.sid = c.sid;

-- Identical result, written as a LEFT JOIN with the tables swapped:
SELECT s.name, c.cname
FROM   course c
LEFT JOIN student s ON s.sid = c.sid;</pre></div>
        </div>
        <p><strong>Exam-worthy fact:</strong> every RIGHT JOIN can be rewritten as a LEFT JOIN by swapping the tables. Some DBMSs (including SQLite, which powers the playground on this site) support only LEFT JOIN for exactly that reason.</p>

        <h3>4. FULL OUTER JOIN</h3>
        <div class="code-block">
          <div class="code-header"><span>Everything from both sides</span></div>
          <div class="code-content"><pre>SELECT s.name, c.cname
FROM   student s
FULL OUTER JOIN course c ON s.sid = c.sid;

-- Where FULL OUTER JOIN is unsupported, simulate it:
SELECT s.name, c.cname FROM student s LEFT JOIN course c ON s.sid = c.sid
UNION
SELECT s.name, c.cname FROM course c LEFT JOIN student s ON s.sid = c.sid;</pre></div>
        </div>

        <h3>5. SELF JOIN — A Table Joined to Itself</h3>
        <div class="learn-box simple-box">
          <div class="learn-title">💡 In Simple Words</div>
          <p>A self join is how you query a <strong>recursive relationship</strong> (topic 2.3). If the <code>employee</code> table has a <code>manager_id</code> pointing at another row of the same table, you join <code>employee</code> to <code>employee</code> — using two different aliases so SQL can tell which copy you mean.</p>
        </div>
        <div class="code-block">
          <div class="code-header">
            <span>Self join</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- Pairs of students of the same age (each pair listed once)\\nSELECT a.name AS student_1, b.name AS student_2, a.age\\nFROM student a\\nJOIN student b ON a.age = b.age AND a.sid < b.sid\\nORDER BY a.age;')">⚡ Run a self join</button>
          </div>
          <div class="code-content"><pre>-- Each employee next to their manager
SELECT e.emp_name AS employee, m.emp_name AS manager
FROM   employee e
LEFT JOIN employee m ON e.manager_id = m.emp_id;

-- Pairs of students who are the same age
SELECT a.name AS student_1, b.name AS student_2, a.age
FROM   student a
JOIN   student b ON a.age = b.age
                AND a.sid < b.sid;   -- stops duplicate/self pairs</pre></div>
        </div>
        <p>The condition <code>a.sid &lt; b.sid</code> is the trick that prevents a student being paired with themselves and stops each pair appearing twice in reverse.</p>

        <h3>6. NATURAL JOIN</h3>
        <div class="code-block">
          <div class="code-header"><span>NATURAL JOIN</span></div>
          <div class="code-content"><pre>SELECT * FROM student NATURAL JOIN course;
-- automatically joins on sid, because both tables have a column called sid</pre></div>
        </div>
        <div class="learn-box mistake-box">
          <div class="learn-title">⚠️ Why Professionals Avoid NATURAL JOIN</div>
          <p>It matches on <strong>every</strong> identically-named column, whether you meant it to or not. Add an innocent <code>created_at</code> column to both tables next year and the join silently starts matching on that too — returning far fewer rows, with no error. Write the join condition explicitly with <code>ON</code>.</p>
        </div>

        <hr class="section-divider" />

        <h3>Joining Three Tables</h3>
        <div class="code-block">
          <div class="code-header">
            <span>Student → Course → Teacher</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('SELECT s.name AS student, c.cname AS course, t.tname AS teacher, t.salary\\nFROM student s\\nJOIN course  c ON s.sid = c.sid\\nJOIN teacher t ON t.cid = c.cid\\nORDER BY s.name;')">⚡ Run the 3-table join</button>
          </div>
          <div class="code-content"><pre>SELECT s.name  AS student,
       c.cname AS course,
       t.tname AS teacher
FROM   student s
JOIN   course  c ON s.sid = c.sid
JOIN   teacher t ON t.cid = c.cid
ORDER BY s.name;</pre></div>
        </div>
        <p>Joining <em>n</em> tables needs <em>n − 1</em> join conditions. Three tables → two <code>ON</code> clauses. If you forget one, you get an accidental Cartesian product and a wildly inflated row count — which is the standard way to spot the mistake.</p>

        <div class="worked-example">
          <div class="we-title">✍️ Worked Example</div>
          <div class="we-question">List the name of every student together with the name of their course and the teacher who teaches it. Include students who are not enrolled in any course, and show "Not enrolled" instead of NULL.</div>
          <ol class="step-list">
            <li><strong>Which tables?</strong> Student names are in <code>student</code>, course names in <code>course</code>, teacher names in <code>teacher</code> — all three.</li>
            <li><strong>"Include students who are not enrolled"</strong> is the decisive phrase. An INNER JOIN would drop them, so the student table must be preserved → <strong>LEFT JOIN</strong>.</li>
            <li><strong>Start from the table you must keep whole:</strong> <code>FROM student s</code>, then <code>LEFT JOIN course c ON s.sid = c.sid</code>.</li>
            <li><strong>Chain the third table:</strong> <code>LEFT JOIN teacher t ON t.cid = c.cid</code>. It must also be a LEFT JOIN — an inner join here would throw the unmatched students away again at the second step.</li>
            <li><strong>Replace the NULLs</strong> with <code>COALESCE(c.cname, 'Not enrolled')</code>.</li>
            <li><strong>Sort</strong> with <code>ORDER BY s.name</code>.</li>
          </ol>
          <div class="code-block">
            <div class="code-header">
              <span>Answer</span>
              <button class="run-in-playground-badge" onclick="app.loadCustomQuery('SELECT\\n    s.name AS student,\\n    COALESCE(c.cname, \\'Not enrolled\\') AS course,\\n    COALESCE(t.tname, \\'No teacher assigned\\') AS teacher\\nFROM student s\\nLEFT JOIN course  c ON s.sid = c.sid\\nLEFT JOIN teacher t ON t.cid = c.cid\\nORDER BY s.name;')">⚡ Run it</button>
            </div>
            <div class="code-content"><pre>SELECT
    s.name AS student,
    COALESCE(c.cname, 'Not enrolled')       AS course,
    COALESCE(t.tname, 'No teacher assigned') AS teacher
FROM   student s
LEFT JOIN course  c ON s.sid = c.sid
LEFT JOIN teacher t ON t.cid = c.cid
ORDER BY s.name;</pre></div>
          </div>
          <div class="we-answer"><strong>Key insight:</strong> once you use a LEFT JOIN, every join further down the chain must also be a LEFT JOIN, otherwise the rows you worked to preserve are discarded at the next step.</div>
        </div>

        <div class="learn-box exam-box">
          <div class="learn-title">🎯 How This Is Asked in the Exam</div>
          <ul>
            <li><em>"Explain the different types of joins with examples."</em> — draw the four Venn diagrams and give one query each (6–8 marks).</li>
            <li><em>"Differentiate between INNER JOIN and OUTER JOIN."</em> — inner keeps only matches; outer keeps unmatched rows and fills with NULL (3–4 marks).</li>
            <li><em>"What is a self join? Give an example."</em> — the employee/manager query with two aliases (4 marks).</li>
            <li>Query numericals: watch for the words "<em>all</em> students", "<em>including</em> those without", "<em>even if</em>" — every one of them signals an OUTER join.</li>
          </ul>
        </div>
      </div>
      `
    }
  ]
});
