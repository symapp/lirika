import styles from "./albumid.module.css"
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getAlbumById} from "@lib/api";
import SongForm from "@components/song/SongForm";

export default function AddSongToAlbumPage({session}) {
    const router = useRouter()
    const {albumid: albumId} = router.query
    const [album, setAlbum] = useState(null)

    useEffect(() => {
        if (!albumId) return

        const getAlbum = async () => {
            try {
                const album = await getAlbumById(albumId)
                setAlbum(album)
            } catch (e) {
                await router.push("/404")
            }
        }

        getAlbum()
    }, [albumId, router])

    return (
        <div>
            {
                album && <h1>Add song to {album.name}</h1>
            }
            {
                album && <SongForm session={session} albumId={album.id}/>
            }
        </div>
    )
}