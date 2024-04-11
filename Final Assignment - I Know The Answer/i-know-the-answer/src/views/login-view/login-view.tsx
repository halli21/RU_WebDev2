import {
  Box,
  Heading,
  FormControl,
  Input,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { themeVars } from "../../themes/theme.css";
import { useNavigate } from "react-router-dom";
import { authenticateUser, getUser } from "../../services/user-service";
import { RegisterModal } from "../../components/register-modal/register-modal";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { setUser } from "../../redux/features/user/user-slice";
import { ThunkDispatch } from "@reduxjs/toolkit";

export function LoginView() {
  const user = useSelector((state: IRootState) => state.user);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  useEffect(() => {
    async function validateUserSession() {
      if (Object.keys(user).length > 0) {
        return;
      }

      const session = await getUser();

      if (session) {
        dispatch(setUser(session));
        navigate("/dashboard");
      }
    }

    validateUserSession();
  }, [dispatch, navigate, user]);

  async function submitForm() {
    const user = await authenticateUser(username, password);

    if (user) {
      navigate("/dashboard");
    } else {
      toast({
        title: "Invalid credentials.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }

  return (
    <Box
      style={{
        backgroundColor: themeVars.colors.teal,
        display: "grid",
        alignContent: "center",
        justifyContent: "center",
        height: "100%",
        gap: 20,
      }}
    >
      <Heading color={themeVars.colors.white} fontWeight={300} fontSize={64}>
        I Know the Answer!
      </Heading>
      <form
        style={{
          display: "grid",
          alignContent: "center",
          justifyContent: "center",
          paddingTop: 30,
        }}
      >
        <FormControl>
          <Input
            style={{
              color: "black",
              borderRadius: "0px",
              backgroundColor: "white",
              fontSize: "11px",
              paddingLeft: "24px",
              marginBottom: "10px",
              width: "400px",
            }}
            id="username-input"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
          />
        </FormControl>
        <FormControl>
          <Input
            type="password"
            style={{
              color: "black",
              borderRadius: "0px",
              backgroundColor: "white",
              fontSize: "11px",
              paddingLeft: "24px",
              marginBottom: "10px",
              width: "400px",
            }}
            id="password-input"
            placeholder="Enter your password"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
          />
        </FormControl>
        <Box
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            justifyItems: "center",
            padding: "0 50px",
            paddingTop: 20,
          }}
        >
          <Button
            style={{
              borderRadius: 3,
              backgroundColor: themeVars.colors.lightBlue,
              width: "125px",
              fontWeight: 900,
            }}
            onClick={onOpen}
          >
            Register
          </Button>
          <Button
            style={{
              borderRadius: 3,
              backgroundColor: themeVars.colors.lightBlue,
              width: "125px",
              fontWeight: 900,
            }}
            onClick={() => submitForm()}
          >
            Login
          </Button>
        </Box>
      </form>
      <RegisterModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
}
function dispatch(arg0: any) {
  throw new Error("Function not implemented.");
}
