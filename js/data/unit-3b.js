/**
 * Unit 3 — Part 2: topics 3.5 and 3.6
 *   3.5 Aggregate functions, GROUP BY and HAVING
 *   3.6 Nested queries (subqueries) and set operations
 */

appendTopics("unit-3", [

  /* ==================================================================== */
  {
    id: "u3-aggregates",
    title: "3.5 Aggregate Functions, GROUP BY & HAVING",
    summary: "COUNT, SUM, AVG, MIN, MAX; splitting rows into groups with GROUP BY; filtering groups with HAVING; and the WHERE-vs-HAVING distinction examiners love.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 6 (Sec. 6.4.5–6.4.7) | Silberschatz Ch. 3</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>So far every query returned <em>rows</em>. An <strong>aggregate function</strong> returns a <em>summary</em> — one number computed from many rows.</p>
        <p>"How many students are there?" "What is the average fee?" "Who pays the most?" Those are not questions about one row; they are questions about a whole column at once.</p>
      </div>

      <div class="learn-box analogy-box">
        <div class="learn-title">🧮 Everyday Analogy</div>
        <p>A class test. The list of every student's marks is <em>rows</em>. The class average, the highest mark and the number of students who sat the test are <em>aggregates</em> — you squeeze a whole column down to one value.</p>
        <p><strong>GROUP BY</strong> is what happens when the teacher says "give me the average <em>per section</em>". You sort the papers into piles, then compute one average per pile.</p>
      </div>

      <h3>The Five Aggregate Functions</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:18%">Function</th><th>Returns</th><th style="width:22%">Ignores NULL?</th><th style="width:22%">Example</th></tr></thead>
          <tbody>
            <tr><td><code>COUNT(*)</code></td><td>The number of <strong>rows</strong>.</td><td><strong>No</strong> — counts every row</td><td><code>COUNT(*)</code> → 15</td></tr>
            <tr><td><code>COUNT(col)</code></td><td>The number of <strong>non-NULL values</strong> in that column.</td><td><strong>Yes</strong></td><td><code>COUNT(address)</code> → 13</td></tr>
            <tr><td><code>SUM(col)</code></td><td>The total of a numeric column.</td><td>Yes</td><td><code>SUM(fees)</code></td></tr>
            <tr><td><code>AVG(col)</code></td><td>The arithmetic mean.</td><td>Yes</td><td><code>AVG(fees)</code></td></tr>
            <tr><td><code>MIN(col)</code></td><td>The smallest value (works on text and dates too).</td><td>Yes</td><td><code>MIN(age)</code></td></tr>
            <tr><td><code>MAX(col)</code></td><td>The largest value.</td><td>Yes</td><td><code>MAX(salary)</code></td></tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ COUNT(*) vs COUNT(column) — A Guaranteed Exam Question</div>
        <p>In the playground's <code>student</code> table there are <strong>15 rows</strong>, but two students have no address.</p>
        <ul>
          <li><code>COUNT(*)</code> → <strong>15</strong>. It counts rows and does not look at values at all.</li>
          <li><code>COUNT(address)</code> → <strong>13</strong>. It counts only non-NULL values.</li>
        </ul>
        <p>The same trap catches <code>AVG</code>: if 2 of 15 ages are NULL, <code>AVG(age)</code> divides by <strong>13</strong>, not 15.</p>
      </div>

      <div class="code-block">
        <div class="code-header">
          <span>See the difference for yourself</span>
          <button class="run-in-playground-badge" onclick="app.loadCustomQuery('SELECT\\n    COUNT(*)        AS total_rows,\\n    COUNT(address)  AS rows_with_address,\\n    COUNT(age)      AS rows_with_age,\\n    SUM(fees)       AS total_fees,\\n    ROUND(AVG(fees), 2) AS average_fees,\\n    MIN(fees)       AS lowest_fee,\\n    MAX(fees)       AS highest_fee\\nFROM student;')">⚡ Run</button>
        </div>
        <div class="code-content"><pre>SELECT
    COUNT(*)            AS total_rows,
    COUNT(address)      AS rows_with_address,   -- fewer: NULLs skipped
    SUM(fees)           AS total_fees,
    ROUND(AVG(fees), 2) AS average_fees,
    MIN(fees)           AS lowest_fee,
    MAX(fees)           AS highest_fee
FROM student;

-- COUNT DISTINCT: how many different ages are there?
SELECT COUNT(DISTINCT age) AS different_ages FROM student;</pre></div>
      </div>

      <hr class="section-divider" />

      <h3>GROUP BY — One Summary per Group</h3>
      <div class="learn-box simple-box">
        <div class="learn-title">💡 What GROUP BY Actually Does</div>
        <p>It sorts the rows into piles, one pile per distinct value, and then runs the aggregate function <strong>once per pile</strong> instead of once over everything.</p>
      </div>

      <div class="svg-figure">
        <svg viewBox="0 0 800 300" role="img" aria-label="Rows being sorted into groups and then aggregated">
          <text x="120" y="24" text-anchor="middle" font-size="13" font-weight="700" class="svg-muted">Original rows</text>
          <rect x="30" y="40" width="180" height="26" class="svg-panel" stroke-width="1.2"/><text x="120" y="58" text-anchor="middle" font-size="11">Aarav · age 21 · 25000</text>
          <rect x="30" y="66" width="180" height="26" class="svg-panel" stroke-width="1.2"/><text x="120" y="84" text-anchor="middle" font-size="11">Pooja · age 20 · 28000</text>
          <rect x="30" y="92" width="180" height="26" class="svg-panel" stroke-width="1.2"/><text x="120" y="110" text-anchor="middle" font-size="11">Bikash · age 22 · 22000</text>
          <rect x="30" y="118" width="180" height="26" class="svg-panel" stroke-width="1.2"/><text x="120" y="136" text-anchor="middle" font-size="11">Rohan · age 21 · 26500</text>
          <rect x="30" y="144" width="180" height="26" class="svg-panel" stroke-width="1.2"/><text x="120" y="162" text-anchor="middle" font-size="11">Anjali · age 20 · 24000</text>
          <rect x="30" y="170" width="180" height="26" class="svg-panel" stroke-width="1.2"/><text x="120" y="188" text-anchor="middle" font-size="11">Bibek · age 22 · 27500</text>

          <text x="255" y="118" text-anchor="middle" font-size="22" fill="#6366f1">→</text>
          <text x="255" y="142" text-anchor="middle" font-size="10" font-weight="700" fill="#6366f1">GROUP BY age</text>

          <text x="400" y="24" text-anchor="middle" font-size="13" font-weight="700" class="svg-muted">Three piles</text>
          <rect x="310" y="36" width="180" height="60" rx="6" fill="rgba(16,185,129,0.14)" stroke="#10b981" stroke-width="1.8"/>
          <text x="400" y="54" text-anchor="middle" font-size="11" font-weight="700">age = 20</text>
          <text x="400" y="70" text-anchor="middle" font-size="10">Pooja 28000</text>
          <text x="400" y="86" text-anchor="middle" font-size="10">Anjali 24000</text>

          <rect x="310" y="104" width="180" height="60" rx="6" fill="rgba(6,182,212,0.14)" stroke="#06b6d4" stroke-width="1.8"/>
          <text x="400" y="122" text-anchor="middle" font-size="11" font-weight="700">age = 21</text>
          <text x="400" y="138" text-anchor="middle" font-size="10">Aarav 25000</text>
          <text x="400" y="154" text-anchor="middle" font-size="10">Rohan 26500</text>

          <rect x="310" y="172" width="180" height="60" rx="6" fill="rgba(245,158,11,0.14)" stroke="#f59e0b" stroke-width="1.8"/>
          <text x="400" y="190" text-anchor="middle" font-size="11" font-weight="700">age = 22</text>
          <text x="400" y="206" text-anchor="middle" font-size="10">Bikash 22000</text>
          <text x="400" y="222" text-anchor="middle" font-size="10">Bibek 27500</text>

          <text x="535" y="118" text-anchor="middle" font-size="22" fill="#6366f1">→</text>
          <text x="535" y="142" text-anchor="middle" font-size="10" font-weight="700" fill="#6366f1">AVG(fees)</text>

          <text x="680" y="24" text-anchor="middle" font-size="13" font-weight="700" class="svg-muted">One row per pile</text>
          <rect x="590" y="40" width="180" height="28" rx="4" fill="rgba(16,185,129,0.20)" stroke="#10b981" stroke-width="1.5"/>
          <text x="680" y="59" text-anchor="middle" font-size="11">20 → 26000</text>
          <rect x="590" y="108" width="180" height="28" rx="4" fill="rgba(6,182,212,0.20)" stroke="#06b6d4" stroke-width="1.5"/>
          <text x="680" y="127" text-anchor="middle" font-size="11">21 → 25750</text>
          <rect x="590" y="176" width="180" height="28" rx="4" fill="rgba(245,158,11,0.20)" stroke="#f59e0b" stroke-width="1.5"/>
          <text x="680" y="195" text-anchor="middle" font-size="11">22 → 24750</text>

          <text x="400" y="268" text-anchor="middle" font-size="12" class="svg-muted">6 rows in → 3 groups → 3 rows out. The result has one row per distinct value of the grouping column.</text>
        </svg>
        <div class="figure-caption">Figure 3.3 — What GROUP BY does: sort into piles, then aggregate each pile separately.</div>
      </div>

      <div class="code-block">
        <div class="code-header">
          <span>GROUP BY in practice</span>
          <button class="run-in-playground-badge" onclick="app.loadCustomQuery('SELECT\\n    age,\\n    COUNT(*)            AS students,\\n    ROUND(AVG(fees), 2) AS avg_fees,\\n    MAX(fees)           AS highest_fee\\nFROM student\\nWHERE age IS NOT NULL\\nGROUP BY age\\nORDER BY age;')">⚡ Run</button>
        </div>
        <div class="code-content"><pre>SELECT age,
       COUNT(*)            AS students,
       ROUND(AVG(fees), 2) AS avg_fees
FROM   student
WHERE  age IS NOT NULL      -- filter ROWS before grouping
GROUP BY age
ORDER BY age;

-- Grouping by more than one column makes a pile per COMBINATION
SELECT semester, age, COUNT(*) AS students
FROM   student
GROUP BY semester, age;</pre></div>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ The Golden Rule of GROUP BY</div>
        <div class="formula-strip">Every column in SELECT must be either in GROUP BY, or inside an aggregate function.</div>
        <div class="compare-grid">
          <div class="compare-card compare-bad">
            <h4>✘ Illegal</h4>
            <div class="code-block"><div class="code-content"><pre>SELECT age, name, COUNT(*)
FROM student
GROUP BY age;</pre></div></div>
            <p>The group "age 21" contains <em>two different names</em>. Which one should the database print? The question has no answer, so it is an error.</p>
          </div>
          <div class="compare-card compare-good">
            <h4>✔ Legal</h4>
            <div class="code-block"><div class="code-content"><pre>SELECT age, COUNT(*), MAX(name)
FROM student
GROUP BY age;</pre></div></div>
            <p><code>age</code> is in GROUP BY, and <code>name</code> is wrapped in an aggregate, so each has exactly one value per group.</p>
          </div>
        </div>
      </div>

      <hr class="section-divider" />

      <h3>HAVING — Filtering the Groups</h3>
      <div class="learn-box simple-box">
        <div class="learn-title">💡 WHERE vs HAVING in One Sentence</div>
        <div class="formula-strip">WHERE filters ROWS (before grouping) · HAVING filters GROUPS (after grouping)</div>
        <p>That is the entire distinction, and it falls straight out of the execution order you learned in topic 3.3: <strong>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY</strong>. WHERE runs before the groups exist, so it cannot possibly see a <code>COUNT(*)</code>.</p>
      </div>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:22%">Basis</th><th>WHERE</th><th>HAVING</th></tr></thead>
          <tbody>
            <tr><td><strong>Filters</strong></td><td>Individual rows</td><td>Groups produced by GROUP BY</td></tr>
            <tr><td><strong>Runs</strong></td><td><strong>Before</strong> GROUP BY</td><td><strong>After</strong> GROUP BY</td></tr>
            <tr><td><strong>Aggregate functions</strong></td><td><strong>Cannot</strong> be used</td><td><strong>Can</strong> be used — that is its purpose</td></tr>
            <tr><td><strong>Needs GROUP BY?</strong></td><td>No</td><td>Almost always (without it the whole table is one group)</td></tr>
            <tr><td><strong>Typical use</strong></td><td><code>WHERE age &gt; 20</code></td><td><code>HAVING COUNT(*) &gt; 2</code></td></tr>
          </tbody>
        </table>
      </div>

      <div class="code-block">
        <div class="code-header">
          <span>WHERE and HAVING working together</span>
          <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- Ages that have more than TWO students,\\n-- counting only students who pay over 22000\\nSELECT age, COUNT(*) AS students, ROUND(AVG(fees),2) AS avg_fees\\nFROM student\\nWHERE fees > 22000          -- filters ROWS first\\nGROUP BY age\\nHAVING COUNT(*) > 2         -- then filters GROUPS\\nORDER BY students DESC;')">⚡ Run</button>
        </div>
        <div class="code-content"><pre>SELECT age,
       COUNT(*)            AS students,
       ROUND(AVG(fees), 2) AS avg_fees
FROM   student
WHERE  fees > 22000          -- 1. throw away cheap rows
GROUP BY age                 -- 2. make one pile per age
HAVING COUNT(*) > 2          -- 3. keep only piles with 3+ students
ORDER BY students DESC;      -- 4. sort the surviving groups</pre></div>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 Memory Trick</div>
        <p><strong>W</strong>HERE comes before <strong>G</strong>ROUP BY in the alphabet <em>and</em> in the query — it works on the raw rows.<br>
        <strong>H</strong>AVING comes after — it works on the <strong>H</strong>eaps (groups) you just made.</p>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Worked Example</div>
        <div class="we-question">Using the student and course tables: list each student's name and how many courses they take, but only for students who take more than one course, sorted by the count from highest to lowest.</div>
        <ol class="step-list">
          <li><strong>"Each student's … how many courses"</strong> — a count <em>per student</em> means <code>GROUP BY</code> on the student.</li>
          <li><strong>Which tables?</strong> Names live in <code>student</code>, the course rows in <code>course</code>, so we need a join on <code>sid</code>.</li>
          <li><strong>Build the join and the group:</strong> <code>FROM student s JOIN course c ON s.sid = c.sid GROUP BY s.sid, s.name</code>. Group by <code>s.sid</code> as well as the name, so that two students who share a name are still counted separately.</li>
          <li><strong>The aggregate:</strong> <code>COUNT(c.cid) AS course_count</code>.</li>
          <li><strong>"only for students who take more than one course"</strong> — this is a condition on the <em>count</em>, which only exists after grouping → it must be <code>HAVING COUNT(c.cid) &gt; 1</code>, never WHERE.</li>
          <li><strong>Sort:</strong> <code>ORDER BY course_count DESC</code>.</li>
        </ol>
        <div class="code-block">
          <div class="code-header">
            <span>Answer</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('SELECT s.sid, s.name, COUNT(c.cid) AS course_count\\nFROM student s\\nJOIN course c ON s.sid = c.sid\\nGROUP BY s.sid, s.name\\nHAVING COUNT(c.cid) > 1\\nORDER BY course_count DESC;')">⚡ Run it</button>
          </div>
          <div class="code-content"><pre>SELECT s.sid, s.name, COUNT(c.cid) AS course_count
FROM   student s
JOIN   course  c ON s.sid = c.sid
GROUP BY s.sid, s.name
HAVING COUNT(c.cid) > 1
ORDER BY course_count DESC;</pre></div>
        </div>
        <div class="we-answer"><strong>The deciding question:</strong> is the condition about a single row, or about a whole group? "Fees over 22000" is about one row → WHERE. "Takes more than one course" is about a group → HAVING.</div>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"Differentiate between WHERE and HAVING clauses."</em> — extremely common. The five-row table + one example using both (4–5 marks).</li>
          <li><em>"Explain aggregate functions in SQL with examples."</em> — all five, and be sure to mention the COUNT(*) vs COUNT(col) NULL behaviour (4–6 marks).</li>
          <li>Query numericals: "find the department with the highest average salary", "list courses with more than 30 students" — these always need GROUP BY plus HAVING.</li>
        </ul>
      </div>
    </div>
    `
  },

  /* ==================================================================== */
  {
    id: "u3-subqueries",
    title: "3.6 Nested Queries (Subqueries) & Set Operations",
    summary: "Scalar, multi-row and correlated subqueries; IN, ANY, ALL, EXISTS; subqueries in FROM; and the set operations UNION, INTERSECT and EXCEPT.",
    content: `
    <div class="content-block">
      <span class="ref-badge">📖 Reference: Elmasri &amp; Navathe Ch. 6 (Sec. 6.4.3, 6.4.4) | Silberschatz Ch. 3</span>

      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>A <strong>subquery</strong> is a query inside another query, written in brackets. You use one whenever the answer to your question depends on the answer to a smaller question.</p>
        <p>"Which students pay more than the average?" You cannot answer that in one step — you must <em>first</em> work out the average, <em>then</em> compare each student to it. The inner query finds the average; the outer query does the comparing.</p>
      </div>

      <div class="learn-box analogy-box">
        <div class="learn-title">🛒 Everyday Analogy</div>
        <p>"Buy the cheapest rice in the shop." You cannot point at it immediately. First you check every price to find the minimum (the <em>inner</em> query), then you pick the bag matching that price (the <em>outer</em> query). A subquery is exactly that two-step reasoning, written down.</p>
      </div>

      <h3>The Three Kinds of Subquery</h3>
      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:22%">Type</th><th>Returns</th><th style="width:28%">Used With</th></tr></thead>
          <tbody>
            <tr><td><strong>Scalar</strong> (single-row)</td><td>One single value.</td><td><code>=</code> <code>&gt;</code> <code>&lt;</code> <code>&gt;=</code> <code>&lt;=</code></td></tr>
            <tr><td><strong>Multi-row</strong></td><td>A column of several values.</td><td><code>IN</code>, <code>NOT IN</code>, <code>ANY</code>, <code>ALL</code></td></tr>
            <tr><td><strong>Correlated</strong></td><td>Re-runs once for <em>every</em> row of the outer query, because it refers to that row.</td><td><code>EXISTS</code>, <code>NOT EXISTS</code></td></tr>
          </tbody>
        </table>
      </div>

      <h3>1. Scalar Subquery — Returns One Value</h3>
      <div class="code-block">
        <div class="code-header">
          <span>Comparing against a computed value</span>
          <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- Students paying more than the average fee\\nSELECT name, fees\\nFROM student\\nWHERE fees > (SELECT AVG(fees) FROM student)\\nORDER BY fees DESC;')">⚡ Run</button>
        </div>
        <div class="code-content"><pre>-- Students paying above the average fee
SELECT name, fees
FROM   student
WHERE  fees > (SELECT AVG(fees) FROM student);

-- The student who pays the most
SELECT name, fees
FROM   student
WHERE  fees = (SELECT MAX(fees) FROM student);</pre></div>
      </div>
      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ Why You Cannot Write <code>WHERE fees &gt; AVG(fees)</code></div>
        <p>WHERE runs <em>before</em> any aggregation, so at that moment no average exists yet. The subquery solves it by computing the average completely, in its own separate pass, before the outer WHERE is evaluated.</p>
      </div>

      <h3>2. Multi-Row Subquery — IN, ANY, ALL</h3>
      <div class="code-block">
        <div class="code-header">
          <span>IN and NOT IN</span>
          <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- Students who are enrolled in at least one course\\nSELECT sid, name FROM student\\nWHERE sid IN (SELECT sid FROM course WHERE sid IS NOT NULL);\\n\\n-- Students enrolled in NO course\\nSELECT sid, name FROM student\\nWHERE sid NOT IN (SELECT sid FROM course WHERE sid IS NOT NULL);')">⚡ Run both</button>
        </div>
        <div class="code-content"><pre>-- Students who take at least one course
SELECT sid, name FROM student
WHERE  sid IN (SELECT sid FROM course WHERE sid IS NOT NULL);

-- Students who take no course at all
SELECT sid, name FROM student
WHERE  sid NOT IN (SELECT sid FROM course WHERE sid IS NOT NULL);</pre></div>
      </div>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:22%">Operator</th><th>Meaning</th><th style="width:30%">Equivalent</th></tr></thead>
          <tbody>
            <tr><td><code>x IN (subquery)</code></td><td>x equals <em>at least one</em> returned value.</td><td><code>x = ANY (subquery)</code></td></tr>
            <tr><td><code>x &gt; ANY (subquery)</code></td><td>x is greater than <em>at least one</em> value — i.e. greater than the <strong>minimum</strong>.</td><td><code>x &gt; (SELECT MIN(...))</code></td></tr>
            <tr><td><code>x &gt; ALL (subquery)</code></td><td>x is greater than <em>every</em> value — i.e. greater than the <strong>maximum</strong>.</td><td><code>x &gt; (SELECT MAX(...))</code></td></tr>
            <tr><td><code>x &lt; ALL (subquery)</code></td><td>x is smaller than every value — smaller than the <strong>minimum</strong>.</td><td><code>x &lt; (SELECT MIN(...))</code></td></tr>
          </tbody>
        </table>
      </div>

      <div class="learn-box memory-box">
        <div class="learn-title">🧠 ANY vs ALL — Never Confuse Them Again</div>
        <p><strong>&gt; ANY</strong> means "beat <em>somebody</em>" → you only need to beat the weakest → compare with <strong>MIN</strong>.<br>
        <strong>&gt; ALL</strong> means "beat <em>everybody</em>" → you must beat the strongest → compare with <strong>MAX</strong>.</p>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ The NOT IN + NULL Trap</div>
        <p>If the subquery returns even one NULL, <code>NOT IN</code> returns <strong>no rows at all</strong>. This is because <code>x != NULL</code> evaluates to UNKNOWN, so the whole condition can never be TRUE.</p>
        <p>Fix it either by adding <code>WHERE col IS NOT NULL</code> inside the subquery (as done in the example above), or by using <code>NOT EXISTS</code> instead, which is immune to this problem.</p>
      </div>

      <h3>3. Correlated Subquery — EXISTS and NOT EXISTS</h3>
      <div class="learn-box simple-box">
        <div class="learn-title">💡 What "Correlated" Means</div>
        <p>An ordinary subquery runs <strong>once</strong>. A <em>correlated</em> subquery mentions a column from the outer query, so it must be re-evaluated <strong>once for every outer row</strong>. It is slower, but it can express conditions that a plain subquery cannot.</p>
        <p><code>EXISTS</code> does not care <em>what</em> the subquery returns — only <strong>whether it returned anything at all</strong>. That is why <code>SELECT 1</code> is the conventional thing to put inside it.</p>
      </div>

      <div class="code-block">
        <div class="code-header">
          <span>EXISTS and NOT EXISTS</span>
          <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- Students who HAVE at least one course\\nSELECT s.sid, s.name FROM student s\\nWHERE EXISTS (SELECT 1 FROM course c WHERE c.sid = s.sid);\\n\\n-- Students who have NO course\\nSELECT s.sid, s.name FROM student s\\nWHERE NOT EXISTS (SELECT 1 FROM course c WHERE c.sid = s.sid);')">⚡ Run both</button>
        </div>
        <div class="code-content"><pre>-- Students who have at least one course
SELECT s.sid, s.name
FROM   student s
WHERE  EXISTS (SELECT 1 FROM course c WHERE c.sid = s.sid);
--                                          ^^^^^^^^^^^^ the correlation

-- Students with no course at all (safe even if NULLs are present)
SELECT s.sid, s.name
FROM   student s
WHERE  NOT EXISTS (SELECT 1 FROM course c WHERE c.sid = s.sid);</pre></div>
      </div>

      <h3>4. Subquery in the FROM Clause (Derived Table)</h3>
      <div class="code-block">
        <div class="code-header">
          <span>Treating a query result as a table</span>
          <button class="run-in-playground-badge" onclick="app.loadCustomQuery('SELECT age, student_count\\nFROM (\\n    SELECT age, COUNT(*) AS student_count\\n    FROM student\\n    WHERE age IS NOT NULL\\n    GROUP BY age\\n) AS age_summary\\nWHERE student_count >= 2\\nORDER BY student_count DESC;')">⚡ Run</button>
        </div>
        <div class="code-content"><pre>SELECT age, student_count
FROM (
        SELECT age, COUNT(*) AS student_count
        FROM   student
        WHERE  age IS NOT NULL
        GROUP BY age
     ) AS age_summary          -- the derived table MUST have an alias
WHERE student_count >= 2
ORDER BY student_count DESC;</pre></div>
      </div>
      <p>A derived table lets you filter or join on a value you had to compute first — useful whenever one HAVING clause is not enough.</p>

      <hr class="section-divider" />

      <h3>Set Operations — UNION, INTERSECT, EXCEPT</h3>
      <div class="learn-box simple-box">
        <div class="learn-title">💡 In Simple Words</div>
        <p>Joins glue tables together <strong>side by side</strong> (more columns). Set operations stack results <strong>on top of each other</strong> (more rows).</p>
      </div>

      <div class="svg-figure">
        <svg viewBox="0 0 800 210" role="img" aria-label="Venn diagrams of UNION, INTERSECT and EXCEPT">
          <text x="130" y="24" text-anchor="middle" font-size="14" font-weight="700" fill="#6366f1">UNION</text>
          <circle cx="104" cy="100" r="48" fill="rgba(99,102,241,0.40)" stroke="#6366f1" stroke-width="2"/>
          <circle cx="156" cy="100" r="48" fill="rgba(99,102,241,0.40)" stroke="#6366f1" stroke-width="2"/>
          <text x="86" y="105" text-anchor="middle" font-size="12" font-weight="700">A</text>
          <text x="174" y="105" text-anchor="middle" font-size="12" font-weight="700">B</text>
          <text x="130" y="178" text-anchor="middle" font-size="11" class="svg-muted">rows in A OR B</text>
          <text x="130" y="194" text-anchor="middle" font-size="11" class="svg-muted">(duplicates removed)</text>

          <text x="400" y="24" text-anchor="middle" font-size="14" font-weight="700" fill="#10b981">INTERSECT</text>
          <circle cx="374" cy="100" r="48" fill="none" stroke="#10b981" stroke-width="2"/>
          <circle cx="426" cy="100" r="48" fill="none" stroke="#10b981" stroke-width="2"/>
          <path d="M 400 60 A 48 48 0 0 1 400 140 A 48 48 0 0 1 400 60 Z" fill="rgba(16,185,129,0.45)"/>
          <text x="356" y="105" text-anchor="middle" font-size="12" font-weight="700">A</text>
          <text x="444" y="105" text-anchor="middle" font-size="12" font-weight="700">B</text>
          <text x="400" y="178" text-anchor="middle" font-size="11" class="svg-muted">rows in A AND B</text>
          <text x="400" y="194" text-anchor="middle" font-size="11" class="svg-muted">(the common ones)</text>

          <text x="670" y="24" text-anchor="middle" font-size="14" font-weight="700" fill="#f43f5e">EXCEPT / MINUS</text>
          <path d="M 644 52 A 48 48 0 1 0 644 148 A 48 48 0 0 1 644 52 Z" fill="rgba(244,63,94,0.40)" stroke="#f43f5e" stroke-width="2"/>
          <circle cx="644" cy="100" r="48" fill="none" stroke="#f43f5e" stroke-width="2"/>
          <circle cx="696" cy="100" r="48" fill="none" stroke="#f43f5e" stroke-width="2"/>
          <text x="626" y="105" text-anchor="middle" font-size="12" font-weight="700">A</text>
          <text x="714" y="105" text-anchor="middle" font-size="12" font-weight="700">B</text>
          <text x="670" y="178" text-anchor="middle" font-size="11" class="svg-muted">rows in A but NOT in B</text>
        </svg>
        <div class="figure-caption">Figure 3.4 — The three set operations. Note that EXCEPT is <em>not</em> symmetric: A EXCEPT B differs from B EXCEPT A.</div>
      </div>

      <div class="learn-box mistake-box">
        <div class="learn-title">⚠️ The Two Rules for Every Set Operation</div>
        <ol>
          <li>Both SELECT statements must return the <strong>same number of columns</strong>.</li>
          <li>The corresponding columns must have <strong>compatible data types</strong> (this is called <em>union compatibility</em>).</li>
        </ol>
        <p>Column <em>names</em> need not match — the first query's names are used for the result.</p>
      </div>

      <div class="table-responsive">
        <table class="syllabus-table">
          <thead><tr><th style="width:22%">Operation</th><th>Returns</th><th style="width:26%">Duplicates</th></tr></thead>
          <tbody>
            <tr><td><code>UNION</code></td><td>All rows from both queries.</td><td><strong>Removed</strong> (a sort is needed, so it is slower)</td></tr>
            <tr><td><code>UNION ALL</code></td><td>All rows from both queries.</td><td><strong>Kept</strong> — faster; use it when you know there are no duplicates</td></tr>
            <tr><td><code>INTERSECT</code></td><td>Only rows appearing in <em>both</em> results.</td><td>Removed</td></tr>
            <tr><td><code>EXCEPT</code> (Oracle: <code>MINUS</code>)</td><td>Rows in the first result that are not in the second.</td><td>Removed</td></tr>
          </tbody>
        </table>
      </div>

      <div class="code-block">
        <div class="code-header">
          <span>Set operations</span>
          <button class="run-in-playground-badge" onclick="app.loadCustomQuery('-- One combined list of people in the college\\nSELECT name AS person, \\'Student\\' AS role FROM student\\nUNION ALL\\nSELECT tname, \\'Teacher\\' FROM teacher\\nORDER BY role, person;')">⚡ Run</button>
        </div>
        <div class="code-content"><pre>-- One combined directory of everyone
SELECT name  AS person, 'Student' AS role FROM student
UNION ALL
SELECT tname AS person, 'Teacher' AS role FROM teacher
ORDER BY role, person;

-- Course IDs that have a teacher AND a student
SELECT cid FROM teacher WHERE cid IS NOT NULL
INTERSECT
SELECT cid FROM course  WHERE sid IS NOT NULL;

-- Courses with no student assigned
SELECT cid FROM course
EXCEPT
SELECT cid FROM course WHERE sid IS NOT NULL;</pre></div>
      </div>

      <div class="worked-example">
        <div class="we-title">✍️ Worked Example</div>
        <div class="we-question">Find the name and fee of every student who pays more than the average fee <em>and</em> is enrolled in at least one course. Solve it with subqueries.</div>
        <ol class="step-list">
          <li><strong>Break the question into its two conditions.</strong> Condition A: fee above average. Condition B: enrolled in at least one course. They are joined by AND.</li>
          <li><strong>Condition A needs a value that must be computed first</strong> — the average. A scalar subquery gives it: <code>fees &gt; (SELECT AVG(fees) FROM student)</code>.</li>
          <li><strong>Condition B is about existence</strong>, not about a value. The two clean ways to write it are <code>sid IN (SELECT sid FROM course …)</code> or <code>EXISTS (SELECT 1 FROM course c WHERE c.sid = s.sid)</code>.</li>
          <li><strong>Prefer EXISTS here</strong> — the <code>course.sid</code> column contains NULLs, and <code>IN</code> would need an extra <code>IS NOT NULL</code> guard to be safe.</li>
          <li><strong>Combine with AND</strong> and sort the result.</li>
        </ol>
        <div class="code-block">
          <div class="code-header">
            <span>Answer</span>
            <button class="run-in-playground-badge" onclick="app.loadCustomQuery('SELECT s.sid, s.name, s.fees\\nFROM student s\\nWHERE s.fees > (SELECT AVG(fees) FROM student)\\n  AND EXISTS (SELECT 1 FROM course c WHERE c.sid = s.sid)\\nORDER BY s.fees DESC;')">⚡ Run it</button>
          </div>
          <div class="code-content"><pre>SELECT s.sid, s.name, s.fees
FROM   student s
WHERE  s.fees > (SELECT AVG(fees) FROM student)
  AND  EXISTS (SELECT 1 FROM course c WHERE c.sid = s.sid)
ORDER BY s.fees DESC;</pre></div>
        </div>
      </div>

      <div class="learn-box exam-box">
        <div class="learn-title">🎯 How This Is Asked in the Exam</div>
        <ul>
          <li><em>"What is a nested query? Explain correlated and non-correlated subqueries with examples."</em> — a common 6–8 mark question.</li>
          <li><em>"Differentiate between IN and EXISTS."</em> — IN compares against a list of values and is evaluated once; EXISTS tests whether any row is returned and is re-evaluated per outer row, and it is NULL-safe (4 marks).</li>
          <li><em>"Explain the set operations in SQL."</em> — the Venn diagrams + union compatibility rules (5 marks).</li>
          <li><em>"Differentiate between UNION and UNION ALL."</em> — duplicate removal vs speed (2–3 marks).</li>
        </ul>
      </div>
    </div>
    `
  }
]);
