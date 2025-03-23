import { useState, useEffect, useCallback } from "react";
import pb from "lib/pocketbase";

const usePocketbaseAvailability = () => {
  const [userAvailability, setUserAvailability] = useState([]);
  const [eventAvailability, setEventAvailability] = useState("");
  const [availableAides, setAvailableAides] = useState([]);
  const [loadingAvailability, setLoading] = useState(false);
  const [errorAvailability, setError] = useState(null);
  const eventsCollection = "events";
  const availabilityCollection = "availability";
  const assignmentsCollection = "assignments";
  const viewUserEventsCollection = "viewUserEvents"

  // get a user's event availability
  const getUserAvailability = useCallback(async (userID) => {
    setError(null);

    try {
      pb.autoCancellation(false);
      const userAvailability = await pb.collection(availabilityCollection).getFullList({
        filter: `aide = "${userID}"`,
      });
      setUserAvailability(userAvailability);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // get all available aides for an event
  const getAvailableAides = useCallback(async (eventID) => {
    setError(null);

    try {
      pb.autoCancellation(false);
      const availableAides = await pb.collection(availabilityCollection).getFullList({
        filter: `event = "${eventID}" && availability = "Available"`,
        expand: 'aide'
      });
      // simply the returned list
      for (let i = 0; i < availableAides.length; i++) {
        availableAides[i] = availableAides[i].expand
      }
      setAvailableAides(availableAides);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // check a user's availability for a specific event
  const checkAvailability = useCallback(async (userId, eventId) => {
    setError(null);

    try {
        const record = await pb.collection(availabilityCollection).getFullList({
            filter: `aide="${userId}" && event="${eventId}"`,
          });
        if (record.length === 0) {
            setEventAvailability("UNKNOWN");
        } else {
            setEventAvailability(record[0].availability);
        }
    } catch(err) {
        setError(err)
        throw err;
    }
  }, []);

  // must handle both creating and updating availability
  const submitAvailability = useCallback(async (userId, eventId, availability) => {
    setError(null);
    try {
      // check for existence of availability record for the event
      const record = await pb.collection(availabilityCollection).getFullList({
        filter: `aide="${userId}" && event="${eventId}"`,
        sort:'availability',
    });

      const data = {
        "aide": userId,
        "event": eventId,
        "availability": availability
      };

      // record exists and we just need to update availability
      if (record.length > 0) {
        await pb.collection(availabilityCollection).update(record[0].id, data);
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
    userAvailability,
    eventAvailability,
    availableAides,
    getAvailableAides,
    submitAvailability,
    getUserAvailability,
    checkAvailability
  };
};

export default usePocketbaseAvailability;
