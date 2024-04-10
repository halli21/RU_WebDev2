import { Container, Flex, Box, Text, Avatar, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../services/user-service";
import { useSelector } from "react-redux";
import { IRootState } from "../redux/store";
import { useDispatch } from "react-redux";
import { setLogout, setUser } from "../redux/features/user/user-slice";
import { themeVars } from "../themes/theme.css";
import { getMatches } from "../redux/features/match/match-slice";
import { ThunkDispatch } from "@reduxjs/toolkit";

export function MainLayout() {
  const user = useSelector((state: IRootState) => state.user);

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

  async function logout() {
    try {
      await logoutUser();

      dispatch(setLogout());

      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
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
            marginTop: 500,
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
          <Outlet />
        </Container>
      </Box>
    </Flex>
  );
}
