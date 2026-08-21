// src/data/cPractices.js — Master Practice Challenges for C Programming Academy
// Chapter 1 is conceptual foundation (covered by Examination Quiz & Pipeline Visualizer).
// Chapters 2–23 provide 3–4 topic-focused challenges with exact Input/Output specifications, starter code, and progressive hints.

export const C_CHAPTER_PRACTICES = {
  // ── CHAPTER 1: GROUND ZERO (Theory & History — Exam Quiz Only, No Coding Lab Required) ──
  // 'hello-world-intro' intentionally left empty as quiz covers conceptual foundation.

  // ── CHAPTER 2: WRITING & RUNNING YOUR FIRST C PROGRAM ──
  'writing-running-first-c-program': [
    {
      id: 'ch2-p1-hello',
      title: 'Standard Console Message Output',
      difficulty: 'Easy',
      description: 'Your first step in learning C is printing messages to the standard console output stream (stdout). Write a program that prints "Hello World!" on a single line.',
      inputSpec: 'This problem has no input.',
      sampleInput: 'No input',
      outputSpec: 'Print the message "Hello World!" followed by a newline character (\\n).',
      sampleOutput: `Hello World!`,
      starterCode: `#include <stdio.h>

int main() {
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1: Standard I/O Function', text: 'Use printf("..."); from the <stdio.h> standard library.' },
        { cost: 10, label: 'Hint 2: Exact Formatting', text: 'Ensure exact capitalization and include \\n at the end: printf("Hello World!\\n");' },
      ],
    },
    {
      id: 'ch2-p2-receipt',
      title: 'Invoice Tabular Layout with Escape Sequences',
      difficulty: 'Easy',
      description: 'Using horizontal tab (\\t) and newline (\\n) escape sequences, format a clean 2-column receipt for a store purchase.',
      inputSpec: 'Item name: "USB-Drive", Price: "$15.00".',
      sampleInput: 'Item: USB-Drive, Price: $15.00',
      outputSpec: 'Print header "ITEM\\t\\tPRICE\\n" and row "USB-Drive\\t$15.00\\n".',
      sampleOutput: `ITEM\t\tPRICE
USB-Drive\t$15.00`,
      starterCode: `#include <stdio.h>

int main() {
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Use \\t to create fixed column alignment.' },
      ],
    },
    {
      id: 'ch2-p3-banner',
      title: 'Bordered Banner Box (ASCII Framing)',
      difficulty: 'Easy',
      description: 'Print a framed banner box for a diagnostic terminal display using plus (+), dash (-), and pipe (|) characters.',
      inputSpec: 'No input.',
      sampleInput: 'No input',
      outputSpec: 'Print a 3-line framed box containing "|  SYSTEM ONLINE  |".',
      sampleOutput: `+--------------------+
|  SYSTEM ONLINE  |
+--------------------+`,
      starterCode: `#include <stdio.h>

int main() {
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Write 3 consecutive printf statements ending in \\n.' },
      ],
    },
    {
      id: 'ch2-p4-status',
      title: 'Diagnostic System Status Logger',
      difficulty: 'Easy',
      description: 'Format a multi-line system startup report detailing CPU core count and system status.',
      inputSpec: 'No input.',
      sampleInput: 'No input',
      outputSpec: 'Print startup report lines for System Status and Core Count.',
      sampleOutput: `STATUS: READY
CORES : 8 ACTIVE`,
      starterCode: `#include <stdio.h>

int main() {
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Print each status line followed by \\n.' },
      ],
    },
  ],

  // ── CHAPTER 3: VARIABLES, BASIC TYPES & MEMORY SIZE ──
  'variables-data-types': [
    {
      id: 'ch3-p1-sum',
      title: 'Two-Integer Sum Calculator',
      difficulty: 'Easy',
      description: 'Read two integer variables, named A and B, and compute their sum, assigning the result to variable X. Print X according to the format below.',
      inputSpec: 'Two integer variables: A = 10, B = 9.',
      sampleInput: '10\n9',
      outputSpec: 'Print "X = " followed by the sum value.',
      sampleOutput: `X = 19`,
      starterCode: `#include <stdio.h>

int main() {
    int A = 10;
    int B = 9;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Format string: printf("X = %d\\n", A + B);' },
      ],
    },
    {
      id: 'ch3-p2-circle',
      title: 'Circle Geometry & Area Calculator',
      difficulty: 'Medium',
      description: 'Calculate the area of a circle with formula A = PI * R^2 where PI = 3.14159 using double precision floating point arithmetic.',
      inputSpec: 'Floating point radius R = 2.00.',
      sampleInput: '2.00',
      outputSpec: 'Print "A=" followed by the area value rounded to four decimal places.',
      sampleOutput: `A=12.5664`,
      starterCode: `#include <stdio.h>

int main() {
    double R = 2.00;
    double PI = 3.14159;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Use %.4lf format specifier for double variables.' },
      ],
    },
    {
      id: 'ch3-p3-product',
      title: 'Product Calculation with Multipliers',
      difficulty: 'Easy',
      description: 'Compute the product of two integer multipliers and print the resulting PROD variable.',
      inputSpec: 'Two integer numbers: 3 and 9.',
      sampleInput: '3\n9',
      outputSpec: 'Print "PROD = " followed by the multiplied product.',
      sampleOutput: `PROD = 27`,
      starterCode: `#include <stdio.h>

int main() {
    int a = 3, b = 9;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'printf("PROD = %d\\n", a * b);' },
      ],
    },
    {
      id: 'ch3-p4-salary',
      title: 'Payroll & Hourly Wage Calculator',
      difficulty: 'Medium',
      description: 'Calculate an employee\'s total monthly salary given their employee ID number, worked hours, and hourly pay rate.',
      inputSpec: 'Employee NUMBER = 25, worked hours = 100, hourly rate = U$ 5.50.',
      sampleInput: '25\n100\n5.50',
      outputSpec: 'Print employee NUMBER and SALARY with 2 decimal places.',
      sampleOutput: `NUMBER = 25
SALARY = U$ 550.00`,
      starterCode: `#include <stdio.h>

int main() {
    int number = 25;
    int hours = 100;
    float rate = 5.50f;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'salary = hours * rate; print with %.2f.' },
      ],
    },
  ],

  // ── CHAPTER 4: CONSTANTS, ASCII & TYPE CASTING ──
  'constants-type-casting': [
    {
      id: 'ch4-p1-weight-avg',
      title: 'Weighted Student Grade Average',
      difficulty: 'Medium',
      description: 'Calculate the weighted average of two grades A and B where Grade A has weight 3.5 and Grade B has weight 7.5 (sum of weights = 11.0).',
      inputSpec: 'Two double values: A = 5.0, B = 7.1.',
      sampleInput: '5.0\n7.1',
      outputSpec: 'Print "MEDIA = " followed by the calculated average with 5 decimal places.',
      sampleOutput: `MEDIA = 6.43182`,
      starterCode: `#include <stdio.h>

int main() {
    double A = 5.0;
    double B = 7.1;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Weighted sum: (A*3.5 + B*7.5) / 11.0; print with %.5lf.' },
      ],
    },
    {
      id: 'ch4-p2-diff',
      title: 'Cross-Product Difference',
      difficulty: 'Easy',
      description: 'Compute the difference of products: (A * B - C * D) for four integer values A, B, C, and D.',
      inputSpec: 'Four integers: A = 5, B = 6, C = 7, D = 8.',
      sampleInput: '5\n6\n7\n8',
      outputSpec: 'Print "DIFERENCA = " followed by the computed integer result.',
      sampleOutput: `DIFERENCA = -26`,
      starterCode: `#include <stdio.h>

int main() {
    int A = 5, B = 6, C = 7, D = 8;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: '5*6 - 7*8 = 30 - 56 = -26.' },
      ],
    },
    {
      id: 'ch4-p3-cast',
      title: 'Integer Division vs Explicit Float Cast',
      difficulty: 'Easy',
      description: 'Demonstrate the difference between truncating integer division (17 / 4 = 4) and explicit casting ((float)17 / 4 = 4.25).',
      inputSpec: 'sum = 17, count = 4.',
      sampleInput: '17\n4',
      outputSpec: 'Print integer division result and float cast result to 2 decimal places.',
      sampleOutput: `Integer: 4
Float  : 4.25`,
      starterCode: `#include <stdio.h>

int main() {
    int sum = 17;
    int count = 4;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Casting (float)sum converts the numerator to a float before division.' },
      ],
    },
    {
      id: 'ch4-p4-ascii',
      title: 'ASCII Character Code Inspector',
      difficulty: 'Easy',
      description: 'Print a character literal and inspect its underlying 7-bit ASCII numerical integer code.',
      inputSpec: 'Character \'A\'.',
      sampleInput: 'A',
      outputSpec: 'Print "Char: A | ASCII: 65".',
      sampleOutput: `Char: A | ASCII: 65`,
      starterCode: `#include <stdio.h>

int main() {
    char ch = 'A';
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Print with %c for character and %d for ASCII integer.' },
      ],
    },
  ],

  // ── CHAPTER 5: ARITHMETIC & ASSIGNMENT OPERATORS ──
  'arithmetic-assignment-operators': [
    {
      id: 'ch5-p1-time',
      title: 'Seconds to HMS Time Formatter',
      difficulty: 'Medium',
      description: 'Convert an integer event duration in seconds into standard hours:minutes:seconds time representation.',
      inputSpec: 'Integer value N = 556 seconds.',
      sampleInput: '556',
      outputSpec: 'Print the formatted time in hours:minutes:seconds.',
      sampleOutput: `0:9:16`,
      starterCode: `#include <stdio.h>

int main() {
    int N = 556;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: '1 hour = 3600s, 1 minute = 60s. Use integer division / and modulo %.' },
      ],
    },
    {
      id: 'ch5-p2-age',
      title: 'Days to Years/Months Calendar Formatter',
      difficulty: 'Medium',
      description: 'Convert a person\'s age given in days into years (365 days), months (30 days), and remaining days.',
      inputSpec: 'Integer value N = 400 days.',
      sampleInput: '400',
      outputSpec: 'Print output in "ano(s)", "mes(es)", "dia(s)" format.',
      sampleOutput: `1 ano(s)
1 mes(es)
5 dia(s)`,
      starterCode: `#include <stdio.h>

int main() {
    int N = 400;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'years = N / 365; months = (N % 365) / 30; days = (N % 365) % 30;' },
      ],
    },
    {
      id: 'ch5-p3-atm',
      title: 'ATM Currency Denomination Splitter',
      difficulty: 'Hard',
      description: 'Decompose a monetary amount ($576) into the minimum number of banknotes: $100, $50, $20, $10, $5, $2, and $1.',
      inputSpec: 'Integer value = 576.',
      sampleInput: '576',
      outputSpec: 'Print the total amount followed by the count of each banknote denomination.',
      sampleOutput: `576
5 nota(s) de R$ 100,00
1 nota(s) de R$ 50,00
1 nota(s) de R$ 20,00
0 nota(s) de R$ 10,00
1 nota(s) de R$ 5,00
0 nota(s) de R$ 2,00
1 nota(s) de R$ 1,00`,
      starterCode: `#include <stdio.h>

int main() {
    int money = 576;
    printf("%d\\n", money);

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Divide by banknote value, then reduce money using compound modulo: money %= note.' },
      ],
    },
    {
      id: 'ch5-p4-fuel-eff',
      title: 'Fuel Consumption & Mileage Calculator',
      difficulty: 'Easy',
      description: 'Calculate an automobile\'s average fuel consumption given total distance traveled in km (500 km) and total spent fuel in liters (35.0 L).',
      inputSpec: 'Distance = 500 km, Spent fuel = 35.0 liters.',
      sampleInput: '500 35.0',
      outputSpec: 'Print consumption in km/l format with 3 decimal places.',
      sampleOutput: `14.286 km/l`,
      starterCode: `#include <stdio.h>

int main() {
    int dist = 500;
    float fuel = 35.0f;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'avg = dist / fuel; print with %.3f km/l.' },
      ],
    },
  ],

  // ── CHAPTER 6: RELATIONAL & LOGICAL OPERATORS ──
  'relational-logical-operators': [
    {
      id: 'ch6-p1-validator',
      title: 'Multi-Condition Eligibility Validator',
      difficulty: 'Medium',
      description: 'Evaluate 4 integer values A, B, C, and D. If B > C and D > A and (C + D) > (A + B) and C > 0 and D > 0 and A is even (A % 2 == 0), print "Valores aceitos". Otherwise print "Valores nao aceitos".',
      inputSpec: 'Four integers: A = 2, B = 4, C = 3, D = 5.',
      sampleInput: '2 4 3 5',
      outputSpec: 'Print "Valores aceitos" or "Valores nao aceitos".',
      sampleOutput: `Valores aceitos`,
      starterCode: `#include <stdio.h>

int main() {
    int A = 2, B = 4, C = 3, D = 5;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Combine all conditions using the logical AND operator &&.' },
      ],
    },
    {
      id: 'ch6-p2-range',
      title: 'Range & Interval Classifier',
      difficulty: 'Medium',
      description: 'Determine which numeric interval a floating-point number belongs to: [0,25], (25,50], (50,75], (75,100].',
      inputSpec: 'Floating point value: 25.01.',
      sampleInput: '25.01',
      outputSpec: 'Print the matching interval name.',
      sampleOutput: `Intervalo (25,50]`,
      starterCode: `#include <stdio.h>

int main() {
    double num = 25.01;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: '25.01 falls strictly within the interval (25,50].' },
      ],
    },
    {
      id: 'ch6-p3-quadrant',
      title: '2D Cartesian Plane Quadrant Resolver',
      difficulty: 'Hard',
      description: 'Given 2D coordinates (x, y), determine which Cartesian quadrant the point lies in (Q1, Q2, Q3, Q4, Origem, Eixo X, Eixo Y).',
      inputSpec: 'x = 4.5, y = -2.2.',
      sampleInput: '4.5 -2.2',
      outputSpec: 'Print the quadrant code.',
      sampleOutput: `Q4`,
      starterCode: `#include <stdio.h>

int main() {
    float x = 4.5f, y = -2.2f;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Positive X and negative Y is in Quadrant 4 (Q4).' },
      ],
    },
    {
      id: 'ch6-p4-triangle-ineq',
      title: 'Triangle Validity & Inequality Test',
      difficulty: 'Medium',
      description: 'Check if three side lengths A = 6.0, B = 4.0, C = 2.1 can form a valid geometric triangle (sum of any two sides must be strictly greater than the third).',
      inputSpec: 'A = 6.0, B = 4.0, C = 2.1.',
      sampleInput: '6.0 4.0 2.1',
      outputSpec: 'Print "Perimetro = 12.1" if valid, or "Area = <area>" if not.',
      sampleOutput: `Perimetro = 12.1`,
      starterCode: `#include <stdio.h>

int main() {
    float a = 6.0f, b = 4.0f, c = 2.1f;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Valid when a + b > c && a + c > b && b + c > a.' },
      ],
    },
  ],

  // ── CHAPTER 7: INPUT & OUTPUT WITH PRINTF() AND SCANF() ──
  'input-output': [
    {
      id: 'ch7-p1-pos-total',
      title: 'Retail Inventory Total Cost Calculator',
      difficulty: 'Medium',
      description: 'Calculate the total amount to be paid for multiple product items given unit quantities and unit prices.',
      inputSpec: 'Product 1: 2 units at $5.30. Product 2: 1 unit at $5.10.',
      sampleInput: '12 2 5.30\n16 1 5.10',
      outputSpec: 'Print "VALOR A PAGAR: R$ " followed by total with 2 decimal places.',
      sampleOutput: `VALOR A PAGAR: R$ 15.70`,
      starterCode: `#include <stdio.h>

int main() {
    int qty1 = 2; float price1 = 5.30f;
    int qty2 = 1; float price2 = 5.10f;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'printf("VALOR A PAGAR: R$ %.2f\\n", total);' },
      ],
    },
    {
      id: 'ch7-p2-distance',
      title: 'Euclidean Distance Calculator',
      difficulty: 'Medium',
      description: 'Calculate the Euclidean distance between two points p1 (x1, y1) and p2 (x2, y2) in a 2D plane.',
      inputSpec: 'p1 = (1.0, 7.0), p2 = (5.0, 9.0).',
      sampleInput: '1.0 7.0\n5.0 9.0',
      outputSpec: 'Print the distance rounded to 4 decimal places.',
      sampleOutput: `4.4721`,
      starterCode: `#include <stdio.h>
#include <math.h>

int main() {
    double x1 = 1.0, y1 = 7.0;
    double x2 = 5.0, y2 = 9.0;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Use sqrt() from <math.h> and print with %.4lf.' },
      ],
    },
    {
      id: 'ch7-p3-sphere',
      title: 'Sphere Volume Calculator',
      difficulty: 'Easy',
      description: 'Calculate the volume of a sphere given radius R = 3 using formula (4.0/3) * PI * R^3 where PI = 3.14159.',
      inputSpec: 'Radius R = 3.0.',
      sampleInput: '3.0',
      outputSpec: 'Print "VOLUME = " followed by the volume with 3 decimal places.',
      sampleOutput: `VOLUME = 113.097`,
      starterCode: `#include <stdio.h>

int main() {
    double R = 3.0;
    double PI = 3.14159;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Ensure using 4.0/3.0 to prevent integer truncation.' },
      ],
    },
  ],

  // ── CHAPTER 8: IF, ELSE-IF & NESTED DECISIONS ──
  'conditional-statements': [
    {
      id: 'ch8-p1-menu',
      title: 'POS Order Menu Total Calculator',
      difficulty: 'Easy',
      description: 'Calculate the total order bill given the menu item code and quantity (1: Hotdog $4.00, 2: Salad $4.50, 3: Bacon Burger $5.00, 4: Toast $2.00, 5: Soda $1.50).',
      inputSpec: 'Item code 3 (Bacon Burger), Quantity 2.',
      sampleInput: '3 2',
      outputSpec: 'Print "Total: R$ " followed by bill amount with 2 decimals.',
      sampleOutput: `Total: R$ 10.00`,
      starterCode: `#include <stdio.h>

int main() {
    int code = 3;
    int qty = 2;
    float price = 0.0f;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Match code in else-if ladder and multiply price by qty.' },
      ],
    },
    {
      id: 'ch8-p2-multiples',
      title: 'Integer Multiples Verifier',
      difficulty: 'Easy',
      description: 'Check whether two integer numbers A and B are multiples of each other.',
      inputSpec: 'Two integers: A = 6, B = 24.',
      sampleInput: '6 24',
      outputSpec: 'Print "Sao Multiplos" or "Nao sao Multiplos".',
      sampleOutput: `Sao Multiplos`,
      starterCode: `#include <stdio.h>

int main() {
    int A = 6, B = 24;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Check if either number divides the other with remainder 0.' },
      ],
    },
    {
      id: 'ch8-p3-adjust',
      title: 'Performance Readjustment Calculator',
      difficulty: 'Medium',
      description: 'Compute salary adjustment percentage: 0-400.00 (+15%), 400.01-800.00 (+12%), 800.01-1200.00 (+10%), 1200.01-2000.00 (+7%), >2000.00 (+4%).',
      inputSpec: 'Float value = 400.00.',
      sampleInput: '400.00',
      outputSpec: 'Print new salary, readjustment earned, and percentage increase.',
      sampleOutput: `Novo salario: 460.00
Reajuste ganho: 60.00
Em percentual: 15 %`,
      starterCode: `#include <stdio.h>

int main() {
    float salary = 400.00f;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'In printf, use %% to output a literal percent sign.' },
      ],
    },
    {
      id: 'ch8-p4-triangle-type',
      title: 'Triangle Classification (Equilateral, Isosceles, Scalene)',
      difficulty: 'Medium',
      description: 'Given 3 sides A = 7, B = 7, C = 7, classify the triangle type as Equilateral, Isosceles, or Scalene.',
      inputSpec: 'Sides: 7, 7, 7.',
      sampleInput: '7 7 7',
      outputSpec: 'Print "TRIANGULO EQUILATERO" or matching classification.',
      sampleOutput: `TRIANGULO EQUILATERO`,
      starterCode: `#include <stdio.h>

int main() {
    int a = 7, b = 7, c = 7;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'All 3 sides equal is equilateral.' },
      ],
    },
  ],

  // ── CHAPTER 9: THE SWITCH-CASE STATEMENT ──
  'switch-case-statement': [
    {
      id: 'ch9-p1-area-code',
      title: 'Telecom Area Code Destination Lookup',
      difficulty: 'Easy',
      description: 'Using switch-case, map integer DDD area codes (61 = Brasilia, 71 = Salvador, 11 = Sao Paulo, 21 = Rio de Janeiro, 32 = Juiz de Fora, 19 = Campinas, 27 = Vitoria, 31 = Belo Horizonte) to destination city names.',
      inputSpec: 'Integer DDD = 11.',
      sampleInput: '11',
      outputSpec: 'Print destination city name.',
      sampleOutput: `Sao Paulo`,
      starterCode: `#include <stdio.h>

int main() {
    int ddd = 11;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Case 11 matches and prints Sao Paulo.' },
      ],
    },
    {
      id: 'ch9-p2-month',
      title: 'Numeric Month to English Name Converter',
      difficulty: 'Easy',
      description: 'Read an integer month number between 1 and 12, and print the corresponding full English month name.',
      inputSpec: 'Integer month number = 8.',
      sampleInput: '8',
      outputSpec: 'Print month name (e.g., "August").',
      sampleOutput: `August`,
      starterCode: `#include <stdio.h>

int main() {
    int month = 8;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Case 8 outputs August.' },
      ],
    },
    {
      id: 'ch9-p3-calc',
      title: 'Simple Calculator Operator Selector',
      difficulty: 'Medium',
      description: 'Evaluate an arithmetic expression with numbers a = 20, b = 4 and operator op = \'/\' using a switch-case statement.',
      inputSpec: 'a = 20, op = \'/\', b = 4.',
      sampleInput: '20 / 4',
      outputSpec: 'Print the computed calculation result.',
      sampleOutput: `Result = 5`,
      starterCode: `#include <stdio.h>

int main() {
    int a = 20, b = 4;
    char op = '/';
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Switch on op character: case \'/\': printf("Result = %d\\n", a / b);' },
      ],
    },
  ],

  // ── CHAPTER 10: WHILE & DO-WHILE LOOPS ──
  'while-do-while-loops': [
    {
      id: 'ch10-p1-pin',
      title: 'Security PIN Authentication Loop',
      difficulty: 'Easy',
      description: 'Read passwords until the valid access code (2002) is entered. For each invalid attempt print "Senha Invalida", and print "Acesso Permitido" upon success.',
      inputSpec: 'Sequence: 1999, 2000, 2002.',
      sampleInput: '1999\n2000\n2002',
      outputSpec: 'Print access statuses.',
      sampleOutput: `Senha Invalida
Senha Invalida
Acesso Permitido`,
      starterCode: `#include <stdio.h>

int main() {
    int attempts[] = {1999, 2000, 2002};
    int i = 0;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Loop while true; break immediately on password 2002.' },
      ],
    },
    {
      id: 'ch10-p2-fuel',
      title: 'Customer Fuel Preference Counter',
      difficulty: 'Medium',
      description: 'Count customer fuel choices at a station (1: Alcohol, 2: Gasoline, 3: Diesel, 4: End). Print the summary tally when code 4 is entered.',
      inputSpec: 'Inputs: 1, 2, 2, 3, 4.',
      sampleInput: '1\n2\n2\n3\n4',
      outputSpec: 'Print header "MUITO OBRIGADO" and count of each fuel.',
      sampleOutput: `MUITO OBRIGADO
Alcool: 1
Gasolina: 2
Diesel: 1`,
      starterCode: `#include <stdio.h>

int main() {
    int inputs[] = {1, 2, 2, 3, 4};
    int alc = 0, gas = 0, die = 0;
    int i = 0;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Increment counters and terminate upon reading code 4.' },
      ],
    },
    {
      id: 'ch10-p3-pos-avg',
      title: 'Positive Value Counter and Running Average',
      difficulty: 'Medium',
      description: 'Iterate through a sequence of 6 values {7, -5, 6, -3.4, 4.6, 12}, count how many are positive (> 0), and calculate their average.',
      inputSpec: 'Values: 7, -5, 6, -3.4, 4.6, 12.',
      sampleInput: '7 -5 6 -3.4 4.6 12',
      outputSpec: 'Print positive count and average.',
      sampleOutput: `4 valores positivos
7.4`,
      starterCode: `#include <stdio.h>

int main() {
    float vals[] = {7.0f, -5.0f, 6.0f, -3.4f, 4.6f, 12.0f};
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Sum positive values and divide by the count.' },
      ],
    },
  ],

  // ── CHAPTER 11: FOR LOOPS & NESTED PATTERNS ──
  'for-loops-nested-patterns': [
    {
      id: 'ch11-p1-mult-table',
      title: 'Arithmetic Multiplication Table Generator',
      difficulty: 'Easy',
      description: 'Generate the complete 1-to-10 multiplication table for a given integer N = 140.',
      inputSpec: 'Integer N = 140.',
      sampleInput: '140',
      outputSpec: 'Print 1 x 140 = 140 up to 10 x 140 = 1400.',
      sampleOutput: `1 x 140 = 140
2 x 140 = 280
3 x 140 = 420
4 x 140 = 560
5 x 140 = 700
6 x 140 = 840
7 x 140 = 980
8 x 140 = 1120
9 x 140 = 1260
10 x 140 = 1400`,
      starterCode: `#include <stdio.h>

int main() {
    int N = 140;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Run a for loop from i = 1 to 10.' },
      ],
    },
    {
      id: 'ch11-p2-grid-pum',
      title: 'Grid Number Pattern Generator',
      difficulty: 'Medium',
      description: 'Construct a structured number pattern consisting of N lines, where each line prints 3 consecutive integers followed by the keyword "PUM".',
      inputSpec: 'N = 2.',
      sampleInput: '2',
      outputSpec: 'Print 3 consecutive integers followed by "PUM" per line.',
      sampleOutput: `1 2 3 PUM
5 6 7 PUM`,
      starterCode: `#include <stdio.h>

int main() {
    int n = 2;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Increment counter by 4 after each line.' },
      ],
    },
    {
      id: 'ch11-p3-evens',
      title: 'Even Numbers Enumeration Generator',
      difficulty: 'Easy',
      description: 'Print all even numbers between 1 and 10 on separate lines using a for loop.',
      inputSpec: 'Range 1 to 10.',
      sampleInput: '10',
      outputSpec: 'Print even numbers 2, 4, 6, 8, 10.',
      sampleOutput: `2
4
6
8
10`,
      starterCode: `#include <stdio.h>

int main() {
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Start for loop at i = 2 with step i += 2.' },
      ],
    },
  ],

  // ── CHAPTER 12: LOOP CONTROL (BREAK, CONTINUE) ──
  'loop-control-break-continue': [
    {
      id: 'ch12-p1-accumulator',
      title: 'Threshold Accumulator & Break Tracker',
      difficulty: 'Medium',
      description: 'Sum consecutive integers starting from X = 3 until the accumulated sum strictly exceeds threshold Z = 20, then break and report how many numbers were added.',
      inputSpec: 'X = 3, Z = 20.',
      sampleInput: '3\n20',
      outputSpec: 'Print the count of numbers summed.',
      sampleOutput: `5`,
      starterCode: `#include <stdio.h>

int main() {
    int x = 3, z = 20;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: '3 + 4 + 5 + 6 + 7 = 25 (> 20), taking 5 numbers.' },
      ],
    },
    {
      id: 'ch12-p2-continue-odds',
      title: 'Odd Numbers Filter with Continue Statement',
      difficulty: 'Easy',
      description: 'Iterate from 1 to 6. If the number is even, skip it using continue; otherwise print the odd integer.',
      inputSpec: 'Range 1 to 6.',
      sampleInput: '6',
      outputSpec: 'Print odd numbers 1, 3, 5.',
      sampleOutput: `1
3
5`,
      starterCode: `#include <stdio.h>

int main() {
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Use if (i % 2 == 0) continue; inside the loop.' },
      ],
    },
    {
      id: 'ch12-p3-sentinel',
      title: 'Sentinel Loop Termination on Zero',
      difficulty: 'Medium',
      description: 'Process an array of values {15, 8, 42, 0, 99} and terminate immediately using break when a sentinel 0 value is encountered.',
      inputSpec: 'Sequence: 15, 8, 42, 0, 99.',
      sampleInput: '15 8 42 0 99',
      outputSpec: 'Print values until 0, then print "HALTED".',
      sampleOutput: `15
8
42
HALTED`,
      starterCode: `#include <stdio.h>

int main() {
    int data[] = {15, 8, 42, 0, 99};
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Break immediately when data[i] == 0.' },
      ],
    },
  ],

  // ── CHAPTER 13: 1D ARRAYS ──
  'arrays-matrices': [
    {
      id: 'ch13-p1-clamp',
      title: 'Array Normalization & Non-Zero Clamp',
      difficulty: 'Easy',
      description: 'Traverse an array of 5 numbers and replace all null (0) or negative values with 1.',
      inputSpec: 'X[5] = {0, -5, 63, 0, 4}.',
      sampleInput: '0 -5 63 0 4',
      outputSpec: 'Print each element in "X[i] = v" format.',
      sampleOutput: `X[0] = 1
X[1] = 1
X[2] = 63
X[3] = 1
X[4] = 4`,
      starterCode: `#include <stdio.h>

int main() {
    int X[5] = {0, -5, 63, 0, 4};

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'if (X[i] <= 0) X[i] = 1;' },
      ],
    },
    {
      id: 'ch13-p2-min-idx',
      title: 'Array Minimum Element & Index Finder',
      difficulty: 'Medium',
      description: 'Locate the minimum numerical value in an array and determine its exact 0-based index position.',
      inputSpec: 'Array = {25, 4, 18, 2, 77}.',
      sampleInput: '25 4 18 2 77',
      outputSpec: 'Print "Menor valor: <val>" and "Posicao: <pos>".',
      sampleOutput: `Menor valor: 2
Posicao: 3`,
      starterCode: `#include <stdio.h>

int main() {
    int X[5] = {25, 4, 18, 2, 77};

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Track lowest and pos in a single pass.' },
      ],
    },
    {
      id: 'ch13-p3-reverse',
      title: 'Array In-Place Reversal Printer',
      difficulty: 'Easy',
      description: 'Given an array of 4 integers {10, 20, 30, 40}, print its elements in reverse order.',
      inputSpec: 'Array {10, 20, 30, 40}.',
      sampleInput: '10 20 30 40',
      outputSpec: 'Print reversed array.',
      sampleOutput: `40
30
20
10`,
      starterCode: `#include <stdio.h>

int main() {
    int arr[4] = {10, 20, 30, 40};
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Iterate backwards from i = 3 down to 0.' },
      ],
    },
  ],

  // ── CHAPTER 14: 2D ARRAYS & MATRICES ──
  '2d-arrays-matrices': [
    {
      id: 'ch14-p1-row-sum',
      title: '2D Matrix Row Sum Calculator',
      difficulty: 'Medium',
      description: 'Compute the sum of all elements located along a specific row L = 1 in a 3x3 matrix.',
      inputSpec: 'Matrix 3x3 with row 1 = {4.0, 5.0, 6.0}.',
      sampleInput: '1\n1 2 3\n4 5 6\n7 8 9',
      outputSpec: 'Print sum of row elements with 1 decimal place.',
      sampleOutput: `15.0`,
      starterCode: `#include <stdio.h>

int main() {
    float M[3][3] = {
        {1.0f, 2.0f, 3.0f},
        {4.0f, 5.0f, 6.0f},
        {7.0f, 8.0f, 9.0f}
    };
    int L = 1;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Loop through column indices c for fixed row L.' },
      ],
    },
    {
      id: 'ch14-p2-diag-sum',
      title: 'Matrix Main Diagonal Sum Calculator',
      difficulty: 'Medium',
      description: 'Calculate the sum of elements lying on the main diagonal (M[0][0] + M[1][1] + M[2][2]) in a 3x3 matrix.',
      inputSpec: 'Matrix 3x3 with diagonal {2, 5, 8}.',
      sampleInput: '2 1 1\n1 5 1\n1 1 8',
      outputSpec: 'Print diagonal sum.',
      sampleOutput: `Diagonal Sum = 15`,
      starterCode: `#include <stdio.h>

int main() {
    int M[3][3] = {
        {2, 1, 1},
        {1, 5, 1},
        {1, 1, 8}
    };
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Sum elements where row index equals column index i == j.' },
      ],
    },
    {
      id: 'ch14-p3-scalar',
      title: '2D Matrix Scalar Multiplier',
      difficulty: 'Easy',
      description: 'Multiply each element of a 2x2 matrix by scalar multiplier K = 3.',
      inputSpec: 'Matrix {{1, 2}, {3, 4}}, Scalar K = 3.',
      sampleInput: '3\n1 2\n3 4',
      outputSpec: 'Print multiplied 2x2 matrix.',
      sampleOutput: `3 6
9 12`,
      starterCode: `#include <stdio.h>

int main() {
    int M[2][2] = {{1, 2}, {3, 4}};
    int k = 3;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Iterate with nested loops: M[r][c] * k.' },
      ],
    },
  ],

  // ── CHAPTER 15: STRINGS & THE NULL TERMINATOR (\0) ──
  'strings-text-manipulation': [
    {
      id: 'ch15-p1-led',
      title: 'Digital Display LED Segment Counter',
      difficulty: 'Medium',
      description: 'Count the total number of physical LED bars needed to display a numeric string on a 7-segment clock display.',
      inputSpec: 'String = "115380".',
      sampleInput: '115380',
      outputSpec: 'Print total LEDs count followed by "leds".',
      sampleOutput: `27 leds`,
      starterCode: `#include <stdio.h>

int main() {
    char str[] = "115380";
    int ledMap[] = {6, 2, 5, 5, 4, 5, 6, 3, 7, 6};

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'str[i] - \'0\' yields the integer index into ledMap.' },
      ],
    },
    {
      id: 'ch15-p2-strlen-manual',
      title: 'Manual String Length Counter without string.h',
      difficulty: 'Easy',
      description: 'Traverse a character string until the null terminator \'\\0\' is reached and count its length.',
      inputSpec: 'String: "Algorithm".',
      sampleInput: 'Algorithm',
      outputSpec: 'Print "Length = 9".',
      sampleOutput: `Length = 9`,
      starterCode: `#include <stdio.h>

int main() {
    char s[] = "Algorithm";
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Increment counter while s[i] != \'\\0\'.' },
      ],
    },
    {
      id: 'ch15-p3-vowels',
      title: 'Vowel Character Counter',
      difficulty: 'Easy',
      description: 'Count total lowercase vowels (a, e, i, o, u) present in a string "developer".',
      inputSpec: 'String: "developer".',
      sampleInput: 'developer',
      outputSpec: 'Print "Vowels = 4".',
      sampleOutput: `Vowels = 4`,
      starterCode: `#include <stdio.h>

int main() {
    char s[] = "developer";
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Check if char is a, e, i, o, or u.' },
      ],
    },
  ],

  // ── CHAPTER 16: STRING LIBRARY FUNCTIONS ──
  'string-library-functions': [
    {
      id: 'ch16-p1-suffix',
      title: 'String Suffix Pattern Matcher',
      difficulty: 'Medium',
      description: 'Determine whether string B matches the tail suffix of string A using standard library string functions.',
      inputSpec: 'A = "5678690", B = "690".',
      sampleInput: '5678690 690',
      outputSpec: 'Print "encaixa" if suffix matches, else print "nao encaixa".',
      sampleOutput: `encaixa`,
      starterCode: `#include <stdio.h>
#include <string.h>

int main() {
    char A[] = "5678690";
    char B[] = "690";

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Offset pointer A + (lenA - lenB) and compare with strcmp.' },
      ],
    },
    {
      id: 'ch16-p2-concat',
      title: 'String Copy & Concatenation with strcpy/strcat',
      difficulty: 'Easy',
      description: 'Join two strings "Algo" and "Flow" into a combined buffer using strcpy and strcat.',
      inputSpec: 'Strings: "Algo" and "Flow".',
      sampleInput: 'Algo Flow',
      outputSpec: 'Print "Combined: AlgoFlow".',
      sampleOutput: `Combined: AlgoFlow`,
      starterCode: `#include <stdio.h>
#include <string.h>

int main() {
    char s1[] = "Algo";
    char s2[] = "Flow";
    char dest[30];
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'strcpy(dest, s1); strcat(dest, s2);' },
      ],
    },
    {
      id: 'ch16-p3-cmp',
      title: 'Lexicographical String Comparison with strcmp',
      difficulty: 'Easy',
      description: 'Compare two strings "apple" and "banana" and determine which comes first alphabetically.',
      inputSpec: 'Strings: "apple", "banana".',
      sampleInput: 'apple banana',
      outputSpec: 'Print "apple comes before banana".',
      sampleOutput: `apple comes before banana`,
      starterCode: `#include <stdio.h>
#include <string.h>

int main() {
    char s1[] = "apple";
    char s2[] = "banana";
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'strcmp(s1, s2) returns < 0 when s1 is alphabetically before s2.' },
      ],
    },
  ],

  // ── CHAPTER 17: USER-DEFINED FUNCTIONS & SCOPE ──
  'functions-modular-programming': [
    {
      id: 'ch17-p1-gcd',
      title: 'Euclidean GCD Function',
      difficulty: 'Medium',
      description: 'Write a modular helper function int gcd(int a, int b) to compute the greatest common divisor using Euclidean division.',
      inputSpec: 'a = 48, b = 18.',
      sampleInput: '48 18',
      outputSpec: 'Print "GCD(48, 18) = 6".',
      sampleOutput: `GCD(48, 18) = 6`,
      starterCode: `#include <stdio.h>

int gcd(int a, int b) {
    // Write your code here
    
    return 0;
}

int main() {
    printf("GCD(48, 18) = %d\\n", gcd(48, 18));
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: '48 % 18 = 12; 18 % 12 = 6; 12 % 6 = 0 -> GCD is 6.' },
      ],
    },
    {
      id: 'ch17-p2-max3',
      title: 'Maximum of Three Numbers Function',
      difficulty: 'Easy',
      description: 'Write a modular function int max3(int a, int b, int c) that returns the largest of three integers.',
      inputSpec: 'a = 45, b = 92, c = 31.',
      sampleInput: '45 92 31',
      outputSpec: 'Print "Max = 92".',
      sampleOutput: `Max = 92`,
      starterCode: `#include <stdio.h>

int max3(int a, int b, int c) {
    // Write your code here
    
    return a;
}

int main() {
    printf("Max = %d\\n", max3(45, 92, 31));
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Compare a, b, and c using if-else.' },
      ],
    },
    {
      id: 'ch17-p3-temp',
      title: 'Celsius to Fahrenheit Temperature Converter',
      difficulty: 'Easy',
      description: 'Create a function float to_fahrenheit(float c) with formula (c * 9.0/5.0) + 32.0.',
      inputSpec: 'Celsius = 100.0.',
      sampleInput: '100.0',
      outputSpec: 'Print "100.00 C = 212.00 F".',
      sampleOutput: `100.00 C = 212.00 F`,
      starterCode: `#include <stdio.h>

float to_fahrenheit(float c) {
    // Write your code here
    
    return 0.0f;
}

int main() {
    float c = 100.0f;
    printf("%.2f C = %.2f F\\n", c, to_fahrenheit(c));
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Formula: (c * 9.0/5.0) + 32.0.' },
      ],
    },
  ],

  // ── CHAPTER 18: RECURSION & THE CALL STACK ──
  'recursion-call-stack': [
    {
      id: 'ch18-p1-fact',
      title: 'Recursive Factorial Calculator',
      difficulty: 'Easy',
      description: 'Compute the factorial N! for integer N = 4 using a recursive function that multiplies N by fact(N - 1).',
      inputSpec: 'N = 4.',
      sampleInput: '4',
      outputSpec: 'Print factorial integer value.',
      sampleOutput: `24`,
      starterCode: `#include <stdio.h>

int fact(int n) {
    // Write your code here
    
    return 1;
}

int main() {
    int N = 4;
    printf("%d\\n", fact(N));
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Base case returns 1 when n <= 1.' },
      ],
    },
    {
      id: 'ch18-p2-fib',
      title: 'Recursive Fibonacci Sequence Generator',
      difficulty: 'Medium',
      description: 'Compute the 7th Fibonacci number using recursion where fib(0)=0, fib(1)=1, fib(n)=fib(n-1)+fib(n-2).',
      inputSpec: 'N = 7.',
      sampleInput: '7',
      outputSpec: 'Print "Fib(7) = 13".',
      sampleOutput: `Fib(7) = 13`,
      starterCode: `#include <stdio.h>

int fib(int n) {
    // Write your code here
    
    return 0;
}

int main() {
    printf("Fib(7) = %d\\n", fib(7));
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Base cases: if (n <= 0) return 0; if (n == 1) return 1;' },
      ],
    },
    {
      id: 'ch18-p3-power',
      title: 'Recursive Integer Power Function',
      difficulty: 'Medium',
      description: 'Compute base raised to exponent (2^5 = 32) using recursive multiplication.',
      inputSpec: 'Base = 2, Exponent = 5.',
      sampleInput: '2 5',
      outputSpec: 'Print "2 ^ 5 = 32".',
      sampleOutput: `2 ^ 5 = 32`,
      starterCode: `#include <stdio.h>

int power(int base, int exp) {
    // Write your code here
    
    return 1;
}

int main() {
    printf("2 ^ 5 = %d\\n", power(2, 5));
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Base case: if (exp == 0) return 1;' },
      ],
    },
  ],

  // ── CHAPTER 19: POINTERS & MEMORY ADDRESSES ──
  'pointers-memory-addresses': [
    {
      id: 'ch19-p1-swap',
      title: 'In-Place Pointer Value Swap Function',
      difficulty: 'Easy',
      description: 'Write a function void swap(int *a, int *b) that swaps two integer variables in-place using memory dereferencing.',
      inputSpec: 'x = 10, y = 99.',
      sampleInput: '10 99',
      outputSpec: 'Print swapped values: "x = 99, y = 10".',
      sampleOutput: `x = 99, y = 10`,
      starterCode: `#include <stdio.h>

void swap(int *a, int *b) {
    // Write your code here
    
}

int main() {
    int x = 10, y = 99;
    swap(&x, &y);
    printf("x = %d, y = %d\\n", x, y);
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Pass addresses &x and &y to swap().' },
      ],
    },
    {
      id: 'ch19-p2-deref',
      title: 'Direct Memory Dereference and Assignment',
      difficulty: 'Easy',
      description: 'Modify the value of variable target through a pointer variable ptr and verify the update.',
      inputSpec: 'target = 25, update to 100.',
      sampleInput: '25',
      outputSpec: 'Print "Updated Value = 100".',
      sampleOutput: `Updated Value = 100`,
      starterCode: `#include <stdio.h>

int main() {
    int target = 25;
    int *ptr = &target;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: '*ptr = 100 alters target in memory.' },
      ],
    },
    {
      id: 'ch19-p3-minmax',
      title: 'Multiple Outputs via Pointer Arguments',
      difficulty: 'Medium',
      description: 'Write a function void find_bounds(int a, int b, int *min, int *max) that writes both minimum and maximum values into pointer targets.',
      inputSpec: 'a = 15, b = 42.',
      sampleInput: '15 42',
      outputSpec: 'Print "Min = 15, Max = 42".',
      sampleOutput: `Min = 15, Max = 42`,
      starterCode: `#include <stdio.h>

void find_bounds(int a, int b, int *min, int *max) {
    // Write your code here
    
}

int main() {
    int min, max;
    find_bounds(15, 42, &min, &max);
    printf("Min = %d, Max = %d\\n", min, max);
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: '*min = (a < b) ? a : b; *max = (a > b) ? a : b;' },
      ],
    },
  ],

  // ── CHAPTER 20: POINTERS, ARRAYS & POINTER MATH ──
  'pointers-arrays-functions': [
    {
      id: 'ch20-p1-ptr-walk',
      title: 'Array Traversal via Pointer Arithmetic (ptr++)',
      difficulty: 'Easy',
      description: 'Traverse an array of 3 integers {10, 20, 30} using a pointer increment operation (ptr++).',
      inputSpec: 'Array {10, 20, 30}.',
      sampleInput: '10 20 30',
      outputSpec: 'Print each element on a new line.',
      sampleOutput: `10
20
30`,
      starterCode: `#include <stdio.h>

int main() {
    int arr[3] = {10, 20, 30};
    int *p = arr;

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'p++ advances pointer by sizeof(int) (4 bytes).' },
      ],
    },
    {
      id: 'ch20-p2-sum-ptr',
      title: 'Array Summation via Pointer Math',
      difficulty: 'Easy',
      description: 'Sum all elements in an array {5, 10, 15, 20} using pointer offset notation *(arr + i).',
      inputSpec: 'Array {5, 10, 15, 20}.',
      sampleInput: '5 10 15 20',
      outputSpec: 'Print "Sum = 50".',
      sampleOutput: `Sum = 50`,
      starterCode: `#include <stdio.h>

int main() {
    int arr[4] = {5, 10, 15, 20};
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Use sum += *(arr + i) in a loop.' },
      ],
    },
    {
      id: 'ch20-p3-pass-arr',
      title: 'Passing Array to Function as Pointer',
      difficulty: 'Medium',
      description: 'Write a function int sum_array(int *arr, int n) that receives an array pointer and returns its total sum.',
      inputSpec: 'Array {2, 4, 6, 8}, size 4.',
      sampleInput: '2 4 6 8',
      outputSpec: 'Print "Total = 20".',
      sampleOutput: `Total = 20`,
      starterCode: `#include <stdio.h>

int sum_array(int *arr, int n) {
    // Write your code here
    
    return 0;
}

int main() {
    int arr[4] = {2, 4, 6, 8};
    printf("Total = %d\\n", sum_array(arr, 4));
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Iterate through arr pointer up to index n.' },
      ],
    },
  ],

  // ── CHAPTER 21: STRUCTURES (STRUCT), UNIONS & ENUMS ──
  'structures-unions-enums': [
    {
      id: 'ch21-p1-struct',
      title: 'Student Grade Record Struct',
      difficulty: 'Easy',
      description: 'Define a struct Student with id (int), name (string), and gpa (float). Print the formatted record.',
      inputSpec: 'ID: 101, Name: Alice, GPA: 3.95.',
      sampleInput: '101 Alice 3.95',
      outputSpec: 'Print formatted record.',
      sampleOutput: `ID: 101 | Name: Alice | GPA: 3.95`,
      starterCode: `#include <stdio.h>

typedef struct {
    int id;
    char name[20];
    float gpa;
} Student;

int main() {
    Student s = {101, "Alice", 3.95f};

    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Access members with dot notation: s.id, s.name, s.gpa.' },
      ],
    },
    {
      id: 'ch21-p2-point-dist',
      title: '2D Coordinate Point Struct Distance',
      difficulty: 'Medium',
      description: 'Define a struct Point with x and y coordinates. Calculate Manhattan distance |x2-x1| + |y2-y1| between p1(2, 3) and p2(8, 11).',
      inputSpec: 'p1 = (2, 3), p2 = (8, 11).',
      sampleInput: '2 3\n8 11',
      outputSpec: 'Print "Manhattan Distance = 14".',
      sampleOutput: `Manhattan Distance = 14`,
      starterCode: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int x;
    int y;
} Point;

int main() {
    Point p1 = {2, 3};
    Point p2 = {8, 11};
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'abs(p2.x - p1.x) + abs(p2.y - p1.y) = 6 + 8 = 14.' },
      ],
    },
    {
      id: 'ch21-p3-enum',
      title: 'Traffic Light State Machine with Enum',
      difficulty: 'Easy',
      description: 'Create an enum TrafficLight {RED = 1, YELLOW = 2, GREEN = 3}. Print the active state name for state GREEN.',
      inputSpec: 'Enum value GREEN.',
      sampleInput: 'GREEN',
      outputSpec: 'Print "Signal: GREEN (3)".',
      sampleOutput: `Signal: GREEN (3)`,
      starterCode: `#include <stdio.h>

typedef enum {
    RED = 1,
    YELLOW = 2,
    GREEN = 3
} TrafficLight;

int main() {
    TrafficLight signal = GREEN;
    
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'printf("Signal: GREEN (%d)\\n", signal);' },
      ],
    },
  ],

  // ── CHAPTER 22: DYNAMIC MEMORY ALLOCATION ──
  'dynamic-memory-allocation': [
    {
      id: 'ch22-p1-malloc',
      title: 'Dynamic Heap Allocation with malloc() & free()',
      difficulty: 'Easy',
      description: 'Allocate heap memory for 3 integers using malloc(), populate with {10, 20, 30}, print, and release memory with free().',
      inputSpec: 'Size = 3 integers.',
      sampleInput: '3',
      outputSpec: 'Print elements.',
      sampleOutput: `arr[0] = 10
arr[1] = 20
arr[2] = 30`,
      starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Always check if pointer is NULL and call free() when done.' },
      ],
    },
    {
      id: 'ch22-p2-calloc',
      title: 'Zero-Initialized Heap Buffer with calloc()',
      difficulty: 'Easy',
      description: 'Allocate a zero-initialized buffer of 4 integers with calloc(), confirm elements are 0, and free memory.',
      inputSpec: 'Size = 4.',
      sampleInput: '4',
      outputSpec: 'Print "Buffer Initialized with 0s: 0 0 0 0".',
      sampleOutput: `Buffer Initialized with 0s: 0 0 0 0`,
      starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'int *arr = (int*)calloc(4, sizeof(int));' },
      ],
    },
    {
      id: 'ch22-p3-realloc',
      title: 'Dynamic Array Resizing with realloc()',
      difficulty: 'Medium',
      description: 'Allocate an initial array of 2 integers {100, 200}, expand capacity to 3 with realloc(), add element 300, and print.',
      inputSpec: 'Expand from 2 to 3 elements.',
      sampleInput: '2 -> 3',
      outputSpec: 'Print "Expanded: 100 200 300".',
      sampleOutput: `Expanded: 100 200 300`,
      starterCode: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Use realloc(ptr, 3 * sizeof(int)) to expand heap block.' },
      ],
    },
  ],

  // ── CHAPTER 23: FILE HANDLING & PERSISTENT DATA ──
  'file-handling-persistent-data': [
    {
      id: 'ch23-p1-file',
      title: 'File Stream Read/Write Simulation',
      difficulty: 'Easy',
      description: 'Demonstrate writing formatted data to a file stream using fopen("scores.txt", "w"), fprintf(), and fclose().',
      inputSpec: 'Score = 99990.',
      sampleInput: '99990',
      outputSpec: 'Print stream lifecycle status.',
      sampleOutput: `File Stream: 'scores.txt' opened in [WRITE] mode
fprintf: Score = 99990
fclose: Stream flushed and closed cleanly`,
      starterCode: `#include <stdio.h>

int main() {
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Always pair fopen() with fclose().' },
      ],
    },
    {
      id: 'ch23-p2-append',
      title: 'Persistent Log Appending (Mode "a")',
      difficulty: 'Easy',
      description: 'Simulate appending a timestamped entry to a log file using fopen("events.log", "a").',
      inputSpec: 'Event: "USER_LOGIN_SUCCESS".',
      sampleInput: 'USER_LOGIN_SUCCESS',
      outputSpec: 'Print "[APPEND] events.log -> USER_LOGIN_SUCCESS".',
      sampleOutput: `[APPEND] events.log -> USER_LOGIN_SUCCESS`,
      starterCode: `#include <stdio.h>

int main() {
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Mode "a" appends data to the end of the file without erasing.' },
      ],
    },
    {
      id: 'ch23-p3-read',
      title: 'Formatted File Stream Reading Simulation (fscanf)',
      difficulty: 'Medium',
      description: 'Simulate reading structured player record (Player: "Hero", Level: 45, Score: 9800) from a file stream.',
      inputSpec: 'Hero 45 9800.',
      sampleInput: 'Hero 45 9800',
      outputSpec: 'Print "Loaded Player: Hero | Level: 45 | Score: 9800".',
      sampleOutput: `Loaded Player: Hero | Level: 45 | Score: 9800`,
      starterCode: `#include <stdio.h>

int main() {
    // Write your code here
    
    return 0;
}`,
      hints: [
        { cost: 5, label: 'Hint 1', text: 'Use fscanf(fp, "%s %d %d", name, &level, &score);' },
      ],
    },
  ],
};
