import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {getRawSongById, updateSong} from "@lib/api";
import {useRedirectToLogin} from "@lib/session";
import styles from "./lyrics.module.css";

export default function LyricsPage({session}) {
    useRedirectToLogin(session)

    const router = useRouter()
    const {id} = router.query
    const [song, setSong] = useState(null)
    const [lyrics, setLyrics] = useState([])
    const [error, setError] = useState("")

    useEffect(() => {
        if (!id) return

        const getSong = async () => {
            try {
                const song = await getRawSongById(id)
                setSong(song)
                setLyrics(song.lyrics)
            } catch (e) {
                router.push("/404")
            }
        }

        getSong()
    }, [router, id])

    const onChange = (e) => {
        const newLyrics = lyrics.map((lyrics) => {
            if (lyrics.groupId.toString() === e.target.className) {
                return {
                    ...lyrics,
                    [e.target.name]: e.target.value
                }
            }
            return lyrics
        })

        setLyrics(newLyrics)
    }

    const addLyrics = () => {
        const id = lyrics.length > 0 ? Math.max(...lyrics.map(lyrics => lyrics.groupId)) + 1 : 1

        setLyrics([
            ...lyrics,
            {
                groupId: id,
                groupName: "",
                text: ""
            }
        ])
    }

    const deleteLastPart = async () => {
        if (lyrics.length < 1) return

        lyrics.pop()

        setLyrics([...lyrics])
    }

    const save = async (e) => {
        e.preventDefault()

        for (const lyric of lyrics) {
            if (lyric.text.trim() === "" && lyrics.groupName !== "Instrumental") {
                setError("aösldkfjöaksl")
                return
            }
        }

        try {
            await updateSong(session.accessToken,
                {
                    ...song,
                    lyrics: lyrics
                })
            await router.push(`/song/${id}`)
        } catch (e) {
            alert("Couldn't update lyrics")
        }
    }

    return lyrics && (
        <div className={styles.lyrics}>
            <form>
                <h3>Lyrics</h3>
                {
                    lyrics.length > 0
                        ?
                        lyrics.map((group) => {
                            return (
                                <div key={group.groupId} className={styles.group}>
                                    <select required name="groupName" className={group.groupId} value={group.groupName} onChange={onChange}>
                                        <option value="" selected disabled hidden>Tag</option>
                                        <option value="Intro">Intro</option>
                                        <option value="Verse">Verse</option>
                                        <option value="Pre-chorus">Pre-chorus</option>
                                        <option value="Chorus">Chorus</option>
                                        <option value="Hook">Hook</option>
                                        <option value="Bridge">Bridge</option>
                                        <option value="Outro">Outro</option>
                                        <option value="Instrumental">Instrumental</option>
                                    </select>
                                    <textarea name="text" className={group.groupId} value={group.text} onChange={onChange}/>
                                </div>
                            )
                        })
                        :
                        <h4>There are no lyrics</h4>
                }

                <div className={["buttonsLeft", styles.buttons].join(" ")}>
                    <button onClick={addLyrics}>Add part</button>
                    <button onClick={deleteLastPart}>Delete last part</button>
                    <button type="submit" onClick={save}>Save</button>
                    <button onClick={() => router.push(`/song/${id}`)}>Cancel</button>
                </div>
            </form>
        </div>
    )
}