import React from "react";
import LandingPage from "./pages/LandingPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CallbackPage from "./pages/CallbackPage";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

function App() {
  return (
    <ApolloProvider client={client}>
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
    </ApolloProvider>
  );
}

export default App;
