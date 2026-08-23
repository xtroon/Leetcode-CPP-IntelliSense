export interface STLMethod {
  label: string;
  detail: string;
  documentation: string;
  insertText: string;
  isSnippet?: boolean;
}

export const STL_DEFINITIONS: Record<string, STLMethod[]> = {
  vector: [
    { label: "push_back", detail: "void push_back(const T& val)", documentation: "Appends element to the end of vector.", insertText: "push_back(${1:val})" },
    { label: "pop_back", detail: "void pop_back()", documentation: "Removes last element.", insertText: "pop_back()" },
    { label: "size", detail: "size_t size() const", documentation: "Returns number of elements.", insertText: "size()" },
    { label: "empty", detail: "bool empty() const", documentation: "Checks whether container is empty.", insertText: "empty()" },
    { label: "clear", detail: "void clear()", documentation: "Clears content.", insertText: "clear()" },
    { label: "front", detail: "T& front()", documentation: "Access first element.", insertText: "front()" },
    { label: "back", detail: "T& back()", documentation: "Access last element.", insertText: "back()" },
    { label: "begin", detail: "iterator begin()", documentation: "Returns iterator to beginning.", insertText: "begin()" },
    { label: "end", detail: "iterator end()", documentation: "Returns iterator to end.", insertText: "end()" },
    { label: "rbegin", detail: "reverse_iterator rbegin()", documentation: "Returns reverse iterator to reverse beginning.", insertText: "rbegin()" },
    { label: "rend", detail: "reverse_iterator rend()", documentation: "Returns reverse iterator to reverse end.", insertText: "rend()" },
    { label: "insert", detail: "iterator insert(const_iterator pos, const T& val)", documentation: "Inserts element at specified position.", insertText: "insert(${1:pos}, ${2:val})" },
    { label: "erase", detail: "iterator erase(const_iterator pos)", documentation: "Erases element at specified position or range.", insertText: "erase(${1:pos})" },
    { label: "reserve", detail: "void reserve(size_t n)", documentation: "Reserves storage capacity.", insertText: "reserve(${1:n})" },
    { label: "resize", detail: "void resize(size_t n)", documentation: "Resizes vector.", insertText: "resize(${1:n})" },
    { label: "assign", detail: "void assign(size_t n, const T& val)", documentation: "Assigns new contents.", insertText: "assign(${1:n}, ${2:val})" },
    { label: "emplace_back", detail: "template <class... Args> T& emplace_back(Args&&... args)", documentation: "Constructs element in-place at end.", insertText: "emplace_back(${1:args})" },
    { label: "at", detail: "T& at(size_t n)", documentation: "Access element with bounds checking.", insertText: "at(${1:idx})" },
  ],
  string: [
    { label: "size", detail: "size_t size() const", documentation: "Returns string length.", insertText: "size()" },
    { label: "length", detail: "size_t length() const", documentation: "Returns string length.", insertText: "length()" },
    { label: "empty", detail: "bool empty() const", documentation: "Checks whether string is empty.", insertText: "empty()" },
    { label: "substr", detail: "string substr(size_t pos = 0, size_t count = npos) const", documentation: "Generates substring.", insertText: "substr(${1:pos}, ${2:len})" },
    { label: "find", detail: "size_t find(const string& str, size_t pos = 0) const", documentation: "Finds substring position.", insertText: "find(${1:str})" },
    { label: "rfind", detail: "size_t rfind(const string& str, size_t pos = npos) const", documentation: "Finds last occurrence of substring.", insertText: "rfind(${1:str})" },
    { label: "push_back", detail: "void push_back(char c)", documentation: "Appends character to end.", insertText: "push_back(${1:ch})" },
    { label: "pop_back", detail: "void pop_back()", documentation: "Removes last character.", insertText: "pop_back()" },
    { label: "append", detail: "string& append(const string& str)", documentation: "Appends text to string.", insertText: "append(${1:str})" },
    { label: "compare", detail: "int compare(const string& str) const", documentation: "Compares strings.", insertText: "compare(${1:str})" },
    { label: "c_str", detail: "const char* c_str() const", documentation: "Returns C-style pointer.", insertText: "c_str()" },
    { label: "begin", detail: "iterator begin()", documentation: "Returns iterator to beginning.", insertText: "begin()" },
    { label: "end", detail: "iterator end()", documentation: "Returns iterator to end.", insertText: "end()" },
    { label: "clear", detail: "void clear()", documentation: "Erases string contents.", insertText: "clear()" },
    { label: "front", detail: "char& front()", documentation: "Access first character.", insertText: "front()" },
    { label: "back", detail: "char& back()", documentation: "Access last character.", insertText: "back()" },
  ],
  map: [
    { label: "insert", detail: "pair<iterator,bool> insert(const value_type& val)", documentation: "Inserts element.", insertText: "insert({${1:key}, ${2:val}})" },
    { label: "emplace", detail: "pair<iterator,bool> emplace(Args&&... args)", documentation: "Constructs element in-place.", insertText: "emplace(${1:key}, ${2:val})" },
    { label: "erase", detail: "size_t erase(const key_type& key)", documentation: "Removes element by key or iterator.", insertText: "erase(${1:key})" },
    { label: "find", detail: "iterator find(const key_type& key)", documentation: "Finds element by key.", insertText: "find(${1:key})" },
    { label: "count", detail: "size_t count(const key_type& key) const", documentation: "Returns 1 if key exists, 0 otherwise.", insertText: "count(${1:key})" },
    { label: "contains", detail: "bool contains(const key_type& key) const", documentation: "Checks if key exists (C++20).", insertText: "contains(${1:key})" },
    { label: "size", detail: "size_t size() const", documentation: "Returns number of elements.", insertText: "size()" },
    { label: "empty", detail: "bool empty() const", documentation: "Checks if map is empty.", insertText: "empty()" },
    { label: "clear", detail: "void clear()", documentation: "Clears all elements.", insertText: "clear()" },
    { label: "begin", detail: "iterator begin()", documentation: "Returns iterator to start.", insertText: "begin()" },
    { label: "end", detail: "iterator end()", documentation: "Returns iterator to end.", insertText: "end()" },
    { label: "at", detail: "mapped_type& at(const key_type& key)", documentation: "Access element with bounds check.", insertText: "at(${1:key})" },
  ],
  unordered_map: [
    { label: "insert", detail: "pair<iterator,bool> insert(const value_type& val)", documentation: "Inserts element.", insertText: "insert({${1:key}, ${2:val}})" },
    { label: "emplace", detail: "pair<iterator,bool> emplace(Args&&... args)", documentation: "Constructs element in-place.", insertText: "emplace(${1:key}, ${2:val})" },
    { label: "erase", detail: "size_t erase(const key_type& key)", documentation: "Removes element by key or iterator.", insertText: "erase(${1:key})" },
    { label: "find", detail: "iterator find(const key_type& key)", documentation: "Finds element by key.", insertText: "find(${1:key})" },
    { label: "count", detail: "size_t count(const key_type& key) const", documentation: "Returns 1 if key exists, 0 otherwise.", insertText: "count(${1:key})" },
    { label: "contains", detail: "bool contains(const key_type& key) const", documentation: "Checks if key exists (C++20).", insertText: "contains(${1:key})" },
    { label: "size", detail: "size_t size() const", documentation: "Returns number of elements.", insertText: "size()" },
    { label: "empty", detail: "bool empty() const", documentation: "Checks if map is empty.", insertText: "empty()" },
    { label: "clear", detail: "void clear()", documentation: "Clears all elements.", insertText: "clear()" },
    { label: "begin", detail: "iterator begin()", documentation: "Returns iterator to start.", insertText: "begin()" },
    { label: "end", detail: "iterator end()", documentation: "Returns iterator to end.", insertText: "end()" },
    { label: "at", detail: "mapped_type& at(const key_type& key)", documentation: "Access element with bounds check.", insertText: "at(${1:key})" },
  ],
  set: [
    { label: "insert", detail: "pair<iterator,bool> insert(const value_type& val)", documentation: "Inserts element into set.", insertText: "insert(${1:val})" },
    { label: "emplace", detail: "pair<iterator,bool> emplace(Args&&... args)", documentation: "Constructs element in-place.", insertText: "emplace(${1:val})" },
    { label: "erase", detail: "size_t erase(const key_type& key)", documentation: "Removes element.", insertText: "erase(${1:val})" },
    { label: "find", detail: "iterator find(const key_type& key)", documentation: "Finds element.", insertText: "find(${1:val})" },
    { label: "count", detail: "size_t count(const key_type& key) const", documentation: "Returns 1 if element present.", insertText: "count(${1:val})" },
    { label: "contains", detail: "bool contains(const key_type& key) const", documentation: "Checks if element exists.", insertText: "contains(${1:val})" },
    { label: "size", detail: "size_t size() const", documentation: "Returns size.", insertText: "size()" },
    { label: "empty", detail: "bool empty() const", documentation: "Checks if empty.", insertText: "empty()" },
    { label: "clear", detail: "void clear()", documentation: "Clears set.", insertText: "clear()" },
    { label: "begin", detail: "iterator begin()", documentation: "Iterator to start.", insertText: "begin()" },
    { label: "end", detail: "iterator end()", documentation: "Iterator to end.", insertText: "end()" },
  ],
  unordered_set: [
    { label: "insert", detail: "pair<iterator,bool> insert(const value_type& val)", documentation: "Inserts element into unordered_set.", insertText: "insert(${1:val})" },
    { label: "emplace", detail: "pair<iterator,bool> emplace(Args&&... args)", documentation: "Constructs element in-place.", insertText: "emplace(${1:val})" },
    { label: "erase", detail: "size_t erase(const key_type& key)", documentation: "Removes element.", insertText: "erase(${1:val})" },
    { label: "find", detail: "iterator find(const key_type& key)", documentation: "Finds element.", insertText: "find(${1:val})" },
    { label: "count", detail: "size_t count(const key_type& key) const", documentation: "Returns 1 if element present.", insertText: "count(${1:val})" },
    { label: "contains", detail: "bool contains(const key_type& key) const", documentation: "Checks if element exists.", insertText: "contains(${1:val})" },
    { label: "size", detail: "size_t size() const", documentation: "Returns size.", insertText: "size()" },
    { label: "empty", detail: "bool empty() const", documentation: "Checks if empty.", insertText: "empty()" },
    { label: "clear", detail: "void clear()", documentation: "Clears set.", insertText: "clear()" },
    { label: "begin", detail: "iterator begin()", documentation: "Iterator to start.", insertText: "begin()" },
    { label: "end", detail: "iterator end()", documentation: "Iterator to end.", insertText: "end()" },
  ],
  stack: [
    { label: "push", detail: "void push(const T& val)", documentation: "Pushes element onto stack.", insertText: "push(${1:val})" },
    { label: "pop", detail: "void pop()", documentation: "Removes top element.", insertText: "pop()" },
    { label: "top", detail: "T& top()", documentation: "Accesses top element.", insertText: "top()" },
    { label: "size", detail: "size_t size() const", documentation: "Returns size.", insertText: "size()" },
    { label: "empty", detail: "bool empty() const", documentation: "Checks if empty.", insertText: "empty()" },
    { label: "emplace", detail: "void emplace(Args&&... args)", documentation: "Constructs element on top.", insertText: "emplace(${1:val})" },
  ],
  queue: [
    { label: "push", detail: "void push(const T& val)", documentation: "Pushes element to back.", insertText: "push(${1:val})" },
    { label: "pop", detail: "void pop()", documentation: "Removes front element.", insertText: "pop()" },
    { label: "front", detail: "T& front()", documentation: "Accesses front element.", insertText: "front()" },
    { label: "back", detail: "T& back()", documentation: "Accesses back element.", insertText: "back()" },
    { label: "size", detail: "size_t size() const", documentation: "Returns size.", insertText: "size()" },
    { label: "empty", detail: "bool empty() const", documentation: "Checks if empty.", insertText: "empty()" },
    { label: "emplace", detail: "void emplace(Args&&... args)", documentation: "Constructs element at back.", insertText: "emplace(${1:val})" },
  ],
  priority_queue: [
    { label: "push", detail: "void push(const T& val)", documentation: "Pushes element into priority queue.", insertText: "push(${1:val})" },
    { label: "pop", detail: "void pop()", documentation: "Removes highest priority element.", insertText: "pop()" },
    { label: "top", detail: "const T& top() const", documentation: "Accesses top priority element.", insertText: "top()" },
    { label: "size", detail: "size_t size() const", documentation: "Returns size.", insertText: "size()" },
    { label: "empty", detail: "bool empty() const", documentation: "Checks if empty.", insertText: "empty()" },
    { label: "emplace", detail: "void emplace(Args&&... args)", documentation: "Constructs element in priority queue.", insertText: "emplace(${1:val})" },
  ],
  deque: [
    { label: "push_back", detail: "void push_back(const T& val)", documentation: "Appends element to end.", insertText: "push_back(${1:val})" },
    { label: "push_front", detail: "void push_front(const T& val)", documentation: "Prepends element to front.", insertText: "push_front(${1:val})" },
    { label: "pop_back", detail: "void pop_back()", documentation: "Removes last element.", insertText: "pop_back()" },
    { label: "pop_front", detail: "void pop_front()", documentation: "Removes first element.", insertText: "pop_front()" },
    { label: "front", detail: "T& front()", documentation: "Accesses first element.", insertText: "front()" },
    { label: "back", detail: "T& back()", documentation: "Accesses last element.", insertText: "back()" },
    { label: "size", detail: "size_t size() const", documentation: "Returns size.", insertText: "size()" },
    { label: "empty", detail: "bool empty() const", documentation: "Checks if empty.", insertText: "empty()" },
    { label: "clear", detail: "void clear()", documentation: "Clears contents.", insertText: "clear()" },
    { label: "begin", detail: "iterator begin()", documentation: "Iterator to start.", insertText: "begin()" },
    { label: "end", detail: "iterator end()", documentation: "Iterator to end.", insertText: "end()" },
  ],
  pair: [
    { label: "first", detail: "T1 first", documentation: "First member of pair.", insertText: "first" },
    { label: "second", detail: "T2 second", documentation: "Second member of pair.", insertText: "second" },
  ],
  ListNode: [
    { label: "val", detail: "int val", documentation: "Node value.", insertText: "val" },
    { label: "next", detail: "ListNode* next", documentation: "Pointer to next node.", insertText: "next" },
  ],
  TreeNode: [
    { label: "val", detail: "int val", documentation: "Node value.", insertText: "val" },
    { label: "left", detail: "TreeNode* left", documentation: "Pointer to left child.", insertText: "left" },
    { label: "right", detail: "TreeNode* right", documentation: "Pointer to right child.", insertText: "right" },
  ]
};

// Aliases for types
STL_DEFINITIONS["std::vector"] = STL_DEFINITIONS.vector;
STL_DEFINITIONS["std::string"] = STL_DEFINITIONS.string;
STL_DEFINITIONS["std::map"] = STL_DEFINITIONS.map;
STL_DEFINITIONS["std::unordered_map"] = STL_DEFINITIONS.unordered_map;
STL_DEFINITIONS["std::set"] = STL_DEFINITIONS.set;
STL_DEFINITIONS["std::unordered_set"] = STL_DEFINITIONS.unordered_set;
STL_DEFINITIONS["std::stack"] = STL_DEFINITIONS.stack;
STL_DEFINITIONS["std::queue"] = STL_DEFINITIONS.queue;
STL_DEFINITIONS["std::priority_queue"] = STL_DEFINITIONS.priority_queue;
STL_DEFINITIONS["std::deque"] = STL_DEFINITIONS.deque;
STL_DEFINITIONS["std::pair"] = STL_DEFINITIONS.pair;
