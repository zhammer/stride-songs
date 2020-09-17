INSERT INTO library_sync_statuses (value, comment)
VALUES (
        'pending_refresh_token',
        'sync cannot start until refresh_token is added'
    ),
    (
        'creating_playlists',
        'creating the inital spotify playlists to populate with tracks'
    ),
    (
        'scanning_library',
        'scanning through user\s tracks and grouping them into playlists'
    ),
    (
        'adding_tracks',
        'adding grouped tracks to actual spotify playlists'
    ),
    ('succeeded', 'the library sync succeeded');
