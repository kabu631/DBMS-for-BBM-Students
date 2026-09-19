// =============================================================================
// DBMS Normalization Platform - 60 Comprehensive Questions & Solutions
// Categories:
//   1. closures-keys (Q1 - Q20): Functional Dependencies, Closures & Keys
//   2. 1nf-2nf       (Q21 - Q40): 1NF & 2NF Normalization (with explicit 1NF verification)
//   3. 3nf           (Q41 - Q60): 3NF Normalization (with explicit 1NF & 2NF verification)
// =============================================================================

const QUESTIONS_DATA = [
  {
    "id": 1,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Easy",
    "title": "Linear Chain Attribute Closure & Minimal Key",
    "relation": "R(A, B, C, D, E)",
    "fds": [
      "A → B",
      "B → C",
      "C → D",
      "D → E"
    ],
    "tasks": [
      "Compute the attribute closure A+ step-by-step.",
      "Determine whether A is a superkey and candidate key of R.",
      "State whether any smaller candidate key can exist."
    ],
    "solution": {
      "candidateKey": "A",
      "explanation": "Step 1: Start with basis {A}. Step 2: Apply A → B to get {A, B}. Step 3: Apply B → C to get {A, B, C}. Step 4: Apply C → D to get {A, B, C, D}. Step 5: Apply D → E to reach {A, B, C, D, E} = R. Because A+ contains all attributes of R, A is a superkey. Since A is a single attribute (cardinality 1), no proper non-empty subset can exist, making A a minimal candidate key.",
      "closureTable": {
        "headers": [
          "Iteration (i)",
          "Current Set X^(i)",
          "FD Applied",
          "Added Attribute",
          "Updated Set X^(i+1)"
        ],
        "rows": [
          [
            "0",
            "{A}",
            "Initial Basis",
            "—",
            "{A}"
          ],
          [
            "1",
            "{A}",
            "A → B",
            "{B}",
            "{A, B}"
          ],
          [
            "2",
            "{A, B}",
            "B → C",
            "{C}",
            "{A, B, C}"
          ],
          [
            "3",
            "{A, B, C}",
            "C → D",
            "{D}",
            "{A, B, C, D}"
          ],
          [
            "4",
            "{A, B, C, D}",
            "D → E",
            "{E}",
            "{A, B, C, D, E} = R"
          ]
        ]
      },
      "keyTakeaway": "A singleton attribute whose closure equals R is mathematically guaranteed to be a minimal candidate key.",
      "steps": [
        {
          "num": "1",
          "title": "Step 1",
          "points": [
            "Start with basis {A}."
          ]
        },
        {
          "num": "2",
          "title": "Step 2",
          "points": [
            "Apply A → B to get {A, B}."
          ]
        },
        {
          "num": "3",
          "title": "Step 3",
          "points": [
            "Apply B → C to get {A, B, C}."
          ]
        },
        {
          "num": "4",
          "title": "Step 4",
          "points": [
            "Apply C → D to get {A, B, C, D}."
          ]
        },
        {
          "num": "5",
          "title": "Step 5",
          "points": [
            "Apply D → E to reach {A, B, C, D, E} = R.",
            "Because A+ contains all attributes of R, A is a superkey.",
            "Since A is a single attribute (cardinality 1), no proper non-empty subset can exist, making A a minimal candidate key."
          ]
        }
      ]
    }
  },
  {
    "id": 2,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Easy",
    "title": "Branched Dependencies & Attribute Closure",
    "relation": "R(A, B, C, D)",
    "fds": [
      "A → B",
      "A → C",
      "C → D"
    ],
    "tasks": [
      "Calculate the closure A+.",
      "Calculate the closure C+.",
      "Identify the minimal candidate key."
    ],
    "solution": {
      "candidateKey": "A",
      "explanation": "A determines B and C directly, and C subsequently determines D. Thus A+ = {A, B, C, D} = R. On the other hand, C+ = {C, D} ≠ R, so C is not a superkey. Since A never appears on the RHS of any FD, A must be part of every candidate key.",
      "closureTable": {
        "headers": [
          "Attribute Set",
          "Step-by-Step Expansion",
          "Closure Result (X+)",
          "Is Candidate Key?"
        ],
        "rows": [
          [
            "{A}",
            "A^(0)={A} → A^(1)={A,B,C} (via A→B, A→C) → A^(2)={A,B,C,D} (via C→D)",
            "{A, B, C, D} = R",
            "YES (Unique Minimal Key)"
          ],
          [
            "{C}",
            "C^(0)={C} → C^(1)={C,D} (via C→D, no other FD applies)",
            "{C, D}",
            "NO (Incomplete closure)"
          ]
        ]
      },
      "keyTakeaway": "Attributes that never appear on the right-hand side of any FD must be present in every candidate key.",
      "steps": [
        {
          "num": null,
          "title": "Key Solution Steps",
          "points": [
            "A determines B and C directly, and C subsequently determines D.",
            "Thus A+ = {A, B, C, D} = R.",
            "On the other hand, C+ = {C, D} ≠ R, so C is not a superkey.",
            "Since A never appears on the RHS of any FD, A must be part of every candidate key."
          ]
        }
      ]
    }
  },
  {
    "id": 3,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Easy",
    "title": "Essential Attribute Discovery via RHS Analysis",
    "relation": "R(A, B, C, D, E)",
    "fds": [
      "A → B",
      "B → C",
      "CD → E"
    ],
    "tasks": [
      "Identify all attributes absent from the right-hand side (RHS) of all FDs.",
      "Compute closures of {A} and {A, D}.",
      "State the unique candidate key."
    ],
    "solution": {
      "candidateKey": "AD",
      "explanation": "RHS attributes = {B, C, E}. Attributes absent from the RHS = {A, D}. Because no FD can generate A or D, {A, D} must be present in every candidate key. Computing AD+ produces all attributes {A, B, C, D, E} = R, making AD the unique minimal candidate key.",
      "closureTable": {
        "headers": [
          "Attribute Set",
          "Step-by-Step Expansion",
          "Closure (X+)",
          "Is Candidate Key?"
        ],
        "rows": [
          [
            "{A}",
            "A^(0)={A} → A^(1)={A,B} → A^(2)={A,B,C} (stuck without D)",
            "{A, B, C}",
            "NO (Missing D and E)"
          ],
          [
            "{A, D}",
            "AD^(0)={A,D} → AD^(1)={A,B,D} → AD^(2)={A,B,C,D} → AD^(3)={A,B,C,D,E} = R",
            "{A, B, C, D, E} = R",
            "YES (Unique Minimal Key)"
          ]
        ]
      },
      "keyTakeaway": "Essential attributes (never appearing on the RHS) are the required core of any candidate key.",
      "steps": [
        {
          "num": null,
          "title": "Key Solution Steps",
          "points": [
            "RHS attributes = {B, C, E}.",
            "Attributes absent from the RHS = {A, D}.",
            "Because no FD can generate A or D, {A, D} must be present in every candidate key.",
            "Computing AD+ produces all attributes {A, B, C, D, E} = R, making AD the unique minimal candidate key."
          ]
        }
      ]
    }
  },
  {
    "id": 4,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Medium",
    "title": "Candidate Key Discovery with Composite FDs",
    "relation": "R(A, B, C, D, E)",
    "fds": [
      "AB → C",
      "C → D",
      "D → E",
      "E → A"
    ],
    "tasks": [
      "Identify essential attributes not on RHS.",
      "Compute closures of {A, B}, {B, C}, {B, D}, and {B, E}.",
      "Enumerate all candidate keys."
    ],
    "solution": {
      "candidateKey": "AB, BC, BD, BE",
      "explanation": "RHS attributes = {A, C, D, E}. Attribute B never appears on the RHS, so B must be part of every candidate key. Because {B}+ = {B} ≠ R, we combine B with other attributes. Testing pairs reveals a cyclic chain: AB → C → D → E → A, producing 4 equivalent candidate keys: AB, BC, BD, and BE.",
      "closureTable": {
        "headers": [
          "Candidate Set",
          "Derivation Steps",
          "Closure Result",
          "Candidate Key?"
        ],
        "rows": [
          [
            "{A, B}",
            "AB^(0)={A,B} → {A,B,C} → {A,B,C,D} → {A,B,C,D,E} = R",
            "{A, B, C, D, E} = R",
            "YES (Candidate Key)"
          ],
          [
            "{B, C}",
            "BC^(0)={B,C} → {B,C,D} → {B,C,D,E} → {A,B,C,D,E} = R",
            "{A, B, C, D, E} = R",
            "YES (Candidate Key)"
          ],
          [
            "{B, D}",
            "BD^(0)={B,D} → {B,D,E} → {A,B,D,E} → {A,B,C,D,E} = R",
            "{A, B, C, D, E} = R",
            "YES (Candidate Key)"
          ],
          [
            "{B, E}",
            "BE^(0)={B,E} → {A,B,E} → {A,B,C,E} → {A,B,C,D,E} = R",
            "{A, B, C, D, E} = R",
            "YES (Candidate Key)"
          ]
        ]
      },
      "keyTakeaway": "When non-RHS attributes combine with a cyclic dependency chain, multiple overlapping candidate keys are formed.",
      "steps": [
        {
          "num": null,
          "title": "Key Solution Steps",
          "points": [
            "RHS attributes = {A, C, D, E}.",
            "Attribute B never appears on the RHS, so B must be part of every candidate key.",
            "Because {B}+ = {B} ≠ R, we combine B with other attributes.",
            "Testing pairs reveals a cyclic chain: AB → C → D → E → A, producing 4 equivalent candidate keys: AB, BC, BD, and BE."
          ]
        }
      ]
    }
  },
  {
    "id": 5,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Easy",
    "title": "Circular Functional Dependencies & Dual Candidate Keys",
    "relation": "R(A, B, C, D)",
    "fds": [
      "A → B",
      "B → C",
      "C → D",
      "D → A"
    ],
    "tasks": [
      "Compute the closure of each individual singleton attribute.",
      "Identify all candidate keys.",
      "Classify prime vs. non-prime attributes."
    ],
    "solution": {
      "candidateKey": "A, B, C, D (4 separate keys)",
      "explanation": "Every attribute determines the next in a closed cycle: A → B → C → D → A. Therefore, each individual attribute produces the full relation R in its closure: A+ = B+ = C+ = D+ = R. Each is a separate minimal candidate key. Since every attribute belongs to at least one candidate key, all attributes are prime.",
      "closureTable": {
        "headers": [
          "Attribute",
          "Closure Derivation",
          "Closure Set",
          "Key Status"
        ],
        "rows": [
          [
            "A",
            "A → B → C → D → A",
            "{A, B, C, D} = R",
            "Candidate Key #1"
          ],
          [
            "B",
            "B → C → D → A → B",
            "{A, B, C, D} = R",
            "Candidate Key #2"
          ],
          [
            "C",
            "C → D → A → B → C",
            "{A, B, C, D} = R",
            "Candidate Key #3"
          ],
          [
            "D",
            "D → A → B → C → D",
            "{A, B, C, D} = R",
            "Candidate Key #4"
          ]
        ]
      },
      "keyTakeaway": "In a pure circular dependency graph, every node is an individual minimal candidate key and there are zero non-prime attributes.",
      "steps": [
        {
          "num": null,
          "title": "Key Solution Steps",
          "points": [
            "Every attribute determines the next in a closed cycle: A → B → C → D → A.",
            "Therefore, each individual attribute produces the full relation R in its closure: A+ = B+ = C+ = D+ = R.",
            "Each is a separate minimal candidate key.",
            "Since every attribute belongs to at least one candidate key, all attributes are prime."
          ]
        }
      ]
    }
  },
  {
    "id": 6,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Medium",
    "title": "Overlapping Composite Candidate Keys",
    "relation": "R(A, B, C, D)",
    "fds": [
      "AB → C",
      "C → D",
      "D → B"
    ],
    "tasks": [
      "Identify essential non-RHS attributes.",
      "Compute closures of {A, B}, {A, C}, and {A, D}.",
      "List all candidate keys."
    ],
    "solution": {
      "candidateKey": "AB, AC, AD",
      "explanation": "Attribute A never appears on the RHS of any FD, so A must belong to every candidate key. A alone gives A+ = {A} ≠ R. Testing pairs containing A: AB+ = {A,B,C,D}=R; AC+ = {A,C,D,B}=R; AD+ = {A,D,B,C}=R. All three are minimal candidate keys. Prime attributes = {A, B, C, D}; Non-prime = ∅.",
      "closureTable": {
        "headers": [
          "Candidate Set",
          "Iterative Expansion",
          "Closure (X+)",
          "Status"
        ],
        "rows": [
          [
            "{A, B}",
            "AB → {A,B,C} → {A,B,C,D} = R",
            "{A, B, C, D} = R",
            "Candidate Key #1"
          ],
          [
            "{A, C}",
            "AC → {A,C,D} → {A,C,D,B} = R",
            "{A, B, C, D} = R",
            "Candidate Key #2"
          ],
          [
            "{A, D}",
            "AD → {A,D,B} → {A,D,B,C} = R",
            "{A, B, C, D} = R",
            "Candidate Key #3"
          ]
        ]
      },
      "keyTakeaway": "When a non-RHS attribute pairs with an interchangeable cycle (B → C → D → B), multiple composite candidate keys share the essential attribute.",
      "steps": [
        {
          "num": null,
          "title": "Key Solution Steps",
          "points": [
            "Attribute A never appears on the RHS of any FD, so A must belong to every candidate key.",
            "A alone gives A+ = {A} ≠ R.",
            "Testing pairs containing A: AB+ = {A,B,C,D}=R; AC+ = {A,C,D,B}=R; AD+ = {A,D,B,C}=R.",
            "All three are minimal candidate keys.",
            "Prime attributes = {A, B, C, D}; Non-prime = ∅."
          ]
        }
      ]
    }
  },
  {
    "id": 7,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Medium",
    "title": "Independent Determinants with Isolated Attributes",
    "relation": "R(A, B, C, D, E, F)",
    "fds": [
      "A → B",
      "BC → D",
      "E → C",
      "D → A"
    ],
    "tasks": [
      "Find attributes that never appear on the RHS.",
      "Identify candidate keys.",
      "Explain the role of attribute F."
    ],
    "solution": {
      "candidateKey": "EF, BCEF, BDEF",
      "explanation": "Attributes E and F never appear on the RHS. F does not appear anywhere in the FDs (it is completely independent/isolated). Therefore, every candidate key must contain both E and F. Evaluating {A, E, F}+: AEF+ = {A,B,C,D,E,F} = R. Minimal candidate keys are AEF, BCEF, BDEF.",
      "closureTable": {
        "headers": [
          "Tested Set",
          "Expansion Steps",
          "Closure Result",
          "Key Decision"
        ],
        "rows": [
          [
            "{E, F}",
            "EF^(0)={E,F} → EF^(1)={C,E,F} (via E→C)",
            "{C, E, F} ≠ R",
            "Not a superkey"
          ],
          [
            "{A, E, F}",
            "AEF^(0)={A,E,F} → {A,B,E,F} → {A,B,C,E,F} → {A,B,C,D,E,F}=R",
            "{A, B, C, D, E, F} = R",
            "Candidate Key (Minimal)"
          ],
          [
            "{B, C, E, F}",
            "BCEF^(0)={B,C,E,F} → {B,C,D,E,F} → {A,B,C,D,E,F}=R",
            "{A, B, C, D, E, F} = R",
            "Candidate Key (Minimal)"
          ]
        ]
      },
      "keyTakeaway": "Any attribute that does not participate in any functional dependency must be included in every candidate key.",
      "steps": [
        {
          "num": null,
          "title": "Key Solution Steps",
          "points": [
            "Attributes E and F never appear on the RHS.",
            "F does not appear anywhere in the FDs (it is completely independent/isolated).",
            "Therefore, every candidate key must contain both E and F.",
            "Evaluating {A, E, F}+: AEF+ = {A,B,C,D,E,F} = R.",
            "Minimal candidate keys are AEF, BCEF, BDEF."
          ]
        }
      ]
    }
  },
  {
    "id": 8,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Easy",
    "title": "Finding Candidate Keys with Neutral Attributes",
    "relation": "R(A, B, C, D, E)",
    "fds": [
      "A → B",
      "B → C",
      "C → A",
      "D → E"
    ],
    "tasks": [
      "Identify all essential attributes.",
      "Compute candidate keys of R.",
      "Explain why D must be in every key."
    ],
    "solution": {
      "candidateKey": "AD, BD, CD",
      "explanation": "Attribute D never appears on the RHS of any FD, so D must be in every candidate key. {D}+ = {D, E} ≠ R. Combining D with cycle {A, B, C}: AD+ = {A,B,C,D,E} = R; BD+ = {A,B,C,D,E} = R; CD+ = {A,B,C,D,E} = R. Candidate keys are AD, BD, and CD.",
      "closureTable": {
        "headers": [
          "Set",
          "Expansion Steps",
          "Closure (X+)",
          "Candidate Key?"
        ],
        "rows": [
          [
            "{A, D}",
            "AD^(0)={A,D} → {A,B,D} → {A,B,C,D} → {A,B,C,D,E} = R",
            "{A, B, C, D, E} = R",
            "YES (Candidate Key)"
          ],
          [
            "{B, D}",
            "BD^(0)={B,D} → {B,C,D} → {A,B,C,D} → {A,B,C,D,E} = R",
            "{A, B, C, D, E} = R",
            "YES (Candidate Key)"
          ],
          [
            "{C, D}",
            "CD^(0)={C,D} → {A,C,D} → {A,B,C,D} → {A,B,C,D,E} = R",
            "{A, B, C, D, E} = R",
            "YES (Candidate Key)"
          ]
        ]
      },
      "keyTakeaway": "When a disconnected determinant (D → E) exists, its non-RHS determinant (D) must combine with the primary entity keys.",
      "steps": [
        {
          "num": null,
          "title": "Key Solution Steps",
          "points": [
            "Attribute D never appears on the RHS of any FD, so D must be in every candidate key. {D}+ = {D, E} ≠ R.",
            "Combining D with cycle {A, B, C}: AD+ = {A,B,C,D,E} = R; BD+ = {A,B,C,D,E} = R; CD+ = {A,B,C,D,E} = R.",
            "Candidate keys are AD, BD, and CD."
          ]
        }
      ]
    }
  },
  {
    "id": 9,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Medium",
    "title": "Extraneous Attribute Testing in Left-Hand Side",
    "relation": "R(A, B, C, D)",
    "fds": [
      "AB → C",
      "A → D",
      "D → B"
    ],
    "tasks": [
      "Test whether B is extraneous in AB → C.",
      "Compute closure of A+ before and after removing B.",
      "State the minimal candidate key."
    ],
    "solution": {
      "candidateKey": "A",
      "explanation": "To test if B is extraneous in AB → C, compute A+ under the given FDs: A^(0)={A} → A^(1)={A, D} (via A → D) → A^(2)={A, B, D} (via D → B). Because A+ already includes B, A can derive B independently. Thus AB → C reduces to A → C. B is extraneous. A+ = {A, B, C, D} = R, so A is the unique minimal candidate key.",
      "closureTable": {
        "headers": [
          "Test",
          "Closure Computation",
          "Result",
          "Conclusion"
        ],
        "rows": [
          [
            "A+ without AB→C",
            "A^(0)={A} → {A,D} (via A→D) → {A,B,D} (via D→B)",
            "{A, B, D} contains B",
            "B is extraneous in AB → C"
          ],
          [
            "A+ with simplified FDs",
            "A^(0)={A} → {A,B,D} → {A,B,C,D} = R",
            "{A, B, C, D} = R",
            "A is the minimal candidate key"
          ]
        ]
      },
      "keyTakeaway": "If the remaining LHS attributes can already derive the candidate attribute, that attribute is extraneous and must be dropped.",
      "steps": [
        {
          "num": "0",
          "title": "Point 0",
          "points": [
            "={A} → A^"
          ]
        },
        {
          "num": "1",
          "title": "Point 1",
          "points": [
            "={A, D} (via A → D) → A^"
          ]
        },
        {
          "num": "2",
          "title": "Point 2",
          "points": [
            "={A, B, D} (via D → B).",
            "Because A+ already includes B, A can derive B independently.",
            "Thus AB → C reduces to A → C.",
            "B is extraneous.",
            "A+ = {A, B, C, D} = R, so A is the unique minimal candidate key."
          ]
        }
      ]
    }
  },
  {
    "id": 10,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Medium",
    "title": "Redundant Functional Dependency Elimination",
    "relation": "R(A, B, C, D)",
    "fds": [
      "A → B",
      "B → C",
      "A → C",
      "C → D"
    ],
    "tasks": [
      "Determine which FD is redundant.",
      "Prove redundancy using attribute closure.",
      "Identify the candidate key."
    ],
    "solution": {
      "candidateKey": "A",
      "explanation": "To test if A → C is redundant, remove it and calculate A+ using the remaining FDs {A → B, B → C, C → D}. A^(0)={A} → {A, B} (via A → B) → {A, B, C} (via B → C). Because C is derived without A → C, the FD A → C is redundant by transitivity. The canonical minimal key is A.",
      "closureTable": {
        "headers": [
          "Tested FD",
          "Remaining FDs",
          "Closure of Determinant",
          "Status"
        ],
        "rows": [
          [
            "A → C",
            "{A → B, B → C, C → D}",
            "A+ = {A, B, C, D} = R (derives C)",
            "REDUNDANT (Can be safely deleted)"
          ],
          [
            "A → B",
            "{B → C, C → D}",
            "A+ = {A} (cannot derive B)",
            "ESSENTIAL (Cannot be deleted)"
          ],
          [
            "B → C",
            "{A → B, C → D}",
            "B+ = {B} (cannot derive C)",
            "ESSENTIAL (Cannot be deleted)"
          ]
        ]
      },
      "keyTakeaway": "An FD X → Y is redundant if Y is contained within X+ computed using F - {X → Y}.",
      "steps": [
        {
          "num": null,
          "title": "Key Solution Steps",
          "points": [
            "To test if A → C is redundant, remove it and calculate A+ using the remaining FDs {A → B, B → C, C → D}.",
            "A^(0)={A} → {A, B} (via A → B) → {A, B, C} (via B → C).",
            "Because C is derived without A → C, the FD A → C is redundant by transitivity.",
            "The canonical minimal key is A."
          ]
        }
      ]
    }
  },
  {
    "id": 11,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Medium",
    "title": "Prime vs. Non-Prime Attribute Classification",
    "relation": "R(A, B, C, D, E)",
    "fds": [
      "AB → C",
      "C → D",
      "D → E",
      "E → A"
    ],
    "tasks": [
      "Find all candidate keys of R.",
      "List all prime attributes.",
      "List all non-prime attributes."
    ],
    "solution": {
      "candidateKey": "AB, BC, BD, BE",
      "explanation": "B is absent from all RHS attributes, so B must be in every key. Testing closures: AB+ = R, BC+ = R, BD+ = R, BE+ = R. Thus the candidate keys are AB, BC, BD, and BE. Prime attributes = {A, B, C, D, E} (all 5 attributes belong to at least one candidate key). Non-prime attributes = ∅ (empty set).",
      "closureTable": {
        "headers": [
          "Candidate Key",
          "Attributes in Key",
          "Closure Result",
          "Prime Attributes Contributed"
        ],
        "rows": [
          [
            "AB",
            "{A, B}",
            "{A, B, C, D, E} = R",
            "A, B"
          ],
          [
            "BC",
            "{B, C}",
            "{A, B, C, D, E} = R",
            "B, C"
          ],
          [
            "BD",
            "{B, D}",
            "{A, B, C, D, E} = R",
            "B, D"
          ],
          [
            "BE",
            "{B, E}",
            "{A, B, C, D, E} = R",
            "B, E"
          ]
        ]
      },
      "keyTakeaway": "An attribute is prime if it belongs to ANY candidate key of the relation, even if it is not in every key.",
      "steps": [
        {
          "num": null,
          "title": "Key Solution Steps",
          "points": [
            "B is absent from all RHS attributes, so B must be in every key.",
            "Testing closures: AB+ = R, BC+ = R, BD+ = R, BE+ = R.",
            "Thus the candidate keys are AB, BC, BD, and BE.",
            "Prime attributes = {A, B, C, D, E} (all 5 attributes belong to at least one candidate key).",
            "Non-prime attributes = ∅ (empty set)."
          ]
        }
      ]
    }
  },
  {
    "id": 12,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Medium",
    "title": "Equivalence of Two Sets of Functional Dependencies",
    "relation": "R(A, B, C)",
    "fds": [
      "Set F: {A → B, B → C, A → C}",
      "Set G: {A → B, B → C}"
    ],
    "tasks": [
      "Test if F covers G (G ⊆ F+).",
      "Test if G covers F (F ⊆ G+).",
      "Conclude whether F ≡ G and state the candidate key."
    ],
    "solution": {
      "candidateKey": "A",
      "explanation": "To prove F ≡ G: (1) All FDs in G are already in F, so F covers G. (2) For FDs in F: A → B is in G, B → C is in G. For A → C, compute A+ under G: A+ = {A, B, C}, which contains C. Thus G covers F. Therefore F ≡ G. A is the unique candidate key.",
      "closureTable": {
        "headers": [
          "FD in F",
          "Determinant",
          "Closure under G",
          "Covered?"
        ],
        "rows": [
          [
            "A → B",
            "A",
            "A+ = {A, B, C}",
            "YES"
          ],
          [
            "B → C",
            "B",
            "B+ = {B, C}",
            "YES"
          ],
          [
            "A → C",
            "A",
            "A+ = {A, B, C}",
            "YES (Transitive)"
          ]
        ]
      },
      "keyTakeaway": "Two FD sets are equivalent (F ≡ G) if and only if each set covers all functional dependencies of the other.",
      "steps": [
        {
          "num": "1",
          "title": "Point 1",
          "points": [
            "All FDs in G are already in F, so F covers G."
          ]
        },
        {
          "num": "2",
          "title": "Point 2",
          "points": [
            "For FDs in F: A → B is in G, B → C is in G.",
            "For A → C, compute A+ under G: A+ = {A, B, C}, which contains C.",
            "Thus G covers F.",
            "Therefore F ≡ G.",
            "A is the unique candidate key."
          ]
        }
      ]
    }
  },
  {
    "id": 13,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Easy",
    "title": "Closure Verification for Candidate Key Sufficiency",
    "relation": "R(A, B, C, D, E)",
    "fds": [
      "A → BC",
      "CD → E",
      "B → D"
    ],
    "tasks": [
      "Compute closure of {A}.",
      "Compute closure of {A, D}.",
      "Determine whether A alone is a candidate key."
    ],
    "solution": {
      "candidateKey": "A",
      "explanation": "Step 1: A^(0) = {A}. Step 2: A → BC gives {A, B, C}. Step 3: B → D gives {A, B, C, D}. Step 4: CD → E applies because {C, D} ⊆ {A, B, C, D}, giving {A, B, C, D, E} = R. Because A+ = R and A is a singleton, A alone is a candidate key.",
      "closureTable": {
        "headers": [
          "Iteration",
          "Current Set",
          "FD Triggered",
          "Attributes Added",
          "Updated Set"
        ],
        "rows": [
          [
            "0",
            "{A}",
            "Initial Basis",
            "—",
            "{A}"
          ],
          [
            "1",
            "{A}",
            "A → BC",
            "{B, C}",
            "{A, B, C}"
          ],
          [
            "2",
            "{A, B, C}",
            "B → D",
            "{D}",
            "{A, B, C, D}"
          ],
          [
            "3",
            "{A, B, C, D}",
            "CD → E",
            "{E}",
            "{A, B, C, D, E} = R"
          ]
        ]
      },
      "keyTakeaway": "Multi-attribute RHS dependencies (A → BC) expand the closure rapidly and enable downstream composite determinants (CD → E).",
      "steps": [
        {
          "num": "1",
          "title": "Step 1",
          "points": [
            "A^(0) = {A}."
          ]
        },
        {
          "num": "2",
          "title": "Step 2",
          "points": [
            "A → BC gives {A, B, C}."
          ]
        },
        {
          "num": "3",
          "title": "Step 3",
          "points": [
            "B → D gives {A, B, C, D}."
          ]
        },
        {
          "num": "4",
          "title": "Step 4",
          "points": [
            "CD → E applies because {C, D} ⊆ {A, B, C, D}, giving {A, B, C, D, E} = R.",
            "Because A+ = R and A is a singleton, A alone is a candidate key."
          ]
        }
      ]
    }
  },
  {
    "id": 14,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Hard",
    "title": "Multiple Overlapping Attributes in Determinants",
    "relation": "R(A, B, C, D, E)",
    "fds": [
      "AB → C",
      "BC → D",
      "CD → E",
      "DE → A",
      "EA → B"
    ],
    "tasks": [
      "Compute the closures of {A, B}, {B, C}, {C, D}, {D, E}, and {E, A}.",
      "Identify all candidate keys.",
      "Verify whether any singleton attribute is a superkey."
    ],
    "solution": {
      "candidateKey": "AB, BC, CD, DE, EA",
      "explanation": "No singleton attribute can trigger any FD (all determinants have 2 attributes). Thus no singleton is a superkey. Testing pairs: AB+ = {A,B,C,D,E} = R; BC+ = R; CD+ = R; DE+ = R; EA+ = R. These 5 pairs form a symmetrical cyclic ring of candidate keys.",
      "closureTable": {
        "headers": [
          "Pair",
          "Closure Expansion Steps",
          "Closure Result",
          "Key Decision"
        ],
        "rows": [
          [
            "{A, B}",
            "AB → {A,B,C} → {A,B,C,D} → {A,B,C,D,E} = R",
            "{A, B, C, D, E} = R",
            "Candidate Key #1"
          ],
          [
            "{B, C}",
            "BC → {B,C,D} → {B,C,D,E} → {A,B,C,D,E} = R",
            "{A, B, C, D, E} = R",
            "Candidate Key #2"
          ],
          [
            "{C, D}",
            "CD → {C,D,E} → {A,C,D,E} → {A,B,C,D,E} = R",
            "{A, B, C, D, E} = R",
            "Candidate Key #3"
          ],
          [
            "{D, E}",
            "DE → {A,D,E} → {A,B,D,E} → {A,B,C,D,E} = R",
            "{A, B, C, D, E} = R",
            "Candidate Key #4"
          ],
          [
            "{E, A}",
            "EA → {A,B,E} → {A,B,C,E} → {A,B,C,D,E} = R",
            "{A, B, C, D, E} = R",
            "Candidate Key #5"
          ]
        ]
      },
      "keyTakeaway": "In symmetric composite cyclic dependency structures, the number of candidate keys equals the cycle length.",
      "steps": [
        {
          "num": null,
          "title": "Key Solution Steps",
          "points": [
            "No singleton attribute can trigger any FD (all determinants have 2 attributes).",
            "Thus no singleton is a superkey.",
            "Testing pairs: AB+ = {A,B,C,D,E} = R; BC+ = R; CD+ = R; DE+ = R; EA+ = R.",
            "These 5 pairs form a symmetrical cyclic ring of candidate keys."
          ]
        }
      ]
    }
  },
  {
    "id": 15,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Easy",
    "title": "Closure with No Functional Dependencies",
    "relation": "R(A, B, C, D)",
    "fds": [
      "(Empty Set of Dependencies: F = ∅)"
    ],
    "tasks": [
      "Compute closure for any single attribute.",
      "Determine candidate keys.",
      "Explain the candidate key rule when F = ∅."
    ],
    "solution": {
      "candidateKey": "(A, B, C, D)",
      "explanation": "When F = ∅, no attribute can functionally determine any other attribute. For any subset X ⊂ R, X+ = X. The only attribute set whose closure equals R is the full set of attributes {A, B, C, D}. Thus the entire relation is the unique candidate key.",
      "closureTable": {
        "headers": [
          "Subset",
          "Closure (X+)",
          "Equals R?",
          "Candidate Key?"
        ],
        "rows": [
          [
            "{A}",
            "{A}",
            "NO",
            "NO"
          ],
          [
            "{A, B}",
            "{A, B}",
            "NO",
            "NO"
          ],
          [
            "{A, B, C}",
            "{A, B, C}",
            "NO",
            "NO"
          ],
          [
            "{A, B, C, D}",
            "{A, B, C, D}",
            "YES (= R)",
            "YES (All-Key Relation)"
          ]
        ]
      },
      "keyTakeaway": "When a table has zero non-trivial functional dependencies, the entire set of attributes forms the candidate key (an All-Key relation).",
      "steps": [
        {
          "num": null,
          "title": "Key Solution Steps",
          "points": [
            "When F = ∅, no attribute can functionally determine any other attribute.",
            "For any subset X ⊂ R, X+ = X.",
            "The only attribute set whose closure equals R is the full set of attributes {A, B, C, D}.",
            "Thus the entire relation is the unique candidate key."
          ]
        }
      ]
    }
  },
  {
    "id": 16,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Medium",
    "title": "Candidate Keys in Cyclic Structure with Feeder Dependency",
    "relation": "R(A, B, C, D)",
    "fds": [
      "A → B",
      "B → C",
      "C → A",
      "D → C"
    ],
    "tasks": [
      "Find attributes absent from RHS.",
      "Compute closures of {A, D}, {B, D}, and {C, D}.",
      "Enumerate all candidate keys."
    ],
    "solution": {
      "candidateKey": "D",
      "explanation": "Attribute D never appears on the RHS, so D must be present in every candidate key. Computing D+: D^(0)={D} → D^(1)={C, D} (via D → C) → D^(2)={A, C, D} (via C → A) → D^(3)={A, B, C, D} = R (via A → B). Because D alone produces R, D is the unique minimal candidate key!",
      "closureTable": {
        "headers": [
          "Step",
          "Current Set",
          "FD Applied",
          "Added Attributes",
          "Updated Closure"
        ],
        "rows": [
          [
            "0",
            "{D}",
            "Initial Basis",
            "—",
            "{D}"
          ],
          [
            "1",
            "{D}",
            "D → C",
            "{C}",
            "{C, D}"
          ],
          [
            "2",
            "{C, D}",
            "C → A",
            "{A}",
            "{A, C, D}"
          ],
          [
            "3",
            "{A, C, D}",
            "A → B",
            "{B}",
            "{A, B, C, D} = R"
          ]
        ]
      },
      "keyTakeaway": "A feeder dependency (D → C) into an existing cycle allows the external determinant (D) to generate the entire cyclic relation.",
      "steps": [
        {
          "num": "0",
          "title": "Point 0",
          "points": [
            "={D} → D^"
          ]
        },
        {
          "num": "1",
          "title": "Point 1",
          "points": [
            "={C, D} (via D → C) → D^"
          ]
        },
        {
          "num": "2",
          "title": "Point 2",
          "points": [
            "={A, C, D} (via C → A) → D^"
          ]
        },
        {
          "num": "3",
          "title": "Point 3",
          "points": [
            "={A, B, C, D} = R (via A → B).",
            "Because D alone produces R, D is the unique minimal candidate key!"
          ]
        }
      ]
    }
  },
  {
    "id": 17,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Easy",
    "title": "Splitting Multi-Attribute Right-Hand Side",
    "relation": "R(A, B, C, D, E)",
    "fds": [
      "A → BCD",
      "C → E"
    ],
    "tasks": [
      "Decompose A → BCD using Armstrong's Decomposition Rule.",
      "Compute closure A+.",
      "State candidate key."
    ],
    "solution": {
      "candidateKey": "A",
      "explanation": "By Armstrong's Decomposition Axiom, A → BCD is equivalent to {A → B, A → C, A → D}. Computing A+: A^(0)={A} → A^(1)={A, B, C, D} (via A → BCD) → A^(2)={A, B, C, D, E} = R (via C → E). A is the unique minimal candidate key.",
      "closureTable": {
        "headers": [
          "Iteration",
          "Current Set",
          "FD Applied",
          "Added",
          "New Set"
        ],
        "rows": [
          [
            "0",
            "{A}",
            "Initial Basis",
            "—",
            "{A}"
          ],
          [
            "1",
            "{A}",
            "A → BCD",
            "{B, C, D}",
            "{A, B, C, D}"
          ],
          [
            "2",
            "{A, B, C, D}",
            "C → E",
            "{E}",
            "{A, B, C, D, E} = R"
          ]
        ]
      },
      "keyTakeaway": "Multi-attribute RHS rules can always be decomposed into individual dependencies: X → YZ ⇔ {X → Y, X → Z}.",
      "steps": [
        {
          "num": "0",
          "title": "Point 0",
          "points": [
            "={A} → A^"
          ]
        },
        {
          "num": "1",
          "title": "Point 1",
          "points": [
            "={A, B, C, D} (via A → BCD) → A^"
          ]
        },
        {
          "num": "2",
          "title": "Point 2",
          "points": [
            "={A, B, C, D, E} = R (via C → E).",
            "A is the unique minimal candidate key."
          ]
        }
      ]
    }
  },
  {
    "id": 18,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Medium",
    "title": "Armstrong's Axioms Verification: Pseudo-Transitivity",
    "relation": "R(A, B, C, D, E)",
    "fds": [
      "A → B",
      "BC → D",
      "D → E"
    ],
    "tasks": [
      "Prove AC → D holds using Pseudo-Transitivity Rule.",
      "Compute closure of {A, C}.",
      "Identify candidate key for R."
    ],
    "solution": {
      "candidateKey": "AC",
      "explanation": "Proof: A → B given. Augment with C: AC → BC. Given BC → D. By transitivity: AC → D. Since D → E, AC → E. Essential attributes not on RHS are {A, C}. Closure {A, C}+ = {A, B, C, D, E} = R. Thus AC is the unique candidate key.",
      "closureTable": {
        "headers": [
          "Iteration",
          "Current Set",
          "Rule Applied",
          "Added",
          "Result Set"
        ],
        "rows": [
          [
            "0",
            "{A, C}",
            "Initial Basis",
            "—",
            "{A, C}"
          ],
          [
            "1",
            "{A, C}",
            "A → B (Augmentation)",
            "{B}",
            "{A, B, C}"
          ],
          [
            "2",
            "{A, B, C}",
            "BC → D (Pseudo-transitivity)",
            "{D}",
            "{A, B, C, D}"
          ],
          [
            "3",
            "{A, B, C, D}",
            "D → E (Transitivity)",
            "{E}",
            "{A, B, C, D, E} = R"
          ]
        ]
      },
      "keyTakeaway": "Pseudo-transitivity states: If X → Y and WY → Z, then WX → Z.",
      "steps": [
        {
          "num": null,
          "title": "Key Solution Steps",
          "points": [
            "Proof: A → B given.",
            "Augment with C: AC → BC.",
            "Given BC → D.",
            "By transitivity: AC → D.",
            "Since D → E, AC → E.",
            "Essential attributes not on RHS are {A, C}.",
            "Closure {A, C}+ = {A, B, C, D, E} = R.",
            "Thus AC is the unique candidate key."
          ]
        }
      ]
    }
  },
  {
    "id": 19,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Hard",
    "title": "Large Schema Multi-Tier Closure Calculation",
    "relation": "R(A, B, C, D, E, F, G, H)",
    "fds": [
      "A → BC",
      "B → D",
      "CD → E",
      "E → F",
      "F → G",
      "G → H"
    ],
    "tasks": [
      "Compute closure A+ across all 6 tiers.",
      "Check whether any of {B}, {C}, or {D} alone can be a key.",
      "State the minimal candidate key."
    ],
    "solution": {
      "candidateKey": "A",
      "explanation": "A is absent from RHS of all FDs, so A must be in every key. Step 1: A^(0) = {A}. Step 2: A → BC gives {A, B, C}. Step 3: B → D gives {A, B, C, D}. Step 4: CD → E gives {A, B, C, D, E}. Step 5: E → F gives {A, B, C, D, E, F}. Step 6: F → G gives {A, B, C, D, E, F, G}. Step 7: G → H gives {A, B, C, D, E, F, G, H} = R. A is the unique minimal candidate key.",
      "closureTable": {
        "headers": [
          "Tier (i)",
          "Current Set X^(i)",
          "FD Fired",
          "Added Attribute",
          "Result Set X^(i+1)"
        ],
        "rows": [
          [
            "0",
            "{A}",
            "Initial Basis",
            "—",
            "{A}"
          ],
          [
            "1",
            "{A}",
            "A → BC",
            "{B, C}",
            "{A, B, C}"
          ],
          [
            "2",
            "{A, B, C}",
            "B → D",
            "{D}",
            "{A, B, C, D}"
          ],
          [
            "3",
            "{A, B, C, D}",
            "CD → E",
            "{E}",
            "{A, B, C, D, E}"
          ],
          [
            "4",
            "{A, B, C, D, E}",
            "E → F",
            "{F}",
            "{A, B, C, D, E, F}"
          ],
          [
            "5",
            "{A, B, C, D, E, F}",
            "F → G",
            "{G}",
            "{A, B, C, D, E, F, G}"
          ],
          [
            "6",
            "{A, B, C, D, E, F, G}",
            "G → H",
            "{H}",
            "{A, B, C, D, E, F, G, H} = R"
          ]
        ]
      },
      "keyTakeaway": "In hierarchical multi-tier schemas, the root determinant's closure traverses downstream dependencies to span the entire attribute universe.",
      "steps": [
        {
          "num": "1",
          "title": "Step 1",
          "points": [
            "A^(0) = {A}."
          ]
        },
        {
          "num": "2",
          "title": "Step 2",
          "points": [
            "A → BC gives {A, B, C}."
          ]
        },
        {
          "num": "3",
          "title": "Step 3",
          "points": [
            "B → D gives {A, B, C, D}."
          ]
        },
        {
          "num": "4",
          "title": "Step 4",
          "points": [
            "CD → E gives {A, B, C, D, E}."
          ]
        },
        {
          "num": "5",
          "title": "Step 5",
          "points": [
            "E → F gives {A, B, C, D, E, F}."
          ]
        },
        {
          "num": "6",
          "title": "Step 6",
          "points": [
            "F → G gives {A, B, C, D, E, F, G}."
          ]
        },
        {
          "num": "7",
          "title": "Step 7",
          "points": [
            "G → H gives {A, B, C, D, E, F, G, H} = R.",
            "A is the unique minimal candidate key."
          ]
        }
      ]
    }
  },
  {
    "id": 20,
    "category": "closures-keys",
    "categoryLabel": "Closures & Keys",
    "difficulty": "Hard",
    "title": "Attribute Closure with Overlapping Candidate Keys",
    "relation": "R(A, B, C, D)",
    "fds": [
      "A → B",
      "B → C",
      "C → D",
      "D → A"
    ],
    "tasks": [
      "Compute closures of {A}, {B}, {C}, and {D}.",
      "Verify that each attribute is a candidate key.",
      "Prove why all attributes in R are prime."
    ],
    "solution": {
      "candidateKey": "A, B, C, D",
      "explanation": "Closures: A+ = {A,B,C,D} = R; B+ = {A,B,C,D} = R; C+ = {A,B,C,D} = R; D+ = {A,B,C,D} = R. Each attribute is a minimal candidate key because each cardinality is 1. Since Prime Attributes are defined as attributes belonging to ANY candidate key, and every attribute in {A, B, C, D} is a candidate key, all attributes are prime.",
      "closureTable": {
        "headers": [
          "Attribute",
          "Closure Derivation Chain",
          "Closure (X+)",
          "Candidate Key?"
        ],
        "rows": [
          [
            "A",
            "A → B → C → D → A",
            "{A, B, C, D} = R",
            "YES (Candidate Key)"
          ],
          [
            "B",
            "B → C → D → A → B",
            "{A, B, C, D} = R",
            "YES (Candidate Key)"
          ],
          [
            "C",
            "C → D → A → B → C",
            "{A, B, C, D} = R",
            "YES (Candidate Key)"
          ],
          [
            "D",
            "D → A → B → C → D",
            "{A, B, C, D} = R",
            "YES (Candidate Key)"
          ]
        ]
      },
      "keyTakeaway": "When every attribute is a member of at least one candidate key, there are zero non-prime attributes.",
      "steps": [
        {
          "num": null,
          "title": "Key Solution Steps",
          "points": [
            "Closures: A+ = {A,B,C,D} = R; B+ = {A,B,C,D} = R; C+ = {A,B,C,D} = R; D+ = {A,B,C,D} = R.",
            "Each attribute is a minimal candidate key because each cardinality is 1.",
            "Since Prime Attributes are defined as attributes belonging to ANY candidate key, and every attribute in {A, B, C, D} is a candidate key, all attributes are prime."
          ]
        }
      ]
    }
  },
  {
    "id": 21,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Easy",
    "title": "Student–Course Repeating Groups (1NF Flattening)",
    "relation": "STUDENT_RAW(Student_ID, Student_Name, Courses)",
    "sampleData": {
      "headers": [
        "Student_ID",
        "Student_Name",
        "Courses"
      ],
      "rows": [
        [
          "S01",
          "Ram",
          "DBMS, OS"
        ],
        [
          "S02",
          "Sita",
          "DBMS, AI"
        ],
        [
          "S03",
          "Hari",
          "OS, AI"
        ]
      ]
    },
    "fds": [
      "Student_ID → Student_Name",
      "(Student_ID, Course) → Uniqueness"
    ],
    "tasks": [
      "Explain the exact 1NF violation present in STUDENT_RAW.",
      "Flatten the unnormalized table into First Normal Form (1NF).",
      "Identify the composite primary key of the resulting 1NF relation."
    ],
    "solution": {
      "candidateKey": "(Student_ID, Course)",
      "explanation": "Step 1: 1NF Violation Analysis — The Courses column contains comma-separated multi-valued lists (e.g., 'DBMS, OS'). This violates First Normal Form, which strictly requires every attribute value to be atomic and indivisible. Step 2: 1NF Conversion — To achieve 1NF, we flatten the repeating groups so that each course occupies a separate tuple with atomic values. Step 3: Key Identification — Because Student_ID repeats across different courses and Course repeats across different students, the composite candidate key is (Student_ID, Course).",
      "tables": [
        {
          "caption": "1NF Flattened Atomic Table (STUDENT_COURSE_1NF)",
          "headers": [
            "Student_ID (PK)",
            "Student_Name",
            "Course (PK)"
          ],
          "rows": [
            [
              "S01",
              "Ram",
              "DBMS"
            ],
            [
              "S01",
              "Ram",
              "OS"
            ],
            [
              "S02",
              "Sita",
              "DBMS"
            ],
            [
              "S02",
              "Sita",
              "AI"
            ],
            [
              "S03",
              "Hari",
              "OS"
            ],
            [
              "S03",
              "Hari",
              "AI"
            ]
          ]
        }
      ],
      "keyTakeaway": "1NF requires flattening multi-valued and comma-separated columns into individual atomic rows, forming a composite primary key.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Violation Analysis",
          "points": [
            "The Courses column contains comma-separated multi-valued lists (e.g., 'DBMS, OS').",
            "This violates First Normal Form, which strictly requires every attribute value to be atomic and indivisible."
          ]
        },
        {
          "num": "2",
          "title": "1NF Conversion",
          "points": [
            "To achieve 1NF, we flatten the repeating groups so that each course occupies a separate tuple with atomic values."
          ]
        },
        {
          "num": "3",
          "title": "Key Identification",
          "points": [
            "Because Student_ID repeats across different courses and Course repeats across different students, the composite candidate key is (Student_ID, Course)."
          ]
        }
      ]
    }
  },
  {
    "id": 22,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Easy",
    "title": "Employee Skills Non-Atomic Domain (1NF)",
    "relation": "EMP_RAW(Emp_ID, Emp_Name, Skill_Set)",
    "sampleData": {
      "headers": [
        "Emp_ID",
        "Emp_Name",
        "Skill_Set"
      ],
      "rows": [
        [
          "E01",
          "Alice",
          "Python, SQL, Java"
        ],
        [
          "E02",
          "Bob",
          "Java, C++"
        ]
      ]
    },
    "fds": [
      "Emp_ID → Emp_Name",
      "(Emp_ID, Skill) → Record"
    ],
    "tasks": [
      "Identify the 1NF violation.",
      "Convert EMP_RAW into 1NF.",
      "Identify the candidate key and explain why Emp_ID alone cannot be the key."
    ],
    "solution": {
      "candidateKey": "(Emp_ID, Skill)",
      "explanation": "Step 1: 1NF Violation — Skill_Set contains non-atomic, composite values. Step 2: 1NF Conversion — Unnest each individual skill into a separate tuple. Step 3: Key Determination — Emp_ID repeats for each skill of an employee, so Emp_ID cannot uniquely identify a row. The composite key must be (Emp_ID, Skill).",
      "tables": [
        {
          "caption": "1NF Atomic Table (EMPLOYEE_SKILLS_1NF)",
          "headers": [
            "Emp_ID (PK)",
            "Emp_Name",
            "Skill (PK)"
          ],
          "rows": [
            [
              "E01",
              "Alice",
              "Python"
            ],
            [
              "E01",
              "Alice",
              "SQL"
            ],
            [
              "E01",
              "Alice",
              "Java"
            ],
            [
              "E02",
              "Bob",
              "Java"
            ],
            [
              "E02",
              "Bob",
              "C++"
            ]
          ]
        }
      ],
      "keyTakeaway": "A relation is in 1NF if and only if all domain values are indivisible scalar values.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Violation",
          "points": [
            "Skill_Set contains non-atomic, composite values."
          ]
        },
        {
          "num": "2",
          "title": "1NF Conversion",
          "points": [
            "Unnest each individual skill into a separate tuple."
          ]
        },
        {
          "num": "3",
          "title": "Key Determination",
          "points": [
            "Emp_ID repeats for each skill of an employee, so Emp_ID cannot uniquely identify a row.",
            "The composite key must be (Emp_ID, Skill)."
          ]
        }
      ]
    }
  },
  {
    "id": 23,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Easy",
    "title": "Order Line Items with Multi-Valued Attributes",
    "relation": "ORDER_RAW(Order_ID, Customer_Name, Product_IDs, Quantities)",
    "sampleData": {
      "headers": [
        "Order_ID",
        "Customer_Name",
        "Product_IDs",
        "Quantities"
      ],
      "rows": [
        [
          "101",
          "Acme Corp",
          "P1, P2",
          "10, 5"
        ],
        [
          "102",
          "Beta Ltd",
          "P2, P3, P4",
          "20, 15, 8"
        ]
      ]
    },
    "fds": [
      "Order_ID → Customer_Name",
      "(Order_ID, Product_ID) → Quantity"
    ],
    "tasks": [
      "State why parallel arrays (Product_IDs, Quantities) violate 1NF.",
      "Convert ORDER_RAW to 1NF.",
      "Determine candidate key of the 1NF relation."
    ],
    "solution": {
      "candidateKey": "(Order_ID, Product_ID)",
      "explanation": "Step 1: 1NF Violation — Storing parallel arrays within single tuple cells violates attribute atomicity. Step 2: 1NF Conversion — Split paired values (P1:10, P2:5) into distinct atomic rows. Step 3: Candidate Key — (Order_ID, Product_ID) uniquely identifies each ordered product line item.",
      "tables": [
        {
          "caption": "1NF Atomic Line Items (ORDER_ITEMS_1NF)",
          "headers": [
            "Order_ID (PK)",
            "Customer_Name",
            "Product_ID (PK)",
            "Quantity"
          ],
          "rows": [
            [
              "101",
              "Acme Corp",
              "P1",
              "10"
            ],
            [
              "101",
              "Acme Corp",
              "P2",
              "5"
            ],
            [
              "102",
              "Beta Ltd",
              "P2",
              "20"
            ],
            [
              "102",
              "Beta Ltd",
              "P3",
              "15"
            ],
            [
              "102",
              "Beta Ltd",
              "P4",
              "8"
            ]
          ]
        }
      ],
      "keyTakeaway": "Parallel arrays in unnormalized data must be aligned and flattened row-by-row into atomic tuples.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Violation",
          "points": [
            "Storing parallel arrays within single tuple cells violates attribute atomicity."
          ]
        },
        {
          "num": "2",
          "title": "1NF Conversion",
          "points": [
            "Split paired values (P1:10, P2:5) into distinct atomic rows."
          ]
        },
        {
          "num": "3",
          "title": "Candidate Key",
          "points": [
            "(Order_ID, Product_ID) uniquely identifies each ordered product line item."
          ]
        }
      ]
    }
  },
  {
    "id": 24,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Easy",
    "title": "Doctor Clinic Consultation Schedule (1NF)",
    "relation": "CLINIC_RAW(Doctor_ID, Doctor_Name, Clinic_Days, Time_Slots)",
    "sampleData": {
      "headers": [
        "Doctor_ID",
        "Doctor_Name",
        "Clinic_Days",
        "Time_Slots"
      ],
      "rows": [
        [
          "D01",
          "Dr. Smith",
          "Mon, Wed",
          "10:00, 14:00"
        ],
        [
          "D02",
          "Dr. Patel",
          "Tue, Thu, Fri",
          "09:00, 11:00, 15:00"
        ]
      ]
    },
    "fds": [
      "Doctor_ID → Doctor_Name",
      "(Doctor_ID, Clinic_Day, Time_Slot) → Consultation"
    ],
    "tasks": [
      "Identify non-atomic columns.",
      "Convert into 1NF tabular representation.",
      "Specify the candidate key."
    ],
    "solution": {
      "candidateKey": "(Doctor_ID, Clinic_Day, Time_Slot)",
      "explanation": "Step 1: 1NF Violation — Multi-valued columns Clinic_Days and Time_Slots contain lists instead of atomic scalars. Step 2: 1NF Conversion — Each consultation schedule slot is decomposed into an individual tuple. Step 3: Key — The combination of Doctor_ID, Clinic_Day, and Time_Slot uniquely identifies each consultation opportunity.",
      "tables": [
        {
          "caption": "1NF Atomic Consultation Schedule",
          "headers": [
            "Doctor_ID (PK)",
            "Doctor_Name",
            "Clinic_Day (PK)",
            "Time_Slot (PK)"
          ],
          "rows": [
            [
              "D01",
              "Dr. Smith",
              "Mon",
              "10:00"
            ],
            [
              "D01",
              "Dr. Smith",
              "Wed",
              "14:00"
            ],
            [
              "D02",
              "Dr. Patel",
              "Tue",
              "09:00"
            ],
            [
              "D02",
              "Dr. Patel",
              "Thu",
              "11:00"
            ],
            [
              "D02",
              "Dr. Patel",
              "Fri",
              "15:00"
            ]
          ]
        }
      ],
      "keyTakeaway": "Composite schedules with repeating day/time combinations require a 3-attribute composite primary key in 1NF.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Violation",
          "points": [
            "Multi-valued columns Clinic_Days and Time_Slots contain lists instead of atomic scalars."
          ]
        },
        {
          "num": "2",
          "title": "1NF Conversion",
          "points": [
            "Each consultation schedule slot is decomposed into an individual tuple."
          ]
        },
        {
          "num": "3",
          "title": "Key",
          "points": [
            "The combination of Doctor_ID, Clinic_Day, and Time_Slot uniquely identifies each consultation opportunity."
          ]
        }
      ]
    }
  },
  {
    "id": 25,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Easy",
    "title": "Library Book Multi-Author Unnesting",
    "relation": "BOOK_RAW(ISBN, Title, Authors, Publisher)",
    "sampleData": {
      "headers": [
        "ISBN",
        "Title",
        "Authors",
        "Publisher"
      ],
      "rows": [
        [
          "978-01",
          "Database Concepts",
          "Silberschatz, Korth, Sudarshan",
          "McGraw-Hill"
        ],
        [
          "978-02",
          "Operating Systems",
          "Tanenbaum, Bos",
          "Pearson"
        ]
      ]
    },
    "fds": [
      "ISBN → Title, Publisher",
      "(ISBN, Author) → Book Authorship"
    ],
    "tasks": [
      "Identify the 1NF violation.",
      "Flatten the relation to achieve 1NF.",
      "State candidate key."
    ],
    "solution": {
      "candidateKey": "(ISBN, Author)",
      "explanation": "Step 1: 1NF Violation — Authors column contains comma-delimited strings of multiple authors. Step 2: 1NF Conversion — Flatten tuples so each author is stored in a separate row. Step 3: Candidate Key — Since ISBN repeats for each author, the composite key is (ISBN, Author).",
      "tables": [
        {
          "caption": "1NF Flattened Book Catalog",
          "headers": [
            "ISBN (PK)",
            "Title",
            "Author (PK)",
            "Publisher"
          ],
          "rows": [
            [
              "978-01",
              "Database Concepts",
              "Silberschatz",
              "McGraw-Hill"
            ],
            [
              "978-01",
              "Database Concepts",
              "Korth",
              "McGraw-Hill"
            ],
            [
              "978-01",
              "Database Concepts",
              "Sudarshan",
              "McGraw-Hill"
            ],
            [
              "978-02",
              "Operating Systems",
              "Tanenbaum",
              "Pearson"
            ],
            [
              "978-02",
              "Operating Systems",
              "Bos",
              "Pearson"
            ]
          ]
        }
      ],
      "keyTakeaway": "Unnesting authors creates atomic rows but leads to Title and Publisher duplication, preparing for 2NF decomposition.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Violation",
          "points": [
            "Authors column contains comma-delimited strings of multiple authors."
          ]
        },
        {
          "num": "2",
          "title": "1NF Conversion",
          "points": [
            "Flatten tuples so each author is stored in a separate row."
          ]
        },
        {
          "num": "3",
          "title": "Candidate Key",
          "points": [
            "Since ISBN repeats for each author, the composite key is (ISBN, Author)."
          ]
        }
      ]
    }
  },
  {
    "id": 26,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Medium",
    "title": "Student Marks Partial Dependency Elimination (2NF)",
    "relation": "STUDENT_MARKS(Student_ID, Subject_ID, Student_Name, Subject_Name, Marks)",
    "fds": [
      "Student_ID → Student_Name",
      "Subject_ID → Subject_Name",
      "(Student_ID, Subject_ID) → Marks"
    ],
    "tasks": [
      "Verify whether the relation is in 1NF.",
      "Identify candidate key and classify prime vs non-prime attributes.",
      "Identify all partial dependencies violating 2NF.",
      "Decompose into 2NF relations with primary and foreign keys."
    ],
    "solution": {
      "candidateKey": "(Student_ID, Subject_ID)",
      "explanation": "Step 1: 1NF Verification — The relation is ALREADY in 1NF because all attributes have atomic, scalar values and there are no repeating groups. Step 2: Candidate Key & Attributes — Candidate Key = (Student_ID, Subject_ID). Prime Attributes = {Student_ID, Subject_ID}. Non-Prime Attributes = {Student_Name, Subject_Name, Marks}. Step 3: 2NF Partial Dependency Evaluation — A relation is in 2NF if it is in 1NF and NO non-prime attribute is partially dependent on any candidate key. Here, Student_ID ⊂ CK determines Student_Name, and Subject_ID ⊂ CK determines Subject_Name. Both are partial dependencies violating 2NF! Step 4: 2NF Decomposition — Extract partial dependencies into separate master tables, leaving Marks in the associative table.",
      "tables": [
        {
          "caption": "2NF Decomposed Relational Architecture",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Non-Key Attributes",
            "Dependency Preserved"
          ],
          "rows": [
            [
              "STUDENT",
              "Student_ID",
              "None",
              "Student_Name",
              "Student_ID → Student_Name"
            ],
            [
              "SUBJECT",
              "Subject_ID",
              "None",
              "Subject_Name",
              "Subject_ID → Subject_Name"
            ],
            [
              "RESULT",
              "(Student_ID, Subject_ID)",
              "Student_ID → STUDENT,\nSubject_ID → SUBJECT",
              "Marks",
              "(Student_ID, Subject_ID) → Marks"
            ]
          ]
        }
      ],
      "keyTakeaway": "A table is in 2NF only when it is in 1NF and every non-prime attribute depends on the WHOLE candidate key, never on a proper subset.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "The relation is ALREADY in 1NF because all attributes have atomic, scalar values and there are no repeating groups."
          ]
        },
        {
          "num": "2",
          "title": "Candidate Key & Attributes",
          "points": [
            "Candidate Key = (Student_ID, Subject_ID).",
            "Prime Attributes = {Student_ID, Subject_ID}.",
            "Non-Prime Attributes = {Student_Name, Subject_Name, Marks}."
          ]
        },
        {
          "num": "3",
          "title": "2NF Partial Dependency Evaluation",
          "points": [
            "A relation is in 2NF if it is in 1NF and NO non-prime attribute is partially dependent on any candidate key.",
            "Here, Student_ID ⊂ CK determines Student_Name, and Subject_ID ⊂ CK determines Subject_Name.",
            "Both are partial dependencies violating 2NF!"
          ]
        },
        {
          "num": "4",
          "title": "2NF Decomposition",
          "points": [
            "Extract partial dependencies into separate master tables, leaving Marks in the associative table."
          ]
        }
      ]
    }
  },
  {
    "id": 27,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Medium",
    "title": "Order Detail Schema 2NF Normalization",
    "relation": "ORDER_DETAIL(Order_ID, Product_ID, Customer_Name, Product_Name, Product_Price, Quantity)",
    "fds": [
      "Order_ID → Customer_Name",
      "Product_ID → Product_Name, Product_Price",
      "(Order_ID, Product_ID) → Quantity"
    ],
    "tasks": [
      "Verify 1NF status.",
      "Identify the candidate key.",
      "Identify partial dependencies violating 2NF.",
      "Provide complete 2NF relational schema."
    ],
    "solution": {
      "candidateKey": "(Order_ID, Product_ID)",
      "explanation": "Step 1: 1NF Verification — Relation is in 1NF as every column contains atomic data. Step 2: Candidate Key — Candidate Key = (Order_ID, Product_ID). Prime = {Order_ID, Product_ID}. Non-prime = {Customer_Name, Product_Name, Product_Price, Quantity}. Step 3: 2NF Violation — Order_ID → Customer_Name depends only on part of the composite key (Order_ID). Product_ID → {Product_Name, Product_Price} depends only on Product_ID. Both violate 2NF. Step 4: 2NF Decomposition — Extract ORDER and PRODUCT master relations; retain associative ORDER_ITEM table.",
      "tables": [
        {
          "caption": "2NF Normalized Relations",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Non-Key Attributes",
            "Resolved Anomaly"
          ],
          "rows": [
            [
              "ORDER_HEADER",
              "Order_ID",
              "None",
              "Customer_Name",
              "Customer name no longer duplicates per product item"
            ],
            [
              "PRODUCT",
              "Product_ID",
              "None",
              "Product_Name, Product_Price",
              "Product catalog details stored once"
            ],
            [
              "ORDER_ITEM",
              "(Order_ID, Product_ID)",
              "Order_ID → ORDER_HEADER,\nProduct_ID → PRODUCT",
              "Quantity",
              "Pure transactional intersection"
            ]
          ]
        }
      ],
      "keyTakeaway": "To reach 2NF from 1NF, extract each partial dependency into a new relation where the partial determinant becomes the primary key.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "Relation is in 1NF as every column contains atomic data."
          ]
        },
        {
          "num": "2",
          "title": "Candidate Key",
          "points": [
            "Candidate Key = (Order_ID, Product_ID).",
            "Prime = {Order_ID, Product_ID}.",
            "Non-prime = {Customer_Name, Product_Name, Product_Price, Quantity}."
          ]
        },
        {
          "num": "3",
          "title": "2NF Violation",
          "points": [
            "Order_ID → Customer_Name depends only on part of the composite key (Order_ID).",
            "Product_ID → {Product_Name, Product_Price} depends only on Product_ID.",
            "Both violate 2NF."
          ]
        },
        {
          "num": "4",
          "title": "2NF Decomposition",
          "points": [
            "Extract ORDER and PRODUCT master relations; retain associative ORDER_ITEM table."
          ]
        }
      ]
    }
  },
  {
    "id": 28,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Medium",
    "title": "Hospital Appointment 2NF Decomposition",
    "relation": "APPOINTMENT(Patient_ID, Doctor_ID, Patient_Name, Doctor_Name, Specialization, Appointment_Date)",
    "fds": [
      "Patient_ID → Patient_Name",
      "Doctor_ID → Doctor_Name, Specialization",
      "(Patient_ID, Doctor_ID) → Appointment_Date"
    ],
    "tasks": [
      "Confirm 1NF status.",
      "Determine candidate key and classify attributes.",
      "Identify 2NF partial dependencies.",
      "Produce 2NF decomposed tables."
    ],
    "solution": {
      "candidateKey": "(Patient_ID, Doctor_ID)",
      "explanation": "Step 1: 1NF Verification — Relation APPOINTMENT is already in 1NF (all column domains are scalar). Step 2: Candidate Key — (Patient_ID, Doctor_ID). Non-prime attributes: {Patient_Name, Doctor_Name, Specialization, Appointment_Date}. Step 3: 2NF Evaluation — Patient_ID → Patient_Name and Doctor_ID → {Doctor_Name, Specialization} are partial functional dependencies because determinants are strict subsets of (Patient_ID, Doctor_ID). This violates 2NF. Step 4: 2NF Decomposition — Form PATIENT, DOCTOR, and APPOINTMENT relations.",
      "tables": [
        {
          "caption": "2NF Decomposed Schema",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Non-Key Attributes"
          ],
          "rows": [
            [
              "PATIENT",
              "Patient_ID",
              "None",
              "Patient_Name"
            ],
            [
              "DOCTOR",
              "Doctor_ID",
              "None",
              "Doctor_Name, Specialization"
            ],
            [
              "APPOINTMENT",
              "(Patient_ID, Doctor_ID)",
              "Patient_ID → PATIENT,\nDoctor_ID → DOCTOR",
              "Appointment_Date"
            ]
          ]
        }
      ],
      "keyTakeaway": "Decomposing 2NF eliminates update anomalies when doctors change names or specializations.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "Relation APPOINTMENT is already in 1NF (all column domains are scalar)."
          ]
        },
        {
          "num": "2",
          "title": "Candidate Key",
          "points": [
            "(Patient_ID, Doctor_ID).",
            "Non-prime attributes: {Patient_Name, Doctor_Name, Specialization, Appointment_Date}."
          ]
        },
        {
          "num": "3",
          "title": "2NF Evaluation",
          "points": [
            "Patient_ID → Patient_Name and Doctor_ID → {Doctor_Name, Specialization} are partial functional dependencies because determinants are strict subsets of (Patient_ID, Doctor_ID).",
            "This violates 2NF."
          ]
        },
        {
          "num": "4",
          "title": "2NF Decomposition",
          "points": [
            "Form PATIENT, DOCTOR, and APPOINTMENT relations."
          ]
        }
      ]
    }
  },
  {
    "id": 29,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Easy",
    "title": "Single Partial Dependency Decomposition",
    "relation": "PROJECT_ASSIGNMENT(Project_ID, Emp_ID, Project_Budget, Hours_Worked)",
    "fds": [
      "Project_ID → Project_Budget",
      "(Project_ID, Emp_ID) → Hours_Worked"
    ],
    "tasks": [
      "Explain why the relation is in 1NF.",
      "State candidate key.",
      "Identify the partial dependency and decompose to 2NF."
    ],
    "solution": {
      "candidateKey": "(Project_ID, Emp_ID)",
      "explanation": "Step 1: 1NF Verification — The relation is in 1NF because all attributes contain atomic values. Step 2: Candidate Key — Candidate key is (Project_ID, Emp_ID). Non-prime attributes are Project_Budget and Hours_Worked. Step 3: 2NF Evaluation — Project_ID is a strict subset of (Project_ID, Emp_ID) and determines non-prime attribute Project_Budget. This is a partial dependency violating 2NF. Hours_Worked depends on the full key. Step 4: 2NF Decomposition — Extract PROJECT(Project_ID, Project_Budget) and retain ASSIGNMENT(Project_ID, Emp_ID, Hours_Worked).",
      "tables": [
        {
          "caption": "2NF Relational Decomposition",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Non-Key Attributes"
          ],
          "rows": [
            [
              "PROJECT",
              "Project_ID",
              "None",
              "Project_Budget"
            ],
            [
              "ASSIGNMENT",
              "(Project_ID, Emp_ID)",
              "Project_ID → PROJECT",
              "Hours_Worked"
            ]
          ]
        }
      ],
      "keyTakeaway": "Even a single partial dependency violates 2NF and requires decomposition into separate tables.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "The relation is in 1NF because all attributes contain atomic values."
          ]
        },
        {
          "num": "2",
          "title": "Candidate Key",
          "points": [
            "Candidate key is (Project_ID, Emp_ID).",
            "Non-prime attributes are Project_Budget and Hours_Worked."
          ]
        },
        {
          "num": "3",
          "title": "2NF Evaluation",
          "points": [
            "Project_ID is a strict subset of (Project_ID, Emp_ID) and determines non-prime attribute Project_Budget.",
            "This is a partial dependency violating 2NF.",
            "Hours_Worked depends on the full key."
          ]
        },
        {
          "num": "4",
          "title": "2NF Decomposition",
          "points": [
            "Extract PROJECT(Project_ID, Project_Budget) and retain ASSIGNMENT(Project_ID, Emp_ID, Hours_Worked)."
          ]
        }
      ]
    }
  },
  {
    "id": 30,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Medium",
    "title": "Dual Partial Dependencies on Composite Key",
    "relation": "SHIPPING(Shipment_ID, Warehouse_ID, Customer_ID, Warehouse_City, Customer_Address, Shipment_Cost)",
    "fds": [
      "Warehouse_ID → Warehouse_City",
      "Customer_ID → Customer_Address",
      "(Shipment_ID, Warehouse_ID, Customer_ID) → Shipment_Cost"
    ],
    "tasks": [
      "Confirm 1NF compliance.",
      "Identify the 3-attribute candidate key.",
      "Identify both partial dependencies and decompose into 2NF."
    ],
    "solution": {
      "candidateKey": "(Shipment_ID, Warehouse_ID, Customer_ID)",
      "explanation": "Step 1: 1NF Verification — The schema is in 1NF with atomic attributes. Step 2: Candidate Key — (Shipment_ID, Warehouse_ID, Customer_ID). Non-prime: {Warehouse_City, Customer_Address, Shipment_Cost}. Step 3: 2NF Evaluation — Warehouse_ID → Warehouse_City and Customer_ID → Customer_Address depend on proper subsets of the candidate key, violating 2NF. Step 4: 2NF Decomposition — Isolate WAREHOUSE and CUSTOMER tables; retain SHIPPING line items.",
      "tables": [
        {
          "caption": "2NF Normalization Tables",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "WAREHOUSE",
              "Warehouse_ID",
              "None",
              "Warehouse_ID, Warehouse_City"
            ],
            [
              "CUSTOMER",
              "Customer_ID",
              "None",
              "Customer_ID, Customer_Address"
            ],
            [
              "SHIPMENT",
              "(Shipment_ID, Warehouse_ID, Customer_ID)",
              "Warehouse_ID → WAREHOUSE,\nCustomer_ID → CUSTOMER",
              "Shipment_ID, Warehouse_ID, Customer_ID, Shipment_Cost"
            ]
          ]
        }
      ],
      "keyTakeaway": "When multiple proper subsets determine non-prime attributes, each must be factored out into its respective entity table.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "The schema is in 1NF with atomic attributes."
          ]
        },
        {
          "num": "2",
          "title": "Candidate Key",
          "points": [
            "(Shipment_ID, Warehouse_ID, Customer_ID).",
            "Non-prime: {Warehouse_City, Customer_Address, Shipment_Cost}."
          ]
        },
        {
          "num": "3",
          "title": "2NF Evaluation",
          "points": [
            "Warehouse_ID → Warehouse_City and Customer_ID → Customer_Address depend on proper subsets of the candidate key, violating 2NF."
          ]
        },
        {
          "num": "4",
          "title": "2NF Decomposition",
          "points": [
            "Isolate WAREHOUSE and CUSTOMER tables; retain SHIPPING line items."
          ]
        }
      ]
    }
  },
  {
    "id": 31,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Medium",
    "title": "Warehouse Inventory Management 2NF",
    "relation": "INVENTORY(Warehouse_ID, Item_ID, Warehouse_Location, Item_Description, Unit_Price, Quantity_On_Hand)",
    "fds": [
      "Warehouse_ID → Warehouse_Location",
      "Item_ID → Item_Description, Unit_Price",
      "(Warehouse_ID, Item_ID) → Quantity_On_Hand"
    ],
    "tasks": [
      "Verify 1NF validity.",
      "Identify candidate key.",
      "List all 2NF violations.",
      "Decompose into 2NF relations."
    ],
    "solution": {
      "candidateKey": "(Warehouse_ID, Item_ID)",
      "explanation": "Step 1: 1NF Verification — The relation is in 1NF as every cell stores a single atomic value. Step 2: Candidate Key — (Warehouse_ID, Item_ID). Prime attributes: {Warehouse_ID, Item_ID}. Non-prime: {Warehouse_Location, Item_Description, Unit_Price, Quantity_On_Hand}. Step 3: 2NF Evaluation — Warehouse_ID → Warehouse_Location and Item_ID → {Item_Description, Unit_Price} are partial dependencies because their determinants are proper subsets of (Warehouse_ID, Item_ID). Step 4: 2NF Decomposition — Create WAREHOUSE, ITEM, and INVENTORY_STOCK tables.",
      "tables": [
        {
          "caption": "2NF Decomposed Inventory Architecture",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "WAREHOUSE",
              "Warehouse_ID",
              "None",
              "Warehouse_ID, Warehouse_Location"
            ],
            [
              "ITEM",
              "Item_ID",
              "None",
              "Item_ID, Item_Description, Unit_Price"
            ],
            [
              "INVENTORY_STOCK",
              "(Warehouse_ID, Item_ID)",
              "Warehouse_ID → WAREHOUSE,\nItem_ID → ITEM",
              "Warehouse_ID, Item_ID, Quantity_On_Hand"
            ]
          ]
        }
      ],
      "keyTakeaway": "2NF separates location and catalog attributes from the physical inventory count.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "The relation is in 1NF as every cell stores a single atomic value."
          ]
        },
        {
          "num": "2",
          "title": "Candidate Key",
          "points": [
            "(Warehouse_ID, Item_ID).",
            "Prime attributes: {Warehouse_ID, Item_ID}.",
            "Non-prime: {Warehouse_Location, Item_Description, Unit_Price, Quantity_On_Hand}."
          ]
        },
        {
          "num": "3",
          "title": "2NF Evaluation",
          "points": [
            "Warehouse_ID → Warehouse_Location and Item_ID → {Item_Description, Unit_Price} are partial dependencies because their determinants are proper subsets of (Warehouse_ID, Item_ID)."
          ]
        },
        {
          "num": "4",
          "title": "2NF Decomposition",
          "points": [
            "Create WAREHOUSE, ITEM, and INVENTORY_STOCK tables."
          ]
        }
      ]
    }
  },
  {
    "id": 32,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Medium",
    "title": "Hotel Room Reservation 2NF Decomposition",
    "relation": "RESERVATION(Guest_ID, Room_No, Guest_Name, Guest_Phone, Room_Type, Room_Rate, Check_In, Check_Out)",
    "fds": [
      "Guest_ID → Guest_Name, Guest_Phone",
      "Room_No → Room_Type, Room_Rate",
      "(Guest_ID, Room_No, Check_In) → Check_Out"
    ],
    "tasks": [
      "State why RESERVATION satisfies 1NF.",
      "Determine candidate key.",
      "Identify 2NF partial dependencies and decompose."
    ],
    "solution": {
      "candidateKey": "(Guest_ID, Room_No, Check_In)",
      "explanation": "Step 1: 1NF Verification — All attributes contain atomic values; no multi-valued arrays exist. Thus 1NF is satisfied. Step 2: Candidate Key — (Guest_ID, Room_No, Check_In). Step 3: 2NF Violation — Guest_ID determines Guest_Name and Phone (subset of key). Room_No determines Room_Type and Rate (subset of key). Both are partial dependencies violating 2NF. Step 4: 2NF Decomposition — Extract GUEST, ROOM, and BOOKING tables.",
      "tables": [
        {
          "caption": "2NF Normalized Hotel Schema",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Non-Key Attributes"
          ],
          "rows": [
            [
              "GUEST",
              "Guest_ID",
              "None",
              "Guest_Name, Guest_Phone"
            ],
            [
              "ROOM",
              "Room_No",
              "None",
              "Room_Type, Room_Rate"
            ],
            [
              "BOOKING",
              "(Guest_ID, Room_No, Check_In)",
              "Guest_ID → GUEST,\nRoom_No → ROOM",
              "Check_Out"
            ]
          ]
        }
      ],
      "keyTakeaway": "Customer profiles and room specifications must be separated from booking transaction logs in 2NF.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "All attributes contain atomic values; no multi-valued arrays exist.",
            "Thus 1NF is satisfied."
          ]
        },
        {
          "num": "2",
          "title": "Candidate Key",
          "points": [
            "(Guest_ID, Room_No, Check_In)."
          ]
        },
        {
          "num": "3",
          "title": "2NF Violation",
          "points": [
            "Guest_ID determines Guest_Name and Phone (subset of key).",
            "Room_No determines Room_Type and Rate (subset of key).",
            "Both are partial dependencies violating 2NF."
          ]
        },
        {
          "num": "4",
          "title": "2NF Decomposition",
          "points": [
            "Extract GUEST, ROOM, and BOOKING tables."
          ]
        }
      ]
    }
  },
  {
    "id": 33,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Medium",
    "title": "Airline Flight Crew Assignment 2NF",
    "relation": "CREW_ASSIGNMENT(Flight_No, Crew_ID, Flight_Date, Origin, Destination, Crew_Name, Crew_Role, Hours_Flown)",
    "fds": [
      "Flight_No → Origin, Destination",
      "Crew_ID → Crew_Name, Crew_Role",
      "(Flight_No, Crew_ID, Flight_Date) → Hours_Flown"
    ],
    "tasks": [
      "Check 1NF condition.",
      "Find candidate key.",
      "Detect partial dependencies.",
      "Design 2NF schema."
    ],
    "solution": {
      "candidateKey": "(Flight_No, Crew_ID, Flight_Date)",
      "explanation": "Step 1: 1NF Verification — All fields are scalar atomic values, satisfying 1NF. Step 2: Candidate Key — (Flight_No, Crew_ID, Flight_Date). Step 3: 2NF Violation — Flight_No → {Origin, Destination} and Crew_ID → {Crew_Name, Crew_Role} depend on proper subsets of the 3-attribute candidate key. This violates 2NF. Step 4: 2NF Decomposition — Decompose into FLIGHT, CREW_MEMBER, and FLIGHT_DUTY tables.",
      "tables": [
        {
          "caption": "2NF Airline Schema Architecture",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "FLIGHT",
              "Flight_No",
              "None",
              "Flight_No, Origin, Destination"
            ],
            [
              "CREW_MEMBER",
              "Crew_ID",
              "None",
              "Crew_ID, Crew_Name, Crew_Role"
            ],
            [
              "FLIGHT_DUTY",
              "(Flight_No, Crew_ID, Flight_Date)",
              "Flight_No → FLIGHT,\nCrew_ID → CREW_MEMBER",
              "Flight_No, Crew_ID, Flight_Date, Hours_Flown"
            ]
          ]
        }
      ],
      "keyTakeaway": "Route parameters (Flight_No) and staff credentials (Crew_ID) are independent entities linked through daily flight logs.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "All fields are scalar atomic values, satisfying 1NF."
          ]
        },
        {
          "num": "2",
          "title": "Candidate Key",
          "points": [
            "(Flight_No, Crew_ID, Flight_Date)."
          ]
        },
        {
          "num": "3",
          "title": "2NF Violation",
          "points": [
            "Flight_No → {Origin, Destination} and Crew_ID → {Crew_Name, Crew_Role} depend on proper subsets of the 3-attribute candidate key.",
            "This violates 2NF."
          ]
        },
        {
          "num": "4",
          "title": "2NF Decomposition",
          "points": [
            "Decompose into FLIGHT, CREW_MEMBER, and FLIGHT_DUTY tables."
          ]
        }
      ]
    }
  },
  {
    "id": 34,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Medium",
    "title": "Manufacturing Assembly Component Tracking",
    "relation": "ASSEMBLY(Assembly_ID, Part_ID, Assembly_Name, Part_Name, Part_Weight, Quantity_Required)",
    "fds": [
      "Assembly_ID → Assembly_Name",
      "Part_ID → Part_Name, Part_Weight",
      "(Assembly_ID, Part_ID) → Quantity_Required"
    ],
    "tasks": [
      "Verify 1NF condition.",
      "Identify candidate key.",
      "Highlight 2NF partial dependencies.",
      "Decompose into 2NF schema."
    ],
    "solution": {
      "candidateKey": "(Assembly_ID, Part_ID)",
      "explanation": "Step 1: 1NF Verification — All attributes contain atomic values, so 1NF is satisfied. Step 2: Candidate Key — (Assembly_ID, Part_ID). Step 3: 2NF Violation — Assembly_ID → Assembly_Name depends on partial key Assembly_ID; Part_ID → {Part_Name, Part_Weight} depends on partial key Part_ID. Both violate 2NF. Step 4: 2NF Decomposition — Create ASSEMBLY_HEADER, PART, and BILL_OF_MATERIALS relations.",
      "tables": [
        {
          "caption": "2NF Bill of Materials Decomposition",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "ASSEMBLY_HEADER",
              "Assembly_ID",
              "None",
              "Assembly_ID, Assembly_Name"
            ],
            [
              "PART",
              "Part_ID",
              "None",
              "Part_ID, Part_Name, Part_Weight"
            ],
            [
              "BILL_OF_MATERIALS",
              "(Assembly_ID, Part_ID)",
              "Assembly_ID → ASSEMBLY_HEADER,\nPart_ID → PART",
              "Assembly_ID, Part_ID, Quantity_Required"
            ]
          ]
        }
      ],
      "keyTakeaway": "Bill-of-materials structures in manufacturing naturally require 2NF to separate component catalogs from assembly recipes.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "All attributes contain atomic values, so 1NF is satisfied."
          ]
        },
        {
          "num": "2",
          "title": "Candidate Key",
          "points": [
            "(Assembly_ID, Part_ID)."
          ]
        },
        {
          "num": "3",
          "title": "2NF Violation",
          "points": [
            "Assembly_ID → Assembly_Name depends on partial key Assembly_ID; Part_ID → {Part_Name, Part_Weight} depends on partial key Part_ID.",
            "Both violate 2NF."
          ]
        },
        {
          "num": "4",
          "title": "2NF Decomposition",
          "points": [
            "Create ASSEMBLY_HEADER, PART, and BILL_OF_MATERIALS relations."
          ]
        }
      ]
    }
  },
  {
    "id": 35,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Medium",
    "title": "Retail Store Product Inventory 2NF",
    "relation": "STORE_INVENTORY(Store_ID, SKU, Store_City, Store_Manager, Product_Title, Unit_Cost, Stock_Level)",
    "fds": [
      "Store_ID → Store_City, Store_Manager",
      "SKU → Product_Title, Unit_Cost",
      "(Store_ID, SKU) → Stock_Level"
    ],
    "tasks": [
      "Confirm 1NF status.",
      "Determine candidate key.",
      "Explain the 2NF partial dependencies.",
      "Produce 2NF schema tables."
    ],
    "solution": {
      "candidateKey": "(Store_ID, SKU)",
      "explanation": "Step 1: 1NF Verification — 1NF is satisfied because all attribute values are atomic scalar values. Step 2: Candidate Key — (Store_ID, SKU). Step 3: 2NF Violation — Store_ID → {Store_City, Store_Manager} and SKU → {Product_Title, Unit_Cost} are partial dependencies on subsets of the composite candidate key. Step 4: 2NF Decomposition — Form STORE, PRODUCT_CATALOG, and STORE_STOCK relations.",
      "tables": [
        {
          "caption": "2NF Retail Store Schema",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "STORE",
              "Store_ID",
              "None",
              "Store_ID, Store_City, Store_Manager"
            ],
            [
              "PRODUCT_CATALOG",
              "SKU",
              "None",
              "SKU, Product_Title, Unit_Cost"
            ],
            [
              "STORE_STOCK",
              "(Store_ID, SKU)",
              "Store_ID → STORE,\nSKU → PRODUCT_CATALOG",
              "Store_ID, SKU, Stock_Level"
            ]
          ]
        }
      ],
      "keyTakeaway": "2NF prevents repeating store address and manager data across hundreds of individual stocked products.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "1NF is satisfied because all attribute values are atomic scalar values."
          ]
        },
        {
          "num": "2",
          "title": "Candidate Key",
          "points": [
            "(Store_ID, SKU)."
          ]
        },
        {
          "num": "3",
          "title": "2NF Violation",
          "points": [
            "Store_ID → {Store_City, Store_Manager} and SKU → {Product_Title, Unit_Cost} are partial dependencies on subsets of the composite candidate key."
          ]
        },
        {
          "num": "4",
          "title": "2NF Decomposition",
          "points": [
            "Form STORE, PRODUCT_CATALOG, and STORE_STOCK relations."
          ]
        }
      ]
    }
  },
  {
    "id": 36,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Hard",
    "title": "University Course Syllabus Topics (1NF to 2NF)",
    "relation": "SYLLABUS_RAW(Course_Code, Course_Title, Module_No, Module_Name, Topics)",
    "sampleData": {
      "headers": [
        "Course_Code",
        "Course_Title",
        "Module_No",
        "Module_Name",
        "Topics"
      ],
      "rows": [
        [
          "CS101",
          "Intro to CS",
          "1",
          "Basics",
          "Variables, Data Types, Control Flow"
        ],
        [
          "CS101",
          "Intro to CS",
          "2",
          "Functions",
          "Recursion, Scope"
        ]
      ]
    },
    "fds": [
      "Course_Code → Course_Title",
      "(Course_Code, Module_No) → Module_Name",
      "(Course_Code, Module_No, Topic) → Uniqueness"
    ],
    "tasks": [
      "Explain the 1NF violation and convert to 1NF.",
      "Identify the 1NF candidate key.",
      "Identify all partial dependencies and decompose to 2NF."
    ],
    "solution": {
      "candidateKey": "(Course_Code, Module_No, Topic)",
      "explanation": "Step 1: 1NF Evaluation & Conversion — The Topics column contains comma-separated lists, violating 1NF. First, we flatten Topics into individual atomic rows. The resulting 1NF candidate key is (Course_Code, Module_No, Topic). Step 2: 2NF Evaluation — Course_Code is a proper subset of the key and determines Course_Title (Partial Dependency #1). (Course_Code, Module_No) is a proper subset of the key and determines Module_Name (Partial Dependency #2). Both violate 2NF! Step 3: 2NF Decomposition — Extract COURSE and MODULE tables; retain MODULE_TOPIC.",
      "tables": [
        {
          "caption": "2NF Decomposed Syllabus Architecture",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes",
            "Dependency Resolved"
          ],
          "rows": [
            [
              "COURSE",
              "Course_Code",
              "None",
              "Course_Code, Course_Title",
              "Course_Code → Course_Title"
            ],
            [
              "MODULE",
              "(Course_Code, Module_No)",
              "Course_Code → COURSE",
              "Course_Code, Module_No, Module_Name",
              "(Course_Code, Module_No) → Module_Name"
            ],
            [
              "MODULE_TOPIC",
              "(Course_Code, Module_No, Topic)",
              "(Course_Code, Module_No) → MODULE",
              "Course_Code, Module_No, Topic",
              "Atomic topic associations"
            ]
          ]
        }
      ],
      "keyTakeaway": "Converting unnormalized nested data requires first unnesting to 1NF, then isolating multi-level partial dependencies into 2NF.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Evaluation & Conversion",
          "points": [
            "The Topics column contains comma-separated lists, violating 1NF.",
            "First, we flatten Topics into individual atomic rows.",
            "The resulting 1NF candidate key is (Course_Code, Module_No, Topic)."
          ]
        },
        {
          "num": "2",
          "title": "2NF Evaluation",
          "points": [
            "Course_Code is a proper subset of the key and determines Course_Title (Partial Dependency #1).",
            "(Course_Code, Module_No) is a proper subset of the key and determines Module_Name (Partial Dependency #2).",
            "Both violate 2NF!"
          ]
        },
        {
          "num": "3",
          "title": "2NF Decomposition",
          "points": [
            "Extract COURSE and MODULE tables; retain MODULE_TOPIC."
          ]
        }
      ]
    }
  },
  {
    "id": 37,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Hard",
    "title": "Vehicle Rental Reservation System 2NF",
    "relation": "RENTAL(Rental_ID, Vehicle_VIN, Customer_ID, Customer_Name, Customer_License, Vehicle_Model, Daily_Rate, Rental_Days)",
    "fds": [
      "Customer_ID → Customer_Name, Customer_License",
      "Vehicle_VIN → Vehicle_Model, Daily_Rate",
      "(Rental_ID, Vehicle_VIN, Customer_ID) → Rental_Days"
    ],
    "tasks": [
      "Verify 1NF condition.",
      "State candidate key.",
      "Identify partial dependencies.",
      "Decompose into 2NF relations."
    ],
    "solution": {
      "candidateKey": "(Rental_ID, Vehicle_VIN, Customer_ID)",
      "explanation": "Step 1: 1NF Verification — RENTAL is in 1NF because all attributes contain scalar values. Step 2: Candidate Key — (Rental_ID, Vehicle_VIN, Customer_ID). Step 3: 2NF Violation — Customer_ID determines Customer_Name and License; Vehicle_VIN determines Model and Daily_Rate. Both depend on strict proper subsets of the candidate key, violating 2NF. Step 4: 2NF Decomposition — Extract CUSTOMER, VEHICLE, and RENTAL_CONTRACT relations.",
      "tables": [
        {
          "caption": "2NF Normalized Vehicle Rental Schema",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "CUSTOMER",
              "Customer_ID",
              "None",
              "Customer_ID, Customer_Name, Customer_License"
            ],
            [
              "VEHICLE",
              "Vehicle_VIN",
              "None",
              "Vehicle_VIN, Vehicle_Model, Daily_Rate"
            ],
            [
              "RENTAL_CONTRACT",
              "(Rental_ID, Vehicle_VIN, Customer_ID)",
              "Vehicle_VIN → VEHICLE,\nCustomer_ID → CUSTOMER",
              "Rental_ID, Vehicle_VIN, Customer_ID, Rental_Days"
            ]
          ]
        }
      ],
      "keyTakeaway": "2NF ensures that vehicle fleet specs and customer profiles are maintained independently of individual rental contracts.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "RENTAL is in 1NF because all attributes contain scalar values."
          ]
        },
        {
          "num": "2",
          "title": "Candidate Key",
          "points": [
            "(Rental_ID, Vehicle_VIN, Customer_ID)."
          ]
        },
        {
          "num": "3",
          "title": "2NF Violation",
          "points": [
            "Customer_ID determines Customer_Name and License; Vehicle_VIN determines Model and Daily_Rate.",
            "Both depend on strict proper subsets of the candidate key, violating 2NF."
          ]
        },
        {
          "num": "4",
          "title": "2NF Decomposition",
          "points": [
            "Extract CUSTOMER, VEHICLE, and RENTAL_CONTRACT relations."
          ]
        }
      ]
    }
  },
  {
    "id": 38,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Hard",
    "title": "Research Project Grant Allocation 2NF",
    "relation": "RESEARCH_GRANT(Grant_No, Researcher_ID, Agency_Name, Agency_Country, Researcher_Name, Department, Allocated_Budget)",
    "fds": [
      "Grant_No → Agency_Name, Agency_Country",
      "Researcher_ID → Researcher_Name, Department",
      "(Grant_No, Researcher_ID) → Allocated_Budget"
    ],
    "tasks": [
      "Check 1NF compliance.",
      "Identify candidate key.",
      "Identify 2NF violations.",
      "Provide 2NF schema."
    ],
    "solution": {
      "candidateKey": "(Grant_No, Researcher_ID)",
      "explanation": "Step 1: 1NF Verification — Relation RESEARCH_GRANT is in 1NF (atomic scalar domains throughout). Step 2: Candidate Key — (Grant_No, Researcher_ID). Prime = {Grant_No, Researcher_ID}. Non-prime = {Agency_Name, Agency_Country, Researcher_Name, Department, Allocated_Budget}. Step 3: 2NF Violation — Grant_No determines agency information; Researcher_ID determines researcher profile. Both are partial dependencies on subsets of the composite candidate key. Step 4: 2NF Decomposition — Create GRANT_MASTER, RESEARCHER, and GRANT_ALLOCATION tables.",
      "tables": [
        {
          "caption": "2NF Research Grant Schema",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "GRANT_MASTER",
              "Grant_No",
              "None",
              "Grant_No, Agency_Name, Agency_Country"
            ],
            [
              "RESEARCHER",
              "Researcher_ID",
              "None",
              "Researcher_ID, Researcher_Name, Department"
            ],
            [
              "GRANT_ALLOCATION",
              "(Grant_No, Researcher_ID)",
              "Grant_No → GRANT_MASTER,\nResearcher_ID → RESEARCHER",
              "Grant_No, Researcher_ID, Allocated_Budget"
            ]
          ]
        }
      ],
      "keyTakeaway": "2NF prevents repeating funding agency details across multiple co-investigators.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "Relation RESEARCH_GRANT is in 1NF (atomic scalar domains throughout)."
          ]
        },
        {
          "num": "2",
          "title": "Candidate Key",
          "points": [
            "(Grant_No, Researcher_ID).",
            "Prime = {Grant_No, Researcher_ID}.",
            "Non-prime = {Agency_Name, Agency_Country, Researcher_Name, Department, Allocated_Budget}."
          ]
        },
        {
          "num": "3",
          "title": "2NF Violation",
          "points": [
            "Grant_No determines agency information; Researcher_ID determines researcher profile.",
            "Both are partial dependencies on subsets of the composite candidate key."
          ]
        },
        {
          "num": "4",
          "title": "2NF Decomposition",
          "points": [
            "Create GRANT_MASTER, RESEARCHER, and GRANT_ALLOCATION tables."
          ]
        }
      ]
    }
  },
  {
    "id": 39,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Hard",
    "title": "Music Album Track Recording 2NF",
    "relation": "ALBUM_TRACK(Album_ID, Track_No, Album_Title, Release_Year, Track_Title, Duration_Sec)",
    "fds": [
      "Album_ID → Album_Title, Release_Year",
      "(Album_ID, Track_No) → Track_Title, Duration_Sec"
    ],
    "tasks": [
      "State 1NF verification.",
      "Determine candidate key.",
      "Identify partial dependency violating 2NF.",
      "Decompose into 2NF relations."
    ],
    "solution": {
      "candidateKey": "(Album_ID, Track_No)",
      "explanation": "Step 1: 1NF Verification — ALBUM_TRACK is already in 1NF because all attributes have atomic, scalar values. Step 2: Candidate Key — (Album_ID, Track_No). Non-prime attributes: {Album_Title, Release_Year, Track_Title, Duration_Sec}. Step 3: 2NF Violation — Album_ID is a strict proper subset of (Album_ID, Track_No) and determines Album_Title and Release_Year. This partial dependency violates 2NF. Track_Title and Duration_Sec depend fully on the composite key. Step 4: 2NF Decomposition — Extract ALBUM(Album_ID, Album_Title, Release_Year) and TRACK(Album_ID, Track_No, Track_Title, Duration_Sec).",
      "tables": [
        {
          "caption": "2NF Music Catalog Decomposition",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "ALBUM",
              "Album_ID",
              "None",
              "Album_ID, Album_Title, Release_Year"
            ],
            [
              "TRACK",
              "(Album_ID, Track_No)",
              "Album_ID → ALBUM",
              "Album_ID, Track_No, Track_Title, Duration_Sec"
            ]
          ]
        }
      ],
      "keyTakeaway": "Album metadata is separated from individual track listings to eliminate modification anomalies on album title updates.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "ALBUM_TRACK is already in 1NF because all attributes have atomic, scalar values."
          ]
        },
        {
          "num": "2",
          "title": "Candidate Key",
          "points": [
            "(Album_ID, Track_No).",
            "Non-prime attributes: {Album_Title, Release_Year, Track_Title, Duration_Sec}."
          ]
        },
        {
          "num": "3",
          "title": "2NF Violation",
          "points": [
            "Album_ID is a strict proper subset of (Album_ID, Track_No) and determines Album_Title and Release_Year.",
            "This partial dependency violates 2NF.",
            "Track_Title and Duration_Sec depend fully on the composite key."
          ]
        },
        {
          "num": "4",
          "title": "2NF Decomposition",
          "points": [
            "Extract ALBUM(Album_ID, Album_Title, Release_Year) and TRACK(Album_ID, Track_No, Track_Title, Duration_Sec)."
          ]
        }
      ]
    }
  },
  {
    "id": 40,
    "category": "1nf-2nf",
    "categoryLabel": "1NF & 2NF Normalization",
    "difficulty": "Hard",
    "title": "3-Attribute Composite Key with Multi-Level Partials",
    "relation": "R(A, B, C, D, E, F, G)",
    "fds": [
      "A → D",
      "AB → E",
      "BC → F",
      "(A, B, C) → G"
    ],
    "tasks": [
      "Verify 1NF condition.",
      "Determine the candidate key of R.",
      "Identify all 1-attribute and 2-attribute partial dependencies.",
      "Decompose into complete 2NF relations."
    ],
    "solution": {
      "candidateKey": "(A, B, C)",
      "explanation": "Step 1: 1NF Verification — Relation R is in 1NF as all attributes contain atomic values. Step 2: Candidate Key — ABC+ = {A,B,C,D,E,F,G} = R. Since no smaller combination derives all attributes, ABC is the candidate key. Non-prime: {D, E, F, G}. Step 3: 2NF Evaluation — A is a strict subset of ABC determining D (1-attribute partial). AB is a strict subset of ABC determining E (2-attribute partial). BC is a strict subset of ABC determining F (2-attribute partial). All three violate 2NF! Step 4: 2NF Decomposition — Isolate each partial into its own relation with determinant as PK.",
      "tables": [
        {
          "caption": "2NF Multi-Level Partial Decomposition",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes",
            "Dependency Preserved"
          ],
          "rows": [
            [
              "R1",
              "A",
              "None",
              "A, D",
              "A → D (1-attribute partial)"
            ],
            [
              "R2",
              "(A, B)",
              "A → R1",
              "A, B, E",
              "AB → E (2-attribute partial)"
            ],
            [
              "R3",
              "(B, C)",
              "None",
              "B, C, F",
              "BC → F (2-attribute partial)"
            ],
            [
              "R4",
              "(A, B, C)",
              "(A, B) → R2,\n(B, C) → R3",
              "A, B, C, G",
              "(A, B, C) → G (Full key dependency)"
            ]
          ]
        }
      ],
      "keyTakeaway": "In higher-order composite keys (e.g. 3 attributes), partial dependencies can arise from singletons (A) or pairs (AB, BC).",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "Relation R is in 1NF as all attributes contain atomic values."
          ]
        },
        {
          "num": "2",
          "title": "Candidate Key",
          "points": [
            "ABC+ = {A,B,C,D,E,F,G} = R.",
            "Since no smaller combination derives all attributes, ABC is the candidate key.",
            "Non-prime: {D, E, F, G}."
          ]
        },
        {
          "num": "3",
          "title": "2NF Evaluation",
          "points": [
            "A is a strict subset of ABC determining D (1-attribute partial).",
            "AB is a strict subset of ABC determining E (2-attribute partial).",
            "BC is a strict subset of ABC determining F (2-attribute partial).",
            "All three violate 2NF!"
          ]
        },
        {
          "num": "4",
          "title": "2NF Decomposition",
          "points": [
            "Isolate each partial into its own relation with determinant as PK."
          ]
        }
      ]
    }
  },
  {
    "id": 41,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Easy",
    "title": "Employee–Department Transitive Dependency (3NF)",
    "relation": "EMPLOYEE(Emp_ID, Emp_Name, Dept_ID, Dept_Name, Dept_Location)",
    "fds": [
      "Emp_ID → Emp_Name, Dept_ID",
      "Dept_ID → Dept_Name, Dept_Location"
    ],
    "tasks": [
      "Verify whether the relation is in 1NF and 2NF.",
      "Identify the candidate key.",
      "Identify the transitive dependency violating 3NF.",
      "Decompose into 3NF relations specifying primary and foreign keys."
    ],
    "solution": {
      "candidateKey": "Emp_ID",
      "explanation": "Step 1: 1NF Verification — The relation is in 1NF because all attributes have atomic, scalar values and there are no repeating groups. Step 2: 2NF Verification — The Candidate Key is Emp_ID (a single attribute). Because the candidate key is a single attribute, it has no strict proper subsets. Thus, partial dependencies are mathematically impossible, and the relation automatically satisfies 2NF! Step 3: 3NF Evaluation — A relation is in 3NF if for every non-trivial FD X → Y, either X is a superkey OR Y is a prime attribute. In Dept_ID → {Dept_Name, Dept_Location}, Dept_ID is NOT a superkey and the dependent attributes are non-prime. This creates a transitive dependency: Emp_ID → Dept_ID → {Dept_Name, Dept_Location}, violating 3NF! Step 4: 3NF Decomposition — Extract DEPARTMENT(Dept_ID, Dept_Name, Dept_Location) with Dept_ID as PK, and retain Dept_ID as a Foreign Key in EMPLOYEE(Emp_ID, Emp_Name, Dept_ID).",
      "tables": [
        {
          "caption": "3NF Relational Decomposition",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Non-Key Attributes",
            "Dependency Preserved"
          ],
          "rows": [
            [
              "DEPARTMENT",
              "Dept_ID",
              "None",
              "Dept_Name, Dept_Location",
              "Dept_ID → Dept_Name, Dept_Location"
            ],
            [
              "EMPLOYEE",
              "Emp_ID",
              "Dept_ID → DEPARTMENT",
              "Emp_Name",
              "Emp_ID → Emp_Name, Dept_ID"
            ]
          ]
        }
      ],
      "keyTakeaway": "Every 3NF analysis begins by verifying 1NF and 2NF. In single-attribute keys, 2NF is automatic, and 3NF eliminates transitive dependencies (non-key → non-key).",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "The relation is in 1NF because all attributes have atomic, scalar values and there are no repeating groups."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "The Candidate Key is Emp_ID (a single attribute).",
            "Because the candidate key is a single attribute, it has no strict proper subsets.",
            "Thus, partial dependencies are mathematically impossible, and the relation automatically satisfies 2NF!"
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "A relation is in 3NF if for every non-trivial FD X → Y, either X is a superkey OR Y is a prime attribute.",
            "In Dept_ID → {Dept_Name, Dept_Location}, Dept_ID is NOT a superkey and the dependent attributes are non-prime.",
            "This creates a transitive dependency: Emp_ID → Dept_ID → {Dept_Name, Dept_Location}, violating 3NF!"
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Extract DEPARTMENT(Dept_ID, Dept_Name, Dept_Location) with Dept_ID as PK, and retain Dept_ID as a Foreign Key in EMPLOYEE(Emp_ID, Emp_Name, Dept_ID)."
          ]
        }
      ]
    }
  },
  {
    "id": 42,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Medium",
    "title": "University Enrollment Multi-Tier Normalization",
    "relation": "ENROLLMENT(Student_ID, Course_ID, Student_Name, Course_Name, Instructor_ID, Instructor_Name, Grade)",
    "fds": [
      "Student_ID → Student_Name",
      "Course_ID → Course_Name, Instructor_ID",
      "Instructor_ID → Instructor_Name",
      "(Student_ID, Course_ID) → Grade"
    ],
    "tasks": [
      "Verify 1NF status.",
      "Show how 2NF resolves partial dependencies.",
      "Identify the remaining transitive dependency and convert to 3NF."
    ],
    "solution": {
      "candidateKey": "(Student_ID, Course_ID)",
      "explanation": "Step 1: 1NF Verification — All attributes are atomic scalar values, satisfying 1NF. Step 2: 2NF Verification & Decomposition — Candidate key is (Student_ID, Course_ID). Partial dependencies exist: Student_ID → Student_Name and Course_ID → {Course_Name, Instructor_ID}. Resolving to 2NF produces STUDENT, COURSE_TEMP, and ENROLLMENT. Step 3: 3NF Evaluation — Within COURSE_TEMP, Course_ID determines Instructor_ID, and Instructor_ID determines Instructor_Name. Because Instructor_ID is not a superkey and Instructor_Name is non-prime, Course_ID → Instructor_ID → Instructor_Name is a transitive dependency violating 3NF! Step 4: 3NF Decomposition — Extract INSTRUCTOR(Instructor_ID, Instructor_Name) and link COURSE to it via Foreign Key.",
      "tables": [
        {
          "caption": "Complete 3NF Relational Architecture",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Non-Key Attributes",
            "Role"
          ],
          "rows": [
            [
              "STUDENT",
              "Student_ID",
              "None",
              "Student_Name",
              "Student Master Entity (from 2NF)"
            ],
            [
              "INSTRUCTOR",
              "Instructor_ID",
              "None",
              "Instructor_Name",
              "Instructor Master Entity (from 3NF)"
            ],
            [
              "COURSE",
              "Course_ID",
              "Instructor_ID → INSTRUCTOR",
              "Course_Name, Instructor_ID",
              "Course with Instructor FK"
            ],
            [
              "ENROLLMENT",
              "(Student_ID, Course_ID)",
              "Student_ID → STUDENT,\nCourse_ID → COURSE",
              "Grade",
              "Enrollment transaction"
            ]
          ]
        }
      ],
      "keyTakeaway": "Sequential normalization: 2NF isolates partial dependencies, then 3NF eliminates transitive instructor dependencies.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "All attributes are atomic scalar values, satisfying 1NF."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification & Decomposition",
          "points": [
            "Candidate key is (Student_ID, Course_ID).",
            "Partial dependencies exist: Student_ID → Student_Name and Course_ID → {Course_Name, Instructor_ID}.",
            "Resolving to 2NF produces STUDENT, COURSE_TEMP, and ENROLLMENT."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Within COURSE_TEMP, Course_ID determines Instructor_ID, and Instructor_ID determines Instructor_Name.",
            "Because Instructor_ID is not a superkey and Instructor_Name is non-prime, Course_ID → Instructor_ID → Instructor_Name is a transitive dependency violating 3NF!"
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Extract INSTRUCTOR(Instructor_ID, Instructor_Name) and link COURSE to it via Foreign Key."
          ]
        }
      ]
    }
  },
  {
    "id": 43,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Medium",
    "title": "Comprehensive Library Loan Schema (3NF)",
    "relation": "BOOK_LOAN(Book_ID, Title, Author_ID, Author_Name, Publisher_ID, Publisher_Name)",
    "fds": [
      "Book_ID → Title, Author_ID, Publisher_ID",
      "Author_ID → Author_Name",
      "Publisher_ID → Publisher_Name"
    ],
    "tasks": [
      "Verify 1NF and 2NF compliance.",
      "Find candidate key.",
      "Identify dual transitive dependencies.",
      "Decompose into 3NF schema."
    ],
    "solution": {
      "candidateKey": "Book_ID",
      "explanation": "Step 1: 1NF Verification — All column attributes have atomic values; 1NF is satisfied. Step 2: 2NF Verification — The Candidate Key is Book_ID (singleton). A single-attribute key has no proper subsets, so partial dependencies cannot exist. The relation is automatically in 2NF! Step 3: 3NF Evaluation — Author_ID and Publisher_ID are non-prime attributes. Author_ID → Author_Name and Publisher_ID → Publisher_Name are non-key determinants violating 3NF (transitive chains: Book_ID → Author_ID → Author_Name and Book_ID → Publisher_ID → Publisher_Name). Step 4: 3NF Decomposition — Extract AUTHOR and PUBLISHER master tables; keep Author_ID and Publisher_ID as FKs in BOOK.",
      "tables": [
        {
          "caption": "3NF Library Relational Architecture",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes",
            "Dependency Resolved"
          ],
          "rows": [
            [
              "AUTHOR",
              "Author_ID",
              "None",
              "Author_ID, Author_Name",
              "Author_ID → Author_Name"
            ],
            [
              "PUBLISHER",
              "Publisher_ID",
              "None",
              "Publisher_ID, Publisher_Name",
              "Publisher_ID → Publisher_Name"
            ],
            [
              "BOOK",
              "Book_ID",
              "Author_ID → AUTHOR,\nPublisher_ID → PUBLISHER",
              "Book_ID, Title, Author_ID, Publisher_ID",
              "Book catalog entity"
            ]
          ]
        }
      ],
      "keyTakeaway": "Single-attribute keys automatically satisfy 2NF, allowing direct focus on eliminating transitive dependencies for 3NF.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "All column attributes have atomic values; 1NF is satisfied."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "The Candidate Key is Book_ID (singleton).",
            "A single-attribute key has no proper subsets, so partial dependencies cannot exist.",
            "The relation is automatically in 2NF!"
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Author_ID and Publisher_ID are non-prime attributes.",
            "Author_ID → Author_Name and Publisher_ID → Publisher_Name are non-key determinants violating 3NF (transitive chains: Book_ID → Author_ID → Author_Name and Book_ID → Publisher_ID → Publisher_Name)."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Extract AUTHOR and PUBLISHER master tables; keep Author_ID and Publisher_ID as FKs in BOOK."
          ]
        }
      ]
    }
  },
  {
    "id": 44,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Medium",
    "title": "Enterprise Sales Order-Customer-Salesperson 3NF",
    "relation": "SALES_ORDER(Order_ID, Order_Date, Customer_ID, Customer_Name, Customer_City, Salesperson_ID, Salesperson_Name)",
    "fds": [
      "Order_ID → Order_Date, Customer_ID, Salesperson_ID",
      "Customer_ID → Customer_Name, Customer_City",
      "Salesperson_ID → Salesperson_Name"
    ],
    "tasks": [
      "Verify 1NF and 2NF.",
      "Identify the candidate key.",
      "Identify both transitive dependencies.",
      "Decompose into 3NF relational tables."
    ],
    "solution": {
      "candidateKey": "Order_ID",
      "explanation": "Step 1: 1NF Verification — All attributes are scalar; 1NF is satisfied. Step 2: 2NF Verification — Candidate Key is Order_ID (single attribute). With no proper subsets of the key possible, partial dependencies cannot exist, so the relation is automatically in 2NF. Step 3: 3NF Evaluation — Customer_ID → {Customer_Name, Customer_City} and Salesperson_ID → Salesperson_Name are transitive dependencies because neither Customer_ID nor Salesperson_ID is a superkey, and all RHS attributes are non-prime. This violates 3NF. Step 4: 3NF Decomposition — Extract CUSTOMER and SALESPERSON tables; retain FKs in SALES_ORDER.",
      "tables": [
        {
          "caption": "3NF Normalized Sales Architecture",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "CUSTOMER",
              "Customer_ID",
              "None",
              "Customer_ID, Customer_Name, Customer_City"
            ],
            [
              "SALESPERSON",
              "Salesperson_ID",
              "None",
              "Salesperson_ID, Salesperson_Name"
            ],
            [
              "SALES_ORDER",
              "Order_ID",
              "Customer_ID → CUSTOMER,\nSalesperson_ID → SALESPERSON",
              "Order_ID, Order_Date, Customer_ID, Salesperson_ID"
            ]
          ]
        }
      ],
      "keyTakeaway": "Extracting customer and staff entities eliminates repetitive customer name and city updates across hundreds of sales orders.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "All attributes are scalar; 1NF is satisfied."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is Order_ID (single attribute).",
            "With no proper subsets of the key possible, partial dependencies cannot exist, so the relation is automatically in 2NF."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Customer_ID → {Customer_Name, Customer_City} and Salesperson_ID → Salesperson_Name are transitive dependencies because neither Customer_ID nor Salesperson_ID is a superkey, and all RHS attributes are non-prime.",
            "This violates 3NF."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Extract CUSTOMER and SALESPERSON tables; retain FKs in SALES_ORDER."
          ]
        }
      ]
    }
  },
  {
    "id": 45,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Medium",
    "title": "University Course Registration & Department Head 3NF",
    "relation": "COURSE_OFFERING(Course_ID, Course_Title, Credits, Dept_ID, Dept_Name, Dept_Head, Office_No)",
    "fds": [
      "Course_ID → Course_Title, Credits, Dept_ID",
      "Dept_ID → Dept_Name, Dept_Head, Office_No"
    ],
    "tasks": [
      "State 1NF and 2NF compliance.",
      "Find candidate key.",
      "Detect the 3NF transitive dependency.",
      "Provide 3NF schema tables."
    ],
    "solution": {
      "candidateKey": "Course_ID",
      "explanation": "Step 1: 1NF Verification — Atomic values in all columns; 1NF holds. Step 2: 2NF Verification — Candidate Key is Course_ID (singleton). No composite key exists, so partial dependencies are impossible; 2NF is automatically satisfied. Step 3: 3NF Evaluation — Dept_ID determines Dept_Name, Dept_Head, and Office_No. Since Dept_ID is not a superkey of COURSE_OFFERING and its dependents are non-prime, this is a transitive dependency (Course_ID → Dept_ID → Department Details) violating 3NF. Step 4: 3NF Decomposition — Decompose into DEPARTMENT and COURSE relations.",
      "tables": [
        {
          "caption": "3NF University Course & Department Schema",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "DEPARTMENT",
              "Dept_ID",
              "None",
              "Dept_ID, Dept_Name, Dept_Head, Office_No"
            ],
            [
              "COURSE",
              "Course_ID",
              "Dept_ID → DEPARTMENT",
              "Course_ID, Course_Title, Credits, Dept_ID"
            ]
          ]
        }
      ],
      "keyTakeaway": "3NF prevents department head updates from requiring updates across every course offered by that department.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "Atomic values in all columns; 1NF holds."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is Course_ID (singleton).",
            "No composite key exists, so partial dependencies are impossible; 2NF is automatically satisfied."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Dept_ID determines Dept_Name, Dept_Head, and Office_No.",
            "Since Dept_ID is not a superkey of COURSE_OFFERING and its dependents are non-prime, this is a transitive dependency (Course_ID → Dept_ID → Department Details) violating 3NF."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Decompose into DEPARTMENT and COURSE relations."
          ]
        }
      ]
    }
  },
  {
    "id": 46,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Medium",
    "title": "Dual-Branch Banking Region Transitive Chain 3NF",
    "relation": "ACCOUNT(Account_No, Balance, Branch_ID, Branch_Name, Region_ID, Regional_Director)",
    "fds": [
      "Account_No → Balance, Branch_ID",
      "Branch_ID → Branch_Name, Region_ID",
      "Region_ID → Regional_Director"
    ],
    "tasks": [
      "Verify 1NF and 2NF conditions.",
      "Trace the 2-step transitive dependency chain.",
      "Decompose into 3NF schema."
    ],
    "solution": {
      "candidateKey": "Account_No",
      "explanation": "Step 1: 1NF Verification — 1NF is satisfied as all column domains are scalar. Step 2: 2NF Verification — Candidate Key is Account_No (single attribute). Since no proper subset of the key exists, 2NF is automatically satisfied. Step 3: 3NF Evaluation — Account_No → Branch_ID → Region_ID → Regional_Director forms a 2-step transitive chain. Branch_ID is not a superkey, and Region_ID is not a superkey. Both violate 3NF. Step 4: 3NF Decomposition — Decompose from leaf to root: REGION(Region_ID, Regional_Director), BRANCH(Branch_ID, Branch_Name, Region_ID), and ACCOUNT(Account_No, Balance, Branch_ID).",
      "tables": [
        {
          "caption": "3NF Multi-Tier Banking Schema",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "REGION",
              "Region_ID",
              "None",
              "Region_ID, Regional_Director"
            ],
            [
              "BRANCH",
              "Branch_ID",
              "Region_ID → REGION",
              "Branch_ID, Branch_Name, Region_ID"
            ],
            [
              "ACCOUNT",
              "Account_No",
              "Branch_ID → BRANCH",
              "Account_No, Balance, Branch_ID"
            ]
          ]
        }
      ],
      "keyTakeaway": "Multi-tier transitive chains (A → B → C → D) must be decomposed into cascading parent-child foreign key relationships in 3NF.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "1NF is satisfied as all column domains are scalar."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is Account_No (single attribute).",
            "Since no proper subset of the key exists, 2NF is automatically satisfied."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Account_No → Branch_ID → Region_ID → Regional_Director forms a 2-step transitive chain.",
            "Branch_ID is not a superkey, and Region_ID is not a superkey.",
            "Both violate 3NF."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Decompose from leaf to root: REGION(Region_ID, Regional_Director), BRANCH(Branch_ID, Branch_Name, Region_ID), and ACCOUNT(Account_No, Balance, Branch_ID)."
          ]
        }
      ]
    }
  },
  {
    "id": 47,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Hard",
    "title": "Mixed 2NF and 3NF Challenge (Student, Project, Supervisor)",
    "relation": "PROJECT_RECORD(Student_ID, Project_ID, Student_Name, Project_Title, Supervisor_ID, Supervisor_Name, Supervisor_Email, Score)",
    "fds": [
      "Student_ID → Student_Name",
      "Project_ID → Project_Title, Supervisor_ID",
      "Supervisor_ID → Supervisor_Name, Supervisor_Email",
      "(Student_ID, Project_ID) → Score"
    ],
    "tasks": [
      "Confirm 1NF compliance.",
      "Identify 2NF partial dependencies and resolve to 2NF.",
      "Identify the 3NF transitive dependency in the resulting tables and resolve to 3NF."
    ],
    "solution": {
      "candidateKey": "(Student_ID, Project_ID)",
      "explanation": "Step 1: 1NF Verification — Relation is in 1NF with atomic attributes. Step 2: 2NF Verification & Conversion — Candidate Key is (Student_ID, Project_ID). Partial dependencies: Student_ID → Student_Name and Project_ID → {Project_Title, Supervisor_ID}. Decomposing to 2NF produces STUDENT, PROJECT_TEMP, and PROJECT_SCORE. Step 3: 3NF Evaluation — Inside PROJECT_TEMP, Project_ID → Supervisor_ID and Supervisor_ID → {Supervisor_Name, Supervisor_Email}. Supervisor_ID is not a superkey and its attributes are non-prime. This is a transitive dependency violating 3NF! Step 4: 3NF Decomposition — Extract SUPERVISOR and link PROJECT to it via Foreign Key.",
      "tables": [
        {
          "caption": "3NF Fully Normalized Architecture",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes",
            "Normal Form Resolved"
          ],
          "rows": [
            [
              "STUDENT",
              "Student_ID",
              "None",
              "Student_ID, Student_Name",
              "2NF (Partial Eliminated)"
            ],
            [
              "SUPERVISOR",
              "Supervisor_ID",
              "None",
              "Supervisor_ID, Supervisor_Name, Supervisor_Email",
              "3NF (Transitive Eliminated)"
            ],
            [
              "PROJECT",
              "Project_ID",
              "Supervisor_ID → SUPERVISOR",
              "Project_ID, Project_Title, Supervisor_ID",
              "3NF (Transitive Master)"
            ],
            [
              "PROJECT_SCORE",
              "(Student_ID, Project_ID)",
              "Student_ID → STUDENT,\nProject_ID → PROJECT",
              "Student_ID, Project_ID, Score",
              "2NF/3NF (Pure Intersection)"
            ]
          ]
        }
      ],
      "keyTakeaway": "A comprehensive normalization pipeline first eliminates partial dependencies (2NF), then systematically eliminates transitive dependencies (3NF).",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "Relation is in 1NF with atomic attributes."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification & Conversion",
          "points": [
            "Candidate Key is (Student_ID, Project_ID).",
            "Partial dependencies: Student_ID → Student_Name and Project_ID → {Project_Title, Supervisor_ID}.",
            "Decomposing to 2NF produces STUDENT, PROJECT_TEMP, and PROJECT_SCORE."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Inside PROJECT_TEMP, Project_ID → Supervisor_ID and Supervisor_ID → {Supervisor_Name, Supervisor_Email}.",
            "Supervisor_ID is not a superkey and its attributes are non-prime.",
            "This is a transitive dependency violating 3NF!"
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Extract SUPERVISOR and link PROJECT to it via Foreign Key."
          ]
        }
      ]
    }
  },
  {
    "id": 48,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Medium",
    "title": "Real Estate Property Listing, Owner, and Brokerage 3NF",
    "relation": "PROPERTY_LISTING(Property_ID, Address, Square_Feet, Owner_ID, Owner_Name, Owner_Phone, Agency_ID, Agency_Name)",
    "fds": [
      "Property_ID → Address, Square_Feet, Owner_ID, Agency_ID",
      "Owner_ID → Owner_Name, Owner_Phone",
      "Agency_ID → Agency_Name"
    ],
    "tasks": [
      "Verify 1NF and 2NF conditions.",
      "Identify the candidate key.",
      "Identify the transitive dependencies.",
      "Decompose into 3NF schema tables."
    ],
    "solution": {
      "candidateKey": "Property_ID",
      "explanation": "Step 1: 1NF Verification — PROPERTY_LISTING is in 1NF because all attributes contain atomic values. Step 2: 2NF Verification — Candidate Key is Property_ID (single attribute). Since no proper subset of the key exists, partial dependencies are impossible, so 2NF is automatically satisfied. Step 3: 3NF Evaluation — Owner_ID → {Owner_Name, Owner_Phone} and Agency_ID → Agency_Name are transitive dependencies because neither Owner_ID nor Agency_ID is a superkey, and all RHS attributes are non-prime. Step 4: 3NF Decomposition — Extract OWNER and AGENCY tables; retain Owner_ID and Agency_ID as Foreign Keys in PROPERTY.",
      "tables": [
        {
          "caption": "3NF Real Estate Relational Schema",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "OWNER",
              "Owner_ID",
              "None",
              "Owner_ID, Owner_Name, Owner_Phone"
            ],
            [
              "AGENCY",
              "Agency_ID",
              "None",
              "Agency_ID, Agency_Name"
            ],
            [
              "PROPERTY",
              "Property_ID",
              "Owner_ID → OWNER,\nAgency_ID → AGENCY",
              "Property_ID, Address, Square_Feet, Owner_ID, Agency_ID"
            ]
          ]
        }
      ],
      "keyTakeaway": "Extracting independent owner and brokerage entities into 3NF prevents data anomalies when property owners change contact info.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "PROPERTY_LISTING is in 1NF because all attributes contain atomic values."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is Property_ID (single attribute).",
            "Since no proper subset of the key exists, partial dependencies are impossible, so 2NF is automatically satisfied."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Owner_ID → {Owner_Name, Owner_Phone} and Agency_ID → Agency_Name are transitive dependencies because neither Owner_ID nor Agency_ID is a superkey, and all RHS attributes are non-prime."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Extract OWNER and AGENCY tables; retain Owner_ID and Agency_ID as Foreign Keys in PROPERTY."
          ]
        }
      ]
    }
  },
  {
    "id": 49,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Medium",
    "title": "Airline Passenger Ticket Booking, Flight, and Aircraft 3NF",
    "relation": "TICKET(Ticket_No, Passenger_ID, Passenger_Name, Flight_No, Flight_Date, Aircraft_ID, Aircraft_Model, Seat_Capacity)",
    "fds": [
      "Ticket_No → Passenger_ID, Flight_No, Flight_Date",
      "Passenger_ID → Passenger_Name",
      "Flight_No → Aircraft_ID",
      "Aircraft_ID → Aircraft_Model, Seat_Capacity"
    ],
    "tasks": [
      "Verify 1NF and 2NF conditions.",
      "Find candidate key.",
      "Identify all transitive dependencies.",
      "Decompose into 3NF relations."
    ],
    "solution": {
      "candidateKey": "Ticket_No",
      "explanation": "Step 1: 1NF Verification — 1NF is satisfied as all column domains are scalar. Step 2: 2NF Verification — Candidate Key is Ticket_No (single attribute). With no proper subsets possible, partial dependencies cannot exist; 2NF is automatically satisfied. Step 3: 3NF Evaluation — Ticket_No transitively determines Passenger_Name via Passenger_ID. It transitively determines Aircraft_ID via Flight_No, and Aircraft specifications via Aircraft_ID. All three determinants (Passenger_ID, Flight_No, Aircraft_ID) are non-keys violating 3NF! Step 4: 3NF Decomposition — Decompose into PASSENGER, AIRCRAFT, FLIGHT, and TICKET.",
      "tables": [
        {
          "caption": "3NF Airline Reservation Relational Architecture",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "PASSENGER",
              "Passenger_ID",
              "None",
              "Passenger_ID, Passenger_Name"
            ],
            [
              "AIRCRAFT",
              "Aircraft_ID",
              "None",
              "Aircraft_ID, Aircraft_Model, Seat_Capacity"
            ],
            [
              "FLIGHT",
              "Flight_No",
              "Aircraft_ID → AIRCRAFT",
              "Flight_No, Aircraft_ID"
            ],
            [
              "TICKET",
              "Ticket_No",
              "Passenger_ID → PASSENGER,\nFlight_No → FLIGHT",
              "Ticket_No, Passenger_ID, Flight_No, Flight_Date"
            ]
          ]
        }
      ],
      "keyTakeaway": "In 3NF, flight schedules, aircraft specifications, and passenger profiles are decoupled from individual passenger booking tickets.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "1NF is satisfied as all column domains are scalar."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is Ticket_No (single attribute).",
            "With no proper subsets possible, partial dependencies cannot exist; 2NF is automatically satisfied."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Ticket_No transitively determines Passenger_Name via Passenger_ID.",
            "It transitively determines Aircraft_ID via Flight_No, and Aircraft specifications via Aircraft_ID.",
            "All three determinants (Passenger_ID, Flight_No, Aircraft_ID) are non-keys violating 3NF!"
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Decompose into PASSENGER, AIRCRAFT, FLIGHT, and TICKET."
          ]
        }
      ]
    }
  },
  {
    "id": 50,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Medium",
    "title": "University Faculty, Department, and Academic College 3NF",
    "relation": "FACULTY(Faculty_ID, Faculty_Name, Rank, Dept_ID, Dept_Name, College_ID, College_Name, Dean_Name)",
    "fds": [
      "Faculty_ID → Faculty_Name, Rank, Dept_ID",
      "Dept_ID → Dept_Name, College_ID",
      "College_ID → College_Name, Dean_Name"
    ],
    "tasks": [
      "Verify 1NF and 2NF compliance.",
      "State candidate key.",
      "Identify the transitive dependency chain.",
      "Decompose into 3NF relations."
    ],
    "solution": {
      "candidateKey": "Faculty_ID",
      "explanation": "Step 1: 1NF Verification — 1NF is satisfied as all attribute values are atomic. Step 2: 2NF Verification — Candidate Key is Faculty_ID (singleton). A single-attribute key has no proper subsets, so partial dependencies cannot exist. The relation is automatically in 2NF! Step 3: 3NF Evaluation — Faculty_ID → Dept_ID → College_ID → {College_Name, Dean_Name} is a transitive chain. Neither Dept_ID nor College_ID is a superkey, violating 3NF. Step 4: 3NF Decomposition — Extract COLLEGE, DEPARTMENT, and FACULTY relations.",
      "tables": [
        {
          "caption": "3NF University Academic Hierarchy Schema",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "COLLEGE",
              "College_ID",
              "None",
              "College_ID, College_Name, Dean_Name"
            ],
            [
              "DEPARTMENT",
              "Dept_ID",
              "College_ID → COLLEGE",
              "Dept_ID, Dept_Name, College_ID"
            ],
            [
              "FACULTY",
              "Faculty_ID",
              "Dept_ID → DEPARTMENT",
              "Faculty_ID, Faculty_Name, Rank, Dept_ID"
            ]
          ]
        }
      ],
      "keyTakeaway": "Academic hierarchical structures (Faculty → Department → College) map naturally to clean 3NF cascading foreign keys.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "1NF is satisfied as all attribute values are atomic."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is Faculty_ID (singleton).",
            "A single-attribute key has no proper subsets, so partial dependencies cannot exist.",
            "The relation is automatically in 2NF!"
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Faculty_ID → Dept_ID → College_ID → {College_Name, Dean_Name} is a transitive chain.",
            "Neither Dept_ID nor College_ID is a superkey, violating 3NF."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Extract COLLEGE, DEPARTMENT, and FACULTY relations."
          ]
        }
      ]
    }
  },
  {
    "id": 51,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Medium",
    "title": "Healthcare Clinic Consultation, Doctor, and Medical Specialty 3NF",
    "relation": "CONSULTATION(Consult_ID, Patient_ID, Consult_Date, Doctor_ID, Doctor_Name, Specialty_ID, Specialty_Name, Clinic_Room)",
    "fds": [
      "Consult_ID → Patient_ID, Consult_Date, Doctor_ID",
      "Doctor_ID → Doctor_Name, Specialty_ID",
      "Specialty_ID → Specialty_Name, Clinic_Room"
    ],
    "tasks": [
      "Confirm 1NF and 2NF compliance.",
      "Identify candidate key.",
      "Trace transitive dependencies.",
      "Produce 3NF schema tables."
    ],
    "solution": {
      "candidateKey": "Consult_ID",
      "explanation": "Step 1: 1NF Verification — Atomic attributes across all columns; 1NF holds. Step 2: 2NF Verification — Candidate Key is Consult_ID (single attribute). Partial dependencies cannot exist on single-attribute keys, so 2NF is automatically satisfied. Step 3: 3NF Evaluation — Consult_ID determines Doctor_ID, which determines Doctor_Name and Specialty_ID. Specialty_ID determines Specialty_Name and Clinic_Room. Both Doctor_ID and Specialty_ID are non-key determinants violating 3NF. Step 4: 3NF Decomposition — Decompose into SPECIALTY, DOCTOR, and CONSULTATION relations.",
      "tables": [
        {
          "caption": "3NF Medical Consultation Schema",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "SPECIALTY",
              "Specialty_ID",
              "None",
              "Specialty_ID, Specialty_Name, Clinic_Room"
            ],
            [
              "DOCTOR",
              "Doctor_ID",
              "Specialty_ID → SPECIALTY",
              "Doctor_ID, Doctor_Name, Specialty_ID"
            ],
            [
              "CONSULTATION",
              "Consult_ID",
              "Doctor_ID → DOCTOR",
              "Consult_ID, Patient_ID, Consult_Date, Doctor_ID"
            ]
          ]
        }
      ],
      "keyTakeaway": "Separating medical specialties and doctor credentials from consultation records eliminates clinic room update anomalies.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "Atomic attributes across all columns; 1NF holds."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is Consult_ID (single attribute).",
            "Partial dependencies cannot exist on single-attribute keys, so 2NF is automatically satisfied."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Consult_ID determines Doctor_ID, which determines Doctor_Name and Specialty_ID.",
            "Specialty_ID determines Specialty_Name and Clinic_Room.",
            "Both Doctor_ID and Specialty_ID are non-key determinants violating 3NF."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Decompose into SPECIALTY, DOCTOR, and CONSULTATION relations."
          ]
        }
      ]
    }
  },
  {
    "id": 52,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Medium",
    "title": "Vehicle Fleet Lease, Customer, and Insurance Policy 3NF",
    "relation": "VEHICLE_LEASE(Lease_ID, Start_Date, Monthly_Payment, Customer_ID, Customer_Name, Customer_City, Policy_No, Insurer_Name, Coverage_Limit)",
    "fds": [
      "Lease_ID → Start_Date, Monthly_Payment, Customer_ID, Policy_No",
      "Customer_ID → Customer_Name, Customer_City",
      "Policy_No → Insurer_Name, Coverage_Limit"
    ],
    "tasks": [
      "Verify 1NF and 2NF conditions.",
      "Identify candidate key.",
      "Identify 3NF transitive dependencies.",
      "Decompose into 3NF schema."
    ],
    "solution": {
      "candidateKey": "Lease_ID",
      "explanation": "Step 1: 1NF Verification — 1NF is satisfied as all column domains are scalar. Step 2: 2NF Verification — Candidate Key is Lease_ID (single attribute). Because there are no proper subsets of Lease_ID, partial dependencies are impossible, so 2NF is automatically satisfied. Step 3: 3NF Evaluation — Customer_ID → {Customer_Name, Customer_City} and Policy_No → {Insurer_Name, Coverage_Limit} are transitive dependencies because neither Customer_ID nor Policy_No is a superkey, and all RHS attributes are non-prime. Step 4: 3NF Decomposition — Extract CUSTOMER and INSURANCE_POLICY relations; link via FKs in VEHICLE_LEASE.",
      "tables": [
        {
          "caption": "3NF Fleet Lease Schema Architecture",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "CUSTOMER",
              "Customer_ID",
              "None",
              "Customer_ID, Customer_Name, Customer_City"
            ],
            [
              "INSURANCE_POLICY",
              "Policy_No",
              "None",
              "Policy_No, Insurer_Name, Coverage_Limit"
            ],
            [
              "VEHICLE_LEASE",
              "Lease_ID",
              "Customer_ID → CUSTOMER,\nPolicy_No → INSURANCE_POLICY",
              "Lease_ID, Start_Date, Monthly_Payment, Customer_ID, Policy_No"
            ]
          ]
        }
      ],
      "keyTakeaway": "Customer demographic details and insurance policy terms must be maintained in their own 3NF tables.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "1NF is satisfied as all column domains are scalar."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is Lease_ID (single attribute).",
            "Because there are no proper subsets of Lease_ID, partial dependencies are impossible, so 2NF is automatically satisfied."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Customer_ID → {Customer_Name, Customer_City} and Policy_No → {Insurer_Name, Coverage_Limit} are transitive dependencies because neither Customer_ID nor Policy_No is a superkey, and all RHS attributes are non-prime."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Extract CUSTOMER and INSURANCE_POLICY relations; link via FKs in VEHICLE_LEASE."
          ]
        }
      ]
    }
  },
  {
    "id": 53,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Medium",
    "title": "Employee Project Task Assignment & Department 3NF",
    "relation": "TASK_ASSIGNMENT(Emp_ID, Task_ID, Hours_Allocated, Emp_Name, Dept_ID, Dept_Name, Dept_Location)",
    "fds": [
      "(Emp_ID, Task_ID) → Hours_Allocated",
      "Emp_ID → Emp_Name, Dept_ID",
      "Dept_ID → Dept_Name, Dept_Location"
    ],
    "tasks": [
      "Verify 1NF status.",
      "Explain the 2NF partial dependency and decompose to 2NF.",
      "Identify the 3NF transitive dependency and decompose to 3NF."
    ],
    "solution": {
      "candidateKey": "(Emp_ID, Task_ID)",
      "explanation": "Step 1: 1NF Verification — All attributes contain atomic values; 1NF holds. Step 2: 2NF Verification & Decomposition — Candidate Key is (Emp_ID, Task_ID). Emp_ID determines Emp_Name and Dept_ID (partial dependency on proper subset of key). Resolving to 2NF creates EMPLOYEE_TEMP(Emp_ID, Emp_Name, Dept_ID, Dept_Name, Dept_Location) and TASK_HOURS(Emp_ID, Task_ID, Hours_Allocated). Step 3: 3NF Evaluation — In EMPLOYEE_TEMP, Emp_ID → Dept_ID and Dept_ID → {Dept_Name, Dept_Location}. Dept_ID is not a superkey, violating 3NF! Step 4: 3NF Decomposition — Extract DEPARTMENT(Dept_ID, Dept_Name, Dept_Location) with Dept_ID as PK, leaving Dept_ID as FK in EMPLOYEE.",
      "tables": [
        {
          "caption": "3NF Decomposed Relational Schema",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "DEPARTMENT",
              "Dept_ID",
              "None",
              "Dept_ID, Dept_Name, Dept_Location"
            ],
            [
              "EMPLOYEE",
              "Emp_ID",
              "Dept_ID → DEPARTMENT",
              "Emp_ID, Emp_Name, Dept_ID"
            ],
            [
              "TASK_HOURS",
              "(Emp_ID, Task_ID)",
              "Emp_ID → EMPLOYEE",
              "Emp_ID, Task_ID, Hours_Allocated"
            ]
          ]
        }
      ],
      "keyTakeaway": "Progressive normalization: 2NF extracts employee data from the assignment table, then 3NF extracts department data from employee records.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "All attributes contain atomic values; 1NF holds."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification & Decomposition",
          "points": [
            "Candidate Key is (Emp_ID, Task_ID).",
            "Emp_ID determines Emp_Name and Dept_ID (partial dependency on proper subset of key).",
            "Resolving to 2NF creates EMPLOYEE_TEMP(Emp_ID, Emp_Name, Dept_ID, Dept_Name, Dept_Location) and TASK_HOURS(Emp_ID, Task_ID, Hours_Allocated)."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "In EMPLOYEE_TEMP, Emp_ID → Dept_ID and Dept_ID → {Dept_Name, Dept_Location}.",
            "Dept_ID is not a superkey, violating 3NF!"
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Extract DEPARTMENT(Dept_ID, Dept_Name, Dept_Location) with Dept_ID as PK, leaving Dept_ID as FK in EMPLOYEE."
          ]
        }
      ]
    }
  },
  {
    "id": 54,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Hard",
    "title": "University Class Timetable, Classroom, and Building 3NF",
    "relation": "TIMETABLE(Schedule_ID, Course_Code, Day_Of_Week, Start_Time, Room_No, Capacity, Building_ID, Building_Name, Campus_Location)",
    "fds": [
      "Schedule_ID → Course_Code, Day_Of_Week, Start_Time, Room_No",
      "Room_No → Capacity, Building_ID",
      "Building_ID → Building_Name, Campus_Location"
    ],
    "tasks": [
      "Check 1NF and 2NF compliance.",
      "Identify candidate key.",
      "Identify the 2-step transitive dependency chain.",
      "Decompose into 3NF relations."
    ],
    "solution": {
      "candidateKey": "Schedule_ID",
      "explanation": "Step 1: 1NF Verification — All column attributes hold atomic values; 1NF is satisfied. Step 2: 2NF Verification — Candidate Key is Schedule_ID (single attribute). Since no proper subset of the key exists, 2NF is automatically satisfied. Step 3: 3NF Evaluation — Schedule_ID → Room_No → Building_ID → {Building_Name, Campus_Location} forms a 2-step transitive chain. Neither Room_No nor Building_ID is a superkey of TIMETABLE, and both determine non-prime attributes. This violates 3NF. Step 4: 3NF Decomposition — Extract BUILDING, CLASSROOM, and SCHEDULE relations.",
      "tables": [
        {
          "caption": "3NF Timetable Schema Architecture",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "BUILDING",
              "Building_ID",
              "None",
              "Building_ID, Building_Name, Campus_Location"
            ],
            [
              "CLASSROOM",
              "Room_No",
              "Building_ID → BUILDING",
              "Room_No, Capacity, Building_ID"
            ],
            [
              "CLASS_SCHEDULE",
              "Schedule_ID",
              "Room_No → CLASSROOM",
              "Schedule_ID, Course_Code, Day_Of_Week, Start_Time, Room_No"
            ]
          ]
        }
      ],
      "keyTakeaway": "Campus facilities (Building and Classroom) are maintained independently of term class timetable schedules.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "All column attributes hold atomic values; 1NF is satisfied."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is Schedule_ID (single attribute).",
            "Since no proper subset of the key exists, 2NF is automatically satisfied."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Schedule_ID → Room_No → Building_ID → {Building_Name, Campus_Location} forms a 2-step transitive chain.",
            "Neither Room_No nor Building_ID is a superkey of TIMETABLE, and both determine non-prime attributes.",
            "This violates 3NF."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Extract BUILDING, CLASSROOM, and SCHEDULE relations."
          ]
        }
      ]
    }
  },
  {
    "id": 55,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Hard",
    "title": "Banking Customer Account, Branch, and Bank Manager 3NF",
    "relation": "BANK_ACCOUNT(Account_No, Account_Type, Balance, Branch_Code, Branch_Name, Branch_City, Manager_ID, Manager_Name, Manager_Phone)",
    "fds": [
      "Account_No → Account_Type, Balance, Branch_Code",
      "Branch_Code → Branch_Name, Branch_City, Manager_ID",
      "Manager_ID → Manager_Name, Manager_Phone"
    ],
    "tasks": [
      "Verify 1NF and 2NF.",
      "Determine candidate key.",
      "Identify transitive dependencies.",
      "Decompose into 3NF schema."
    ],
    "solution": {
      "candidateKey": "Account_No",
      "explanation": "Step 1: 1NF Verification — All attributes contain scalar values, satisfying 1NF. Step 2: 2NF Verification — Candidate Key is Account_No (single attribute). Partial dependencies cannot exist on a single-attribute key, so 2NF is automatically satisfied. Step 3: 3NF Evaluation — Account_No transitively determines branch details via Branch_Code, and branch transitively determines manager contact details via Manager_ID. Branch_Code and Manager_ID are non-key determinants violating 3NF. Step 4: 3NF Decomposition — Form MANAGER, BRANCH, and BANK_ACCOUNT relations.",
      "tables": [
        {
          "caption": "3NF Banking Schema Architecture",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "MANAGER",
              "Manager_ID",
              "None",
              "Manager_ID, Manager_Name, Manager_Phone"
            ],
            [
              "BRANCH",
              "Branch_Code",
              "Manager_ID → MANAGER",
              "Branch_Code, Branch_Name, Branch_City, Manager_ID"
            ],
            [
              "ACCOUNT",
              "Account_No",
              "Branch_Code → BRANCH",
              "Account_No, Account_Type, Balance, Branch_Code"
            ]
          ]
        }
      ],
      "keyTakeaway": "3NF isolates bank branch staff directories from day-to-day customer deposit account records.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "All attributes contain scalar values, satisfying 1NF."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is Account_No (single attribute).",
            "Partial dependencies cannot exist on a single-attribute key, so 2NF is automatically satisfied."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Account_No transitively determines branch details via Branch_Code, and branch transitively determines manager contact details via Manager_ID.",
            "Branch_Code and Manager_ID are non-key determinants violating 3NF."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Form MANAGER, BRANCH, and BANK_ACCOUNT relations."
          ]
        }
      ]
    }
  },
  {
    "id": 56,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Hard",
    "title": "Hospital Inpatient Ward Admission, Ward Master, and Head Nurse 3NF",
    "relation": "ADMISSION(Admission_ID, Patient_ID, Admission_Date, Ward_No, Ward_Type, Floor_No, Head_Nurse_ID, Nurse_Name, Nurse_Phone)",
    "fds": [
      "Admission_ID → Patient_ID, Admission_Date, Ward_No",
      "Ward_No → Ward_Type, Floor_No, Head_Nurse_ID",
      "Head_Nurse_ID → Nurse_Name, Nurse_Phone"
    ],
    "tasks": [
      "Confirm 1NF and 2NF.",
      "Find candidate key.",
      "Identify the transitive dependency chain.",
      "Decompose into 3NF relational tables."
    ],
    "solution": {
      "candidateKey": "Admission_ID",
      "explanation": "Step 1: 1NF Verification — ADMISSION is in 1NF as all columns contain atomic scalar data. Step 2: 2NF Verification — Candidate Key is Admission_ID (single attribute). No proper subset of Admission_ID exists, making partial dependencies impossible; 2NF is automatically satisfied. Step 3: 3NF Evaluation — Admission_ID → Ward_No → Head_Nurse_ID → {Nurse_Name, Nurse_Phone} is a 2-tier transitive dependency chain violating 3NF. Step 4: 3NF Decomposition — Decompose into HEAD_NURSE, WARD, and ADMISSION tables.",
      "tables": [
        {
          "caption": "3NF Inpatient Admission Relational Schema",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "HEAD_NURSE",
              "Head_Nurse_ID",
              "None",
              "Head_Nurse_ID, Nurse_Name, Nurse_Phone"
            ],
            [
              "WARD",
              "Ward_No",
              "Head_Nurse_ID → HEAD_NURSE",
              "Ward_No, Ward_Type, Floor_No, Head_Nurse_ID"
            ],
            [
              "ADMISSION",
              "Admission_ID",
              "Ward_No → WARD",
              "Admission_ID, Patient_ID, Admission_Date, Ward_No"
            ]
          ]
        }
      ],
      "keyTakeaway": "Nursing staff assignments and ward architectural specs are decoupled from transient patient hospital stays.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "ADMISSION is in 1NF as all columns contain atomic scalar data."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is Admission_ID (single attribute).",
            "No proper subset of Admission_ID exists, making partial dependencies impossible; 2NF is automatically satisfied."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Admission_ID → Ward_No → Head_Nurse_ID → {Nurse_Name, Nurse_Phone} is a 2-tier transitive dependency chain violating 3NF."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Decompose into HEAD_NURSE, WARD, and ADMISSION tables."
          ]
        }
      ]
    }
  },
  {
    "id": 57,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Hard",
    "title": "E-Commerce Order Fulfillment, Shipping Courier, and Warehouse 3NF",
    "relation": "FULFILLMENT(Fulfillment_ID, Order_ID, Ship_Date, Warehouse_ID, Warehouse_City, Courier_ID, Courier_Name, Service_Level)",
    "fds": [
      "Fulfillment_ID → Order_ID, Ship_Date, Warehouse_ID, Courier_ID",
      "Warehouse_ID → Warehouse_City",
      "Courier_ID → Courier_Name, Service_Level"
    ],
    "tasks": [
      "Verify 1NF and 2NF compliance.",
      "Identify candidate key.",
      "Identify transitive dependencies.",
      "Decompose into 3NF relations."
    ],
    "solution": {
      "candidateKey": "Fulfillment_ID",
      "explanation": "Step 1: 1NF Verification — 1NF is satisfied because all attribute values are atomic scalars. Step 2: 2NF Verification — Candidate Key is Fulfillment_ID (single attribute). With no composite key, partial dependencies cannot exist; 2NF is automatically satisfied. Step 3: 3NF Evaluation — Warehouse_ID determines Warehouse_City, and Courier_ID determines Courier_Name and Service_Level. Since Warehouse_ID and Courier_ID are not superkeys and their RHS attributes are non-prime, both are transitive dependencies violating 3NF. Step 4: 3NF Decomposition — Form WAREHOUSE, COURIER, and SHIPMENT_RECORD tables.",
      "tables": [
        {
          "caption": "3NF Logistics Fulfillment Schema",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "WAREHOUSE",
              "Warehouse_ID",
              "None",
              "Warehouse_ID, Warehouse_City"
            ],
            [
              "COURIER",
              "Courier_ID",
              "None",
              "Courier_ID, Courier_Name, Service_Level"
            ],
            [
              "SHIPMENT_RECORD",
              "Fulfillment_ID",
              "Warehouse_ID → WAREHOUSE,\nCourier_ID → COURIER",
              "Fulfillment_ID, Order_ID, Ship_Date, Warehouse_ID, Courier_ID"
            ]
          ]
        }
      ],
      "keyTakeaway": "3NF ensures courier contracts and warehouse locations can be updated without touching historical shipment tracking rows.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "1NF is satisfied because all attribute values are atomic scalars."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is Fulfillment_ID (single attribute).",
            "With no composite key, partial dependencies cannot exist; 2NF is automatically satisfied."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Warehouse_ID determines Warehouse_City, and Courier_ID determines Courier_Name and Service_Level.",
            "Since Warehouse_ID and Courier_ID are not superkeys and their RHS attributes are non-prime, both are transitive dependencies violating 3NF."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Form WAREHOUSE, COURIER, and SHIPMENT_RECORD tables."
          ]
        }
      ]
    }
  },
  {
    "id": 58,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Medium",
    "title": "Hotel Room Reservation, Room Category, and Pricing Tier 3NF",
    "relation": "BOOKING_MASTER(Booking_ID, Guest_ID, Check_In, Room_No, Room_Type_Code, Category_Name, Base_Rate, Max_Occupancy)",
    "fds": [
      "Booking_ID → Guest_ID, Check_In, Room_No",
      "Room_No → Room_Type_Code",
      "Room_Type_Code → Category_Name, Base_Rate, Max_Occupancy"
    ],
    "tasks": [
      "Confirm 1NF and 2NF conditions.",
      "State candidate key.",
      "Trace the transitive dependencies.",
      "Decompose into 3NF relations."
    ],
    "solution": {
      "candidateKey": "Booking_ID",
      "explanation": "Step 1: 1NF Verification — All attributes contain atomic values; 1NF holds. Step 2: 2NF Verification — Candidate Key is Booking_ID (single attribute). A single-attribute key has no proper subsets, so 2NF is automatically satisfied. Step 3: 3NF Evaluation — Booking_ID → Room_No → Room_Type_Code → {Category_Name, Base_Rate, Max_Occupancy} is a 2-step transitive chain. Neither Room_No nor Room_Type_Code is a superkey of BOOKING_MASTER, violating 3NF. Step 4: 3NF Decomposition — Extract ROOM_CATEGORY, ROOM, and RESERVATION relations.",
      "tables": [
        {
          "caption": "3NF Hotel Room & Category Schema",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "ROOM_CATEGORY",
              "Room_Type_Code",
              "None",
              "Room_Type_Code, Category_Name, Base_Rate, Max_Occupancy"
            ],
            [
              "ROOM",
              "Room_No",
              "Room_Type_Code → ROOM_CATEGORY",
              "Room_No, Room_Type_Code"
            ],
            [
              "RESERVATION",
              "Booking_ID",
              "Room_No → ROOM",
              "Booking_ID, Guest_ID, Check_In, Room_No"
            ]
          ]
        }
      ],
      "keyTakeaway": "Pricing and capacity tiers belong to the Room Category entity, not to individual physical rooms or guest reservations.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "All attributes contain atomic values; 1NF holds."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is Booking_ID (single attribute).",
            "A single-attribute key has no proper subsets, so 2NF is automatically satisfied."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Booking_ID → Room_No → Room_Type_Code → {Category_Name, Base_Rate, Max_Occupancy} is a 2-step transitive chain.",
            "Neither Room_No nor Room_Type_Code is a superkey of BOOKING_MASTER, violating 3NF."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Extract ROOM_CATEGORY, ROOM, and RESERVATION relations."
          ]
        }
      ]
    }
  },
  {
    "id": 59,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Medium",
    "title": "Software Project Bug Tracking, Module, and Lead Developer 3NF",
    "relation": "DEFECT_REPORT(Bug_ID, Summary, Severity, Module_ID, Module_Name, Lead_Dev_ID, Dev_Name, Dev_Email)",
    "fds": [
      "Bug_ID → Summary, Severity, Module_ID",
      "Module_ID → Module_Name, Lead_Dev_ID",
      "Lead_Dev_ID → Dev_Name, Dev_Email"
    ],
    "tasks": [
      "Verify 1NF and 2NF compliance.",
      "Identify candidate key.",
      "Identify the transitive dependency chain.",
      "Produce 3NF schema tables."
    ],
    "solution": {
      "candidateKey": "Bug_ID",
      "explanation": "Step 1: 1NF Verification — All column attributes hold atomic values, satisfying 1NF. Step 2: 2NF Verification — Candidate Key is Bug_ID (single attribute). Since partial dependencies are impossible on single-attribute keys, 2NF is automatically satisfied. Step 3: 3NF Evaluation — Bug_ID transitively determines developer contact info via Module_ID and Lead_Dev_ID. Neither Module_ID nor Lead_Dev_ID is a superkey, violating 3NF. Step 4: 3NF Decomposition — Decompose into DEVELOPER, SOFTWARE_MODULE, and BUG_REPORT relations.",
      "tables": [
        {
          "caption": "3NF Bug Tracking Relational Architecture",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes"
          ],
          "rows": [
            [
              "DEVELOPER",
              "Lead_Dev_ID",
              "None",
              "Lead_Dev_ID, Dev_Name, Dev_Email"
            ],
            [
              "SOFTWARE_MODULE",
              "Module_ID",
              "Lead_Dev_ID → DEVELOPER",
              "Module_ID, Module_Name, Lead_Dev_ID"
            ],
            [
              "BUG_REPORT",
              "Bug_ID",
              "Module_ID → SOFTWARE_MODULE",
              "Bug_ID, Summary, Severity, Module_ID"
            ]
          ]
        }
      ],
      "keyTakeaway": "3NF decouples developer personnel records from software module architectures and issue tracking logs.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "All column attributes hold atomic values, satisfying 1NF."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is Bug_ID (single attribute).",
            "Since partial dependencies are impossible on single-attribute keys, 2NF is automatically satisfied."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "Bug_ID transitively determines developer contact info via Module_ID and Lead_Dev_ID.",
            "Neither Module_ID nor Lead_Dev_ID is a superkey, violating 3NF."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Decompose into DEVELOPER, SOFTWARE_MODULE, and BUG_REPORT relations."
          ]
        }
      ]
    }
  },
  {
    "id": 60,
    "category": "3nf",
    "categoryLabel": "3NF Normalization",
    "difficulty": "Hard",
    "title": "Global Supply Chain Multi-Country ERP 3NF Schema",
    "relation": "PURCHASE_ORDER(PO_Number, PO_Date, Vendor_ID, Vendor_Name, Country_Code, Country_Tax_Rate, Warehouse_ID, Warehouse_Country)",
    "fds": [
      "PO_Number → PO_Date, Vendor_ID, Warehouse_ID",
      "Vendor_ID → Vendor_Name, Country_Code",
      "Country_Code → Country_Tax_Rate",
      "Warehouse_ID → Warehouse_Country"
    ],
    "tasks": [
      "Confirm 1NF and 2NF status.",
      "Determine candidate key.",
      "Trace all transitive chains.",
      "Decompose into complete 3NF schema."
    ],
    "solution": {
      "candidateKey": "PO_Number",
      "explanation": "Step 1: 1NF Verification — All attributes contain scalar atomic values; 1NF is satisfied. Step 2: 2NF Verification — Candidate Key is PO_Number (single attribute). Partial dependencies cannot exist on single-attribute keys, so 2NF is automatically satisfied. Step 3: 3NF Evaluation — PO_Number → Vendor_ID → Country_Code → Country_Tax_Rate forms a 3-tier transitive chain. In addition, PO_Number → Warehouse_ID → Warehouse_Country forms an independent transitive branch. Vendor_ID, Country_Code, and Warehouse_ID are non-key determinants violating 3NF. Step 4: 3NF Decomposition — Decompose from leaf to root: COUNTRY_TAX, VENDOR, WAREHOUSE, and PURCHASE_ORDER.",
      "tables": [
        {
          "caption": "3NF Global Supply Chain Architecture",
          "headers": [
            "Relation Name",
            "Primary Key (PK)",
            "Foreign Key (FK)",
            "Attributes",
            "Purpose"
          ],
          "rows": [
            [
              "COUNTRY_TAX",
              "Country_Code",
              "None",
              "Country_Code, Country_Tax_Rate",
              "Country tariff reference"
            ],
            [
              "VENDOR",
              "Vendor_ID",
              "Country_Code → COUNTRY_TAX",
              "Vendor_ID, Vendor_Name, Country_Code",
              "Vendor master record"
            ],
            [
              "WAREHOUSE",
              "Warehouse_ID",
              "None",
              "Warehouse_ID, Warehouse_Country",
              "Depot master record"
            ],
            [
              "PURCHASE_ORDER",
              "PO_Number",
              "Vendor_ID → VENDOR,\nWarehouse_ID → WAREHOUSE",
              "PO_Number, PO_Date, Vendor_ID, Warehouse_ID",
              "PO transaction header"
            ]
          ]
        }
      ],
      "keyTakeaway": "In enterprise ERP systems, 3NF ensures country tax rates, vendor profiles, and warehouse locations are each mastered independently.",
      "steps": [
        {
          "num": "1",
          "title": "1NF Verification",
          "points": [
            "All attributes contain scalar atomic values; 1NF is satisfied."
          ]
        },
        {
          "num": "2",
          "title": "2NF Verification",
          "points": [
            "Candidate Key is PO_Number (single attribute).",
            "Partial dependencies cannot exist on single-attribute keys, so 2NF is automatically satisfied."
          ]
        },
        {
          "num": "3",
          "title": "3NF Evaluation",
          "points": [
            "PO_Number → Vendor_ID → Country_Code → Country_Tax_Rate forms a 3-tier transitive chain.",
            "In addition, PO_Number → Warehouse_ID → Warehouse_Country forms an independent transitive branch.",
            "Vendor_ID, Country_Code, and Warehouse_ID are non-key determinants violating 3NF."
          ]
        },
        {
          "num": "4",
          "title": "3NF Decomposition",
          "points": [
            "Decompose from leaf to root: COUNTRY_TAX, VENDOR, WAREHOUSE, and PURCHASE_ORDER."
          ]
        }
      ]
    }
  }
];

// Helper Functions
function getQuestionsByCategory(category) {
  if (!category || category === 'all') return QUESTIONS_DATA;
  return QUESTIONS_DATA.filter(q => q.category === category);
}

function getCategoryCounts() {
  return {
    all: QUESTIONS_DATA.length,
    "closures-keys": QUESTIONS_DATA.filter(q => q.category === "closures-keys").length,
    "1nf-2nf": QUESTIONS_DATA.filter(q => q.category === "1nf-2nf").length,
    "3nf": QUESTIONS_DATA.filter(q => q.category === "3nf").length
  };
}

if (typeof window !== 'undefined') {
  window.QUESTIONS_DATA = QUESTIONS_DATA;
  window.getQuestionsByCategory = getQuestionsByCategory;
  window.getCategoryCounts = getCategoryCounts;
}
if (typeof globalThis !== 'undefined') {
  globalThis.QUESTIONS_DATA = QUESTIONS_DATA;
  globalThis.getQuestionsByCategory = getQuestionsByCategory;
  globalThis.getCategoryCounts = getCategoryCounts;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { QUESTIONS_DATA, getQuestionsByCategory, getCategoryCounts };
}
