import {useRedirectToHome} from "@lib/session";
import {useState} from "react";
import {useRouter} from "next/router";
import {login} from "@lib/api";
import styles from "./login.module.css"

const defaultUser = {
    email: "",
    password: ""
}

export default function LoginPage({session}) {
    useRedirectToHome(session)

    const router = useRouter()

    const [user, setUser] = useState(defaultUser)
    const [error, setError] = useState("")

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value

        setUser({
            ...user,
            [name]: value
        })

        if (error) {
            setError("")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await login(user)
            session.login(response)
            await router.push("/")
        } catch (e) {
            if (e.status === 400) {
                setError("validation failed")
            } else {
                alert("Couldn't login...")
            }
        }
    }

    return (
        <div className={styles.login}>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" name="email" id="email" onChange={handleChange} value={user.email}/>
                </fieldset>
                <fieldset>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" onChange={handleChange} value={user.password}/>
                </fieldset>
                <div className={"buttons"}>
                    {error && <p className={"error"}>{error}</p>}
                    {!error && <button type={"submit"}>LOGIN</button>}
                </div>
            </form>
        </div>
    )

}