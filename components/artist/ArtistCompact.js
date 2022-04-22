import styles from "./ArtistCompact.module.css"
import Image from "next/image";
import Link from "next/link";

export default function ArtistCompact({artist}) {
    return (
        <Link href={`/artist/${artist.id}`} passHref>
            <div className={styles.artist}>
                <div className={styles.imageContainer}>
                    <Image
                        src={artist.filePath}
                        alt=""
                        layout="fill"
                        objectFit="cover"
                    />
                </div>

                <h2>{artist.name}</h2>
            </div>
        </Link>
    )
}