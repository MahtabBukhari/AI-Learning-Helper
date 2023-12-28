import React from "react";
import AttemptQuiz from "./attemptingQuiz.components";

type Questions = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
};

const Quiz = ({ generateQuiz, questions, isloading,showQuiz,setShowQuiz }: any) => {
  
  
  const handleGenerateQuiz = () => {
    generateQuiz();
    setShowQuiz(true);
  };

  return (
    <>
      {!showQuiz ? (
        <div
          className={`z-10 max-w-sm w-full mx-auto items-center justify-center font-mono text-md lg:flex ${
            showQuiz ? "hidden" : ""
          }`}
        >
          <button
            className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-500 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30"
            onClick={handleGenerateQuiz}
          >
            Generate Quiz&nbsp;
          </button>
        </div>
      ) : isloading ? (
        <div
          className={`z-10 max-w-sm w-full mx-auto items-center justify-center font-mono text-md lg:flex ${
            showQuiz ? "hidden" : ""
          }`}
        >
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-500 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            Loading ... &nbsp;
          </p>
        </div>
      ) : (
        <AttemptQuiz questions={questions} />
      )}
    </>
  );
};

export default Quiz;
