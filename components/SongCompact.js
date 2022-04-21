import styles from "./SongCompact.module.css"
import {useEffect, useState} from "react";
import {getAlbumCoverFileName, getArtistsById, getLikedSongIdsByUserId, setLikedTo} from "@lib/api";
import Image from "next/image";
import likedImg from "../public/liked.png"
import unlikedImg from "../public/unliked.png"
import Link from "next/link";
import {useRouter} from "next/router";

function getFormattedTime(time) {
    return Math.floor(time / 60) + ':' + (new Array(2 + 1).join("0") + (time % 60)).slice(-2)
}

export default function SongCompact({song, likedStart, session}) {
    const [imagePath, setImagePath] = useState()
    const [artists, setArtists] = useState()
    const [liked, setLiked] = useState()

    useEffect(() => {
        const getAlbumCoverImagePath = async () => {
            const AlbumCoverImagePath = await getAlbumCoverFileName(song.albumId)
            setImagePath(AlbumCoverImagePath)
        }

        getAlbumCoverImagePath()

        const getArtists = async () => {
            const artists = await getArtistsById(song.artistIds)
            setArtists(artists)
        }

        getArtists()

        const getLiked = async () => {
            const likedSongs = await getLikedSongIdsByUserId(session.user.id)
            setLiked(likedSongs.includes(song.id))
        }

        getLiked()
    }, [session.user.id, song])

    useEffect(() => {
        setLikedTo(session.user.id, song.id, liked, session)
    }, [liked, session, song.id])

    const toggleLike = () => {
        setLiked(!liked)
    }

    return (
        <div className={styles.song}>
            <Link href={`/song/${song.id}`} passHref>
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

            <div className={styles.songInfo}>
                <div className={styles.mainSongInfo}>
                    <Link href={`/song/${song.id}`} passHref>
                        <h3>{song.name}</h3>
                    </Link>
                    <h5>
                        {
                            artists &&
                            artists.map((artist) => artist.name).join(", ")
                        }
                    </h5>
                </div>
                <p>{getFormattedTime(song.length)}</p>
                <h4>{song.likes}</h4>
            </div>

            {session.user &&
                <div className={styles.likeImageContainer} onClick={toggleLike}>
                    {
                        liked
                            ?
                            <Image
                                src={likedImg}
                                alt=""
                                layout="fill"
                                objectFit="contain"
                            />
                            :
                            <div className={styles.unliked}>
                                <Image
                                    src={unlikedImg}
                                    alt=""
                                    layout="fill"
                                    objectFit="contain"
                                />
                            </div>
                    }
                </div>
            }
        </div>
    )
}