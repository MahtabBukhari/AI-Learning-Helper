import React, { useEffect, useState } from "react";

type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

type AttemptQuizProps = {
  questions: Question[];
};

const AttemptQuiz: React.FC<AttemptQuizProps> = ({ questions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: string | null;
  }>({});

  const [isSummaryVisible, setIsSummaryVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [timeSpentOnQuestions, setTimeSpentOnQuestions] = useState<{
    [key: number]: number;
  }>({});

  // timer section start
  const [timer, setTimer] = useState(0);
  // const [incorrectQuestions, setIncorrectQuestions] = useState([]);

  useEffect(() => {
    // Update the timer every second
    const timerInterval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    // Clean up the interval when the component unmounts or the question changes
    return () => clearInterval(timerInterval);
  }, [currentQuestion]);

  const formatTime = (seconds: any) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds} sec`;
  };

  // timer section end

  const handleOptionSelect = (option: string) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [currentQuestion]: option,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      // Store the timer value for the current question
      setTimeSpentOnQuestions((prevTimeSpent) => ({
        ...prevTimeSpent,
        [currentQuestion]: timer,
      }));

      setCurrentQuestion(currentQuestion + 1);
      setTimer(0); // Reset timer for the next question
    }
  };

  const showSummary = () => {
    setIsSummaryVisible(true);
  };

  const handleSubmit = () => {
    if (currentQuestion < questions.length) {
      // Store the timer value for the current question
      setTimeSpentOnQuestions((prevTimeSpent) => ({
        ...prevTimeSpent,
        [currentQuestion]: timer,
      }));

      setCurrentQuestion(currentQuestion + 1);
    }

    setSubmitted(true);
    showSummary();
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((question, index) => {
      if (selectedOptions[index] === question.correctAnswer) {
        score += 1;
      }
    });
    return score;
  };

  const score = calculateScore();

  const isLastQuestion = currentQuestion === questions.length - 1;
  const isCorrect =
    selectedOptions[currentQuestion] ===
    questions[currentQuestion]?.correctAnswer;

 const handleGoToTopic = () => {
  const incorrectQuestionsData:any = [];
  const questionsGreaterThanOneMinute:any = [];

  questions.forEach((question, index) => {
    const timeSpentInSeconds = timeSpentOnQuestions[index];

    if (selectedOptions[index] !== question.correctAnswer) {
      const incorrectQuestionData = {
        id: question.id,
        question: question.question,
        userAnswer: selectedOptions[index],
        correctAnswer: question.correctAnswer,
        timeSpent: formatTime(timeSpentInSeconds),
      };
      incorrectQuestionsData.push(incorrectQuestionData);
    }

    if (timeSpentInSeconds > 60) {
      const longTimeQuestionData = {
        id: question.id,
        question: question.question,
        userAnswer: selectedOptions[index],
        correctAnswer: question.correctAnswer,
        timeSpent: formatTime(timeSpentInSeconds),
      };
      questionsGreaterThanOneMinute.push(longTimeQuestionData);
    }
  });

  localStorage.setItem("incorrectQuestions", JSON.stringify(incorrectQuestionsData));
  localStorage.setItem("questionsGreaterThanOneMinute", JSON.stringify(questionsGreaterThanOneMinute));

  window.location.href = "/";
};


  return (
    <div className="max-w-md mx-auto mt-24 relative">
      {isSummaryVisible ? (
        <div className="bg-white p-8 rounded-lg shadow-md relative">
          <h2 className="text-2xl font-bold mb-4">Quiz Summary</h2>
          {questions.map((question, index) => (
            <div
              key={index}
              className={`mb-4 ${
                selectedOptions[index] === question.correctAnswer
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              <p>{question.question}</p>
              <p>Your Answer: {selectedOptions[index]}</p>
              <p>Correct Answer: {question.correctAnswer}</p>
              <p>Time Spent: {formatTime(timeSpentOnQuestions[index])}</p>
            </div>
          ))}
          <div className="flex w-full flex-col">
            <p className="text-lg font-bold mt-4">
              Your Score: {score}/{questions.length}
            </p>
            <button
              className="border border-blue-300  text-blue-500 hover:border-blue-500 hover:text-white hover:bg-blue-500 px-2 py-2 rounded-md mt-5"
              onClick={handleGoToTopic}
            >
              Go to Topic Page
            </button>
          </div>
        </div>
      ) : (
        <div
          className="bg-white p-8 rounded-lg shadow-md relative"
          style={{ width: "600px", height: "400px" }}
        >
          <h2 className="text-2xl font-bold mb-4">
            {!submitted && questions[currentQuestion].question}
          </h2>

          {!submitted && (
            <div className="space-y-4">
              {questions[currentQuestion]?.options.map((option, index) => (
                <label key={index} className="block">
                  <input
                    type="radio"
                    value={option}
                    checked={selectedOptions[currentQuestion] === option}
                    onChange={() => handleOptionSelect(option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          )}

          <div className="absolute bottom-4 right-4">
            <div className="flex space-x-4 justify-end items-center">
              {!isLastQuestion && !submitted ? (
                <button
                  onClick={handleNext}
                  className={`border ${
                    selectedOptions[currentQuestion] != null &&
                    selectedOptions[currentQuestion] !== ""
                      ? "border-blue-500 text-blue-500"
                      : "border-gray-300 text-gray-300"
                  } px-4 py-2 rounded-md`}
                  disabled={
                    selectedOptions[currentQuestion] == null ||
                    selectedOptions[currentQuestion] === ""
                  }
                >
                  Next &gt;
                </button>
              ) : (
                !submitted && (
                  <button
                    onClick={handleSubmit}
                    className={`border ${
                      selectedOptions[currentQuestion] != null &&
                      selectedOptions[currentQuestion] !== ""
                        ? "border-blue-500 text-blue-500"
                        : "border-gray-300 text-gray-300"
                    } px-4 py-2 rounded-md`}
                    disabled={
                      selectedOptions[currentQuestion] == null ||
                      selectedOptions[currentQuestion] === ""
                    }
                  >
                    Submit
                  </button>
                )
              )}
            </div>
          </div>
          {!submitted && (
            <div className="absolute bottom-4 left-4 text-gray-600">
              Timer: {formatTime(timer)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AttemptQuiz;
