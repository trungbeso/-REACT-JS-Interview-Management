import * as Yup from 'yup';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { EmployeeService } from '../../../services/employee.service';
import { CandidateStatus, Role } from '../../../constants/enum';
import { SkillService } from '../../../services/skill.service';
import { CandidateService } from '../../../services/candidate.service';
import Select from '../../../core/components/Select';
import moment from 'moment';
import Spinner from '../../../shared/components/Spinner';

interface CandidateFormProps {
  item: any;
  onClose: () => void;
  fetchCandidateData: () => void;
}

const CandidateForm = ({
  item,
  onClose,
  fetchCandidateData,
}: CandidateFormProps) => {
  const [skills, setSkills] = useState<any>([]);
  const [recruiters, setRecruiters] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const fetchData = async () => {
      setLoading(true);
      try {
        const [skills, employees] = await Promise.all([
          SkillService.getAll(),
          EmployeeService.getAll(),
        ]);

        if (isMounted) {
          setSkills(skills);
          setRecruiters(
            employees.filter(
              (emp: any) => emp?.roleName.indexOf(Role.Recruiter) != -1,
            ),
          );
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch candidate data');
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const initialValues = {
    fullName: item?.fullName || '',
    email: item?.email || '',
    gender: item?.gender ? 'male' : 'female' || '',
    phoneNumber: item?.phoneNumber || '',
    status: item?.status || '',
    skillIds: item?.skills?.map((skill: any) => skill.id) || [],
    recruiterId: item?.recruiter?.id || '',
    dob: moment(item?.dob).format('YYYY-MM-DD') || '',
    address: item?.address || '',
    cv: item?.cv || '',
    position: item?.position || '',
    yearOfExperience: item?.yearOfExperience || '',
    highestLevel: item?.highestLevel || '',
    note: item?.note || '',
  };

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    gender: Yup.string().required('Gender is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    skillIds: Yup.array().required('Skills are required'),
    recruiterId: Yup.string().required('Recruiter is required'),
    position: Yup.string().required('Position is required'),
    highestLevel: Yup.string().required('Highest level is required'),
  });

  const onSubmit = async (values: any) => {
    try {
      const transformedValues = {
        ...values,
        gender: values.gender === 'male' ? true : false,
        skillIds: Array.isArray(values.skillIds)
          ? values.skillIds.filter((id: string) => id)
          : [],
      };

      // Submit data
      const response = item?.id
        ? await CandidateService.update(item.id, transformedValues)
        : await CandidateService.create(transformedValues);

      if (response) {
        toast.success('Candidate saved successfully');
        fetchCandidateData();
        onClose();
      } else {
        toast.error('Failed to save candidate');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('An error occurred while saving the candidate');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Spinner />;
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
            {item?.id ? 'Update Candidate' : 'Create Candidate'}
          </h2>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="fullName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Enter full name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="fullName"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                placeholder="Enter email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="dob"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Date of Birth
              </label>
              <Field
                type="date"
                id="dob"
                name="dob"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="dob"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Address
              </label>
              <Field
                type="text"
                id="address"
                name="address"
                placeholder="Enter address"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="address"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter phone number"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="phoneNumber"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Gender <span className="text-red-500">*</span>
              </label>
              <Select
                options={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                ]}
                selectedValues={[values.gender]}
                onChange={(selected) => setFieldValue('gender', selected[0])}
                placeholder="Select gender"
              />
              <ErrorMessage
                name="gender"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="cv"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                CV link
              </label>
              <Field
                type="text"
                id="cv"
                name="cv"
                placeholder="Enter CV link"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="cv"
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
                placeholder="Enter position"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="position"
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
                options={recruiters.map((recruiter: any) => ({
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
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Status
              </label>
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
                htmlFor="level"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Highest Level <span className="text-red-500">*</span>
              </label>
              <Select
                options={[
                  { label: 'High School', value: 'High School' },
                  { label: 'Bachelor', value: 'Bachelor' },
                  { label: 'Master', value: 'Master' },
                  { label: 'PhD', value: 'PhD' },
                ]}
                selectedValues={[values.highestLevel]}
                onChange={(selected) =>
                  setFieldValue('highestLevel', selected[0])
                }
                placeholder="Select highest level"
              />
              <ErrorMessage
                name="highestLevel"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="yearOfExperience"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Year of Experience
              </label>
              <Field
                type="number"
                id="yearOfExperience"
                name="yearOfExperience"
                placeholder="Enter year of experience"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="yearOfExperience"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="skillIds"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Skills <span className="text-red-500">*</span>
              </label>
              <Select
                options={skills.map((skill: any) => ({
                  label: skill.name,
                  value: skill.id,
                }))}
                selectedValues={values.skillIds}
                onChange={(selected) => setFieldValue('skillIds', selected)}
                placeholder="Select skills"
                multi={true}
              />
              <ErrorMessage
                name="skillIds"
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

export default CandidateForm;
