import {
  Box,
  Heading,
  Stack,
  FormControl,
  Input,
  FormLabel,
  Button,
  Radio,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Question } from "../../types/question";
import { Option } from "../../types/option";
import { useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { createNewMatch } from "../../services/match-service";
import { themeVars } from "../../themes/theme.css";

export function MatchCreateView() {
  const user = useSelector((state: IRootState) => state.user);
  const [title, setTitle] = useState<string>("");
  const [titleImage, setTitleImage] = useState<string>(
    "https://lumiere-a.akamaihd.net/v1/images/image_3e7881c8.jpeg?region=131,0,1338,753"
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const initialAnswer: Option = {
    value: "",
    correct: false,
  };

  const initialQuestion: Question = {
    title: "",
    options: new Array(4).fill(null).map(() => ({ ...initialAnswer })),
  };

  const [questions, setQuestions] = useState<Question[]>([initialQuestion]);

  const updateQuestionTitle = (index: number, newTitle: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].title = newTitle;
    setQuestions(updatedQuestions);
  };

  const updateOptionValue = (
    questionIndex: number,
    optionIndex: number,
    newValue: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].value = newValue;
    setQuestions(updatedQuestions);
  };

  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];

    updatedQuestions[questionIndex].options.forEach((answer) => {
      answer.correct = false;
    });

    updatedQuestions[questionIndex].options[optionIndex].correct = true;
    setQuestions(updatedQuestions);

    console.log(updatedQuestions);
  };

  const addNewQuestion = () => {
    setQuestions((prevQuestions) => [...prevQuestions, { ...initialQuestion }]);
  };

  const removeQuestion = (questionIndex: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((questoin, index) => index !== questionIndex)
    );
  };

  const navigate = useNavigate();

  async function createMatch() {
    setErrorMessage("");
    const match = { title, titleImage, questions, owner: user! };
    const newMatch = await createNewMatch(match);

    if (newMatch) {
      navigate("/dashboard");
    } else {
      setErrorMessage("Failed to create the match.");
    }
  }

  return (
    <Box style={{ padding: 50, paddingTop: 10 }}>
      <Heading style={{ fontSize: 30, paddingBottom: 40 }}>
        Create match
      </Heading>
      <Stack>
        <FormControl style={{ paddingBottom: 10 }}>
          <FormLabel style={{ fontSize: 12, fontWeight: 700 }}>
            Title of the match
          </FormLabel>
          <Input
            id="title-input"
            type="text"
            placeholder="Enter title of the match"
            value={title}
            onChange={(evt) => setTitle(evt.target.value)}
            style={{
              borderRadius: 0,
              borderColor: "black",
              borderWidth: 1,
              fontSize: 11,
            }}
          />
        </FormControl>
        <FormControl style={{ paddingBottom: 10 }}>
          <FormLabel style={{ fontSize: 12, fontWeight: 700 }}>
            Match image
          </FormLabel>
          <Input
            id="title-input"
            type="text"
            placeholder="Enter your title image"
            value={titleImage}
            onChange={(evt) => setTitleImage(evt.target.value)}
            style={{
              borderRadius: 0,
              borderColor: "black",
              borderWidth: 1,
              fontSize: 11,
            }}
          />
        </FormControl>
      </Stack>

      <Box
        style={{
          paddingTop: 40,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Heading style={{ fontSize: 20 }}>Questions</Heading>
        <Button
          onClick={addNewQuestion}
          style={{
            backgroundColor: themeVars.colors.lightBlue,
            width: 100,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Add
        </Button>
      </Box>

      {questions.map((question, questionIndex) => (
        <Stack key={questionIndex} style={{ paddingBottom: 30 }}>
          <Heading as="h5" size="sm" style={{ paddingBottom: 10 }}>
            {`Question ${questionIndex + 1}`}
          </Heading>
          <Box
            style={{
              backgroundColor: "#f9f9f9",
              borderRadius: 8,
              padding: 30,
            }}
          >
            <FormControl style={{ paddingBottom: 25 }}>
              <FormLabel style={{ fontSize: 12, fontWeight: 700 }}>
                Title of the question
              </FormLabel>
              <Input
                type="text"
                placeholder="Enter the title of the question"
                value={question.title}
                onChange={(e) =>
                  updateQuestionTitle(questionIndex, e.target.value)
                }
                style={{
                  backgroundColor: "white",
                  borderRadius: 0,
                  borderColor: "black",
                  borderWidth: 1,
                  fontSize: 11,
                  paddingLeft: 20,
                }}
              />
            </FormControl>

            {question.options.map((option, optionIndex) => (
              <FormControl key={optionIndex} style={{ paddingBottom: 15 }}>
                <FormLabel style={{ fontSize: 12, fontWeight: 700 }}>
                  {`Answer ${optionIndex + 1}`}
                </FormLabel>
                <Input
                  type="text"
                  placeholder="Enter Answer"
                  value={option.value}
                  onChange={(e) =>
                    updateOptionValue(
                      questionIndex,
                      optionIndex,
                      e.target.value
                    )
                  }
                  style={{
                    backgroundColor: "white",
                    borderRadius: 0,
                    borderColor: "black",
                    borderWidth: 1,
                    fontSize: 11,
                    paddingLeft: 20,
                  }}
                />
                <Box style={{ paddingTop: 10 }}>
                  <Radio
                    isChecked={option.correct}
                    onChange={() =>
                      setCorrectOption(questionIndex, optionIndex)
                    }
                    size="sm"
                    style={{
                      border: "1px solid black",
                    }}
                    _checked={{ backgroundColor: "black" }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                      }}
                    >
                      Right answer?
                    </Text>
                  </Radio>
                </Box>
              </FormControl>
            ))}
            <Box
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={() => removeQuestion(questionIndex)}
                style={{
                  backgroundColor: themeVars.colors.lightBlue,
                  width: 100,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Remove
              </Button>
            </Box>
          </Box>
        </Stack>
      ))}

      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={createMatch}
          style={{
            backgroundColor: themeVars.colors.lightBlue,
            width: 100,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Save
        </Button>
      </Box>
      <Text>{errorMessage}</Text>
    </Box>
  );
}
