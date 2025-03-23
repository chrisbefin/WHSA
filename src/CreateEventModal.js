import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogPanel } from '@headlessui/react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import usePocketbaseAssignments from 'hooks/usePocketbaseAssignments';
import usePocketbaseAvailability from 'hooks/usePocketbaseAvailability';
import usePocketbaseEvents from 'hooks/usePocketbaseEvents';
import { XMarkIcon } from '@heroicons/react/24/outline';


const CreateEventModal = ({ isOpen, onClose }) => {
  const { createEvent }  = usePocketbaseEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [eventTitle, setEventTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  const [numRequiredAides, setNumRequiredAides] = useState(1);
  const [numGuests, setNumGuests] = useState(0);
  const [uniform, setUniform] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
  
    if (!eventTitle || !startTime || !endTime || !location || !numRequiredAides) {
      setError("Please fill in all required fields.");
      return;
    }
  
    setIsSubmitting(true);
    setError(null);
  
    try {
      await createEvent(
        eventTitle,
        startTime,
        endTime,
        notes,
        numRequiredAides,
        numGuests,
        uniform,
        location
      );
  
      onClose(); // Close modal on success
    } catch (err) {
      setError("Failed to create event. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
  open={isOpen} 
  onClose={onClose}
  className="relative z-50"
>
  <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
  
  <div className="fixed inset-0 flex items-center justify-center p-4">
    <DialogPanel className="mx-auto w-full max-w-3xl rounded-lg bg-white shadow-xl">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create Event
          </DialogTitle>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="px-6 py-5">
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="event_title" className="block text-sm font-medium text-gray-700 mb-1">
                Event Name
              </label>
              <input
                type="text"
                id="event_title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">
                  Beginning and End Time
                </label>
                <input
                  type="datetime-local"
                  id="start_time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <input
                  type="datetime-local"
                  id="end_time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="num_required_aides" className="block text-sm font-medium text-gray-700 mb-1">
                  Required Aides
                </label>
                <input
                  type="number"
                  id="num_required_aides"
                  min="0"
                  value={numRequiredAides}
                  onChange={(e) => setNumRequiredAides(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="num_guests" className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Guests
                </label>
                <input
                  type="number"
                  id="num_guests"
                  min="0"
                  value={numGuests}
                  onChange={(e) => setNumGuests(e.target.value === "" ? "" : parseInt(e.target.value, 10))}
                  required
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="uniform" className="block text-sm font-medium text-gray-700 mb-1">
                Event Uniform
              </label>
              <input
                type="text"
                id="uniform"
                value={uniform}
                onChange={(e) => setUniform(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Event Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </DialogPanel>
  </div>
</Dialog>
  )

};

export default CreateEventModal;