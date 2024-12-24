import { useState, useEffect, useCallback } from "react";
import pb from "lib/pocketbase";

const usePocketbaseEvents = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const eventsCollection = "events";

  const fetchEvents = useCallback(async (query = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await pb.collection(eventsCollection).getFullList(query);
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new record in a specific collection
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

  // Update an existing record in a specific collection
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

  // Delete a record from a specific collection
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
    data,
    loading,
    error,
    fetchEvents,
    createEvents,
    updateEvent,
    deleteEvent,
  };
};

export default usePocketbaseEvents;
