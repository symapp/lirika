import styles from "./index.module.css"
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Image from "next/image";
import {getAlbumById} from "@lib/api";
import AlbumList from "@components/album/AlbumList";
import SongList from "@components/song/SongList";

function getFormattedTime(time) {
    return Math.floor(time / 60) + ':' + (new Array(2 + 1).join("0") + (time % 60)).slice(-2)
}

export default function AlbumPage({session}) {
    const router = useRouter()
    const {id} = router.query
    const [album, setAlbum] = useState(null)
    const [albumLength, setAlbumLength] = useState(0)
    const [songsForList, setSongsForList] = useState([])

    useEffect(() => {
        if (!id) return
        const getAlbum = async () => {
            try {
                const album = await getAlbumById(id)
                setAlbum(album)
            } catch (e) {
                alert(e)
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

    return album && (
        <div className={styles.album}>
            <header>
                <div className={styles.imageContainer}>
                    <Image
                        src={`/../public/albumcovers/${album.coverImage}`}
                        alt="cover"
                        layout="fill"
                        objectFit="contain"
                    />
                </div>
                <div className={styles.albumInfo}>
                    <h1>{album.name}</h1>
                    <h2>
                        {
                            album.artists.map((artist) => {
                                return artist.name
                            }).join(", ")
                        } - {
                        album.year
                    } - {
                        getFormattedTime(albumLength)
                    }
                    </h2>
                </div>
            </header>
            <div className={styles.songs}>
                <SongList songs={album.songs} session={session} album={album} numbers={true}/>
            </div>
        </div>
    )
}