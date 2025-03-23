

export default function UserDataCard ({user}) {
    const full_name = `${user.first_name} ${user.middle_name} ${user.last_name}`;
    return (
            <>
            <h1 className="text-2xl font-bold mb-4">{full_name}</h1>
            <span className="absolute top-2 right-2 text-lg font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                <b>Event Count: </b>{user.num_events}
            </span>
            <ul className="space-y-4">
                <li key={user.id} className="bg-white relative">
                <p className="text-xl">
                    <b>Preferred Name: </b> {user.preferred_name}
                </p>
                <p className="text-xl">
                    <b>Service: </b>{user.service}
                </p>
                <p className="text-xl">
                    <b>Grade: </b> {user.grade}
                </p>
                </li>
            </ul>
            </>
    )
}