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
    FormErrorMessage
} from '@chakra-ui/react'
import { useState } from 'react';
import { registerUser } from '../../services/user-service';
import { themeVars } from '../../themes/theme.css';



interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
  }

export const RegisterModal = ({ isOpen, onClose }: RegisterModalProps) => {
    const [fullName, setFullName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
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
                    title: 'Account created.',
                    description: "We've created your account for you.",
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                })
            } else {

                toast({
                    title: 'Register failed.',
                    description: "Username may be taken or server error.",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                })
            }
        }
    };

   
    return (
        <>
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <ModalOverlay />
                <ModalContent>
                <ModalHeader>Register</ModalHeader>

                <ModalBody pb={6}>
                    <FormControl isInvalid={fullNameError}>
                        <FormLabel>Full name</FormLabel>
                        <Input 
                            id="fullname-input" 
                            type="text" 
                            placeholder="Enter full name"
                            value={fullName} 
                            onChange={(evt) => setFullName(evt.target.value)} />
                        {fullNameError && (
                            <FormErrorMessage>Full name must be provided and at least 3 characters long.</FormErrorMessage>
                        )}
                    </FormControl>
        
                    <FormControl mt={5} isInvalid={usernameError}>
                        <FormLabel>Username</FormLabel>
                        <Input
                            id="username-input" 
                            type="text" 
                            placeholder="Enter username"
                            value={username} 
                            onChange={(evt) => setUsername(evt.target.value)} />
                        {usernameError && (
                            <FormErrorMessage>Username must be provided and at least 3 characters long.</FormErrorMessage>
                        )}
                    </FormControl>

                    <FormControl mt={5} isInvalid={passwordError}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            id="password-input" 
                            type="text" 
                            placeholder="Enter username"
                            value={password} 
                            onChange={(evt) => setPassword(evt.target.value)} />
                        
                        {passwordError && (
                            <FormErrorMessage>Password must be provided and at least 8 characters long.</FormErrorMessage>
                        )}
                    </FormControl>

                </ModalBody>
        
                <ModalFooter pb={20}>
                    <Button onClick={onClose} colorScheme='blue'>Cancel</Button>
                    <Button onClick={submitForm}>Register</Button>

                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}