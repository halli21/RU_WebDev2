import { 
    Box, 
    Heading, 
    FormControl, 
    Text, 
    Input, 
    Button, 
    useDisclosure,
} from '@chakra-ui/react';
import { useState } from "react";
import { buttonContainer, buttonStyle, inputStyle, loginContainer } from "./style.css";
import { themeVars } from "../../themes/theme.css";
import { useNavigate } from "react-router-dom";
import { authenticateUser } from '../../services/user-service';
import { RegisterModal } from '../../components/register-modal/register-modal';


export function LoginView() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [failedMessage, setFailedMessage] = useState<string>('');

    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();

    async function submitForm() {
        setFailedMessage("");

        const user = await authenticateUser(username, password);

        if (user) {
            navigate("/dashboard");
        } else {
            setFailedMessage("Authentication failed.");
        }
    };

 
    return (
        <Box className={loginContainer}>
            <Heading color={themeVars.colors.white} fontWeight={500} fontSize={48}>I Know the Answer!</Heading>
            <form>
                <FormControl>
                    <Input
                        className={inputStyle!} 
                        id="username-input" 
                        type="text" 
                        placeholder="Enter your username"
                        value={username} 
                        onChange={(evt) => setUsername(evt.target.value)}/>
                </FormControl>
                <FormControl>
                    <Input
                        className={inputStyle}  
                        id="password-input" 
                        type="text" 
                        placeholder="Enter your password"
                        value={password} 
                        onChange={(evt) => setPassword(evt.target.value)}/>
                </FormControl>
                <Box className={buttonContainer}>
                    <Button 
                        className={buttonStyle}
                        onClick={onOpen}
                    >
                        Register
                    </Button>
                    <Button 
                        className={buttonStyle}  
                        onClick={() => submitForm()}
                    >
                        Login
                    </Button>
                    </Box>
                <Text color={themeVars.colors.red}>{failedMessage}</Text>
            </form>

            <RegisterModal isOpen={isOpen} onClose={onClose} />
        </Box>
    )
}


