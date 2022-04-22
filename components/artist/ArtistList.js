import styles from "./ArtistList.module.css"
import ArtistCompact from "@components/artist/ArtistCompact";

export default function ArtistList({artists}) {
    return artists && (
        <div className={styles.artistList}>
            {
                artists.map((artist) => {
                    return (
                        <ArtistCompact artist={artist} key={artist.id}/>
                    )
                })
            }
        </div>
    )
}