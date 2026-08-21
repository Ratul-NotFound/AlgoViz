// src/data/cLessons.js — 23-Chapter Master Curriculum for C Programming Academy
// Engineered with deep real-world relevance: What it is, Why it's used, Where it's applied in industry, and How it operates under the hood.

export const C_MODULES = [
  {
    id: 'mod-1',
    name: 'Module 1: Foundations of Programming & C',
    desc: 'What is programming, history of C, how computers execute code, and your first program',
    lessonSlugs: [
      'hello-world-intro',
      'writing-running-first-c-program',
    ],
  },
  {
    id: 'mod-2',
    name: 'Module 2: Variables, Data Types & Memory',
    desc: 'Storing numbers, characters, memory sizes, constants, ASCII, and type casting',
    lessonSlugs: [
      'variables-data-types',
      'constants-type-casting',
    ],
  },
  {
    id: 'mod-3',
    name: 'Module 3: Operators & Math Expressions',
    desc: 'Arithmetic, shortcuts, increment/decrement, and logical true/false conditions',
    lessonSlugs: [
      'arithmetic-assignment-operators',
      'relational-logical-operators',
    ],
  },
  {
    id: 'mod-4',
    name: 'Module 4: Standard Input & Output',
    desc: 'Talking to the user with printf(), reading keyboard inputs with scanf(), and format specifiers',
    lessonSlugs: [
      'input-output',
    ],
  },
  {
    id: 'mod-5',
    name: 'Module 5: Conditional Statements & Decisions',
    desc: 'Making smart choices with if, else-if ladders, nested checks, switch-case, and ternary operators',
    lessonSlugs: [
      'conditional-statements',
      'switch-case-statement',
    ],
  },
  {
    id: 'mod-6',
    name: 'Module 6: Loops & Repetition',
    desc: 'Automating tasks with while, do-while, for loops, nested patterns, break, and continue',
    lessonSlugs: [
      'while-do-while-loops',
      'for-loops-nested-patterns',
      'loop-control-break-continue',
    ],
  },
  {
    id: 'mod-7',
    name: 'Module 7: Arrays & Matrices',
    desc: '1D sequential lists, 0-based indexing, searching, and 2D grid matrices',
    lessonSlugs: [
      'arrays-matrices',
      '2d-arrays-matrices',
    ],
  },
  {
    id: 'mod-8',
    name: 'Module 8: Strings & Text Processing',
    desc: 'Character arrays, the null terminator (\\0), and string library tools (strlen, strcpy, strcmp)',
    lessonSlugs: [
      'strings-text-manipulation',
      'string-library-functions',
    ],
  },
  {
    id: 'mod-9',
    name: 'Module 9: Modular Programming & Functions',
    desc: 'Reusable helper functions, parameter passing, return values, and recursion call stack',
    lessonSlugs: [
      'functions-modular-programming',
      'recursion-call-stack',
    ],
  },
  {
    id: 'mod-10',
    name: 'Module 10: Pointers & Direct Memory Control',
    desc: 'Memory addresses (&), pointer dereferencing (*), pass-by-reference, and pointer arithmetic',
    lessonSlugs: [
      'pointers-memory-addresses',
      'pointers-arrays-functions',
    ],
  },
  {
    id: 'mod-11',
    name: 'Module 11: Custom Types, Dynamic Memory & Files',
    desc: 'Structures (struct), unions, enums, dynamic heap memory (malloc/free), and permanent file storage',
    lessonSlugs: [
      'structures-unions-enums',
      'dynamic-memory-allocation',
      'file-handling-persistent-data',
    ],
  },
];

export const C_LESSONS = [
  // ── CHAPTER 1 ──────────────────────────────────────────────────────────
  {
    id: 1,
    chapter: 1,
    moduleId: 'mod-1',
    moduleName: 'Module 1: Foundations of Programming & C',
    level: 'Beginner',
    slug: 'hello-world-intro',
    title: 'Chapter 1: Ground Zero — What is Programming & The Story of C',
    subtitle: 'Discover how computers execute instructions, why C was created, where it powers the modern world, and the 4 stages of compilation.',
    category: 'Foundations',
    readTime: '6 min',
    analogy: {
      title: 'The Master Chef & The Automated Recipe Machine',
      text: 'Think of your computer as a super-fast chef that only understands electrical switches (ON and OFF, or 1 and 0). If you tried to order food in raw electrical pulses, it would be impossible. A programming language like C is the recipe book you write in human-readable words, and the Compiler is the translator that turns your recipe into lightning-fast actions the computer executes.',
      properties: [
        { label: 'Transistors & Binary (0s/1s)', desc: 'Microscopic hardware switches turning electric currents on and off billions of times per second.' },
        { label: 'Human C Source Code (.c)', desc: 'The readable instructions and algorithms you write in your editor.' },
        { label: 'The Compiler (GCC/Clang)', desc: 'The expert translator that converts C words into native CPU machine instructions.' },
        { label: 'Executable Binary (.exe)', desc: 'The finished standalone app running directly on your CPU hardware at full speed.' },
      ],
    },
    tables: [
      {
        title: 'Why Was C Created & How It Changed the World',
        headers: ['Key Question', 'What Every Beginner & Student Should Know'],
        rows: [
          ['Who Created C?', 'Dennis Ritchie in 1972 at Bell Labs (AT&T) in Murray Hill, New Jersey, USA.'],
          ['Why Was It Invented?', 'To rewrite and build the UNIX operating system so programs could run on any hardware without rewriting assembly from scratch.'],
          ['The Mother of Modern Languages', 'C’s syntax and philosophy directly gave birth to C++, Java, JavaScript, Python, C#, PHP, Go, and Rust. Mastering C makes learning every other language effortless.'],
          ['Why C Over Other Languages?', 'While Python is great for scripting, C provides direct manual control over RAM, has 0 runtime bloat, and runs up to 50x faster.'],
        ],
      },
      {
        title: 'Where C Powers the Real World Today',
        headers: ['Industry & Application', 'How C Powers It Behind the Scenes'],
        rows: [
          ['Operating Systems', 'The core kernels of Microsoft Windows, Apple macOS, Linux, iOS, and Android are written in C.'],
          ['Spacecraft & Aviation', 'NASA Mars Rovers, flight navigation computers, and satellite telemetry rely on C for real-time safety.'],
          ['Electric Cars & Automotive', 'Tesla motor controllers, anti-lock braking systems (ABS), and airbag sensors run on embedded C microcontrollers.'],
          ['High-Speed Databases', 'PostgreSQL, MySQL, SQLite, Redis, and the Git version control system are built in pure C for raw speed.'],
          ['Game Engines & 3D Graphics', 'Unreal Engine core systems, GPU graphics drivers, and physics engines depend on C/C++ for maximum 120+ FPS performance.'],
        ],
      },
      {
        title: 'How a C Program Runs: The 4 Compilation Steps',
        headers: ['Step Name', 'What the Computer Does'],
        rows: [
          ['1. Preprocessing', 'Scans for # directives, expands header files like <stdio.h>, replaces macros, and strips out all comments.'],
          ['2. Compiling', 'Translates clean C code into assembly language tailored to your specific CPU architecture (x86_64 or ARM).'],
          ['3. Assembling', 'Converts assembly instructions into raw binary machine code object files (.o / .obj).'],
          ['4. Linking', 'Merges your object files with standard system libraries into the final runnable executable (.exe).'],
        ],
      },
    ],
    sections: [
      {
        title: '1. What is Programming? (From Electricity to Logic)',
        text: 'A computer cannot think, imagine, or make assumptions. It is simply a machine containing billions of microscopic switches called transistors. Programming is giving the computer a clear, step-by-step, ordered list of instructions to solve a problem—whether that is calculating payroll, simulating game physics, or encrypting web traffic.',
      },
      {
        title: '2. Why Start Your Coding Journey with C?',
        text: 'Modern languages hide how memory and computers actually work behind multiple layers of abstraction. C shows you the truth: how data lives in RAM, how memory addresses work, and how the CPU processes instructions. Once you understand C, you understand the computer itself.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Thinking computers understand human English directly',
        why: 'Computers only understand electrical high and low voltages (binary 0s and 1s).',
        fix: 'Always use a compiler like GCC or Clang to translate your C code into executable machine binaries.',
      },
    ],
    exercises: [
      {
        title: 'Welcome Challenge: Print Your First Console Message',
        task: 'Write a program that prints "Hello, World!" and "Welcome to C Programming Masterclass." on separate lines.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    printf("Welcome to C Programming Masterclass.\\n");
    return 0;
}`,
    expectedOutput: `Hello, World!
Welcome to C Programming Masterclass.`,
    quiz: {
      question: 'Who created the C programming language in 1972 at Bell Labs?',
      options: ['Dennis Ritchie', 'Guido van Rossum', 'James Gosling', 'Bjarne Stroustrup'],
      correctIndex: 0,
      explanation: 'Dennis Ritchie created C in 1972 at Bell Labs to write the UNIX operating system.',
    },
  },

  // ── CHAPTER 2 ──────────────────────────────────────────────────────────
  {
    id: 2,
    chapter: 2,
    moduleId: 'mod-1',
    moduleName: 'Module 1: Foundations of Programming & C',
    level: 'Beginner',
    slug: 'writing-running-first-c-program',
    title: 'Chapter 2: Writing & Running Your First C Program',
    subtitle: 'Learn the exact anatomy of every C program: headers, main entry point, statements, semicolons, and comments.',
    category: 'Foundations',
    readTime: '5 min',
    analogy: {
      title: 'The Front Door of a House',
      text: 'Every house has a main front door where guests enter. In C, `int main()` is the front door of your program. No matter how many thousands of lines exist, your computer always walks through `main()` first!',
      properties: [
        { label: '#include <stdio.h>', desc: 'Unpacking your toolbox of standard input/output functions before starting work' },
        { label: 'int main() { ... }', desc: 'The mandatory starting room of your entire program' },
        { label: 'Semicolons (;)', desc: 'The period at the end of every complete instruction sentence' },
        { label: 'return 0;', desc: 'Sending a clean exit code to the Operating System: 0 errors encountered!' },
      ],
    },
    tables: [
      {
        title: 'The 4 Essential Lines in Every C Program',
        headers: ['Line in Code', 'What It Does in Plain English'],
        rows: [
          ['#include <stdio.h>', 'Gives your code access to Standard Input/Output tools like printf().'],
          ['int main() { ... }', 'The mandatory entry point where program execution begins.'],
          ['printf("Hello!\\n");', 'Prints formatted text to the screen. \\n moves the cursor to a new line.'],
          ['return 0;', 'Tells the operating system that your program finished successfully with 0 errors.'],
        ],
      },
      {
        title: 'Common Escape Sequences in C',
        headers: ['Escape Code', 'Name', 'What It Outputs'],
        rows: [
          ['\\n', 'Newline', 'Moves cursor down to the start of the next line'],
          ['\\t', 'Horizontal Tab', 'Inserts 4 or 8 spaces for clean column alignment'],
          ['\\\\', 'Backslash', 'Prints a literal backslash character \\'],
          ['\\"', 'Double Quote', 'Prints a literal quotation mark " inside a string'],
        ],
      },
    ],
    sections: [
      {
        title: '1. The Golden Semicolon Rule (;)',
        text: 'In English, every sentence ends with a period. In C, every instruction statement MUST end with a semicolon `;`. If you forget it, the compiler cannot tell where one instruction ends and the next begins.',
        codeSnippet: `printf("First line\\n");
printf("Second line\\n");`,
        tip: 'If the compiler flags an error on line 6, always check if you forgot a semicolon on line 5!',
      },
      {
        title: '2. Writing Comments (Notes for Humans)',
        text: 'Comments are completely ignored by the compiler. Use `//` for single-line notes, and `/* ... */` for multi-line documentation.',
        codeSnippet: `// This is a single-line note for developers
/* This is a multi-line comment
   spanning multiple lines of notes */`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Typing Printf or PRINTF with capital letters',
        why: 'C is strictly case-sensitive. All keywords (int, main, printf, return) must be lowercase.',
        fix: 'printf("Hello!\\n");',
      },
      {
        mistake: 'Forgetting the closing curly brace }',
        why: 'Every opening brace { defining a block must have a matching closing brace }.',
        fix: 'Always ensure your int main() block ends with a closing } brace.',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Two-Line Greeting',
        task: 'Write a program that prints "Hello!" on line 1 and "Learning C is amazing!" on line 2.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    printf("Hello!\\n");
    printf("Learning C is amazing!\\n");
    return 0;
}`,
    expectedOutput: `Hello!
Learning C is amazing!`,
    quiz: {
      question: 'Where does the computer start running your C program?',
      options: ['Inside #include <stdio.h>', 'Inside the int main() function', 'At line 1 of the file', 'At the bottom of the file'],
      correctIndex: 1,
      explanation: 'Execution always begins inside the `int main()` function.',
    },
  },

  // ── CHAPTER 3 ──────────────────────────────────────────────────────────
  {
    id: 3,
    chapter: 3,
    moduleId: 'mod-2',
    moduleName: 'Module 2: Variables, Data Types & Memory',
    level: 'Beginner',
    slug: 'variables-data-types',
    title: 'Chapter 3: Variables, Basic Types & Memory Size',
    subtitle: 'Store whole numbers, decimals, and characters in RAM, and measure their exact byte sizes with sizeof().',
    category: 'Memory & Types',
    readTime: '6 min',
    analogy: {
      title: 'Labeled Storage Lockers in RAM',
      text: 'Variables are labeled storage lockers in your computer RAM. You give the locker a name (variable name), pick the size of the container (data type), and store a value inside using `=`.',
      properties: [
        { label: 'int (4 bytes)', desc: 'Whole numbers without decimals (-100, 0, 42, 9999)' },
        { label: 'float (4 bytes)', desc: 'Single-precision decimal numbers with 6-7 digits of precision' },
        { label: 'double (8 bytes)', desc: 'High-precision decimal numbers with up to 15 digits of precision' },
        { label: 'char (1 byte)', desc: 'A single character enclosed in single quotes (\'A\', \'$\', \'9\')' },
      ],
    },
    tables: [
      {
        title: 'Why, Where & How: C Data Types in the Real World',
        headers: ['Data Type', 'Why It Is Used', 'Where It Is Used in Real Life', 'Memory Size'],
        rows: [
          ['int', 'Whole integer counts without fractions', 'Counting YouTube video views, user IDs, loop iterations', '4 Bytes (32 bits)'],
          ['float', 'General decimal values with modest memory', 'GPS smartphone coordinates, game particle coordinates', '4 Bytes (32 bits)'],
          ['double', 'High-precision scientific & financial values', 'Banking monetary transactions, NASA orbital trajectory math', '8 Bytes (64 bits)'],
          ['char', 'Individual letters, symbols, or 8-bit bytes', 'Keyboard keys, blood types, text parser state flags', '1 Byte (8 bits)'],
        ],
      },
      {
        title: 'Format Specifiers Cheat Sheet for printf & scanf',
        headers: ['Data Type', 'printf Specifier', 'scanf Specifier', 'Example Literal'],
        rows: [
          ['int', '%d or %i', '%d', '42'],
          ['float', '%f or %.2f', '%f', '3.14f'],
          ['double', '%lf or %.4lf', '%lf', '2.718281828'],
          ['char', '%c', ' %c (with leading space)', "'Z'"],
        ],
      },
    ],
    sections: [
      {
        title: '1. What are Variables & Why are they Essential?',
        text: 'A variable is a named memory location in RAM where your program temporarily stores information while it is running. Without variables, a computer could never remember your username, calculate your shopping cart total, or track a player\'s health score in a game.',
      },
      {
        title: '2. Declaring, Initializing & Printing Variables',
        text: 'Declaration reserves memory space. Initialization puts the first value into that space. Always initialize variables to avoid reading random leftover "garbage values" in RAM.',
        codeSnippet: `int playerHealth = 100;
float movementSpeed = 5.75f;
char rankTier = 'S';
double bankBalance = 15420.50;

printf("Health: %d | Speed: %.2f | Rank: %c\\n", playerHealth, movementSpeed, rankTier);`,
      },
      {
        title: '3. Measuring Physical Memory with sizeof()',
        text: 'In C, you can measure the exact byte footprint of any variable or data type using the `sizeof()` operator:',
        codeSnippet: `printf("int size   : %zu bytes\\n", sizeof(int));
printf("char size  : %zu byte\\n", sizeof(char));
printf("double size: %zu bytes\\n", sizeof(double));`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Putting double quotes around a single char: char c = "A";',
        why: 'In C, single quotes \'A\' are for single 1-byte characters. Double quotes "A" create a 2-byte string with a null terminator.',
        fix: "char c = 'A';",
      },
      {
        mistake: 'Using an uninitialized variable: int count; printf("%d", count);',
        why: 'C does not automatically zero-out memory; count will contain unpredictable garbage data.',
        fix: 'int count = 0; // Always initialize!',
      },
    ],
    exercises: [
      {
        title: 'Challenge: Student Profile Card',
        task: 'Declare studentId = 1042, gpa = 3.85, and grade = \'A\'. Print them on a single formatted line.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    int studentId = 1042;
    float gpa = 3.85f;
    char grade = 'A';

    printf("Student #%d | GPA: %.2f | Grade: %c\\n", studentId, gpa, grade);
    printf("Memory Used by GPA: %zu bytes\\n", sizeof(gpa));
    return 0;
}`,
    expectedOutput: `Student #1042 | GPA: 3.85 | Grade: A
Memory Used by GPA: 4 bytes`,
    quiz: {
      question: 'Which format specifier is used to print an int in printf?',
      options: ['%f', '%c', '%d', '%s'],
      correctIndex: 2,
      explanation: '`%d` (or `%i`) is the standard format specifier for printing integers.',
    },
  },

  // ── CHAPTER 4 ──────────────────────────────────────────────────────────
  {
    id: 4,
    chapter: 4,
    moduleId: 'mod-2',
    moduleName: 'Module 2: Variables, Data Types & Memory',
    level: 'Beginner',
    slug: 'constants-type-casting',
    title: 'Chapter 4: Constants, ASCII & Type Casting',
    subtitle: 'Lock values with const & #define, understand how letters are numbers in ASCII, and convert types safely.',
    category: 'Memory & Types',
    readTime: '6 min',
    analogy: {
      title: 'The Padlocked Safe & Universal Currency Exchange',
      text: 'A constant is a padlocked safe: once you set its value, nobody can change it. Type casting is like converting currency: changing a whole number into a decimal so division does not throw away fractions.',
      properties: [
        { label: 'const', desc: 'Read-only variable that triggers a compiler error if modified' },
        { label: '#define', desc: 'Preprocessor text replacement before compilation begins' },
        { label: 'ASCII Code', desc: 'Every character has a numeric secret identity (e.g. \'A\' = 65)' },
        { label: 'Type Casting', desc: '(float)total / count forces decimal division' },
      ],
    },
    tables: [
      {
        title: 'ASCII Character Table Highlights',
        headers: ['Character', 'ASCII Decimal Value', 'Character', 'ASCII Decimal Value'],
        rows: [
          ["'A'", '65', "'a'", '97'],
          ["'B'", '66', "'b'", '98'],
          ["'0'", '48', "' ' (Space)", '32'],
        ],
      },
    ],
    sections: [
      {
        title: '1. Defining Constants with const and #define',
        text: 'Use `const` or `#define` for values that must never change, like taxes, physics constants, or array sizes.',
        codeSnippet: `#define PI 3.14159
const int MAX_USERS = 100;`,
      },
      {
        title: '2. Avoiding Integer Division Truncation',
        text: 'In C, `5 / 2` evaluates to `2`, NOT `2.5`, because dividing two integers discards the decimal! Cast one operand to `float` to preserve decimals:',
        codeSnippet: `int a = 5, b = 2;
float result = (float)a / b; // Evaluates to 2.5!`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Expecting float avg = 7 / 2; to equal 3.5',
        why: '7 / 2 evaluates to 3 first, then assigns 3.0 to avg.',
        fix: 'float avg = (float)7 / 2; // Gives 3.5',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Decimal Grade Average',
        task: 'Calculate the exact decimal average of 3 test scores: 85, 90, and 92.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    int s1 = 85, s2 = 90, s3 = 92;
    int total = s1 + s2 + s3;
    float avg = (float)total / 3;

    printf("Total Score: %d\\n", total);
    printf("Exact Average: %.2f\\n", avg);
    return 0;
}`,
    expectedOutput: `Total Score: 267
Exact Average: 89.00`,
    quiz: {
      question: 'What is the value of `5 / 2` in C integer division?',
      options: ['2.5', '2', '3', 'Error'],
      correctIndex: 1,
      explanation: 'Integer division in C truncates the decimal part, resulting in `2`.',
    },
  },

  // ── CHAPTER 5 ──────────────────────────────────────────────────────────
  {
    id: 5,
    chapter: 5,
    moduleId: 'mod-3',
    moduleName: 'Module 3: Operators & Math Expressions',
    level: 'Beginner',
    slug: 'arithmetic-assignment-operators',
    title: 'Chapter 5: Arithmetic & Assignment Operators',
    subtitle: 'Master basic math (+, -, *, /, %), shortcut assignments (+=, -=), and the tricky increment/decrement operators (++ / --).',
    category: 'Operators',
    readTime: '6 min',
    analogy: {
      title: 'A High-Speed Calculator Engine',
      text: 'Operators are the mathematical gears of your program. The Modulo operator (%) gives you the leftover remainder after division—perfect for checking if numbers are even or odd!',
      properties: [
        { label: 'Modulo (%)', desc: '10 % 3 gives 1 (leftover remainder)' },
        { label: 'Post-increment (i++)', desc: 'Use current value first, then add 1 afterwards' },
        { label: 'Pre-increment (++i)', desc: 'Add 1 first, then use new value immediately' },
      ],
    },
    tables: [
      {
        title: 'Arithmetic Operators in C',
        headers: ['Operator', 'Name', 'Example (a = 10, b = 3)', 'Result'],
        rows: [
          ['+', 'Addition', 'a + b', '13'],
          ['-', 'Subtraction', 'a - b', '7'],
          ['*', 'Multiplication', 'a * b', '30'],
          ['/', 'Division', 'a / b', '3'],
          ['%', 'Modulo (Remainder)', 'a % b', '1'],
        ],
      },
    ],
    sections: [
      {
        title: '1. The Magic Modulo Operator (%)',
        text: 'Modulo calculates the remainder of an integer division. If `number % 2 == 0`, the number is guaranteed to be EVEN!',
        codeSnippet: `int num = 14;
int remainder = num % 5; // 14 / 5 is 2 with remainder 4`,
      },
      {
        title: '2. Prefix vs Postfix (++i vs i++)',
        text: '`++i` increments before reading, while `i++` increments after reading.',
        codeSnippet: `int x = 5;
int y = x++; // y gets 5, then x becomes 6
int z = ++x; // x becomes 7, then z gets 7`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using % on float numbers: 5.5 % 2',
        why: 'Modulo only works on integer data types in C.',
        fix: 'Use fmod() from <math.h> for floating-point remainders.',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Even/Odd Remainder Checker',
        task: 'Calculate the modulo of 27 divided by 4 and print the result.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    int totalItems = 27;
    int boxCapacity = 4;
    int fullBoxes = totalItems / boxCapacity;
    int leftoverItems = totalItems % boxCapacity;

    printf("Full Boxes: %d\\n", fullBoxes);
    printf("Leftovers : %d\\n", leftoverItems);
    return 0;
}`,
    expectedOutput: `Full Boxes: 6
Leftovers : 3`,
    quiz: {
      question: 'What is the result of `17 % 5` in C?',
      options: ['3', '2', '3.4', '1'],
      correctIndex: 1,
      explanation: '17 divided by 5 is 3 with a remainder of `2`.',
    },
  },

  // ── CHAPTER 6 ──────────────────────────────────────────────────────────
  {
    id: 6,
    chapter: 6,
    moduleId: 'mod-3',
    moduleName: 'Module 3: Operators & Math Expressions',
    level: 'Beginner',
    slug: 'relational-logical-operators',
    title: 'Chapter 6: Relational & Logical Operators',
    subtitle: 'Compare values with ==, !=, <, >, and combine true/false logic with AND (&&), OR (||), and NOT (!).',
    category: 'Operators',
    readTime: '6 min',
    analogy: {
      title: 'Security Doors & Double Locks',
      text: 'Logical AND (&&) is a bank vault requiring BOTH keys to turn. Logical OR (||) is entering a house through either the front door OR the back door. Logical NOT (!) flips true to false!',
      properties: [
        { label: '== (Equal To)', desc: 'Checks if left equals right (NOT single =)' },
        { label: '&& (AND)', desc: 'True ONLY if BOTH sides are true' },
        { label: '|| (OR)', desc: 'True if AT LEAST ONE side is true' },
        { label: '! (NOT)', desc: 'Inverts true to false (0) and false to true (1)' },
      ],
    },
    tables: [
      {
        title: 'Relational & Logical Operators Table',
        headers: ['Operator', 'Meaning', 'Example', 'Outcome'],
        rows: [
          ['==', 'Equal to', '5 == 5', '1 (True)'],
          ['!=', 'Not equal to', '5 != 3', '1 (True)'],
          ['&&', 'Logical AND', '(5 > 2) && (3 > 1)', '1 (True)'],
          ['||', 'Logical OR', '(5 < 2) || (3 > 1)', '1 (True)'],
          ['!', 'Logical NOT', '!(5 == 5)', '0 (False)'],
        ],
      },
    ],
    sections: [
      {
        title: '1. In C, 0 is FALSE and Any Non-Zero is TRUE',
        text: 'C does not have a native primitive bool in early standards. Instead, `0` represents False, and `1` (or any non-zero number) represents True.',
        codeSnippet: `int isEligible = (age >= 18) && (hasId == 1);`,
      },
      {
        title: '2. Short-Circuit Evaluation',
        text: 'In `A && B`, if A is False, C never checks B because the whole statement is already False. In `A || B`, if A is True, C skips B.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using single = in if (score = 100)',
        why: 'Single = assigns 100 to score, making the condition permanently True!',
        fix: 'if (score == 100) // Always use ==',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: VIP Lounge Access Checker',
        task: 'Check if a guest is eligible: age >= 21 AND hasTicket == 1.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    int age = 22;
    int hasTicket = 1;
    int canEnter = (age >= 21) && (hasTicket == 1);

    printf("Access Granted Status (1=Yes, 0=No): %d\\n", canEnter);
    return 0;
}`,
    expectedOutput: `Access Granted Status (1=Yes, 0=No): 1`,
    quiz: {
      question: 'Which logical operator is True ONLY if both conditions are True?',
      options: ['||', '&&', '!', '=='],
      correctIndex: 1,
      explanation: '`&&` (Logical AND) requires both conditions to be true.',
    },
  },

  // ── CHAPTER 7 ──────────────────────────────────────────────────────────
  {
    id: 7,
    chapter: 7,
    moduleId: 'mod-4',
    moduleName: 'Module 4: Standard Input & Output',
    level: 'Beginner',
    slug: 'input-output',
    title: 'Chapter 7: Input & Output with printf() and scanf()',
    subtitle: 'Learn how your program speaks to the screen and listens to the keyboard, and why & is required.',
    category: 'Input / Output',
    readTime: '6 min',
    analogy: {
      title: 'Speaking and Listening',
      text: 'printf() is your program speaking through a loudspeaker. scanf() is your program listening to the keyboard. The `&` symbol is the postal delivery address where scanf drops the user\'s response in RAM!',
      properties: [
        { label: 'printf()', desc: 'Displays formatted text and variable values on screen' },
        { label: 'scanf()', desc: 'Reads input from the keyboard into variables' },
        { label: '& (Address-of)', desc: 'Tells scanf the exact memory location of your variable' },
      ],
    },
    tables: [
      {
        title: 'scanf vs printf Specifier Mapping',
        headers: ['Data Type', 'printf Syntax', 'scanf Syntax'],
        rows: [
          ['int', 'printf("%d", age);', 'scanf("%d", &age);'],
          ['float', 'printf("%.2f", price);', 'scanf("%f", &price);'],
          ['double', 'printf("%.2lf", dist);', 'scanf("%lf", &dist);'],
          ['char', 'printf("%c", grade);', 'scanf(" %c", &grade);'],
        ],
      },
    ],
    sections: [
      {
        title: '1. Why & is Mandatory in scanf()',
        text: '`scanf()` needs to know WHERE to save the answer in your computer RAM. The `&` operator gives the memory address of your variable.',
        codeSnippet: `int userAge;
scanf("%d", &userAge); // & is mandatory!`,
      },
      {
        title: '2. Formatting Decimals with printf',
        text: '`%.2f` rounds and prints exactly 2 decimal places. `%.0f` prints zero decimal places.',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting & in scanf("%d", age);',
        why: 'Without &, scanf writes data to a random memory address and crashes with a Segmentation Fault.',
        fix: 'scanf("%d", &age);',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Birth Year Calculator',
        task: 'Calculate age from birth year 2004 and current year 2026.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    int birthYear = 2004;
    int currentYear = 2026;
    int calculatedAge = currentYear - birthYear;

    printf("Birth Year  : %d\\n", birthYear);
    printf("Current Year: %d\\n", currentYear);
    printf("Age in 2026 : %d years old\\n", calculatedAge);
    return 0;
}`,
    expectedOutput: `Birth Year  : 2004
Current Year: 2026
Age in 2026 : 22 years old`,
    quiz: {
      question: 'Why do we write `&` before variable names in scanf()?',
      options: ['To multiply the value', 'To provide the memory address of the variable', 'To make it positive', 'It is optional'],
      correctIndex: 1,
      explanation: '`&` gives the memory address where `scanf` should store the user input.',
    },
  },

  // ── CHAPTER 8 ──────────────────────────────────────────────────────────
  {
    id: 8,
    chapter: 8,
    moduleId: 'mod-5',
    moduleName: 'Module 5: Conditional Statements & Decisions',
    level: 'Intermediate',
    slug: 'conditional-statements',
    title: 'Chapter 8: If, Else-If & Nested Decisions',
    subtitle: 'Teach your program to make intelligent decisions using if, else if, else, nested conditions, and the ternary operator.',
    category: 'Control Flow',
    readTime: '6 min',
    analogy: {
      title: 'Crossroads & Security Checkpoints',
      text: 'Conditional statements are like road junctions: if the traffic light is green, drive forward; else if yellow, slow down; else, stop. A nested if is a security checkpoint with two consecutive ID checks.',
      properties: [
        { label: 'if', desc: 'Runs if the condition is True' },
        { label: 'else if', desc: 'Tests a secondary condition if the previous was False' },
        { label: 'else', desc: 'Fallback block if all preceding checks failed' },
        { label: 'Ternary (?:)', desc: '1-line shortcut: (cond) ? valIfTrue : valIfFalse' },
      ],
    },
    tables: [
      {
        title: 'Why, Where & How: Conditional Decisions in Real Systems',
        headers: ['Condition Pattern', 'Why It Is Used', 'Where It Is Used in Real Life', 'Code Syntax'],
        rows: [
          ['Single if', 'Execute optional actions only when a trigger condition is met', 'Game over check: if (health <= 0) triggerGameOver();', 'if (x) { ... }'],
          ['if-else', 'Two mutually exclusive branches (A vs B)', 'Login authentication: if (passCorrect) login(); else showInvalid();', 'if (x) { ... } else { ... }'],
          ['else-if Ladder', 'Categorize data into multiple distinct tiers or ranges', 'Credit score grading, tax brackets, traffic speed cameras', 'if (c1) ... else if (c2) ... else ...'],
          ['Nested if', 'Multi-stage dependent verification checks', 'ATM withdrawal: check PIN first, then check account balance', 'if (pin) { if (bal >= amt) { ... } }'],
        ],
      },
      {
        title: 'Decision-Making Syntax Patterns',
        headers: ['Pattern', 'Code Structure', 'Best Use Case'],
        rows: [
          ['Simple if', 'if (x > 0) { ... }', 'Single condition action.'],
          ['if-else', 'if (x) { ... } else { ... }', 'Binary two-way choice (Pass/Fail).'],
          ['else-if ladder', 'if (c1) ... else if (c2) ... else ...', 'Grading ranges (A, B, C, F).'],
          ['Ternary', 'max = (a > b) ? a : b;', 'Quick inline assignment.'],
        ],
      },
    ],
    sections: [
      {
        title: '1. What are Conditionals & Why are they Essential?',
        text: 'By default, a computer executes code line-by-line from top to bottom. Conditional statements give software the power of decision-making: choosing which instructions to run and which to skip based on live data.',
      },
      {
        title: '2. The else-if Ladder in Action',
        text: 'Conditions are tested from top to bottom. The first True block executes and the rest are skipped immediately.',
        codeSnippet: `int score = 85;
if (score >= 90) {
    printf("Grade: A+\\n");
} else if (score >= 80) {
    printf("Grade: A\\n");
} else {
    printf("Grade: B\\n");
}`,
      },
      {
        title: '3. The Elegant Ternary Operator',
        text: 'Replace 5 lines of if-else with a single clean expression:',
        codeSnippet: `char *status = (age >= 18) ? "Adult" : "Minor";`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Putting a semicolon after if(condition);',
        why: 'The semicolon terminates the if statement immediately, running the code block unconditionally!',
        fix: 'if (score >= 50) { ... } // No semicolon after parenthesis',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Movie Ticket Price Rule',
        task: 'If age < 12 price is $5, if age >= 65 price is $7, else $10.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    int age = 16;
    int price;

    if (age < 12) {
        price = 5;
    } else if (age >= 65) {
        price = 7;
    } else {
        price = 10;
    }

    printf("Age: %d | Ticket Price: $%d\\n", age, price);
    return 0;
}`,
    expectedOutput: `Age: 16 | Ticket Price: $10`,
    quiz: {
      question: 'What happens if no `else` is provided and all `if` / `else if` conditions are False?',
      options: ['The program crashes', 'Execution continues past the conditional blocks', 'It restarts main()', 'Compile error'],
      correctIndex: 1,
      explanation: 'If all conditions are false and no else is present, C simply skips past the blocks.',
    },
  },

  // ── CHAPTER 9 ──────────────────────────────────────────────────────────
  {
    id: 9,
    chapter: 9,
    moduleId: 'mod-5',
    moduleName: 'Module 5: Conditional Statements & Decisions',
    level: 'Intermediate',
    slug: 'switch-case-statement',
    title: 'Chapter 9: The Switch-Case Statement',
    subtitle: 'Build high-performance, clean menu selectors and state machines using switch, case, break, and default.',
    category: 'Control Flow',
    readTime: '6 min',
    analogy: {
      title: 'An Elevator Button Panel',
      text: 'Instead of walking up stairs checking floor by floor, pressing button 4 on an elevator jumps directly to Floor 4. `switch` jumps directly to the matching `case` instantly!',
      properties: [
        { label: 'switch(expr)', desc: 'Evaluates an integer or character value once' },
        { label: 'case X:', desc: 'The target floor matching value X' },
        { label: 'break;', desc: 'Exits the switch block immediately (prevents falling into next floor)' },
        { label: 'default:', desc: 'Runs if no case matched (the fallback floor)' },
      ],
    },
    tables: [
      {
        title: 'switch vs if-else Comparison',
        headers: ['Feature', 'switch-case', 'if-else Ladder'],
        rows: [
          ['Best For', 'Matching fixed integers or chars (1, 2, 3, \'A\')', 'Complex range checks (x >= 50 && x <= 100)'],
          ['Speed', 'Jump table O(1) direct lookup', 'Sequential O(N) top-to-bottom tests'],
          ['Readability', 'Very clean for CLI menus', 'Can become cluttered with many branches'],
        ],
      },
    ],
    sections: [
      {
        title: '1. The Danger of Fallthrough Without break',
        text: 'If you omit `break;`, C will continue executing every subsequent case below it, even if their values do not match!',
        codeSnippet: `int day = 2;
switch (day) {
    case 1: printf("Mon\\n"); break;
    case 2: printf("Tue\\n"); break;
    default: printf("Other\\n");
}`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using floating point numbers or strings in switch(price)',
        why: 'switch in C only accepts integer types (int, char, enum).',
        fix: 'Use if-else for float or string comparisons.',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Game Menu Selector',
        task: 'Handle choices: 1 for Start, 2 for Settings, 3 for Exit, default for Invalid.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    int choice = 2;

    switch (choice) {
        case 1:
            printf("Action: Starting Game...\\n");
            break;
        case 2:
            printf("Action: Opening Settings...\\n");
            break;
        case 3:
            printf("Action: Exiting Game...\\n");
            break;
        default:
            printf("Action: Invalid Option!\\n");
    }
    return 0;
}`,
    expectedOutput: `Action: Opening Settings...`,
    quiz: {
      question: 'What happens if you omit the `break;` statement at the end of a switch case?',
      options: ['Compiler error', 'Execution falls through and runs the next case code', 'The program exits', 'The computer reboots'],
      correctIndex: 1,
      explanation: 'Without `break;`, execution "falls through" into subsequent cases sequentially.',
    },
  },

  // ── CHAPTER 10 ─────────────────────────────────────────────────────────
  {
    id: 10,
    chapter: 10,
    moduleId: 'mod-6',
    moduleName: 'Module 6: Loops & Repetition',
    level: 'Intermediate',
    slug: 'while-do-while-loops',
    title: 'Chapter 10: While & Do-While Loops',
    subtitle: 'Repeat operations while conditions hold true, and learn when to use do-while for guaranteed first execution.',
    category: 'Loops',
    readTime: '6 min',
    analogy: {
      title: 'The Battery Meter & Password Retry',
      text: 'A while loop is like your smartphone: while battery > 0, keep playing music. A do-while loop is like an ATM PIN prompt: ask the user for their PIN at least once, and repeat if incorrect.',
      properties: [
        { label: 'while (cond)', desc: 'Condition checked at START (might run 0 times)' },
        { label: 'do { ... } while (cond);', desc: 'Body executed FIRST, condition checked at END (runs >= 1 time)' },
      ],
    },
    tables: [
      {
        title: 'Why, Where & How: Loops in Real-World Software',
        headers: ['Loop Concept', 'Why It Is Used', 'Where It Is Used in Real Life', 'Execution Guarantee'],
        rows: [
          ['while loop', 'Repeat an unknown number of times until an external event changes', 'Server socket listening loop, streaming audio packet buffer', '0 or more times'],
          ['do-while loop', 'Prompt the user for input and validate at least once', 'Menu selection input, PIN verification, game replay prompt', 'Guaranteed at least 1 time'],
          ['Infinite loop', 'Keep a system running continuously until power off', 'Operating system event loop, embedded drone flight controller', 'Runs until explicit break or exit(0)'],
        ],
      },
      {
        title: 'while vs do-while Differences',
        headers: ['Loop Type', 'Condition Test Time', 'Minimum Runs', 'Semicolon at End?'],
        rows: [
          ['while loop', 'Before entering loop body', '0 times', 'No semicolon after while()'],
          ['do-while loop', 'After executing loop body', '1 time', 'YES: while(cond); requires semicolon'],
        ],
      },
    ],
    sections: [
      {
        title: '1. What are Loops & Why are they Essential?',
        text: 'Imagine printing numbers 1 to 1,000,000. Writing 1,000,000 printf statements would be impossible. Loops allow you to execute instructions millions of times automatically with just 3 lines of code.',
      },
      {
        title: '2. The Standard while Loop Structure',
        text: 'Always ensure your loop body modifies the variable tested in the condition, otherwise it will run forever!',
        codeSnippet: `int count = 1;
while (count <= 3) {
    printf("Count: %d\\n", count);
    count++; // Vital increment!
}`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting to increment the loop variable',
        why: 'Causes an Infinite Loop that freezes your application and consumes 100% CPU.',
        fix: 'Always update loop variables inside the body.',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Countdown Timer',
        task: 'Write a while loop that counts down from 3 to 1 and prints "Liftoff!".',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    int timer = 3;

    while (timer > 0) {
        printf("T-%d seconds...\\n", timer);
        timer--;
    }
    printf("Liftoff! 🚀\\n");
    return 0;
}`,
    expectedOutput: `T-3 seconds...
T-2 seconds...
T-1 seconds...
Liftoff! 🚀`,
    quiz: {
      question: 'How many times is a `do-while` loop guaranteed to execute its body?',
      options: ['0 times', 'At least 1 time', 'Infinite times', 'Depends on compiler'],
      correctIndex: 1,
      explanation: 'A `do-while` loop executes its body first before evaluating the condition at the end.',
    },
  },

  // ── CHAPTER 11 ─────────────────────────────────────────────────────────
  {
    id: 11,
    chapter: 11,
    moduleId: 'mod-6',
    moduleName: 'Module 6: Loops & Repetition',
    level: 'Intermediate',
    slug: 'for-loops-nested-patterns',
    title: 'Chapter 11: For Loops & Nested Loop Patterns',
    subtitle: 'Pack initialization, condition, and step into one clean line, and build 2D grid patterns with nested loops.',
    category: 'Loops',
    readTime: '6 min',
    analogy: {
      title: 'A Digital Lap Counter & Grid Printing Press',
      text: 'A for loop is a runner’s watch that starts at lap 1, checks if lap <= 5, and clicks +1 after each lap. A nested for loop is an analog clock: the minute hand must complete 60 ticks for every 1 hour tick!',
      properties: [
        { label: 'for (init; cond; step)', desc: 'All 3 loop control parts in a single header' },
        { label: 'Outer Loop', desc: 'Controls rows in a 2D grid' },
        { label: 'Inner Loop', desc: 'Controls columns inside each row' },
      ],
    },
    tables: [
      {
        title: 'Anatomy of for (int i = 0; i < 5; i++)',
        headers: ['Part', 'Expression', 'Execution Order'],
        rows: [
          ['1. Initialization', 'int i = 0', 'Runs ONCE at the very beginning.'],
          ['2. Condition', 'i < 5', 'Checked BEFORE every iteration.'],
          ['3. Step / Increment', 'i++', 'Executed AFTER every iteration body.'],
        ],
      },
    ],
    sections: [
      {
        title: '1. Standard for Loop',
        codeSnippet: `for (int i = 1; i <= 4; i++) {
    printf("Item %d\\n", i);
}`,
      },
      {
        title: '2. Nested Loops for 2D Grids',
        text: 'The inner loop finishes completely for every single turn of the outer loop:',
        codeSnippet: `for (int row = 1; row <= 3; row++) {
    for (int col = 1; col <= 3; col++) {
        printf("* ");
    }
    printf("\\n");
}`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Putting a semicolon directly after for(...);',
        why: 'Creates an empty loop that finishes all iterations without executing your code block.',
        fix: 'for (int i=0; i<5; i++) { ... }',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Multiplication Grid',
        task: 'Print a 3x3 grid multiplication table using nested for loops.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    printf("3x3 Multiplication Table:\\n");
    for (int r = 1; r <= 3; r++) {
        for (int c = 1; c <= 3; c++) {
            printf("%d\\t", r * c);
        }
        printf("\\n");
    }
    return 0;
}`,
    expectedOutput: `3x3 Multiplication Table:
1	2	3	
2	4	6	
3	6	9	`,
    quiz: {
      question: 'How many total iterations will occur in nested loops: `for(i=0; i<3; i++) for(j=0; j<4; j++)`?',
      options: ['7', '12', '34', '1'],
      correctIndex: 1,
      explanation: 'The outer loop runs 3 times, and for each turn the inner loop runs 4 times: 3 * 4 = 12 total iterations.',
    },
  },

  // ── CHAPTER 12 ─────────────────────────────────────────────────────────
  {
    id: 12,
    chapter: 12,
    moduleId: 'mod-6',
    moduleName: 'Module 6: Loops & Repetition',
    level: 'Intermediate',
    slug: 'loop-control-break-continue',
    title: 'Chapter 12: Loop Control (Break, Continue & Infinite Loops)',
    subtitle: 'Take absolute control over loop execution: stop early with break, skip iterations with continue, and avoid freezing.',
    category: 'Loops',
    readTime: '5 min',
    analogy: {
      title: 'Emergency Brakes & Skipping a Track',
      text: '`break` is pulling the emergency brake on a train—the trip ends immediately. `continue` is hitting "Next Track" on your music player—it skips the rest of the current song and plays the next one!',
      properties: [
        { label: 'break', desc: 'Immediately exits and terminates the enclosing loop' },
        { label: 'continue', desc: 'Skips the remaining lines in current iteration and jumps to the next turn' },
      ],
    },
    tables: [
      {
        title: 'break vs continue Cheat Sheet',
        headers: ['Keyword', 'Action Taken', 'What Happens Next'],
        rows: [
          ['break;', 'Terminates entire loop', 'Program resumes at the line following the loop closing brace }'],
          ['continue;', 'Skips current iteration', 'Loop jumps to increment step and checks next condition'],
        ],
      },
    ],
    sections: [
      {
        title: '1. Using break to Search and Exit Early',
        codeSnippet: `for (int i = 1; i <= 10; i++) {
    if (i == 4) {
        printf("Found 4! Stopping loop.\\n");
        break; // Stops right here!
    }
}`,
      },
      {
        title: '2. Using continue to Filter Odd Numbers',
        codeSnippet: `for (int i = 1; i <= 5; i++) {
    if (i % 2 != 0) continue; // Skip odds!
    printf("Even: %d\\n", i);
}`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using continue in a while loop without incrementing counter before continue',
        why: 'The loop variable never increases, trapping the loop in an infinite cycle.',
        fix: 'Increment counter before calling continue in while loops.',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Skip Number 3 Filter',
        task: 'Loop from 1 to 5 and use continue to skip printing number 3.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    for (int i = 1; i <= 5; i++) {
        if (i == 3) {
            continue; // Skip 3
        }
        printf("Processed item: %d\\n", i);
    }
    return 0;
}`,
    expectedOutput: `Processed item: 1
Processed item: 2
Processed item: 4
Processed item: 5`,
    quiz: {
      question: 'What does `continue;` do when executed inside a for loop?',
      options: [
        'Exits the loop entirely',
        'Skips the rest of the current iteration and jumps to the increment step',
        'Restarts the program',
        'Prints the current variable',
      ],
      correctIndex: 1,
      explanation: '`continue` skips the rest of the current iteration body and moves directly to the next loop step.',
    },
  },

  // ── CHAPTER 13 ─────────────────────────────────────────────────────────
  {
    id: 13,
    chapter: 13,
    moduleId: 'mod-7',
    moduleName: 'Module 7: Arrays & Matrices',
    level: 'Intermediate',
    slug: 'arrays-matrices',
    title: 'Chapter 13: 1D Arrays (Lists of Data)',
    subtitle: 'Store contiguous rows of numbers, understand 0-based indexing, iterate with loops, and find maximums.',
    category: 'Data Collections',
    readTime: '6 min',
    analogy: {
      title: 'A Row of Numbered Lockers in RAM',
      text: 'Instead of creating 50 separate variables (score1, score2, score3...), an array is a single continuous row of lockers side-by-side in memory. The first locker is ALWAYS index [0]!',
      properties: [
        { label: 'Contiguous Memory in RAM', desc: 'Array items sit back-to-back with zero wasted space between elements' },
        { label: '0-Based Indexing', desc: 'An array of size N has valid slots from index 0 up to index N-1' },
        { label: 'O(1) Direct Access', desc: 'Accessing arr[i] is instantaneous by calculating baseAddress + (i * 4)' },
      ],
    },
    tables: [
      {
        title: 'Why, Where & How: 1D Arrays in Real Systems',
        headers: ['Array Use Case', 'Why It Is Used', 'Where It Is Used in Real Life', 'Memory Advantage'],
        rows: [
          ['Linear Data Lists', 'Store thousands of items of identical type together', 'Daily stock market prices, sensor temperature logs, game leaderboard scores', 'Fixed contiguous memory layout'],
          ['Look-up & Frequency Tables', 'Instant O(1) direct index lookups', 'Counting character frequencies, mapping keycodes to actions', 'Zero search overhead'],
          ['Audio & Waveform Buffers', 'Sequential digital signal processing', 'MP3 audio decoders, digital equalizer filters', 'Fast CPU cache prefetching'],
        ],
      },
      {
        title: 'Array Slots for int arr[4] = {10, 20, 30, 40}',
        headers: ['Slot / Index', 'Syntax', 'Stored Value', 'Memory Offset'],
        rows: [
          ['First Element', 'arr[0]', '10', '0 Bytes from start'],
          ['Second Element', 'arr[1]', '20', '+4 Bytes'],
          ['Third Element', 'arr[2]', '30', '+8 Bytes'],
          ['Last Element', 'arr[3]', '40', '+12 Bytes'],
        ],
      },
    ],
    sections: [
      {
        title: '1. What is an Array & Why is it Essential?',
        text: 'An array is a collection of elements of the same data type stored at contiguous (adjacent) memory locations. Without arrays, writing a program to average 100 exam scores would require declaring 100 individual variables!',
      },
      {
        title: '2. Declaring and Iterating an Array',
        codeSnippet: `int scores[3] = {85, 92, 98};
for (int i = 0; i < 3; i++) {
    printf("Score #%d: %d\\n", i + 1, scores[i]);
}`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Accessing arr[5] on an array declared as int arr[5]',
        why: 'Valid indices are 0 to 4. Index 5 is out of bounds (Buffer Overflow).',
        fix: 'Loop with i < 5, never i <= 5.',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Find Highest Score',
        task: 'Find the maximum value in an array of 4 scores: {75, 92, 88, 99}.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    int scores[4] = {75, 92, 88, 99};
    int maxScore = scores[0];

    for (int i = 1; i < 4; i++) {
        if (scores[i] > maxScore) {
            maxScore = scores[i];
        }
    }

    printf("Highest Score in Class: %d points!\\n", maxScore);
    return 0;
}`,
    expectedOutput: `Highest Score in Class: 99 points!`,
    quiz: {
      question: 'What is the index of the first item in any C array?',
      options: ['0', '1', '-1', 'first'],
      correctIndex: 0,
      explanation: 'C arrays are 0-indexed; the first element is at index 0.',
    },
  },

  // ── CHAPTER 14 ─────────────────────────────────────────────────────────
  {
    id: 14,
    chapter: 14,
    moduleId: 'mod-7',
    moduleName: 'Module 7: Arrays & Matrices',
    level: 'Intermediate',
    slug: '2d-arrays-matrices',
    title: 'Chapter 14: 2D Arrays & Matrices',
    subtitle: 'Organize data into rows and columns for game boards, spreadsheets, pixel grids, and matrix mathematics.',
    category: 'Data Collections',
    readTime: '6 min',
    analogy: {
      title: 'A Chessboard or Spreadsheet Table',
      text: 'A 2D array is a grid with rows and columns. To find any square, specify `grid[row][col]`. It is stored in memory as rows laid end-to-end (row-major order).',
      properties: [
        { label: 'matrix[rows][cols]', desc: 'Declares grid dimensions' },
        { label: 'matrix[0][0]', desc: 'Top-left corner element' },
      ],
    },
    tables: [
      {
        title: '2D Matrix Grid: int matrix[2][3]',
        headers: ['Row \\ Col', 'Column 0', 'Column 1', 'Column 2'],
        rows: [
          ['Row 0', 'matrix[0][0]', 'matrix[0][1]', 'matrix[0][2]'],
          ['Row 1', 'matrix[1][0]', 'matrix[1][1]', 'matrix[1][2]'],
        ],
      },
    ],
    sections: [
      {
        title: '1. Initializing and Printing a 2D Matrix',
        codeSnippet: `int grid[2][3] = {
    {1, 2, 3},
    {4, 5, 6}
};

for (int r = 0; r < 2; r++) {
    for (int c = 0; c < 3; c++) {
        printf("%d ", grid[r][c]);
    }
    printf("\\n");
}`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Confusing rows and columns order: matrix[col][row]',
        why: 'In C, the first bracket is ROW and the second is COLUMN: [row][col].',
        fix: 'Always use matrix[r][c].',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Matrix Diagonal Sum',
        task: 'Calculate the sum of elements on the main diagonal of a 2x2 matrix.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    int mat[2][2] = {
        {10, 20},
        {30, 40}
    };

    int diagonalSum = mat[0][0] + mat[1][1];
    printf("Main Diagonal Sum (10 + 40): %d\\n", diagonalSum);
    return 0;
}`,
    expectedOutput: `Main Diagonal Sum (10 + 40): 50`,
    quiz: {
      question: 'In C, how are elements of a 2D array stored in physical RAM?',
      options: ['Random memory slots', 'Row by row continuously (Row-Major Order)', 'Column by column (Column-Major Order)', 'In a tree structure'],
      correctIndex: 1,
      explanation: 'C stores 2D arrays in Row-Major Order (entire row 0, followed immediately by row 1, etc.).',
    },
  },

  // ── CHAPTER 15 ─────────────────────────────────────────────────────────
  {
    id: 15,
    chapter: 15,
    moduleId: 'mod-8',
    moduleName: 'Module 8: Strings & Text Processing',
    level: 'Intermediate',
    slug: 'strings-text-manipulation',
    title: 'Chapter 15: Strings & The Null Terminator (\\0)',
    subtitle: 'Discover how C stores text as a chain of characters ending with a mandatory null terminator (\\0).',
    category: 'Strings & Text',
    readTime: '6 min',
    analogy: {
      title: 'A Train of Letter Cars with a Red Caboose',
      text: 'In C, there is no special "string" primitive type. A string is simply an array of `char` letters. The last character is ALWAYS a red stop sign `\'\\0\'` (ASCII 0) telling printf and string functions where the text ends!',
      properties: [
        { label: "char str[] = \"Cat\"", desc: 'Actually stores 4 bytes: \'C\', \'a\', \'t\', \'\\0\'' },
        { label: "'\\0' (Null Terminator)", desc: 'The invisible stop sign at the end of every valid C string' },
      ],
    },
    tables: [
      {
        title: 'Why, Where & How: Strings in Real Systems',
        headers: ['String Concept', 'Why It Is Used', 'Where It Is Used in Real Life', 'Memory Rule'],
        rows: [
          ['Null Terminator (\\0)', 'Marks the end of text in memory without needing a separate length variable', 'Web URLs, file paths, user passwords, email headers', 'Always add +1 byte to size!'],
          ['fgets()', 'Read full multi-word sentences safely without buffer overflow', 'Reading user full names, street addresses, terminal commands', 'Prevents security exploits'],
          ['Character Arrays', 'Raw text storage in memory buffers', 'HTTP packet headers, log messages, database query strings', 'char buffer[256];'],
        ],
      },
      {
        title: 'String Memory Layout for "CODE"',
        headers: ['Index', '0', '1', '2', '3', '4 (End)'],
        rows: [
          ['Character', "'C'", "'O'", "'D'", "'E'", "'\\0' (Null)"],
          ['ASCII Code', '67', '79', '68', '69', '0'],
        ],
      },
    ],
    sections: [
      {
        title: '1. Declaring Strings in C',
        codeSnippet: `char name[] = "Alice"; // Automatically appends '\\0'
printf("Hello, %s!\\n", name);`,
      },
      {
        title: '2. Reading Multi-Word Strings with fgets()',
        text: '`scanf("%s")` stops at the first space! Use `fgets()` to read full sentences including spaces safely.',
        codeSnippet: `char buffer[50];
fgets(buffer, sizeof(buffer), stdin);`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Allocating char str[4] = "Alex";',
        why: '"Alex" needs 4 letters PLUS 1 byte for \'\\0\' = 5 bytes total!',
        fix: 'char str[5] = "Alex"; or char str[] = "Alex";',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Print String & Individual Characters',
        task: 'Create a string "C-Hero", print the full string and its first letter.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    char badge[] = "C-Hero";

    printf("Full Badge: %s\\n", badge);
    printf("Initial Letter: %c\\n", badge[0]);
    return 0;
}`,
    expectedOutput: `Full Badge: C-Hero
Initial Letter: C`,
    quiz: {
      question: 'What character marks the end of every string in C memory?',
      options: ['\\n', '\\0', ';', '$'],
      correctIndex: 1,
      explanation: '`\\0` (the null terminator) marks the boundary where a string ends in RAM.',
    },
  },

  // ── CHAPTER 16 ─────────────────────────────────────────────────────────
  {
    id: 16,
    chapter: 16,
    moduleId: 'mod-8',
    moduleName: 'Module 8: Strings & Text Processing',
    level: 'Intermediate',
    slug: 'string-library-functions',
    title: 'Chapter 16: String Library Functions (<string.h>)',
    subtitle: 'Master the standard C string toolbox: strlen(), strcpy(), strcmp(), and strcat() for safe text manipulation.',
    category: 'Strings & Text',
    readTime: '6 min',
    analogy: {
      title: 'A Text Processing Toolkit',
      text: 'You cannot use `==` to compare words or `=` to copy strings in C. `<string.h>` provides specialized machines: a tape measure (strlen), a photocopy machine (strcpy), and a scale (strcmp).',
      properties: [
        { label: 'strlen(s)', desc: 'Counts characters excluding the null terminator' },
        { label: 'strcpy(dest, src)', desc: 'Copies text from source to destination buffer' },
        { label: 'strcmp(s1, s2)', desc: 'Returns 0 if both strings are identical' },
        { label: 'strcat(dest, src)', desc: 'Appends source string onto the end of destination' },
      ],
    },
    tables: [
      {
        title: 'Core <string.h> Functions Reference',
        headers: ['Function', 'Plain English Purpose', 'Example Usage', 'Return Value'],
        rows: [
          ['strlen(s)', 'Counts letters', 'strlen("Algo")', '4'],
          ['strcmp(a, b)', 'Checks equality', 'strcmp("yes", "yes")', '0 (Match)'],
          ['strcpy(d, s)', 'Copies word', 'strcpy(dest, "Hi");', 'dest pointer'],
          ['strcat(d, s)', 'Joins words', 'strcat(dest, " World");', 'Combined string'],
        ],
      },
    ],
    sections: [
      {
        title: '1. Why strcmp() Returns 0 for Exact Match',
        text: '`strcmp()` subtracts ASCII characters. If `a - b == 0`, both strings are identical!',
        codeSnippet: `#include <string.h>
if (strcmp(password, "secret123") == 0) {
    printf("Access Granted!\\n");
}`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Using if (str1 == str2) to compare words',
        why: 'In C, == compares memory addresses, not the letters inside the words.',
        fix: 'Use if (strcmp(str1, str2) == 0).',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: String Length & Concatenation',
        task: 'Copy "Algo" into buffer, concatenate "Flow", and print length.',
      },
    ],
    initialCode: `#include <stdio.h>
#include <string.h>

int main() {
    char title[30];
    strcpy(title, "Algo");
    strcat(title, "Flow");

    printf("Full Title: %s\\n", title);
    printf("Length    : %zu characters\\n", strlen(title));
    return 0;
}`,
    expectedOutput: `Full Title: AlgoFlow
Length    : 8 characters`,
    quiz: {
      question: 'What does `strcmp("apple", "apple")` return?',
      options: ['1', '0', '-1', 'true'],
      correctIndex: 1,
      explanation: '`strcmp()` returns `0` when both strings have identical characters.',
    },
  },

  // ── CHAPTER 17 ─────────────────────────────────────────────────────────
  {
    id: 17,
    chapter: 17,
    moduleId: 'mod-9',
    moduleName: 'Module 9: Modular Programming & Functions',
    level: 'Intermediate',
    slug: 'functions-modular-programming',
    title: 'Chapter 17: User-Defined Functions & Scope',
    subtitle: 'Deconstruct complex programs into modular helper functions, pass parameters, return values, and understand local vs global scope.',
    category: 'Functions',
    readTime: '6 min',
    analogy: {
      title: 'Specialized Kitchen Appliances',
      text: 'Instead of doing everything manually inside main(), functions are specialized appliances (like a blender). You feed ingredients (parameters), it runs its internal recipe, and serves the finished dish (return value)!',
      properties: [
        { label: 'Function Prototype', desc: 'Announces the helper signature at the top of the file' },
        { label: 'Parameters', desc: 'Inputs passed into the function' },
        { label: 'Return Type', desc: 'The data type of the result handed back (or void if nothing)' },
        { label: 'Local Scope', desc: 'Variables created inside a function vanish when it finishes' },
      ],
    },
    tables: [
      {
        title: 'Anatomy of a C Function',
        headers: ['Part', 'Example', 'What It Tells the Compiler'],
        rows: [
          ['Return Type', 'int', 'This helper gives back a whole number.'],
          ['Function Name', 'calculateArea', 'The label used to call this helper.'],
          ['Parameters', '(int width, int height)', 'The input values required to do the job.'],
          ['Body { ... }', '{ return width * height; }', 'The actual code instructions.'],
        ],
      },
    ],
    sections: [
      {
        title: '1. Writing and Calling Functions',
        codeSnippet: `int add(int a, int b) {
    return a + b;
}

int main() {
    int sum = add(10, 20); // sum is 30!
    printf("Sum: %d\\n", sum);
    return 0;
}`,
      },
      {
        title: '2. Pass-by-Value Default Rule',
        text: 'In C, functions receive a COPY of the parameters. Modifying a parameter inside a function does NOT change the caller\'s original variable (unless using pointers in Chapter 19).',
      },
    ],
    commonMistakes: [
      {
        mistake: 'Calling a function defined below main() without a function prototype',
        why: 'The compiler reads top-to-bottom and won\'t recognize the function signature.',
        fix: 'Add a prototype int add(int, int); above main().',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Circle Area Function',
        task: 'Write a function float circleArea(float radius) that returns 3.14159 * r * r.',
      },
    ],
    initialCode: `#include <stdio.h>

float circleArea(float r) {
    return 3.14159f * r * r;
}

int main() {
    float radius = 5.0f;
    printf("Radius: %.1f\\n", radius);
    printf("Area  : %.2f\\n", circleArea(radius));
    return 0;
}`,
    expectedOutput: `Radius: 5.0
Area  : 78.54`,
    quiz: {
      question: 'What return type should you use for a function that does not return any value?',
      options: ['int', 'void', 'null', 'empty'],
      correctIndex: 1,
      explanation: '`void` indicates that a function does not return any value.',
    },
  },

  // ── CHAPTER 18 ─────────────────────────────────────────────────────────
  {
    id: 18,
    chapter: 18,
    moduleId: 'mod-9',
    moduleName: 'Module 9: Modular Programming & Functions',
    level: 'Intermediate',
    slug: 'recursion-call-stack',
    title: 'Chapter 18: Recursion & The Call Stack',
    subtitle: 'Understand self-referential functions, master base case conditions, and visualize how the call stack allocates stack frames.',
    category: 'Functions',
    readTime: '6 min',
    analogy: {
      title: 'Russian Nesting Dolls (Matryoshka)',
      text: 'Recursion is like opening nesting dolls: each doll reveals a smaller copy of itself until you reach the smallest solid baby doll that cannot be opened (the Base Case). Then, every doll closes back up in reverse order!',
      properties: [
        { label: 'Base Case', desc: 'The mandatory stop condition that halts further recursive calls' },
        { label: 'Recursive Step', desc: 'Calling the function again with a smaller subset of the problem' },
        { label: 'Call Stack', desc: 'RAM memory stack where each active function call stores its local frame' },
      ],
    },
    tables: [
      {
        title: 'Step-by-Step Call Stack for Factorial: fact(3)',
        headers: ['Stack Level', 'Call', 'Action', 'Return Value'],
        rows: [
          ['Frame 1 (Top)', 'fact(3)', '3 * fact(2)', '3 * 2 = 6'],
          ['Frame 2', 'fact(2)', '2 * fact(1)', '2 * 1 = 2'],
          ['Frame 3 (Base)', 'fact(1)', 'Base Case Triggered', '1 (Starts unwinding!)'],
        ],
      },
    ],
    sections: [
      {
        title: '1. The Golden Rule of Recursion',
        text: 'Always write your Base Case check at the very top of your function before any recursive calls!',
        codeSnippet: `int factorial(int n) {
    if (n <= 1) return 1; // Base case
    return n * factorial(n - 1); // Recursive step
}`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting the Base Case or writing a faulty condition',
        why: 'Causes infinite recursion leading to a "Stack Overflow" crash.',
        fix: 'Always ensure arguments shrink toward a terminating base case.',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Recursive Sum of N Numbers',
        task: 'Calculate sum of numbers from 1 to 4 using recursion: sum(4) = 4 + 3 + 2 + 1 = 10.',
      },
    ],
    initialCode: `#include <stdio.h>

int sumUpTo(int n) {
    if (n <= 1) return 1;
    return n + sumUpTo(n - 1);
}

int main() {
    int num = 4;
    printf("Sum from 1 to %d: %d\\n", num, sumUpTo(num));
    return 0;
}`,
    expectedOutput: `Sum from 1 to 4: 10`,
    quiz: {
      question: 'What error occurs when a recursive function never reaches its base case?',
      options: ['Memory Leak', 'Stack Overflow crash', 'Syntax Warning', 'Null Pointer'],
      correctIndex: 1,
      explanation: 'Without a base case, call stack memory fills up completely until a Stack Overflow occurs.',
    },
  },

  // ── CHAPTER 19 ─────────────────────────────────────────────────────────
  {
    id: 19,
    chapter: 19,
    moduleId: 'mod-10',
    moduleName: 'Module 10: Pointers & Direct Memory Control',
    level: 'Advanced',
    slug: 'pointers-memory-addresses',
    title: 'Chapter 19: Pointers & Memory Addresses',
    subtitle: 'Unlock C’s superpower: understand physical RAM addresses (&), dereference with (*), and pass-by-reference.',
    category: 'Pointers & Memory',
    readTime: '7 min',
    analogy: {
      title: 'Houses, Street Addresses & Keys',
      text: 'A variable is a house containing furniture (its value). A pointer is a GPS piece of paper with the street address of that house written on it. Dereferencing (*) is inserting the key into the front door to inspect or swap the furniture inside!',
      properties: [
        { label: '& (Address-of)', desc: 'Finds the physical hex address in RAM (e.g. 0x7ffd24)' },
        { label: '* (Dereference)', desc: 'Follows the address to access or modify the value directly' },
        { label: 'Pass-by-Reference', desc: 'Allows helper functions to modify original caller variables' },
      ],
    },
    tables: [
      {
        title: 'Why, Where & How: Pointers in Operating Systems & Game Engines',
        headers: ['Pointer Application', 'Why It Is Used', 'Where It Is Used in Real Life', 'Performance Impact'],
        rows: [
          ['Pass by Reference', 'Allow helper functions to modify caller variables directly', 'Swapping numbers, returning multiple values from a function', 'Zero memory copying'],
          ['Hardware & Driver Control', 'Directly read and write to hardware memory registers', 'GPU framebuffers, keyboard drivers, network card DMA buffers', 'Direct bare-metal speed'],
          ['Dynamic Data Structures', 'Connect nodes dynamically in RAM', 'Linked lists, Binary search trees, Graphs, Hash maps', 'Grow and shrink at runtime'],
        ],
      },
      {
        title: 'Pointer Operators Decoded',
        headers: ['Syntax', 'Name', 'Plain English Meaning', 'Example'],
        rows: [
          ['int *p;', 'Declaration', 'p is a pointer that holds the address of an integer', 'int *ptr = NULL;'],
          ['p = &x;', 'Address-of', 'Store the memory address of x inside p', 'p = &score;'],
          ['*p = 50;', 'Dereference', 'Go to the address inside p and write 50 there', '*p = 50; (Modifies x!)'],
        ],
      },
    ],
    sections: [
      {
        title: '1. What is a Pointer & Why is it C\'s Greatest Feature?',
        text: 'A pointer is a variable that stores the physical memory address (e.g. 0x7fff56) of another variable in RAM. Pointers allow lightning-fast operations by passing references instead of copying megabytes of data.',
      },
      {
        title: '2. Passing by Reference with Pointers (Swapping Numbers)',
        text: 'By passing memory addresses with `&`, helper functions can modify variables in the caller\'s scope directly:',
        codeSnippet: `void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 20;
    swap(&x, &y); // Passes addresses!
    printf("x=%d, y=%d\\n", x, y); // x=20, y=10!
    return 0;
}`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Dereferencing an uninitialized or NULL pointer: int *p; *p = 10;',
        why: 'p points to random garbage memory. Writing to it triggers an immediate Segmentation Fault crash.',
        fix: 'Always initialize pointers with an address: int *p = &var; or NULL.',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: In-Place Pointer Swap',
        task: 'Pass variables x=10 and y=99 into swap(&x, &y) and print swapped values.',
      },
    ],
    initialCode: `#include <stdio.h>

void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int x = 10, y = 99;
    swap(&x, &y);
    printf("x = %d, y = %d\\n", x, y);
    return 0;
}`,
    expectedOutput: `x = 99, y = 10`,
    quiz: {
      question: 'What operator is used to get the memory address of a variable in C?',
      options: ['*', '&', '%', '$'],
      correctIndex: 1,
      explanation: '`&` (the address-of operator) returns the memory address of a variable.',
    },
  },

  // ── CHAPTER 20 ─────────────────────────────────────────────────────────
  {
    id: 20,
    chapter: 20,
    moduleId: 'mod-10',
    moduleName: 'Module 10: Pointers & Direct Memory Control',
    level: 'Advanced',
    slug: 'pointers-arrays-functions',
    title: 'Chapter 20: Pointers, Arrays & Pointer Math',
    subtitle: 'Learn how arrays decay to pointers, step across memory tiles with ptr++, and pass arrays efficiently to functions.',
    category: 'Pointers & Memory',
    readTime: '7 min',
    analogy: {
      title: 'Stepping Across Floor Tiles in RAM',
      text: 'In C, an array name is simply a constant pointer to its first element! Incrementing `ptr++` does not add 1 single byte—it jumps forward by the exact size of the data type (4 bytes for int)!',
      properties: [
        { label: 'arr == &arr[0]', desc: 'An array name evaluates to the address of its first element' },
        { label: 'ptr + 1', desc: 'Advances the pointer address by sizeof(data_type) bytes' },
        { label: '*(arr + i)', desc: 'The exact low-level equivalent of writing arr[i]' },
      ],
    },
    tables: [
      {
        title: 'Array Indexing vs Pointer Arithmetic Equivalence',
        headers: ['Array Syntax', 'Pointer Equivalent', 'Memory Address (Assuming base 0x1000)'],
        rows: [
          ['arr[0]', '*arr', '0x1000 (+0 Bytes)'],
          ['arr[1]', '*(arr + 1)', '0x1004 (+4 Bytes)'],
          ['arr[2]', '*(arr + 2)', '0x1008 (+8 Bytes)'],
          ['arr[i]', '*(arr + i)', '0x1000 + (i * 4) Bytes'],
        ],
      },
    ],
    sections: [
      {
        title: '1. Traversing Arrays with Pointer Arithmetic (ptr++)',
        codeSnippet: `int numbers[3] = {10, 20, 30};
int *ptr = numbers; // Points to numbers[0]

for (int i = 0; i < 3; i++) {
    printf("Value: %d\\n", *ptr);
    ptr++; // Moves to next integer (4 bytes forward)
}`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Trying to reassign an array name: arr++',
        why: 'Array names are constant pointers. You cannot change what arr points to.',
        fix: 'Create a separate pointer: int *p = arr; p++;',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Array Traversal via Pointers',
        task: 'Traverse an array of 3 integers {10, 20, 30} using a pointer ptr and print each.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    int arr[3] = {10, 20, 30};
    int *p = arr;

    for (int i = 0; i < 3; i++) {
        printf("%d\\n", *p);
        p++;
    }
    return 0;
}`,
    expectedOutput: `10
20
30`,
    quiz: {
      question: 'If `int *p` points to address 1000, what address does `p + 1` point to (assuming 4-byte integers)?',
      options: ['1001', '1004', '1008', '1000'],
      correctIndex: 1,
      explanation: 'Pointer arithmetic scales by `sizeof(type)`. For a 4-byte integer, `p + 1` points to 1004.',
    },
  },

  // ── CHAPTER 21 ─────────────────────────────────────────────────────────
  {
    id: 21,
    chapter: 21,
    moduleId: 'mod-11',
    moduleName: 'Module 11: Custom Types, Dynamic Memory & Files',
    level: 'Advanced',
    slug: 'structures-unions-enums',
    title: 'Chapter 21: Structures (struct), Unions & Enums',
    subtitle: 'Create custom composite data types, bundle multiple attributes with struct, save memory with unions, and name states with enums.',
    category: 'Custom Types',
    readTime: '7 min',
    analogy: {
      title: 'A Student ID Card & State Machine',
      text: 'A `struct` is a student ID badge bundling different fields together: ID number (int), name (string), and GPA (float). An `enum` gives readable English names to numeric states (like traffic light RED=1, YELLOW=2, GREEN=3).',
      properties: [
        { label: 'struct', desc: 'Bundles heterogeneous data types under one named type' },
        { label: 'Dot Operator (.)', desc: 'Accesses struct fields: student.gpa' },
        { label: 'Arrow Operator (->)', desc: 'Accesses fields through a pointer: ptr->gpa' },
        { label: 'enum', desc: 'Defines a set of named integer constants' },
      ],
    },
    tables: [
      {
        title: 'Why, Where & How: Custom Types in Real Systems',
        headers: ['Data Structure', 'Why It Is Used', 'Where It Is Used in Real Life', 'RAM Allocation'],
        rows: [
          ['struct', 'Model complex real-world entities with multiple attributes', 'User profiles, banking account records, 3D vector coordinates, game entities', 'Sum of all member sizes (+ alignment padding)'],
          ['union', 'Save memory when only one attribute is active at a time', 'Network packet headers, hardware registers, variant data types', 'Size of the single largest member'],
          ['enum', 'Give clear readable names to state integers', 'Game states (MENU, PLAYING, PAUSED), HTTP status codes, protocol flags', '4 Bytes (Standard int)'],
        ],
      },
      {
        title: 'struct vs union vs enum Comparison',
        headers: ['Feature', 'struct', 'union', 'enum'],
        rows: [
          ['Purpose', 'Group related different fields', 'Share same memory space for 1 field at a time', 'Named integer constants'],
          ['Memory Used', 'Sum of all member sizes (+ padding)', 'Size of the single largest member', 'Size of an integer (4 Bytes)'],
          ['Access Operator', 'Dot (.) or Arrow (->)', 'Dot (.) or Arrow (->)', 'Direct name (e.g. GREEN)'],
        ],
      },
    ],
    sections: [
      {
        title: '1. What is a struct & Why is it Essential?',
        text: 'In real-world applications, data is rarely just a single number or string. A user account has an ID, a username, an email, and an account balance. A `struct` allows you to bundle all these different data types into one single custom type.',
      },
      {
        title: '2. Defining and Using a struct with typedef',
        codeSnippet: `typedef struct {
    int id;
    char name[20];
    float gpa;
} Student;

int main() {
    Student s1 = {101, "Alice", 3.95f};
    printf("ID: %d | Name: %s | GPA: %.2f\\n", s1.id, s1.name, s1.gpa);
    return 0;
}`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting the semicolon after struct definition: struct Foo { int a; }',
        why: 'In C, struct definitions MUST end with a semicolon `;` after the closing brace.',
        fix: 'struct Foo { int a; };',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Student Record Struct',
        task: 'Define a Student struct and print ID 101, Alice, and GPA 3.95.',
      },
    ],
    initialCode: `#include <stdio.h>

typedef struct {
    int id;
    char name[20];
    float gpa;
} Student;

int main() {
    Student s = {101, "Alice", 3.95f};
    printf("ID: %d | Name: %s | GPA: %.2f\\n", s.id, s.name, s.gpa);
    return 0;
}`,
    expectedOutput: `ID: 101 | Name: Alice | GPA: 3.95`,
    quiz: {
      question: 'Which operator is used to access struct members through a pointer (`Student *ptr`)?',
      options: ['.', '->', '::', '*'],
      correctIndex: 1,
      explanation: 'The arrow operator `->` (e.g. `ptr->name`) accesses members through a pointer.',
    },
  },

  // ── CHAPTER 22 ─────────────────────────────────────────────────────────
  {
    id: 22,
    chapter: 22,
    moduleId: 'mod-11',
    moduleName: 'Module 11: Custom Types, Dynamic Memory & Files',
    level: 'Advanced',
    slug: 'dynamic-memory-allocation',
    title: 'Chapter 22: Dynamic Memory Allocation (Heap vs Stack)',
    subtitle: 'Rent RAM on-demand from the heap using malloc(), calloc(), realloc(), and prevent memory leaks with free().',
    category: 'Memory Management',
    readTime: '7 min',
    analogy: {
      title: 'Renting a Storage Unit in a Warehouse',
      text: 'Stack memory is like your backpack: fast, but small and automatically emptied when a function ends. Heap memory is renting a storage unit with `malloc()`: it stays yours as long as you need, but you MUST return the key with `free()` when done, otherwise you cause a Memory Leak!',
      properties: [
        { label: 'malloc(bytes)', desc: 'Allocates raw uninitialized memory block on the heap' },
        { label: 'calloc(n, size)', desc: 'Allocates memory and zeroes out every byte (0)' },
        { label: 'realloc(ptr, new_size)', desc: 'Expands or shrinks an existing heap allocation' },
        { label: 'free(ptr)', desc: 'Returns rented heap memory back to the Operating System' },
      ],
    },
    tables: [
      {
        title: 'Stack vs Heap Memory Comparison',
        headers: ['Feature', 'Stack Memory', 'Heap Memory'],
        rows: [
          ['Allocation', 'Automatic (when variable is declared)', 'Manual via malloc(), calloc(), realloc()'],
          ['Deallocation', 'Automatic (when function exits)', 'Manual: MUST call free(ptr)'],
          ['Size Limit', 'Small (typically 1-8 MB)', 'Very large (limited only by available physical RAM)'],
          ['Speed', 'Ultra-fast CPU stack pointer jump', 'Slightly slower (OS memory allocator search)'],
        ],
      },
    ],
    sections: [
      {
        title: '1. The Dynamic Allocation Pattern (malloc & free)',
        codeSnippet: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = (int*)malloc(3 * sizeof(int));
    if (arr == NULL) {
        printf("Memory allocation failed!\\n");
        return 1;
    }

    arr[0] = 10; arr[1] = 20; arr[2] = 30;
    printf("%d %d %d\\n", arr[0], arr[1], arr[2]);

    free(arr); // Mandatory cleanup!
    arr = NULL;
    return 0;
}`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting free(ptr) before exiting (Memory Leak)',
        why: 'Rented heap memory is not reclaimed, consuming RAM indefinitely.',
        fix: 'Always pair every malloc/calloc call with a free(ptr) call.',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: Heap Array of 3 Integers',
        task: 'Allocate 3 ints on the heap with malloc, populate {10, 20, 30}, print, and free.',
      },
    ],
    initialCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int *arr = (int*)malloc(3 * sizeof(int));
    arr[0] = 10;
    arr[1] = 20;
    arr[2] = 30;

    printf("arr[0] = %d\\n", arr[0]);
    printf("arr[1] = %d\\n", arr[1]);
    printf("arr[2] = %d\\n", arr[2]);

    free(arr);
    return 0;
}`,
    expectedOutput: `arr[0] = 10
arr[1] = 20
arr[2] = 30`,
    quiz: {
      question: 'Which function must always be called to release memory allocated with `malloc()`?',
      options: ['delete()', 'free()', 'release()', 'clear()'],
      correctIndex: 1,
      explanation: '`free()` releases dynamically allocated heap memory back to the Operating System.',
    },
  },

  // ── CHAPTER 23 ─────────────────────────────────────────────────────────
  {
    id: 23,
    chapter: 23,
    moduleId: 'mod-11',
    moduleName: 'Module 11: Custom Types, Dynamic Memory & Files',
    level: 'Advanced',
    slug: 'file-handling-persistent-data',
    title: 'Chapter 23: File Handling & Persistent Data Storage',
    subtitle: 'Save data permanently on the hard drive using fopen(), fprintf(), fscanf(), and fclose() file streams.',
    category: 'File Systems',
    readTime: '7 min',
    analogy: {
      title: 'Opening a Notebook on the Shelf',
      text: 'Variables in RAM disappear the moment your program closes. File handling is opening a physical notebook on your hard drive (`fopen`), writing lines into it (`fprintf`), and closing it securely (`fclose`) so your data survives computer reboots!',
      properties: [
        { label: 'fopen("file.txt", "w")', desc: 'Opens stream in Write mode (creates or overwrites file)' },
        { label: 'fopen("file.txt", "r")', desc: 'Opens stream in Read mode' },
        { label: 'fopen("file.txt", "a")', desc: 'Opens stream in Append mode (adds to end of file)' },
        { label: 'fclose(fp)', desc: 'Flushes and closes the stream cleanly' },
      ],
    },
    tables: [
      {
        title: 'C File Access Modes Reference',
        headers: ['Mode', 'Purpose', 'If File Does Not Exist', 'If File Already Exists'],
        rows: [
          ['"r"', 'Read only', 'Returns NULL (Error)', 'Opens at beginning for reading'],
          ['"w"', 'Write only', 'Creates new empty file', 'Overwrites & erases old contents!'],
          ['"a"', 'Append only', 'Creates new empty file', 'Preserves old data, writes at end'],
          ['"r+"', 'Read + Write', 'Returns NULL (Error)', 'Opens without erasing'],
        ],
      },
    ],
    sections: [
      {
        title: '1. Writing Data to a File Stream',
        codeSnippet: `#include <stdio.h>

int main() {
    FILE *fp = fopen("scores.txt", "w");
    if (fp == NULL) {
        printf("Error opening file!\\n");
        return 1;
    }

    fprintf(fp, "PlayerScore: %d\\n", 9990);
    fclose(fp); // Always close stream!
    return 0;
}`,
      },
    ],
    commonMistakes: [
      {
        mistake: 'Forgetting to call fclose(fp) after writing',
        why: 'Data may stay stuck in the OS write cache and never get saved to the hard drive.',
        fix: 'Always pair fopen() with fclose(fp).',
      },
    ],
    exercises: [
      {
        title: 'Challenge 1: File Lifecycle Simulation',
        task: 'Simulate opening "scores.txt", writing a score of 99990, and closing cleanly.',
      },
    ],
    initialCode: `#include <stdio.h>

int main() {
    printf("File Stream: 'scores.txt' opened in [WRITE] mode\\n");
    printf("fprintf: Score = 99990\\n");
    printf("fclose: Stream flushed and closed cleanly\\n");
    return 0;
}`,
    expectedOutput: `File Stream: 'scores.txt' opened in [WRITE] mode
fprintf: Score = 99990
fclose: Stream flushed and closed cleanly`,
    quiz: {
      question: 'Which file mode should you use to add new records to the end of an existing file without deleting old content?',
      options: ['"w"', '"r"', '"a"', '"x"'],
      correctIndex: 2,
      explanation: '`"a"` (Append mode) writes data to the end of the file without overwriting existing data.',
    },
  },
];

export const PYTHON_PREVIEW_TOPICS = [
  { title: 'Pythonic Syntax & Dynamic Types', status: 'In Design' },
  { title: 'Lists, Tuples, Dictionaries & Sets', status: 'In Design' },
  { title: 'List Comprehensions & Generators', status: 'In Design' },
  { title: 'Object-Oriented Programming (OOP) in Python', status: 'Planned' },
  { title: 'Data Structures & Algorithms with Python', status: 'Planned' },
  { title: 'Scientific Computing & AI Libraries', status: 'Planned' },
];
