import styles from "./edit.module.css"
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getArtistByIdWithoutMoreInfo} from "@lib/api";
import ArtistForm from "@components/artist/ArtistForm";
import {useRedirectToLogin} from "@lib/session";

export default function EditArtistPage({session}) {
    useRedirectToLogin(session)

    const router = useRouter()
    const {id} = router.query
    const [artist, setArtist] = useState(null)

    useEffect(() => {
        if (!id) return
        const loadArtist = async () => {
            try {
                const artist = await getArtistByIdWithoutMoreInfo(id)
                setArtist(artist)
            } catch (e) {
                if (e.status === 404) await router.push("/404")
            }
        }
        loadArtist()
    }, [id, router])

    return artist && (
        <div>
            <h1>Edit artist {artist.name}</h1>
            <ArtistForm session={session} artistToEdit={artist}/>
        </div>
    )
}