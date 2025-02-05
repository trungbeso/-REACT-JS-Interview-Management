import {
  faChevronLeft,
  faChevronRight,
  faEdit,
  faEye,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth.context.tsx';
import ConfirmModal from '../../../core/components/ConfirmModal';

interface CandidateTablePaginationProps {
  dataSource: any[];
  pageInfo: { totalPages: number; size: number; totalElements: number };
  columns: { title: string; field: string | string[] }[];
  handleShowDetail: (item: any) => void;
  handleEdit: (item: any) => void;
  handleDelete: (item: any) => void;
  handleSearch: (page: number, size: number) => void;
  page: number;
  size: number;
}
const CandidateTablePagination = ({
  dataSource,
  pageInfo,
  columns,
  handleShowDetail,
  handleEdit,
  handleDelete,
  handleSearch,
  page,
  size,
}: CandidateTablePaginationProps) => {
  const { userInformation } = useAuth();
  const [isShowDeleteModal, setIsShowDeleteModal] = useState<boolean>(false);
  const pageList = [5, 10, 20, 50, 100];
  const pageLimit = 3;
  const [selectedItem, setSelectedItem] = useState<any>({});

  const calculatePageList = () => {
    const start: number = Math.max(0, page - pageLimit);
    const end: number = Math.min(pageInfo.totalPages - 1, page + pageLimit);

    const listPage: number[] = [];
    for (let i = start; i <= end; i++) {
      listPage.push(i);
    }
    return listPage;
  };

  const openDeleteModal = (item: any) => {
    setIsShowDeleteModal(true);
    setSelectedItem(item);
  };

  useEffect(() => {
    handleSearch(page, size);
  }, [page, size]);

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-white">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
            <tr>
              <th className="px-6 py-3">No</th>
              {columns?.map((column: any, index: number) => (
                <th key={index} className="px-6 py-3">
                  {column.title}
                </th>
              ))}
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataSource?.map((item: any, index: number) => (
              <tr
                key={item.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td className="px-6 py-4">{page * size + index + 1}</td>
                {columns?.map((column: any, index: number) => {
                  if (column.title === 'Recruiter' && item[column.field]) {
                    return (
                      <td key={index} className="px-6 py-4">
                        {item[column.field].fullName || 'N/A'}
                      </td>
                    );
                  }

                  if (column.title === 'Job' && item[column.field]) {
                    return (
                      <td key={index} className="px-6 py-4">
                        {item[column.field].title || 'N/A'}
                      </td>
                    );
                  }

                  if (column.title === 'Status' && item[column.field]) {
                    return (
                      <td key={index} className="px-6 py-4">
                        {item[column.field].split('_').join(' ') || 'N/A'}
                      </td>
                    );
                  }

                  return (
                    <td key={index} className="px-6 py-4">
                      {typeof item[column.field] === 'object'
                        ? JSON.stringify(item[column.field])
                        : item[column.field] || 'N/A'}
                    </td>
                  );
                })}
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      type="button"
                      title="Detail"
                      onClick={() => handleShowDetail(item)}
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        className="text-blue-500 hover:text-blue-700"
                      />
                    </button>

                    {(userInformation?.roles?.includes('ADMIN') ||
                      userInformation?.roles?.includes('MANAGER') ||
                      userInformation?.roles?.includes('RECRUITER')) && (
                      <>
                        <button
                          onClick={() => handleEdit(item)}
                          title="Edit"
                          type="button"
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            className="text-green-500 hover:text-green-700"
                          />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item)}
                          title="Delete"
                          type="button"
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className="text-red-500 hover:text-red-700"
                          />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {dataSource?.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-4">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="card-footer p-3 flex justify-between">
        {/* Change Page Size */}
        <div className="page-size dark:text-white">
          <label htmlFor="page-size" className="mr-2">
            Page Size
          </label>
          <select
            name="size"
            id="page-size"
            onChange={(e) => handleSearch(page, Number(e.target.value))}
            value={size}
            className="p-2 border border-slate-300 rounded-md dark:bg-gray-900 dark:text-gray-white"
          >
            {pageList.map((item: number) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        {/* Show Page List */}
        <nav aria-label="Page navigation">
          <ul className="flex items-center -space-x-px h-10 text-base justify-center">
            <li>
              <button
                type="button"
                onClick={() => handleSearch(page - 1, size)}
                className={`${page === 0 ? 'pointer-events-none' : ''} flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                <span className="sr-only">Previous</span>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            </li>
            {calculatePageList().map((item: number) => (
              <li
                key={item}
                className=" text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <button
                  type="button"
                  onClick={() => handleSearch(item, size)}
                  className={`${item === page ? 'pointer-events-none bg-blue-500 text-white dark:bg-blue-600' : ''} flex items-center justify-center px-4 h-10 leading-tight`}
                >
                  {item + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => handleSearch(page + 1, size)}
                className={`${page === (pageInfo?.totalPages ?? 1) - 1 ? 'pointer-events-none' : ''} flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                <span className="sr-only">Next</span>
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </li>
          </ul>
        </nav>
        <div className="page-info dark:text-white">
          <span>
            {pageInfo.size * page + 1} -{' '}
            {Math.min(pageInfo.size * (page + 1), pageInfo.totalElements)} of{' '}
            {pageInfo.totalElements}
          </span>
        </div>
      </div>
      {/* Delete Modal */}
      {isShowDeleteModal && (
        <ConfirmModal
          actionHandler={() => handleDelete(selectedItem)}
          name="candidate"
          closeHandler={() => setIsShowDeleteModal(false)}
          action="delete"
        />
      )}
    </>
  );
};
export default CandidateTablePagination;
