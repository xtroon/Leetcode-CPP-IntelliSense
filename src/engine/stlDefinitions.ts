export interface STLMethod {
  name: string;
  signature: string;
  doc: string;
  insertSnippet: string;
}

export interface CppKeywordItem {
  label: string;
  detail: string;
  doc: string;
  insertText: string;
  kind: string; // 'type' | 'constant' | 'function' | 'keyword'
}

export const STL_TYPES: Record<string, STLMethod[]> = {
  vector: [
    { name: 'push_back', signature: 'void push_back(const T& val)', doc: 'Appends element to the end.', insertSnippet: 'push_back(${1:val})' },
    { name: 'emplace_back', signature: 'template<class... Args> reference emplace_back(Args&&... args)', doc: 'Appends a new element in-place to the end.', insertSnippet: 'emplace_back(${1:args})' },
    { name: 'pop_back', signature: 'void pop_back()', doc: 'Removes the last element.', insertSnippet: 'pop_back()' },
    { name: 'size', signature: 'size_type size() const', doc: 'Returns number of elements.', insertSnippet: 'size()' },
    { name: 'empty', signature: 'bool empty() const', doc: 'Checks whether container is empty.', insertSnippet: 'empty()' },
    { name: 'clear', signature: 'void clear()', doc: 'Clears all contents.', insertSnippet: 'clear()' },
    { name: 'front', signature: 'reference front()', doc: 'Accesses the first element.', insertSnippet: 'front()' },
    { name: 'back', signature: 'reference back()', doc: 'Accesses the last element.', insertSnippet: 'back()' },
    { name: 'begin', signature: 'iterator begin()', doc: 'Returns iterator to beginning.', insertSnippet: 'begin()' },
    { name: 'end', signature: 'iterator end()', doc: 'Returns iterator to end.', insertSnippet: 'end()' },
    { name: 'rbegin', signature: 'reverse_iterator rbegin()', doc: 'Returns reverse iterator to reverse beginning.', insertSnippet: 'rbegin()' },
    { name: 'rend', signature: 'reverse_iterator rend()', doc: 'Returns reverse iterator to reverse end.', insertSnippet: 'rend()' },
    { name: 'insert', signature: 'iterator insert(const_iterator pos, const T& value)', doc: 'Inserts element at specified position.', insertSnippet: 'insert(${1:pos}, ${2:value})' },
    { name: 'erase', signature: 'iterator erase(const_iterator pos)', doc: 'Erases element at specified position.', insertSnippet: 'erase(${1:pos})' },
    { name: 'resize', signature: 'void resize(size_type count)', doc: 'Resizes container to specified size.', insertSnippet: 'resize(${1:count})' },
    { name: 'reserve', signature: 'void reserve(size_type new_cap)', doc: 'Reserves minimum capacity.', insertSnippet: 'reserve(${1:new_cap})' },
    { name: 'assign', signature: 'void assign(size_type count, const T& value)', doc: 'Replaces contents with count copies of value.', insertSnippet: 'assign(${1:count}, ${2:value})' },
    { name: 'capacity', signature: 'size_type capacity() const', doc: 'Returns current allocated capacity.', insertSnippet: 'capacity()' }
  ],
  string: [
    { name: 'length', signature: 'size_type length() const', doc: 'Returns string length in characters.', insertSnippet: 'length()' },
    { name: 'size', signature: 'size_type size() const', doc: 'Returns string length in characters.', insertSnippet: 'size()' },
    { name: 'substr', signature: 'string substr(size_type pos = 0, size_type count = npos) const', doc: 'Returns substring starting at pos.', insertSnippet: 'substr(${1:pos}, ${2:count})' },
    { name: 'find', signature: 'size_type find(const string& str, size_type pos = 0) const', doc: 'Finds first occurrence of substring.', insertSnippet: 'find(${1:str})' },
    { name: 'rfind', signature: 'size_type rfind(const string& str, size_type pos = npos) const', doc: 'Finds last occurrence of substring.', insertSnippet: 'rfind(${1:str})' },
    { name: 'push_back', signature: 'void push_back(char ch)', doc: 'Appends character to end.', insertSnippet: 'push_back(${1:ch})' },
    { name: 'pop_back', signature: 'void pop_back()', doc: 'Removes character from end.', insertSnippet: 'pop_back()' },
    { name: 'empty', signature: 'bool empty() const', doc: 'Checks if string is empty.', insertSnippet: 'empty()' },
    { name: 'clear', signature: 'void clear()', doc: 'Erases all characters.', insertSnippet: 'clear()' },
    { name: 'front', signature: 'char& front()', doc: 'Accesses first character.', insertSnippet: 'front()' },
    { name: 'back', signature: 'char& back()', doc: 'Accesses last character.', insertSnippet: 'back()' },
    { name: 'begin', signature: 'iterator begin()', doc: 'Returns iterator to beginning.', insertSnippet: 'begin()' },
    { name: 'end', signature: 'iterator end()', doc: 'Returns iterator to end.', insertSnippet: 'end()' },
    { name: 'append', signature: 'string& append(const string& str)', doc: 'Appends string.', insertSnippet: 'append(${1:str})' },
    { name: 'compare', signature: 'int compare(const string& str) const', doc: 'Compares two strings.', insertSnippet: 'compare(${1:str})' },
    { name: 'c_str', signature: 'const char* c_str() const', doc: 'Returns C-style null-terminated string.', insertSnippet: 'c_str()' }
  ],
  map: [
    { name: 'insert', signature: 'pair<iterator, bool> insert(const value_type& value)', doc: 'Inserts key-value element.', insertSnippet: 'insert({${1:key}, ${2:value}})' },
    { name: 'emplace', signature: 'template<class... Args> pair<iterator, bool> emplace(Args&&... args)', doc: 'Constructs element in-place.', insertSnippet: 'emplace(${1:key}, ${2:value})' },
    { name: 'erase', signature: 'size_type erase(const Key& key)', doc: 'Erases element by key.', insertSnippet: 'erase(${1:key})' },
    { name: 'find', signature: 'iterator find(const Key& key)', doc: 'Finds element with specific key.', insertSnippet: 'find(${1:key})' },
    { name: 'count', signature: 'size_type count(const Key& key) const', doc: 'Returns 1 if key exists, else 0.', insertSnippet: 'count(${1:key})' },
    { name: 'contains', signature: 'bool contains(const Key& key) const', doc: 'Checks if key exists (C++20).', insertSnippet: 'contains(${1:key})' },
    { name: 'size', signature: 'size_type size() const', doc: 'Returns number of elements.', insertSnippet: 'size()' },
    { name: 'empty', signature: 'bool empty() const', doc: 'Checks if map is empty.', insertSnippet: 'empty()' },
    { name: 'clear', signature: 'void clear()', doc: 'Removes all elements.', insertSnippet: 'clear()' },
    { name: 'begin', signature: 'iterator begin()', doc: 'Returns iterator to beginning.', insertSnippet: 'begin()' },
    { name: 'end', signature: 'iterator end()', doc: 'Returns iterator to end.', insertSnippet: 'end()' },
    { name: 'at', signature: 'T& at(const Key& key)', doc: 'Accesses element with bounds check.', insertSnippet: 'at(${1:key})' }
  ],
  unordered_map: [
    { name: 'insert', signature: 'pair<iterator, bool> insert(const value_type& value)', doc: 'Inserts key-value element.', insertSnippet: 'insert({${1:key}, ${2:value}})' },
    { name: 'emplace', signature: 'template<class... Args> pair<iterator, bool> emplace(Args&&... args)', doc: 'Constructs element in-place.', insertSnippet: 'emplace(${1:key}, ${2:value})' },
    { name: 'erase', signature: 'size_type erase(const Key& key)', doc: 'Erases element by key.', insertSnippet: 'erase(${1:key})' },
    { name: 'find', signature: 'iterator find(const Key& key)', doc: 'Finds element with specific key.', insertSnippet: 'find(${1:key})' },
    { name: 'count', signature: 'size_type count(const Key& key) const', doc: 'Returns 1 if key exists, else 0.', insertSnippet: 'count(${1:key})' },
    { name: 'contains', signature: 'bool contains(const Key& key) const', doc: 'Checks if key exists (C++20).', insertSnippet: 'contains(${1:key})' },
    { name: 'size', signature: 'size_type size() const', doc: 'Returns number of elements.', insertSnippet: 'size()' },
    { name: 'empty', signature: 'bool empty() const', doc: 'Checks if unordered_map is empty.', insertSnippet: 'empty()' },
    { name: 'clear', signature: 'void clear()', doc: 'Removes all elements.', insertSnippet: 'clear()' },
    { name: 'begin', signature: 'iterator begin()', doc: 'Returns iterator to beginning.', insertSnippet: 'begin()' },
    { name: 'end', signature: 'iterator end()', doc: 'Returns iterator to end.', insertSnippet: 'end()' },
    { name: 'at', signature: 'T& at(const Key& key)', doc: 'Accesses element with bounds check.', insertSnippet: 'at(${1:key})' },
    { name: 'reserve', signature: 'void reserve(size_type n)', doc: 'Reserves space for at least n elements.', insertSnippet: 'reserve(${1:n})' }
  ],
  set: [
    { name: 'insert', signature: 'pair<iterator, bool> insert(const T& val)', doc: 'Inserts element into set.', insertSnippet: 'insert(${1:val})' },
    { name: 'emplace', signature: 'template<class... Args> pair<iterator, bool> emplace(Args&&... args)', doc: 'Constructs element in-place.', insertSnippet: 'emplace(${1:val})' },
    { name: 'erase', signature: 'size_type erase(const Key& key)', doc: 'Erases element by key.', insertSnippet: 'erase(${1:key})' },
    { name: 'find', signature: 'iterator find(const Key& key)', doc: 'Finds element in set.', insertSnippet: 'find(${1:key})' },
    { name: 'count', signature: 'size_type count(const Key& key) const', doc: 'Returns 1 if element exists.', insertSnippet: 'count(${1:key})' },
    { name: 'contains', signature: 'bool contains(const Key& key) const', doc: 'Checks if element exists (C++20).', insertSnippet: 'contains(${1:key})' },
    { name: 'size', signature: 'size_type size() const', doc: 'Returns number of elements.', insertSnippet: 'size()' },
    { name: 'empty', signature: 'bool empty() const', doc: 'Checks if set is empty.', insertSnippet: 'empty()' },
    { name: 'clear', signature: 'void clear()', doc: 'Removes all elements.', insertSnippet: 'clear()' },
    { name: 'begin', signature: 'iterator begin()', doc: 'Returns iterator to beginning.', insertSnippet: 'begin()' },
    { name: 'end', signature: 'iterator end()', doc: 'Returns iterator to end.', insertSnippet: 'end()' },
    { name: 'lower_bound', signature: 'iterator lower_bound(const Key& key)', doc: 'Returns iterator to first element >= key.', insertSnippet: 'lower_bound(${1:key})' },
    { name: 'upper_bound', signature: 'iterator upper_bound(const Key& key)', doc: 'Returns iterator to first element > key.', insertSnippet: 'upper_bound(${1:key})' }
  ],
  unordered_set: [
    { name: 'insert', signature: 'pair<iterator, bool> insert(const T& val)', doc: 'Inserts element into unordered set.', insertSnippet: 'insert(${1:val})' },
    { name: 'emplace', signature: 'template<class... Args> pair<iterator, bool> emplace(Args&&... args)', doc: 'Constructs element in-place.', insertSnippet: 'emplace(${1:val})' },
    { name: 'erase', signature: 'size_type erase(const Key& key)', doc: 'Erases element.', insertSnippet: 'erase(${1:key})' },
    { name: 'find', signature: 'iterator find(const Key& key)', doc: 'Finds element.', insertSnippet: 'find(${1:key})' },
    { name: 'count', signature: 'size_type count(const Key& key) const', doc: 'Returns 1 if element exists.', insertSnippet: 'count(${1:key})' },
    { name: 'contains', signature: 'bool contains(const Key& key) const', doc: 'Checks if element exists.', insertSnippet: 'contains(${1:key})' },
    { name: 'size', signature: 'size_type size() const', doc: 'Returns number of elements.', insertSnippet: 'size()' },
    { name: 'empty', signature: 'bool empty() const', doc: 'Checks if container is empty.', insertSnippet: 'empty()' },
    { name: 'clear', signature: 'void clear()', doc: 'Removes all elements.', insertSnippet: 'clear()' },
    { name: 'begin', signature: 'iterator begin()', doc: 'Returns iterator to beginning.', insertSnippet: 'begin()' },
    { name: 'end', signature: 'iterator end()', doc: 'Returns iterator to end.', insertSnippet: 'end()' }
  ],
  stack: [
    { name: 'push', signature: 'void push(const T& val)', doc: 'Pushes element onto stack top.', insertSnippet: 'push(${1:val})' },
    { name: 'emplace', signature: 'template<class... Args> reference emplace(Args&&... args)', doc: 'Constructs element in-place on top.', insertSnippet: 'emplace(${1:val})' },
    { name: 'pop', signature: 'void pop()', doc: 'Removes top element.', insertSnippet: 'pop()' },
    { name: 'top', signature: 'reference top()', doc: 'Accesses top element.', insertSnippet: 'top()' },
    { name: 'size', signature: 'size_type size() const', doc: 'Returns number of elements.', insertSnippet: 'size()' },
    { name: 'empty', signature: 'bool empty() const', doc: 'Checks if stack is empty.', insertSnippet: 'empty()' }
  ],
  queue: [
    { name: 'push', signature: 'void push(const T& val)', doc: 'Pushes element to back of queue.', insertSnippet: 'push(${1:val})' },
    { name: 'emplace', signature: 'template<class... Args> reference emplace(Args&&... args)', doc: 'Constructs element in-place at back.', insertSnippet: 'emplace(${1:val})' },
    { name: 'pop', signature: 'void pop()', doc: 'Removes front element.', insertSnippet: 'pop()' },
    { name: 'front', signature: 'reference front()', doc: 'Accesses front element.', insertSnippet: 'front()' },
    { name: 'back', signature: 'reference back()', doc: 'Accesses back element.', insertSnippet: 'back()' },
    { name: 'size', signature: 'size_type size() const', doc: 'Returns number of elements.', insertSnippet: 'size()' },
    { name: 'empty', signature: 'bool empty() const', doc: 'Checks if queue is empty.', insertSnippet: 'empty()' }
  ],
  priority_queue: [
    { name: 'push', signature: 'void push(const T& val)', doc: 'Pushes element into priority queue.', insertSnippet: 'push(${1:val})' },
    { name: 'emplace', signature: 'template<class... Args> void emplace(Args&&... args)', doc: 'Constructs element in-place.', insertSnippet: 'emplace(${1:val})' },
    { name: 'pop', signature: 'void pop()', doc: 'Removes top priority element.', insertSnippet: 'pop()' },
    { name: 'top', signature: 'const_reference top() const', doc: 'Accesses top priority element.', insertSnippet: 'top()' },
    { name: 'size', signature: 'size_type size() const', doc: 'Returns number of elements.', insertSnippet: 'size()' },
    { name: 'empty', signature: 'bool empty() const', doc: 'Checks if priority queue is empty.', insertSnippet: 'empty()' }
  ],
  deque: [
    { name: 'push_back', signature: 'void push_back(const T& val)', doc: 'Pushes element to back.', insertSnippet: 'push_back(${1:val})' },
    { name: 'push_front', signature: 'void push_front(const T& val)', doc: 'Pushes element to front.', insertSnippet: 'push_front(${1:val})' },
    { name: 'pop_back', signature: 'void pop_back()', doc: 'Removes last element.', insertSnippet: 'pop_back()' },
    { name: 'pop_front', signature: 'void pop_front()', doc: 'Removes first element.', insertSnippet: 'pop_front()' },
    { name: 'front', signature: 'reference front()', doc: 'Accesses first element.', insertSnippet: 'front()' },
    { name: 'back', signature: 'reference back()', doc: 'Accesses last element.', insertSnippet: 'back()' },
    { name: 'size', signature: 'size_type size() const', doc: 'Returns number of elements.', insertSnippet: 'size()' },
    { name: 'empty', signature: 'bool empty() const', doc: 'Checks if deque is empty.', insertSnippet: 'empty()' },
    { name: 'clear', signature: 'void clear()', doc: 'Clears all elements.', insertSnippet: 'clear()' },
    { name: 'begin', signature: 'iterator begin()', doc: 'Returns iterator to beginning.', insertSnippet: 'begin()' },
    { name: 'end', signature: 'iterator end()', doc: 'Returns iterator to end.', insertSnippet: 'end()' }
  ],
  pair: [
    { name: 'first', signature: 'T1 first', doc: 'The first value of the pair.', insertSnippet: 'first' },
    { name: 'second', signature: 'T2 second', doc: 'The second value of the pair.', insertSnippet: 'second' }
  ],
  ListNode: [
    { name: 'val', signature: 'int val', doc: 'The node value.', insertSnippet: 'val' },
    { name: 'next', signature: 'ListNode* next', doc: 'Pointer to the next list node.', insertSnippet: 'next' }
  ],
  TreeNode: [
    { name: 'val', signature: 'int val', doc: 'The node value.', insertSnippet: 'val' },
    { name: 'left', signature: 'TreeNode* left', doc: 'Pointer to the left child tree node.', insertSnippet: 'left' },
    { name: 'right', signature: 'TreeNode* right', doc: 'Pointer to the right child tree node.', insertSnippet: 'right' }
  ],
  Node: [
    { name: 'val', signature: 'int val', doc: 'The node value.', insertSnippet: 'val' },
    { name: 'neighbors', signature: 'vector<Node*> neighbors', doc: 'List of neighboring nodes (Graph).', insertSnippet: 'neighbors' },
    { name: 'left', signature: 'Node* left', doc: 'Pointer to the left child.', insertSnippet: 'left' },
    { name: 'right', signature: 'Node* right', doc: 'Pointer to the right child.', insertSnippet: 'right' },
    { name: 'next', signature: 'Node* next', doc: 'Pointer to the next node.', insertSnippet: 'next' },
    { name: 'random', signature: 'Node* random', doc: 'Pointer to a random node.', insertSnippet: 'random' },
    { name: 'children', signature: 'vector<Node*> children', doc: 'List of child nodes (N-ary tree).', insertSnippet: 'children' }
  ]
};

// C++ Standard Built-in Types, Constants, Functions & Keywords
export const CPP_KEYWORDS: CppKeywordItem[] = [
  // Primitive Types
  { label: 'int', detail: '32-bit signed integer', doc: 'Fundamental integer type (typically 4 bytes). Range: -2,147,483,648 to 2,147,483,647.', insertText: 'int', kind: 'type' },
  { label: 'long long', detail: '64-bit signed integer', doc: 'Extended precision 64-bit integer. Range: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807.', insertText: 'long long', kind: 'type' },
  { label: 'double', detail: 'Double precision float', doc: '64-bit IEEE 754 floating-point number.', insertText: 'double', kind: 'type' },
  { label: 'float', detail: 'Single precision float', doc: '32-bit IEEE 754 floating-point number.', insertText: 'float', kind: 'type' },
  { label: 'char', detail: 'Character type', doc: '8-bit character representation.', insertText: 'char', kind: 'type' },
  { label: 'bool', detail: 'Boolean type', doc: 'Represents true or false truth values.', insertText: 'bool', kind: 'type' },
  { label: 'void', detail: 'Empty return type', doc: 'Specifies no value is returned or generic pointer.', insertText: 'void', kind: 'type' },
  { label: 'auto', detail: 'Type deduction', doc: 'Automatic type deduction from initialization expression.', insertText: 'auto', kind: 'type' },
  { label: 'size_t', detail: 'Unsigned size type', doc: 'Standard unsigned integer type used for object sizes and container indexing.', insertText: 'size_t', kind: 'type' },

  // Constants
  { label: 'INT_MAX', detail: '2147483647', doc: 'Maximum value for a 32-bit signed int.', insertText: 'INT_MAX', kind: 'constant' },
  { label: 'INT_MIN', detail: '-2147483648', doc: 'Minimum value for a 32-bit signed int.', insertText: 'INT_MIN', kind: 'constant' },
  { label: 'LLONG_MAX', detail: '9223372036854775807LL', doc: 'Maximum value for a 64-bit signed long long.', insertText: 'LLONG_MAX', kind: 'constant' },
  { label: 'LLONG_MIN', detail: '-9223372036854775808LL', doc: 'Minimum value for a 64-bit signed long long.', insertText: 'LLONG_MIN', kind: 'constant' },
  { label: 'nullptr', detail: 'Null pointer literal', doc: 'Standard type-safe null pointer literal (C++11).', insertText: 'nullptr', kind: 'constant' },
  { label: 'true', detail: 'Boolean true', doc: 'Truth value true.', insertText: 'true', kind: 'constant' },
  { label: 'false', detail: 'Boolean false', doc: 'Truth value false.', insertText: 'false', kind: 'constant' },

  // Common Standard Library Functions
  { label: 'sort', detail: 'std::sort(first, last)', doc: 'Sorts elements in the range [first, last) in non-descending order.', insertText: 'sort(${1:v}.begin(), ${1:v}.end())', kind: 'function' },
  { label: 'reverse', detail: 'std::reverse(first, last)', doc: 'Reverses the order of elements in range [first, last).', insertText: 'reverse(${1:v}.begin(), ${1:v}.end())', kind: 'function' },
  { label: 'max', detail: 'std::max(a, b)', doc: 'Returns the greater of the given values.', insertText: 'max(${1:a}, ${2:b})', kind: 'function' },
  { label: 'min', detail: 'std::min(a, b)', doc: 'Returns the smaller of the given values.', insertText: 'min(${1:a}, ${2:b})', kind: 'function' },
  { label: 'abs', detail: 'std::abs(x)', doc: 'Computes the absolute value of an integer or floating-point number.', insertText: 'abs(${1:x})', kind: 'function' },
  { label: 'accumulate', detail: 'std::accumulate(first, last, init)', doc: 'Computes sum of elements in range [first, last) plus init value.', insertText: 'accumulate(${1:v}.begin(), ${1:v}.end(), ${2:0})', kind: 'function' },
  { label: 'count', detail: 'std::count(first, last, val)', doc: 'Returns number of elements in range equal to val.', insertText: 'count(${1:v}.begin(), ${1:v}.end(), ${2:val})', kind: 'function' },
  { label: 'swap', detail: 'std::swap(a, b)', doc: 'Exchanges the values of a and b.', insertText: 'swap(${1:a}, ${2:b})', kind: 'function' },
  { label: 'lower_bound', detail: 'std::lower_bound(first, last, val)', doc: 'Returns iterator to first element not less than val.', insertText: 'lower_bound(${1:v}.begin(), ${1:v}.end(), ${2:val})', kind: 'function' },
  { label: 'upper_bound', detail: 'std::upper_bound(first, last, val)', doc: 'Returns iterator to first element strictly greater than val.', insertText: 'upper_bound(${1:v}.begin(), ${1:v}.end(), ${2:val})', kind: 'function' },
  { label: 'binary_search', detail: 'std::binary_search(first, last, val)', doc: 'Checks whether element exists in sorted range.', insertText: 'binary_search(${1:v}.begin(), ${1:v}.end(), ${2:val})', kind: 'function' },
  { label: 'next_permutation', detail: 'std::next_permutation(first, last)', doc: 'Transforms range into next lexicographical permutation.', insertText: 'next_permutation(${1:v}.begin(), ${1:v}.end())', kind: 'function' },
  { label: 'to_string', detail: 'std::to_string(val)', doc: 'Converts numerical value to std::string.', insertText: 'to_string(${1:val})', kind: 'function' },
  { label: 'stoi', detail: 'std::stoi(str)', doc: 'Parses string to signed integer.', insertText: 'stoi(${1:str})', kind: 'function' },
  { label: 'stoll', detail: 'std::stoll(str)', doc: 'Parses string to signed long long.', insertText: 'stoll(${1:str})', kind: 'function' },
  { label: 'make_pair', detail: 'std::make_pair(a, b)', doc: 'Constructs a std::pair object with deduced types.', insertText: 'make_pair(${1:a}, ${2:b})', kind: 'function' },
  { label: 'sqrt', detail: 'std::sqrt(x)', doc: 'Computes square root of x.', insertText: 'sqrt(${1:x})', kind: 'function' },
  { label: 'pow', detail: 'std::pow(base, exp)', doc: 'Computes base raised to the power exp.', insertText: 'pow(${1:base}, ${2:exp})', kind: 'function' },
  { label: 'gcd', detail: 'std::gcd(a, b)', doc: 'Computes greatest common divisor.', insertText: 'gcd(${1:a}, ${2:b})', kind: 'function' },
  { label: 'lcm', detail: 'std::lcm(a, b)', doc: 'Computes least common multiple.', insertText: 'lcm(${1:a}, ${2:b})', kind: 'function' },

  // Control Flow Keywords
  { label: 'return', detail: 'keyword', doc: 'return statement', insertText: 'return', kind: 'keyword' },
  { label: 'if', detail: 'keyword', doc: 'if statement', insertText: 'if', kind: 'keyword' },
  { label: 'else', detail: 'keyword', doc: 'else statement', insertText: 'else', kind: 'keyword' },
  { label: 'for', detail: 'keyword', doc: 'for loop', insertText: 'for', kind: 'keyword' },
  { label: 'while', detail: 'keyword', doc: 'while loop', insertText: 'while', kind: 'keyword' },
  { label: 'break', detail: 'keyword', doc: 'break statement', insertText: 'break;', kind: 'keyword' },
  { label: 'continue', detail: 'keyword', doc: 'continue statement', insertText: 'continue;', kind: 'keyword' }
];
