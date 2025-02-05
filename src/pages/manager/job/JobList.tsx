import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import { JobService } from '../../../services/job.service';
import TablePagination from '../../../core/components/TablePagination';
import JobDetail from './JobDetail.tsx';
import { useAuth } from '../../contexts/auth.context.tsx';

function JobList() {
  const { userInformation } = useAuth();
  const [status, setStatus] = useState<string>('');
  const [statuses, setStatuses] = useState<string[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [size, setSize] = useState<number>(10);
  const [pageInfo, setPageInfo] = useState<any>({});
  const [isShowDetail, setIsShowDetail] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [columns] = useState<any[]>([
    { title: 'Title', field: 'title' },
    { title: 'Skill', field: 'skills' },
    { title: 'StartDate', field: 'startDate' },
    { title: 'EndDate', field: 'endDate' },
    { title: 'Level', field: 'level' },
    { title: 'Status', field: 'status' },
  ]);

  const detailComponent = useRef<any>(null);

  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchStatuses = async () => {
      const data = await JobService.getStatuses();
      setStatuses(data);
    };
    fetchStatuses();
  }, []);

  // Fetch data from API
  const searchData = async () => {
    const filter: any = {
      keyword: keyword?.trim() || undefined,
      status: status || undefined,
      page: page,
      size: size,
      sortBy: 'title',
      order: 'asc',
    };

    if (status) {
      // Sử dụng searchByStatus nếu có trạng thái
      const response = await JobService.searchByStatus(filter);
      setData(response.data || []);
      setPageInfo(response.page || {});
    } else {
      // Sử dụng search thông thường
      const response = await JobService.search(filter);
      setData(response.data || []);
      setPageInfo(response.page || {});
    }
  };

  useEffect(() => {
    searchData();
  }, [size, page]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPage(0);
    searchData();
  };

  const onCreate = () => {
    setIsShowDetail(false);
    setSelectedItem(null);
    setTimeout(() => {
      setIsShowDetail(true);
      detailComponent.current.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const onEdit = async (item: any) => {
    setIsShowDetail(false);
    setSelectedItem(item);
    setTimeout(() => {
      setIsShowDetail(true);
      detailComponent.current.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const onDelete = async (item: any) => {
    const response = await JobService.remove(item.id);
    if (response) {
      searchData();
    } else {
      console.log('Delete failed');
    }
  };

  const onCancelDetail = () => {
    setIsShowDetail(false);
    searchData();
  };

  const onSearch = (page: number, size: number) => {
    setPage(page);
    setSize(size);
    searchData();
  };

  const handleReset = () => {
    setKeyword('');
    setStatus('');
    setPage(0);
    setSize(10);
    searchData();
  };

  // Handle Import File
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
  };

  const handleImport = async () => {
    if (!file) {
      alert('Please select a file to import!');
      return;
    }

    try {
      await JobService.importJobs(file);
      alert('Import successful!');
      searchData(); // Refresh data
    } catch (error: any) {
      alert(error.message || 'Import failed!');
    }
  };

  return (
    <div className="px-8 py-6  text-gray-900 mb-6 dark:text-white">
      <h1 className="text-3xl font-bold">
        Job Management
      </h1>
      <form
        className="w-full border border-black-300 p-2 rounded-md"
        onSubmit={handleSubmit}
      >
      <div className="flex items-center space-x-4 w-full my-3">
  {/* Search Bar */}
  <div className="relative flex-1">
    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
      <FontAwesomeIcon icon={faMagnifyingGlass} className="mr-2" />
    </div>
    <input
      type="search"
      id="keyword"
      value={keyword}
      onChange={(e) => setKeyword(e.target.value)}
      className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="Search for jobs"
    />
  </div>

  {/* Dropdown Filter */}
  <div className="relative w-1/3 flex items-center space-x-2">
    <div className="relative flex-1">
      <select
        id="status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="">All Status</option>
        {statuses.map((statusOption) => (
          <option key={statusOption} value={statusOption}>
            {statusOption}
          </option>
        ))}
      </select>
    </div>

    {/* Search Button */}
    <button
      type="submit"
      className="p-4 text-sm text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      Search
    </button>
  </div>
</div>



        <div className="form-actions flex justify-between">
          {(userInformation.roles.includes('ADMIN') ||
          userInformation.roles.includes('MANAGER') ||
          userInformation.roles.includes('RECRUITER')) && (
          <div className="flex space-x-4">
            {/* Import Button */}
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="block w-1/2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
           
            <button
              type="button"
              className="text-white bg-gradient-to-br from-yellow-400 to-orange-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-yellow-200 dark:focus:ring-yellow-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
              onClick={handleImport}
            >
              Import
            </button>
         
          </div>)}
          <div>
                    <button
                        type="reset"
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                        onClick={handleReset}
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
            onClick={onCreate}
          >
            Create
          </button>
            )}
            </div>
        </div>
      </form>
      <TablePagination
        dataSource={data}
        pageInfo={pageInfo}
        columns={columns}
        handleEdit={(item: any) => onEdit(item)}
        handleDelete={(item: any) => onDelete(item)}
        handleSearch={onSearch}
      />
      <div className="detail-form mb-80" ref={detailComponent}>
        {isShowDetail && (
          <JobDetail item={selectedItem} cancel={onCancelDetail} />
        )}
      </div>
    </div>

);
}

export default JobList;
