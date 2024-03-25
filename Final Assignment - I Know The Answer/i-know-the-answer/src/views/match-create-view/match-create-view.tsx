import { 
    Box, 
    Heading, 
    Stack,
    FormControl,
    Input,
    FormLabel,
    Button,
    Radio,
    Text
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Question } from "../../types/question";
import { Option } from "../../types/option";
import { useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { createNewMatch } from "../../services/match-service";



export function MatchCreateView() {
    const user = useSelector((state: IRootState) => state.user);
    const [title, setTitle] = useState<string>("Star Wors");
    const [titleImage, setTitleImage] = useState<string>("https://lumiere-a.akamaihd.net/v1/images/image_3e7881c8.jpeg?region=131,0,1338,753");
    const [errorMessage, setErrorMessage] = useState<string>("");
    
    const initialAnswer: Option = {
        value: "Yoda",
        correct: false,
    };
      
    const initialQuestion: Question = {
        title: "Who is Lukes real father?",
        options: new Array(4).fill(null).map(() => ({ ...initialAnswer })),
    };

    const [questions, setQuestions] = useState<Question[]>([initialQuestion]);


    const updateQuestionTitle = (index: number, newTitle: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].title = newTitle;
        setQuestions(updatedQuestions);
    };
    
    const updateOptionValue = (questionIndex: number, optionIndex: number, newValue: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex].value = newValue;
        setQuestions(updatedQuestions);
    };
    
      
    const setCorrectOption = (questionIndex: number, optionIndex: number) => {
        const updatedQuestions = [...questions];
    
        updatedQuestions[questionIndex].options.forEach(answer => {
            answer.correct = false;
        });
  
        updatedQuestions[questionIndex].options[optionIndex].correct = true;
        setQuestions(updatedQuestions);

        console.log(updatedQuestions);
    };

    const addNewQuestion = () => {
        setQuestions(prevQuestions => [
            ...prevQuestions,
            {...initialQuestion}
        ]);
    };

    const removeQuestion = (questionIndex: number) => {
        setQuestions(prevQuestions => prevQuestions.filter((questoin, index) => index !== questionIndex));
    };

    const navigate = useNavigate();


    async function createMatch() {
        setErrorMessage("")
        const match = { title, titleImage, questions, owner: user! };
        const newMatch = await createNewMatch(match);

        if (newMatch) {
            navigate("/dashboard");
        } else {
            setErrorMessage("Failed to create the match."); 
        }

    }

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
            </Stack>


            <Heading as='h3' size='lg' style={{paddingTop: "100px"}}>Questions</Heading>
            <Button onClick={addNewQuestion}>Add New Question</Button>
            {questions.map((question, questionIndex) => (
                <Stack key={questionIndex} spacing={2}>
                    <Heading as='h5' size='sm' style={{paddingTop: "50px"}}>{`Question ${questionIndex + 1}`}</Heading>
                    <FormControl>
                        <FormLabel>Title of the question</FormLabel>
                        <Input 
                            type="text"
                            placeholder="Enter the title of the question"
                            value={question.title}
                            onChange={(e) => updateQuestionTitle(questionIndex, e.target.value)}
                        />
                    </FormControl>

                    {question.options.map((option, optionIndex) => (
                        <FormControl key={optionIndex}>
                        <FormLabel>{`Answer ${optionIndex + 1}`}</FormLabel>
                        <Input 
                            type="text"
                            placeholder="Enter Answer"
                            value={option.value}
                            onChange={(e) => updateOptionValue(questionIndex, optionIndex, e.target.value)}
                        />
                        <Radio
                            isChecked={option.correct}
                            onChange={() => setCorrectOption(questionIndex, optionIndex)}
                        >
                            Right answer?
                        </Radio>
                        </FormControl>
                    ))}

                    <Button onClick={() => removeQuestion(questionIndex)}>Remove</Button>
          
                </Stack>
            ))}


            <Button onClick={createMatch}>Save</Button>
            <Text>{errorMessage}</Text>
        </Box>
    )
}