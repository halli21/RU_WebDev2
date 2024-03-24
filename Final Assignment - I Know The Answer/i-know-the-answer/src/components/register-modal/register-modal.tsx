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
    Text
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
    const [failedMessage, setFailedMessage] = useState<string>('');

    async function submitForm() {
        setFailedMessage("");

        const success = await registerUser(username, fullName, password);

        if (success) {
            onClose();
        } else {
            setFailedMessage("Register failed.");
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
                    <FormControl>
                        <FormLabel>Full name</FormLabel>
                        <Input 
                            id="fullname-input" 
                            type="text" 
                            placeholder="Enter full name"
                            value={fullName} 
                            onChange={(evt) => setFullName(evt.target.value)} />
                    </FormControl>
        
                    <FormControl mt={4}>
                        <FormLabel>Username</FormLabel>
                        <Input
                            id="username-input" 
                            type="text" 
                            placeholder="Enter username"
                            value={username} 
                            onChange={(evt) => setUsername(evt.target.value)} />
                    </FormControl>

                    <FormControl mt={4}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            id="password-input" 
                            type="text" 
                            placeholder="Enter username"
                            value={password} 
                            onChange={(evt) => setPassword(evt.target.value)} />
                    </FormControl>

                </ModalBody>
        
                <ModalFooter pb={20}>
                    <Button onClick={onClose} colorScheme='blue'>Cancel</Button>
                    <Button onClick={submitForm}>Register</Button>

                    <Text color={themeVars.colors.red}>{failedMessage}</Text>
                </ModalFooter>
            </ModalContent>
        </Modal>
        </>
    )
}