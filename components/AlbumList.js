import styles from "./AlbumList.module.css"
import AlbumCompact from "@components/AlbumCompact";

export default function AlbumList({ albums, session }) {
    return albums && (
        <div className={styles.albumList}>
            {
                albums.map((album) => {
                    return (
                        <AlbumCompact album={album} session={session} key={album.id} />
                    )
                })
            }
        </div>
    )
}