import styles from "./SongForm.module.css"
import {
    createSong,
    getAlbumById,
    getAllArtists,
    getAllSongs,
    getSongsByAlbumId,
    updateSong,
    uploadImage
} from "@lib/api";
import {useRouter} from "next/router";
import {useEffect, useRef, useState} from "react";
import Image from "next/image";

const defaultSong = {
    name: "", likes: 0, albumId: null, artistIds: [], genres: [], songLength: 0, lyrics: []
}

const validateSong = async (song, songToEdit, album) => {
    const errors = {
        name: "", length: 0
    }
    let isValid = true

    try {
        const songs = await getAllSongs()
        if (songs.map(song => song.name).includes(song.name)) {
            errors.name = "There's already an artist with that name"
            isValid = false
        }
        if (songToEdit && song.name === songToEdit.name) {
            errors.name = ""
            isValid = true
        }
    } catch (e) {
        errors.name = "An error occurred. Couldn't verify if name is unique"
        isValid = false
    }

    if (song.name.length === 0) {
        errors.name = "Name can't be empty"
        isValid = false
    }

    if (song.songLength < 1) {
        errors.songLength = "Length has to be bigger than 0"
        isValid = false
    }

    if (!songToEdit) {
        if (!song.filePath) {
            if (!album) {
                errors.image = "You have to input an image"
                isValid = false
            } else {
                song.filePath = album.filePath
            }
        }
    } else {
        if (!song.filePath) {
            song.filePath = songToEdit.filePath
        }
    }

    return {errors, isValid}
}

export default function SongForm({session, songToEdit, albumId}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState(defaultSong)
    const [song, setSong] = useState(defaultSong)
    const [artists, setArtists] = useState([])
    const [album, setAlbum] = useState()
    const [base64Image, setBase64Image] = useState("")
    const fileInput = useRef(null)
    const minutesRef = useRef(null)
    const secondsRef = useRef(null)

    useEffect(() => {
        if (songToEdit) {
            setSong(songToEdit)
        }
    }, [songToEdit])

    useEffect(() => {
        setSong({
            ...song,
            albumId: albumId
        })

        const getArtists = async () => {
            try {
                const artists = await getAllArtists()
                setArtists(artists)
            } catch (e) {
                alert("Couldn't load artists")
            }
        }

        getArtists()

        const getAlbum = async () => {
            try {
                const album = await getAlbumById(albumId)
                setAlbum(album)
            } catch (e) {
                alert("Couldn't load album")
            }
        }

        getAlbum()
    }, [])

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setSong({
            ...song, [name]: value
        })
    }

    const handleChangeSelect = (e) => {
        const select = e.target
        let result = [];
        let options = select && select.options;
        let opt;

        for (let i = 0, iLen = options.length; i < iLen; i++) {
            opt = options[i];

            if (opt.selected) {
                result.push(opt.value || opt.text);
            }
        }
        setSong({
            ...song,
            artistIds: result
        })
    }

    const handleChangeLength = (e) => {
        const minutes = parseInt(minutesRef.current.value ? minutesRef.current.value : 0)
        const seconds = parseInt(secondsRef.current.value)
        const length = minutes * 60 + seconds

        setSong({
            ...song,
            songLength: minutes * 60 + seconds
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors(defaultSong)

        // upload image
        if (base64Image) {
            song.filePath = await uploadImage(base64Image, "songimages")
        }

        // trimming
        song.name = song.name.trim()

        // validation
        const result = await validateSong(song, songToEdit, album)

        if (!result.isValid) {
            setErrors(result.errors)
            setIsLoading(false)
            return
        }

        if (song.id) {
            await updateSong(session.accessToken, song)
            await router.push(`/song/${song.id}`)
        } else {
            song.userId = session.user.id

            try {
                const songs = await getSongsByAlbumId(albumId)
                const ids = songs.map((song) => song.indexInAlbum)
                let i = 1
                while (!song.indexInAlbum) {
                    if (!ids.includes(i)) song.indexInAlbum = i
                    i++
                }
            } catch (e) {
                alert("Couldn't set album index")
            }

            const newSong = await createSong(session.accessToken, song)
            await router.push(`/song/${newSong.id}`)
        }

        setIsLoading(false)
    }

    const onFileInputChange = async (e) => {
        const file = fileInput.current.files[0]
        if (!file) return

        const toBase64 = async (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => resolve(reader.result)
                reader.onerror = error => reject(error)
            })
        }

        const base64 = await toBase64(file)
        setBase64Image(base64)
    }

    return (
        <form onSubmit={handleSubmit} className={styles.songForm}>
            <fieldset>
                <label>Name</label>
                <input type="text" name="name" onChange={handleChange} value={song.name}/>
                {errors.name && <div>{errors.name}</div>}
            </fieldset>

            <fieldset className={styles.twoinputs}>
                <label>Length</label>
                <div>
                    <input ref={minutesRef} type="number" min="0" max="60" step="1" name="minutes"
                           onChange={handleChangeLength} placeholder="minutes"/>
                    <input ref={secondsRef} type="number" min="1" max="59" step="1" name="seconds"
                           onChange={handleChangeLength} placeholder="seconds"/>
                </div>
                {errors.songLength && <>{errors.songLength}</>}
            </fieldset>
            <fieldset>
                <label>Artists</label>
                <select name="artists" onChange={handleChangeSelect} value={song.artistIds} multiple>
                    {
                        artists.map((artist) => {
                            return <option key={artist.id} value={artist.id}>{artist.name}</option>
                        })
                    }
                </select>
            </fieldset>
            <fieldset>
                <label>Image</label>
                <input
                    type="file"
                    accept=".png,.jpg"
                    ref={fileInput}
                    onChange={onFileInputChange}
                />
                {(base64Image || songToEdit) && <div className={styles.previewContainer}>
                    <div className={styles.imageContainer}>
                        {base64Image ? <Image
                            src={base64Image}
                            alt="image preview"
                            layout="fill"
                            objectFit="cover"
                        /> : <Image
                            src={songToEdit.filePath}
                            alt="image preview"
                            layout="fill"
                            objectFit="cover"
                        />

                        }
                    </div>
                    <p>Image Preview</p>
                </div>}

                {errors.image && <div>{errors.image}</div>}
            </fieldset>
            <div className="buttons">
                <button disabled={isLoading}>
                    {isLoading ? "Submitting..." : "Submit"}
                </button>
            </div>
        </form>
    )
}