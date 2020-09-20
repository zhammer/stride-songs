/* global cy */
/// <reference types="cypress" />
import { Given, Then, When } from "cypress-cucumber-preprocessor/steps";
import { request, gql } from "graphql-request";

const HASURA_URL = "http://127.0.0.1:8080/v1/graphql";

beforeEach(() => {
  // todo: clear db
});

Given("the following users exist", async (table) => {
  let query = gql`
    mutation AddUsers($users: [users_insert_input!]!) {
      insert_users(objects: $users) {
        affected_rows
      }
    }
  `;
  let users = table.hashes();
  let response = await request(HASURA_URL, query, {
    users,
  });
});

When(
  `I add refresh token {string} to user {int}`,
  async (refreshToken, userId) => {
    let query = gql`
      mutation AddRefreshToken($userId: Int!, $refreshToken: String!) {
        update_users_by_pk(
          pk_columns: { id: $userId }
          _set: { spotify_refresh_token: $refreshToken }
        ) {
          id
        }
      }
    `;
    let response = await request(HASURA_URL, query, { refreshToken, userId });
  }
);

Then(`the following playlists exist for user {int}`, async (userID) => {});

Then(
  `the following spotify playlists exist for user {string}`,
  async (userID) => {}
);
