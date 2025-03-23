import React from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XCircleIcon } from '@heroicons/react/24/outline';

const EventDetailModal = ({ isOpen, onClose, event }) => {
  if (!event) return null;

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto max-w-5xl rounded-lg bg-white p-6 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <DialogTitle className="text-xl font-semibold">
              Event Details
            </DialogTitle>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-6">
                <div>
                <h3 className="font-medium text-gray-500">Event Title</h3>
                <p>{event.event_title}</p>
                </div>
                <div>
                <h3 className="font-medium text-gray-500">Location</h3>
                <p>{event.location}</p>
                </div>
                <div>
                <h3 className="font-medium text-gray-500">Start Time</h3>
                <p>{new Date(event.start_time).toLocaleString()}</p>
                </div>
                <div>
                <h3 className="font-medium text-gray-500">End Time</h3>
                <p>{new Date(event.end_time).toLocaleString()}</p>
                </div>
                <div>
                <h3 className="font-medium text-gray-500">Required Aides</h3>
                <p>{event.num_required_aides}</p>
                </div>
                <div>
                <h3 className="font-medium text-gray-500">Number of Guests</h3>
                <p>{event.num_guests}</p>
                </div>
                <div>
                <h3 className="font-medium text-gray-500">Notes</h3>
                <p>{event.notes}</p>
                </div>
            </div>
        </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default EventDetailModal;