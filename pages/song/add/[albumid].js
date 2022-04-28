import styles from "./albumid.module.css"
import {useRouter} from "next/router";

export default function AddSongToAlbumPage({session}) {
    const router = useRouter()
    const {albumId} = router.query

    return (
        <div>
            {albumId}
        </div>
    )
}