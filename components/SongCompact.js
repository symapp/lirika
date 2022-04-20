import styles from "./SongCompact.module.css"
import {useEffect, useState} from "react";
import {getAlbumCoverFileName, getLikedSongsByUserId} from "@lib/api";
import Image from "next/image";
import likedImg from "../public/liked.png"
import unlikedImg from "../public/unliked.png"
import Link from "next/link";
import {useRouter} from "next/router";

function getFormattedTime(time) {
    return Math.floor(time / 60) + ':' + (new Array(2 + 1).join("0") + (time % 60)).slice(-2)
}

export default function SongCompact({song, liked, session}) {
    const router = useRouter()
    const [imagePath, setImagePath] = useState()

    useEffect(() => {
        const getAlbumCoverImagePath = async () => {
            const AlbumCoverImagePath = await getAlbumCoverFileName(song.albumId)
            setImagePath(AlbumCoverImagePath)
        }

        getAlbumCoverImagePath()
    }, [song.albumId])

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
                <Link href={`/song/${song.id}`} passHref>
                    <h3>{song.name}</h3>
                </Link>
                <p>{getFormattedTime(song.length)}</p>
                <h4>{song.likes}</h4>
            </div>

            {session.user &&
                <div className={styles.likeImageContainer}>
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