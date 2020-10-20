import { gql } from "@apollo/client";
import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import {
  Library_Sync_Statuses_Enum,
  MeSubscription,
  Stride_Event_Types_Enum,
  useInsertStrideEventMutation,
  useMeSubscription,
} from "../../generated/graphql";
import useLogin from "../../hooks/useLogin";

const _MeSubscription = gql`
  subscription Me {
    users {
      library_sync_status
      playlists(order_by: { spm: asc }) {
        spm
      }
    }
  }
`;

const _StrideEventMutation = gql`
  mutation InsertStrideEvent(
    $payload: jsonb!
    $type: stride_event_types_enum!
  ) {
    insert_stride_events(objects: { payload: $payload, type: $type }) {
      affected_rows
    }
  }
`;

function SimulatorPage() {
  let { loggedIn } = useLogin();
  let { data, loading } = useMeSubscription();
  if (!loggedIn) {
    return <Redirect to="/" />;
  }
  if (loading) {
    return <div>{loading}</div>;
  }
  if (!data?.users) {
    return <div>users is empty</div>;
  }
  let user = data.users[0];
  return (
    <div>
      <header>
        <h1>Stride Songs Simulator</h1>
        <p>
          <i>Simulate going on a run with Stride Songs</i>
        </p>
      </header>
      <main>
        {user.library_sync_status === Library_Sync_Statuses_Enum.Succeeded ? (
          <Simulator data={data} />
        ) : (
          <Syncing data={data} />
        )}
      </main>
    </div>
  );
}

function Syncing({ data }: { data: MeSubscription }) {
  let user = data.users[0];
  return <div>{user.library_sync_status}</div>;
}

function Simulator({ data }: { data: MeSubscription }) {
  let user = data.users[0];
  let [status, setStatus] = useState<"idle" | "running">("idle");
  let [mutation] = useInsertStrideEventMutation();

  function handleSubmitStartForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let spm = parseInt(
      ((event.target as HTMLFormElement).querySelector(
        "select"
      ) as HTMLSelectElement).value
    );
    mutation({
      variables: {
        payload: {
          spm,
        },
        type: Stride_Event_Types_Enum.Start,
      },
    });
    setStatus("running");
  }

  function handleSubmitUpdateForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let spm = parseInt(
      ((event.target as HTMLFormElement).querySelector(
        "select"
      ) as HTMLSelectElement).value
    );
    mutation({
      variables: {
        payload: {
          spm,
        },
        type: Stride_Event_Types_Enum.SpmUpdate,
      },
    });
  }

  switch (status) {
    case "idle":
      return (
        <form onSubmit={handleSubmitStartForm}>
          <label>
            start a run at the following strides per minute:
            <select name="spm">
              {user.playlists.map(({ spm }) => (
                <option key={spm} value={spm}>
                  {spm}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">start run</button>
        </form>
      );
    case "running":
      return (
        <form onSubmit={handleSubmitUpdateForm}>
          <label>
            update the strides per minute of your current run:
            <select name="spm">
              {user.playlists.map(({ spm }) => (
                <option key={spm} value={spm}>
                  {spm}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">update spm</button>
        </form>
      );
  }
}

export default SimulatorPage;
