import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../../shared/components/Spinner';
import InterviewForm, { Candidate, Employee, Job } from './InterviewForm.tsx';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { InterviewService } from '../../../services/interview.service';
import { toast } from 'react-toastify';
import InterviewTablePagination from './InterviewTablePagination.tsx';
import InterviewDetailsModal from './InterviewDetailsModal.tsx';
import { useAuth } from '../../contexts/auth.context.tsx';
import { InterviewStatus, Role } from '../../../constants/enum';
import Select from '../../../core/components/Select';
import { EmployeeService } from '../../../services/employee.service';

interface PageInfo {
  totalPages: number;
  size: number;
  totalElements: number;
}

interface Interviewer {
  id: string;
  fullName: string;
  roleName: string;
}

export interface InterviewItem {
  id: string;
  title: string;
  candidate?: Candidate;
  interviewers?: Employee[];
  startTime?: string;
  endTime?: string;
  job?: Job;
  meetingID?: string;
  note?: string;
  location?: string;
  recruiter?: Employee;
  status?: InterviewStatus;
  [key: string]: any;
}

const InterviewList: React.FC = () => {
  const [isShowForm, setIsShowForm] = useState(false);
  const [data, setData] = useState<InterviewItem[]>([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [selectedItem, setSelectedItem] = useState<InterviewItem | null>(null);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    totalPages: 0,
    size: 0,
    totalElements: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { userInformation } = useAuth();
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('');
  const [interviewerId, setInterviewerId] = useState('');

  const columns = useMemo(
    () => [
      { title: 'Title', field: 'title' },
      { title: 'Candidate', field: 'candidate' },
      { title: 'Interviewers', field: 'interviewers' },
      { title: 'Schedule', field: ['startTime', 'endTime'] },
      { title: 'Result', field: 'result' },
      { title: 'Status', field: 'status' },
      { title: 'Job', field: 'job' },
    ],
    [],
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [response, employees] = await Promise.all([
        InterviewService.search({
          title,
          status,
          interviewerId,
          page,
          size,
          sortBy: 'title',
          order: 'asc',
        }),
        EmployeeService.getAll(),
      ]);

      setData(response.data);
      setPageInfo(response.page);

      const interviewersList = employees.filter((emp: Interviewer) =>
        emp.roleName.includes(Role.Interviewer),
      );
      setInterviewers(interviewersList);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch interview data');
    } finally {
      setIsLoading(false);
    }
  }, [title, status, interviewerId, page, size]);

  const handleSearch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const handleReset = useCallback(() => {
    setTitle('');
    setStatus('');
    setInterviewerId('');
  }, []);

  const handleCreate = useCallback(() => {
    setIsShowForm(false);
    setSelectedItem(null);
    setTimeout(() => {
      setIsShowForm(true);
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);

  const handleEdit = useCallback((item: InterviewItem) => {
    setIsShowForm(false);
    setSelectedItem(item);
    setTimeout(() => {
      setIsShowForm(true);
      scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
  }, []);

  const handleShowDetail = useCallback((item: InterviewItem) => {
    setSelectedItem(item);
    setIsShowDetailModal(true);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = useCallback(
    async (item: InterviewItem) => {
      try {
        const response = await InterviewService.remove(item.id);
        if (response) {
          toast.success('Interview deleted successfully');
          fetchData();
        } else {
          toast.error('Failed to delete interview');
        }
      } catch (error) {
        console.error('Error deleting interview:', error);
        toast.error('An error occurred while deleting the interview');
      }
    },
    [fetchData],
  );

  return (
    <div className="px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-white">
        Interview Schedule
      </h1>
      <div className="w-full">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
          </div>
          <input
            type="search"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for interviews"
          />
          <button
            onClick={handleSearch}
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
        <div className="flex justify-between items-center space-x-4 form-group my-4">
          <Select
            options={Object.values(InterviewStatus).map((status) => ({
              value: status,
              label: status,
            }))}
            onChange={(selected) => setStatus(selected[0])}
            placeholder="Filter by Status"
            selectedValues={[status]}
          />
          <Select
            options={interviewers.map((interviewer) => ({
              value: interviewer.id,
              label: interviewer.fullName,
            }))}
            selectedValues={[interviewerId]}
            onChange={(selected) => setInterviewerId(selected[0])}
            placeholder="Filter by Interviewer"
          />
        </div>
        <div className="form-actions gap-2 flex justify-end">
          <button
            onClick={handleReset}
            className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
          >
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
              Reset
            </span>
          </button>
          {(userInformation.roles.includes('ADMIN') ||
            userInformation.roles.includes('MANAGER') ||
            userInformation.roles.includes('RECRUITER')) && (
            <button
              type="button"
              className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
              onClick={handleCreate}
            >
              Create
            </button>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <InterviewTablePagination
          dataSource={data}
          pageInfo={pageInfo}
          columns={columns}
          handleShowDetail={handleShowDetail}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleSearch={(page, size) => {
            setPage(page);
            setSize(size);
          }}
          page={page}
          size={size}
        />
      )}
      <div ref={scrollRef}>
        {isShowForm && (
          <InterviewForm
            onClose={() => setIsShowForm(false)}
            item={selectedItem}
            fetchInterviewData={fetchData}
          />
        )}
      </div>
      {isShowDetailModal && (
        <InterviewDetailsModal
          onClose={() => setIsShowDetailModal(false)}
          data={selectedItem}
        />
      )}
    </div>
  );
};

export default InterviewList;
