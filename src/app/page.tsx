"use client";
import { useEffect, useState } from "react";
import Topics from "./components/topics.components";
import Quiz from "./components/quiz.components";
type Section = {
  id: number;
  heading: string;
  paragraph: string;
};

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}


export default function Home() {
  const [step, setStep] = useState("0");
  // const [showAnswer, setShowAnswer] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [content, setContent] = useState<Section[]>([]);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris",
    },
  ]);
  const [isloading, setIsloading] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api");
        console.log("res", response);
        const data: { data: Section[] } = await response.json();
       

       
        setContent(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const generateQuiz = async () => {
    try {
      setIsloading(true);
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // You can pass additional data in the body if needed
        body: JSON.stringify({ quizData: content }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Handle the response if needed
      const result = await response.json();
      console.log("Quiz generated:", result.generatedQuiz);
      const generatedQuestions = JSON.parse(result.generatedQuiz);
      setQuestions(generatedQuestions);
      setIsloading(false);
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  };

  // const toggleCard = () => {
  //   setShowAnswer(!showAnswer);
  // };

  return (
    <main className="flex min-h-lg flex-col">
      {/* main header */}

      {
        !showQuiz?(
      <header className="bg-blue-500 text-white p-4 flex justify-between items-center sticky top-0 z-10 w-full">
        <div className="text-2xl font-bold">
          <p className="cursor-pointer" onClick={() => setStep("0")}>
            Learning Helper
          </p>
        </div>
        <nav className="flex space-x-4">
          <p
            className="hover:underline cursor-pointer"
            onClick={() => setStep("1")}
          >
            SKILL
          </p>
          <p
            className="hover:underline cursor-pointer"
            onClick={() => setStep("2")}
          >
            QUIZ
          </p>
        </nav>
      </header>) : ''

        
      }

      {/* Main section */}

      <section className="flex min-h-screen">
        {/* landing page */}

        {step === "0" && (
          <>
            <div className="z-10 max-w-screen-sm w-full mx-auto items-center justify-center font-mono text-sm lg:flex overflow-y-hidden overflow-auto">
              <h2 className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
                <p className="cursor-pointer" onClick={() => setStep("1")}>
                  Welcome to Learning Helper&nbsp;
                </p>
              </h2>
            </div>
          </>
        )}

        {/* Topics Page */}

        {step === "1" && (
          <Topics
            // toggleCard={toggleCard}
            // showAnswer={showAnswer}
            content={content}
            
          />
        )}

        {/* Quiz Page */}

        {step === "2" && (
          <Quiz
            generateQuiz={generateQuiz}
            questions={questions}
            isloading={isloading}
            showQuiz={showQuiz}
            setShowQuiz={setShowQuiz}
          />
        )}
      </section>
    </main>
  );
}
