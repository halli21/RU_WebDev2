import styles from "./login.module.css";
import { useState } from "react";

import { Input } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'

import { User } from "../../types/user";
import { UserLogin } from "../../types/userLogin";

import { authenticateUser } from "../../services/auth-service";

import { RegisterModal } from "../../components/register-modal/register-modal";

import { useDisclosure } from '@chakra-ui/react'

export const Login = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [username, setUsername] = useState('testing2@testing2.com');
    const [password, setPassword] = useState('password');

    const [user, setUser] = useState<User|null>(null);

    const handleLogin = async () => {
        const userInfo: UserLogin = { username, password };
        const userRecived = await authenticateUser(userInfo);
        console.log('userRecived', userRecived)
        setUser(userRecived);
    };

    return (
        <div>
            <h1>I Know the Answer!</h1>
            <Input placeholder='Enter your username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder='Enter your password' value={password} onChange={(e) => setPassword(e.target.value)} />

            <Button colorScheme='blue' onClick={onOpen}>Register</Button>
            <RegisterModal isOpen={isOpen} onClose={onClose} />

            <Button colorScheme='teal' onClick={() => handleLogin()}>Login</Button>

            <div>
                <p>{user?.id}</p>
                <p>{user?.username}</p>
                <p>{user?.displayName}</p>
            </div>
        </div>
    )
}