import { 
    Container,
    Flex,
    Box,
    Heading,
    Avatar
} from "@chakra-ui/react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getUser } from "../services/user-service";
import { useSelector } from "react-redux";
import { IRootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/user/user-slice";
import { themeVars } from "../themes/theme.css";
import { getMatches } from "../redux/features/match/match-slice";
import { ThunkDispatch } from "@reduxjs/toolkit";


export function MainLayout() {
    const user = useSelector((state: IRootState) => state.user);
    const match = useSelector((state: IRootState) => state.match);

    const navigate = useNavigate();
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();


    useEffect(() => {    
        dispatch(getMatches());
    }, [dispatch]);


    useEffect(() => {
        async function validateUserSession() {
            if (Object.keys(user).length > 0) {
                return;
            }

            const session = await getUser();

            if (!session) {
                navigate("/");
            } else {
                dispatch(setUser(session));
            }
        }

        validateUserSession();
    }, [dispatch, navigate, user]);



    return (
        <Flex height="100%">
            <Box width="250px" bg={themeVars.colors.teal} color="white" position="fixed" height="100vh" overflowY="auto">
                <Avatar
                    size='lg'
                    src={user.avatar}
                />{' '}
              
                <Heading as="h3" size="lg">{user.displayName}</Heading>
               
            </Box>

            <Box pl="250px" flex="1">
                <Container maxW="container.xl" height="100%">
                    <Outlet />
                </Container>
            </Box>
        </Flex>
    )
}