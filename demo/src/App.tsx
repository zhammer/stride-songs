import React from "react";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CallbackPage from "./pages/CallbackPage";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/callback">
          <CallbackPage />
        </Route>
        <Route path="/">
          <LandingPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
