import usePocketbaseUsers from "hooks/usePocketbaseUsers";
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Search, User, Mail, Briefcase, Calendar } from "lucide-react";

const AidesTable = () => {
  const { users, loadingUsers, fetchUsers } = usePocketbaseUsers();

  const [activeColumn, setActiveColumn] = useState("last_name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // table, cards, list

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    let filtered = [...users];
    
    if (term) {
      filtered = users.filter(
        (user) =>
          user.last_name.toLowerCase().includes(term) ||
          user.preferred_name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term) ||
          user.service.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    const sortedData = sortData(filtered, activeColumn, sortDirection);
    setFilteredData(sortedData);
  }, [searchTerm, users, activeColumn, sortDirection]);

  const sortData = (data, column, direction) => {
    return [...data].sort((a, b) => {
      const isNumeric = column === "num_events";
      
      if (isNumeric) {
        return direction === "asc" 
          ? a[column] - b[column] 
          : b[column] - a[column];
      } else {
        return direction === "asc"
          ? a[column].toString().localeCompare(b[column].toString())
          : b[column].toString().localeCompare(a[column].toString());
      }
    });
  };

  const handleSort = (column) => {
    if (activeColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setActiveColumn(column);
      setSortDirection("asc");
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  if (loadingUsers) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const SortIcon = ({ column }) => {
    if (activeColumn !== column) {
      return <ChevronDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  const TableHeader = ({ label, column }) => (
    <th className="py-3 px-4 text-left text-gray-700 font-semibold whitespace-nowrap">
      <button
        className="flex items-center gap-1 hover:text-blue-600 transition-colors"
        onClick={() => handleSort(column)}
      >
        {label}
        <SortIcon column={column} />
      </button>
    </th>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800">Team Members</h2>
            
            <div className="flex items-center gap-4 w-full sm:w-auto">
              {/* View toggle */}
              <div className="flex rounded-md shadow-sm bg-gray-100 p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewMode === "table" 
                      ? "bg-white shadow-sm text-blue-600" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewMode === "cards" 
                      ? "bg-white shadow-sm text-blue-600" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 text-sm rounded-md ${
                    viewMode === "list" 
                      ? "bg-white shadow-sm text-blue-600" 
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  List
                </button>
              </div>
              
              {/* Search box */}
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Table view */}
          {viewMode === "table" && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeader label="Last Name" column="last_name" />
                    <TableHeader label="First Name" column="preferred_name" />
                    <TableHeader label="Service" column="service" />
                    <TableHeader label="Email" column="email" />
                    <TableHeader label="# of Events" column="num_events" />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((user, index) => (
                      <tr 
                        key={index} 
                        onClick={() => handleUserClick(user)}
                        className="hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-gray-900">{user.last_name}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{user.preferred_name}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{user.service}</td>
                        <td className="py-3 px-4 text-sm text-gray-500">{user.email}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-center">{user.num_events}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-4 text-center text-gray-500">
                        No results found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Cards view */}
          {viewMode === "cards" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredData.length > 0 ? (
                filteredData.map((user, index) => (
                  <div 
                    key={index}
                    onClick={() => handleUserClick(user)}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.preferred_name} {user.last_name}</h3>
                        <p className="text-sm text-gray-500">{user.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span>{user.num_events} events</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No results found
                </div>
              )}
            </div>
          )}
          
          {/* List view */}
          {viewMode === "list" && (
            <div className="divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((user, index) => (
                  <div 
                    key={index}
                    onClick={() => handleUserClick(user)}
                    className="py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer px-4 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.preferred_name} {user.last_name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            <span>{user.service}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-xs">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
                      <Calendar className="h-4 w-4" />
                      <span>{user.num_events}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No results found
                </div>
              )}
            </div>
          )}
          
          {/* User details modal */}
          {isModalOpen && selectedUser && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">User Details</h3>
                  <button 
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User className="h-8 w-8" />
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-900">
                        {selectedUser.preferred_name} {selectedUser.last_name}
                      </h4>
                      <p className="text-gray-500">{selectedUser.service}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="mt-1">{selectedUser.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Number of Events</p>
                        <p className="mt-1">{selectedUser.num_events}</p>
                      </div>
                      {/* Additional user data can be added here */}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={closeModal}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Pagination could be added here */}
          <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
            <div>
              Showing {filteredData.length} of {users.length} users
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AidesTable;