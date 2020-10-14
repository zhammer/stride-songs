CREATE TABLE "public"."stride_events"(
  "id" serial NOT NULL,
  "user_id" integer NOT NULL,
  "type" text NOT NULL,
  "payload" jsonb NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id"),
  FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON UPDATE restrict ON DELETE restrict,
  FOREIGN KEY ("type") REFERENCES "public"."stride_event_types"("value") ON UPDATE restrict ON DELETE restrict
);
