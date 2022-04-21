import styles from "./SongList.module.css"
import SongCompact from "@components/SongCompact";

export default function SongList({ songs, session }) {
    return songs && (
        <div className={styles.songList}>
            {
                songs.map((song) => {
                    return (
                        <SongCompact song={song} session={session} key={song.id} />
                    )
                })
            }
        </div>
    )
}