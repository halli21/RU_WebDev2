import styles from "./login.module.css";
import { useState } from "react";

import { Input } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'

import { User } from "../../types/user";
import { UserLogin } from "../../types/userLogin";

import { loginUser } from "../../services/auth-service";


export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [user, setUser] = useState<User|null>(null);

    const handleLogin = async () => {
        const userInfo: UserLogin = { username, password };
        const userRecived = await loginUser(userInfo);
        console.log('userRecived', userRecived)
        setUser(userRecived);
    };

    return (
        <div>
            <h1>I Know the Answer!</h1>
            <Input placeholder='Enter your username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button colorScheme='teal' onClick={() => handleLogin()}>Register</Button>
            <Button colorScheme='teal' onClick={() => handleLogin()}>Login</Button>


            <div>
                <p>{user?.id}</p>
                <p>{user?.username}</p>
                <p>{user?.displayName}</p>
            </div>
        </div>
    )
}