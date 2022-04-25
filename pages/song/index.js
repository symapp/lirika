import styles from "./index.module.css"
import {useEffect, useState} from "react";
import {getAllSongs} from "@lib/api";
import SongCompact from "@components/song/SongCompact";
import SongList from "@components/song/SongList";

export default function SongsPage({ session }) {
    const [songs, setSongs] = useState([])

    useEffect(() => {
        const getSongs = async () => {
            try {
                const songs = await getAllSongs()
                setSongs(songs)
            } catch (e) {
                alert("Couldn't load song...")
            }
        }

        getSongs()
    },[])

    return (
        <div>
            <h1>Songs</h1>
            <SongList songs={songs} session={session} smaller={true} />
        </div>
    )
}