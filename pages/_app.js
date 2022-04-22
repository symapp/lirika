import Header from "@components/Header"
import useSession from "@lib/session"
import Link from "next/link"
import "./_app.css"
import {useRouter} from "next/router";

export default function App({Component, pageProps}) {
    const router = useRouter()
    const session = useSession()
    const newPageProps = {
        ...pageProps,
        session
    }

    // document.querySelectorAll('h3, h4, h5, h6, p').forEach(function (elem) {
    //     if (parseFloat(window.getComputedStyle(elem).width) === parseFloat(window.getComputedStyle(elem.parentElement).width)) {
    //         elem.setAttribute('title', elem.textContent);
    //     }
    // });

    return (
        <>
            <Header>
                <Link href="/" passHref>
                    Home
                </Link>
                <Link href="/song" passHref>
                    Songs
                </Link>
                <Link href="/album" passHref>
                    Albums
                </Link>
                <Link href="/artist" passHref>
                    Artists
                </Link>
                {
                    session.user
                        ?
                        <div onClick={() => {
                            session.logout();
                            router.push("/")
                        }}>
                            Logout
                        </div>
                        :
                        <Link href="/login" passHref>
                            Login
                        </Link>
                }
                {
                    !session.user &&
                    <Link href="/signup" passHref>
                        Sign Up
                    </Link>
                }
            </Header>

            <main className="page">
                <Component {...newPageProps} />
            </main>
        </>
    )
}