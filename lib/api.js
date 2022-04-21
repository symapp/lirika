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

export async function setLikedTo(userId, songId, bool, session) {
    let likedSongs = await getLikedSongIdsByUserId(userId)

    if (likedSongs.includes(songId) && !bool) {
        likedSongs = likedSongs.filter((id) => id !== songId)
    } else if (!likedSongs.includes(songId) && bool) {
        likedSongs.push(songId)
    }

    const userResponse = await fetch(`${URL}/users/${userId}`)

    if (!userResponse.ok) {
        return Promise.reject(userResponse)
    }

    const user = await userResponse.json()

    user.likedSongIds = likedSongs

    const response = await fetch(`${URL}/users/${userId}`, {
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
    const response = await fetch(`${URL}/albums/${albumId}`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function getAllAlbums() {
    const response = await fetch(`${URL}/albums`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function getAlbumCoverFileName(id) {
    const response = await fetch(`${URL}/albums/${id}`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data.coverImage
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