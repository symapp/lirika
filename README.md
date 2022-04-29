# Abstract

With Lirika your can view songs, albums and artists and their information. After signing (or logging) in you can like
your songs. With an account you can also register and edit your artists, albums and songs. Songs have Lyrics which you
can edit and every user can see.

# Possible todos

- [ ] search
    - [ ] song
    - [ ] album
    - [ ] artist
- [ ] lyrics with timestamps
- [ ] playlists
- [ ] liked songs page
- [ ] roles
- [ ] like albums
- [ ] follow artists

# Test

| ID            | T-01                                                                                                                                                                                                                                                                                                                                                                         |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Prerequisites | Server is running                                                                                                                                                                                                                                                                                                                                                            |
| Procedure     | 1. Open website<br/>2. Click on "Sign Up" in the header and input email, name and password, submit<br/>3. Click on "Logout" in the header<br/>4. Click on "Login" and enter same email and password as in step 2, submit                                                                                                                                                     |
| Expectation   | 1. A button for songs, albums, artists, login and sign up appear in the header<br/>2. Input gets validated, on success: redirected to songs page, options login and sign up are no longer in the header<br/>3. Login and Sign Up appear in the header again<br/>4. Input is validated, on success: redirected to songs page, options login and sign up not available anymore |   

| ID            | T-02                                                                                                                                                                         |
|---------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Prerequisites | T-01, logged in                                                                                                                                                              |
| Procedure     | 1. Create artist<br/>2. Create album with created artist<br/>3. Create song in the created album's page                                                                      |
| Expectation   | 1. Artist is visible in artists page (with correct info)<br/>2. Album is visible in albums page (with correct info)<br/>3. Song is visible in songs page (with correct info) |

| ID            | T-03                                                                                                                                                                                         |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Prerequisites | T-02, logged in                                                                                                                                                                              |
| Procedure     | 1. Go to created song's page<br/>2. Add lyrics                                                                                                                                               |
| Expectation   | 1. Lyrics section is empty and button add lyrics is present<br/>2. If valid, you can save lyrics and after saving (redirected to song's page) typed lyrics are visible in the lyrics section |

| ID            | T-04                                                               |
|---------------|--------------------------------------------------------------------|
| Prerequisites | T-02, not logged in                                                |
| Procedure     | 1. Go to created song's page and add "/edit" to the end of the url |
| Expectation   | 1. Redirected to login page                                        |

| ID            | T-05                                                                                                                                                          |
|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Prerequisites | T-02, logged in                                                                                                                                               |
| Procedure     | 1. Go to created song's page and click on delete<br/>2. Go to created album's page and click on delete<br/>3. Go to created artist's page and click on delete |
| Expectation   | 1. Redirected to songs page, song deleted<br/>2. Redirected to albums page, album deleted<br/>3. Redirected to artists page, artist deleted                   |

| ID            | T-05                                                                                                                                                                              |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Prerequisites | T-05, logged in, T-02 steps first                                                                                                                                                 |
| Procedure     | 1. Go to created artist's page and click on delete<br/>2. Go to created album's page and click on delete                                                                          |
| Expectation   | 1. Redirected to artists page, artist deleted<br/>2. Album has 0 artists (unknown), redirected to albums page, album deleted, in song page song that was in album was deleted too |

