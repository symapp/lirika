import styles from "./SongList.module.css"
import SongCompact from "@components/SongCompact";
import {useEffect, useState} from "react";
import {getLikedSongIdsByUserId} from "@lib/api";

export default function SongList({ songs, session }) {
    return songs && (
        <div className={styles.songList}>
            {
                songs.map((song) => {
                    return (
                        <SongCompact song={song} session={session} key={song.id}/>
                    )
                })
            }
        </div>
    )
}