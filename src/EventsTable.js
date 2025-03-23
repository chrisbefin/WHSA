import usePocketbaseEvents from "hooks/usePocketbaseEvents";
import EventDetailModal from "EventDetailModal";
import React, { useEffect, useContext, useMemo, useState } from "react";

// TODO: make each row clickable to show a modal with details on a specific user
const EventsTable = () => {
  const { events, loadingEvents, fetchEvents } = usePocketbaseEvents();

  const [activeColumn, setActiveColumn] = useState(["start_time"]);
  const [sortingColumn, setSortingColumn] = useState(["start_time"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(events);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = events.filter(
      (event) =>
      event.event_title.toLowerCase().includes(term) ||
      event.location.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  }, [searchTerm, events])

  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const sortByColumnAlpha = (column) => {
    if (sortingColumn?.includes(column)) {
      const sortData = filteredData
        .slice()
        .sort((a, b) =>
          b[column].toString().localeCompare(a[column].toString())
        );
      setFilteredData(sortData);
      setSortingColumn([]);
    } else {
      const sortData = filteredData
        .slice()
        .sort((a, b) =>
          a[column].toString().localeCompare(b[column].toString())
        );
      setFilteredData(sortData);
      setSortingColumn([`${column}`]);
    }
    setActiveColumn([`${column}`]);
  };

  // TODO: numeric sorting not working after having sorted on another column
  const sortByColumnNumeric = (column) => {
    if (sortingColumn?.includes(column)) {
      const sortData = filteredData
        .slice()
        .sort((a, b) =>
          a[column] < b[column]
        );
      setFilteredData(sortData);
      setSortingColumn([]);
    } else {
      const sortData = filteredData
        .slice().sort((a, b) =>
          a[column] < b[column]
        ).reverse();
      setFilteredData(sortData);
      setSortingColumn([`${column}`]);
    }
    setActiveColumn([`${column}`]);
  };

  if (loadingEvents) {
    return <p>Loading...</p>;
  }
  return (
    <>
    <div className="min-h-screen h-full bg-white flex flex-col items-center justify-center py-4 sm:py-10 gap-12">
      <div className="w-full max-w-4xl px-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="w-full px-4">
        <div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none mt-2">
          <table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border-separate border-spacing-y-0">
            <thead className="bg-[#222E3A]/[6%] rounded-lg text-base text-white font-semibold w-full">
              <tr className="">
                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap group">
                  <div className="flex items-center">
                    <svg
                      className={`w-4 h-4 cursor-pointer ${
                        activeColumn?.includes("event_title")
                          ? "text-black"
                          : "text-[#BCBDBE] group-hover:text-black rotate-180"
                      } ${
                        sortingColumn?.includes("event_title")
                          ? "rotate-180"
                          : "rotate-0"
                      }
           `}
                      onClick={() => sortByColumnAlpha("event_title")}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                    <span
                      className="cursor-pointer pl-1"
                      onClick={() => sortByColumnAlpha("event_title")}
                    >
                      Event
                    </span>
                  </div>
                </th>
                <th className="py-3 px-3 flex items-center text-[#212B36] sm:text-base font-bold whitespace-nowrap group">
                  <svg
                    className={`w-4 h-4 cursor-pointer ${
                      activeColumn?.includes("location")
                        ? "text-black"
                        : "text-[#BCBDBE] group-hover:text-black rotate-180"
                    } ${
                      sortingColumn?.includes("location")
                        ? "rotate-180"
                        : "rotate-0"
                    } `}
                    onClick={() => sortByColumnAlpha("location")}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <span
                    className="cursor-pointer pl-1"
                    onClick={() => sortByColumnAlpha("location")}
                  >
                    Location
                  </span>
                </th>
                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap group">
                  <div className="flex items-center">
                    <svg
                      className={`w-4 h-4 cursor-pointer ${
                        activeColumn?.includes("start_time")
                          ? "text-black"
                          : "text-[#BCBDBE] group-hover:text-black rotate-180"
                      } ${
                        sortingColumn?.includes("start_time")
                          ? "rotate-180"
                          : "rotate-0"
                      } `}
                      onClick={() => sortByColumnAlpha("start_time")}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                    <span
                      className="cursor-pointer pl-1"
                      onClick={() => sortByColumnAlpha("start_time")}
                    >
                      Date
                    </span>
                  </div>
                </th>
                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                  Num Aides
                </th>
                <th className="flex items-center py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap group">
                  <svg
                    className={`w-4 h-4 cursor-pointer  ${
                      sortingColumn?.includes("num_guests")
                        ? "rotate-180"
                        : "rotate-0"
                    } ${
                      activeColumn?.includes("num_guests")
                        ? "text-black"
                        : "text-[#BCBDBE] group-hover:text-black rotate-180"
                    }`}
                    onClick={() => sortByColumnNumeric("num_guests")}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <span
                    className="cursor-pointer pl-1"
                    onClick={() => sortByColumnNumeric("num_guests")}
                  >
                    Num Guests
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData?.map((data, index) => (
                <tr key={index}
                    onClick={() => handleRowClick(data)}
                    className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="py-2 px-3 font-normal text-base border-t whitespace-nowrap">
                    {data?.event_title}
                  </td>
                  <td className="py-2 px-3 font-normal text-base border-t whitespace-nowrap">
                    {data?.location}
                  </td>
                  <td className="py-2 px-3 text-base font-normal border-t whitespace-nowrap">
                  {new Date(data?.start_time).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-3 text-base font-normal border-t min-w-[250px]">
                    {data?.num_required_aides}
                  </td>
                  <td className="py-5 px-4 text-base font-normal border-t">
                    {data?.num_guests}
                  </td>
                </tr>
              ))}
              <tr>
                <td colSpan={6} className="border-t"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <EventDetailModal 
    isOpen={isModalOpen}
    onClose={handleCloseModal}
    event={selectedEvent}
    />
    </>
  );
};
export default EventsTable;
