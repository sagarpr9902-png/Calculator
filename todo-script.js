// To-Do List Application with Local Storage

let todos = [];
let currentFilter = 'all';

// Initialize the app
function init() {
    loadTodos();
    renderTodos();
    setupEventListeners();
}

// Setup event listeners
function setupEventListeners() {
    const todoInput = document.getElementById('todoInput');
    
    // Add todo on Enter key
    todoInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTodo();
        }
    });
}

// Add a new todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        priority: 'medium',
        createdAt: new Date().toLocaleString()
    };

    todos.unshift(todo);
    saveTodos();
    input.value = '';
    renderTodos();
    input.focus();
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Toggle todo completion
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
    }
}

// Clear all completed todos
function clearCompleted() {
    if (todos.some(t => t.completed)) {
        if (confirm('Are you sure you want to delete all completed tasks?')) {
            todos = todos.filter(todo => !todo.completed);
            saveTodos();
            renderTodos();
        }
    } else {
        alert('No completed tasks to clear!');
    }
}

// Delete all todos
function deleteAllTodos() {
    if (todos.length === 0) {
        alert('No tasks to delete!');
        return;
    }

    if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

// Filter todos
function filterTodos(filter) {
    currentFilter = filter;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    renderTodos();
}

// Get filtered todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter(todo => !todo.completed);
        case 'completed':
            return todos.filter(todo => todo.completed);
        case 'all':
        default:
            return todos;
    }
}

// Render todos to the DOM
function renderTodos() {
    const todoList = document.getElementById('todoList');
    const emptyState = document.getElementById('emptyState');
    const filteredTodos = getFilteredTodos();

    todoList.innerHTML = '';

    if (filteredTodos.length === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${todo.completed ? 'checked' : ''} 
                    onchange="toggleTodo(${todo.id})"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <span class="todo-priority priority-${todo.priority}">${todo.priority}</span>
                <button class="btn-delete" onclick="deleteTodo(${todo.id})">Delete</button>
            `;

            todoList.appendChild(li);
        });
    }

    updateStats();
}

// Update statistics
function updateStats() {
    const totalCount = document.getElementById('totalCount');
    const activeCount = document.getElementById('activeCount');
    const completedCount = document.getElementById('completedCount');

    const total = todos.length;
    const active = todos.filter(todo => !todo.completed).length;
    const completed = todos.filter(todo => todo.completed).length;

    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
}

// Save todos to localStorage
function saveTodos() {
    try {
        localStorage.setItem('todos', JSON.stringify(todos));
    } catch (error) {
        console.error('Error saving todos:', error);
        alert('Failed to save tasks. Storage might be full.');
    }
}

// Load todos from localStorage
function loadTodos() {
    try {
        const stored = localStorage.getItem('todos');
        if (stored) {
            todos = JSON.parse(stored);
        } else {
            todos = [];
        }
    } catch (error) {
        console.error('Error loading todos:', error);
        todos = [];
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);