import styles from "./Header.module.css"
import {useState} from "react";
import Image from "next/image";

export default function Header({children}) {
    const [showMenu, setShowMenu] = useState(false)

    const toggleVisible = () => {
        setShowMenu(!showMenu)
    }

    return (
        <div className={styles.main}>
            <div className={styles.topMenu}>
                <div onClick={toggleVisible} className={styles.imageContainer}>
                    <Image
                        src="/other/menu.svg"
                        alt="menu button"
                        layout="fill"
                        objectFit="initial"
                    />
                </div>
            </div>
            <header className={[styles.header, !showMenu ? styles.hidden : null].join(" ")}
                    onClick={() => setShowMenu(false)}>
                {children}
            </header>
        </div>
    )
}