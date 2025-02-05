import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { InterviewService } from '../../../services/interview.service';
import { InterviewResult, InterviewStatus } from '../../../constants/enum';
import { toast } from 'react-toastify';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../../contexts/auth.context.tsx';
import moment from 'moment';
import ConfirmModal from '../../../core/components/ConfirmModal';

interface InterviewDetailsModalProps {
  data: any;
  onClose: () => void;
}
const InterviewDetailsModal = ({
  data,
  onClose,
}: InterviewDetailsModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isShowCancelModal, setIsShowCancelModal] = useState(false);
  const [isShowSubmitForm, setIsShowSubmitForm] = useState(false);
  const { userInformation } = useAuth();
  const {
    title,
    startTime,
    endTime,
    result,
    status,
    location,
    meetingID,
    note,
    job,
    candidate,
    recruiter,
    interviewers,
    active,
  } = data;

  const handleCancel = async () => {
    const response = await InterviewService.updateStatus(
      data.id,
      InterviewStatus.Cancelled,
    );

    if (response) {
      toast.success('Interview cancelled successfully');
      onClose();
    } else {
      toast.error('Failed to cancel interview');
    }
  };

  const handleSendReminder = async () => {
    setIsLoading(true);
    try {
      await InterviewService.sendReminder(data.id);
      toast.success('Reminder email sent successfully!');
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder email');
    }
    setIsLoading(false);
  };

  const initialValues = {
    result: InterviewResult.NA,
    note: '',
  };

  const validationSchema = Yup.object({
    result: Yup.string().required('Result is required'),
    note: Yup.string()
      .required('Note is required')
      .max(500, 'Not cannot exceed 500 characters'),
  });

  const onSubmit = async (values: any) => {
    const response = await InterviewService.updateResultAndNote(
      data.id,
      values.result,
      values.note,
    );
    if (response) {
      toast.success('Interview result updated successfully');
      onClose();
    } else {
      toast.error('Failed to update interview result');
    }
  };

  return (
    <div
      id="crud-modal"
      aria-hidden="true"
      className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full max-h-full bg-slate-400/50 dark:bg-gray-800/50"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full mb-6">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Interview Details
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={onClose}
            >
              <FontAwesomeIcon icon={faX} />
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="p-4 md:p-5">
            <div className="grid gap-4 mb-6 grid-cols-1 md:grid-cols-2">
              {[
                { label: 'Title', value: title || 'N/A' },
                {
                  label: 'Start Time',
                  value: moment(startTime).format('DD-MM-YYYY: HH:mm'),
                },
                {
                  label: 'End Time',
                  value: moment(endTime).format('DD-MM-YYYY: HH:mm'),
                },
                { label: 'Result', value: result || 'N/A' },
                { label: 'Status', value: status || 'N/A' },
                { label: 'Location', value: location },
                { label: 'Meeting ID', value: meetingID || 'N/A' },
                { label: 'Note', value: note || 'N/A' },
                { label: 'Job', value: job?.title },
                { label: 'Candidate', value: candidate?.fullName },
                { label: 'Recruiter', value: recruiter?.fullName },
                {
                  label: 'Interviewers',
                  value:
                    interviewers &&
                    interviewers.map((i: any) => i.fullName).join(', '),
                },
                { label: 'Active', value: active ? 'active' : 'inactive' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xl font-medium text-gray-900 dark:text-white">
                    {label}:
                  </p>
                  <p className="text-gray-700 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              {userInformation?.roles.includes('INTERVIEWER') && (
                <button
                  type="submit"
                  className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
                  onClick={() => setIsShowSubmitForm(true)}
                >
                  Submit Result
                </button>
              )}
              {(userInformation?.roles.includes('ADMIN') ||
                userInformation?.roles.includes('MANAGER') ||
                userInformation?.roles.includes('RECRUITER')) && (
                <>
                  <button
                    type="button"
                    className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
                    onClick={handleSendReminder}
                  >
                    {isLoading ? 'Sending...' : 'Remind'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsShowCancelModal(true)}
                    className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                  >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                      Cancel
                    </span>
                  </button>
                </>
              )}
            </div>
            {/* Submit result form */}
            {isShowSubmitForm && (
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                <Form className="border border-gray-200 p-6 rounded-md mt-4">
                  <div className="flex items-center justify-between border-b rounded-t dark:border-gray-600 mb-4 pb-4">
                    <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Interview Details
                    </h4>
                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      onClick={() => setIsShowSubmitForm(false)}
                    >
                      <FontAwesomeIcon icon={faX} />
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="result"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Result <span className="text-red-500">*</span>
                    </label>
                    <Field
                      as="select"
                      name="result"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value={InterviewResult.Pass}>Pass</option>
                      <option value={InterviewResult.Fail}>Fail</option>
                    </Field>
                    <ErrorMessage
                      name="result"
                      component="div"
                      className="text-red-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="note"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Note
                    </label>
                    <Field
                      as="textarea"
                      name="note"
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm h-24"
                    />
                    <ErrorMessage
                      name="note"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                    >
                      Submit
                    </button>
                  </div>
                </Form>
              </Formik>
            )}
          </div>
        </div>
      </div>
      {isShowCancelModal && (
        <ConfirmModal
          name="interview"
          action="cancel"
          closeHandler={() => setIsShowCancelModal(false)}
          actionHandler={handleCancel}
        />
      )}
    </div>
  );
};

export default InterviewDetailsModal;
