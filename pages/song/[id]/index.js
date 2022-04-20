import styles from "./index.module.css"
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getAlbumCoverFileName, getSongById, getSongWithAllInfoById} from "@lib/api";
import Image from "next/image";

function getFormattedTime(time) {
    return Math.floor(time / 60) + ':' + (new Array(2 + 1).join("0") + (time % 60)).slice(-2)
}

export default function SongPage({session}) {
    const router = useRouter()
    const {id} = router.query
    const [song, setSong] = useState(null)
    const [imagePath, setImagePath] = useState()

    useEffect(() => {
        if (!song) return

        const getAlbumCoverImagePath = async () => {
            const AlbumCoverImagePath = await getAlbumCoverFileName(song.albumId)
            setImagePath(AlbumCoverImagePath)
        }

        getAlbumCoverImagePath()
    }, [song])

    useEffect(() => {
        if (!id) return
        const loadSong = async () => {
            try {
                const song = await getSongWithAllInfoById(id)
                setSong(song)
            } catch (e) {
                if (e.status === 404) router.push("/404")
            }
        }

        loadSong()

    }, [id, router])

    return song && (
        <div className={styles.song}>
            <header>
                <div className={styles.imageContainer}>
                    {
                        imagePath &&
                        <Image
                            src={`/../public/albumcovers/${imagePath}`}
                            alt="cover"
                            layout="fill"
                            objectFit="contain"
                        />
                    }
                </div>
                <div className={styles.songInfo}>
                    <h1>{song.name}</h1>
                    <h2>
                        {
                            song.artists.map((artist) => {
                                return artist.name
                            }).join(", ")
                        } - {
                        song.album.year
                    } - {
                        getFormattedTime(song.length)
                    }
                    </h2>
                </div>
            </header>

            <div className={styles.mainContent}>
                <div className={styles.lyrics}>
                    <h3>Lyrics</h3>
                    {
                        song.lyrics.map((group) => {
                            return <>
                                <h4>{group.groupName}</h4>
                                <p>
                                    {
                                        group.content.map((line) => {
                                            return <>
                                                {line.text}
                                                <br/>
                                            </>
                                        })
                                    }
                                </p>
                            </>
                        })
                    }
                </div>
                <div className={styles.otherInfo}>
                    <h3>Genres</h3>
                    <div className={styles.genres}>
                        {song.genres.map((genre) => {
                            return <li key={genre}>
                                {genre}
                            </li>
                        })}
                    </div>
                    <h3>Album</h3>
                    TODO
                </div>
            </div>
        </div>
    )
}