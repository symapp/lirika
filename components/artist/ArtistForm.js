import {createArtist, getAllArtists, updateArtist, uploadArtistImage} from "@lib/api";
import {useRouter} from "next/router";
import {useEffect, useRef, useState} from "react";
import styles from "./ArtistForm.module.css"
import Image from "next/image";

const defaultArtist = {
    name: ""
}

export default function ArtistForm({session, artistToEdit}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState(defaultArtist)
    const [artist, setArtist] = useState(defaultArtist)
    const [editing, setEditing] = useState(false)

    const [base64Image, setBase64Image] = useState("")

    const fileInput = useRef(null)

    useEffect(() => {
        if (artistToEdit) {
            setArtist(artistToEdit)
            setEditing(true)
        }
    }, [artistToEdit])

    const validateArtist = async (artist) => {
        const errors = {
            name: ""
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
            errors.name = "An error occurred. Couldn't verify if input is unique"
            isValid = false
        }


        if (artist.name.trim().length === 0) {
            errors.name = "Name can't be empty"
            isValid = false
        }

        return {errors, isValid}
    }

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setArtist({
            ...artist,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setErrors(defaultArtist)

        const result = await validateArtist(artist)

        if (!result.isValid ) {
            setErrors(result.errors)
            setIsLoading(false)
            return
        }
        if (!base64Image && !artist.filePath) {
            setErrors({
                ...result.errors,
                image: "You need to input an image"
            })
            setIsLoading(false)
        }



        artist.lastEdit = new Date().toISOString()

        if (base64Image) {
            const filePath = await uploadArtistImage(base64Image, "artistimages")

            artist.filePath = filePath
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
        setEditing(false)
    }

    return (
        <form onSubmit={handleSubmit} className={styles.artistForm}>
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
                {
                    (base64Image || editing) &&
                    <div className={styles.previewContainer}>
                        <div className={styles.imageContainer}>
                            {
                                editing ?
                                    <Image
                                        src={artistToEdit.filePath}
                                        alt="image preview"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                    :
                                    <Image
                                        src={base64Image}
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