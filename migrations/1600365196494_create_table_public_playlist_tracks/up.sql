CREATE TABLE "public"."playlist_tracks"(
    "playlist_id" integer NOT NULL,
    "spotify_id" text NOT NULL,
    "status" text NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("playlist_id", "spotify_id"),
    FOREIGN KEY ("playlist_id") REFERENCES "public"."playlists"("id") ON UPDATE restrict ON DELETE restrict,
    FOREIGN KEY ("status") REFERENCES "public"."playlist_track_statuses"("value") ON UPDATE restrict ON DELETE restrict
);

CREATE TRIGGER "set_public_playlist_tracks_updated_at" BEFORE
    UPDATE ON "public"."playlist_tracks"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
