/**
 * Unit 1 extras — the plain-language intro, exam corner, self-test quiz and
 * glossary terms for the existing Unit 1 topics (which live in
 * js/syllabus-data.js). No topic content is rewritten here.
 */

registerUnitExtras("unit-1", {
  simpleIntro: {
    heading: "What This Unit Is Really About",
    text: "<p>This unit answers one question: <strong>why do we need a database at all, and what is inside one?</strong></p><p>Before databases, every office kept its data in separate files, and every department kept its own copy of the same information. Addresses went out of date in one file but not another, two clerks editing at the same time overwrote each other, and a power cut could corrupt everything. A <strong>DBMS</strong> is the piece of software built to fix all of that at once.</p><p>The rest of the unit is about how a DBMS is organised inside — the three levels of description it keeps (<strong>three-schema architecture</strong>), the freedom that gives you to change one level without breaking the others (<strong>data independence</strong>), the different languages you use to talk to it (<strong>DDL, DML, DCL, TCL</strong>), and how the pieces are laid out across machines (<strong>1-tier, 2-tier and 3-tier architectures</strong>).</p>",
    goals: [
      "Define a database and a DBMS, and list the characteristics and advantages of the database approach.",
      "Name the different database users and say what each one does.",
      "Distinguish a data model, a schema and an instance.",
      "Draw and explain the ANSI/SPARC three-schema architecture and both kinds of data independence.",
      "Compare file processing systems with a DBMS across the standard points.",
      "Explain 1-tier, 2-tier and 3-tier client/server architectures.",
      "Classify DBMSs and describe the database system environment."
    ]
  },

  examCorner: {
    mustKnow: [
      "Definition of data, database, DBMS",
      "Characteristics of the database approach (self-describing, insulation, multiple views, sharing)",
      "Advantages of a DBMS over file systems",
      "Database users: DBA, designer, end user, application programmer",
      "Data model vs schema vs instance",
      "Three-schema architecture: internal, conceptual, external",
      "Logical and physical data independence",
      "Mappings between schema levels",
      "DDL, DML, DCL, TCL and their commands",
      "DBMS interfaces (menu-based, forms, GUI, natural language, DBA)",
      "1-tier, 2-tier and 3-tier architectures",
      "Classification of DBMSs (data model, users, sites, cost, purpose)",
      "ACID properties"
    ],
    questions: [
      {
        q: "What is a DBMS? Explain the main characteristics of the database approach.",
        marks: "8",
        a: "<p>A <strong>DBMS (Database Management System)</strong> is a collection of programs that enables users to create, maintain, query and control access to a database, while hiding the physical details of how data is stored.</p><p><strong>Main characteristics of the database approach:</strong></p><ul><li><strong>Self-describing nature</strong> — the DBMS stores not only the data but also a <em>catalog</em> (metadata) describing the structure, types and constraints of that data. A file system stores only the data.</li><li><strong>Insulation between programs and data</strong> — the structure of the data is stored in the catalog, not hard-coded in every program, so changing the storage structure does not force programs to be rewritten. This is <em>program–data independence</em>.</li><li><strong>Support of multiple views</strong> — different users see different subsets or arrangements of the same database, each through their own external view.</li><li><strong>Sharing of data and multi-user transaction processing</strong> — many users may access the database concurrently, with concurrency control ensuring correctness and isolation.</li></ul><p>Add the standard advantages: controlled redundancy, restricted unauthorised access, backup and recovery, enforcement of integrity constraints, and reduced application development time.</p>"
      },
      {
        q: "Explain the three-schema architecture with a neat diagram. How does it achieve data independence?",
        marks: "10",
        a: "<p>The <strong>ANSI/SPARC three-schema architecture</strong> separates a database description into three levels so that users are insulated from the physical storage.</p><ul><li><strong>Internal level (internal schema)</strong> — describes the <em>physical</em> storage structure: file organisation, indexes, compression, record placement. Closest to the hardware.</li><li><strong>Conceptual level (conceptual schema)</strong> — describes the structure of the <em>whole</em> database for the community of users: entities, data types, relationships and constraints, while hiding storage details.</li><li><strong>External level (external schemas / views)</strong> — describes the part of the database a <em>particular</em> user group is interested in, hiding the rest.</li></ul><p>The DBMS must <strong>map</strong> a request between the levels: external ↔ conceptual and conceptual ↔ internal.</p><p><strong>Data independence</strong> is the capacity to change a schema at one level without changing the schema at the next higher level:</p><ul><li><strong>Logical data independence</strong> — the ability to change the <em>conceptual</em> schema (e.g. add a new attribute or table) without changing external schemas or application programs.</li><li><strong>Physical data independence</strong> — the ability to change the <em>internal</em> schema (e.g. add an index, reorganise files) without changing the conceptual schema.</li></ul><p>Independence is achieved because only the <em>mapping</em> has to be changed, not the higher schema. Logical data independence is harder to achieve than physical.</p>"
      },
      {
        q: "Differentiate between a file processing system and a database management system.",
        marks: "8",
        a: "<p>Compare across these points (write them as a table):</p><ul><li><strong>Redundancy</strong> — file systems duplicate the same data in many departmental files; a DBMS controls redundancy through centralised storage and normalisation.</li><li><strong>Consistency</strong> — duplicated file data goes out of step; a DBMS enforces consistency.</li><li><strong>Data access</strong> — file systems need a custom program for every new query; a DBMS provides a declarative query language (SQL).</li><li><strong>Data isolation</strong> — file data is scattered across incompatible formats; a DBMS keeps it in one integrated structure.</li><li><strong>Integrity</strong> — file systems hard-code rules inside application programs; a DBMS enforces constraints centrally (PK, FK, CHECK, NOT NULL).</li><li><strong>Concurrency</strong> — file systems have no locking, so simultaneous writes cause lost updates; a DBMS provides concurrency control.</li><li><strong>Recovery</strong> — file systems have no crash recovery; a DBMS uses logging and checkpoints.</li><li><strong>Security</strong> — file systems rely on OS file permissions; a DBMS offers user accounts and privileges down to column level.</li><li><strong>Data independence</strong> — absent in file systems; provided by the DBMS at both logical and physical levels.</li></ul>"
      },
      {
        q: "Describe the different types of database users.",
        marks: "6",
        a: "<ul><li><strong>Database Administrator (DBA)</strong> — authorises access, coordinates and monitors use, acquires resources, and is responsible for security, performance and backup.</li><li><strong>Database Designers</strong> — identify the data to be stored, choose appropriate structures, and communicate with all user groups to build the conceptual schema.</li><li><strong>End Users</strong> — the people who access the database for querying and updating. Sub-types: <em>casual</em> users (occasional, ad-hoc queries), <em>naive/parametric</em> users (bank tellers, clerks — repeatedly run canned transactions), <em>sophisticated</em> users (engineers, analysts who write complex queries), and <em>standalone</em> users (maintain personal databases).</li><li><strong>System Analysts and Application Programmers</strong> — determine requirements and write, test and maintain the application programs that meet those requirements.</li></ul><p>Behind the scenes, add: DBMS system designers and implementers, tool developers, and operators and maintenance personnel.</p>"
      },
      {
        q: "Explain the different database languages with examples.",
        marks: "8",
        a: "<ul><li><strong>DDL (Data Definition Language)</strong> — defines and modifies the structure of database objects. Commands: <code>CREATE</code>, <code>ALTER</code>, <code>DROP</code>, <code>TRUNCATE</code>, <code>RENAME</code>. It updates the system catalog.</li><li><strong>DML (Data Manipulation Language)</strong> — retrieves and changes the data itself. Commands: <code>SELECT</code>, <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code>. DML may be <em>high-level/declarative</em> (set-at-a-time, like SQL) or <em>low-level/procedural</em> (record-at-a-time, embedded in a host language).</li><li><strong>DCL (Data Control Language)</strong> — controls access rights. Commands: <code>GRANT</code>, <code>REVOKE</code>.</li><li><strong>TCL (Transaction Control Language)</strong> — manages transactions. Commands: <code>COMMIT</code>, <code>ROLLBACK</code>, <code>SAVEPOINT</code>.</li></ul><p>You may also mention the <strong>SDL</strong> (storage definition language) for the internal schema and the <strong>VDL</strong> (view definition language) for external schemas, although in practice SQL combines all of these into one language.</p>"
      },
      {
        q: "Explain 2-tier and 3-tier client/server architectures for DBMSs.",
        marks: "8",
        a: "<p><strong>2-tier architecture:</strong> the application runs on the client machine and communicates directly with the database server using an API such as ODBC or JDBC. The client holds the user interface <em>and</em> the business logic; the server holds the data and query processing.</p><ul><li><em>Advantages:</em> simple, fast for a small number of users.</li><li><em>Disadvantages:</em> poor scalability (each client holds its own connection), business logic must be redeployed to every client, and the database is directly exposed to clients, which weakens security.</li></ul><p><strong>3-tier architecture:</strong> an application/business-logic server is inserted between the client and the database server.</p><ul><li><strong>Tier 1 — Presentation:</strong> the browser or thin client, showing the interface only.</li><li><strong>Tier 2 — Application/Business logic:</strong> processes rules, validates data, and forms the database queries.</li><li><strong>Tier 3 — Database:</strong> stores data and executes queries.</li></ul><p><em>Advantages:</em> better scalability (connection pooling), stronger security (the client never touches the database directly), and business logic is changed in one place. This is the architecture of virtually every modern web application.</p>"
      }
    ]
  },

  quiz: [
    {
      q: "The 'self-describing nature' of a database means that:",
      opts: [
        "The DBMS stores a catalog of metadata describing the data's structure and constraints",
        "The database explains its purpose to the user",
        "Every table has a description column",
        "The DBMS writes its own documentation"
      ],
      correct: 0,
      explain: "The system catalog (data dictionary) stores metadata — table names, data types, constraints. A file system stores data with no such description, which is why programs must hard-code the structure."
    },
    {
      q: "Which level of the three-schema architecture describes the physical storage structure?",
      opts: ["Internal level", "Conceptual level", "External level", "View level"],
      correct: 0,
      explain: "Internal = physical storage (files, indexes). Conceptual = the whole database's logical structure. External = individual user views."
    },
    {
      q: "The ability to change the conceptual schema without changing application programs is called:",
      opts: ["Logical data independence", "Physical data independence", "Program–data insulation", "Schema mapping"],
      correct: 0,
      explain: "Logical data independence protects external schemas from changes to the conceptual schema. Physical data independence protects the conceptual schema from storage changes."
    },
    {
      q: "Which of these is a DDL command?",
      opts: ["CREATE TABLE", "SELECT", "COMMIT", "GRANT"],
      correct: 0,
      explain: "CREATE/ALTER/DROP/TRUNCATE are DDL. SELECT is DML, COMMIT is TCL, and GRANT is DCL."
    },
    {
      q: "A bank teller who repeatedly runs the same 'deposit' and 'withdraw' transactions is which kind of user?",
      opts: ["Naive (parametric) end user", "Sophisticated end user", "Database administrator", "Database designer"],
      correct: 0,
      explain: "Naive or parametric users run canned transactions through a prepared interface. Sophisticated users write their own complex queries."
    },
    {
      q: "In 3-tier architecture, business logic is placed in:",
      opts: ["The application server (middle tier)", "The client browser", "The database server", "The operating system"],
      correct: 0,
      explain: "Separating business logic into a middle tier is what gives 3-tier its scalability and security advantage — the client never connects to the database directly."
    },
    {
      q: "The actual data stored in a database at a particular moment is called the:",
      opts: ["Instance (database state)", "Schema", "Data model", "Catalog"],
      correct: 0,
      explain: "The schema is the design and rarely changes; the instance is the content and changes with every INSERT, UPDATE and DELETE."
    },
    {
      q: "Which problem of file processing systems is caused by the same data being stored in several departmental files?",
      opts: ["Data redundancy and inconsistency", "Lack of a query language", "Absence of crash recovery", "Weak security"],
      correct: 0,
      explain: "Duplicated copies drift apart when only one is updated. A DBMS controls redundancy by storing each fact once in a central, normalised database."
    },
    {
      q: "Which ACID property guarantees that a transaction is executed either completely or not at all?",
      opts: ["Atomicity", "Consistency", "Isolation", "Durability"],
      correct: 0,
      explain: "Atomicity is the all-or-nothing rule. Durability guarantees that once committed, the changes survive a crash."
    },
    {
      q: "Mappings in the three-schema architecture are used to:",
      opts: [
        "Transform a request between the external, conceptual and internal levels",
        "Convert one data model into another",
        "Link two different databases",
        "Encrypt the stored data"
      ],
      correct: 0,
      explain: "When a schema changes, only the mapping needs to be rewritten. This indirection is exactly what makes data independence possible."
    }
  ]
});

registerGlossary("Unit 1", [
  ["Data", "Known raw facts that can be recorded and have an implicit meaning."],
  ["Database", "A collection of logically related data that represents some aspect of the real world."],
  ["DBMS", "Software that lets users define, construct, manipulate and share a database while hiding storage details."],
  ["Metadata", "Data about the data — descriptions of tables, types and constraints, stored in the system catalog."],
  ["System Catalog", "The DBMS's own store of metadata; what makes a database 'self-describing'."],
  ["Data Model", "A set of concepts used to describe the structure, operations and constraints of a database."],
  ["Schema", "The description or design of a database; it changes rarely."],
  ["Instance (Database State)", "The actual data stored at a particular moment; it changes constantly."],
  ["Internal Schema", "The physical storage description: file organisation, indexes, access paths."],
  ["Conceptual Schema", "The logical description of the whole database for the community of users."],
  ["External Schema (View)", "The part of the database visible to one particular user group."],
  ["Logical Data Independence", "The ability to change the conceptual schema without changing external schemas or programs."],
  ["Physical Data Independence", "The ability to change the internal schema without changing the conceptual schema."],
  ["DBA", "Database Administrator — responsible for authorisation, security, performance, backup and recovery."],
  ["DDL", "Data Definition Language: CREATE, ALTER, DROP, TRUNCATE — defines database structure."],
  ["DML", "Data Manipulation Language: SELECT, INSERT, UPDATE, DELETE — works with the data itself."],
  ["DCL", "Data Control Language: GRANT, REVOKE — controls access privileges."],
  ["TCL", "Transaction Control Language: COMMIT, ROLLBACK, SAVEPOINT."],
  ["2-Tier Architecture", "Client application talks directly to the database server via ODBC/JDBC."],
  ["3-Tier Architecture", "Presentation, application/business-logic and database tiers kept separate."]
]);
