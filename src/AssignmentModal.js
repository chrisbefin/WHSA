import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogPanel } from '@headlessui/react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import usePocketbaseAssignments from 'hooks/usePocketbaseAssignments';
import usePocketbaseAvailability from 'hooks/usePocketbaseAvailability';

const AssignmentModal = ({ isOpen, onClose, event }) => {
  const {assignedAides, numAssignedAides, getAssignedAides, submitAssignment} = usePocketbaseAssignments();  
  const {availableAides, getAvailableAides} = usePocketbaseAvailability();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Add state to track the selected tab
const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (event && event.id) {
        await getAssignedAides(event.id);
        await getAvailableAides(event.id);
      }
    };
    fetchAssignments();
  }, [getAssignedAides, getAvailableAides, event]);

  if (!event) return null;

  const handleSubmit = async (aide, assignment) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await submitAssignment(aide.id, event.id, assignment);

      // Refresh the assignment data from server
      await getAssignedAides(event.id);

    } catch (err) {
      setError('Failed to create assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!assignedAides) {
    return (
      <div className="modal">
        <div className="modal-content">
          <p>Loading assigned aides...</p>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      name: 'USA'
    },
    {
      name: 'USMC'
    },
    {
      name: 'USN'
    },
    {
        name: 'USCG'
    },
    {
        name: 'DAF'
    }
  ]
  
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto w-full max-w-5xl rounded-lg bg-white shadow-xl">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-2xl font-semibold text-gray-900">
                Assign Aides - {event.event_title}
              </DialogTitle>
              <button
                onClick={onClose}
                className="rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
              </button>
            </div>
          </div>
          
          <div className="px-6 py-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Event Details
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-base">{event.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="text-base">
                      {new Date(event.start_time).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                        Assigned Aides/Required Aides:</p> <p className="text-base">{numAssignedAides} / {event.num_required_aides}</p>
                  </div>
                </div>
              </div>

              <div>
                <TabGroup>
                    <TabList className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                    {tabs.map(({ name }) => (
                    <Tab
                      key={name}
                      className={({ selected }) => 
                        `rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none
                        hover:bg-gray-100/50
                        focus:outline-1 focus:outline-white
                        transition-colors duration-200
                        ${selected ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-transparent'}`
                      }
                    >
                        {name}
                    </Tab>
                    ))}
                    </TabList>
                    <TabPanels>
                    {tabs.map(({ name }) => (
                    <TabPanel
                        key={name}
                        className="rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-gray/10 data-[hover]:bg-gray/5 data-[selected]:data-[hover]:bg-gray/10 data-[focus]:outline-1 data-[focus]:outline-white"
                    >
                        {availableAides.filter(({ aide }) => aide.service === name).length > 0 ? (
                           <div className="overflow-x-auto">
                           <table className="min-w-full bg-white">
                             <thead>
                               <tr>
                                 <th className="py-2 px-4 border-b text-left">Last Name</th>
                                 <th className="py-2 px-4 border-b text-left">First Name</th>
                                 <th className="py-2 px-4 border-b text-left">Status</th>
                                 <th className="py-2 px-4 border-b text-left">Actions</th>
                               </tr>
                             </thead>
                             <tbody>
                             {availableAides
                              .filter(({ aide }) => aide.service === name)
                              .map(({ aide }) =>
                                  assignedAides.some(obj => obj.aide.id === aide.id) ? (
                                    <tr key={aide.id}>
                                      <td className="py-2 px-4 border-b">{aide.last_name}</td>
                                      <td className="py-2 px-4 border-b">{aide.first_name}</td>
                                      <td className="py-2 px-4 border-b">Assigned</td>
                                      <td className="py-2 px-4 border-b">
                                        <button onClick={() => handleSubmit(aide, "unassign")} className="text-red-500 hover:text-red-700">
                                          Unassign
                                        </button>
                                      </td>
                                    </tr>
                                  ) : (
                                    <tr key={aide.id}>
                                      <td className="py-2 px-4 border-b">{aide.last_name}</td>
                                      <td className="py-2 px-4 border-b">{aide.first_name}</td>
                                      <td className="py-2 px-4 border-b">Available</td>
                                      <td className="py-2 px-4 border-b">
                                      <button onClick={() => handleSubmit(aide, "assign")} className="text-blue-500 hover:text-blue-700">
                                        Assign
                                      </button>
                                      </td>
                                    </tr>
                                  )
                              )}
                          </tbody>
                        </table>
                      </div>
                        ) : (
                          <p>No aides assigned or available.</p>
                        )}
                    </TabPanel>
                    ))}
                    </TabPanels>
                </TabGroup>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AssignmentModal;