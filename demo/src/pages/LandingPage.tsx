import React, { useMemo } from "react";
import { Redirect } from "react-router-dom";
import { MusicEmoji, RunnerEmoji } from "../components/Emojis";
import { Header, Main, Page } from "../components/Layout";
import useLogin from "../hooks/useLogin";

function makeAuthUrl(): string {
  let url = new URL("https://accounts.spotify.com/authorize");
  let params: { [key: string]: string } = {
    client_id: process.env.REACT_APP_STRIDE_SONGS_CLIENT_ID as string,
    response_type: "code",
    redirect_uri: process.env.REACT_APP_REDIRECT_URI as string,
    scope: [
      "playlist-modify-private",
      "playlist-modify-public",
      "user-library-read",
      "user-modify-playback-state",
      "user-read-email",
      "user-read-playback-state",
      "user-read-private",
      "user-read-recently-played",
    ].join(" "),
  };
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
}

function LandingPage() {
  let { loggedIn } = useLogin();
  const authUrl = useMemo(makeAuthUrl, []);
  if (loggedIn) {
    return <Redirect to="/simulation" />;
  }
  return (
    <Page>
      <Header
        title={
          <>
            Stride Songs <RunnerEmoji />
            <MusicEmoji />
          </>
        }
        subtitle={
          <>
            Sync your runs to your favorite{" "}
            <span className="text-green-500">Spotify</span> tracks
          </>
        }
      />
      <Main>
        <a
          className="bg-green-500 hover:bg-green-700 text-white rounded py-1 px-2"
          href={authUrl}
        >
          Log in with spotify
        </a>
      </Main>
    </Page>
  );
}
export default LandingPage;
