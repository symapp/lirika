import styles from "./SongCompact.module.css"
import {useEffect, useState} from "react";
import {getSongArtistsById} from "@lib/api";
import Image from "next/image";
import likedImg from "/public/liked.png"
import unlikedImg from "/public/unliked.png"
import Link from "next/link";

function getFormattedTime(time) {
    return Math.floor(time / 60) + ':' + (new Array(2 + 1).join("0") + (time % 60)).slice(-2)
}

export default function SongCompact({song, session, album, likedSongs, setLikedSongs}) {
    const [artists, setArtists] = useState()

    useEffect(() => {
        const getArtists = async () => {
            const artists = await getSongArtistsById(song.artistIds)
            setArtists(artists)
        }

        getArtists()
    }, [session.user, song])

    const toggleLike = async () => {
        let newLikedSongs = [...likedSongs]

        if (newLikedSongs.includes(song.id)) {
            newLikedSongs = likedSongs.filter((id) => id !== song.id)
        } else {
            newLikedSongs.push(song.id)
        }
        setLikedSongs(newLikedSongs)
    }


    return (
        <div className={styles.song}>
            <Link href={`/song/${song.id}`} passHref>
                <div className={styles.imageContainer}>
                    <Image
                        src={`/albumcovers/${album ? album.coverImage : song.album.coverImage}`}
                        alt=""
                        layout="fill"
                        objectFit="contain"
                    />
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
                        likedSongs.includes(song.id)
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