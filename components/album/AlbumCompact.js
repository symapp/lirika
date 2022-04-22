import styles from "./AlbumCompact.module.css"
import {getArtistsByArtistIds, getAlbumCoverFileName, getSongsByAlbumId} from "@lib/api";
import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";

export default function AlbumCompact({album}) {
    const [artists, setArtists] = useState()
    const [songs, setSongs] = useState([])

    useEffect(() => {
        const getArtists = async () => {
            const artists = await getArtistsByArtistIds(album.artistIds)
            setArtists(artists)
        }

        getArtists()

        const getSongs = async () => {
            const songs = await getSongsByAlbumId(album.id)
            setSongs(songs)
        }

        getSongs()

    }, [album.artistIds, album.id])

    return (
        <div className={styles.album}>
            <Link href={`/album/${album.id}`} passHref>
                <div className={styles.imageContainer}>
                    <Image
                        src={`/albumcovers/${album.coverImage}`}
                        alt=""
                        layout="fill"
                        objectFit="contain"
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
                            artists &&
                            artists.map((artist) => artist.name).join(", ")
                        } - {
                        album.year
                    }
                    </h5>
                </div>
            </div>
        </div>
    )
}