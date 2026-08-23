export interface Snippet {
  label: string;
  detail: string;
  documentation: string;
  insertText: string;
}

export const CP_SNIPPETS: Snippet[] = [
  {
    label: "fori",
    detail: "Indexed for-loop (0 to n)",
    documentation: "Standard index-based loop from 0 to n.",
    insertText: "for (int ${1:i} = 0; ${1:i} < ${2:n}; ++${1:i}) {\n\t$0\n}"
  },
  {
    label: "forj",
    detail: "Nested indexed for-loop (0 to m)",
    documentation: "Nested index-based loop from 0 to m.",
    insertText: "for (int ${1:j} = 0; ${1:j} < ${2:m}; ++${1:j}) {\n\t$0\n}"
  },
  {
    label: "fore",
    detail: "Range-based for loop",
    documentation: "Iterates over elements using reference auto&.",
    insertText: "for (auto& ${1:x} : ${2:nums}) {\n\t$0\n}"
  },
  {
    label: "pb",
    detail: "push_back shortcut",
    documentation: "Pushes value to vector/container.",
    insertText: "push_back(${1:val})"
  },
  {
    label: "sortv",
    detail: "sort(nums.begin(), nums.end())",
    documentation: "Sorts a container in ascending order.",
    insertText: "sort(${1:nums}.begin(), ${1:nums}.end());"
  },
  {
    label: "sortr",
    detail: "sort(nums.rbegin(), nums.rend())",
    documentation: "Sorts a container in descending order.",
    insertText: "sort(${1:nums}.rbegin(), ${1:nums}.rend());"
  },
  {
    label: "all",
    detail: "v.begin(), v.end() shortcut",
    documentation: "Expands to begin and end iterators of a container.",
    insertText: "${1:nums}.begin(), ${1:nums}.end()"
  },
  {
    label: "bs",
    detail: "Binary Search (lower_bound)",
    documentation: "Finds first position of element >= target.",
    insertText: "auto it = lower_bound(${1:nums}.begin(), ${1:nums}.end(), ${2:target});"
  },
  {
    label: "bfs",
    detail: "Queue-based BFS template",
    documentation: "Breadth-First Search template with queue and visited tracker.",
    insertText: "queue<${1:int}> q;\nq.push(${2:start});\nunordered_set<${1:int}> visited;\nvisited.insert(${2:start});\n\nwhile (!q.empty()) {\n\tauto curr = q.front();\n\tq.pop();\n\t$0\n}"
  },
  {
    label: "dfs",
    detail: "Recursive DFS lambda template",
    documentation: "Self-referencing recursive lambda function for DFS traversal.",
    insertText: "auto dfs = [&](auto& self, int u, int p) -> void {\n\t$0\n};\ndfs(dfs, ${1:0}, ${2:-1});"
  },
  {
    label: "fastio",
    detail: "Competitive Programming Fast I/O",
    documentation: "Unties cin/cout for high performance I/O.",
    insertText: "ios_base::sync_with_stdio(false);\ncin.tie(NULL);"
  },
  {
    label: "min",
    detail: "std::min(a, b)",
    documentation: "Returns minimum of two values.",
    insertText: "min(${1:a}, ${2:b})"
  },
  {
    label: "max",
    detail: "std::max(a, b)",
    documentation: "Returns maximum of two values.",
    insertText: "max(${1:a}, ${2:b})"
  },
  {
    label: "pq",
    detail: "Max-Heap Priority Queue",
    documentation: "Declares std::priority_queue (max-heap).",
    insertText: "priority_queue<${1:int}> ${2:pq};"
  },
  {
    label: "pqmin",
    detail: "Min-Heap Priority Queue",
    documentation: "Declares min-heap std::priority_queue.",
    insertText: "priority_queue<${1:int}, vector<${1:int}>, greater<${1:int}>> ${2:pq};"
  },
  {
    label: "uMap",
    detail: "std::unordered_map declaration",
    documentation: "Declares unordered_map container.",
    insertText: "unordered_map<${1:int}, ${2:int}> ${3:mp};"
  },
  {
    label: "uSet",
    detail: "std::unordered_set declaration",
    documentation: "Declares unordered_set container.",
    insertText: "unordered_set<${1:int}> ${2:st};"
  }
];
