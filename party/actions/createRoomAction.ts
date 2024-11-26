import GameServer from "party";

export default function createRoomAction(server: GameServer): Response {
    // Access server attributes if needed
    console.log(`Creating room: ${server.room.id}`);
    return new Response(`Room '${server.room.id}' created successfully`, { status: 201 });
}