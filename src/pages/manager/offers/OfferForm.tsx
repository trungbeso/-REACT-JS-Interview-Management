import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { toast } from 'react-toastify';
import Spinner from '../../../shared/components/Spinner';
import Select from '../../../core/components/Select';
import { CandidateService } from '../../../services/candidate.service';
import { DepartmentService } from '../../../services/department.service';
import { EmployeeService } from '../../../services/employee.service';
import { OfferService } from '../../../services/offer.service';
import { Level, OfferStatus } from '../../../constants/enum';

interface OfferFormProps {
  item: any;
  onClose: () => void;
  fetchOfferData: () => void;
}

const OfferForm = ({ item, onClose, fetchOfferData }: OfferFormProps) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [recruiters, setRecruiters] = useState<any[]>([]);
  const [approvers, setApprovers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        const [candidateData, departmentData, employeeData] = await Promise.all(
          [
            CandidateService.getAll(),
            DepartmentService.getAll(),
            EmployeeService.getAll(),
          ],
        );

        if (isMounted) {
          if (candidates) {
            setCandidates(candidateData);
          }

          if (departments) {
            setDepartments(departmentData);
          }
          if (employeeData) {
            setRecruiters(
              employeeData.filter((emp: any) =>
                emp?.roleName.includes('RECRUITER'),
              ),
            );
            setApprovers(
              employeeData.filter(
                (emp: any) =>
                  emp?.roleName.includes('ADMIN') ||
                  emp?.roleName.includes('MANAGER'),
              ),
            );
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch offer data');
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const initialValues = {
    candidateId: item?.candidate?.id || '',
    departmentId: item?.department?.id || '',
    recruiterId: item?.recruiter?.id || '',
    approverId: item?.approver?.id || '',
    contractType: item?.contractType || '',
    position: item?.position || '',
    level: item?.level || '',
    contractFrom: moment(item?.contractFrom).format('YYYY-MM-DDTHH:mm') || '',
    contractTo: moment(item?.contractTo).format('YYYY-MM-DDTHH:mm') || '',
    dueDate: moment(item?.dueDate).format('YYYY-MM-DDTHH:mm') || '',
    basicSalary: item?.basicSalary || 0,
    note: item?.note || '',
    status: item?.status || OfferStatus.WaitingForApproval,
  };

  const validationSchema = Yup.object({
    candidateId: Yup.string().required('Candidate is required'),
    departmentId: Yup.string().required('Department is required'),
    recruiterId: Yup.string().required('Recruiter is required'),
    approverId: Yup.string().required('Approver is required'),
    contractType: Yup.string().required('Contract type is required'),
    position: Yup.string().required('Position is required'),
    level: Yup.string().required('Level is required'),
    contractFrom: Yup.date().required('Contract start date is required'),
    contractTo: Yup.date().required('Contract end date is required'),
    dueDate: Yup.date().required('Due date is required'),
    basicSalary: Yup.number().required('Basic salary is required'),
  });

  const onSubmit = async (values: any) => {
    try {
      const response = item?.id
        ? await OfferService.update(item.id, values)
        : await OfferService.create(values);

      if (response) {
        toast.success('Offer saved successfully');
        fetchOfferData();
        onClose();
      } else {
        toast.error('Failed to save offer');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while saving the offer');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className="border border-gray-200 p-6 rounded-md mt-4">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            {item?.id ? 'Update Offer' : 'Create Offer'}
          </h2>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="candidateId"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Candidate <span className="text-red-500">*</span>
              </label>
              <Select
                options={candidates?.map((candidate: any) => ({
                  label: candidate.fullName,
                  value: candidate.id,
                }))}
                selectedValues={[values.candidateId]}
                onChange={(selected) =>
                  setFieldValue('candidateId', selected[0])
                }
                placeholder="Select candidate"
              />
              <ErrorMessage
                name="candidateId"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="departmentId"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Department <span className="text-red-500">*</span>
              </label>
              <Select
                options={departments?.map((department: any) => ({
                  label: department.name,
                  value: department.id,
                }))}
                selectedValues={[values.departmentId]}
                onChange={(selected) =>
                  setFieldValue('departmentId', selected[0])
                }
                placeholder="Select department"
              />
              <ErrorMessage
                name="departmentId"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="recruiterId"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Recruiter <span className="text-red-500">*</span>
              </label>
              <Select
                options={recruiters?.map((recruiter: any) => ({
                  label: recruiter.fullName,
                  value: recruiter.id,
                }))}
                selectedValues={[values.recruiterId]}
                onChange={(selected) =>
                  setFieldValue('recruiterId', selected[0])
                }
                placeholder="Select recruiter"
              />
              <ErrorMessage
                name="recruiterId"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="approverId"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Approver <span className="text-red-500">*</span>
              </label>
              <Select
                options={approvers?.map((approver: any) => ({
                  label: approver.fullName,
                  value: approver.id,
                }))}
                selectedValues={[values.approverId]}
                onChange={(selected) =>
                  setFieldValue('approverId', selected[0])
                }
                placeholder="Select approver"
              />
              <ErrorMessage
                name="approverId"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="contractFrom"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Contract From <span className="text-red-500">*</span>
              </label>
              <Field
                type="datetime-local"
                id="contractFrom"
                name="contractFrom"
                placeholder="Enter contract from"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="contractFrom"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="contractTo"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Contract To <span className="text-red-500">*</span>
              </label>
              <Field
                type="datetime-local"
                id="contractTo"
                name="contractTo"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter contract to"
              />
              <ErrorMessage
                name="contractTo"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="basicSalary"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Basic Salary <span className="text-red-500">*</span>
              </label>
              <Field
                type="number"
                id="basicSalary"
                name="basicSalary"
                placeholder="Enter basic salary"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="basicSalary"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="level"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Level <span className="text-red-500">*</span>
              </label>
              <Select
                options={[
                  { label: 'Junior', value: Level.Junior },
                  { label: 'Middle', value: Level.Middle },
                  { label: 'Senior', value: Level.Senior },
                  { label: 'Fresher', value: Level.Fresher },
                  { label: 'Intern', value: Level.SolutionArchitecture },
                ]}
                selectedValues={[values.level]}
                onChange={(selected) => setFieldValue('level', selected[0])}
                placeholder="Select level"
              />
              <ErrorMessage
                name="level"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="position"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Position <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="position"
                name="position"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter position"
              />
              <ErrorMessage
                name="position"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="contractType"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Contract Type <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="contractType"
                name="contractType"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter contract type"
              />
              <ErrorMessage
                name="contractType"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Status
              </label>
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
                selectedValues={[values.status]}
                onChange={(selected) => setFieldValue('status', selected[0])}
                placeholder="Select status"
              />
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="dueDate"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Due Date <span className="text-red-500">*</span>
              </label>
              <Field
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                placeholder="Enter due date"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="dueDate"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="note"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Note
              </label>
              <Field
                as="textarea"
                id="note"
                name="note"
                placeholder="Enter note"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-32"
              />
              <ErrorMessage
                name="note"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
              onClick={onClose}
            >
              <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                Cancel
              </span>
            </button>
            <button
              type="submit"
              className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-2"
            >
              {item?.id ? 'Update' : 'Create'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default OfferForm;
