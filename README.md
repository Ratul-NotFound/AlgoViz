# ⚡ AlgoViz — Interactive DSA Algorithm Visualizer

![AlgoViz Banner](https://img.shields.io/badge/AlgoViz-DSA%20Visualizer-f97316?style=for-the-badge&logo=codeforces&logoColor=white)
![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6-646cff?style=for-the-badge&logo=vite&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-ff0055?style=for-the-badge&logo=framer&logoColor=white)

An interactive, responsive Data Structures and Algorithms (DSA) visualizer built for learners. AlgoViz brings algorithms to life with real-time step-by-step animations, live pointer tracking, dynamic variable inspectors, and synchronized multi-language code highlighting in **5 programming languages** (Python, C, C++, Java, JavaScript).

---

## ✨ Features

- 📊 **12 Core DSA Algorithms**:
  - **Sorting**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort, Heap Sort
  - **Searching**: Linear Search, Binary Search
  - **Graphs**: Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's Shortest Path
  - **Trees**: Binary Search Tree (BST) Insertion & Traversal
- 💻 **5-Language Synchronized Code Highlighting**:
  - Python, C, C++, Java, JavaScript
  - Line-by-line glowing cursor synced to the exact active step in the animation.
- 🎯 **Visual Learning Aids**:
  - Real-time comparison bracket arcs showing active comparisons (`>`, `<`, `=`).
  - Bidirectional swap indicators.
  - Active pointer arrows (`i`, `j`, `mid`, `left`, `right`, `pivot`).
  - IDE-style live debugger variable panel (`dbg i=2 j=5`).
- 📱 **Fully Responsive Design**:
  - Desktop, tablet, and mobile-ready.
  - Slide-out mobile drawer navigation.
  - Mobile bottom tab navigation (**📊 Visual**, **💻 Code**, **ℹ️ Info**).
- 🎮 **Playback Controls**:
  - Play, Pause, Step Forward, Step Backward, Reset, and Speed slider (0.25x – 4x).
  - Array size adjustment & custom user input arrays.
  - Random array generator.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Ratul-NotFound/AlgoViz.git

# Navigate to project directory
cd AlgoViz

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Animations**: Framer Motion, SVG Canvas
- **Typography**: Space Grotesk, JetBrains Mono, Inter
- **Styling**: Vanilla CSS (Custom Design System)

---

## 📁 Project Structure

```
src/
├── algorithms/
│   ├── sorting/      # Bubble, Selection, Insertion, Merge, Quick, Heap
│   ├── searching/    # Linear, Binary Search
│   ├── graphs/       # BFS, DFS, Dijkstra
│   └── trees/        # Binary Search Tree
├── components/       # Sidebar, Controls, CodePanel, InfoPanel
├── engine/           # useStepper animation engine
├── pages/            # HomePage, AlgorithmPage
├── visualizers/      # ArrayVisualizer, GraphVisualizer, TreeVisualizer
└── data/             # Algorithm registry & metadata
```

---

## 📄 License

MIT License © 2026 Ratul
