import React from "react";

export default function UserDataCard({ user }) {
  // Handle potential undefined user or missing fields
  if (!user) return <div className="text-gray-500">Loading user data...</div>;

  const full_name = [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="relative">
      {/* Badge for event count */}
      <div className="absolute top-0 right-0">
        <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 shadow-sm">
          <svg 
            className="mr-1.5 h-4 w-4 text-indigo-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>{user.num_events || 0} Events</span>
        </span>
      </div>

      {/* User avatar placeholder */}
      <div className="flex items-center mb-6 mt-2">
        <div className="flex-shrink-0">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xl font-bold">
            {user.first_name ? user.first_name.charAt(0) : '?'}
          </div>
        </div>
        <div className="ml-4">
          <h1 className="text-xl font-bold text-gray-900">{full_name || "Name Not Available"}</h1>
          <p className="text-sm text-gray-500">{user.preferred_name && `Prefers: ${user.preferred_name}`}</p>
        </div>
      </div>

      {/* User details */}
      <div className="space-y-4 bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {user.preferred_name && (
            <div className="col-span-1">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Preferred Name</p>
                  <p className="text-sm font-semibold text-gray-900">{user.preferred_name}</p>
                </div>
              </div>
            </div>
          )}

          {user.service && (
            <div className="col-span-1">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Service</p>
                  <p className="text-sm font-semibold text-gray-900">{user.service}</p>
                </div>
              </div>
            </div>
          )}

          {user.grade && (
            <div className="col-span-1">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center mr-3">
                  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Grade</p>
                  <p className="text-sm font-semibold text-gray-900">{user.grade}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}