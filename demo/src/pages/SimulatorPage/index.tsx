import { gql } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import Alert from "../../components/Alert";
import { Header, Main } from "../../components/Layout";
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
  let { data } = useMeSubscription();
  if (!loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <div>
      <Header
        title={
          <>
            Stride Songs{" "}
            <span className="italic text-blue-500 animate-pulse">
              Simulator
            </span>
          </>
        }
        subtitle={
          <>
            Until the Stride Songs native application (which will automatically
            detect changes in your strides per minute) is out, you can use this
            simulator to manually sync your runs to your Spotify library.
          </>
        }
      />
      <Main>
        {data?.users.length === 1 && (
          <>
            <Syncing data={data} />
            {data.users[0].library_sync_status ===
              Library_Sync_Statuses_Enum.Succeeded && <Simulator data={data} />}
          </>
        )}
      </Main>
    </div>
  );
}

function description(status: Library_Sync_Statuses_Enum): string {
  switch (status) {
    case Library_Sync_Statuses_Enum.CreatingPlaylists:
      return "Creating empty playlists at common running strides per minute";
    case Library_Sync_Statuses_Enum.ScanningLibrary:
      return "Scanning your library for songs at desired strides per minute";
    case Library_Sync_Statuses_Enum.AddingTracks:
      return "Adding your tracks to designated playlists";
    case Library_Sync_Statuses_Enum.Succeeded:
      return "Stride songs is ready to sync your runs to your library";
    default:
      return "";
  }
}
const librarySyncStages: Library_Sync_Statuses_Enum[] = [
  Library_Sync_Statuses_Enum.CreatingPlaylists,
  Library_Sync_Statuses_Enum.ScanningLibrary,
  Library_Sync_Statuses_Enum.AddingTracks,
  Library_Sync_Statuses_Enum.Succeeded,
];

function determineProgress(
  progressIndex: number,
  elementIndex: number,
  total: number
): "done" | "active" | "pending" {
  let compare = progressIndex - elementIndex;
  if (compare < 0) {
    return "pending";
  } else if (compare === 0) {
    if (elementIndex === total - 1) {
      return "done";
    }
    return "active";
  } else {
    return "done";
  }
}

function Syncing({ data }: { data: MeSubscription }) {
  let user = data.users[0];
  let stageIndex = librarySyncStages.findIndex(
    (status) => status === user.library_sync_status
  );
  return (
    <ul>
      {librarySyncStages.map((stage, index) => {
        let progress = determineProgress(
          stageIndex,
          index,
          librarySyncStages.length
        );
        return (
          <li key={stage} className={progress === "pending" ? "hidden" : ""}>
            <p className="text-lg">
              {progress === "done" && <>✔️ </>}
              <span
                className={`text-gray-800 ${
                  progress === "active"
                    ? "font-bold animate-pulse"
                    : "font-light"
                }`}
              >
                {progress === "active" && "> "} {stage}
              </span>{" "}
              <span
                className={`text-blue-600 font-light transition-opacity duration-200 linear hover:opacity-100 ${
                  progress !== "active" && "opacity-50"
                }`}
              >
                ({description(stage)})
              </span>
            </p>
          </li>
        );
      })}
    </ul>
  );
}

// https://codereview.stackexchange.com/a/41008
function rotate<T>(list: T[]): T[] {
  return [list[list.length - 1], ...list.slice(0, list.length - 1)];
}

function Runner({ spm = null }: { spm: number | null }) {
  let [spots, setSpots] = useState([true, false, false, false]);
  useEffect(() => {
    if (spm) {
      let interval = setInterval(() => {
        setSpots((spots) => rotate(spots));
      }, (60 / spm) * 1000);
      return () => clearInterval(interval);
    }
  }, [setSpots, spm]);
  return (
    <div className="max-w-lg">
      <div
        aria-hidden={true}
        className="pointer-events-none text-5xl mt-2 flex bg-green-200 border-green-600 border-4 rounded-2xl justify-between px-5 py-2"
      >
        {spots.map((active, i) => {
          if (active) {
            return (
              <div key={i} className="transform -scale-x-1">
                <span role="img" aria-label="runner">
                  🏃
                </span>
              </div>
            );
          }
          return (
            <div key={i} className="opacity-75">
              <span role="img" aria-label="music note">
                🎶
              </span>
            </div>
          );
        })}
      </div>
      {spm && (
        <Alert>
          Our virtual runner is running at exactly{" "}
          <span className="font-bold">{spm}</span> strides per minute, but our
          track's SPM may not be that exact. As humans, we would naturally sync
          with the minor SPM discrepancies. Our virtual runner, on the other
          hand, is... not as adaptable.
        </Alert>
      )}
    </div>
  );
}

function Simulator({ data }: { data: MeSubscription }) {
  let user = data.users[0];
  let [spm, setSpm] = useState<number | null>(null);
  let [status, setStatus] = useState<"idle" | "running">("idle");
  let [mutation] = useInsertStrideEventMutation();

  function handleSubmitStartForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    let spm = parseInt(
      ((event.target as HTMLFormElement).querySelector(
        "select"
      ) as HTMLSelectElement).value
    );
    setSpm(spm);
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
    setSpm(spm);
    mutation({
      variables: {
        payload: {
          spm,
        },
        type: Stride_Event_Types_Enum.SpmUpdate,
      },
    });
  }
  return (
    <div>
      <form
        className="bg-white max-w-lg shadow-lg rounded-xl px-8 pt-8 pb-8 mb-4 mt-4 border"
        onSubmit={
          status === "idle" ? handleSubmitStartForm : handleSubmitUpdateForm
        }
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="spm"
          >
            Strides Per Minute
          </label>
          <div className="inline-block relative w-64 mb-4">
            <select
              id="spm"
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              {user.playlists.map(({ spm }) => (
                <option key={spm} value={spm}>
                  {spm}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {status === "idle" && "Start Run"}
              {status === "running" && "Update SPM"}
            </button>
          </div>
          {status === "idle" && (
            <Alert>
              <p>
                Make sure Spotify is active on your device before clicking
                "Start Run".
              </p>
            </Alert>
          )}
        </div>
      </form>
      <Runner spm={spm} />
    </div>
  );
}

export default SimulatorPage;
