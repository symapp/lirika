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

export async function getLikedSongsByUserId(userid) {
    const response = await fetch(`${URL}/users/${userid}`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data.likedSongsIds
}

export async function getSongById(songId) {
    const response = await fetch(`${URL}/songs/${songId}`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function getAllSongs() {
    const response = await fetch(`${URL}/songs`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}

export async function getSongWithAllInfoById(songId) {
    const response0 = await fetch(`${URL}/songs/${songId}?_expand=album`)

    if (!response0.ok) {
        return Promise.reject(response0)
    }

    const song = await response0.json()

    const ids = song.artistIds
    let queryString = ""

    // set query
    ids.forEach(element => {
        queryString = `${queryString}&id=${element}`
    })
    queryString = queryString.replace('&', '?')

    // get artists
    const response = await fetch(`${URL}/artists${queryString}`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    // set artists
    song.artists = await response.json()

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

export async function getAlbumCoverFileName(id) {
    const response = await fetch(`${URL}/albums/${id}`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data.coverImage
}


export async function getArtistById(artistId) {
    const response = await fetch(`${URL}/artists/${artistId}`)

    if (!response.ok) {
        return Promise.reject(response)
    }

    const data = await response.json()
    return data
}