# 🗄️ Database Management Systems (DBMS) for BBM Students

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://kabu631.github.io/DBMS-for-BBM-Students/)
[![Normalization Practice](https://img.shields.io/badge/Normalization%20Practice-60%20Problems-blue?style=for-the-badge&logo=codewars)](https://kabu631.github.io/DBMS-for-BBM-Students/#normalization)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

An interactive, university-standard digital learning platform and reference curriculum for **Database Management Systems (DBMS)**, tailored for Bachelor of Business Management (BBM) and Computer Science undergraduate students.

---

## 🌐 Live Hosted Web Application

The application is hosted for free on GitHub Pages:
- **Main Learning Platform:** [https://kabu631.github.io/DBMS-for-BBM-Students/](https://kabu631.github.io/DBMS-for-BBM-Students/)
- **Embedded Normalization Portal:** [https://kabu631.github.io/DBMS-for-BBM-Students/#normalization](https://kabu631.github.io/DBMS-for-BBM-Students/#normalization)
- **Direct Standalone Normalization App:** [https://kabu631.github.io/DBMS-for-BBM-Students/normalization/](https://kabu631.github.io/DBMS-for-BBM-Students/normalization/)

---

## 🎯 Platform Highlights

### 1. 🧩 60-Problem Normalization Practice Platform
- **Category 1 (Q1 – Q20):** Functional Dependencies, Attribute Closures ($X^{(0)}, X^{(1)}, \dots$), and Minimal Candidate Keys.
- **Category 2 (Q21 – Q40):** 1NF Atomicity Verification & 2NF Partial Dependency Decomposition.
- **Category 3 (Q41 – Q60):** 3NF Transitive Dependency Decomposition into lossless, dependency-preserving schemas.
- **Interactive Tools:** Step-by-step point-wise solutions, dynamic attribute closure tables, category tabs, difficulty filters (Easy, Medium, Hard), mastery tracker, and quick revision cheat sheet modal.

### 2. ⚡ In-Browser Interactive SQL Playground (WebAssembly)
- Powered by `sql.js` (SQLite compiled to WebAssembly) — zero server dependencies.
- Execute real SQL queries (`CREATE`, `INSERT`, `SELECT`, `JOIN`, `GROUP BY`, `HAVING`, `AGGREGATES`) right in your browser.
- Preloaded schemas (`student`, `course`, `teacher`, `enrollment`) with sample university datasets and challenge questions.

### 3. 📚 Complete 48-Lecture-Hour Curriculum (Units 1 – 6)
- **Unit 1: Database Concepts & Architecture (5 LHs)** — Traditional file systems vs. DBMS, 3-Schema Architecture, Data Independence, DBMS Languages.
- **Unit 2: Data Modeling using ER & Relational Model (10 LHs)** — Entity types, relationships, cardinality ratios, weak entities, generalization/specialization, ER-to-relational schema mapping, relational integrity constraints.
- **Unit 3: SQL (Structured Query Language) (12 LHs)** — DDL, DML, DCL, integrity constraints, complex multi-table joins, subqueries, views, triggers.
- **Unit 4: Relational Database Design & Normalization (10 LHs)** — Update anomalies, Armstrong’s axioms, attribute closures, 1NF, 2NF, 3NF, BCNF, 4NF, 5NF, lossless joins, dependency preservation.
- **Unit 5: Transaction Processing & Concurrency Control (7 LHs)** — ACID properties, transaction states, schedules, serializability, lock-based protocols (2PL, Strict 2PL), timestamp ordering.
- **Unit 6: Database Recovery Techniques (4 LHs)** — Caching, write-ahead logging (WAL), checkpoints, deferred update (NO-UNDO/REDO), immediate update (UNDO/REDO), shadow paging.

### 4. 🎓 University Exam Revision Corner
- **41 High-Yield Exam Questions & Model Answers** organized per unit.
- **84 Interactive Self-Test Quiz Questions** with immediate feedback and answer explanations.
- **182+ Searchable Glossary Terms** covering all core DBMS terminology.
- **Quick Keyboard Shortcuts:** `Ctrl + K` to search topics, `Esc` to dismiss modals.
- **Sleek Themes:** Fully responsive design with automatic Dark Midnight and Clean Light modes.

### 5. 📚 Downloadable Standard Textbooks Library (Free Offline PDFs)
The application includes complete, full-text downloadable reference textbooks for offline reading:
- **Book 1:** *Fundamentals of Database Systems (7th Ed.)* — Ramez Elmasri, Shamkant Navathe (4.3 MB)
- **Book 2:** *Database System Concepts (6th Ed.)* — Avi Silberschatz, Henry Korth, S. Sudarshan (16.5 MB)
- **Book 3:** *Database Management Systems (3rd Ed.)* — Raghu Ramakrishnan, Johannes Gehrke (12.1 MB)
- **Book 4:** *Principles of Distributed Database Systems (4th Ed.)* — M. Tamer Özsu, Patrick Valduriez (3.7 MB)
- **Book 5:** *A First Course in Database Systems (3rd Ed.)* — Jeffrey D. Ullman, Jennifer Widom (11.7 MB)
- **Book 6:** *NoSQL for Dummies (1st Ed.)* — Adam Fowler (3.3 MB)

---

## 💻 Running Locally

This project requires **zero build steps** and **no npm dependencies**. It runs natively in any modern web browser:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kabu631/DBMS-for-BBM-Students.git
   cd DBMS-for-BBM-Students
   ```

2. **Option A: Static File (Double-click)**
   - Simply double-click `index.html` to open it directly in your browser.

3. **Option B: Local Node.js Server (Recommended)**
   - Run the included lightweight server:
     ```bash
     node server.js
     ```
   - Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📁 Repository Structure

```
.
├── index.html                      # Main single-page application entry point
├── server.js                       # Lightweight local HTTP server
├── Books/                          # 6 Full-text downloadable standard textbook PDFs
├── css/
│   ├── style.css                   # Core design system (dark/light themes, typography, layout)
│   ├── learn.css                   # Pedagogical styling (boxes, definitions, exam corners)
│   └── responsive.css              # Adaptive small-screen and mobile navigation styles
├── js/
│   ├── app.js                      # Central application controller, routing, and search
│   ├── sql-playground.js           # In-browser WebAssembly SQL execution engine
│   ├── syllabus-data.js            # Base syllabus structure, glossary, and metadata
│   └── data/                       # Modular syllabus content, lecture notes, exam Q&A, and quizzes
│       ├── register.js
│       ├── unit-1-extras.js
│       ├── unit-2.js ... unit-2d.js
│       ├── unit-3.js ... unit-3c.js
│       ├── unit-4.js ... unit-4c.js
│       ├── unit-5.js ... unit-5b.js
│       └── unit-6.js ... unit-6b.js
├── images/                         # Academic figures, ER diagrams, and relational tables
├── normalization/                  # Normalization Practice Platform
│   ├── index.html                  # Practice portal interface and checklist modal
│   ├── style.css                   # Standalone responsive stylesheet
│   ├── app.js                      # Search, category filtering, and solution toggle logic
│   ├── questions.js                # 60 academic questions with point-wise step solutions
│   └── README.md                   # Dedicated normalization platform documentation
├── .github/
│   └── workflows/
│       └── pages.yml               # Automated GitHub Pages deployment workflow
└── README.md                       # Comprehensive documentation
```

---

## 📄 License

This educational repository is open source under the [MIT License](LICENSE). Contributions, suggestions, and feedback are welcome!
