import styles from "./ArtistCompact.module.css"
import {ImageConfigContext} from "next/dist/shared/lib/image-config-context";
import Image from "next/image";
import Link from "next/link";

export default function ArtistCompact({artist}) {
    return (
        <Link href={`/artist/${artist.id}`} passHref>
            <div className={styles.artist}>
                <div className={styles.imageContainer}>
                    <Image
                        src={`/albumcovers/${artist.imagePath}`}
                        alt=""
                        layout="fill"
                        objectFit="contain"
                    />
                </div>

                <h2>{artist.name}</h2>
            </div>
        </Link>
    )
}