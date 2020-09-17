CREATE TABLE "public"."users"(
    "id" serial NOT NULL,
    "spotify_refresh_token" text UNIQUE,
    PRIMARY KEY ("id")
);
