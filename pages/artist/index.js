import {useEffect, useState} from "react";
import {getAllArtists} from "@lib/api";
import ArtistList from "@components/artist/ArtistList";
import Link from "next/link";

export default function ArtistsPage({session}) {
    const [artists, setArtists] = useState([])

    useEffect(() => {
        const getArtists = async () => {
            try {
                const artists = await getAllArtists()
                setArtists(artists)
            } catch (e) {
                alert("Couldn't load artists...")
            }

        }

        getArtists()
    }, [])

    return (
        <div>
            <h1>Artists</h1>
            <ArtistList artists={artists}/>
            <div className="buttons">
                {session.user && <Link href="/artist/add" passHref>Add</Link>}
            </div>
        </div>
    )
}