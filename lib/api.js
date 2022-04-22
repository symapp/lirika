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

export async function register({ email, password, name, likedSongIds}) {
    const response = await fetch(`${URL}/register`, {
        method: "POST",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({email, password, name, likedSongIds, roles: []})
    })

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function getAllUsers() {
    const response = await fetch(`${URL}/users`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function getUserById(userId) {
    const response = await fetch(`${URL}/users/${userId}`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function getLikedSongIdsByUserId(userid) {
    const response = await fetch(`${URL}/users/${userid}`)

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
        body: JSON.stringify({ likedSongs: likedSongs})
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

    const ids = song.artistIds

    song.artists = await getSongArtistsById(ids)

    return song
}


export async function getAlbumById(albumId) {
    const response = await fetch(`${URL}/albums/${albumId}?_embed=songs`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const album = await response.json()

    const ids = album.artistIds

    album.artists = await getAlbumArtistsById(ids)

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



export async function getArtistById(artistId) {
    const response = await fetch(`${URL}/artists/${artistId}`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function getSongArtistsById(artistIds) {
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

export async function getAlbumArtistsById(artistIds) {
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