import {createArtist, getAllArtists, updateArtist, uploadImage} from "@lib/api";
import {useRouter} from "next/router";
import {useEffect, useRef, useState} from "react";
import styles from "./ArtistForm.module.css"
import Image from "next/image";

const defaultArtist = {
    name: "", image: ""
}

const validateArtist = async (artist, artistToEdit) => {
    const errors = {
        name: "", image: ""
    }
    let isValid = true

    try {
        const artists = await getAllArtists()
        if (artists.map(artist => artist.name).includes(artist.name)) {
            errors.name = "There's already an artist with that name"
            isValid = false
        }
        if (artistToEdit && artist.name === artistToEdit.name) {
            errors.name = ""
            isValid = true
        }
    } catch (e) {
        errors.name = "An error occurred. Couldn't verify if name is unique"
        isValid = false
    }

    if (artist.name.length === 0) {
        errors.name = "Name can't be empty"
        isValid = false
    }

    if (!artistToEdit) {
        if (!artist.filePath) {
            errors.image = "You have to input an image"
            isValid = false
        }
    } else {
        if (!artist.filePath) {
            artist.filePath = artistToEdit.filePath
        }
    }

    return {errors, isValid}
}

export default function ArtistForm({session, artistToEdit}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState(defaultArtist)
    const [artist, setArtist] = useState(defaultArtist)
    const [base64Image, setBase64Image] = useState("")
    const fileInput = useRef(null)

    useEffect(() => {
        if (artistToEdit) {
            setArtist(artistToEdit)
        }
    }, [artistToEdit])

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setArtist({
            ...artist, [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors(defaultArtist)

        // upload image
        if (base64Image) {
            artist.filePath = await uploadImage(base64Image, "artistimages")
        }

        // trimming
        artist.name = artist.name.trim()

        // validation
        const result = await validateArtist(artist, artistToEdit)

        if (!result.isValid) {
            setErrors(result.errors)
            setIsLoading(false)
            return
        }

        if (artist.id) {
            await updateArtist(session.accessToken, artist)
            await router.push(`/artist/${artist.id}`)
        } else {
            artist.userId = session.user.id
            const newArtist = await createArtist(session.accessToken, artist)
            await router.push(`/artist/${newArtist.id}`)
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

    return (<form onSubmit={handleSubmit} className={styles.artistForm}>
            <fieldset>
                <label>Name</label>
                <input type="text" name="name" onChange={handleChange} value={artist.name}/>
                {errors.name && <div>{errors.name}</div>}
            </fieldset>
            <fieldset>
                <label>Image</label>
                <input
                    type="file"
                    accept=".png,.jpg"
                    ref={fileInput}
                    onChange={onFileInputChange}
                />
                {(base64Image || artistToEdit) && <div className={styles.previewContainer}>
                    <div className={styles.imageContainer}>
                        {base64Image ? <Image
                            src={base64Image}
                            alt="image preview"
                            layout="fill"
                            objectFit="cover"
                        /> : <Image
                            src={artistToEdit.filePath}
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
        </form>)
}