import styles from "./AlbumCompact.module.css"
import {getAlbumArtistsById, getAlbumCoverFileName, getSongsByAlbumId} from "@lib/api";
import {useEffect, useState} from "react";
import Link from "next/link";
import Image from "next/image";

function getFormattedTime(time) {
    return Math.floor(time / 60) + ':' + (new Array(2 + 1).join("0") + (time % 60)).slice(-2)
}

export default function AlbumCompact({ album, session }) {
    const [imagePath, setImagePath] = useState()
    const [artists, setArtists] = useState()
    const [songs, setSongs] = useState([])
    const [albumLength, setAlbumLength] = useState(0)

    useEffect(() => {
        const getAlbumCoverImagePath = async () => {
            const AlbumCoverImagePath = await getAlbumCoverFileName(album.id)
            setImagePath(AlbumCoverImagePath)
        }

        getAlbumCoverImagePath()

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
                    {imagePath &&
                        <Image
                            src={`/../public/albumcovers/${imagePath}`}
                            alt=""
                            layout="fill"
                            objectFit="contain"
                        />
                    }
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
                <p>{getFormattedTime(albumLength)}</p>
            </div>
        </div>
    )
}