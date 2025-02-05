import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { CandidateStatus } from '../../../constants/enum';
import { toast } from 'react-toastify';
import { CandidateService } from '../../../services/candidate.service';
import { useAuth } from '../../contexts/auth.context.tsx';
import moment from 'moment';
import ConfirmModal from '../../../core/components/ConfirmModal';

interface InterviewDetailsModalProps {
  data: any;
  onClose: () => void;
}
const CandidateDetailsModal = ({
  data,
  onClose,
}: InterviewDetailsModalProps) => {
  const [isShowBanModal, setIsShowBanModal] = useState(false);
  const { userInformation } = useAuth();
  const {
    fullName,
    email,
    dob,
    gender,
    phoneNumber,
    position,
    recruiter,
    status,
    address,
    note,
    skills,
    yearOfExperience,
    highestLevel,
    cv,
  } = data;

  const handleBan = async () => {
    const response = await CandidateService.updateStatus(
      data.id,
      CandidateStatus.Banned,
    );

    if (response) {
      toast.success('Candidate banned successfully');
      onClose();
    } else {
      toast.error('Failed to ban candidate');
    }
  };

  return (
    <div
      id="crud-modal"
      aria-hidden="true"
      className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full max-h-full bg-slate-400/50 dark:bg-gray-800/50"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Candidate Details
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
            <div className="grid gap-4 mb-4 md:grid-cols-2">
              {[
                { label: 'Full Name', value: fullName || 'N/A' },
                { label: 'Email', value: email || 'N/A' },
                { label: 'Phone Number', value: phoneNumber },
                {
                  label: 'Date of Birth',
                  value: moment(dob).format('DD/MM/YYYY'),
                },
                { label: 'Gender', value: gender ? 'Male' : 'Female' },
                { label: 'Address', value: address || 'N/A' },
                {
                  label: 'Year of Experience',
                  value: yearOfExperience || 'N/A',
                },
                { label: 'Highest Level', value: highestLevel || 'N/A' },
                { label: 'Position', value: position || 'N/A' },
                {
                  label: 'Skills',
                  value: skills.map((s: any) => s.name + ', ') || 'N/A',
                },
                { label: 'CV', value: cv },
                { label: 'Status', value: status.split('_').join(' ') },
                { label: 'Note', value: note },
                { label: 'Recruiter', value: recruiter?.fullName },
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
              {(userInformation?.roles.includes('ADMIN') ||
                userInformation?.roles.includes('MANAGER') ||
                userInformation?.roles.includes('RECRUITER')) && (
                <button
                  type="button"
                  className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  onClick={() => setIsShowBanModal(true)}
                >
                  Ban
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {isShowBanModal && (
        <ConfirmModal
          action="ban"
          name="candidate"
          closeHandler={() => setIsShowBanModal(false)}
          actionHandler={handleBan}
        />
      )}
    </div>
  );
};

export default CandidateDetailsModal;
