import { useState, useEffect, useCallback } from "react";
import pb from "lib/pocketbase";

const usePocketbaseAssignments = () => {
  const [userAvailability, setUserAvailability] = useState([]);
  const [eventAvailability, setEventAvailability] = useState("");
  const [loadingAvailability, setLoading] = useState(false);
  const [errorAvailability, setError] = useState(null);
  const [serviceAvailability, setServiceAvailability] = useState(null);
  const [numAssignedAides, setNumAssignedAides] = useState(0);
  const [assignedAides, setAssignedAides] = useState(null);
  const [isAssigned, setIsAssigned] = useState(null);
  const eventsCollection = "events";
  const availabilityCollection = "availability";
  const assignmentsCollection = "assignments";
  const viewUserEventsCollection = "viewUserEvents"

  // get aides assigned to the event
  const getAssignedAides = useCallback(async (eventId) => {
    setError(null);

    try {
      pb.autoCancellation(false);
      const assignedAides = await pb.collection(assignmentsCollection).getFullList({
        filter: `event="${eventId}"`,
        expand: 'aide'
      });
      // simply the returned list
      for (let i = 0; i < assignedAides.length; i++) {
        assignedAides[i] = assignedAides[i].expand
      }
      setNumAssignedAides(assignedAides.length);
      setAssignedAides(assignedAides);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // get availability by service
  const getServiceAvailability = useCallback(async (eventId) => {
    setError(null);

    try {
      pb.autoCancellation(false);
      const availability = await pb.collection(availabilityCollection).getFullList({
        filter: `event="${eventId}"`,
        sort:'aide.service'
      });
      setServiceAvailability(availability);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // check if a user is assigned to an event
  const getIsAssigned = useCallback(async (userId, eventId) => {
    setError(null);

    try {
      pb.autoCancellation(false);
      const assignment = await pb.collection(assignmentsCollection).getFullList({
        filter: `event="${eventId}" && aide="${userId}"`
      });
      if (assignment.length > 0) {
        setIsAssigned(true);
      }
      else {
        setIsAssigned(false);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // assign a user to an event
  const submitAssignment = useCallback(async (userId, eventId, assignment) => {
    setError(null);
    try {
      // check for existence of assignment record for the event
      const record = await pb.collection(assignmentsCollection).getFullList({
        filter: `aide="${userId}" && event="${eventId}"`,
    });
    if (assignment === "unassign") {
      // delete the assignment if unassigning
      await pb.collection('assignments').delete(record[0].id);
      return;
    }

    // otherwise assign the aide
    const data = {
      "aide": userId,
      "event": eventId,
      // hard code role as default for now, future to do
      // "role": [ "0gz4la9ox4094an" ],
      "no_show": false
    };
    // record exists, do nothing
    if (record.length > 0) {
      return;
    }
    // record does not exist and must be created
    else {
      await pb.collection(assignmentsCollection).create(data);
    }
    } catch(err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    assignedAides,
    numAssignedAides,
    isAssigned,
    getAssignedAides,
    serviceAvailability,
    getIsAssigned,
    submitAssignment    
  };
};

export default usePocketbaseAssignments;
