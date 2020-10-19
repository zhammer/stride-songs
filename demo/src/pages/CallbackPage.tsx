import React from "react";
import { useLocation } from "react-router-dom";

function CallbackPage() {
  let location = useLocation();
  let code = new URLSearchParams(location.search).get("code");
  // graphql Login request
  return <div>{code}</div>;
}

export default CallbackPage;
