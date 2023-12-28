import React, { useEffect, useState } from "react";

interface IncorrectQuestions {
  id: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  timeSpent: string;
}

export const Topics = ({ content }: any) => {
  const [incorrectQuestions, setIncorrectQuestions] = useState<
    IncorrectQuestions[]
  >([]);
  const [questionsGreaterThanOneMinute, setQuestionsGreaterThanOneMinute] =
    useState<IncorrectQuestions[]>([]);
  const [cardStates, setCardStates] = useState(
    Array(incorrectQuestions.length).fill(false)
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Retrieve incorrect questions from localStorage
    const storedIncorrectQuestionsString =
      localStorage.getItem("incorrectQuestions");
    if (storedIncorrectQuestionsString) {
      const storedIncorrectQuestions = JSON.parse(
        storedIncorrectQuestionsString
      );
      setIncorrectQuestions(storedIncorrectQuestions);
      console.log(
        "Incorrect Questions from local storage",
        storedIncorrectQuestions
      );
    }

    // Retrieve questions with time greater than 1 minute from localStorage
    const storedGreaterThanOneMinuteString = localStorage.getItem(
      "questionsGreaterThanOneMinute"
    );
    if (storedGreaterThanOneMinuteString) {
      const storedQuestionsGreaterThanOneMinute = JSON.parse(
        storedGreaterThanOneMinuteString
      );
      setQuestionsGreaterThanOneMinute(storedQuestionsGreaterThanOneMinute);
      console.log(
        "Questions > 1 minute from local storage",
        storedQuestionsGreaterThanOneMinute
      );
    }
  }, []);


  
  const toggleCards = (sectionType:any, index:any) => {
    setCardStates((prevStates) => {
      const newStates = { ...prevStates };
  
      // Use a unique key for each section (e.g., `incorrect-${index}` or `greaterThanOneMinute-${index}`)
      const cardKey:any = `${sectionType}-${index}`;
      newStates[cardKey] = !newStates[cardKey];
  
      return newStates;
    });
  };

  const handleBackButtonClick = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNextButtonClick = () => {
    if (currentIndex < content.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <>
      <aside className="w-1/4 bg-gray-200 p-4 overflow-y-auto max-h-lg">
        <h1 className="text-2xl font-bold mb-4 mx-10">Smart Notes</h1>
        {/* Incorrect Questions */}
        {incorrectQuestions && incorrectQuestions.length > 0 && (
          <div>
            {incorrectQuestions.map((questionData: any, index:any) => (
              <div
                key={questionData.id}
                className={`border border-red-300 bg-red-100 p-4 mb-3 rounded-lg cursor-pointer shadow-md transition-transform transform hover:scale-105`}
                onClick={() => toggleCards("incorrect", index)}
              >
                {cardStates[`incorrect-${index}` as keyof typeof cardStates] ? (
                  <p className="text-gray-800">
                    <b>Answer</b>: {questionData.correctAnswer}
                  </p>
                ) : (
                  <p className="text-gray-800">
                    <b>Question</b>: {questionData.question}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Questions with Time > 1 minute */}
        {questionsGreaterThanOneMinute &&
          questionsGreaterThanOneMinute.length > 0 && (
            <div>
              {questionsGreaterThanOneMinute.map(
                (questionData: any, index: any) => (
                  <div
                    key={questionData.id}
                    className={`border border-yellow-300 bg-yellow-100 p-4 mb-3 rounded-lg cursor-pointer shadow-md transition-transform transform hover:scale-105`}
                    onClick={() => toggleCards("greaterThanOneMinute", index)}
                  >
                    {cardStates[`greaterThanOneMinute-${index}` as keyof typeof cardStates] ? (
                      <p className="text-gray-800">
                        <b>Answer</b>: {questionData.correctAnswer}
                      </p>
                    ) : (
                      <p className="text-gray-800">
                        <b>Question</b>: {questionData.question}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          )}
      </aside>

      {/* Main Content */}
      <div className="flex flex-col max-w-screen-lg">
        <div className="flex flex-col items-center justify-between mb-2 p-18 flex-3 relative max-w-screen-lg overflow-y-auto " style={{ height: "500px" }}>
          {/* Beautiful Paragraph */}
          {/* Display current content from JSON */}
          {Array.isArray(content) && currentIndex < content.length && (
            <div
              key={content[currentIndex].id}
              className="w-4/4 bg-gray-100 p-8 rounded-lg shadow-md"
            >
              <h2 className="text-2xl text-gray-800 font-bold mb-4 text-center">
                {content[currentIndex].heading}
              </h2>
              <p className="text-xl text-gray-800">
                {content[currentIndex].paragraph}
              </p>
            </div>
          )}
        </div>
        {/* Buttons for Next and Back */}
        <div className="flex justify-end mt-4">
          {currentIndex > 0 && (
            <button
              className="bg-blue-500 text-white border border-blue-500 px-4 py-2 mx-3 rounded hover:bg-white hover:text-blue-500 transition-all duration-300"
              onClick={handleBackButtonClick}
            >
              Back
            </button>
          )}
          {currentIndex < content.length - 1 && (
            <button
              className="bg-blue-500 text-white border border-blue-500 px-4 py-2 mx-3 rounded hover:bg-white hover:text-blue-500 transition-all duration-300"
              onClick={handleNextButtonClick}
            >
              Next
            </button>
          )}
        </div>
      </div>
      
    </>
  );
};

export default Topics;
