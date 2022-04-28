import styles from "./index.module.css"
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Image from "next/image";
import {deleteAlbum, getAlbumById} from "@lib/api";
import SongList from "@components/song/SongList";
import Link from "next/link";

function getFormattedTime(time) {
    return Math.floor(time / 60) + ':' + (new Array(2 + 1).join("0") + (time % 60)).slice(-2)
}

export default function AlbumPage({session}) {
    const router = useRouter()
    const {id} = router.query
    const [album, setAlbum] = useState(null)
    const [albumLength, setAlbumLength] = useState(0)

    useEffect(() => {
        if (!id) return
        const getAlbum = async () => {
            try {
                const album = await getAlbumById(id)
                setAlbum(album)
            } catch (e) {
                alert("Couldn't load album...")
            }
        }

        getAlbum()
    }, [id])

    useEffect(() => {
        if (!album) return

        let length = 0
        album.songs.forEach((song) => {
            length += song.length
        })
        setAlbumLength(length)
    }, [album])

    const handleDelete = async (e) => {
        e.preventDefault()
        try {
            await deleteAlbum(session.accessToken, id)
            await router.push("/album")
        } catch (e) {
            alert("Couldn't delete album...")
        }
    }

    return album && (
        <div className={styles.album}>
            <header>
                <div className={styles.imageContainer}>
                    <Image
                        src={album.filePath}
                        alt="cover"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div className={styles.albumInfo}>
                    <h4>Album</h4>
                    <h1>{album.name}</h1>
                    <h2>
                        {
                            album.artists.length > 0
                            ?
                            album.artists.map((artist) => {
                                return <Link href={`/artist/${artist.id}`} passHref key={artist.id}>
                                    {artist.name}
                                </Link>
                            }).reduce((prev, curr) => [prev, ', ', curr])
                            :
                                <>Unknown</>
                        } - {
                        album.year
                    } - {
                        getFormattedTime(albumLength)
                    }

                    </h2>
                </div>
            </header>
            <hr/>
            {
                session.user && session.user.id === album.userId &&
                <div>
                    <div className="buttonsLeft">
                        <Link href={`/album/${album.id}/edit`} passHref>Edit</Link>
                        <button onClick={handleDelete}>Delete</button>
                        <Link href={`/song/add/${album.id}`} passHref>Add Song</Link>
                    </div>
                </div>
            }
            <div className={styles.songs}>
                <SongList songs={album.songs} session={session} album={album} numbers={true}/>
            </div>
        </div>
    )
}