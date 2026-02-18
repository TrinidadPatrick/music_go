import React, { createContext, useContext, useEffect, useState } from 'react'
import http from '../../http'
import { useNavigate } from 'react-router-dom'

const stateContext = createContext({
    user: null,
    setUser: () => { },
    getUser: () => { },
    isAuthenticated: null,
    setIsAuthenticated: () => { },
})

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(null)

    const getUser = async () => {
        try {
            const result = await http.get('/user/me', {
                withCredentials: true
            })
            setUser(result.data)
            setIsAuthenticated(true)
        } catch (error) {
            if (error.status === 401) {
                setIsAuthenticated(false)
            }

        }
    }

    useEffect(() => {
        // getUser()
    }, [])

    return (
        <stateContext.Provider value={{ user, setUser, getUser, isAuthenticated, setIsAuthenticated }}>
            {children}
        </stateContext.Provider>
    )
}

export const useAuth = () => useContext(stateContext)