import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function POST(req: NextRequest) {
  try {
    // Access the request body and ensure it's an object
    const body = await req.json();
    if (!body || typeof body !== "object") {
      throw new Error("Invalid request body format");
    }

    // Extract the quiz data from the nested object
    const quizData = body.quizData;
    if (!quizData || !Array.isArray(quizData)) {
      throw new Error("Invalid quiz data format");
    }

    const paragraph = quizData[0]?.paragraph;
    

    const prompt_string = `Prompt:

    Read the following paragraph carefully and generate 5 multiple choice questions that assess the most important points.
    
    Format:
    
    Output the questions in JSON format, where each question is represented as an object with the following properties:
    
    - id: A unique identifier for the question (e.g., 1, 2, 3 etc.)
    - question: The text of the question.
    - options: An array of 4 possible answer choices (["text", "correct", "text", "text"] or ["text", "text", "text", "correct"] change correct choice pattern). 
    - correctAnswer: The letter of the correct answer choice ("text").
    
    Additional Instructions:
    
    - Ensure the questions are clear, concise, and grammatically correct.
    - Avoid verbatim repetition of sentences from the paragraph.
    - Focus on key concepts and information rather than minor details.
    - Formulate answer choices that are plausible and challenging.
    - Include at least three incorrect answer choices with each question.
    - Adhere strictly to the specified JSON format.

    
    Paragraph:
    
    ${paragraph} `;


    const worker = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt_string }],
      model: "gpt-3.5-turbo",
      temperature: 0.0,
    });

    const output = worker.choices[0].message.content;

    const generatedQuiz = output;
console.log(generatedQuiz)
    return NextResponse.json({
      generatedQuiz,
    });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ error });
  }
}
