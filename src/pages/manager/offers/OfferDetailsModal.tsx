import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { OfferService } from '../../../services/offer.service';
import { OfferStatus } from '../../../constants/enum';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../core/components/ConfirmModal';
import moment from 'moment';

interface OfferDetailsModalProps {
  data: any;
  onClose: () => void;
}

const OfferDetailsModal = ({ data, onClose }: OfferDetailsModalProps) => {
  const [isShowCancelModal, setIsShowCancelModal] = useState(false);
  const {
    candidate,
    contractType,
    position,
    level,
    approver,
    department,
    recruiter,
    dueDate,
    basicSalary,
    note,
    contractFrom,
    contractTo,
    status,
  } = data;

  const handleCancel = async () => {
    const response = await OfferService.updateStatus(
      data.id,
      OfferStatus.Cancelled,
    );

    if (response) {
      toast.success('Offer cancelled successfully');
      onClose();
    } else {
      toast.error('Failed to cancel offer');
    }
  };

  const handleApprove = async () => {
    const response = await OfferService.updateStatus(
      data.id,
      OfferStatus.Approved,
    );

    if (response) {
      toast.success('Offer approved successfully');
      onClose();
    } else {
      toast.error('Failed to approve offer');
    }
  };

  const handleReject = async () => {
    const response = await OfferService.updateStatus(
      data.id,
      OfferStatus.Rejected,
    );

    if (response) {
      toast.success('Offer approved successfully');
      onClose();
    } else {
      toast.error('Failed to approve offer');
    }
  };

  const handleAccepted = async () => {
    const response = await OfferService.updateStatus(
      data.id,
      OfferStatus.Accepted,
    );

    if (response) {
      toast.success('Offer approved successfully');
      onClose();
    } else {
      toast.error('Failed to approve offer');
    }
  };

  const handleDeclined = async () => {
    const response = await OfferService.updateStatus(
      data.id,
      OfferStatus.Declined,
    );

    if (response) {
      toast.success('Offer approved successfully');
      onClose();
    } else {
      toast.error('Failed to approve offer');
    }
  };

  return (
    <div
      id="crud-modal"
      aria-hidden="true"
      className="flex overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-400/50 dark:bg-gray-800/50"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Offer Details
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
            <div className="grid gap-4 mb-4 grid-cols-2">
              {[
                { label: 'Candidate Name', value: candidate?.fullName },
                { label: 'Contract Type', value: contractType },
                { label: 'Position', value: position },
                { label: 'Level', value: level },
                { label: 'Approver', value: approver?.fullName },
                { label: 'Department', value: department?.name },
                { label: 'Recruiter Name', value: recruiter?.fullName },
                {
                  label: 'Due Date',
                  value: moment(dueDate).format('DD-MM-YYYY'),
                },
                { label: 'Basic Salary', value: basicSalary },
                {
                  label: 'Contract From',
                  value: moment(contractFrom).format('DD-MM-YYYY: HH:mm'),
                },
                {
                  label: 'Contract To',
                  value: moment(contractTo).format('DD-MM-YYYY: HH:mm'),
                },
                { label: 'Note', value: note },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xl font-medium text-gray-900 dark:text-white">
                    {label}:
                  </p>
                  <p className="text-gray-700 dark:text-white">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              {status === OfferStatus.WaitingForApproval && (
                <>
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    onClick={handleApprove}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={handleReject}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={() => setIsShowCancelModal(true)}
                  >
                    Cancel
                  </button>
                </>
              )}

              {status === OfferStatus.Approved && (
                <>
                  <button
                    type="button"
                    className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={() => setIsShowCancelModal(true)}
                  >
                    Cancel
                  </button>
                </>
              )}

              {status === OfferStatus.WaitingForResponse && (
                <>
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    onClick={handleAccepted}
                  >
                    Accepted
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={handleDeclined}
                  >
                    Declined
                  </button>
                  <button
                    type="button"
                    className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    onClick={() => setIsShowCancelModal(true)}
                  >
                    Cancel
                  </button>
                </>
              )}

              {status === OfferStatus.Accepted && (
                <button
                  type="button"
                  className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                  onClick={() => setIsShowCancelModal(true)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {isShowCancelModal && (
        <ConfirmModal
          action="cancel"
          name="offer"
          closeHandler={() => setIsShowCancelModal(false)}
          actionHandler={handleCancel}
        />
      )}
    </div>
  );
};

export default OfferDetailsModal;
