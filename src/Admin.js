import React, { useEffect, useState } from 'react';
import usePocketbaseEvents from 'hooks/usePocketbaseEvents';
import AssignmentModal from 'AssignmentModal';
import usePocketbaseAssignments from 'hooks/usePocketbaseAssignments';
import CreateEventModal from 'CreateEventModal';

const Admin = () => {
  const { futureEvents, loadingEvents, getFutureEvents } = usePocketbaseEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAssignmentModalOpen, setisAssignmentModalOpen] = useState(false);
  const [isCreateEventModalOpen, setisCreateEventModalOpen] = useState(false);
  const {numAssignedAides, getAssignedAides} = usePocketbaseAssignments()  


  useEffect(() => {
    getFutureEvents();
    getAssignedAides();
  }, [getFutureEvents, getAssignedAides]);

  const handleEventCardClick = (event) => {
    setSelectedEvent(event);
    setisAssignmentModalOpen(true);
  };

  const handleCloseEventModal = () => {
    setisAssignmentModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCreateEvent = () => {
    setisCreateEventModalOpen(true);
  }

  const handleCloseCreateEventModal = () => {
      setisCreateEventModalOpen(false);
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loadingEvents) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Upcoming Events</h1>
          <button 
            onClick={() => handleCreateEvent()} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600
            transition-colors font-medium flex items-center"
          >
            Create New Event
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {futureEvents.map((event) => (
            <div
              key={event.id}
              onClick={() => handleEventCardClick(event)}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {event.event_title}
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    {/* <Calendar className="w-5 h-5 mr-2" /> */}
                    <span>{formatDate(event.start_time)}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    {/* <MapPin className="w-5 h-5 mr-2" /> */}
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    {/* <Users className="w-5 h-5 mr-2" /> */}
                    <span>{event.num_required_aides} aides required</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    {event.num_guests} guests expected
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <AssignmentModal 
          isOpen={isAssignmentModalOpen}
          onClose={handleCloseEventModal}
          event={selectedEvent}
        />


        <CreateEventModal
          isOpen={isCreateEventModalOpen}
          onClose={handleCloseCreateEventModal}
        />
      </div>
    </div>
  );
};

export default Admin;