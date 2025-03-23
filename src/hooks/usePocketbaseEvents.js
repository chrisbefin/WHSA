import { useState, useEffect, useCallback } from "react";
import pb from "lib/pocketbase";

const usePocketbaseEvents = () => {
  const [events, setEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loadingEvents, setLoading] = useState(false);
  const [errorEvents, setError] = useState(null);
  const [futureEvents, setFutureEvents] = useState([]);
  const eventsCollection = "events";
  const availabilityCollection = "availability";
  const assignmentsCollection = "assignments";
  const viewUserEventsCollection = "viewUserEvents"

  // get all events
  const fetchEvents = useCallback(async (query = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await pb.collection(eventsCollection).getFullList();
      setEvents(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Find upcoming events
  const getFutureEvents = useCallback(async () => {
    setError(null);

    try {
      pb.autoCancellation(false);
      const response = await pb.collection(eventsCollection).getFullList({
        filter:'start_time>@now',
        sort:'start_time',
      });
      setFutureEvents(response);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // get a user's events
  const getUserEvents = useCallback(async (userID) => {
    setError(null);

    try {
      pb.autoCancellation(false);
      const userEvents = await pb.collection(viewUserEventsCollection).getFullList({
        filter: `aide = "${userID}"`,
      });
      setUserEvents(userEvents);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Create a new event
  const createEvent = useCallback(async (title, startTime, endTime, notes, numAides, numGuests, uniform, location) => {
    setError(null);
    startTime = new Date(startTime).toISOString();
    endTime = new Date(endTime).toISOString();;
    const data = {
      "event_title": title,
      "start_time": startTime,
      "end_time": endTime,
      "num_guests": numGuests,
      "num_required_aides": numAides,
      "location": location,
      "uniform": uniform,
      "notes": notes
    };
    try {
      const response = await pb.collection(eventsCollection).create(data);
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
  const deleteEvent = useCallback(async (recordId) => {
    setError(null);

    try {
      await pb.collection(eventsCollection).delete(recordId);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // must handle both creating and updating availability
  const submitAvailability = useCallback(async (userId, eventId, availability) => {
    setError(null);

    try {
      // check for existence of availability record for the event
      const record = await pb.collection(availabilityCollection).getFirstListItem(`aide=${userId} && event=${eventId}`);

      const data = {
        "aide": userId,
        "event": eventId,
        "availability": availability
      };

      // record exists and we just need to update availability
      if (record.length > 0) {
        pb.collection(availabilityCollection).update(record.id, data);
      }
      // record does not exist and must be created
      else {
        await pb.collection(availabilityCollection).create(data);
      }
    } catch(err) {
      setError(err.message);
      throw err;
    }
  }, []);


  return {
    events,
    userEvents,
    futureEvents,
    loadingEvents,
    errorEvents,
    fetchEvents,
    getFutureEvents,
    getUserEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};

export default usePocketbaseEvents;
