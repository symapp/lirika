import styles from "./SongList.module.css"
import SongCompact from "@components/song/SongCompact";
import {useEffect, useState} from "react";
import {getLikedSongIdsByUserId, setLikedSongsTo} from "@lib/api";

export default function SongList({songs, session, album, numbers}) {
    const [likedSongs, setLikedSongs] = useState([])

    useEffect(() => {
        if (!session.user) return

        const getLikedSongs = async () => {
            try {
                const likedSongs = await getLikedSongIdsByUserId(session, session.user.id)
                setLikedSongs(likedSongs)
            } catch (e) {
                alert("Couldn't load liked songs...")
            }
        }


        getLikedSongs()
    }, [session])


    const updateLikedSongs = async (newLikedSongs) => {
        setLikedSongs(newLikedSongs)

        try {
            setLikedSongsTo(session, newLikedSongs)
        } catch (e) {
            alert("Couldn't update liked songs...")
        }
    }


    return songs && (
        <div className={[styles.songList, numbers && styles.numbered].join(" ")}>
            {
                songs.sort((a, b) => a.indexInAlbum - b.indexInAlbum).map((song) => {
                    return (
                        <div key={song.id} className={numbers && styles.songContainer}>
                            {numbers && <h6>{song.indexInAlbum}</h6>}
                            <SongCompact song={song} album={album} session={session} likedSongs={likedSongs}
                                         setLikedSongs={updateLikedSongs}/>
                        </div>

                    )
                })
            }
        </div>
    )
}