import { useState, useEffect, useCallback } from "react";
import pb from "lib/pocketbase";

const usePocketbaseUsers = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const [loadingUsers, setLoading] = useState(false);
  const [errorUsers, setError] = useState(null);

  const eventsCollection = "events";
  const usersCollection = "users";
  const availabilityCollection = "availability";
  const assignmentsCollection = "assignments";
  const viewUserEventsCollection = "viewUserEvents"

  const fetchUsers = useCallback(async (query = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await pb.collection(usersCollection).getFullList();
      setUsers(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // return data of currently logged on user
  const getCurrentUser = useCallback(async (id) => {
    setError(null);

    try {
      const response = await pb.collection(usersCollection).getFullList({
        filter: `id="${id}"`,
      });
      setCurrentUser(response[0]);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Create a new event
  const createUser = useCallback(async (record) => {
    setError(null);

    try {
      const response = await pb.collection(eventsCollection).create(record);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Update an event
  const updateUser = useCallback(async (recordId, updatedData) => {
    setError(null);

    try {
      const response = await pb.collection(eventsCollection).update(recordId, updatedData);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Delete an event
  const deleteUser = useCallback(async (recordId) => {
    setError(null);

    try {
      await pb.collection(eventsCollection).delete(recordId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    users,
    currentUser,
    loadingUsers,
    errorUsers,
    fetchUsers,
    getCurrentUser,
    createUser,
    updateUser,
    deleteUser,
  };
};

export default usePocketbaseUsers;
