import React, { useEffect, useState } from "react";

interface Discipline {
  id: number;
  name: string;
}

interface Arena {
  name: string;
  type: string;
  shape: string;
  surface: string;
  length: number;
  lanes: number;
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

  const fetchEvents = (discipline: string) => {
    const encodedDiscipline = encodeURIComponent(discipline);
    fetch(
      `http://localhost:8080/events/by-discipline?discipline=${encodedDiscipline}`
    )
      .then((response) => response.json())
      .then((data) => setEvents(data))
      .catch((error) => console.error("Error fetching events:", error));
  };

  useEffect(() => {
    fetchEvents("all");
  }, []);

  const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const discipline = e.target.value;
    setSelectedDiscipline(discipline);
    fetchEvents(discipline);
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Events;
