import styles from "./index.module.css"
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import Image from "next/image";
import {deleteArtist, getArtistById} from "@lib/api";
import SongList from "@components/song/SongList";
import AlbumList from "@components/album/AlbumList";
import Link from "next/link";

export default function ArtistPage({session}) {
    const router = useRouter()
    const {id} = router.query
    const [artist, setArtist] = useState(null)

    useEffect(() => {
        if (!id) return
        const getArtist = async () => {
            try {
                const artist = await getArtistById(id)
                setArtist(artist)
            } catch (e) {
                alert("Couldn't load artist...")
            }
        }

        getArtist()
    }, [id])

    const handleDelete = async (e) => {
        e.preventDefault()
        try {
            await deleteArtist(session.accessToken, id)
            await router.push("/artist")
        } catch (e) {
            alert("Couldn't delete artist...")
        }
    }

    return artist && (
        <div className={styles.artist}>
            <header>
                <div className={styles.imageContainer}>
                    <Image
                        src={artist.filePath}
                        alt="cover"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
                <div className={styles.artistInfo}>
                    <h4>Artist</h4>
                    <h1>{artist.name}</h1>
                </div>
            </header>

            {
                session.user && session.user.id === artist.userId &&
                <div className={styles.options}>
                    <div className="buttonsLeft">
                        <Link href={`/artist/${artist.id}/edit`} passHref>Edit</Link>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            }

            <div className={styles.mainContent}>
                {
                    artist.songs.length > 0 &&
                    <div className={styles.songs}>
                        <h3 className={styles.title}>Songs</h3>
                        <SongList songs={artist.songs} session={session} />
                    </div>
                }
                {
                    artist.albums.length > 0 &&
                    <div className={styles.albums}>
                        <h3 className={styles.title}>Albums</h3>
                        <AlbumList albums={artist.albums} />
                    </div>
                }
            </div>
        </div>
    )
}