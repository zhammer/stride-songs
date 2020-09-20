Feature: Library Sync

    Background:
        Given the following users exist
            | id | spotify_refresh_token | library_sync_status   |
            | 1  |                       | pending_refresh_token |

    Scenario: I sync my spotify library with stride songs

        Given the following spotify tracks exist in "user-id" library
            | id | tempo  |
            | a  | 155.4  |
            | b  | 143    |
            | c  | 139.9  |
            | d  | 160    |
            | e  | 160.25 |
        When I add refresh token "user-refresh-token" to user 1
        Then the following playlists exist for user 1
            | spm | tracks |
            | 125 |        |
            | 130 |        |
            | 135 |        |
            | 140 | c      |
            | 145 |        |
            | 150 |        |
            | 155 | a      |
            | 160 | d, e   |
            | 165 |        |
            | 170 |        |
            | 175 |        |
            | 180 |        |
            | 185 |        |
            | 190 |        |
            | 195 |        |
            | 200 |        |
        And the following spotify playlists exist for user "stride-songs-id"
            | name | tracks |
            | 125  |        |
            | 130  |        |
            | 135  |        |
            | 140  | c      |
            | 145  |        |
            | 150  |        |
            | 155  | a      |
            | 160  | d, e   |
            | 165  |        |
            | 170  |        |
            | 175  |        |
            | 180  |        |
            | 185  |        |
            | 190  |        |
            | 195  |        |
            | 200  |        |
