import styles from "./index.module.css"
import {useRouter} from "next/router";
import {useEffect} from "react";

export default function IndexPage() {
    const router = useRouter()

    useEffect(() => {
        router.push("/song")
    }, [])

    return (
        <div className={styles.posts}>

        </div>
    )
}