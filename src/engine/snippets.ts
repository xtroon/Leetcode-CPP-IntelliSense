export interface CPSnippet {
  label: string;
  detail: string;
  documentation: string;
  snippet: string;
}

export const CP_SNIPPETS: CPSnippet[] = [
  {
    label: 'fori',
    detail: 'Standard index for loop',
    documentation: 'Generates a traditional zero-indexed for loop.',
    snippet: 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ++${1:i}) {\n\t$0\n}'
  },
  {
    label: 'fore',
    detail: 'Range-based for loop',
    documentation: 'Generates a C++ range-based for loop with reference.',
    snippet: 'for (auto& ${1:x} : ${2:container}) {\n\t$0\n}'
  },
  {
    label: 'pb',
    detail: 'push_back helper',
    documentation: 'Short method invocation for push_back.',
    snippet: 'push_back(${1:val})'
  },
  {
    label: 'sortv',
    detail: 'Sort container',
    documentation: 'Sorts container from begin() to end().',
    snippet: 'sort(${1:v}.begin(), ${1:v}.end());'
  },
  {
    label: 'all',
    detail: 'v.begin(), v.end()',
    documentation: 'Shorthand for full container range iterators.',
    snippet: '${1:v}.begin(), ${1:v}.end()'
  },
  {
    label: 'rall',
    detail: 'v.rbegin(), v.rend()',
    documentation: 'Shorthand for reverse container range iterators.',
    snippet: '${1:v}.rbegin(), ${1:v}.rend()'
  },
  {
    label: 'bfs',
    detail: 'BFS Traversal snippet',
    documentation: 'Breadth-First Search template using queue.',
    snippet: `queue<int> q;
vector<bool> vis(\${1:n}, false);
q.push(\${2:start});
vis[\${2:start}] = true;

while (!q.empty()) {
\tint curr = q.front();
\tq.pop();
\t$0
}`
  },
  {
    label: 'dfs',
    detail: 'DFS Traversal snippet',
    documentation: 'Depth-First Search recursive helper template.',
    snippet: `function<void(int)> dfs = [&](int u) {
\tvis[u] = true;
\tfor (int v : adj[u]) {
\t\tif (!vis[v]) {
\t\t\tdfs(v);
\t\t}
\t}
};`
  },
  {
    label: 'binsearch',
    detail: 'Binary Search Template',
    documentation: 'Standard binary search lower/upper bound loop template.',
    snippet: `int low = \${1:0}, high = \${2:n - 1};
int ans = -1;
while (low <= high) {
\tint mid = low + (high - low) / 2;
\tif (\${3:check(mid)}) {
\t\tans = mid;
\t\thigh = mid - 1;
\t} else {
\t\tlow = mid + 1;
\t}
}
$0`
  },
  {
    label: 'fastio',
    detail: 'Fast C++ I/O optimization',
    documentation: 'Disables synchronization between C and C++ standard streams.',
    snippet: 'ios_base::sync_with_stdio(false);\ncin.tie(NULL);'
  },
  {
    label: 'lbound',
    detail: 'lower_bound shorthand',
    documentation: 'Returns iterator to first element not less than val.',
    snippet: 'lower_bound(${1:v}.begin(), ${1:v}.end(), ${2:val})'
  },
  {
    label: 'ubound',
    detail: 'upper_bound shorthand',
    documentation: 'Returns iterator to first element strictly greater than val.',
    snippet: 'upper_bound(${1:v}.begin(), ${1:v}.end(), ${2:val})'
  },
  {
    label: 'gcd',
    detail: 'std::gcd',
    documentation: 'Greatest common divisor of two integers.',
    snippet: 'std::gcd(${1:a}, ${2:b})'
  },
  {
    label: 'lcm',
    detail: 'std::lcm',
    documentation: 'Least common multiple of two integers.',
    snippet: 'std::lcm(${1:a}, ${2:b})'
  }
];
