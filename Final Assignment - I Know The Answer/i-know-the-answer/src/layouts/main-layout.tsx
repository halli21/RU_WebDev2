import { Container } from "@chakra-ui/react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getUser } from "../services/user-service";

export function MainLayout() {
    const navigate = useNavigate();

    useEffect(() => {
        async function validateUserSession() {
            const session = await getUser();

            if (!session) {
                navigate("/");
            }
        }

        validateUserSession();
    }, []);


    return (
        <Container height="100%">
            <Outlet />
        </Container>
    )
}