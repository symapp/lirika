import styles from "./add.module.css"
import ArtistForm from "@components/artist/ArtistForm";
import {useRedirectToLogin} from "@lib/session";

export default function AddArtistPage({session}) {
    useRedirectToLogin(session)

    return session.user && (
        <div className={styles.addArtist}>
            <h1>Add new artist</h1>
            <ArtistForm session={session}/>
        </div>
    )
}