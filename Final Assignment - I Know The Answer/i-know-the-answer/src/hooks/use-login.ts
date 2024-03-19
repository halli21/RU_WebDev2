import { useEffect, useState } from "react";
import { loginUser } from "../services/auth-service";
import { User } from "../types/user";
import { UserLogin } from "../types/userLogin";



export const useLogin = (userInfo : UserLogin) => {
    const [user, setUser] = useState<User|undefined>(undefined);
    useEffect(() => {
        async function authenticateUser() {
            // Assume `loginUser` returns a `User`, or handle the error if not
            try {
                const response = await loginUser(userInfo);
                if (response) {
                    // Make sure the response is a User before setting it
                    setUser(response as User);
                }
            } catch (error) {
                console.error("Login failed:", error);
                // Handle the error state appropriately
                setUser(undefined);
            }
        }

        authenticateUser();
        // Include userInfo as a dependency so this effect runs when userInfo changes
    }, [userInfo]);


    return user;
}