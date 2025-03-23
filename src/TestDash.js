import usePocketbaseUsers from "hooks/usePocketbaseUsers";
import usePocketbaseEvents from "hooks/usePocketbaseEvents";
import React, { useEffect, useContext, useMemo, useState } from "react";
import pb from "lib/pocketbase";
import { AuthContext } from "AuthContext";
import UpcomingEventsCard from "UpcomingEventsCard";
import UserDataCard from "UserDataCard";
import AidesCard from "AidesCard";


export default function TestDash() {
    const { events, userEvents, loadingEvents, errorEvents, futureEvents, fetchEvents, getUserEvents, getFutureEvents } = usePocketbaseEvents();
    const { users, currentUser, loadingUsers, errorUsers, fetchUsers, getCurrentUser, createUser, deleteUser, updateUser } = usePocketbaseUsers();
    const user = pb.authStore.record;
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
    getCurrentUser(user.id);
    getFutureEvents();
    }, [getCurrentUser, getFutureEvents]);

    if (!isAuthenticated) return null;

    return (
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-gray-950 sm:text-5xl">
          Welcome, {currentUser.preferred_name}!
          </p>
          <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
            <div className="border rounded-lg relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg+1px))] lg:rounded-l-[calc(2rem)]">
                <UpcomingEventsCard events={futureEvents}/>
              </div>
              {/* <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div> */}
            </div>
            <div className="relative max-lg:row-start-1">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <UserDataCard user={currentUser}/>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
            </div>
            <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
              <div className="absolute inset-px rounded-lg bg-white"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                  <AidesCard/>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
            </div>
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                  <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
                    Announcements
                  </p>
                </div>
                <div className="relative min-h-[30rem] w-full grow">
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  