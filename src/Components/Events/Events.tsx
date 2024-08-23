import React, { useEffect, useState } from "react";

interface Discipline {
  id: number;
  name: string;
}

interface Arena {
  id: number;
  name: string;
  disciplines: Discipline[];
}

interface Event {
  id: number;
  participantGender: string;
  participantAgeGroup: string;
  maximumParticipants: number;
  date: string;
  startTime: string;
  durationMinutes: number;
  arena: Arena;
  discipline: Discipline;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("all");
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [showUpdateForm, setShowUpdateForm] = useState<number | null>(null); // Track which event is being updated
  const [arenas, setArenas] = useState<Arena[]>([]);
  const [newEvent, setNewEvent] = useState({
    participantGender: "",
    participantAgeGroup: "",
    maxParticipants: "",
    date: "",
    startTime: "",
    durationMinutes: "",
    arenaId: "",
    disciplineId: "",
  });

  const [updateEventData, setUpdateEventData] = useState<Event | null>(null);

  const fetchEvents = (discipline: string) => {
    const encodedDiscipline = encodeURIComponent(discipline);
    fetch(
      `http://localhost:8080/events/by-discipline?discipline=${encodedDiscipline}`
    )
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  };

  const fetchArenas = () => {
    fetch("http://localhost:8080/arenas")
      .then((response) => response.json())
      .then((data) => setArenas(data))
      .catch((error) => console.error("Error fetching arenas:", error));
  };

  useEffect(() => {
    fetchEvents("all");
    fetchArenas();
  }, []);

  const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const discipline = e.target.value;
    setSelectedDiscipline(discipline);
    fetchEvents(discipline);
  };

  const deleteEvent = (eventId: number) => {
    fetch(`http://localhost:8080/events/${eventId}`, { method: "DELETE" })
      .then((response) => {
        if (response.ok) {
          fetchEvents(selectedDiscipline);
        } else {
          console.error("Failed to delete event");
        }
      })
      .catch((error) => console.error("Error deleting event:", error));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = () => {
    const {
      participantGender,
      participantAgeGroup,
      maxParticipants,
      date,
      startTime,
      durationMinutes,
      arenaId,
      disciplineId,
    } = newEvent;

    // Validation check
    if (
      !participantGender ||
      !participantAgeGroup ||
      !maxParticipants ||
      !date ||
      !startTime ||
      !durationMinutes ||
      !arenaId ||
      !disciplineId
    ) {
      alert("Please fill out all fields.");
      return;
    }

    fetch("http://localhost:8080/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        participantGender,
        participantAgeGroup,
        maxParticipants: parseInt(maxParticipants),
        date,
        startTime,
        durationMinutes: parseInt(durationMinutes),
        arenaId: parseInt(arenaId),
        disciplineId: parseInt(disciplineId),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create event");
        }
        // Refresh events after creating
        fetchEvents(selectedDiscipline);
        // Hide the form and reset inputs
        setShowCreateForm(false);
        setNewEvent({
          participantGender: "",
          participantAgeGroup: "",
          maxParticipants: "",
          date: "",
          startTime: "",
          durationMinutes: "",
          arenaId: "",
          disciplineId: "",
        });
      })
      .catch((error) => console.error("Error creating event:", error));
  };

  const handleUpdateClick = (event: Event) => {
    setShowUpdateForm(event.id);
    setUpdateEventData(event);
  };

  const handleUpdateInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (updateEventData) {
      setUpdateEventData({
        ...updateEventData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleUpdateSubmit = () => {
    if (updateEventData) {
      const updateData = {
        participantGender: updateEventData.participantGender,
        participantAgeGroup: updateEventData.participantAgeGroup,
        maxParticipants: updateEventData.maximumParticipants,
        date: updateEventData.date,
        startTime: updateEventData.startTime,
        durationMinutes: updateEventData.durationMinutes,
        arenaId: updateEventData.arena.id,
        disciplineId: updateEventData.discipline.id,
      };

      fetch(`http://localhost:8080/events/${updateEventData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })
        .then((response) => {
          if (response.ok) {
            fetchEvents(selectedDiscipline);
            setShowUpdateForm(null); // Clear form after update
          } else {
            console.error("Failed to update event");
          }
        })
        .catch((error) => console.error("Error updating event:", error));
    }
  };

  return (
    <div>
      <h1>Events</h1>
      <div>
        <label htmlFor="disciplineFilter">Filter by Discipline:</label>
        <select
          id="disciplineFilter"
          value={selectedDiscipline}
          onChange={handleDisciplineChange}
        >
          <option value="all">All</option>
          <option value="100m Run">100m Run</option>
          <option value="1500m Run">1500m Run</option>
          <option value="400m Hurdles">400m Hurdles</option>
          <option value="Long Jump">Long Jump</option>
          <option value="High Jump">High Jump</option>
          <option value="Shot Put">Shot Put</option>
          <option value="50m Butterfly">50m Butterfly</option>
          <option value="100m Breaststroke">100m Breaststroke</option>
          <option value="200m Freestyle">200m Freestyle</option>
        </select>
      </div>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ padding: "1px 2px", textAlign: "left" }}>Date</th>
            <th style={{ padding: "1px 2px", textAlign: "left" }}>
              Start Time
            </th>
            <th style={{ padding: "1px 2px", textAlign: "left" }}>Duration</th>
            <th style={{ padding: "1px 2px", textAlign: "left" }}>Arena</th>
            <th style={{ padding: "1px 2px", textAlign: "left" }}>
              Discipline
            </th>
            <th style={{ padding: "1px 2px", textAlign: "left" }}>Gender</th>
            <th style={{ padding: "1px 2px", textAlign: "left" }}>Age Group</th>
            <th style={{ padding: "1px 2px", textAlign: "left" }}>
              Max Participants
            </th>
            <th style={{ padding: "1px 2px", textAlign: "left" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td style={{ padding: "1px 2px", textAlign: "left" }}>
                {event.date}
              </td>
              <td style={{ padding: "1px 2px", textAlign: "left" }}>
                {event.startTime}
              </td>
              <td style={{ padding: "1px 2px", textAlign: "left" }}>
                {event.durationMinutes}
              </td>
              <td style={{ padding: "1px 2px", textAlign: "left" }}>
                {event.arena.name}
              </td>
              <td style={{ padding: "1px 2px", textAlign: "left" }}>
                {event.discipline.name}
              </td>
              <td style={{ padding: "1px 2px", textAlign: "left" }}>
                {event.participantGender}
              </td>
              <td style={{ padding: "1px 2px", textAlign: "left" }}>
                {event.participantAgeGroup}
              </td>
              <td style={{ padding: "1px 2px", textAlign: "left" }}>
                {event.maximumParticipants}
              </td>
              <td style={{ padding: "1px 2px", textAlign: "left" }}>
                <a href="#" onClick={() => deleteEvent(event.id)}>
                  Delete
                </a>{" "}
                |{" "}
                <a href="#" onClick={() => handleUpdateClick(event)}>
                  Update
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "20px" }}>
        <a href="#" onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? "Cancel" : "Create event"}
        </a>
      </div>

      {showCreateForm && (
        <div style={{ marginTop: "20px" }}>
          <div>
            <label>Arena: </label>
            <select
              name="arenaId"
              value={newEvent.arenaId}
              onChange={handleInputChange}
            >
              <option value="">Select Arena</option>
              {arenas.map((arena) => (
                <option key={arena.id} value={arena.id}>
                  {arena.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Discipline: </label>
            <select
              name="disciplineId"
              value={newEvent.disciplineId}
              onChange={handleInputChange}
            >
              <option value="">Select Discipline</option>
              {arenas
                .find((arena) => arena.id === parseInt(newEvent.arenaId))
                ?.disciplines.map((discipline) => (
                  <option key={discipline.id} value={discipline.id}>
                    {discipline.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label>Gender: </label>
            <select
              name="participantGender"
              value={newEvent.participantGender}
              onChange={handleInputChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label>Age Group: </label>
            <select
              name="participantAgeGroup"
              value={newEvent.participantAgeGroup}
              onChange={handleInputChange}
            >
              <option value="">Select Age Group</option>
              <option value="Junior">Junior</option>
              <option value="Adult">Adult</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
          <div>
            <label>Max Participants: </label>
            <input
              type="number"
              name="maxParticipants"
              value={newEvent.maxParticipants}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Date: </label>
            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Start Time: </label>
            <input
              type="time"
              name="startTime"
              value={newEvent.startTime}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Duration (minutes): </label>
            <input
              type="number"
              name="durationMinutes"
              value={newEvent.durationMinutes}
              onChange={handleInputChange}
            />
          </div>
          <a href="#" onClick={handleCreateEvent}>
            Create
          </a>
        </div>
      )}

      {showUpdateForm && updateEventData && (
        <div style={{ marginTop: "20px" }}>
          <div>
            <label>Arena: </label>
            <select
              name="arenaId"
              value={updateEventData.arena.id}
              onChange={handleUpdateInputChange}
            >
              <option value="">Select Arena</option>
              {arenas.map((arena) => (
                <option key={arena.id} value={arena.id}>
                  {arena.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Discipline: </label>
            <select
              name="disciplineId"
              value={updateEventData.discipline.id}
              onChange={handleUpdateInputChange}
            >
              <option value="">Select Discipline</option>
              {arenas
                .find((arena) => arena.id === updateEventData.arena.id)
                ?.disciplines.map((discipline) => (
                  <option key={discipline.id} value={discipline.id}>
                    {discipline.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label>Gender: </label>
            <select
              name="participantGender"
              value={updateEventData.participantGender}
              onChange={handleUpdateInputChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div>
            <label>Age Group: </label>
            <select
              name="participantAgeGroup"
              value={updateEventData.participantAgeGroup}
              onChange={handleUpdateInputChange}
            >
              <option value="Junior">Junior</option>
              <option value="Adult">Adult</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
          <div>
            <label>Date: </label>
            <input
              type="date"
              name="date"
              value={updateEventData.date}
              onChange={handleUpdateInputChange}
            />
          </div>
          <div>
            <label>Start Time: </label>
            <input
              type="time"
              name="startTime"
              value={updateEventData.startTime}
              onChange={handleUpdateInputChange}
            />
          </div>
          <div>
            <label>Duration (minutes): </label>
            <input
              type="number"
              name="durationMinutes"
              value={updateEventData.durationMinutes}
              onChange={handleUpdateInputChange}
            />
          </div>
          <div>
            <label>Max Participants: </label>
            <input
              type="number"
              name="maximumParticipants"
              value={updateEventData.maximumParticipants}
              onChange={handleUpdateInputChange}
            />
          </div>
          <a href="#" onClick={handleUpdateSubmit}>
            Update Event
          </a>
        </div>
      )}
    </div>
  );
};

export default Events;
