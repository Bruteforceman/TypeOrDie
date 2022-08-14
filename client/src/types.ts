import React from "react"

export type Setter <T> = React.Dispatch<React.SetStateAction<T>>;

export interface User {
    username : string,
    email: string
}

export interface UserProp {
    user: User | null,
    setUser: Setter <User | null>
}