import {
  faChevronLeft,
  faChevronRight,
  faEdit,
  faEye,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../contexts/auth.context.tsx';
import moment from 'moment';
import ConfirmModal from '../../../core/components/ConfirmModal';
import { InterviewItem } from './InterviewList.tsx';

interface Column {
  title: string;
  field: string | string[];
}

interface PageInfo {
  totalPages: number;
  size: number;
  totalElements: number;
}

interface InterviewTablePaginationProps {
  dataSource: InterviewItem[];
  pageInfo: PageInfo;
  columns: Column[];
  handleShowDetail: (item: InterviewItem) => void;
  handleEdit: (item: InterviewItem) => void;
  handleDelete: (item: InterviewItem) => void;
  handleSearch: (page: number, size: number) => void;
  page: number;
  size: number;
}

const InterviewTablePagination = ({
  dataSource,
  pageInfo,
  columns,
  handleShowDetail,
  handleEdit,
  handleDelete,
  handleSearch,
  page,
  size,
}: InterviewTablePaginationProps) => {
  const [isShowDeleteModal, setIsShowDeleteModal] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<InterviewItem | null>(null);
  const pageList = useMemo(() => [5, 10, 20, 50, 100], []);
  const pageLimit = 3;
  const { userInformation } = useAuth();

  const calculatePageList = useMemo(() => {
    const start = Math.max(0, page - pageLimit);
    const end = Math.min(pageInfo.totalPages - 1, page + pageLimit);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, pageLimit, pageInfo.totalPages]);

  const openDeleteModal = useCallback((item: InterviewItem) => {
    setIsShowDeleteModal(true);
    setSelectedItem(item);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setIsShowDeleteModal(false);
    setSelectedItem(null);
  }, []);

  useEffect(() => {
    handleSearch(page, size);
  }, [page, size, handleSearch]);

  const renderColumns = useCallback(
    (item: InterviewItem) =>
      columns.map((column, index) => {
        if (column.title === 'Schedule' && Array.isArray(column.field)) {
          return (
            <td key={index} className="px-6 py-4">
              {`${moment(item[column.field[0]]).format('DD-MM-YYYY HH:mm')} - ${moment(
                item[column.field[1]],
              ).format('HH:mm')}`}
            </td>
          );
        }

        if (
          column.title === 'Interviewers' &&
          Array.isArray(item[column.field as string])
        ) {
          return (
            <td key={index} className="px-6 py-4">
              {item[column.field as string]?.map(
                (interviewer: any, idx: number) => (
                  <span key={interviewer.id} className="mr-2">
                    {interviewer.fullName +
                      (idx < item[column.field as string].length - 1
                        ? ', '
                        : '')}
                  </span>
                ),
              )}
            </td>
          );
        }

        if (typeof item[column.field as string] === 'object') {
          return (
            <td key={index} className="px-6 py-4">
              {item[column.field as string]?.fullName ||
                item[column.field as string]?.title ||
                'N/A'}
            </td>
          );
        }

        return (
          <td key={index} className="px-6 py-4">
            {item[column.field as string] || 'N/A'}
          </td>
        );
      }),
    [columns],
  );

  return (
    <>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-4">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-white">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-white">
            <tr>
              <th className="px-6 py-3">No</th>
              {columns.map((column, index) => (
                <th key={index} className="px-6 py-3">
                  {column.title}
                </th>
              ))}
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dataSource.map((item, index) => (
              <tr
                key={item.id}
                className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <td className="px-6 py-4">{page * size + index + 1}</td>
                {renderColumns(item)}
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
                    {(userInformation.roles.includes('ADMIN') ||
                      userInformation.roles.includes('MANAGER') ||
                      userInformation.roles.includes('RECRUITER')) && (
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
                    )}
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
                  </div>
                </td>
              </tr>
            ))}
            {dataSource.length === 0 && (
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
            {pageList.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <nav aria-label="Page navigation">
          <ul className="flex items-center -space-x-px h-10 text-base justify-center">
            <li>
              <button
                title="Previous"
                type="button"
                onClick={() => handleSearch(page - 1, size)}
                className={`${page === 0 ? 'pointer-events-none' : ''} flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
              >
                <span className="sr-only">Previous</span>
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            </li>
            {calculatePageList.map((item: number) => (
              <li
                key={item}
                className=" text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <button
                  type="button"
                  onClick={() => handleSearch(item, size)}
                  className={`${
                    item === page
                      ? 'pointer-events-none bg-blue-500 text-white dark:bg-blue-600'
                      : ''
                  } flex items-center justify-center px-4 h-10`}
                >
                  {item + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                title="Next"
                type="button"
                onClick={() => handleSearch(page + 1, size)}
                className={`${
                  page === pageInfo.totalPages - 1 ? 'pointer-events-none' : ''
                } flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
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
      {isShowDeleteModal && selectedItem && (
        <ConfirmModal
          actionHandler={() => handleDelete(selectedItem)}
          action="delete"
          name="interview"
          closeHandler={closeDeleteModal}
        />
      )}
    </>
  );
};

export default InterviewTablePagination;
