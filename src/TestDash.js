import usePocketbaseUsers from "hooks/usePocketbaseUsers";
import usePocketbaseEvents from "hooks/usePocketbaseEvents";
import React, { useEffect, useContext } from "react";
import pb from "lib/pocketbase";
import { AuthContext } from "AuthContext";
import UpcomingEventsCard from "UpcomingEventsCard";
import UserDataCard from "UserDataCard";
import AidesCard from "AidesCard";

export default function TestDash() {
  const { futureEvents, getFutureEvents } = usePocketbaseEvents();
  const { currentUser, getCurrentUser } = usePocketbaseUsers();
  const user = pb.authStore.record;
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    getCurrentUser(user.id);
    getFutureEvents();
  }, [getCurrentUser, getFutureEvents]);

  if (!isAuthenticated) return null;

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            <span className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome, {currentUser?.preferred_name || "User"}!
            </span>
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Here's everything you need to know today
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {/* Upcoming Events Card - Spans full width on mobile, 2 columns on larger screens */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2">
            <div className="bg-white overflow-hidden shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl h-full">
              <div className="p-1">
                <UpcomingEventsCard events={futureEvents} />
              </div>
            </div>
          </div>

          {/* User Data Card */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
            <div className="bg-white overflow-hidden shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl h-full">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Profile</h2>
                <UserDataCard user={currentUser} />
              </div>
            </div>
          </div>

          {/* Aides Card */}
          {/* <div className="col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-1">
            <div className="bg-white overflow-hidden shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl h-full">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Aides</h2>
                <AidesCard />
              </div>
            </div>
          </div> */}

          {/* Announcements Card - Spans full width on mobile, 2+ columns on larger screens */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-1">
            <div className="bg-white overflow-hidden shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl h-full min-h-64">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Announcements</h2>
                <div className="min-h-48">
                  <p>No Announcements right now!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}