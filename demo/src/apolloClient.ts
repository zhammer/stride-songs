import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }
`;
export const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_HASURA_ENDPOINT_HTTP as string,
});
const wsLink = new WebSocketLink({
  uri: process.env.REACT_APP_HASURA_ENDPOINT_WS as string,
  options: {
    reconnect: true,
    // VERY important that lazy=true (connects only when first subscription created,
    // and delay the socket initialization). we only want to initialize the websocket
    // link _once_ we've logged the user in.
    // https://github.com/apollographql/subscriptions-transport-ws/issues/171
    lazy: true,
    connectionParams: () => {
      // get the authentication token from local storage if it exists
      const token = localStorage.getItem("token");
      // return the headers to the context so httpLink can read them
      return {
        headers: {
          authorization: token ? `Bearer ${token}` : "",
        },
      };
    },
  },
});
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
const cache = new InMemoryCache();
cache.writeQuery({
  query: IS_LOGGED_IN,
  data: {
    isLoggedIn: !!localStorage.getItem("token"),
  },
});

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: cache,
  typeDefs,
});

export default client;
