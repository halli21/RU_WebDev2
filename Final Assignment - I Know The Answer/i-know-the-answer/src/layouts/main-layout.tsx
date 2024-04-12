import { Container, Flex, Box, Text, Avatar, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../services/user-service";
import { useSelector } from "react-redux";
import { IRootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { setLogout, setUser } from "../redux/features/user/user-slice";
import { themeVars } from "../themes/theme.css";
import { getMatches } from "../redux/features/match/match-slice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useLocation } from "react-router-dom";

export function MainLayout() {
  const user = useSelector((state: IRootState) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  const [finished, setFinshed] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getMatches());
  }, [dispatch, location]);

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
        setFinshed(true);
      }
    }

    validateUserSession();
  }, [dispatch, navigate, user]);

  async function logout() {
    await logoutUser();
    dispatch(setLogout());
    navigate("/");
  }

  return (
    <Flex height="100%">
      <Box
        style={{
          position: "fixed",
          width: 225,
          height: "100vh",
          backgroundColor: themeVars.colors.teal,
          color: "white",
          fontSize: 18,
          fontWeight: 700,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 40,
        }}
      >
        <Avatar size="lg" src={user.avatar} />{" "}
        <Text
          style={{
            paddingTop: 10,
          }}
        >
          {user.displayName}
        </Text>
        <Button
          onClick={logout}
          style={{
            marginTop: 480,
            borderRadius: 3,
            backgroundColor: themeVars.colors.lightBlue,
            width: "125px",
            fontWeight: 900,
          }}
        >
          Logout
        </Button>
      </Box>

      <Box
        style={{
          display: "flex",
          flex: 1,
          paddingLeft: "250px",
        }}
      >
        <Container
          style={{
            maxWidth: "100%",
            height: "100%",
          }}
        >
          {finished && <Outlet />}
        </Container>
      </Box>
    </Flex>
  );
}
