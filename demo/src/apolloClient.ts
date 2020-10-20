import {
  ApolloClient,
  createHttpLink,
  gql,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

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

const httpLink = createHttpLink({ uri: "http://localhost:8080/v1/graphql" });
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
  link: authLink.concat(httpLink),
  cache: cache,
  typeDefs,
});

export default client;
