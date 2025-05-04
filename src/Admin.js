import React, { useEffect, useState } from 'react';
import usePocketbaseEvents from 'hooks/usePocketbaseEvents';
import AssignmentModal from 'AssignmentModal';
import usePocketbaseAssignments from 'hooks/usePocketbaseAssignments';
import CreateEventModal from 'CreateEventModal';
import EventCard from 'EventCard';
import EditEventModal from 'EditEventModal';

const Admin = () => {
  const { futureEvents, loadingEvents, getFutureEvents, updateEvent } = usePocketbaseEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const { numAssignedAides, getAssignedAides } = usePocketbaseAssignments();


  useEffect(() => {
    getFutureEvents();
    getAssignedAides();
  }, [getFutureEvents, getAssignedAides]);

  const handleEventCardClick = (event) => {
    setSelectedEvent(event);
    setIsAssignmentModalOpen(true);
  };

  const handleEditEvent = (event) => {
    setEventToEdit(event);
    setIsEditEventModalOpen(true);
  };

  const handleSaveEditedEvent = async (updatedEvent) => {
    try {
       await updateEvent(updatedEvent);
      getFutureEvents(); // Refresh the events list
    } catch (error) {
      console.error("Failed to update event:", error);
    }
  };

  const handleCloseEventModal = () => {
    setIsAssignmentModalOpen(false);
    setSelectedEvent(null);
  };

  const handleCloseEditEventModal = () => {
    setIsEditEventModalOpen(false);
    setEventToEdit(null);
  };

  const handleCreateEvent = () => {
    setIsCreateEventModalOpen(true);
  };

  const handleCloseCreateEventModal = () => {
    setIsCreateEventModalOpen(false);
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
            <EventCard
              key={event.id}
              event={event}
              onCardClick={handleEventCardClick}
              onEditClick={handleEditEvent}
            />
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

        <EditEventModal
          isOpen={isEditEventModalOpen}
          onClose={handleCloseEditEventModal}
          event={eventToEdit}
          onSave={handleSaveEditedEvent}
        />
      </div>
    </div>
  );
};

export default Admin;