import { useState, useEffect, useCallback } from "react";
import pb from "lib/pocketbase";

const usePocketbaseUsers = () => {
  const [events, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const eventsCollection = "events";

  const fetchEvents = useCallback(async (query = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await pb.collection(eventsCollection).getFullList(query);
      setEvents(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Find upcoming events
  const queryFutureEvents = useCallback(async (record) => {
    setError(null);

    try {
      const response = await pb.collection(eventsCollection).create(record);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Create a new event
  const createEvent = useCallback(async (record) => {
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
  const updateEvent = useCallback(async (recordId, updatedData) => {
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
  const deleteEvent = useCallback(async (collectionName, recordId) => {
    setError(null);

    try {
      await pb.collection(collectionName).delete(recordId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    queryFutureEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};

export default usePocketbaseEvents;
