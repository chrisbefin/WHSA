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
import Events from "EventsTable";
import UpcomingEventsCard from "UpcomingEventsCard";
import UserDataCard from "UserDataCard";
import AidesCard from "AidesCard";
import AidesCardDropdown from "AidesCardDropdown";

export default function Dashboard() {
  const { isAuthenticated } = useContext(AuthContext);
  const logout = useLogout();

  // TODO: refactor the user variable into the AuthContext
  const user = pb.authStore.record;

  const { events, userEvents, loadingEvents, errorEvents, futureEvents, fetchEvents, getUserEvents, getFutureEvents } = usePocketbaseEvents();
  const { users, currentUser, loadingUsers, errorUsers, fetchUsers, getCurrentUser, createUser, deleteUser, updateUser } = usePocketbaseUsers();
  useEffect(() => {
    fetchEvents(); 
    getUserEvents(user.id);
    getCurrentUser(user.id);
    getFutureEvents();
  }, [fetchEvents, getUserEvents, getCurrentUser, getFutureEvents]);

  if (!isAuthenticated) return null;

    
  return (
    <>
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UpcomingEventsCard events={futureEvents}/>
          <UserDataCard user={currentUser}/>
          {/* <AidesCard/> */}
        </div>
      </div>
    </div>    
    </>
  )
}
