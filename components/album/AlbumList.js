import styles from "./AlbumList.module.css"
import AlbumCompact from "@components/album/AlbumCompact";

export default function AlbumList({albums}) {
    return albums && (
        <div className={styles.albumList}>
            {
                albums.map((album) => {
                    return (
                        <AlbumCompact album={album} key={album.id}/>
                    )
                })
            }
        </div>
    )
}