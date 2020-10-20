import React, { useEffect } from "react";
import { gql } from "@apollo/client";
import { Redirect, useLocation } from "react-router-dom";
import { useLoginMutation } from "../generated/graphql";
import { IS_LOGGED_IN } from "../apolloClient";
import useLogin from "../hooks/useLogin";

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
  let { loggedIn } = useLogin();
  let location = useLocation();
  let code = new URLSearchParams(location.search).get("code");
  if (loggedIn) {
    return <Redirect to="/simulation" />;
  }
  if (!code) {
    return <Redirect to="/" />;
  }
  return <LoginComponent code={code} />;
}

function LoginComponent({ code }: { code: string }) {
  let [mutation, { data, loading, error, called, client }] = useLoginMutation({
    variables: { spotify_authorization_code: code },
    onError: (error) => {
      alert(error.message);
    },
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

  if (error) {
    return <div>{error.message}</div>;
  }
  if (loading) {
    return <div>loading...</div>;
  }
  if (data) {
    return <Redirect to="/simluation" />;
  }
  return <div></div>;
}

export default CallbackPage;
