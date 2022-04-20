import styles from "./SongList.module.css"
import Song from "@components/Song";
import {useEffect, useState} from "react";
import {getLikedSongsByUserId} from "@lib/api";

export default function SongList({ songs, session }) {
    const [likedSongs, setLikedSongs] = useState([])

    useEffect(() => {
        const getLikedSongs = async () => {
            if (!session.user) return

            const likedSongs = await getLikedSongsByUserId(session.user.id)

            setLikedSongs(likedSongs)
        }

        getLikedSongs()
    }, [session])

    return songs && (
        <div className={styles.songList}>
            {
                songs.map((song) => {
                    return (
                        <Song song={song} session={session} key={song.id} liked={likedSongs.includes(song.id)}/>
                    )
                })
            }
        </div>
    )
}