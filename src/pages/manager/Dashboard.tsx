import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { InterviewService } from '../../services/interview.service';

interface Job {
  title: string;
  level: string;
  status: string;
}

interface Candidate {
  fullName: string;
  position: string;
}

interface Interview {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  result: string | null;
  status: string;
  location: string;
  job: Job;
  candidate: Candidate;
}

const InterviewDashboard: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await InterviewService.getAll();
      if (response) {
        setInterviews(response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch interview data');
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate statistics using useMemo for memoization
  const statusData = useMemo(() => {
    const statusCount = interviews.reduce<Record<string, number>>(
      (acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      },
      {},
    );
    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  }, [interviews]);

  const resultData = useMemo(() => {
    const resultCount = interviews.reduce<Record<string, number>>(
      (acc, curr) => {
        const result = curr.result || 'PENDING';
        acc[result] = (acc[result] || 0) + 1;
        return acc;
      },
      {},
    );
    return Object.entries(resultCount).map(([result, count]) => ({
      name: result,
      value: count,
    }));
  }, [interviews]);

  const jobLevelData = useMemo(() => {
    const levelCount = interviews.reduce<Record<string, number>>(
      (acc, curr) => {
        acc[curr.job.level] = (acc[curr.job.level] || 0) + 1;
        return acc;
      },
      {},
    );
    return Object.entries(levelCount).map(([level, count]) => ({
      name: level,
      value: count,
    }));
  }, [interviews]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-white">
        Interview Analytics
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Total Interviews
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {interviews.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Passed
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {interviews.filter((i) => i.result === 'PASSED').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Failed
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {interviews.filter((i) => i.result === 'FAILED').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Pending
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {interviews.filter((i) => !i.result).length}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Status Distribution
          </h2>
          <div className="h-64">
            <PieChart width={300} height={250}>
              <Pie
                data={statusData}
                cx={150}
                cy={120}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Interview Results
          </h2>
          <div className="h-64">
            <BarChart
              width={300}
              height={250}
              data={resultData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Job Level Distribution
          </h2>
          <div className="h-64">
            <PieChart width={300} height={250}>
              <Pie
                data={jobLevelData}
                cx={150}
                cy={120}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {jobLevelData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </div>

      {/* Recent Interviews Table */}
      <div className="mt-6 bg-white rounded-lg shadow dark:bg-gray-800">
        <h2 className="text-xl font-semibold p-4 border-b dark:border-gray-700 text-gray-900 dark:text-white">
          Recent Interviews
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Candidate</th>
                <th className="px-6 py-3">Position</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Result</th>
              </tr>
            </thead>
            <tbody>
              {interviews.slice(0, 5).map((interview) => (
                <tr
                  key={interview.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {interview.title}
                  </td>
                  <td className="px-6 py-4">{interview.candidate.fullName}</td>
                  <td className="px-6 py-4">{interview.candidate.position}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        interview.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-800'
                          : interview.status === 'INVITED'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {interview.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        interview.result === 'PASSED'
                          ? 'bg-green-100 text-green-800'
                          : interview.result === 'FAILED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {interview.result || 'PENDING'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InterviewDashboard;
