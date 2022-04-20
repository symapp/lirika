import styles from "./signup.module.css"
import {useRouter} from "next/router";
import {useState} from "react";
import {getAllUsers, login, register} from "@lib/api";
import {useRedirectToHome} from "@lib/session";

const defaultUser = {
    email: "",
    name: "",
    password: "",
    roles: [],
    likedSongsIds: []
}

const defaultErrors = {
    email: "",
    name: "",
    password: ""
}

export default function SignUpPage({session}) {
    useRedirectToHome(session)

    const router = useRouter()

    const [user, setUser] = useState(defaultUser)
    const [error, setError] = useState("")
    const [errors, setErrors] = useState({...defaultErrors})

    const validate = async  (user) => {
        const users = await getAllUsers()

        let errors = {...defaultErrors}

        let isValid = true

        if (users.map((user) => user.email).includes(user.email)) {
            errors.email = "This E-Mail is already registered"
            isValid=false
        }

        return { errors, isValid }
    }

    const handleChange = (e) => {
        const name = e.target.name
        const value = e.target.value

        setUser({
            ...user,
            [name]: value
        })

        setErrors({
            ...errors,
            [name]: ""
        })

        if (error) {
            setError("")
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors(defaultErrors)

        const result = await validate(user)

        if (!result.isValid) {
            setErrors(result.errors)
            setError("validation failed")
            return
        }

        try {
            const response = await register(user)
            session.login(response)
            await router.push("/")
        } catch (e) {
            if (e.status === 400) {
                setError("validation failed")
            } else {
                alert(e)
            }
        }
    }

    return (
        <div className={styles.signup}>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <label htmlFor="email">E-Mail</label>
                    <input type="email" name="email" id="email" onChange={handleChange} value={user.email}/>
                    {errors.email && <div className={styles.error}>{errors.email}</div>}
                </fieldset>
                <fieldset>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" onChange={handleChange} value={user.name}/>
                </fieldset>
                <fieldset>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" onChange={handleChange} value={user.password}/>
                </fieldset>
                <div className={"buttons"}>
                    {error && <p className={"error"}>{error}</p>}
                    {!error && <button type={"submit"}>SIGN UP AND LOGIN</button>}
                </div>
            </form>
        </div>
    )
}