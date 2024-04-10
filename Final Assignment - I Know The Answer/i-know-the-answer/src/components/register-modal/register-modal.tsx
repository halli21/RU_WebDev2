import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { registerUser } from "../../services/user-service";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [fullNameError, setFullNameError] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const toast = useToast();

  async function submitForm() {
    const isFullNameError = fullName.length < 3;
    const isUsernameError = username.length < 3;
    const isPasswordError = password.length < 8;

    setFullNameError(isFullNameError);
    setUsernameError(isUsernameError);
    setPasswordError(isPasswordError);

    if (!isFullNameError && !isUsernameError && !isPasswordError) {
      const success = await registerUser(username, fullName, password);

      if (success) {
        onClose();

        toast({
          title: "Account created.",
          description: "We've created your account for you.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Register failed.",
          description: "Username may be taken or server error.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          style={{
            borderRadius: 0,
            paddingTop: 30,
          }}
        >
          <ModalHeader
            style={{
              fontSize: 30,
              fontWeight: 700,
              paddingBottom: 30,
            }}
          >
            Register
          </ModalHeader>

          <ModalBody>
            <FormControl style={{ paddingBottom: 5 }}>
              <FormLabel style={{ fontSize: 12, fontWeight: 700 }}>
                Full name
              </FormLabel>
              <Input
                id="fullname-input"
                type="text"
                placeholder="Enter full name"
                value={fullName}
                onChange={(evt) => setFullName(evt.target.value)}
                style={{
                  borderRadius: 0,
                  borderColor: "black",
                  borderWidth: 1,
                  fontSize: 11,
                }}
              />

              <Text
                style={{ fontSize: 12, color: fullNameError ? "red" : "white" }}
              >
                Full name must be provided and at least 3 characters long.
              </Text>
            </FormControl>

            <FormControl style={{ paddingBottom: 5 }}>
              <FormLabel style={{ fontSize: 12, fontWeight: 700 }}>
                Username
              </FormLabel>
              <Input
                id="username-input"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(evt) => setUsername(evt.target.value)}
                style={{
                  borderRadius: 0,
                  borderColor: "black",
                  borderWidth: 1,
                  fontSize: 11,
                }}
              />
              <Text
                style={{ fontSize: 12, color: usernameError ? "red" : "white" }}
              >
                Username must be provided and at least 3 characters long.
              </Text>
            </FormControl>

            <FormControl style={{ paddingBottom: 5 }}>
              <FormLabel style={{ fontSize: 12, fontWeight: 700 }}>
                Password
              </FormLabel>
              <Input
                id="password-input"
                type="text"
                placeholder="Enter username"
                value={password}
                onChange={(evt) => setPassword(evt.target.value)}
                style={{
                  borderRadius: 0,
                  borderColor: "black",
                  borderWidth: 1,
                  fontSize: 11,
                }}
              />

              <Text
                style={{ fontSize: 12, color: passwordError ? "red" : "white" }}
              >
                Password must be provided and at least 8 characters long.
              </Text>
            </FormControl>
          </ModalBody>

          <ModalFooter
            style={{
              paddingBottom: 50,
              paddingTop: 0,
            }}
          >
            <Button
              onClick={onClose}
              style={{
                backgroundColor: "#426766",
                color: "white",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={submitForm}
              style={{
                backgroundColor: "#c1fdfb",
                color: "black",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Register
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
