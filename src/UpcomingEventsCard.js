

export default function UpcomingEventsCard ({events}) {
    if (events.length > 3) {
        events = events.slice(0, 3);
    }
    return (
            <>
            <h1 className="px-4 py-2 text-2xl font-bold mb-4">Upcoming Events</h1>
            {events.length > 0 ? (
            <ul className="space-y-4">
            {events.map((event) => (
                <li key={event.id} className="border rounded-lg p-2 bg-white">
                <h2 className="text-xl font-semibold">{event.event_title}</h2>
                <p className="text-sm">
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
            </>
            // <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
            //     <p className="mt-2 text-lg font-medium tracking-tight text-gray-950 max-lg:text-center">
            //     Mobile friendly
            //     </p>
            //     <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
            //     Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
            //     </p>
            // </div>
    )

}