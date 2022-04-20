import styles from "./Song.module.css"
import {useEffect, useState} from "react";
import {getAlbumCoverFileName, getLikedSongsByUserId} from "@lib/api";
import Image from "next/image";
import likedImg from "../public/liked.png"
import unlikedImg from "../public/unliked.png"

function str_pad_left(string) {
    return (new Array(2 + 1).join("0") + string).slice(-2);
}

function getFormattedTime(time) {
    return Math.floor(time / 60) + ':' + str_pad_left(time % 60)
}

export default function Song({song, liked, session}) {
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

            <div className={styles.songInfo}>
                <h3>{song.name}</h3>
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