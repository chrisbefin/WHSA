

export default function UpcomingEventsCard ({events}) {
    if (events.length > 3) {
        events = events.slice(0, 3);
    }
    return (
        <div className="border rounded-lg p-4 border-gray-200 bg-gray-300">
            <h1 className="text-2xl font-bold mb-4">Upcoming Events</h1>
            {events.length > 0 ? (
            <ul className="space-y-4">
            {events.map((event) => (
                <li key={event.id} className="border rounded-lg p-4 shadow-sm bg-white">
                <h2 className="text-xl font-semibold">{event.event_title}</h2>
                <p className="text-gray-700">
                    <b>Location: </b>{event.location}
                </p>
                <p className="text-sm">
                    <b>Date: </b> {new Date(event.start_time).toLocaleDateString()}
                </p>
                <p className="text-sm">
                    <b>Start Time: </b> {new Date(event.start_time).toLocaleTimeString()}
                </p>
                <p className="text-sm">
                    <b>Uniform: </b> {event.uniform}
                </p>
                </li>
            ))}
            </ul>
            ) : (
                <p>No events available at the moment.</p>
            )}
        </div>
    )
}