import styles from "./AlbumCompact.module.css"
import {getArtistsByArtistIds} from "@lib/api";
import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";

export default function AlbumCompact({album}) {
    const [artists, setArtists] = useState([])

    useEffect(() => {
        if (album.artistIds.length < 1) return

        const getArtists = async () => {
            try {
                const artists = await getArtistsByArtistIds(album.artistIds)
                setArtists(artists)
            } catch (e) {
                alert("Couldn't get artists...")
            }
        }

        getArtists()
    }, [album])

    return (
        <div className={styles.album}>
            <Link href={`/album/${album.id}`} passHref>
                <div className={styles.imageContainer}>
                    <Image
                        src={album.filePath}
                        alt=""
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </Link>

            <div className={styles.albumInfo}>
                <div className={styles.mainAlbumInfo}>
                    <Link href={`/album/${album.id}`} passHref>
                        <h3>{album.name}</h3>
                    </Link>
                    <h5>
                        {
                            artists.length > 0
                                ?
                                artists.map((artist) => {
                                    return <Link href={`/artist/${artist.id}`} passHref key={artist.id}>
                                        {artist.name}
                                    </Link>
                                }).reduce((prev, curr) => [prev, ', ', curr])
                                :
                                <>Unknown</>
                        } - {
                        album.year
                    }
                    </h5>
                </div>
            </div>
        </div>
    )
}