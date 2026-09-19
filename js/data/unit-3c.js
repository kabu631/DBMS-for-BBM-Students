/**
 * Unit 3 — Part 3 (final): topics 3.7 – 3.9, plus the unit intro,
 * exam corner, self-test quiz and glossary terms.
 */

appendTopics("unit-3", [

  /* ==================================================================== */
  {
    id: "u3-insert-update-delete",
    title: "3.7 INSERT, UPDATE & DELETE Statements",
    summary: "Adding, changing and removing rows — every INSERT form, UPDATE with expressions and subqueries, DELETE vs TRUNCATE, and the constraint violations each can trigger.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 6 (Sec. 6.5) | Silberschatz Ch. 3</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p><code>SELECT</code> only <em>reads</em>. These three statements <em>change</em> the data:</p>
        <ul>
          <li><strong>INSERT</strong> — put a new row in.</li>
          <li><strong>UPDATE</strong> — change values in rows that already exist.</li>
          <li><strong>DELETE</strong> — take rows out.</li>
        </ul>
        <p>Together with SELECT they are often called <strong>CRUD</strong> — Create, Read, Update, Delete — the four things any data-driven application ever does.</p>
      </div>

      <h3>INSERT — Adding Rows</h3>
      <div class="code-block">
        <div class="code-header">
          <span>All four INSERT forms</span>
          <button class="run-in-playground-badge" onclick="app.loadCustomQuery('INSERT INTO student (sid, name, address, age, fees, contact, semester)\\nVALUES (201, \\'Nisha Basnet\\', \\'Kathmandu, Balaju\\', 21, 26000.00, 9851111222, \\'6th\\');\\n\\nSELECT * FROM student WHERE sid = 201;')">⚡ Insert a row and see it</button>
        </div>
        <div class="code-content"><pre>-- 1. Named columns (always prefer this: safe if columns are added later)
INSERT INTO student (sid, name, address, age, fees, contact, semester)
VALUES (201, 'Nisha Basnet', 'Kathmandu, Balaju', 21, 26000.00, 9851111222, '6th');

-- 2. All columns, in table order (fragile — avoid in real code)
INSERT INTO student
VALUES (202, 'Kiran Bhatta', 'Pokhara', 22, 27000.00, 9851111223, '6th');

-- 3. Partial columns: the rest take their DEFAULT, or NULL
INSERT INTO student (sid, name, fees)
VALUES (203, 'Anil Rana', 24000.00);   -- semester becomes its DEFAULT '6th'

-- 4. Several rows in one statement
INSERT INTO student (sid, name, fees) VALUES
    (204, 'Maya Lama',   25500.00),
    (205, 'Prakash Oli', 23500.00);

-- 5. INSERT from a SELECT (copying rows between tables)
INSERT INTO student_archive (sid, name, fees)
SELECT sid, name, fees FROM student WHERE semester = '6th';</pre></div>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ Four Reasons an INSERT Gets Rejected</div>
        <ol>
          <li><strong>Primary key already exists</strong> — inserting <code>sid = 101</code> a second time.</li>
          <li><strong>NOT NULL column left out</strong> — no <code>name</code> supplied.</li>
          <li><strong>CHECK constraint fails</strong> — <code>fees = 100</code> when the rule is <code>fees &gt;= 20000</code>.</li>
          <li><strong>Foreign key has no parent</strong> — inserting a course with <code>sid = 999</code> when no such student exists.</li>
        </ol>
        <p>Exam questions often ask "will this statement succeed?" Work down that list.</p>
      </div>

      <hr class="section-divider" />

      <h3>UPDATE — Changing Existing Rows</h3>
      <div class="code-block">
        <div class="code-header">
          <span>Syntax</span>
        </div>
        <div class="code-content"><pre>UPDATE table_name
SET    column1 = value1,
       column2 = value2
WHERE  condition;        -- omit this and EVERY row is changed</pre></div>
      </div>

      <div class="code-block">
        <div class="code-header">
          <span>UPDATE in practice</span>
          <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- Give a 10% fee increase to students older than 21\\nUPDATE student\\nSET fees = fees * 1.10\\nWHERE age > 21;\\n\\nSELECT sid, name, age, fees FROM student WHERE age > 21;')">⚡ Run an UPDATE</button>
        </div>
        <div class="code-content"><pre>-- One row, one column
UPDATE student SET address = 'Lalitpur, Jawalakhel' WHERE sid = 103;

-- Several columns at once
UPDATE student SET fees = 31000, semester = '7th' WHERE sid = 104;

-- Using the current value in the new value (a 10% rise)
UPDATE student SET fees = fees * 1.10 WHERE age > 21;

-- Conditional update with CASE
UPDATE student
SET    fees = CASE
                WHEN fees < 25000 THEN fees * 1.05
                WHEN fees < 30000 THEN fees * 1.03
                ELSE fees
              END;

-- Using a subquery to decide the new value
UPDATE student
SET    fees = (SELECT AVG(fees) FROM student)
WHERE  fees IS NULL;</pre></div>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ The Most Expensive Mistake in SQL</div>
        <div class="compare-grid">
          <div class="compare-card compare-bad">
            <h4>✘ Disaster</h4>
            <p><code>UPDATE student SET fees = 30000;</code></p>
            <p>No WHERE clause → <strong>every student in the database</strong> now pays 30000. There is no undo once it is committed.</p>
          </div>
          <div class="compare-card compare-good">
            <h4>✔ The habit that saves you</h4>
            <p>Write the <code>SELECT</code> first:<br><code>SELECT * FROM student WHERE sid = 103;</code></p>
            <p>Check it returns exactly the rows you intend, <em>then</em> change <code>SELECT *</code> into <code>UPDATE … SET …</code>.</p>
          </div>
        </div>
      </div>

      <hr class="section-divider" />

      <h3>DELETE — Removing Rows</h3>
      <div class="code-block">
        <div class="code-header">
          <span>DELETE</span>
          <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- How many rows before?\\nSELECT COUNT(*) AS before_delete FROM student;\\n\\n-- Delete students paying under 21000\\nDELETE FROM student WHERE fees < 21000;\\n\\nSELECT COUNT(*) AS after_delete FROM student;')">⚡ Run a DELETE</button>
        </div>
        <div class="code-content"><pre>DELETE FROM student WHERE sid = 205;              -- one row
DELETE FROM student WHERE fees < 21000;           -- several rows
DELETE FROM student
WHERE sid NOT IN (SELECT sid FROM course WHERE sid IS NOT NULL);

DELETE FROM student;                              -- ALL rows (structure stays)</pre></div>
      </div>

      <div class="learn-box world-box">
        <div class="learn-title">🌍 Why a DELETE Can Fail</div>
        <p>If another table's foreign key still points at the row you are deleting, referential integrity blocks it. What happens then depends on the referential action you declared (topic 3.2): <code>RESTRICT</code> refuses, <code>CASCADE</code> deletes the children too, <code>SET NULL</code> orphans them safely.</p>
        <p>In production, many systems avoid physical deletes altogether and use a <em>soft delete</em> — an <code>is_deleted</code> flag — so that data can be recovered and history is preserved.</p>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Worked Example</div>
        <div class="we-question">The college decides: (a) add a new student Ramesh Shahi (sid 210, Kathmandu, age 20, fees 25000); (b) give every student from Kathmandu a 5% fee discount; (c) remove every student who is not enrolled in any course and pays less than 22000.</div>
        <ol class="step-list">
          <li><strong>(a) INSERT with named columns.</strong> Check the constraints first: <code>fees = 25000</code> satisfies <code>CHECK (fees &gt;= 20000)</code>, <code>name</code> is supplied for the NOT NULL rule, and sid 210 is unused.</li>
          <li><strong>(b) A percentage discount means the new value depends on the old one:</strong> <code>SET fees = fees * 0.95</code>.</li>
          <li><strong>Identify "from Kathmandu"</strong> — the address is a free-text field, so pattern match: <code>WHERE address LIKE '%Kathmandu%'</code>.</li>
          <li><strong>(c) "Not enrolled in any course"</strong> — an existence test → <code>NOT EXISTS (SELECT 1 FROM course c WHERE c.sid = s.sid)</code>. Safer than <code>NOT IN</code> because <code>course.sid</code> contains NULLs.</li>
          <li><strong>Combine both DELETE conditions with AND</strong> — the row must satisfy <em>both</em> to be removed.</li>
          <li><strong>Before running the DELETE,</strong> run it as a SELECT to confirm which rows will disappear.</li>
        </ol>
        <div class="code-block">
          <div class="code-header">
            <span>Answer</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- (a)\\nINSERT INTO student (sid, name, address, age, fees)\\nVALUES (210, \\'Ramesh Shahi\\', \\'Kathmandu, Kalanki\\', 20, 25000.00);\\n\\n-- (b)\\nUPDATE student SET fees = fees * 0.95 WHERE address LIKE \\'%Kathmandu%\\';\\n\\n-- (c) check first!\\nSELECT sid, name, fees FROM student s\\nWHERE NOT EXISTS (SELECT 1 FROM course c WHERE c.sid = s.sid)\\n  AND fees < 22000;')">⚡ Run the sequence</button>
          </div>
          <div class="code-content"><pre>-- (a) Add the new student
INSERT INTO student (sid, name, address, age, fees)
VALUES (210, 'Ramesh Shahi', 'Kathmandu, Kalanki', 20, 25000.00);

-- (b) 5% discount for Kathmandu students
UPDATE student
SET    fees = fees * 0.95
WHERE  address LIKE '%Kathmandu%';

-- (c) Remove unenrolled students paying under 22000
DELETE FROM student s
WHERE  NOT EXISTS (SELECT 1 FROM course c WHERE c.sid = s.sid)
  AND  s.fees < 22000;</pre></div>
        </div>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li>Numericals: "insert the following records", "update the salary of…", "delete all employees who…" — 2–3 marks each, several per paper.</li>
          <li><em>"Differentiate between DELETE and TRUNCATE."</em> — DML vs DDL, WHERE allowed vs not, rollback possible vs not, triggers fire vs not (4 marks).</li>
          <li>Always write the WHERE clause in an exam answer unless the question genuinely means "all rows". A missing WHERE is marked wrong.</li>
        </ul>
      </div>
    </div>
    `
  },

  /* ==================================================================== */
  {
    id: "u3-views",
    title: "3.8 Views",
    summary: "Virtual tables: why they exist, creating and dropping them, updatable vs read-only views, WITH CHECK OPTION, materialized views, and the view-update problem.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 7 (Sec. 7.3) | Silberschatz Ch. 4</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>A <strong>view</strong> is a saved query that you can then use as if it were a table. It stores <em>no data of its own</em> — every time you query the view, the DBMS runs the underlying SELECT again, on the current data.</p>
        <p>That is why a view is called a <strong>virtual table</strong>.</p>
      </div>

      <div class="learn-box analogy-box">
        <div class="learn-title">🪟 Everyday Analogy</div>
        <p>A view is a <strong>window</strong> into the database, not a photograph of it.</p>
        <p>A window shows you part of the room (some rows and columns) and hides the rest. Look through it tomorrow and you see whatever is in the room tomorrow. A photograph, by contrast, would be frozen — that is a <em>materialized</em> view, covered at the end of this topic.</p>
      </div>

      <h3>Why Views Exist — Four Real Reasons</h3>
      <div class="grid-2col">
        <div class="feature-card">
          <h4>1. Security</h4>
          <p>Give the accounts clerk a view containing only <code>name</code> and <code>fees</code> — never <code>contact</code> or <code>address</code>. Grant permission on the <em>view</em>, not the table, and the hidden columns are genuinely unreachable.</p>
        </div>
        <div class="feature-card">
          <h4>2. Simplicity</h4>
          <p>Hide a five-table join behind one friendly name. Users write <code>SELECT * FROM student_report;</code> instead of forty lines of SQL they would get wrong.</p>
        </div>
        <div class="feature-card">
          <h4>3. Logical data independence</h4>
          <p>Exactly the concept from Unit 1. Restructure the underlying tables, rewrite the view definition to compensate, and every program using the view keeps working unchanged.</p>
        </div>
        <div class="feature-card">
          <h4>4. Consistency of business rules</h4>
          <p>"Active student" means fees paid and semester current. Define it once in a view and every report uses the same definition instead of each analyst inventing their own.</p>
        </div>
      </div>

      <div class="learn-box world-box">
        <div class="learn-title">🌍 Views ARE the External Level</div>
        <p>In Unit 1 you learned the three-schema architecture: internal, conceptual, external. A <strong>view is literally an external schema</strong> — a tailored window onto the conceptual schema for one group of users. This topic is the practical, SQL version of that theory, and mentioning the link in an exam answer is worth easy marks.</p>
      </div>

      <hr class="section-divider" />

      <h3>Creating and Using a View</h3>
      <div class="code-block">
        <div class="code-header">
          <span>CREATE VIEW</span>
          <button class="run-in-playground-badge" onclick="app.loadCustomQuery('CREATE VIEW senior_students AS\\nSELECT sid, name, age, fees\\nFROM student\\nWHERE age >= 21;\\n\\n-- Now query it exactly like a table:\\nSELECT * FROM senior_students ORDER BY fees DESC;')">⚡ Create and query a view</button>
        </div>
        <div class="code-content"><pre>CREATE VIEW senior_students AS
SELECT sid, name, age, fees
FROM   student
WHERE  age >= 21;

-- Use it exactly like a table
SELECT * FROM senior_students WHERE fees > 25000;

-- A view can hide a join
CREATE VIEW student_course_teacher AS
SELECT s.name AS student, c.cname AS course, t.tname AS teacher
FROM   student s
JOIN   course  c ON s.sid = c.sid
JOIN   teacher t ON t.cid = c.cid;

-- A view can hide aggregation
CREATE VIEW fee_summary AS
SELECT age, COUNT(*) AS students, AVG(fees) AS avg_fees
FROM   student
WHERE  age IS NOT NULL
GROUP BY age;

-- Managing views
DROP VIEW senior_students;
CREATE OR REPLACE VIEW senior_students AS SELECT ... ;   -- redefine</pre></div>
      </div>

      <hr class="section-divider" />

      <h3>The View Update Problem</h3>
      <div class="learn-box simple-box">
        <div class="learn-title">💡 What the Problem Is</div>
        <p>Reading from a view is always fine. <strong>Writing</strong> through one is not, because the DBMS must translate your change into a change on the real tables — and sometimes that translation is impossible or ambiguous.</p>
        <p>If a view shows <code>AVG(fees) = 25750</code> for age 21, and you try to update that average to 30000, <em>which</em> students' fees should change, and by how much? There is no single correct answer, so the DBMS refuses.</p>
      </div>

      <div class="compare-grid">
        <div class="compare-card compare-good">
          <h4>✔ Updatable view — conditions</h4>
          <ul>
            <li>Built on <strong>exactly one</strong> base table.</li>
            <li>No <code>DISTINCT</code>.</li>
            <li>No aggregate functions (<code>SUM</code>, <code>AVG</code>, <code>COUNT</code>…).</li>
            <li>No <code>GROUP BY</code> or <code>HAVING</code>.</li>
            <li>No set operations (UNION, INTERSECT…).</li>
            <li>It includes every <code>NOT NULL</code> column of the base table (needed for INSERT).</li>
          </ul>
        </div>
        <div class="compare-card compare-bad">
          <h4>✘ Read-only view — causes</h4>
          <ul>
            <li>Joins more than one table — which table should the change go to?</li>
            <li>Contains aggregates — one view row represents many base rows.</li>
            <li>Contains <code>GROUP BY</code> or <code>DISTINCT</code> — rows have been merged.</li>
            <li>Contains calculated columns such as <code>fees * 0.95</code> — the DBMS cannot reverse arbitrary arithmetic.</li>
          </ul>
        </div>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 One-Line Rule</div>
        <div class="formula-strip">If one row of the view maps to exactly one row of one base table, it is updatable. Otherwise it is not.</div>
      </div>

      <h3>WITH CHECK OPTION</h3>
      <div class="code-block">
        <div class="code-header"><span>Stopping rows from vanishing out of the view</span></div>
        <div class="code-content"><pre>CREATE VIEW senior_students AS
SELECT sid, name, age, fees
FROM   student
WHERE  age >= 21
WITH CHECK OPTION;

-- Without WITH CHECK OPTION this would succeed, and the row would then
-- disappear from the very view you used to change it:
UPDATE senior_students SET age = 19 WHERE sid = 101;

-- With WITH CHECK OPTION the DBMS rejects it, because age 19 breaks the
-- view's own WHERE condition (age >= 21).</pre></div>
      </div>
      <p><code>WITH CHECK OPTION</code> guarantees that every row you insert or update through the view still satisfies the view's condition — so nothing can be pushed outside the window you are looking through.</p>

      <hr class="section-divider" />

      <h3>Simple View vs Materialized View</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:24%">Basis</th><th>Simple (Virtual) View</th><th>Materialized View</th></tr></thead>
          <tbody>
            <tr><td><strong>Stores data?</strong></td><td>No — only the query definition is stored.</td><td><strong>Yes</strong> — the result is physically stored on disk.</td></tr>
            <tr><td><strong>Freshness</strong></td><td>Always current; the query re-runs each time.</td><td>Can be stale until it is refreshed.</td></tr>
            <tr><td><strong>Speed</strong></td><td>Slower — the work is repeated on every access.</td><td>Much faster — the work was done once.</td></tr>
            <tr><td><strong>Storage cost</strong></td><td>Almost none.</td><td>Uses real disk space.</td></tr>
            <tr><td><strong>Best for</strong></td><td>Security, simplification, everyday queries.</td><td>Heavy reports and dashboards over huge tables.</td></tr>
            <tr><td><strong>Refresh</strong></td><td>Not applicable.</td><td><code>REFRESH MATERIALIZED VIEW name;</code> — on demand or scheduled.</td></tr>
          </tbody>
        </table>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Worked Example</div>
        <div class="we-question">The accounts office must see each student's id, name and fee but never their contact number or address, and must not be able to change a student's fee to below 20000 through their window. Design it, and state whether the view is updatable.</div>
        <ol class="step-list">
          <li><strong>Hide the sensitive columns</strong> by simply not selecting them. The view exposes <code>sid</code>, <code>name</code> and <code>fees</code> only.</li>
          <li><strong>Add the business rule</strong> as the view's WHERE condition: <code>WHERE fees &gt;= 20000</code>.</li>
          <li><strong>Enforce the rule on writes</strong> with <code>WITH CHECK OPTION</code>, so an UPDATE that would drop a fee below 20000 is rejected rather than silently pushing the row out of the view.</li>
          <li><strong>Grant privileges on the view, not the table:</strong> <code>GRANT SELECT, UPDATE ON accounts_view TO accounts_clerk;</code> The clerk has no rights on <code>student</code> at all, so <code>address</code> is genuinely unreachable.</li>
          <li><strong>Is it updatable?</strong> Check the list: one base table ✔, no DISTINCT ✔, no aggregate ✔, no GROUP BY ✔, no join ✔ → <strong>yes, it is updatable</strong> for the three columns it exposes.</li>
          <li><strong>Caveat on INSERT:</strong> inserting <em>through</em> this view would fail if the base table has other NOT NULL columns without defaults, because the view cannot supply values for columns it does not contain.</li>
        </ol>
        <div class="code-block">
          <div class="code-header">
            <span>Answer</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('CREATE VIEW accounts_view AS\\nSELECT sid, name, fees\\nFROM student\\nWHERE fees >= 20000;\\n\\nSELECT * FROM accounts_view ORDER BY fees DESC;')">⚡ Create it</button>
          </div>
          <div class="code-content"><pre>CREATE VIEW accounts_view AS
SELECT sid, name, fees
FROM   student
WHERE  fees >= 20000
WITH CHECK OPTION;

GRANT SELECT, UPDATE ON accounts_view TO accounts_clerk;</pre></div>
        </div>
        <div class="we-answer"><strong>Answer:</strong> the view is <strong>updatable</strong> (single table, no aggregation, no DISTINCT, no join). WITH CHECK OPTION blocks any update that would set the fee below 20000, and granting rights on the view rather than the table hides <code>address</code> and <code>contact</code> completely.</div>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"What is a view? Explain its advantages with examples."</em> — near-certain. Definition + the four reasons + a CREATE VIEW statement (6–8 marks).</li>
          <li><em>"When is a view updatable?"</em> — the conditions list, then explain <em>why</em> aggregates and joins break updatability (5 marks).</li>
          <li><em>"Differentiate between a view and a table."</em> — a table stores data physically; a view stores only a definition and is computed on demand (3 marks).</li>
          <li><em>"What is a materialized view?"</em> — the comparison table (3–4 marks).</li>
        </ul>
      </div>
    </div>
    `
  },

  /* ==================================================================== */
  {
    id: "u3-advanced-sql",
    title: "3.9 Additional SQL Features — Indexes, Triggers, Assertions & Transactions",
    summary: "Beyond the core syllabus but part of any real course: indexes for speed, triggers for automatic actions, assertions for database-wide rules, GRANT/REVOKE, and transaction control.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 7 (Sec. 7.1, 7.2) | Silberschatz Ch. 4, 5</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 Why This Topic Is Here</div>
        <p>These items are not always listed by name in the syllabus, but they appear regularly in question papers under "advanced SQL" and in the lab work — and they are what turns textbook SQL into a working system. Each one is short.</p>
      </div>

      <h3>1. Indexes — Making Queries Fast</h3>
      <div class="learn-box analogy-box">
        <div class="learn-title">📖 Everyday Analogy</div>
        <p>An index in a database is exactly the index at the back of a textbook. Without it, finding "normalization" means reading all 900 pages (a <strong>full table scan</strong>). With it, you look up the word and jump straight to page 512.</p>
      </div>

      <div class="code-block">
        <div class="code-header"><span>Creating indexes</span></div>
        <div class="code-content"><pre>CREATE INDEX idx_student_name ON student(name);
CREATE UNIQUE INDEX idx_student_contact ON student(contact);
CREATE INDEX idx_course_sid_cname ON course(sid, cname);   -- composite
DROP INDEX idx_student_name;</pre></div>
      </div>

      <div class="compare-grid">
        <div class="compare-card compare-good">
          <h4>✔ Index these</h4>
          <ul>
            <li>Primary keys (done automatically).</li>
            <li>Foreign keys — they are joined on constantly.</li>
            <li>Columns used often in <code>WHERE</code> or <code>ORDER BY</code>.</li>
          </ul>
        </div>
        <div class="compare-card compare-bad">
          <h4>✘ Don't index these</h4>
          <ul>
            <li>Small tables — a scan is already fast.</li>
            <li>Columns with very few distinct values (a gender column).</li>
            <li>Columns updated very frequently — every index must be maintained on every write.</li>
          </ul>
        </div>
      </div>
      <p><strong>The trade-off to state in an exam:</strong> an index speeds up <code>SELECT</code> but slows down <code>INSERT</code>, <code>UPDATE</code> and <code>DELETE</code> (the index must be updated too) and consumes extra disk space.</p>

      <hr class="section-divider" />

      <h3>2. Triggers — Automatic Reactions</h3>
      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>A <strong>trigger</strong> is a block of code the DBMS runs <em>automatically</em> when something happens to a table. Nobody calls it; it fires by itself.</p>
        <p>Its structure is always <strong>ECA</strong>: an <strong>E</strong>vent (INSERT/UPDATE/DELETE), an optional <strong>C</strong>ondition, and an <strong>A</strong>ction.</p>
      </div>

      <div class="code-block">
        <div class="code-header"><span>A trigger that writes an audit log</span></div>
        <div class="code-content"><pre>CREATE TRIGGER trg_fee_audit
AFTER UPDATE ON student
FOR EACH ROW
WHEN (NEW.fees <> OLD.fees)                 -- the Condition
BEGIN
    INSERT INTO fee_audit_log (sid, old_fees, new_fees, changed_at)
    VALUES (OLD.sid, OLD.fees, NEW.fees, CURRENT_TIMESTAMP);
END;</pre></div>
      </div>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:24%">Trigger Type</th><th>Fires</th><th style="width:32%">Typical Use</th></tr></thead>
          <tbody>
            <tr><td><code>BEFORE INSERT/UPDATE</code></td><td>Before the change is written.</td><td>Validating or cleaning up a value before it is stored.</td></tr>
            <tr><td><code>AFTER INSERT/UPDATE/DELETE</code></td><td>After the change is written.</td><td>Audit logging, sending notifications, updating a summary table.</td></tr>
            <tr><td><code>INSTEAD OF</code></td><td>Replaces the operation entirely.</td><td>Making an otherwise read-only view updatable.</td></tr>
          </tbody>
        </table>
      </div>
      <p><code>OLD</code> refers to the row as it was before; <code>NEW</code> refers to the row as it will be. <code>OLD</code> is unavailable in an INSERT trigger, and <code>NEW</code> is unavailable in a DELETE trigger.</p>

      <h3>3. Assertions — Rules Across Several Tables</h3>
      <div class="code-block">
        <div class="code-header"><span>CREATE ASSERTION</span></div>
        <div class="code-content"><pre>CREATE ASSERTION salary_rule
CHECK (NOT EXISTS (
    SELECT 1 FROM teacher t, student s
    WHERE  t.salary < s.fees
));</pre></div>
      </div>
      <p>A <code>CHECK</code> constraint can only see one row of one table. An <strong>assertion</strong> states a condition the <em>whole database</em> must satisfy. It is part of the SQL standard, but because it must be re-checked after every change to any involved table, it is expensive and most commercial DBMSs do not implement it — the same effect is usually achieved with triggers.</p>

      <h3>4. GRANT and REVOKE (DCL)</h3>
      <div class="code-block">
        <div class="code-header"><span>Controlling privileges</span></div>
        <div class="code-content"><pre>GRANT SELECT, INSERT ON student TO clerk_user;
GRANT ALL PRIVILEGES ON student TO admin_user;
GRANT SELECT ON student TO analyst WITH GRANT OPTION;  -- may pass it on
GRANT SELECT (name, fees) ON student TO reporting_user; -- column level

REVOKE INSERT ON student FROM clerk_user;
REVOKE ALL PRIVILEGES ON student FROM temp_user;</pre></div>
      </div>

      <h3>5. Transaction Control (TCL)</h3>
      <div class="code-block">
        <div class="code-header"><span>Making changes all-or-nothing</span></div>
        <div class="code-content"><pre>BEGIN TRANSACTION;

    UPDATE account SET balance = balance - 5000 WHERE acc_no = 'A101';
    UPDATE account SET balance = balance + 5000 WHERE acc_no = 'B202';

    SAVEPOINT after_transfer;      -- an intermediate marker

    UPDATE account SET balance = balance - 50 WHERE acc_no = 'A101';

    ROLLBACK TO after_transfer;    -- undo only the fee, keep the transfer

COMMIT;                            -- make everything permanent</pre></div>
      </div>
      <div class="learn-box world-box">
        <div class="learn-title">🌍 This Is Unit 5 in Practice</div>
        <p>That bank-transfer example is exactly the <strong>atomicity</strong> problem you will study in Unit 5. If the system crashed between the two UPDATE statements, 5000 rupees would vanish. <code>COMMIT</code> and <code>ROLLBACK</code> are how SQL gives you the all-or-nothing guarantee.</p>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"What is an index? Explain its advantages and disadvantages."</em> — the book-index analogy + the read/write trade-off (4–5 marks).</li>
          <li><em>"What is a trigger? Explain with an example."</em> — the ECA structure + a CREATE TRIGGER statement (5 marks).</li>
          <li><em>"Differentiate between a trigger and an assertion."</em> — a trigger reacts to an event on one table; an assertion is a standing condition on the whole database (3–4 marks).</li>
          <li><em>"Explain GRANT and REVOKE."</em> — DCL, with WITH GRANT OPTION mentioned (3 marks).</li>
        </ul>
      </div>
    </div>
    `
  }
]);

/* ====================================================================== */
/* Unit 3 extras                                                          */
/* ====================================================================== */

registerUnitExtras("unit-3", {
  simpleIntro: {
    heading: "What This Unit Is Really About",
    text: "<p>Units 1 and 2 were about <em>thinking</em>. This unit is about <strong>doing</strong> — it is the one where you actually type commands and the database answers.</p><p>SQL splits neatly into two halves. The first half (<strong>DDL</strong> and <strong>constraints</strong>) builds the container: tables, data types and the rules that keep bad data out. The second half (<strong>DML</strong>) uses it: asking questions with <code>SELECT</code>, combining tables with <code>JOIN</code>, summarising with <code>GROUP BY</code>, and changing data with <code>INSERT</code>, <code>UPDATE</code> and <code>DELETE</code>. Views then wrap all of it into convenient, secure windows.</p><p>At 12 lecture hours this is the largest unit in the course, and it is also the one where marks are easiest to score — SQL questions have exact, checkable answers. Use the <strong>SQL Playground</strong> on this site: every example here runs there for real.</p>",
    goals: [
      "Write CREATE TABLE statements with correct data types and all six constraints.",
      "Retrieve data using SELECT with WHERE, LIKE, BETWEEN, IN, IS NULL, aliases and ORDER BY.",
      "Combine tables with inner, left, right, full, self and natural joins.",
      "Summarise data with aggregate functions, GROUP BY and HAVING, and explain WHERE vs HAVING.",
      "Write scalar, multi-row and correlated subqueries, and use UNION, INTERSECT and EXCEPT.",
      "Insert, update and delete rows safely, and predict which constraint a bad statement violates.",
      "Create views, explain their advantages, and state when a view is updatable."
    ]
  },

  examCorner: {
    mustKnow: [
      "DDL vs DML vs DCL vs TCL (and that SELECT is DML)",
      "All SQL data types, and DECIMAL for money",
      "DROP vs TRUNCATE vs DELETE",
      "The six constraints and their syntax",
      "Referential actions: CASCADE, SET NULL, RESTRICT",
      "SELECT-FROM-WHERE and clause execution order",
      "LIKE wildcards % and _",
      "IS NULL vs = NULL, and three-valued logic",
      "Inner, left, right, full, self and natural joins",
      "COUNT(*) vs COUNT(column)",
      "GROUP BY rules and WHERE vs HAVING",
      "Scalar, multi-row and correlated subqueries; IN, ANY, ALL, EXISTS",
      "UNION vs UNION ALL, INTERSECT, EXCEPT",
      "INSERT / UPDATE / DELETE syntax",
      "Views: advantages, updatability rules, WITH CHECK OPTION"
    ],
    questions: [
      {
        q: "Differentiate between DELETE, TRUNCATE and DROP commands in SQL.",
        marks: "6",
        a: "<table class='syllabus-table'><thead><tr><th>Basis</th><th>DELETE</th><th>TRUNCATE</th><th>DROP</th></tr></thead><tbody><tr><td>Type</td><td>DML</td><td>DDL</td><td>DDL</td></tr><tr><td>Removes</td><td>Selected rows</td><td>All rows</td><td>Rows + table structure</td></tr><tr><td>WHERE clause</td><td>Allowed</td><td>Not allowed</td><td>Not allowed</td></tr><tr><td>Rollback</td><td>Possible before COMMIT</td><td>Not possible (auto-commit)</td><td>Not possible</td></tr><tr><td>Speed</td><td>Slow (logs each row)</td><td>Very fast</td><td>Fast</td></tr><tr><td>Triggers</td><td>Fire</td><td>Do not fire</td><td>Do not fire</td></tr><tr><td>After execution</td><td>Table with remaining rows</td><td>Empty table</td><td>Table does not exist</td></tr></tbody></table><p><code>DELETE FROM student WHERE sid=101;</code> · <code>TRUNCATE TABLE student;</code> · <code>DROP TABLE student;</code></p>"
      },
      {
        q: "Explain the different types of joins in SQL with suitable examples.",
        marks: "10",
        a: "<p>A <strong>join</strong> combines rows from two or more tables based on a related column.</p><ul><li><strong>CROSS JOIN (Cartesian product)</strong> — every row of A with every row of B. <code>SELECT * FROM student, course;</code> Usually a mistake.</li><li><strong>INNER JOIN</strong> — only rows satisfying the join condition in both tables.<br><code>SELECT s.name, c.cname FROM student s INNER JOIN course c ON s.sid = c.sid;</code></li><li><strong>LEFT OUTER JOIN</strong> — all rows of the left table plus matches from the right; unmatched right columns become NULL.<br><code>SELECT s.name, c.cname FROM student s LEFT JOIN course c ON s.sid = c.sid;</code></li><li><strong>RIGHT OUTER JOIN</strong> — the mirror image: all rows of the right table.</li><li><strong>FULL OUTER JOIN</strong> — all rows of both tables, matched where possible.</li><li><strong>SELF JOIN</strong> — a table joined to itself with two aliases, used for recursive relationships.<br><code>SELECT e.name, m.name AS manager FROM employee e JOIN employee m ON e.mgr_id = m.emp_id;</code></li><li><strong>NATURAL JOIN</strong> — an inner join that matches automatically on all identically-named columns.</li></ul><p>Draw the four Venn diagrams (inner, left, right, full) — they carry marks on their own.</p>"
      },
      {
        q: "Differentiate between the WHERE and HAVING clauses with examples.",
        marks: "5",
        a: "<table class='syllabus-table'><thead><tr><th>Basis</th><th>WHERE</th><th>HAVING</th></tr></thead><tbody><tr><td>Operates on</td><td>Individual rows</td><td>Groups formed by GROUP BY</td></tr><tr><td>Executed</td><td>Before GROUP BY</td><td>After GROUP BY</td></tr><tr><td>Aggregate functions</td><td>Cannot be used</td><td>Can be used</td></tr><tr><td>Requires GROUP BY</td><td>No</td><td>Normally yes</td></tr></tbody></table><p><strong>Example using both:</strong></p><p><code>SELECT age, COUNT(*) FROM student WHERE fees > 22000 GROUP BY age HAVING COUNT(*) > 2;</code></p><p>WHERE first discards students paying 22000 or less; the remaining rows are grouped by age; HAVING then discards groups containing two students or fewer. The reason WHERE cannot use COUNT(*) is the execution order: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY, so at the time WHERE runs the groups do not yet exist.</p>"
      },
      {
        q: "What is a view? Explain its advantages and state when a view is updatable.",
        marks: "8",
        a: "<p>A <strong>view</strong> is a virtual table derived from one or more base tables by a stored SELECT statement. It contains no data of its own — the query is re-executed each time the view is accessed.</p><p><code>CREATE VIEW senior_students AS SELECT sid, name, age FROM student WHERE age >= 21;</code></p><p><strong>Advantages:</strong></p><ul><li><strong>Security</strong> — expose only certain columns and rows; grant privileges on the view instead of the table.</li><li><strong>Simplicity</strong> — hide complex joins and aggregations behind a simple name.</li><li><strong>Logical data independence</strong> — base tables can be restructured while the view keeps applications working (the view is the external schema of the three-schema architecture).</li><li><strong>Consistency</strong> — business definitions are written once and reused.</li></ul><p><strong>A view is updatable only if:</strong> it is based on a single table; it contains no DISTINCT, no aggregate function, no GROUP BY or HAVING, and no set operation; and it includes all NOT NULL columns of the base table. In short, one view row must correspond to exactly one base-table row.</p><p><strong>WITH CHECK OPTION</strong> ensures that rows inserted or updated through the view still satisfy the view's WHERE condition.</p>"
      },
      {
        q: "What is a nested query? Explain correlated and non-correlated subqueries with examples.",
        marks: "8",
        a: "<p>A <strong>nested query (subquery)</strong> is a SELECT statement written inside another SQL statement, enclosed in parentheses.</p><p><strong>Non-correlated subquery:</strong> independent of the outer query, so it is evaluated <em>once</em> and its result is used by the outer query.</p><p><code>SELECT name, fees FROM student WHERE fees > (SELECT AVG(fees) FROM student);</code></p><p><strong>Correlated subquery:</strong> references a column of the outer query, so it must be re-evaluated <em>once for every row</em> of the outer query.</p><p><code>SELECT s.name FROM student s WHERE EXISTS (SELECT 1 FROM course c WHERE c.sid = s.sid);</code></p><p>Here <code>s.sid</code> comes from the outer query, creating the correlation.</p><p><strong>Operators used with subqueries:</strong> <code>=</code> etc. for single-value (scalar) subqueries; <code>IN</code>, <code>NOT IN</code>, <code>ANY</code>, <code>ALL</code> for multi-row subqueries; <code>EXISTS</code>/<code>NOT EXISTS</code> for correlated subqueries. Note that <code>&gt; ANY</code> is equivalent to greater than the minimum, and <code>&gt; ALL</code> to greater than the maximum.</p>"
      },
      {
        q: "Explain the integrity constraints available in SQL with examples.",
        marks: "8",
        a: "<ul><li><strong>NOT NULL</strong> — the column must always have a value. <code>name VARCHAR(60) NOT NULL</code></li><li><strong>UNIQUE</strong> — no two rows may share the value; NULLs are permitted. <code>email VARCHAR(80) UNIQUE</code></li><li><strong>PRIMARY KEY</strong> — UNIQUE and NOT NULL combined; only one per table. <code>sid INT PRIMARY KEY</code></li><li><strong>FOREIGN KEY</strong> — the value must exist as a primary key in the referenced table, enforcing referential integrity. <code>FOREIGN KEY (sid) REFERENCES student(sid)</code></li><li><strong>CHECK</strong> — a user-defined condition every row must satisfy. <code>fees DECIMAL(9,2) CHECK (fees >= 20000)</code></li><li><strong>DEFAULT</strong> — supplies a value when none is given. <code>semester CHAR(8) DEFAULT '6th'</code></li></ul><p>Constraints may be written at <strong>column level</strong> (beside the column) or at <strong>table level</strong> (after all columns), the latter being compulsory for multi-column constraints and allowing the constraint to be named.</p><p><strong>Referential actions</strong> on the foreign key determine what happens when the parent row is deleted or updated: NO ACTION/RESTRICT (default, reject), CASCADE, SET NULL, SET DEFAULT.</p>"
      },
      {
        q: "Write SQL statements for the following (student(sid, name, address, age, fees), course(cid, cname, duration, sid)): (i) students older than 21 (ii) average fee per age (iii) students with no course (iv) the second-highest fee.",
        marks: "8",
        a: "<p><strong>(i)</strong> <code>SELECT * FROM student WHERE age > 21;</code></p><p><strong>(ii)</strong> <code>SELECT age, AVG(fees) AS avg_fees FROM student WHERE age IS NOT NULL GROUP BY age;</code></p><p><strong>(iii)</strong> <code>SELECT s.sid, s.name FROM student s LEFT JOIN course c ON s.sid = c.sid WHERE c.cid IS NULL;</code><br>or equivalently <code>SELECT sid, name FROM student s WHERE NOT EXISTS (SELECT 1 FROM course c WHERE c.sid = s.sid);</code></p><p><strong>(iv)</strong> <code>SELECT MAX(fees) FROM student WHERE fees < (SELECT MAX(fees) FROM student);</code><br>or <code>SELECT DISTINCT fees FROM student ORDER BY fees DESC LIMIT 1 OFFSET 1;</code></p><p>The 'second highest' pattern — take the maximum of everything below the maximum — is worth memorising; it appears very often.</p>"
      }
    ]
  },

  quiz: [
    {
      q: "Which of the following is a DDL command?",
      opts: ["ALTER", "SELECT", "UPDATE", "COMMIT"],
      correct: 0,
      explain: "CREATE, ALTER, DROP, TRUNCATE and RENAME are DDL. SELECT and UPDATE are DML; COMMIT is TCL."
    },
    {
      q: "Which data type should be used to store a money amount?",
      opts: ["DECIMAL(10,2)", "FLOAT", "REAL", "DOUBLE"],
      correct: 0,
      explain: "DECIMAL stores digits exactly. Floating-point types are approximate, so repeated arithmetic on money slowly introduces rounding errors."
    },
    {
      q: "What does 'SELECT name FROM student WHERE address = NULL' return?",
      opts: [
        "No rows at all",
        "Students whose address is NULL",
        "All students",
        "A syntax error"
      ],
      correct: 0,
      explain: "Comparing anything with NULL yields UNKNOWN, never TRUE, so no row passes the filter. The correct form is WHERE address IS NULL."
    },
    {
      q: "In the pattern LIKE '_a%', the underscore matches:",
      opts: ["Exactly one character", "Any number of characters", "Only a digit", "Only a space"],
      correct: 0,
      explain: "_ matches exactly one character and % matches any number. So '_a%' means: any one character, then 'a', then anything."
    },
    {
      q: "In a table of 15 rows where 2 addresses are NULL, COUNT(address) returns:",
      opts: ["13", "15", "2", "0"],
      correct: 0,
      explain: "COUNT(column) skips NULLs and returns 13; only COUNT(*) counts all 15 rows regardless of values."
    },
    {
      q: "Which clause filters GROUPS rather than individual rows?",
      opts: ["HAVING", "WHERE", "ORDER BY", "GROUP BY"],
      correct: 0,
      explain: "WHERE runs before grouping and filters rows; HAVING runs after grouping and is the only place an aggregate condition such as COUNT(*) > 2 may appear."
    },
    {
      q: "The correct logical execution order of SQL clauses is:",
      opts: [
        "FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY",
        "SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY",
        "FROM → SELECT → WHERE → GROUP BY → HAVING → ORDER BY",
        "WHERE → FROM → SELECT → GROUP BY → ORDER BY → HAVING"
      ],
      correct: 0,
      explain: "This order explains two rules at once: WHERE cannot use a column alias (SELECT has not run), while ORDER BY can (it runs after SELECT)."
    },
    {
      q: "Which join returns all rows of the left table plus matching rows of the right?",
      opts: ["LEFT OUTER JOIN", "INNER JOIN", "CROSS JOIN", "RIGHT OUTER JOIN"],
      correct: 0,
      explain: "A LEFT OUTER JOIN preserves every left-hand row, filling the right-hand columns with NULL where no match exists."
    },
    {
      q: "'LEFT JOIN … WHERE right_table.key IS NULL' finds:",
      opts: [
        "Rows in the left table with no match in the right table",
        "Rows present in both tables",
        "All rows of both tables",
        "Rows with NULL in any column"
      ],
      correct: 0,
      explain: "This is the standard anti-join pattern — students with no course, customers who never ordered, and so on."
    },
    {
      q: "Which operator tests whether a subquery returns any rows at all?",
      opts: ["EXISTS", "IN", "ALL", "BETWEEN"],
      correct: 0,
      explain: "EXISTS cares only whether a row came back, not what it contained — which is why SELECT 1 is the usual body. It is also immune to the NOT IN + NULL trap."
    },
    {
      q: "'x > ALL (subquery)' is equivalent to:",
      opts: [
        "x > the maximum value in the subquery",
        "x > the minimum value in the subquery",
        "x equals some value in the subquery",
        "x is in the subquery's list"
      ],
      correct: 0,
      explain: "ALL means you must beat everybody, so compare with MAX. ANY means beat somebody, so compare with MIN."
    },
    {
      q: "Which set operation removes duplicate rows from the combined result?",
      opts: ["UNION", "UNION ALL", "CROSS JOIN", "INNER JOIN"],
      correct: 0,
      explain: "UNION removes duplicates (which requires a sort, so it is slower). UNION ALL keeps them and is faster when you know duplicates cannot occur."
    },
    {
      q: "A view containing GROUP BY and AVG() is:",
      opts: [
        "Read-only — it cannot be updated",
        "Fully updatable",
        "Updatable only with WITH CHECK OPTION",
        "Automatically a materialized view"
      ],
      correct: 0,
      explain: "One row of an aggregated view represents many base rows, so the DBMS cannot decide which base rows a change should apply to."
    },
    {
      q: "WITH CHECK OPTION on a view ensures that:",
      opts: [
        "Rows inserted or updated through the view still satisfy the view's condition",
        "The view is refreshed automatically",
        "The view is stored physically on disk",
        "Only the owner may query the view"
      ],
      correct: 0,
      explain: "Without it, an update made through the view could push the row outside the view's own WHERE condition, making it silently disappear from that view."
    },
    {
      q: "An UPDATE statement written without a WHERE clause:",
      opts: [
        "Changes every row in the table",
        "Changes nothing",
        "Raises a syntax error",
        "Changes only the first row"
      ],
      correct: 0,
      explain: "This is the classic destructive mistake. Always run the statement as a SELECT first to confirm exactly which rows it will touch."
    },
    {
      q: "An index primarily improves the performance of:",
      opts: [
        "SELECT queries, at the cost of slower INSERT/UPDATE/DELETE",
        "INSERT statements only",
        "All operations equally",
        "Only DDL commands"
      ],
      correct: 0,
      explain: "An index is a lookup structure that must itself be maintained on every write — so reads get faster and writes get slower, plus it uses extra disk space."
    }
  ]
});

registerGlossary("Unit 3", [
  ["SQL", "Structured Query Language — the standard declarative language for relational databases."],
  ["DDL", "Data Definition Language: CREATE, ALTER, DROP, TRUNCATE, RENAME."],
  ["DML", "Data Manipulation Language: SELECT, INSERT, UPDATE, DELETE."],
  ["DCL", "Data Control Language: GRANT and REVOKE."],
  ["TCL", "Transaction Control Language: COMMIT, ROLLBACK, SAVEPOINT."],
  ["DISTINCT", "Removes duplicate rows from a query result."],
  ["LIKE", "Pattern-matching operator; % matches any number of characters, _ matches exactly one."],
  ["IS NULL", "The only correct way to test for a missing value; '= NULL' never matches anything."],
  ["Three-Valued Logic", "SQL conditions evaluate to TRUE, FALSE or UNKNOWN because of NULL."],
  ["Alias", "An alternative name for a column or table, introduced with AS."],
  ["Join", "An operation combining rows from two or more tables using a related column."],
  ["Inner Join", "Returns only rows that satisfy the join condition in both tables."],
  ["Left Outer Join", "Returns all rows of the left table, filling unmatched right columns with NULL."],
  ["Self Join", "A table joined to itself using two aliases; used for recursive relationships."],
  ["Natural Join", "An inner join that automatically matches on all identically-named columns."],
  ["Cartesian Product", "Every row of one table paired with every row of another; usually an error."],
  ["Aggregate Function", "COUNT, SUM, AVG, MIN or MAX — computes one value from many rows."],
  ["GROUP BY", "Divides rows into groups so an aggregate can be computed per group."],
  ["HAVING", "Filters groups after GROUP BY; the only place aggregate conditions may appear."],
  ["Subquery", "A SELECT statement nested inside another statement."],
  ["Correlated Subquery", "A subquery referencing the outer query, re-evaluated once per outer row."],
  ["EXISTS", "Tests whether a subquery returns any row at all; NULL-safe."],
  ["UNION", "Combines two result sets and removes duplicates; UNION ALL keeps them."],
  ["Union Compatibility", "The requirement that both queries in a set operation have the same number and types of columns."],
  ["View", "A virtual table defined by a stored SELECT; it holds no data of its own."],
  ["Updatable View", "A view through which INSERT/UPDATE/DELETE is allowed: one table, no aggregation, no DISTINCT, no GROUP BY."],
  ["WITH CHECK OPTION", "Ensures rows written through a view still satisfy the view's condition."],
  ["Materialized View", "A view whose result is physically stored and must be refreshed."],
  ["Index", "A lookup structure that speeds up searching a column, at the cost of slower writes."],
  ["Trigger", "Code executed automatically by the DBMS in response to an INSERT, UPDATE or DELETE."],
  ["Assertion", "A standing CHECK condition applying to the whole database rather than one table."]
]);
