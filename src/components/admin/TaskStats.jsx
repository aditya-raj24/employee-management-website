import React from 'react';
import { BarChart3, PieChart, TrendingUp, Clock } from 'lucide-react';

const TaskStats = ({ tasks, employees }) => {
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
  const highPriorityTasks = tasks.filter(task => task.priority === 'high').length;

  const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  const getEmployeeTaskCount = () => {
    return employees.map(employee => {
      const employeeTasks = tasks.filter(task => task.assignedTo === employee.id);
      return {
        name: employee.name,
        taskCount: employeeTasks.length,
        completed: employeeTasks.filter(task => task.status === 'completed').length,
      };
    });
  };

  const employeeStats = getEmployeeTaskCount();

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return dueDate < now && task.status !== 'completed';
    }).length;
  };

  const overdueTasks = getOverdueTasks();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{completionRate}%</p>
              <p className="text-sm text-blue-700">Completion Rate</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              <p className="text-sm text-green-700">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{pendingTasks}</p>
              <p className="text-sm text-yellow-700">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
              <p className="text-sm text-red-700">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Performance */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Task Distribution</h3>
        <div className="space-y-3">
          {employeeStats.map((employee) => (
            <div key={employee.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">
                    {employee.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium text-gray-900">{employee.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {employee.completed}/{employee.taskCount} tasks
                </p>
                <p className="text-xs text-gray-500">
                  {employee.taskCount > 0 
                    ? `${Math.round((employee.completed / employee.taskCount) * 100)}% completion`
                    : 'No tasks assigned'
                  }
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Status Distribution</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-medium text-green-600">{completedTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">In Progress</span>
              <span className="text-sm font-medium text-blue-600">{inProgressTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-medium text-yellow-600">{pendingTasks}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Priority Breakdown</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">High Priority</span>
              <span className="text-sm font-medium text-red-600">{highPriorityTasks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Medium Priority</span>
              <span className="text-sm font-medium text-yellow-600">
                {tasks.filter(task => task.priority === 'medium').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Low Priority</span>
              <span className="text-sm font-medium text-green-600">
                {tasks.filter(task => task.priority === 'low').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Quick Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Employees</span>
              <span className="text-sm font-medium text-gray-900">{employees.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Tasks</span>
              <span className="text-sm font-medium text-gray-900">{tasks.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Overdue Tasks</span>
              <span className="text-sm font-medium text-red-600">{overdueTasks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;