import styles from "./add.module.css"
import AlbumForm from "@components/album/AlbumForm";
import {useRedirectToLogin} from "@lib/session";

export default function AddAlbumPage({session}) {
    useRedirectToLogin(session)

    return session.user && (
        <div className={styles.addAlbum}>
            <h1>Add new album</h1>
            <AlbumForm session={session}/>
        </div>
    )
}