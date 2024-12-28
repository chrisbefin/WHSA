

export default function UserDataCard ({user}) {
    const full_name = `${user.first_name} ${user.middle_name} ${user.last_name}`;
    return (
        <div className="border rounded-lg p-4 border-gray-200 bg-gray-300 relative">
            <h1 className="text-2xl font-bold mb-4">User Data</h1>
            <ul className="space-y-4">
                <li key={user.id} className="border rounded-lg p-4 shadow-sm bg-white relative">
                <span className="absolute top-2 right-2 text-sm font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                <b>Event Count: </b>{user.num_events}
                </span>
                <h2 className="text-xl font-semibold">{full_name}</h2>
                <p className="text-sm">
                    <b>Preferred Name: </b> {user.preferred_name}
                </p>
                <p className="text-gray-700">
                    <b>Service: </b>{user.service}
                </p>
                <p className="text-sm">
                    <b>Grade: </b> {user.grade}
                </p>
                </li>
            </ul>
        </div>
    )
}