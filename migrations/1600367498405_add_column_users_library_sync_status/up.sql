ALTER TABLE users
    ADD COLUMN library_sync_status text NOT NULL DEFAULT 'pending_refresh_token';

ALTER TABLE users
    ADD CONSTRAINT users_library_sync_status_fkey
    FOREIGN KEY (library_sync_status)
    REFERENCES library_sync_statuses (value);

CREATE OR REPLACE FUNCTION initiate_library_sync()
    RETURNS trigger AS $func$
    BEGIN
        NEW.library_sync_status := 'creating_playlists';
        RETURN NEW;
    END
    $func$ LANGUAGE 'plpgsql';

CREATE TRIGGER trigger_refresh_token_added
    BEFORE UPDATE ON users
    FOR EACH ROW
    WHEN (OLD.spotify_refresh_token IS NULL AND NEW.spotify_refresh_token IS NOT NULL)
    EXECUTE PROCEDURE initiate_library_sync();
