CREATE TABLE "public"."playlists"(
    "id" serial NOT NULL,
    "user_id" integer NOT NULL,
    "spotify_id" text NOT NULL,
    "spm" integer NOT NULL,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id"),
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("spotify_id"),
    UNIQUE ("user_id", "spm")
);

CREATE TRIGGER "set_public_playlists_updated_at" BEFORE
    UPDATE ON "public"."playlists"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
