import usePocketbaseEvents from "hooks/usePocketbaseEvents";
import EventDetailModal from "EventDetailModal";
import React, { useEffect, useState } from "react";

const EventsTable = () => {
  const { events, loadingEvents, fetchEvents } = usePocketbaseEvents();

  const [activeColumn, setActiveColumn] = useState("start_time");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = events.filter(
      (event) =>
        event.event_title?.toLowerCase().includes(term) ||
        event.location?.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  }, [searchTerm, events]);

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSort = (column, isNumeric = false) => {
    const newDirection = activeColumn === column && sortDirection === "asc" ? "desc" : "asc";
    
    const sortedData = [...filteredData].sort((a, b) => {
      // Handle potentially undefined values
      const valueA = a[column] || "";
      const valueB = b[column] || "";
      
      if (isNumeric) {
        // Convert to numbers for numeric comparison
        const numA = Number(valueA);
        const numB = Number(valueB);
        return newDirection === "asc" ? numA - numB : numB - numA;
      } else {
        // String comparison
        if (typeof valueA === "string" && typeof valueB === "string") {
          return newDirection === "asc" 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        } else {
          // Fall back to simple comparison for non-string values
          return newDirection === "asc"
            ? String(valueA).localeCompare(String(valueB))
            : String(valueB).localeCompare(String(valueA));
        }
      }
    });
    
    setFilteredData(sortedData);
    setActiveColumn(column);
    setSortDirection(newDirection);
  };

  const SortIcon = ({ column, isNumeric = false }) => {
    return (
      <button 
        onClick={() => handleSort(column, isNumeric)}
        className="inline-flex items-center ml-1 focus:outline-none"
      >
        <svg 
          className={`w-4 h-4 transition-colors duration-200 
            ${activeColumn === column ? "text-indigo-600" : "text-gray-400"}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        {activeColumn === column && (
          <span className="sr-only">{sortDirection === "asc" ? "Sorted ascending" : "Sorted descending"}</span>
        )}
      </button>
    );
  };

  const TableHeader = ({ title, column, isNumeric = false }) => (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      <div className="flex items-center cursor-pointer" onClick={() => handleSort(column, isNumeric)}>
        <span className="hover:text-gray-700">{title}</span>
        <SortIcon column={column} isNumeric={isNumeric} />
      </div>
    </th>
  );

  if (loadingEvents) {
    return (
      <div className="flex justify-center items-center min-h-64 w-full">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const noEventsFound = filteredData.length === 0;

  return (
    <>
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full max-w-7xl mx-auto">
        {/* Search and header section */}
        <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-bold text-gray-800">Event Schedule</h2>
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        {/* Table section */}
        <div className="overflow-x-auto">
          {noEventsFound ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <svg className="h-12 w-12 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-gray-500 text-lg">No events found matching "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm("")} 
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Clear search
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <TableHeader title="Event" column="event_title" />
                  <TableHeader title="Location" column="location" />
                  <TableHeader title="Date" column="start_time" />
                  <TableHeader title="Aides Required" column="num_required_aides" isNumeric={true} />
                  <TableHeader title="Guests" column="num_guests" isNumeric={true} />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((event, index) => (
                  <tr 
                    key={event.id || index}
                    onClick={() => handleRowClick(event)}
                    className="hover:bg-indigo-50 transition-colors duration-150 ease-in-out cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.event_title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {event.start_time && new Date(event.start_time).toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {event.num_required_aides || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {event.num_guests || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination placeholder - can be implemented if needed */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredData.length}</span> events
          </div>
        </div>
      </div>

      {/* Event detail modal */}
      <EventDetailModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        event={selectedEvent}
      />
    </>
  );
};

export default EventsTable;