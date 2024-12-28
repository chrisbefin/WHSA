import React, { useEffect, useContext } from "react";
import useLogout from "hooks/useLogout";
import pb from "lib/pocketbase";
import { AuthContext } from "AuthContext";
import { useState } from 'react';
import usePocketbaseEvents from "hooks/usePocketbaseEvents";
import usePocketbaseUsers from "hooks/usePocketbaseUsers";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MenuBar from "MenuBar";
import Aides from "AidesTable";
import Events from "Evs";
import UpcomingEventsCard from "UpcomingEventsCard";
import UserDataCard from "UserDataCard";

export default function Dashboard() {
  const { isAuthenticated } = useContext(AuthContext);
  const logout = useLogout();

  // TODO: refactor the user variable into the AuthContext
  const user = pb.authStore.record;

  const { events, userEvents, loadingEvents, errorEvents, fetchEvents, getUserEvents } = usePocketbaseEvents();
  const { users, currentUser, loadingUsers, errorUsers, fetchUsers, getCurrentUser, createUser, deleteUser, updateUser } = usePocketbaseUsers();
  useEffect(() => {
    fetchEvents(); 
    getUserEvents(user.id);
    getCurrentUser(user.id);
  }, [fetchEvents, getUserEvents, getCurrentUser]);

  if (!isAuthenticated) return null;

    
  return (
    <>
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UpcomingEventsCard events={events}/>
          <UserDataCard user={currentUser}/>
        </div>
      </div>
    </div>    
    </>
    
    // <>
    // <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //   <div className="text-center">
    //   <h1 className="text-3xl font-bold">Welcome, {user.first_name}!</h1>
    //   <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
    //     {events.length > 0 ? (
    //         <ul className="space-y-4">
    //         {events.map((event) => (
    //             <li key={event.id} className="border rounded-lg p-4 shadow-sm bg-white">
    //             <h2 className="text-xl font-semibold">{event.event_title}</h2>
    //             <p className="text-gray-700">
    //                 <b>Location:</b>{event.Location}
    //             </p>
    //             <p className="text-sm">
    //                 <b>Date:</b> {new Date(event.start_time).toLocaleDateString()}
    //             </p>
    //             <p className="text-sm">
    //                 <b>Start Time:</b> {new Date(event.start_time).toLocaleTimeString()}
    //             </p>
    //             </li>
    //         ))}
    //         </ul>
    //     ) : (
    //         <p>No events available at the moment.</p>
    //     )}
    //     <h1 className="text-2xl font-bold mb-4">Your Upcoming Assignments</h1>
    //     {userEvents.length > 0 ? (
    //         <ul className="space-y-4">
    //         {userEvents.map((event) => (
    //             <li key={event.id} className="border rounded-lg p-4 shadow-sm bg-white">
    //             <h2 className="text-xl font-semibold">{event.event_title}</h2>
    //             <p className="text-gray-700">
                  
    //                 <b>Location:</b>{event.location}
    //             </p>
    //             <p className="text-sm">
    //                 <b>Date:</b> {new Date(event.start_time).toLocaleDateString()}
    //             </p>
    //             <p className="text-sm">
    //                 <b>Start Time:</b> {new Date(event.start_time).toLocaleTimeString()}
    //             </p>
    //             </li>
    //         ))}
    //         </ul>
    //     ) : (
    //         <p>No events available at the moment.</p>
    //     )}
    //   </div>
    // </div>
  )
}
