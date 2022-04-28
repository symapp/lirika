import {raw} from "next/dist/build/webpack/loaders/next-middleware-wasm-loader";

const URL = "http://localhost:3001"

export async function login({email, password}) {
    const response = await fetch(`${URL}/login`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({email, password})
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function register(user) {
    const response = await fetch(`${URL}/register`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(user)
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}


// USER

export async function getAllUsers() {
    const response = await fetch(`${URL}/users`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function updateUser(session, user) {
    const response = await fetch(`${URL}/users${user.id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(user)
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}


// SONG

export async function getLikedSongIdsByUserId(session, userid) {
    const response = await fetch(`${URL}/users/${userid}`, {
        headers: {
            "authorization": `Bearer ${session.accessToken}`
        }
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data.likedSongIds
}

export async function setLikedSongsTo(session, likedSongs) {
    const response = await fetch(`${URL}/users/${session.user.id}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({likedSongIds: likedSongs})
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}


export async function getAllSongs() {
    const response = await fetch(`${URL}/songs?_expand=album`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const songs = await response.json()

    return songs
}

export async function getSongById(songId) {
    const response = await fetch(`${URL}/songs/${songId}?_expand=album`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const song = await response.json()
    song.artists = []

    if (song.artistIds.length < 1) return song

    const ids = song.artistIds

    song.artists = await getArtistsByArtistIds(ids)

    return song
}

export async function getRawSongById(songId) {
    const response = await fetch(`${URL}/songs/${songId}`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const song = await response.json()
    return song
}


export async function updateSong(accessToken, song) {
    song.lastEdit = new Date().toISOString()

    const response = await fetch(`${URL}/songs/${song.id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${accessToken}`
        },

        body: JSON.stringify(song)
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function createSong(accessToken, song) {
    song.lastEdit = new Date().toISOString()


    const response = await fetch(`${URL}/songs`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${accessToken}`
        },

        body: JSON.stringify(song)
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function deleteSong(session, songId) {
    const users = await getAllUsers()

    for (const user of users) {
        if (user.likedSongIds.includes(parseInt(songId))) {
            await setLikedSongsTo({user: {id: user.id}, accessToken: session.accessToken}, user.likedSongIds.filter(likedSongId => likedSongId !== songId))
        }
    }

    const song = await getRawSongById(songId)
    const songs = await getSongsByAlbumId(song.albumId)
    for (const otherSong of songs) {
        if (otherSong.id === songId) return
        if (otherSong.indexInAlbum > song.indexInAlbum) {
            await updateSong(session.accessToken, {...otherSong, indexInAlbum: otherSong.indexInAlbum-1})
        }
    }

    const response = await fetch(`${URL}/songs/${songId}`, {
        method: "DELETE",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${session.accessToken}`
        }
    })

    if (!response.ok && response.status !== 404) {
        return Promise.reject(response)
    }
}


// ALBUM

export async function getAlbumById(albumId) {
    const response = await fetch(`${URL}/albums/${albumId}?_embed=songs`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const album = await response.json()
    album.artists = []

    if (album.artistIds.length < 1) return album

    const ids = album.artistIds

    album.artists = await getArtistsByArtistIds(ids)

    return album
}

export async function getRawAlbumById(albumId) {
    const response = await fetch(`${URL}/albums/${albumId}`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const album = await response.json()
    return album
}

export async function getAllAlbums() {
    const response = await fetch(`${URL}/albums?_embed=songs`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function getSongsByAlbumId(albumId) {
    const response = await fetch(`${URL}/albums/${albumId}?_embed=songs`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data.songs
}

export async function updateAlbum(accessToken, album) {
    album.lastEdit = new Date().toISOString()

    const response = await fetch(`${URL}/albums/${album.id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(album)
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function createAlbum(accessToken, album) {
    album.lastEdit = new Date().toISOString()

    const response = await fetch(`${URL}/albums`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(album)
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function deleteAlbum(session, albumId) {
    const songs = await getSongsByAlbumId(albumId)

    for (const song of songs) {
        await deleteSong(session, song.id)
    }

    const response = await fetch(`${URL}/albums/${albumId}`, {
        method: "DELETE",
        headers: {
            "authorization": `Bearer ${session.accessToken}`
        }
    })

    if (!response.ok) {
        return Promise.reject(response)
    }
}


// ARTIST

export async function getArtistById(artistId) {
    // get artist
    const artistResponse = await fetch(`${URL}/artists/${artistId}`)
    if (!artistResponse.ok) {
        return Promise.reject(artistResponse)
    }
    let artist = await artistResponse.json()

    // get all songs
    let songs = await getAllSongs()
    // filter songs and add to artist
    artist.songs = songs.filter((song) => song.artistIds.includes(artistId))
    console.log(songs)

    // get all albums
    let albums = await getAllAlbums()
    // filter songs and add to artist
    artist.albums = albums.filter((album) => album.artistIds.includes(artistId))

    return artist
}

export async function getArtistByIdWithoutMoreInfo(artistId) {
    const artistResponse = await fetch(`${URL}/artists/${artistId}`)

    if (!artistResponse.ok) {
        return Promise.reject(artistResponse)
    }

    let artist = await artistResponse.json()
    return artist
}

export async function getAllArtists() {
    const response = await fetch(`${URL}/artists`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function getArtistsByArtistIds(artistIds) {
    let queryString = ""

    // set query
    artistIds.forEach(element => {
        queryString = `${queryString}&id=${element}`
    })
    queryString = queryString.replace('&', '?')

    // get artists
    const response = await fetch(`${URL}/artists${queryString}`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    // set artists
    const artists = await response.json()
    return artists
}

export async function updateArtist(accessToken, artist) {
    artist.lastEdit = new Date().toISOString()

    const response = await fetch(`${URL}/artists/${artist.id}`, {
        method: "PUT",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(artist)
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function createArtist(accessToken, artist) {
    artist.lastEdit = new Date().toISOString()

    const response = await fetch(`${URL}/artists/`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(artist)
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function deleteArtist(accessToken, artistId) {
    const artist = await getArtistById(artistId)

    for (const song of artist.songs) {
        const rawSong = await getRawSongById(song.id)
        rawSong.artistIds = rawSong.artistIds.filter(artistId_ => artistId_ !== parseInt(artistId))
        await updateSong(accessToken, rawSong)
    }

    for (const album of artist.albums) {
        const rawAlbum = await getRawAlbumById(album.id)
        rawAlbum.artistIds = rawAlbum.artistIds.filter(artistId_ => artistId_ !== parseInt(artistId))
        await updateAlbum(accessToken, rawAlbum)
    }

    const response = await fetch(`${URL}/artists/${artistId}`, {
        method: "DELETE",
        headers: {
            "authorization": `Bearer ${accessToken}`
        }
    })

    if (!response.ok) {
        return Promise.reject(response)
    }
}

export async function uploadImage(base64Image, folder) {
    const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({base64Image, folder})
    })

    const json = await response.json()
    return json.filePath
}