import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import usePocketbaseEvents from 'hooks/usePocketbaseEvents';

const EditEventModal = ({ isOpen, onClose, event, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    event_title: '',
    report_time: '',
    start_time: '',
    end_time: '',
    location: '',
    num_required_aides: 1,
    num_guests: 0,
    uniform: '',
    notes: ''
  });

  useEffect(() => {
    if (event) {
      // Format the dates to yyyy-MM-ddThh:mm format for datetime-local input
      const formatDateTime = (dateTimeStr) => {
        if (!dateTimeStr) return '';
        const dateTime = new Date(dateTimeStr);
        return dateTime.toISOString().slice(0, 16);
      };

      setFormData({
        event_title: event.event_title || '',
        report_time: event.report_time ? formatDateTime(event.report_time) : '',
        start_time: event.start_time ? formatDateTime(event.start_time) : '',
        end_time: event.end_time ? formatDateTime(event.end_time) : '',
        location: event.location || '',
        num_required_aides: event.num_required_aides || 1,
        num_guests: event.num_guests || 0,
        uniform: event.uniform || '',
        notes: event.notes || ''
      });
    }
  }, [event]);

  if (!isOpen || !event) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'num_required_aides' || name === 'num_guests' 
        ? (value === "" ? "" : parseInt(value, 10)) 
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.event_title || !formData.report_time || !formData.start_time || !formData.end_time || !formData.location) {
      setError("Please fill in all required fields.");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      await onSave({ ...event, ...formData });
      onClose();
    } catch (err) {
      setError("Failed to update event. Please try again.");
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
                Edit Event
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
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div>
                  <label htmlFor="event_title" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Name
                  </label>
                  <input
                    type="text"
                    id="event_title"
                    name="event_title"
                    value={formData.event_title}
                    onChange={handleChange}
                    required
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="report_time" className="block text-sm font-medium text-gray-700">
                      Report Time
                    </label>
                    <input
                      type="datetime-local"
                      id="report_time"
                      name="report_time"
                      value={formData.report_time}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    
                    <label htmlFor="start_time" className="block text-sm font-medium text-gray-700">
                      In Place Time
                    </label>
                    <input
                      type="datetime-local"
                      id="start_time"
                      name="start_time"
                      value={formData.start_time}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    
                    <label htmlFor="end_time" className="block text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      id="end_time"
                      name="end_time"
                      value={formData.end_time}
                      onChange={handleChange}
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
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="num_required_aides" className="block text-sm font-medium text-gray-700 mb-1">
                      Required Aides (per service)
                    </label>
                    <input
                      type="number"
                      id="num_required_aides"
                      name="num_required_aides"
                      min="0"
                      value={formData.num_required_aides}
                      onChange={handleChange}
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
                      name="num_guests"
                      min="0"
                      value={formData.num_guests}
                      onChange={handleChange}
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
                    name="uniform"
                    value={formData.uniform}
                    onChange={handleChange}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Event Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
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
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default EditEventModal;