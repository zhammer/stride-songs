import React from "react";
import { Redirect } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

function SimulatorPage() {
  let { loggedIn } = useLogin();
  if (!loggedIn) {
    return <Redirect to="/" />;
  }
  return <div>simulator</div>;
}

export default SimulatorPage;
