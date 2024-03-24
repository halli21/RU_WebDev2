import { Container } from "@chakra-ui/react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getUser } from "../services/user-service";
import { useSelector } from "react-redux";
import { IRootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/user/user-slice";

export function MainLayout() {
    const user = useSelector((state: IRootState) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        <Container height="100%">
            <Outlet />
        </Container>
    )
}