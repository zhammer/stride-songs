Feature: Library Sync

    Background:
        Given the following users exist
            | id | library_sync_status   |
            | 1  | pending_refresh_token |
        And the following spotify users exist
            | id          |
            | zach        |
            | stridesongs |

    Scenario: I sync my spotify library with stride songs

        Given the following spotify tracks exist in "zach" library
            | id | tempo  |
            | a  | 155.4  |
            | b  | 143    |
            | c  | 139.9  |
            | d  | 160    |
            | e  | 160.25 |
        When I add refresh token "zach:refresh-token" to user 1
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
        And the following spotify playlists exist for user "stridesongs"
            | name                  | tracks |
            | 125spm - Stride Songs |        |
            | 130spm - Stride Songs |        |
            | 135spm - Stride Songs |        |
            | 140spm - Stride Songs | c      |
            | 145spm - Stride Songs |        |
            | 150spm - Stride Songs |        |
            | 155spm - Stride Songs | a      |
            | 160spm - Stride Songs | d, e   |
            | 165spm - Stride Songs |        |
            | 170spm - Stride Songs |        |
            | 175spm - Stride Songs |        |
            | 180spm - Stride Songs |        |
            | 185spm - Stride Songs |        |
            | 190spm - Stride Songs |        |
            | 195spm - Stride Songs |        |
            | 200spm - Stride Songs |        |
