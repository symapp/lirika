import styles from "./index.module.css"
import {useEffect, useState} from "react";
import {getAllAlbums} from "@lib/api";
import AlbumList from "@components/AlbumList";

export default function AlbumsPage({ session }) {
    const [albums, setAlbums] = useState([])

    useEffect(() => {
        const getAlbums = async () => {
            try {
                const albums = await getAllAlbums()
                setAlbums(albums)
            } catch (e) {
                alert(e)
            }
        }

        getAlbums()
    }, [])

    return (
        <div>
            <h1>Albums</h1>
            <AlbumList albums={albums} session={session} />
        </div>
    )
}