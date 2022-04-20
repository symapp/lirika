import styles from "./index.module.css"
import {useEffect, useState} from "react";
import {getAllSongs} from "@lib/api";
import Song from "@components/Song";
import SongList from "@components/SongList";

export default function SongsPage({ session }) {
    const [songs, setSongs] = useState(null)

    useEffect(() => {
        const getSongs = async () => {
            try {
                const songs = await getAllSongs()
                setSongs(songs)
            } catch (e) {
                alert(e)
            }
        }

        getSongs()
    },[])

    return (
        <div>
            <h1>Songs</h1>
            <SongList songs={songs} session={session} />
        </div>
    )
}