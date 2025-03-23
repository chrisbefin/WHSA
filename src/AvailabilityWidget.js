import React, { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { RadioGroup, Radio } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon, GlobeEuropeAfricaIcon, QuestionMarkCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import usePocketbaseAvailability from "hooks/usePocketbaseAvailability";
import usePocketbaseAssignments from 'hooks/usePocketbaseAssignments';

const AvailabilityWidget = ({ user, event }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [localEventAvailability, setLocalEventAvailability] = useState("UNKNOWN");
  
  const { 
    eventAvailability, 
    checkAvailability, 
    submitAvailability 
  } = usePocketbaseAvailability();

  const {isAssigned, getIsAssigned} = usePocketbaseAssignments();

  useEffect(() => {
    const fetchAvailability = async () => {
      await checkAvailability(user.id, event.id);
      await getIsAssigned(user.id, event.id);
    };
    fetchAvailability();
  }, [checkAvailability, getIsAssigned, user.id, event.id]);

  // Update local state when eventAvailability changes
  useEffect(() => {
    setLocalEventAvailability(eventAvailability);
  }, [eventAvailability]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await submitAvailability(user.id, event.id, selectedAvailability);
      // Update local state immediately
      setLocalEventAvailability(selectedAvailability);
      setIsOpen(false);
      // Refresh the availability data from server
      await checkAvailability(user.id, event.id);
    } catch (err) {
      setError('Failed to update availability. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availabilityOptions = [
    { id: 'Available', label: 'Available', Icon: CheckCircleIcon, color: 'text-green-600' },
    { id: 'Unavailable', label: 'Unavailable', Icon: XCircleIcon, color: 'text-red-600' },
    { id: 'TBD', label: 'TBD', Icon: ExclamationCircleIcon, color: 'text-yellow-600' },
    { id: 'TDY', label: 'TDY', Icon: GlobeEuropeAfricaIcon, color: 'text-orange-600' },
  ];

  const getStatusColor = (status) => {
    const option = availabilityOptions.find(opt => opt.id === status);
    return option?.color || 'text-gray-600';
  };

  const getStatusIcon = (status) => {
    const option = availabilityOptions.find(opt => opt.id === status);
    if (!option) return null;
    const Icon = option.Icon;
    return <Icon className={`w-5 h-5 ${option.color}`} />;
  };

  if (isAssigned) {
    return (
      <div className="flex items-center gap-2">
        <LockClosedIcon className={`w-5 h-5 text-green-600`} />
          <span className={'text-green-600'}>
            <p>You are assigned to this event.</p>
          </span>
        </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {localEventAvailability === "UNKNOWN" ? (
        <div className="flex items-center gap-2 text-gray-600">
          <QuestionMarkCircleIcon className={`w-5 h-5 text-yellow-600`}/>
          <span>Not yet submitted</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          {getStatusIcon(localEventAvailability)}
          <span className={getStatusColor(localEventAvailability)}>
            {localEventAvailability}
          </span>
        </div>
      )}

      <button
        onClick={() => setIsOpen(true)}
        className={`w-40 px-4 py-2 rounded-md ${
          localEventAvailability === "UNKNOWN"
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "border border-gray-300 hover:bg-gray-50"
        } transition-colors`}
      >
        {localEventAvailability === "UNKNOWN" ? "Set Availability" : "Change Availability"}
      </button>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-md bg-white rounded-lg shadow-xl">
            <div className="p-6">
              <DialogTitle className="text-lg font-semibold">
                Set Availability for {event.event_title}
              </DialogTitle>

              <div className="mt-4">
                <RadioGroup
                  value={selectedAvailability}
                  onChange={setSelectedAvailability}
                  className="space-y-3"
                >
                  {availabilityOptions.map((option) => (
                    <Radio
                      key={option.id}
                      value={option.id}
                      className={({ active, checked }) =>
                        `flex items-center gap-2 p-2 rounded-lg cursor-pointer
                        ${active ? 'ring-2 ring-blue-500 ring-opacity-60 ring-offset-2' : ''}
                        ${checked ? 'bg-blue-50' : 'hover:bg-gray-50'}`
                      }
                    >
                      {({ checked }) => (
                        <>
                          <div className={`rounded-full w-4 h-4 border ${
                            checked ? 'border-blue-600' : 'border-gray-300'
                          } flex items-center justify-center`}>
                            {checked && (
                              <div className="w-2 h-2 rounded-full bg-blue-600" />
                            )}
                          </div>
                          <option.Icon className={`w-4 h-4 ${option.color}`} />
                          <span className="font-medium">{option.label}</span>
                        </>
                      )}
                    </Radio>
                  ))}
                </RadioGroup>

                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}

                <div className="flex justify-end gap-2 mt-6">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedAvailability || isSubmitting}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};

export default AvailabilityWidget;