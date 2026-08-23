# LeetSense ⚡

**LeetSense** is a lightweight, high-performance Chrome Extension (Manifest V3) that injects VS Code-style intelligent autocomplete and Competitive Programming (CP) snippets directly into LeetCode's Monaco code editor.

Everything runs **100% locally in your browser** with zero external API calls or backend dependencies.

---

## Features

### 1. 🎯 Scope-Aware Variable Autocomplete
- Parses function parameters and local variable declarations.
- Automatically tracks block scopes (`{ ... }`) line-by-line.
- Excludes variables that are not accessible within your current scope.

### 2. ⚡ Type-Aware C++ STL Method Completion
- Typing `.` or `->` after a variable automatically infers its type and provides context-relevant methods.
- Full support for common C++ STL containers and data structures:
  - **Containers**: `vector`, `string`, `deque`
  - **Associative**: `map`, `unordered_map`, `set`, `unordered_set`
  - **Adaptors**: `stack`, `queue`, `priority_queue`
  - **Utilities & LeetCode Types**: `pair`, `ListNode`, `TreeNode`

### 3. 🚀 Competitive Programming Snippets
- `fori` → Indexed loop `for (int i = 0; i < n; ++i)`
- `forj` → Nested loop `for (int j = 0; j < m; ++j)`
- `fore` → Range-based loop `for (auto& x : container)`
- `pb` → `push_back(val)`
- `sortv` → `sort(nums.begin(), nums.end())`
- `sortr` → `sort(nums.rbegin(), nums.rend())`
- `all` → `nums.begin(), nums.end()`
- `bs` → Binary search `lower_bound` template
- `bfs` → Queue-based BFS template
- `dfs` → Recursive DFS lambda template
- `fastio` → Fast I/O speedup block
- `pq` / `pqmin` → Max-heap / Min-heap priority queue
- `uMap` / `uSet` → `unordered_map` / `unordered_set`

### 4. 🎛️ Clean Glassmorphism Popup
- Instantly toggle Autocomplete or Snippets on/off.
- Changes update live in your active LeetCode Monaco editor tabs.

---

## Installation Guide (Chrome Developer Mode)

### Step 1: Build the Extension

Ensure you have [Node.js](https://nodejs.org/) (v16+) installed.

```bash
# Install dependencies
npm install

# Build the production extension package
npm run build
```

This compiles TypeScript files and outputs the unpacked extension bundle into the `dist/` directory.

### Step 2: Load into Google Chrome

1. Open **Google Chrome** and navigate to `chrome://extensions/` (or click **Menu** > **Extensions** > **Manage Extensions**).
2. Enable **Developer mode** using the toggle switch in the top-right corner.
3. Click the **Load unpacked** button in the top-left corner.
4. Select the **`dist`** folder located inside this project (`Leetcode Autoomplete/dist`).
5. **LeetSense** is now installed! 🚀

---

## Usage on LeetCode

1. Open any problem page on [LeetCode](https://leetcode.com/problems/) (or LeetCode CN).
2. Select **C++** as your programming language in the Monaco editor.
3. Start typing:
   - Declare variables like `vector<int> nums;` and type `nu` to see `nums` at the top of the completion widget.
   - Type `nums.` or `s.` to see type-aware STL methods with documentation.
   - Type `fori`, `fore`, `sortv`, or `bfs` and press <kbd>Tab</kbd> or <kbd>Enter</kbd> to expand CP snippets.
4. Click the **LeetSense** extension icon in your Chrome toolbar to toggle features dynamically.

---

## Project Structure

```
Leetcode Autoomplete/
├── manifest.json              # Chrome Extension V3 Manifest
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript compilation setup
├── build.js                   # Esbuild bundling script
├── README.md                  # Installation & documentation
├── src/
│   ├── types/
│   │   └── monaco.d.ts        # Monaco ambient ambient type definitions
│   ├── engine/
│   │   ├── cppParser.ts       # Scope-aware C++ AST & type parser
│   │   ├── stlDefinitions.ts  # C++ STL container & method database
│   │   ├── snippets.ts        # Competitive programming snippet definitions
│   │   └── completionProvider.ts # Monaco CompletionItemProvider implementation
│   ├── inject/
│   │   └── main.ts            # Main world script (registers Monaco provider)
│   ├── content/
│   │   └── content.ts         # Isolated world script (bridges chrome storage)
│   └── popup/
│       ├── popup.html         # Extension popup HTML UI
│       ├── popup.css          # Glassmorphism dark styling
│       └── popup.ts           # Settings toggle logic
└── dist/                      # Production extension ready to load into Chrome
```

---

## License

MIT License. Built for speed, efficiency, and seamless LeetCoding.
