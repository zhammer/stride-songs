package database

import "github.com/go-pg/pg/v10"

// Clear all non-enum tables in the database
func Clear(db *pg.DB) error {
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
}
