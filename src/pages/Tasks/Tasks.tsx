// App.tsx
import React, { useState, useEffect, FormEvent } from 'react';

interface Task {
  id: number;
  text: string;
  category: 'General' | 'Work' | 'Personal';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  completed: boolean;
  dateAdded: string;
}

const TaskManagement: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  
  const [newTask, setNewTask] = useState<Partial<Task>>({
    text: '',
    category: 'General',
    priority: 'Medium',
    dueDate: ''
  });
  
  const [filter, setFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('dateAdded');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e: FormEvent) => {
    e.preventDefault();
    if (!newTask.text?.trim()) return;
    
    setTasks([...tasks, {
      id: Date.now(),
      text: newTask.text,
      category: newTask.category || 'General',
      priority: newTask.priority || 'Medium',
      dueDate: newTask.dueDate || '',
      completed: false,
      dateAdded: new Date().toISOString()
    }]);
    setNewTask({ text: '', category: 'General', priority: 'Medium', dueDate: '' });
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEditing = (task: Task) => {
    setEditingTask({ ...task });
  };

  const saveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    setTasks(tasks.map(task =>
      task.id === editingTask.id ? editingTask : task
    ));
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'Completed') return task.completed;
    if (filter === 'Pending') return !task.completed;
    return task.category === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    if (sortBy === 'dueDate') {
      return new Date(a.dueDate || '9999-12-31').getTime() - new Date(b.dueDate || '9999-12-31').getTime();
    }
    return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Task Manager</h1>

      <form onSubmit={addTask} className="flex flex-wrap gap-2 mb-6">
        <input
          type="text"
          value={newTask.text}
          onChange={(e) => setNewTask({ ...newTask, text: e.target.value })}
          placeholder="Enter a new task"
          className="flex-1 p-2 border border-gray-300 rounded"
        />
        <select
          value={newTask.category}
          onChange={(e) => setNewTask({ ...newTask, category: e.target.value as Task['category'] })}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          className="p-2 border border-gray-300 rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add Task
        </button>
      </form>

      <div className="flex gap-2 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="All">All</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
          <option value="General">General</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="dateAdded">Date Added</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due Date</option>
        </select>
      </div>

      <div className="space-y-2">
        {sortedTasks.map(task => (
          <div
            key={task.id}
            className={`flex items-center gap-2 p-3 bg-gray-50 rounded ${
              task.priority === 'High' ? 'border-l-4 border-red-500' :
              task.priority === 'Medium' ? 'border-l-4 border-yellow-500' :
              'border-l-4 border-green-500'
            }`}
          >
            {editingTask?.id === task.id ? (
              <form onSubmit={saveEdit} className="flex flex-wrap gap-2 flex-1">
                <input
                  value={editingTask.text}
                  onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                  className="flex-1 p-2 border border-gray-300 rounded"
                />
                <select
                  value={editingTask.category}
                  onChange={(e) => setEditingTask({ ...editingTask, category: e.target.value as Task['category'] })}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                </select>
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as Task['priority'] })}
                  className="p-2 border border-gray-300 rounded"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <input
                  type="date"
                  value={editingTask.dueDate}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  className="p-2 border border-gray-300 rounded"
                />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="h-5 w-5"
                />
                <div className="flex-1">
                  <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                    {task.text}
                  </span>
                  <div className="text-sm text-gray-600">
                    {task.category} | {task.priority} | 
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                  </div>
                </div>
                <button
                  onClick={() => startEditing(task)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManagement;