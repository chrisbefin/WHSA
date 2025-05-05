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
      pb.autoCancellation(false);
      const response = await pb.collection(usersCollection).getFullList({
        filter: `id="${id}"`,
      });
      setCurrentUser(response[0]);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Create a new user
  const createNewUserAccount = useCallback(async (record) => {
    setError(null);
    console.log(record)
    const DOB = new Date(record.date_of_birth).toISOString();
    console.log(DOB)
    const data = {
      "password": record.password,
      "passwordConfirm": record.confirm_password,
      "email": record.personal_email,
      "emailVisibility": false,
      "first_name": record.first_name,
      "middle_name": record.middle_name,
      "preferred_name": record.preferred_name,
      "last_name": record.last_name,
      "cell_phone": record.cell_phone,
      "grade": record.grade,
      "service": record.service,
      "service_email": record.service_email,
      "DOB": DOB
    };
    try {
      const record = await pb.collection(usersCollection).create(data);
      return record;
    } catch (err) {
      setError(err.message);
      throw err;
    } 
  }, []);

  // Update a user
  const updateUser = useCallback(async (recordId, updatedData) => {
    setError(null);

    try {
      const response = await pb.collection(usersCollection).update(recordId, updatedData);
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
    createNewUserAccount,
    updateUser,
    deleteUser,
  };
};

export default usePocketbaseUsers;
