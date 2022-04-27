import styles from "./SongCompact.module.css"
import {useEffect, useState} from "react";
import {getArtistsByArtistIds} from "@lib/api";
import Image from "next/image";
import likedImg from "/public/other/liked.png"
import unlikedImg from "/public/other/unliked.png"
import Link from "next/link";

function getFormattedTime(time) {
    return Math.floor(time / 60) + ':' + (new Array(2 + 1).join("0") + (time % 60)).slice(-2)
}

export default function SongCompact({song, session, album, likedSongs, setLikedSongs}) {
    const [artists, setArtists] = useState([])

    useEffect(() => {
        if (song.artistIds.length < 1) return
        const getArtists = async () => {
            try {
                const artists = await getArtistsByArtistIds(song.artistIds)
                setArtists(artists)
            } catch (e) {
                alert("Couldn't load artists...")
            }
        }

        getArtists()
    }, [session.user, song])


    const toggleLike = async () => {
        let newLikedSongs = [...likedSongs]

        if (likedSongs.includes(song.id)) {
            newLikedSongs = newLikedSongs.filter((id) => id !== song.id)
        } else {
            newLikedSongs.push(song.id)
        }

        setLikedSongs(newLikedSongs)
    }


    return (
        <div className={styles.song}>
            <Link href={`/album/${album ? album.id : song.album.id}`} passHref>
                <div className={styles.imageContainer}>
                    <Image
                        src={album ? album.filePath : song.album.filePath}
                        alt=""
                        layout="fill"
                        objectFit="cover"
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
                            artists.length > 0 ?
                                artists.map((artist) => {
                                    return (
                                        <Link href={`/artist/${artist.id}`} passHref key={artist.id}>
                                            {artist.name}
                                        </Link>
                                    )
                                }).reduce((prev, curr) => [prev, ', ', curr])
                                :
                                <>unknown</>
                        }
                    </h5>
                </div>
                <p>{getFormattedTime(song.length)}</p>
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
                                objectFit="cover"
                            />
                            :
                            <div className={styles.unliked}>
                                <Image
                                    src={unlikedImg}
                                    alt=""
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                    }
                </div>
            }
        </div>
    )
}