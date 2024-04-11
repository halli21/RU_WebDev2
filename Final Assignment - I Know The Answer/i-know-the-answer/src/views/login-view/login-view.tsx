import {
  Box,
  Heading,
  FormControl,
  Text,
  Input,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { loginContainer } from "./style.css";
import { useState } from "react";
import { themeVars } from "../../themes/theme.css";
import { useNavigate } from "react-router-dom";
import { authenticateUser } from "../../services/user-service";
import { RegisterModal } from "../../components/register-modal/register-modal";

export function LoginView() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    <Box className={loginContainer}>
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
            type="text"
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
