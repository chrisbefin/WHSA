import React from 'react';

const EventCard = ({ event, onCardClick, onEditClick }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent card click event from firing
    onEditClick(event);
  };

  return (
    <div
      onClick={() => onCardClick(event)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer relative"
    >
      <button
        onClick={handleEditClick}
        className="absolute top-2 right-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Edit event"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {event.event_title}
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <span>{formatDate(event.start_time)}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <span>{event.location}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
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
  );
};

export default EventCard;