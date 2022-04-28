import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getArtistByIdWithoutMoreInfo, getRawAlbumById} from "@lib/api";
import ArtistForm from "@components/artist/ArtistForm";
import {useRedirectToLogin} from "@lib/session";
import AlbumForm from "@components/album/AlbumForm";

export default function EditAlbumPage({session}) {
    useRedirectToLogin(session)

    const router = useRouter()
    const {id} = router.query
    const [album, setAlbum] = useState(null)

    useEffect(() => {
        if (!id) return
        const loadAlbum = async () => {
            try {
                const album = await getRawAlbumById(id)
                setAlbum(album)
            } catch (e) {
                if (e.status === 404) await router.push("/404")
            }
        }
        loadAlbum()
    }, [id, router])

    return album && (
        <div>
            <h1>Edit {album.name}</h1>
            <AlbumForm session={session} albumToEdit={album}/>
        </div>
    )
}