
export function isValidGameId(gameId: string) {
    const regex = /^[a-zA-Z0-9]{8}$/;
    return regex.test(gameId);
}