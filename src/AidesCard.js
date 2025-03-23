import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import AidesCardDropdown from 'AidesCardDropdown';
import usePocketbaseUsers from "hooks/usePocketbaseUsers";
import { useState, useEffect, useCallback } from "react";


export default function AidesCard () {
    const { users, currentUser, loadingUsers, errorUsers, fetchUsers, getCurrentUser, createUser, deleteUser, updateUser } = usePocketbaseUsers();

    useEffect(() => {
    fetchUsers();
    }, [fetchUsers]);


    return (
        <>
        <h1 className="text-2xl font-bold mb-4">Aides</h1>
        <span className="absolute top-2 right-2 text-sm font-semibold text-gray-500 px-2 py-1 rounded">
            <AidesCardDropdown/>
        </span>
        <ul className="space-y-4">
            <li key={""} className="bg-white relative">
            <p className="text-lg">
                <b>Active Aides: </b> {}
            </p>
            <p className="text-lg">
                <b>Service: </b>{}
            </p>
            <p className="text-lg">
                <b>Grade: </b> {}
            </p>
            </li>
        </ul>
        </>
    )
}