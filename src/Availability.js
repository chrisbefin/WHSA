import usePocketbaseEvents from "hooks/usePocketbaseEvents";
import usePocketbaseUsers from "hooks/usePocketbaseUsers";
import AvailabilityWidget from "AvailabilityWidget";
import React, { useEffect, useContext, useState } from "react";
import pb from "lib/pocketbase";
import { AuthContext } from "AuthContext";
import { Calendar, Clock, MapPin, User, Award, Loader, CalendarX } from "lucide-react";

export default function Availability() {
  const { futureEvents, loadingEvents, errorEvents, getFutureEvents } = usePocketbaseEvents();
  const { currentUser, getCurrentUser } = usePocketbaseUsers();
  const user = pb.authStore.record;
  const { isAuthenticated } = useContext(AuthContext);
  const [viewType, setViewType] = useState("cards"); // cards, list, table
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (user?.id) {
      getCurrentUser(user.id);
      getFutureEvents();
    }
  }, [getCurrentUser, getFutureEvents, user?.id]);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: '2-digit', hour12: true };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  if (loadingEvents) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center">
          <Loader className="h-10 w-10 text-blue-500 animate-spin mb-4" />
          <p className="text-lg text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (errorEvents) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
        <p className="text-red-700">Error loading events. Please try again later.</p>
      </div>
    );
  }

  const handleEventClick = (event) => {
    setSelectedEvent(selectedEvent?.id === event.id ? null : event);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Upcoming Events</h1>
        
        <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewType("cards")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewType === "cards" 
                ? "bg-white shadow-sm text-blue-600" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewType("list")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewType === "list" 
                ? "bg-white shadow-sm text-blue-600" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewType("table")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewType === "table" 
                ? "bg-white shadow-sm text-blue-600" 
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {futureEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-lg p-10">
          <CalendarX className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">No Upcoming Events</h2>
          <p className="text-gray-500 text-center max-w-md">
            There are no events scheduled at the moment. Check back later for updates.
          </p>
        </div>
      ) : (
        <>
          {/* Cards View */}
          {viewType === "cards" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {futureEvents.map((event) => (
                <div 
                  key={event.id}
                  className={`bg-white border rounded-lg shadow-sm overflow-hidden transition-all ${
                    selectedEvent?.id === event.id ? "ring-2 ring-blue-500" : "hover:shadow-md"
                  }`}
                >
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="p-5 pb-4">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">{event.event_title}</h2>
                      
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-start">
                          <Calendar className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                          <span>{formatDate(event.start_time)}</span>
                        </div>
                        
                        <div className="flex items-start">
                          <Clock className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                          <span>{formatTime(event.start_time)}</span>
                        </div>
                        
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                          <span>{event.location}</span>
                        </div>
                        
                        <div className="flex items-start">
                          <Award className="h-4 w-4 mt-1 mr-2 flex-shrink-0" />
                          <span>{event.uniform}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    <p className="text-sm font-medium text-gray-700 mb-2">Your Availability</p>
                    <AvailabilityWidget user={user} event={event} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* List View */}
          {viewType === "list" && (
            <div className="space-y-4">
              {futureEvents.map((event) => (
                <div 
                  key={event.id}
                  className={`bg-white border rounded-lg shadow-sm overflow-hidden transition-all ${
                    selectedEvent?.id === event.id ? "ring-2 ring-blue-500" : "hover:shadow-md"
                  }`}
                >
                  <div 
                    className="p-5 cursor-pointer"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="mb-4 md:mb-0">
                        <h2 className="text-xl font-semibold text-gray-900 mb-1">{event.event_title}</h2>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                            <span>{formatDate(event.start_time)}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                            <span>{formatTime(event.start_time)}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1.5" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-sm">
                          <Award className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                          <span className="text-gray-600">{event.uniform}</span>
                        </div>
                        
                        <div className="ml-auto md:ml-0">
                          <AvailabilityWidget user={user} event={event} />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedEvent?.id === event.id && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Additional Details</h3>
                      <p className="text-gray-600 text-sm">
                        {event.details || "No additional details available for this event."}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Table View (Original) */}
          {viewType === "table" && (
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Event Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Availability
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {futureEvents.map((event) => (
                    <tr 
                      key={event.id} 
                      className={`hover:bg-gray-50 ${selectedEvent?.id === event.id ? "bg-blue-50" : ""}`}
                      onClick={() => handleEventClick(event)}
                    >
                      <td className="px-6 py-4 cursor-pointer">
                        <div className="space-y-2">
                          <h2 className="text-lg font-semibold text-gray-900">{event.event_title}</h2>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="h-3.5 w-3.5 mr-1.5" />
                            <span>{event.location}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                            <span>{formatDate(event.start_time)}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                            <span>{formatTime(event.start_time)}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Award className="h-3.5 w-3.5 mr-1.5" />
                            <span>{event.uniform}</span>
                          </div>
                          
                          {selectedEvent?.id === event.id && event.details && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-sm text-gray-600">{event.details}</p>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 w-64">
                        <AvailabilityWidget user={user} event={event} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}