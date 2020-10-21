import React, { useEffect } from "react";
import { gql } from "@apollo/client";
import { Link, Redirect, useLocation } from "react-router-dom";
import { useLoginMutation } from "../generated/graphql";
import { IS_LOGGED_IN } from "../apolloClient";
import { Header, Page } from "../components/Layout";

const _LoginMutation = gql`
  mutation Login($spotify_authorization_code: String!) {
    DemoLogIn(
      args: { spotify_authorization_code: $spotify_authorization_code }
    ) {
      access_token
    }
  }
`;

function CallbackPage() {
  let location = useLocation();
  let code = new URLSearchParams(location.search).get("code");
  if (!code) {
    return <Redirect to="/" />;
  }
  return <LoginComponent code={code} />;
}

function LoginComponent({ code }: { code: string }) {
  let [mutation, { data, loading, error, called, client }] = useLoginMutation({
    variables: { spotify_authorization_code: code },
    onError: () => {},
    onCompleted: (data) => {
      if (data && data.DemoLogIn) {
        localStorage.setItem("token", data.DemoLogIn.access_token);
        client.writeQuery({ query: IS_LOGGED_IN, data: { isLoggedIn: true } });
      }
    },
  });
  useEffect(() => {
    if (!called) {
      mutation();
    }
  }, [mutation, called]);

  if (data?.DemoLogIn?.access_token) {
    return <Redirect to="/simulation" />;
  }
  return (
    <Page>
      {loading && (
        <Header
          title={
            <div className="flex">
              Logging in...<div className="animate-bounce"> 🏃🎶</div>
            </div>
          }
          subtitle={<>Please wait while we log you into stride songs</>}
        />
      )}
      {error && (
        <Header
          title={
            <div className="flex">
              Error logging in!<div className="animate-pulse"> 🏃🎶</div>
            </div>
          }
          subtitle={
            <span className="text-red-500">
              {error.message}{" "}
              <Link className="underline" to="/">
                (try again?)
              </Link>
            </span>
          }
        />
      )}
    </Page>
  );
}

export default CallbackPage;
