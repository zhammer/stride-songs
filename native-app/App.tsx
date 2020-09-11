import React, { useEffect } from "react";
import { Text, View, Button } from "react-native";
import tailwind from "tailwind-rn";
import useCountCycle, { decr } from "./src/hooks/useCountCycle";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import Constants from "expo-constants";

const NUM_RUN_EMOJIS = 5;

function range(count: number): number[] {
  return Array.from(Array(count).keys());
}

export default function App() {
  let [runnerPos] = useCountCycle(NUM_RUN_EMOJIS, { tickFunction: decr });
  let [request, response, promptAsync] = useAuthRequest(
    {
      clientId: Constants.manifest.extra.SPOTIFY_CLIENT_ID,
      scopes: [],
      usePKCE: false,
      redirectUri: makeRedirectUri({
        native: "stride-runner://auth",
      }),
    },
    {
      authorizationEndpoint: "https://accounts.spotify.com/authorize",
      tokenEndpoint:
        Constants.manifest.extra.API_BASE_URL + "/spotify/api/token",
    }
  );

  useEffect(() => {
    if (response?.type === "success") {
      console.log(response.params);
    }
  }, [response]);

  return (
    <View style={tailwind("h-full items-center p-12 pt-40")}>
      <Text style={tailwind("text-gray-700 text-5xl")}>Stride Songs</Text>
      <Text style={tailwind("text-2xl pt-5")}>
        {range(NUM_RUN_EMOJIS).map((i) => (i === runnerPos ? "🏃🏽‍♀" : "🎵"))}
      </Text>
      <Text style={tailwind("text-gray-600 text-2xl p-5")}>
        Sync your runs to your favorite Spotify songs.
      </Text>
      <Button
        title="Login with Spotify"
        onPress={() => promptAsync()}
        disabled={!request}
      />
    </View>
  );
}
