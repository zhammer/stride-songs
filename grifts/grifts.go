package grifts

import (
	"context"
	"log"

	"github.com/go-pg/pg/v10"
	. "github.com/markbates/grift/grift"
)

var _ = Namespace("db", func() {
	opt, err := pg.ParseURL("postgres://stridesongs:password@127.0.0.1:5432/stridesongs?sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}

	db := pg.Connect(opt)
	if err := db.Ping(context.TODO()); err != nil {
		log.Fatal(err)
	}

	Desc("clear", "clears the database")
	Set("clear", func(c *Context) error {
		// https://stackoverflow.com/a/36023359
		_, err := db.Exec(`
			DO $$ DECLARE
				r RECORD;
				columns text[];
			BEGIN
				FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
					select array_agg(column_name) into columns from information_schema.columns where table_name = r.tablename;
					if columns != array['value', 'comment']::text[] then
						EXECUTE 'TRUNCATE ' || quote_ident(r.tablename) || ' CASCADE';
					end if;
				END LOOP;
			END $$;
		`)
		return err
	})
})
