import styles from "./index.module.css"
import {useEffect, useState} from "react";
import {getAllSongs} from "@lib/api";
import Song from "@components/Song";
import SongList from "@components/SongList";

export default function SongsPage({ session }) {
    const [songs, setSongs] = useState(null)

    useEffect(() => {
        const getSongs = async () => {
            const songs = await getAllSongs()
            setSongs(songs)
        }

        getSongs()
    },[])

    return (
        <div>
            <SongList songs={songs} session={session} title="Songs"/>
        </div>
    )
}