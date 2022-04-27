import {createAlbum, getAllAlbums, getAllArtists, updateAlbum, uploadImage} from "@lib/api";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import styles from "./AlbumForm.module.css"
import Image from "next/image";

const defaultAlbum = {
    name: "",
    year: "",
    filePath: "",
    artistIds: []
}

const validateAlbum = async (album, albumToEdit) => {
    const errors = {
        name: "",
        year: "",
        image: ""
    }
    let isValid = true

    try {
        const albums = await getAllAlbums()
        if (albums.map(album => album.name).includes(album.name)) {
            errors.name = "There's already an artist with that name"
            isValid = false
        }
        if (albumToEdit && album.name === albumToEdit.name) {
            errors.name = ""
            isValid = true
        }
    } catch (e) {
        errors.name = "An error occurred. Couldn't verify if name is unique"
        isValid = false
    }

    if (album.name.length === 0) {
        errors.name = "Name can't be empty"
        isValid = false
    }

    if (!albumToEdit) {
        if (!album.filePath) {
            errors.image = "You have to input an image"
            isValid = false
        }
    } else {
        if (!album.filePath) {
            album.filePath = albumToEdit.filePath
        }
    }

    return {errors, isValid}
}

export default function AlbumForm({session, albumToEdit}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState(defaultAlbum)
    const [album, setAlbum] = useState(defaultAlbum)
    const [base64Image, setBase64Image] = useState("")
    const [artists, setArtists] = useState([])
    const fileInput = useRef(null)

    useEffect(() => {
        if (albumToEdit) {
            setAlbum(albumToEdit)
        }
    }, [albumToEdit])

    useEffect(() => {
        const getArtists = async () => {
            try {
                const artists = await getAllArtists()
                setArtists(artists)
            } catch (e) {
                alert("Couldn't load artists")
            }
        }

        getArtists()
    }, [])

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setAlbum({
            ...album,
            [name]: value
        })
    }

    const handleChangeSelect = (e) => {
        const select = e.target
        let result = [];
        let options = select && select.options;
        let opt;

        for (let i=0, iLen=options.length; i<iLen; i++) {
            opt = options[i];

            if (opt.selected) {
                result.push(opt.value || opt.text);
            }
        }
        setAlbum({
            ...album,
            artistIds: result
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors(defaultAlbum)

        // upload image
        if (base64Image) {
            album.filePath = await uploadImage(base64Image, "albumImages")
        }

        // trimming
        album.name = album.name.trim()

        // validation
        const result = await validateAlbum(album, albumToEdit)

        if (!result.isValid) {
            setErrors(result.errors)
            setIsLoading(false)
            return
        }

        if (album.id) {
            await updateAlbum(session.accessToken, album)
            await router.push(`/album/${album.id}`)
        } else {
            album.userId = session.user.id
            const newAlbum = await createAlbum(session.accessToken, album)
            await router.push(`/album/${newAlbum.id}`)
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
        <form onSubmit={handleSubmit} className={styles.albumForm}>
            <fieldset>
                <label>Name</label>
                <input type="text" name="name" onChange={handleChange} value={album.name}/>
                {errors.name && <div>{errors.name}</div>}
            </fieldset>
            <fieldset>
                <label>Year</label>
                <input type="number" min="1900" max="2099" step="1" name="year" onChange={handleChange}
                       value={album.year}/>
                {errors.year && <div>{errors.year}</div>}
            </fieldset>
            <fieldset>
                <label>Artists</label>
                <select name="artists" onChange={handleChangeSelect} value={album.artistIds} multiple>
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
                {
                    (base64Image || albumToEdit) &&
                    <div className={styles.previewContainer}>
                        <div className={styles.imageContainer}>
                            {
                                base64Image ?
                                    <Image
                                        src={base64Image}
                                        alt="image preview"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                    :
                                    <Image
                                        src={albumToEdit.filePath}
                                        alt="image preview"
                                        layout="fill"
                                        objectFit="cover"
                                    />

                            }
                        </div>
                        <p>Image Preview</p>
                    </div>
                }

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