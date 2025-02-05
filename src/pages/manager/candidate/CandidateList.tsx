import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../../../shared/components/Spinner';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import CandidateTablePagination from './CandidateTablePagination.tsx';
import { CandidateService } from '../../../services/candidate.service';
import CandidateForm from './CandidateForm.tsx';
import CandidateDetailsModal from './CandidateDetailsModal.tsx';
import { CandidateStatus, Role } from '../../../constants/enum';
import { EmployeeService } from '../../../services/employee.service';
import Select from '../../../core/components/Select';
import { useAuth } from '../../contexts/auth.context.tsx';

const CandidateList = () => {
  const [isShowForm, setIsShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [fullName, setFullName] = useState('');
  const [status, setStatus] = useState('');
  const [recruiterId, setRecruiterId] = useState('');
  const [recruiters, setRecruiters] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [selectedItem, setSelectedItem] = useState({});
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    size: 0,
    totalElements: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const { userInformation } = useAuth();
  const scrollRef = useRef<any>(null);

  const columns = [
    { title: 'Name', field: 'fullName' },
    { title: 'Email', field: 'email' },
    { title: 'Phone Number', field: 'phoneNumber' },
    { title: 'Current Position', field: 'position' },
    { title: 'Recruiter', field: 'recruiter' },
    { title: 'Status', field: 'status' },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [response, employees] = await Promise.all([
        CandidateService.search({
          fullName,
          status,
          recruiterId,
          page,
          size,
          sortBy: 'fullName',
          order: 'asc',
        }),
        EmployeeService.getAll(),
      ]);
      setData(response.data);
      setPageInfo(response.page);
      setRecruiters(
        employees.filter(
          (emp: any) => emp?.roleName.indexOf(Role.Recruiter) != -1,
        ),
      );
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch candidate data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (item: any) => {
    try {
      const response = await CandidateService.remove(item.id);
      if (response) {
        toast.success('Candidate deleted successfully');
        fetchData();
      } else {
        toast.error('Failed to delete candidate');
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast.error('An error occurred while deleting the candidate');
    }
  };

  const handleCreate = () => {
    setIsShowForm(false);
    setSelectedItem({});
    setTimeout(() => {
      setIsShowForm(true);
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const handleEdit = (item: any) => {
    setIsShowForm(false);
    setSelectedItem(item);
    setTimeout(() => {
      setIsShowForm(true);
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const handleShowDetail = (item: any) => {
    setSelectedItem(item);
    setIsShowDetailModal(true);
  };

  const handleSearch = () => {
    fetchData();
  };

  const handleReset = () => {
    setFullName('');
    setStatus('');
    setRecruiterId('');
  };

  useEffect(() => {
    fetchData();
  }, [page, size]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    <div className="px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-white">
        Candidate
      </h1>
      <div className="w-full">
        <label
          htmlFor="default-search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
          </div>
          <input
            type="search"
            id="default-search"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for candidate name..."
          />
          <button
            onClick={handleSearch}
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Search
          </button>
        </div>
        <div className="flex justify-between items-center space-x-4 form-group my-4">
          <div className="flex items-center space-x-4 form-group w-1/2">
            <Select
              options={[
                { label: 'Open', value: CandidateStatus.Open },
                {
                  label: 'Waiting for interview',
                  value: CandidateStatus.WaitingForInterview,
                },
                {
                  label: 'Interviewed',
                  value: CandidateStatus.CancelledByInterview,
                },
                {
                  label: 'Passed interview',
                  value: CandidateStatus.PassedByInterview,
                },
                {
                  label: 'Failed interview',
                  value: CandidateStatus.FailedByInterview,
                },
                {
                  label: 'Waiting for approval',
                  value: CandidateStatus.WaitingForApproval,
                },
                { label: 'Approved', value: CandidateStatus.Approved },
                { label: 'Rejected', value: CandidateStatus.Rejected },
                {
                  label: 'Waiting for response',
                  value: CandidateStatus.WaitingForResponse,
                },
                {
                  label: 'Accepted offer',
                  value: CandidateStatus.AcceptedOffer,
                },
                {
                  label: 'Declined offer',
                  value: CandidateStatus.DeclinedOffer,
                },
                {
                  label: 'Cancelled offer',
                  value: CandidateStatus.CancelledOffer,
                },
                { label: 'Banned', value: CandidateStatus.Banned },
              ]}
              onChange={(selected: string[]) => setStatus(selected[0])}
              placeholder="Filter by Status"
              selectedValues={[status]}
            />
          </div>
          <div className="flex items-center space-x-4 form-group w-1/2">
            <Select
              options={recruiters.map((recruiter: any) => ({
                value: recruiter.id,
                label: recruiter.fullName,
              }))}
              selectedValues={[recruiterId]}
              onChange={(selected: string[]) => setRecruiterId(selected[0])}
              placeholder="Filter by Recruiter"
            />
          </div>
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
        <CandidateTablePagination
          dataSource={data}
          pageInfo={pageInfo}
          columns={columns}
          handleShowDetail={handleShowDetail}
          handleEdit={(item) => handleEdit(item)}
          handleDelete={handleDelete}
          handleSearch={(page, size) => {
            setSize(size);
            setPage(page);
          }}
          page={page}
          size={size}
        />
      )}
      <div ref={scrollRef}>
        {isShowForm && (
          <CandidateForm
            onClose={() => setIsShowForm(false)}
            item={selectedItem}
            fetchCandidateData={fetchData}
          />
        )}
      </div>
      {isShowDetailModal && (
        <CandidateDetailsModal
          onClose={() => setIsShowDetailModal(false)}
          data={selectedItem}
        />
      )}
    </div>
  );
};

export default CandidateList;
