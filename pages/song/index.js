import {useEffect, useState} from "react";
import {getAllSongs} from "@lib/api";
import SongList from "@components/song/SongList";
import Link from "next/link";

export default function SongsPage({session}) {
    const [songs, setSongs] = useState([])

    useEffect(() => {
        const getSongs = async () => {
            try {
                const songs = await getAllSongs()
                setSongs(songs)
            } catch (e) {
                alert("Couldn't load song...")
            }
        }

        getSongs()
    }, [])

    return (
        <div>
            <h1>Songs</h1>
            <SongList songs={songs} session={session} smaller={true}/>
            <div className="buttons">
                {session.user && <Link href="/album" passHref>You can only add songs to albums.</Link>}
            </div>
        </div>
    )
}