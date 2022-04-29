import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getRawArtistById} from "@lib/api";
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
                const artist = await getRawArtistById(id)
                setArtist(artist)
            } catch (e) {
                if (e.status === 404) {
                    await router.push("/404")
                    return
                }
                alert("Couldn't load Artist")
            }
        }
        loadArtist()
    }, [id, router])

    return artist && (
        <div>
            <h1>Edit {artist.name}</h1>
            <ArtistForm session={session} artistToEdit={artist}/>
        </div>
    )
}