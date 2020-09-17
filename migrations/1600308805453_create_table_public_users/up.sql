CREATE TABLE "public"."users"(
    "id" serial NOT NULL,
    "spotify_refresh_token" text UNIQUE,
    "created_at" timestamptz NOT NULL DEFAULT now(),
    "updated_at" timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY ("id")
);

CREATE TRIGGER "set_public_users_updated_at" BEFORE
    UPDATE ON "public"."users"
    FOR EACH ROW
    EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
