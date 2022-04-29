import styles from "./SongList.module.css"
import SongCompact from "@components/song/SongCompact";
import {useEffect, useState} from "react";
import {getLikedSongIdsByUserId, setLikedSongsTo} from "@lib/api";

export default function SongList({songs, session, album, numbers, search}) {
    const [likedSongs, setLikedSongs] = useState([])
    const [query, setQuery] = useState("")
    const [searchParam, setSearchParam] = useState("")
    const [shownSongs, setShownSongs] = useState([])

    useEffect(() => {
        if (!session.user) return

        const getLikedSongs = async () => {
            try {
                const likedSongs = await getLikedSongIdsByUserId(session, session.user.id)
                setLikedSongs(likedSongs)
            } catch (e) {
                alert("Couldn't load liked songs...")
            }
        }


        getLikedSongs()
    }, [session])


    useEffect(() => {
        setShownSongs(songs)
    }, [songs])


    const updateLikedSongs = async (newLikedSongs) => {
        setLikedSongs(newLikedSongs)

        try {
            await setLikedSongsTo(session, newLikedSongs)
        } catch (e) {
            alert("Couldn't update liked songs...")
        }
    }

    const onChange = (e) => {
        const value = e.target.value
        setQuery(value)
    }

    const onChangeSelect = (e) => {
        const value = e.target.value
        setSearchParam(value)
    }


    useEffect(() => {
        const newSongs = songs.filter((song) => {
            if (!search || (query.length === 0 && query === "liked")) {
                return true
            } else if (searchParam === "") {
                return song.name.toLowerCase().includes(query.toLowerCase().trim()) || song.album.name.toLowerCase().includes(query.toLowerCase().trim())
            } else if (searchParam === "song") {
                return song.name.toLowerCase().includes(query.toLowerCase().trim())
            } else if (searchParam === "album") {
                return song.album.name.toLowerCase().includes(query.toLowerCase().trim())
            } else if (searchParam === "liked") {
                return likedSongs.includes(song.id)
            }
            return true
        })

        setShownSongs([...newSongs])
    }, [query, searchParam])


    return shownSongs && (
        <div className={[styles.songList, numbers && styles.numbered].join(" ")}>
            {
                search && <div className={styles.searchBar}>
                    <select value={searchParam} onChange={onChangeSelect}>
                        <option value="">All</option>
                        <option value="song">Song</option>
                        <option value="album">Album</option>
                        {
                            session.user &&
                            <option value="liked">Liked</option>
                        }
                    </select>
                    <input value={query} onChange={onChange} placeholder="search word"/>
                </div>
            }


            {
                shownSongs.sort((a, b) => a.lastEdit - b.lastEdit).map((song) => {
                    return (
                        <div key={song.id} className={numbers && styles.songContainer}>
                            {numbers && <h6 className={styles.indexes}>{song.indexInAlbum}</h6>}
                            <SongCompact song={song} album={album} session={session} likedSongs={likedSongs}
                                         setLikedSongs={updateLikedSongs}/>
                        </div>

                    )
                })
            }
            {
                shownSongs.length === 0 &&
                <h3 className={styles.middle}>No songs</h3>
            }
        </div>
    )
}