import styles from "./add.module.css"
import SongForm from "@components/song/SongForm";

export default function AddSongPage({session}) {
    return (
        <div>
            <h1>Add new song</h1>
            <SongForm session={session} />
        </div>
    )
}