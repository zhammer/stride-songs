import React from "react";
import { Text, View, Button, Alert } from "react-native";
import * as Linking from "expo-linking";
import tailwind from "tailwind-rn";
import useCountCycle, { decr } from "./src/hooks/useCountCycle";

const NUM_RUN_EMOJIS = 5;

function range(count: number): number[] {
  return Array.from(Array(count).keys());
}

export default function App() {
  let [runnerPos] = useCountCycle(NUM_RUN_EMOJIS, { tickFunction: decr });

  function handleLoginButtonPressed() {
    Alert.alert("huzzah!");
  }

  return (
    <View style={tailwind("h-full items-center p-12 pt-40")}>
      <Text style={tailwind("text-gray-700 text-5xl")}>Stride Songs</Text>
      <Text style={tailwind("text-2xl pt-5")}>
        {range(NUM_RUN_EMOJIS).map((i) => (i === runnerPos ? "🏃🏽‍♀" : "🎵"))}
      </Text>
      <Text style={tailwind("text-gray-600 text-2xl p-5")}>
        Sync your runs to your favorite Spotify songs.
      </Text>
      <Button title="Login with Spotify" onPress={handleLoginButtonPressed} />
      <Text>auth redirect url: {Linking.makeUrl()}</Text>
    </View>
  );
}
