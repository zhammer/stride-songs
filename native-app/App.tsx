import React, { useEffect, useState } from "react";
import { Text, View, Button, Alert } from "react-native";
import tailwind from "tailwind-rn";

function range(count: number): number[] {
  return Array.from(Array(count).keys());
}

function useInterval(callback: Function, delay: number) {
  useEffect(() => {
    let interval = setInterval(callback, delay);
    return () => clearInterval(interval);
  }, [callback, delay]);
}

export default function App() {
  let [ticks, setTicks] = useState(0);
  useInterval(() => setTicks((ticks) => ticks + 1), 1e3);

  function handleLoginButtonPressed() {
    Alert.alert("huzzah!");
  }

  return (
    <View style={tailwind("h-full items-center p-12 pt-40")}>
      <Text style={tailwind("text-gray-700 text-5xl")}>Stride Songs</Text>
      <Text style={tailwind("text-2xl pt-5")}>
        {range(5).map((i) => ((ticks + i) % 5 ? "🎵" : "🏃🏽‍♀️"))}
      </Text>
      <Text style={tailwind("text-gray-600 text-2xl p-5")}>
        Sync your runs to your favorite Spotify songs.
      </Text>
      <Button title="Login with Spotify" onPress={handleLoginButtonPressed} />
    </View>
  );
}
