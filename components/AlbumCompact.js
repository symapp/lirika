import styles from "./AlbumCompact.module.css"
import {getAlbumArtistsById, getAlbumCoverFileName, getSongsByAlbumId} from "@lib/api";
import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";

export default function AlbumCompact({album, session}) {
    const [artists, setArtists] = useState()
    const [songs, setSongs] = useState([])
    const [albumLength, setAlbumLength] = useState(0)

    useEffect(() => {
        const getArtists = async () => {
            const artists = await getAlbumArtistsById(album.artistIds)
            setArtists(artists)
        }

        getArtists()

        const getSongs = async () => {
            const songs = await getSongsByAlbumId(album.id)
            setSongs(songs)
        }

        getSongs()

    }, [album.artistIds, album.id])

    useEffect(() => {
        if (!songs) return

        let length = 0
        songs.forEach((song) => {
            length += song.length
        })
        setAlbumLength(length)
    }, [album, songs])


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