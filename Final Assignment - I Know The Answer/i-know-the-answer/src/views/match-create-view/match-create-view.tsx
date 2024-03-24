import { 
    Box, 
    Heading, 
    Stack,
    FormControl,
    Input,
    FormLabel,
    Button
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Question } from "../../types/question";


export function MatchCreateView() {
    const [title, setTitle] = useState<string>("");
    const [titleImage, setTitleImage] = useState<string>("https://lumiere-a.akamaihd.net/v1/images/image_3e7881c8.jpeg?region=131,0,1338,753");
    const [questions, setQuestions] = useState<Question[]>([]);

    const navigate = useNavigate();

    return (
        <Box>
            <Heading>Create match</Heading>
            <Stack spacing={2}>
                <FormControl>
                    <FormLabel>Title of the match</FormLabel>
                    <Input 
                        id="title-input" 
                        type="text" 
                        placeholder="Enter title of the match"
                        value={title} 
                        onChange={(evt) => setTitle(evt.target.value)}/>
                </FormControl>
                <FormControl>
                    <FormLabel>Match image</FormLabel>
                    <Input 
                        id="title-input" 
                        type="text" 
                        placeholder="Enter your title image"
                        value={titleImage} 
                        onChange={(evt) => setTitleImage(evt.target.value)}/>
                </FormControl>
                <Button>Save</Button>
            </Stack>
        </Box>
    )
}