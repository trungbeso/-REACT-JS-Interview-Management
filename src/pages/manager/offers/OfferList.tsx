import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Spinner from '../../../shared/components/Spinner';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import OfferTablePagination from '../../../core/components/OfferTablePagination';
import { OfferService } from '../../../services/offer.service';
import { toast } from 'react-toastify';
import OfferDetailsModal from './OfferDetailsModal.tsx';
import { useAuth } from '../../contexts/auth.context.tsx';
import Select from '../../../core/components/Select';
import { OfferStatus } from '../../../constants/enum';
import { DepartmentService } from '../../../services/department.service';
import OfferForm from './OfferForm.tsx';

const OfferList = () => {
  const [isShowForm, setIsShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [status, setStatus] = useState('');
  const [departments, setDepartments] = useState([]);
  const [candidateName, setCandidateName] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [selectedItem, setSelectedItem] = useState({});
  const [pageInfo, setPageInfo] = useState({
    totalPages: 0,
    size: 0,
    totalElements: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const scrollRef = useRef<any>(null);
  const { userInformation } = useAuth();

  const columns = [
    { title: 'Candidate Name', field: 'candidate' },
    { title: 'Email', field: 'email' },
    { title: 'Approver', field: 'approver' },
    { title: 'Department', field: 'department' },
    { title: 'Note', field: 'note' },
    { title: 'Status', field: 'status' },
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [response, departments] = await Promise.all([
        OfferService.search({
          candidateName,
          status,
          departmentId,
          page,
          size,
          sortBy: 'candidate',
          order: 'desc',
        }),
        DepartmentService.getAll(),
      ]);

      if (response) {
        setData(response.data);
      }
      if (departments) {
        setDepartments(departments);
      }
      setPageInfo(response.page);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch offer data');
    } finally {
      setIsLoading(false);
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

  const handleReset = () => {
    setStatus('');

    fetchData();
  };

  const handleSearch = () => {
    setPage(0);
    fetchData();
  };

  const handleDelete = async (item: any) => {
    try {
      const response = await OfferService.remove(item.id);
      if (response) {
        toast.success('Offer deleted successfully');
        fetchData();
      } else {
        toast.error('Failed to delete offer');
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast.error('An error occurred while deleting the offer');
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, size]);

  return (
    <div className="px-8 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 dark:text-white">
        Offer List
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
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
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
          <Select
            options={[
              { label: 'Accepted', value: OfferStatus.Accepted },
              { label: 'Rejected', value: OfferStatus.Rejected },
              { label: 'Approved', value: OfferStatus.Approved },
              { label: 'Declined', value: OfferStatus.Declined },
              {
                label: 'Waiting for Approval',
                value: OfferStatus.WaitingForApproval,
              },
              { label: 'Pending', value: OfferStatus.WaitingForResponse },
              { label: 'Cancelled', value: OfferStatus.Cancelled },
            ]}
            onChange={(selected: string[]) => setStatus(selected[0])}
            placeholder="Filter by Status"
            selectedValues={[status]}
          />
          <Select
            options={departments.map((department: any) => ({
              label: department.name,
              value: department.id,
            }))}
            onChange={(selected: string[]) => setDepartmentId(selected[0])}
            placeholder="Filter by Department"
            selectedValues={[departmentId]}
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
        <OfferTablePagination
          dataSource={data}
          pageInfo={pageInfo}
          columns={columns}
          handleShowDetail={handleShowDetail}
          handleEdit={handleEdit}
          handleSearch={(page: number, size: number) => {
            setPage(page);
            setSize(size);
          }}
          page={page}
          size={size}
          handleDelete={handleDelete}
        />
      )}
      <div ref={scrollRef}>
        {isShowForm && (
          <OfferForm
            onClose={() => setIsShowForm(false)}
            item={selectedItem}
            fetchOfferData={fetchData}
          />
        )}
      </div>
      {isShowDetailModal && (
        <OfferDetailsModal
          onClose={() => setIsShowDetailModal(false)}
          data={selectedItem}
        />
      )}
    </div>
  );
};

export default OfferList;
