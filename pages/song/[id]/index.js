import styles from "./index.module.css"
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getAlbumCoverFileName, getSongById, getSongWithAllInfoById} from "@lib/api";
import Image from "next/image";
import AlbumList from "@components/AlbumList";
import AlbumCompact from "@components/AlbumCompact";

function getFormattedTime(time) {
    return Math.floor(time / 60) + ':' + (new Array(2 + 1).join("0") + (time % 60)).slice(-2)
}

export default function SongPage() {
    const router = useRouter()
    const {id} = router.query
    const [song, setSong] = useState(null)

    useEffect(() => {
        if (!id) return
        const loadSong = async () => {
            try {
                const song = await getSongById(id)
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
                    <Image
                        src={`/../public/albumcovers/${song.album.coverImage}`}
                        alt="cover"
                        layout="fill"
                        objectFit="contain"
                    />
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
                            return <div key={group.id}>
                                <h4>{group.groupName}</h4>
                                {
                                    group.content.map((line) => {
                                        return <p key={line.id}>
                                            {line.text}
                                            <br/>
                                        </p>
                                    })
                                }
                            </div>
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
                    <AlbumCompact album={song.album}/>
                </div>
            </div>
        </div>
    )
}