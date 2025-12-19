import { QuestionForm, ResultsPage } from "@/components"
import { useState } from "react"
import questions from "./questions.json"

// const questions: Question[] = [
//   {
//     category: "Foundation & Infrastructure",
//     question: "How would you rate the current state of your procurement and supply chain data?",
//     choices: [
//       {
//         id: "A",
//         text: "Highly fragmented across multiple systems with significant quality issues",
//       },
//       {
//         id: "B",
//         text: "Partially integrated with some data quality concerns",
//       },
//       {
//         id: "C",
//         text: "Mostly integrated with good data quality across core systems",
//       },
//       {
//         id: "D",
//         text: "Fully integrated with high quality, real-time data across all operations",
//       },
//     ],
//   },
//   {
//     category: "Process Automation",
//     question: "What percentage of your procurement processes are currently automated?",
//     choices: [
//       {
//         id: "A",
//         text: "Less than 25% - mostly manual processes",
//       },
//       {
//         id: "B",
//         text: "25-50% - some automation in place",
//       },
//       {
//         id: "C",
//         text: "50-75% - majority of processes automated",
//       },
//       {
//         id: "D",
//         text: "Over 75% - highly automated operations",
//       },
//     ],
//   },
//   {
//     category: "Analytics & Insights",
//     question: "How would you describe your current analytics and reporting capabilities?",
//     choices: [
//       {
//         id: "A",
//         text: "Basic reporting with limited insights",
//       },
//       {
//         id: "B",
//         text: "Standard dashboards with some predictive capabilities",
//       },
//       {
//         id: "C",
//         text: "Advanced analytics with real-time insights",
//       },
//       {
//         id: "D",
//         text: "AI-powered predictive and prescriptive analytics",
//       },
//     ],
//   },
// ]


export default function App() {
  const [isComplete, setIsComplete] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string>>({})

  const handleComplete = (completedAnswers: Record<number, string>) => {
    console.log("Quiz completed with answers:", completedAnswers)
    setAnswers(completedAnswers)
    setIsComplete(true)
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] flex items-center justify-center p-4">
      {isComplete ? (
        <ResultsPage answers={answers} questions={questions} />
      ) : (


        <QuestionForm questions={questions} onComplete={handleComplete} />
      )}
    </div>
  )
}