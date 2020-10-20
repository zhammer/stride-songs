import { useIsUserLoggedInQuery } from "../generated/graphql";

function useLogin() {
  let { data } = useIsUserLoggedInQuery();
  if (!data) {
    throw new Error(
      "userIsLoggedInQuery should never be null, it lives in client state"
    );
  }
  return {
    loggedIn: data.isLoggedIn,
  };
}

export default useLogin;
