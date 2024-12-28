import usePocketbaseUsers from "hooks/usePocketbaseUsers";
import React, { useEffect, useContext, useMemo, useState } from "react";

const AidesTable = () => {
  const { users, currentUser, loadingUsers, errorUsers, fetchUsers, getCurrentUser, createUser, deleteUser, updateUser } = usePocketbaseUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setSortingData(users);
  }, [users]);

  const [activeColumn, setActiveColumn] = useState(["last_name"]);
  const [sortingColumn, setSortingColumn] = useState(["last_name"]);
  const [sortingData, setSortingData] = useState([]);

  const sortByColumnAlpha = (column) => {
    if (sortingColumn?.includes(column)) {
      const sortData = users
        .slice()
        .sort((a, b) =>
          b[column].toString().localeCompare(a[column].toString())
        );
      setSortingData(sortData);
      setSortingColumn([]);
    } else {
      const sortData = users
        .slice()
        .sort((a, b) =>
          a[column].toString().localeCompare(b[column].toString())
        );
      setSortingData(sortData);
      setSortingColumn([`${column}`]);
    }
    setActiveColumn([`${column}`]);
  };

  const sortByColumnNumeric = (column) => {
    if (sortingColumn?.includes(column)) {
      const sortData = users
        .slice()
        .sort((a, b) =>
          a[column] < b[column]
        );
      setSortingData(sortData);
      setSortingColumn([]);
    } else {
      const sortData = users
        .slice().sort((a, b) =>
          a[column] < b[column]
        ).reverse();
      setSortingData(sortData);
      setSortingColumn([`${column}`]);
    }
    setActiveColumn([`${column}`]);
  };

  if (loadingUsers) {
    return <p>Loading...</p>;
  }
  return (
    <div className="min-h-screen h-full bg-white flex flex-col items-center justify-center py-4 sm:py-10 gap-12">
      <div className="w-full px-4">
        <div className="w-full overflow-x-scroll md:overflow-auto max-w-7xl 2xl:max-w-none mt-2">
          <table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border-separate border-spacing-y-0 borer ">
            <thead className="bg-[#222E3A]/[6%] rounded-lg text-base text-white font-semibold w-full">
              <tr className="">
                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap group">
                  <div className="flex items-center">
                    <svg
                      className={`w-4 h-4 cursor-pointer ${
                        activeColumn?.includes("last_name")
                          ? "text-black"
                          : "text-[#BCBDBE] group-hover:text-black rotate-180"
                      } ${
                        sortingColumn?.includes("last_name")
                          ? "rotate-180"
                          : "rotate-0"
                      }
           `}
                      onClick={() => sortByColumnAlpha("last_name")}
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
                      onClick={() => sortByColumnAlpha("last_name")}
                    >
                      Last Name
                    </span>
                  </div>
                </th>
                <th className="py-3 px-3 flex items-center text-[#212B36] sm:text-base font-bold whitespace-nowrap group">
                  <svg
                    className={`w-4 h-4 cursor-pointer ${
                      activeColumn?.includes("preferred_name")
                        ? "text-black"
                        : "text-[#BCBDBE] group-hover:text-black rotate-180"
                    } ${
                      sortingColumn?.includes("preferred_name")
                        ? "rotate-180"
                        : "rotate-0"
                    } `}
                    onClick={() => sortByColumnAlpha("preferred_name")}
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
                    onClick={() => sortByColumnAlpha("preferred_name")}
                  >
                    First Name
                  </span>
                </th>
                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap group">
                  <div className="flex items-center">
                    <svg
                      className={`w-4 h-4 cursor-pointer ${
                        activeColumn?.includes("service")
                          ? "text-black"
                          : "text-[#BCBDBE] group-hover:text-black rotate-180"
                      } ${
                        sortingColumn?.includes("service")
                          ? "rotate-180"
                          : "rotate-0"
                      } `}
                      onClick={() => sortByColumnAlpha("service")}
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
                      onClick={() => sortByColumnAlpha("service")}
                    >
                      Service
                    </span>
                  </div>
                </th>
                <th className="py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap">
                  Start Date
                </th>
                <th className="flex items-center py-3 px-3 text-[#212B36] sm:text-base font-bold whitespace-nowrap group">
                  <svg
                    className={`w-4 h-4 cursor-pointer  ${
                      sortingColumn?.includes("Price")
                        ? "rotate-180"
                        : "rotate-0"
                    } ${
                      activeColumn?.includes("Price")
                        ? "text-black"
                        : "text-[#BCBDBE] group-hover:text-black rotate-180"
                    }`}
                    onClick={() => sortByColumnNumeric("num_events")}
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
                    onClick={() => sortByColumnNumeric("num_events")}
                  >
                    # of Events
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortingData?.map((data, index) => (
                <tr key={index}>
                  <td className="py-2 px-3 font-normal text-base border-t whitespace-nowrap">
                    {data?.last_name}
                  </td>
                  <td className="py-2 px-3 font-normal text-base border-t whitespace-nowrap">
                    {data?.preferred_name}
                  </td>
                  <td className="py-2 px-3 text-base font-normal border-t whitespace-nowrap">
                    {data?.service}
                  </td>
                  <td className="py-2 px-3 text-base font-normal border-t min-w-[250px]">
                    {data?.email}
                  </td>
                  <td className="py-5 px-4 text-base font-normal border-t">
                    {data?.num_events}
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
  );
};
export default AidesTable;
