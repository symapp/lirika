import styles from "./index.module.css"
import {useEffect, useState} from "react";
import {getAllAlbums} from "@lib/api";

export default function AlbumsPage() {
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

        </div>
    )
}