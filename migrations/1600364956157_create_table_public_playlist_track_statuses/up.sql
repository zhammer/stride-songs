CREATE TABLE "public"."playlist_track_statuses"(
    "value" text NOT NULL,
    "comment" text,
    PRIMARY KEY ("value"),
    UNIQUE ("value")
);
