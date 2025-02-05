import * as Yup from 'yup';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import { InterviewService } from '../../../services/interview.service';
import { toast } from 'react-toastify';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { CandidateService } from '../../../services/candidate.service';
import { JobService } from '../../../services/job.service';
import { EmployeeService } from '../../../services/employee.service';
import { toZonedDateTime } from '../../../utils/dateUtils';
import { InterviewStatus, JobStatus, Role } from '../../../constants/enum';
import moment from 'moment';
import Select from '../../../core/components/Select';
import { InterviewItem } from './InterviewList.tsx';

export interface Candidate {
  id: string;
  fullName: string;
}

export interface Job {
  id: string;
  title: string;
  status: JobStatus;
}

export interface Employee {
  id: string;
  fullName: string;
  roleName: string;
}

interface InterviewFormProps {
  item?: InterviewItem | null;
  onClose: () => void;
  fetchInterviewData: () => void;
}

interface FormValues {
  title: string;
  candidateId: string;
  interviewerIds: string[];
  startTime: string;
  endTime: string;
  jobId: string;
  meetingID: string;
  note: string;
  location: string;
  recruiterId: string;
  status: InterviewStatus;
}

const InterviewForm = ({
  item,
  onClose,
  fetchInterviewData,
}: InterviewFormProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [interviewers, setInterviewers] = useState<Employee[]>([]);
  const [recruiters, setRecruiters] = useState<Employee[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [candidateData, jobData, employeeData] = await Promise.all([
          CandidateService.getAll(),
          JobService.getAll(),
          EmployeeService.getAll(),
        ]);

        if (isMounted) {
          setCandidates(candidateData);
          setJobs(jobData.filter((job: Job) => job.status === JobStatus.Open));
          setInterviewers(
            employeeData.filter((emp: Employee) =>
              emp.roleName.includes(Role.Interviewer),
            ),
          );
          setRecruiters(
            employeeData.filter((emp: Employee) =>
              emp.roleName.includes(Role.Recruiter),
            ),
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to fetch interview data');
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const initialValues: FormValues = useMemo(
    () => ({
      title: item?.title || '',
      candidateId: item?.candidate?.id || '',
      interviewerIds:
        item?.interviewers?.map((interviewer) => interviewer.id) || [],
      startTime: item?.startTime
        ? moment(item.startTime).format('YYYY-MM-DDTHH:mm')
        : '',
      endTime: item?.endTime
        ? moment(item.endTime).format('YYYY-MM-DDTHH:mm')
        : '',
      jobId: item?.job?.id || '',
      meetingID: item?.meetingID || '',
      note: item?.note || '',
      location: item?.location || '',
      recruiterId: item?.recruiter?.id || '',
      status: item?.status || InterviewStatus.New,
    }),
    [item],
  );

  const validationSchema = useMemo(
    () =>
      Yup.object({
        title: Yup.string().required('Schedule title is required'),
        candidateId: Yup.string().required('Candidate name is required'),
        interviewerIds: Yup.array()
          .min(1, 'Interviewer names are required')
          .required(),
        startTime: Yup.date().required('Start time is required'),
        endTime: Yup.date().required('End time is required'),
        jobId: Yup.string().required('Job title is required'),
        location: Yup.string().required('Location is required'),
        recruiterId: Yup.string().required('Recruiter name is required'),
      }),
    [],
  );

  const handleSubmit = useCallback(
    async (values: FormValues) => {
      try {
        const transformedValues = {
          ...values,
          startTime: toZonedDateTime(values.startTime),
          endTime: toZonedDateTime(values.endTime),
          interviewerIds: values.interviewerIds.filter((id) => id),
        };

        const response = item?.id
          ? await InterviewService.update(item.id, transformedValues)
          : await InterviewService.create(transformedValues);

        if (response) {
          toast.success('Interview saved successfully');
          fetchInterviewData();
          onClose();
        } else {
          toast.error('Failed to save interview');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error('An error occurred while saving the interview');
      }
    },
    [item, fetchInterviewData, onClose],
  );

  const candidateOptions = useMemo(
    () =>
      candidates.map((candidate) => ({
        value: candidate.id,
        label: candidate.fullName,
      })),
    [candidates],
  );

  const jobOptions = useMemo(
    () => jobs.map((job) => ({ value: job.id, label: job.title })),
    [jobs],
  );

  const interviewerOptions = useMemo(
    () =>
      interviewers.map((interviewer) => ({
        value: interviewer.id,
        label: interviewer.fullName,
      })),
    [interviewers],
  );

  const recruiterOptions = useMemo(
    () =>
      recruiters.map((recruiter) => ({
        value: recruiter.id,
        label: recruiter.fullName,
      })),
    [recruiters],
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form className="border border-gray-200 p-6 rounded-md mt-4">
          <h2 className="text-2xl font-semibold mb-4 dark:text-white">
            {item?.id ? 'Update Interview' : 'Create Interview'}
          </h2>
          <div className="grid gap-6 mb-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="title"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Title <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="title"
                name="title"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter a title"
              />
              <ErrorMessage
                name="title"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="candidateId"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Candidate Name <span className="text-red-500">*</span>
              </label>
              <Select
                options={candidateOptions}
                selectedValues={[values.candidateId]}
                onChange={(selected) =>
                  setFieldValue('candidateId', selected[0])
                }
                placeholder="Select a candidate"
                multi={false}
              />
              <ErrorMessage
                name="candidateId"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="startTime"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Start Time <span className="text-red-500">*</span>
              </label>
              <Field
                type="datetime-local"
                id="startTime"
                name="startTime"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="startTime"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="endTime"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                End Time <span className="text-red-500">*</span>
              </label>
              <Field
                type="datetime-local"
                id="endTime"
                name="endTime"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <ErrorMessage
                name="endTime"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="jobId"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Job <span className="text-red-500">*</span>
              </label>
              <Select
                options={jobOptions}
                selectedValues={[values.jobId]}
                onChange={(selected) => setFieldValue('jobId', selected[0])}
                placeholder="Select a job"
                multi={false}
              />
              <ErrorMessage
                name="jobId"
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
                options={recruiterOptions}
                selectedValues={[values.recruiterId]}
                onChange={(selected) =>
                  setFieldValue('recruiterId', selected[0])
                }
                placeholder="Select a recruiter"
              />
              <ErrorMessage
                name="recruiterId"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="meetingID"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Meeting ID
              </label>
              <Field
                type="text"
                id="meetingID"
                name="meetingID"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter a meeting ID"
              />
              <ErrorMessage
                name="meetingID"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="location"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Location <span className="text-red-500">*</span>
              </label>
              <Field
                type="text"
                id="location"
                name="location"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Enter a location"
              />
              <ErrorMessage
                name="location"
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
                  {
                    value: InterviewStatus.New,
                    label: 'New',
                  },
                  {
                    value: InterviewStatus.Invited,
                    label: 'Invited',
                  },
                  {
                    value: InterviewStatus.Interviewed,
                    label: 'Interviewed',
                  },
                  {
                    value: InterviewStatus.Cancelled,
                    label: 'Cancelled',
                  },
                ]}
                selectedValues={[values.status]}
                onChange={(selected) => setFieldValue('status', selected[0])}
                placeholder="Select a status"
                multi={false}
              />
              <ErrorMessage
                name="status"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div>
              <label
                htmlFor="interviewerIds"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Interviewer Names <span className="text-red-500">*</span>
              </label>
              <Select
                options={interviewerOptions}
                selectedValues={values.interviewerIds}
                onChange={(selected) =>
                  setFieldValue('interviewerIds', selected)
                }
                placeholder="Select interviewers"
                multi={true}
              />

              <ErrorMessage
                name="interviewer"
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
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white h-32"
                placeholder="Enter a note"
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

export default InterviewForm;
