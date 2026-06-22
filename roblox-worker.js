export default {
  async fetch(request) {
    const url = new URL(request.url);
    const universeId = url.searchParams.get("universeId");

    if (!universeId) {
      return new Response("Missing universeId", { status: 400 });
    }

    const gameRes = await fetch(
      `https://games.roblox.com/v1/games?universeIds=${universeId}`
    );

    const gameData = await gameRes.json();

    if (!gameData.data || !gameData.data[0]) {
      return new Response(JSON.stringify({ error: "No game data" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    const game = gameData.data[0];

    const thumbRes = await fetch(
      `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`
    );

    const thumbData = await thumbRes.json();

    const thumbnail = thumbData.data?.[0]?.imageUrl || null;

    return new Response(
      JSON.stringify({
        name: game.name,
        playing: game.playing,
        visits: game.visits,
        thumbnail
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
