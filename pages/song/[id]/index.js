import styles from "./index.module.css"
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {deleteSong, getSongById} from "@lib/api";
import Image from "next/image";
import AlbumCompact from "@components/album/AlbumCompact";
import Link from "next/link";

function getFormattedTime(time) {
    return Math.floor(time / 60) + ':' + (new Array(2 + 1).join("0") + (time % 60)).slice(-2)
}

export default function SongPage({session}) {
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

    const handleDelete = async (e) => {
        e.preventDefault()
        try {
            await deleteSong(session, id)
            await router.push("/song")
        } catch (e) {
            alert("Couldn't delete song...")
        }
    }

    return song && (
        <div className={styles.song}>
            <header>
                <Link href={`/album/${song.album.id}`} passHref>
                    <div className={styles.imageContainer}>
                        {
                            song.filePath
                                ?
                                <Image
                                    src={song.filePath}
                                    alt="cover"
                                    layout="fill"
                                    objectFit="cover"
                                />
                                :
                                <Image
                                    src={song.album.filePath}
                                    alt="cover"
                                    layout="fill"
                                    objectFit="cover"
                                />
                        }
                    </div>
                </Link>
                <div className={styles.songInfo}>
                    <h6>Song</h6>
                    <h1>{song.name}</h1>
                    <h2>
                        {
                            song.artists.length > 0 ?
                                song.artists.map((artist) => {
                                    return <Link href={`/artist/${artist.id}`} passHref key={artist.id}>
                                        {artist.name}
                                    </Link>
                                }).reduce((prev, curr) => [prev, ', ', curr])
                                :
                                <>unknown</>
                        } - {
                        song.album.year
                    } - {
                        getFormattedTime(song.length)
                    }
                    </h2>
                </div>
            </header>
            <hr/>
            {
                session.user && session.user.id === song.userId &&
                <div className="buttonsLeft">
                    <Link href={`/album/${song.id}/edit`} passHref>Edit</Link>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            }
            <div className={styles.mainContent}>
                <div className={styles.lyrics}>
                    <h3>Lyrics</h3>
                    {
                        song.lyrics.length > 0 ?
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
                            :
                            <h4>There are no lyrics avalable</h4>
                    }
                </div>
                <div className={styles.otherInfo}>
                    {
                        song.genres.length > 0 &&
                        <>
                            <h3>Genres</h3>
                            <div className={styles.genres}>
                                {song.genres.map((genre) => {
                                    return <li key={genre}>
                                        {genre}
                                    </li>
                                })}
                            </div>
                        </>
                    }
                    <h3>Album</h3>
                    <AlbumCompact album={song.album}/>
                </div>
            </div>
        </div>
    )
}