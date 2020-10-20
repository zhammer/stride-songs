import React, { useMemo } from "react";
import { Redirect } from "react-router-dom";
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
    return <Redirect to="/simluation" />;
  }
  return (
    <div>
      <header>
        <h1>Stride Songs</h1>
        <p>
          <i>Sync your runs to your favorite spotify tracks.</i>
        </p>
      </header>
      <main>
        <a href={authUrl}>Log in with spotify</a>
      </main>
    </div>
  );
}
export default LandingPage;
