import usePocketbaseUsers from "hooks/usePocketbaseUsers";
import usePocketbaseEvents from "hooks/usePocketbaseEvents";
import AvailabilityWidget from "AvailabilityWidget";
import React, { useEffect, useContext, useMemo, useState } from "react";
import pb from "lib/pocketbase";
import { AuthContext } from "AuthContext";

export default function Availability () {
    const { events, userEvents, loadingEvents, errorEvents, futureEvents, fetchEvents, getUserEvents, getFutureEvents } = usePocketbaseEvents();
    const { users, currentUser, loadingUsers, errorUsers, fetchUsers, getCurrentUser, createUser, deleteUser, updateUser } = usePocketbaseUsers();
    const user = pb.authStore.record;
    const { isAuthenticated } = useContext(AuthContext);

    useEffect(() => {
    getCurrentUser(user.id);
    getFutureEvents();
    }, [getCurrentUser, getFutureEvents]);

    return (
        <>
        <h1 className="px-4 py-2 text-2xl font-bold mb-4">Upcoming Events</h1>
        {futureEvents.length > 0 ? (
        <table className="table-auto overflow-scroll md:overflow-auto w-full text-left font-inter border-separate border-spacing-y-0">
            <thead className="bg-[#222E3A]/[6%] rounded-lg text-base font-semibold w-full">
                <tr>
                    <th>
                        Event
                    </th>
                    <th>
                        Availability
                    </th>
                </tr>
            </thead>
            <tbody>
                {futureEvents.map((event) => (
                    <tr key={event.id} className="py-4">
                        <td>
                            <h2 className="text-xl font-semibold">{event.event_title}</h2>
                            <p className="text-sm">
                                <b>Location: </b>{event.location}
                            </p>
                            <p className="text-sm">
                                <b>Date: </b> {new Date(event.start_time).toLocaleDateString()}
                            </p>
                            <p className="text-sm">
                                <b>Start Time: </b> {new Date(event.start_time).toLocaleTimeString()}
                            </p>
                            <p className="text-sm">
                                <b>Uniform: </b> {event.uniform}
                            </p>
                        </td>
                        <td>
                            <AvailabilityWidget user={user} event={event}/>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        ) : (
            <p>No events available at the moment.</p>
        )}
        </>
    )
}