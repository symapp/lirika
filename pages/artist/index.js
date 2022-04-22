import styles from "./index.module.css"
import {useEffect, useState} from "react";
import {getAllArtists} from "@lib/api";
import ArtistList from "@components/artist/ArtistList";

export default function ArtistsPage({ session }) {
    const [artists, setArtists] = useState([])

    useEffect(() => {
        const getArtists = async () => {
            try {
                const artists = await getAllArtists()
                setArtists(artists)
            } catch (e) {
                alert(e)
            }
        }

        getArtists()
    }, [])

    return (
        <div>
            <h1>Artists</h1>
            <ArtistList artists={artists} />
        </div>
    )
}