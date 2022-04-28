import styles from "./edit.module.css"
import SongForm from "@components/song/SongForm";
import {useRedirectToLogin} from "@lib/session";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getArtistByIdWithoutMoreInfo, getRawSongById} from "@lib/api";

export default function EditSongPage({session}) {
    useRedirectToLogin(session)

    const router = useRouter()
    const {id} = router.query
    const [song, setSong] = useState(null)

    useEffect(() => {
        if (!id) return
        const loadSong = async () => {
            try {
                const song = await getRawSongById(id)
                setSong(song)
            } catch (e) {
                if (e.status === 404) await router.push("/404")
            }
        }
        loadSong()
    }, [id, router])

    return song && (
        <div>
            <SongForm session={session} songToEdit={song} albumId={song.albumId}/>
        </div>
    )
}