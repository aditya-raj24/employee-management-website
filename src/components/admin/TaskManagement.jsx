import React, { useState } from 'react';
import { createTask, updateTask, deleteTask, generateId } from '../../utils/storage';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Edit, Trash2, Calendar, User as UserIcon, Flag } from 'lucide-react';
import TaskForm from './TaskForm';

const TaskManagement = ({ tasks, employees, onTaskUpdate }) => {
  const { currentUser } = useAuth();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const handleCreateTask = (taskData) => {
    const newTask = {
      ...taskData,
      id: generateId(),
      assignedBy: currentUser.id,
      createdAt: new Date().toISOString(),
    };
    
    createTask(newTask);
    onTaskUpdate();
    setShowTaskForm(false);
  };

  const handleUpdateTask = (taskData) => {
    if (editingTask) {
      const updatedTask = {
        ...taskData,
        id: editingTask.id,
        assignedBy: editingTask.assignedBy,
        createdAt: editingTask.createdAt,
      };
      
      updateTask(updatedTask);
      onTaskUpdate();
      setEditingTask(null);
    }
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      onTaskUpdate();
    }
  };

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : 'Unknown Employee';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Task Management</h2>
        <button
          onClick={() => setShowTaskForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Assign New Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
              </div>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={() => setEditingTask(task)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserIcon className="w-4 h-4" />
                <span>Assigned to: {getEmployeeName(task.assignedTo)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Due: {formatDate(task.dueDate)}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Flag className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                <span className={`capitalize ${getPriorityColor(task.priority)}`}>
                  {task.priority} priority
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status.replace('-', ' ')}
                </span>
                <span className="text-xs text-gray-500">
                  Created {formatDate(task.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks created yet.</p>
        </div>
      )}

      {(showTaskForm || editingTask) && (
        <TaskForm
          employees={employees}
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default TaskManagement;