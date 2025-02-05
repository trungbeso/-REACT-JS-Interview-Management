import { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faMagnifyingGlass,
  faPenToSquare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import CreateEmployee from './CreateEmployee.tsx';
import { EmployeeService } from '../../../services/employee.service.ts';
import { useAuth } from '../../contexts/auth.context.tsx';

const EmployeeList = () => {
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [isShowModify, setIsShowModify] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const creatComponent = useRef<any>(null);
  const { userInformation } = useAuth();

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/employees')
      .then((response) => {
        const dataWithRowCount = response.data.map(
          (item: any, index: number) => ({
            ...item,
            no: index + 1,
          }),
        );
        setRows(dataWithRowCount);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('There was an error fetching the employee data!', error);
        toast.error('Failed to get user data!');
      });
  }, []);

  const handleDelete = async (item: any) => {
    try {
      const response = await EmployeeService.remove(item.id);
      if (response) {
        toast.success('User deleted successfully!');
        searchData();
      } else {
        toast.error('Failed to delete user!');
      }
    } catch (error) {
      console.error('Error during deletion:', error);
      toast.error('Cannot delete this user');
    }
  };

  const columns: GridColDef[] = [
    { field: 'no', headerName: 'No', flex: 0.2, minWidth: 10 },
    { field: 'username', headerName: 'Username', flex: 0.7, minWidth: 100 },
    { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 150 },
    { field: 'phoneNumber', headerName: 'Phone No.', flex: 0.7, minWidth: 100 },
    { field: 'roleName', headerName: 'Role', flex: 0.7, minWidth: 100 },
    {
      field: 'departmentName',
      headerName: 'Department',
      flex: 0.8,
      minWidth: 100,
    },

    {
      field: 'gender',
      headerName: 'Gender',
      flex: 0.5,
      minWidth: 100,
      renderCell: (params) => (
        <span
          className={`font-semibold flex justify-center ${
            params.value === true ? 'text-blue-600 ' : 'text-red-600 '
          }`}
        >
          {params.value === true ? 'Male' : 'Female'}
        </span>
      ),
    },
    {
      field: 'active',
      headerName: 'Status',
      flex: 1,
      minWidth: 100,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 mt-2 rounded-md text-sm font-medium flex justify-center w-1/2 m-auto ${
            params.value === true
              ? 'text-green-600 font-semibold'
              : 'text-red-600 font-semibold'
          }`}
        >
          {params.value === true ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.5,
      minWidth: 150,
      renderCell: (value) => (
        <>
          <IconButton
            aria-label="view detail"
            sx={{ color: 'green' }}
            onClick={() => handlePopupDetail(value.row)}
          >
            <FontAwesomeIcon
              icon={faEye}
              className="text-sm text-blue-500 hover:text-blue-700"
            />
          </IconButton>
          <IconButton
            aria-label="edit"
            sx={{ color: 'blue' }}
            onClick={() => handleEdit(value.row)}
          >
            <FontAwesomeIcon
              icon={faPenToSquare}
              className="text-sm text-green-500 hover:text-green-700"
            />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(value.row)}
          >
            <FontAwesomeIcon
              icon={faTrash}
              className="text-sm text-red-500 hover:text-red-700"
            />
          </IconButton>
        </>
      ),
    },
  ];

  const handlePopupDetail = (employee: any) => {
    console.log(employee);
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const onCreate = () => {
    setIsShowModify(false);
    setSelectedItem(null);
    setTimeout(() => {
      setIsShowModify(true);
      creatComponent.current.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const onReset = () => {
    setKeyword('');
    searchData();
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    searchData();
  };

  const onCancelModify = () => {
    setIsShowModify(false);
    searchData();
  };

  const handleEdit = async (item: any) => {
    setIsShowModify(false);
    setSelectedItem(item);
    setTimeout(() => {
      setIsShowModify(true);
      creatComponent.current.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const searchData = async () => {
    const filter: any = {
      keyword: keyword,
    };
    try {
      const response = await EmployeeService.search(filter);
      setRows(response);
      setIsLoading(false);
    } catch (error) {
      console.error('There was an error fetching employee data!', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="card px-8 py-6 relative dark:bg-transparent bg-white">
      <div className="card-header px-2 dark:bg-transparent rounded-md shadow-sm ">
        <h1 className="text-2xl p-2 leading-loose font-bold dark:text-white drop-shadow-ld border border-b-0 border-slate-600 mx-3 rounded-tl-lg rounded-tr-lg">
          User Manager
        </h1>
      </div>
      <div className="card-body px-2 dark:bg-transparent rounded-md shadow-sm ">
        {/*form*/}
        <form onSubmit={handleSubmit}>
          <div className="card-body px-3 ">
            {/*--*/}
            <div className="search-box border border-t-0 border-b-0 border-slate-600 p-3">
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
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search for interviews"
                />
                <button
                  onClick={searchData}
                  className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="form-actions gap-2 flex justify-end border border-t-0 border-slate-600 rounded-br-lg rounded-bl-lg  p-3">
              <button
                onClick={onReset}
                className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
              >
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                  Reset
                </span>
              </button>
              {userInformation.roles.includes('ADMIN') && (
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
        {/*  end form */}
      </div>
      <section className="p-4 mb-2 rounded-md shadow-sm">
        <div>
          <Paper sx={{ width: '100%' }} className="bg-white dark:bg-gray-300">
            <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: { paginationModel: { page: 0, pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
              loading={isLoading}
              sx={{ border: 0 }}
            />
          </Paper>
        </div>
      </section>
      {/* Create Component */}
      <div
        className="detail-form bg-white dark:bg-gray-700 dark:text-white rounded-md shadow-sm "
        ref={creatComponent}
      >
        {isShowModify && (
          <CreateEmployee item={selectedItem} cancel={onCancelModify} />
        )}
      </div>
      {/* Modal Detail*/}
      {isModalOpen && selectedEmployee && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
            <h2 className="text-3xl font-semibold mb-4 border-b pb-2">
              Employee Details
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-bold">Employee ID:</p>
                <p className="text-gray-700">{selectedEmployee.id}</p>
              </div>
              <div>
                <p className="font-bold">Employee Name:</p>
                <p className="text-gray-700">{selectedEmployee.fullName}</p>
              </div>
              <div>
                <p className="font-bold">Day Onboard:</p>
                <p className="text-gray-700">{selectedEmployee.insertedAt}</p>
              </div>
              <div>
                <p className="font-bold">Username:</p>
                <p className="text-gray-700">{selectedEmployee.username}</p>
              </div>
              <div>
                <p className="font-bold">Email:</p>
                <p className="text-gray-700">{selectedEmployee.email}</p>
              </div>
              <div>
                <p className="font-bold">Phone Number:</p>
                <p className="text-gray-700">{selectedEmployee.phoneNumber}</p>
              </div>
              <div>
                <p className="font-bold">Role:</p>
                <p className="text-gray-700">{selectedEmployee.roleName}</p>
              </div>
              <div className="col-span-2">
                <p className="font-bold">Department:</p>
                <p className="text-gray-700">
                  {selectedEmployee.departmentName}
                </p>
              </div>
              <div>
                <p className="font-bold">End Date:</p>
                <p className="text-gray-700">{selectedEmployee.deletedAt}</p>
              </div>
              <div>
                <p className="font-bold">Address:</p>
                <p className="text-gray-700">{selectedEmployee.address}</p>
              </div>
              <div>
                <p className="font-bold">Description:</p>
                <p className="text-gray-700">{selectedEmployee.desciption}</p>
              </div>
              <div>
                <p className="font-bold">Active:</p>
                <p className="text-gray-700">{selectedEmployee.active}</p>
              </div>
            </div>
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* End modal*/}
    </div>
  );
};

export default EmployeeList;
