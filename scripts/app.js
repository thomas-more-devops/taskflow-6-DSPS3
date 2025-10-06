// TaskFlow: A comprehensive task management app with localStorage persistence, priority system, and category management
class TaskFlow {
    constructor() {
        // Initialize tasks and task ID counter from storage
        try {
            this.tasks = this.loadTasks();
            this.taskIdCounter = this.getNextTaskId();
            this.currentFilter = 'all'; // Current category filter
        } catch (error) {
            console.error('Initialization error:', error);
            this.tasks = [];
            this.taskIdCounter = 1;
            this.currentFilter = 'all';
        }
class TaskFlow {
    constructor() {
        this.tasks = this.loadTasks();
        this.taskIdCounter = this.getNextTaskId();
        this.initializeApp();
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
    }

    // App initialization logic
    initializeApp() {
        console.log('TaskFlow initialized successfully!');
        this.showWelcomeMessage();
    }

    showWelcomeMessage() {
        if (this.tasks.length === 0) {
            console.log('Welcome to TaskFlow! Add your first task to get started.');
        }
    }

    // Bind UI events for adding tasks, input focus, priority, and category filtering
    bindEvents() {
        const addTaskBtn = document.getElementById('addTaskBtn');
        const taskInput = document.getElementById('taskInput');

        addTaskBtn.addEventListener('click', () => this.addTask());

        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
            addTaskBtn.addEventListener('click', () => this.addTask());
            taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.addTask();
                }
            });
            
            // Bind category filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const category = e.target.getAttribute('data-category');
                    this.setFilter(category);
                });
            });
            
            // Focus on input when page loads
        });

        // Focus on input when page loads
        taskInput.focus();
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const prioritySelect = document.getElementById('prioritySelect');
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;

        if (taskText === '') {
            this.showNotification('Please enter a task description', 'warning');
            taskInput.focus();
            return;
        }

        const newTask = {
            id: this.taskIdCounter++,
            text: taskText,
            priority: priority,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        taskInput.value = '';
        prioritySelect.value = 'medium';
        taskInput.focus();

        this.showNotification('Task added successfully!', 'success');
    }

    addTask() {
        // Add a new task from input with priority and category
        try {
            const taskInput = document.getElementById('taskInput');
            const prioritySelect = document.getElementById('prioritySelect');
            const categorySelect = document.getElementById('categorySelect');
            
            if (!taskInput || !prioritySelect || !categorySelect) {
                throw new Error('Required input elements not found');
            }
            
            const taskText = taskInput.value.trim();
            const priority = prioritySelect.value;
            const category = categorySelect.value;
            
            if (taskText === '') {
                this.showNotification('Please enter a task description', 'warning');
                taskInput.focus();
                return;
            }
            
            const newTask = {
                id: this.taskIdCounter++,
                text: taskText,
                priority: priority || 'medium',
                category: category || null,
                completed: false,
                createdAt: new Date().toISOString(),
                completedAt: null
            };
            
            this.tasks.push(newTask);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            
            taskInput.value = '';
            prioritySelect.value = 'medium';
            categorySelect.value = '';
            taskInput.focus();
            
            this.showNotification('Task added successfully!', 'success');
        } catch (error) {
            console.error('Error adding task:', error);
            this.showNotification('Failed to add task.', 'error');
    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(task => task.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showNotification('Task deleted successfully!', 'success');
        }
    }

    toggleTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();

            const message = task.completed ? 'Task completed! 🎉' : 'Task marked as pending';
            this.showNotification(message, 'success');
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(task => task.id === taskId);
        if (task) {
            const newText = prompt('Edit task:', task.text);
            if (newText !== null && newText.trim() !== '') {
                task.text = newText.trim();
                this.saveTasks();
                this.renderTasks();
                this.showNotification('Task updated successfully!', 'success');
            }
        }
    }

    getPriorityValue(priority) {
        const priorities = { high: 3, medium: 2, low: 1 };
        return priorities[priority] || 2;
    }

    getPriorityIcon(priority) {
        const icons = {
            high: '🔥',
            medium: '⚡',
            low: '📌'
        };
        return icons[priority] || '⚡';
    }

    renderTasks() {
        // Render the list of tasks in the UI with priority and category features
        try {
            const tasksList = document.getElementById('tasksList');
            const emptyState = document.getElementById('emptyState');
            if (!tasksList || !emptyState) throw new Error('Task list or empty state element not found');

            // Filter tasks based on current category filter
            const filteredTasks = this.getFilteredTasks();

            if (filteredTasks.length === 0) {
                tasksList.style.display = 'none';
                emptyState.style.display = 'block';
                return;
            }

            tasksList.style.display = 'flex';
            emptyState.style.display = 'none';

            // Sort tasks: incomplete first, then by priority, then by creation date
            const sortedTasks = [...filteredTasks].sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed - b.completed;
                }
                // Priority order: high, medium, low
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                }
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            tasksList.innerHTML = sortedTasks.map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''} priority-${task.priority}" data-task-id="${task.id}">
                    <div class="task-content">
                        <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                             onclick="taskFlow.toggleTask(${task.id})">
                        </div>
                        <span class="task-text">
                            ${this.escapeHtml(task.text)}
                            ${this.getPriorityBadge(task.priority)}
                            ${this.getCategoryBadge(task.category)}
                        </span>
                    </div>
                    <div class="task-actions">
                        <button class="task-btn edit-btn" onclick="taskFlow.editTask(${task.id})" title="Edit task">
                            ✏️
                        </button>
                        <button class="task-btn delete-btn" onclick="taskFlow.deleteTask(${task.id})" title="Delete task">
                            🗑️
                        </button>
        const tasksList = document.getElementById('tasksList');
        const emptyState = document.getElementById('emptyState');

        if (this.tasks.length === 0) {
            tasksList.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        tasksList.style.display = 'flex';
        emptyState.style.display = 'none';

        // Sort tasks: by priority (high to low), then by completion status, then by creation date
        const sortedTasks = [...this.tasks].sort((a, b) => {
            // First sort by completion status (incomplete first)
            if (a.completed !== b.completed) {
                return a.completed - b.completed;
            }

            // Then sort by priority (high to low)
            const priorityDiff = this.getPriorityValue(b.priority) - this.getPriorityValue(a.priority);
            if (priorityDiff !== 0) {
                return priorityDiff;
            }

            // Finally sort by creation date (newest first)
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        tasksList.innerHTML = sortedTasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''} priority-${task.priority}" data-task-id="${task.id}">
                <div class="task-content">
                    <div class="task-checkbox ${task.completed ? 'checked' : ''}"
                         onclick="taskFlow.toggleTask(${task.id})">
                    </div>
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                    <span class="priority-badge priority-${task.priority}">
                        ${this.getPriorityIcon(task.priority)} ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                </div>
                <div class="task-actions">
                    <button class="task-btn edit-btn" onclick="taskFlow.editTask(${task.id})" title="Edit task">
                        ✏️
                    </button>
                    <button class="task-btn delete-btn" onclick="taskFlow.deleteTask(${task.id})" title="Delete task">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        // Update task statistics in the UI including priority and category breakdown
        try {
            const totalTasks = this.tasks.length;
            const completedTasks = this.tasks.filter(task => task.completed).length;
            const pendingTasks = totalTasks - completedTasks;
            
            // Priority statistics
            const highPriorityTasks = this.tasks.filter(task => task.priority === 'high').length;
            
            // Category statistics
            const workTasks = this.tasks.filter(task => task.category === 'work').length;
            const personalTasks = this.tasks.filter(task => task.category === 'personal').length;
            const shoppingTasks = this.tasks.filter(task => task.category === 'shopping').length;
            
            // Update main stats
            const totalElem = document.getElementById('totalTasks');
            const completedElem = document.getElementById('completedTasks');
            const pendingElem = document.getElementById('pendingTasks');
            const taskCount = document.getElementById('taskCount');
            
            // Update priority stats
            const highPriorityElem = document.getElementById('highPriorityTasks');
            
            // Update category stats
            const workElem = document.getElementById('workTasks');
            const personalElem = document.getElementById('personalTasks');
            const shoppingElem = document.getElementById('shoppingTasks');
            
            if (!totalElem || !completedElem || !pendingElem || !taskCount) throw new Error('Stats elements not found');
            
            totalElem.textContent = totalTasks;
            completedElem.textContent = completedTasks;
            pendingElem.textContent = pendingTasks;
            
            if (highPriorityElem) highPriorityElem.textContent = highPriorityTasks;
            if (workElem) workElem.textContent = workTasks;
            if (personalElem) personalElem.textContent = personalTasks;
            if (shoppingElem) shoppingElem.textContent = shoppingTasks;
            
            // Update task count in header
            const filteredCount = this.getFilteredTasks().length;
            const displayCount = this.currentFilter === 'all' ? totalTasks : filteredCount;
            taskCount.textContent = `${displayCount} ${displayCount === 1 ? 'task' : 'tasks'}`;
        } catch (error) {
            console.error('Error updating stats:', error);
        }
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        const highPriorityTasks = this.tasks.filter(task => task.priority === 'high' && !task.completed).length;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('highPriorityTasks').textContent = highPriorityTasks;

        // Update task count in header
        const taskCount = document.getElementById('taskCount');
        taskCount.textContent = `${totalTasks} ${totalTasks === 1 ? 'task' : 'tasks'}`;
    }

    // Priority System Methods
    getPriorityBadge(priority) {
        // Generate HTML for priority badge
        const priorityConfig = {
            high: { class: 'priority-high', text: '🔥 High' },
            medium: { class: 'priority-medium', text: '⚡ Medium' },
            low: { class: 'priority-low', text: '🟢 Low' }
        };
        
        const config = priorityConfig[priority] || priorityConfig.medium;
        return `<span class="priority-badge ${config.class}">${config.text}</span>`;
    }

    // Category Management Methods
    setFilter(category) {
        // Set the current category filter
        try {
            this.currentFilter = category;
            
            // Update active filter button
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-category') === category) {
                    btn.classList.add('active');
                }
            });
            
            this.renderTasks();
            this.updateStats();
            
            const categoryName = category === 'all' ? 'All Tasks' : this.getCategoryName(category);
            this.showNotification(`Showing ${categoryName}`, 'info');
        } catch (error) {
            console.error('Error setting filter:', error);
            this.showNotification('Failed to apply filter.', 'error');
        }
    }
    
    getFilteredTasks() {
        // Get tasks filtered by current category
        try {
            if (this.currentFilter === 'all') {
                return this.tasks;
            }
            return this.tasks.filter(task => task.category === this.currentFilter);
        } catch (error) {
            console.error('Error filtering tasks:', error);
            return this.tasks;
        }
    }
    
    getCategoryName(category) {
        // Get display name for category
        const categoryNames = {
            work: '💼 Work',
            personal: '🏠 Personal',
            shopping: '🛒 Shopping',
            health: '🏥 Health',
            study: '📚 Study'
        };
        return categoryNames[category] || category;
    }
    
    getCategoryBadge(category) {
        // Generate HTML for category badge
        if (!category) return '';
        
        const categoryClasses = {
            work: 'category-work',
            personal: 'category-personal',
            shopping: 'category-shopping',
            health: 'category-health',
            study: 'category-study'
        };
        
        const categoryClass = categoryClasses[category] || '';
        const categoryName = this.getCategoryName(category);
        
        return `<span class="category-badge ${categoryClass}">${categoryName}</span>`;
    }

    saveTasks() {
        try {
            localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
            localStorage.setItem('taskflow_counter', this.taskIdCounter.toString());
        } catch (error) {
            console.error('Failed to save tasks:', error);
            this.showNotification('Failed to save tasks. Please check your browser storage.', 'error');
        }
    }

    loadTasks() {
        try {
            const saved = localStorage.getItem('taskflow_tasks');
            const tasks = saved ? JSON.parse(saved) : [];

            // Add default priority to existing tasks for backward compatibility
            return tasks.map(task => ({
                ...task,
                priority: task.priority || 'medium'
            }));
        } catch (error) {
            console.error('Failed to load tasks:', error);
            return [];
        }
    }

    getNextTaskId() {
        try {
            const saved = localStorage.getItem('taskflow_counter');
            return saved ? parseInt(saved) : 1;
        } catch (error) {
            console.error('Failed to load task counter:', error);
            return 1;
        }
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        console.log(`[${type.toUpperCase()}] ${message}`);

        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
            max-width: 300px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        `;

        // Set color based on type
        const colors = {
            success: '#48bb78',
            error: '#e53e3e',
            warning: '#ed8936',
            info: '#3182ce'
        };

        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Utility methods for potential future features
    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'taskflow_backup.json';
        link.click();

        URL.revokeObjectURL(url);
        this.showNotification('Tasks exported successfully!', 'success');
    }

    clearAllTasks() {
        if (confirm('Are you sure you want to delete ALL tasks? This cannot be undone.')) {
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.showNotification('All tasks cleared!', 'success');
        }
    }

    getTaskStats() {
        const now = new Date();
        const stats = {
            total: this.tasks.length,
            completed: this.tasks.filter(t => t.completed).length,
            pending: this.tasks.filter(t => !t.completed).length,
            highPriority: this.tasks.filter(t => t.priority === 'high' && !t.completed).length,
            mediumPriority: this.tasks.filter(t => t.priority === 'medium' && !t.completed).length,
            lowPriority: this.tasks.filter(t => t.priority === 'low' && !t.completed).length,
            createdToday: this.tasks.filter(t => {
                const taskDate = new Date(t.createdAt);
                return taskDate.toDateString() === now.toDateString();
            }).length,
            completedToday: this.tasks.filter(t => {
                if (!t.completedAt) return false;
                const completedDate = new Date(t.completedAt);
                return completedDate.toDateString() === now.toDateString();
            }).length
        };
        return stats;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.taskFlow = new TaskFlow();
});

// Export for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskFlow;
}