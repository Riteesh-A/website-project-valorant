import { Button } from "@/components"
import { useState } from "react"

export interface Question {
  category: string
  question: string
  choices: {
    id: string
    text: string
    points?: number
  }[]
}

export interface QuestionFormProps {
  questions: Question[]
  onComplete?: (answers: Record<number, number>) => void
}

export function QuestionForm({ questions, onComplete }: QuestionFormProps) {
  const [showIntro, setShowIntro] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showSectionComplete, setShowSectionComplete] = useState(false)
  const [completedSection, setCompletedSection] = useState<{
    number: number
    name: string
    totalSections: number
  } | null>(null)

  // Get unique categories/sections
  const sections = Array.from(new Set(questions.map(q => q.category)))
  
  // Get current section number
  const getCurrentSectionNumber = (questionIndex: number) => {
    const category = questions[questionIndex]?.category
    return sections.indexOf(category) + 1
  }

  const handleAnswerClick = (choiceId: string) => {
    // Save the answer
    const newAnswers = {
      ...answers,
      [currentQuestion]: choiceId,
    }
    setAnswers(newAnswers)

    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        const nextQuestion = currentQuestion + 1
        const currentCategory = questions[currentQuestion].category
        const nextCategory = questions[nextQuestion].category
        
        // Check if we're moving to a new section
        if (currentCategory !== nextCategory) {
          const sectionNumber = getCurrentSectionNumber(currentQuestion)
          setCompletedSection({
            number: sectionNumber,
            name: currentCategory,
            totalSections: sections.length
          })
          setShowSectionComplete(true)
          
          // Auto-continue after 2.5 seconds
          setTimeout(() => {
            setShowSectionComplete(false)
            setCurrentQuestion(nextQuestion)
          }, 2000)
        } else {
          setCurrentQuestion(nextQuestion)
        }
      } else {
        // All questions answered
        // Convert answers from {0: "A", 1: "B"} to {1: 75, 2: 50} format for Python script
        const convertedAnswers: Record<number, number> = {}
        Object.entries(newAnswers).forEach(([questionIndex, choiceId]) => {
          const idx = parseInt(questionIndex)
          const question = questions[idx]
          const choice = question?.choices.find(c => c.id === choiceId)
          const points = choice?.points || 0
          convertedAnswers[idx + 1] = points // Convert to 1-based index
        })
        
        console.log("Quiz completed! Answers (for Python):", convertedAnswers)
        onComplete?.(convertedAnswers)
      }
    }, 300)
  }

  const currentQ = questions[currentQuestion]
  // Progress based on answered questions, not current question index
  const progress = Math.round((Object.keys(answers).length / questions.length) * 100)

  const handleGoBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    } else {
      // Go back to intro screen from first question
      setShowIntro(true)
    }
  }

  // Show intro screen first
  if (showIntro) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1
              className="display-lg"
            >
              AI Readiness Assessment
            </h1>
            <p
              className={"headline-md surface-dim"}
            >
              The Future of Procurement is Now
            </p>
          </div>

          {/* Content Box */}
          <div className="bg-white rounded-2xl p-8 md:p-12 space-y-6">
            <div className="space-y-4">
              <p
                className={"body-md on-surface-variant"}
              >
                The rapid advancement of Artificial Intelligence (AI) is no longer an optional upgrade; it's the strategic imperative defining success in procurement and supply chain. Market leaders are moving past basic automation to implement predictive, prescriptive AI, creating highly efficient, resilient, and strategic operations.
              </p>
              <p
                className={"body-md on-surface"}
              >
                Our{" "}
                <span
                  style={{
                    color: "var(--primary-primary-50, #008585)",
                    fontWeight: 700,
                  }}
                >
                  15-question assessment
                </span>{" "}
                provides a rapid, comprehensive evaluation of your organization's current maturity across six critical dimensions.
              </p>
            </div>

            {/* Dimensions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              {[
                "Foundation & Infrastructure",
                "Process & Operations",
                "Strategy & Leadership",
                "Governance & Compliance",
                "Talent & Capabilities",
                "Measurement & Investment",
              ].map((dimension) => (
                <div key={dimension} className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" viewBox="0 0 10 16" fill="none">
  <circle cx="7.99988" cy="8.00012" r="1.02602" transform="rotate(45 7.99988 8.00012)" fill="#00A1A1"/>
  <circle cx="5.81711" cy="5.81708" r="1.02602" transform="rotate(-45 5.81711 5.81708)" fill="#00A1A1"/>
  <circle cx="3.63449" cy="3.63406" r="1.02602" transform="rotate(-45 3.63449 3.63406)" fill="#00A1A1"/>
  <circle cx="1.45089" cy="1.45111" r="1.02602" transform="rotate(-45 1.45089 1.45111)" fill="#00A1A1"/>
  <circle cx="3.63367" cy="12.3661" r="1.02602" transform="rotate(45 3.63367 12.3661)" fill="#00A1A1"/>
  <circle cx="5.81726" cy="10.1831" r="1.02602" transform="rotate(45 5.81726 10.1831)" fill="#00A1A1"/>
  <circle cx="1.45105" cy="14.5491" r="1.02602" transform="rotate(45 1.45105 14.5491)" fill="#00A1A1"/>
</svg>
                  <span
                    className={"body-md on-surface"}
                  >
                    {dimension}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="flex flex-col gap-5 justify-center pt-4 w-full">
            <Button
              type="button"
              onClick={() => setShowIntro(false)}
              className="title-lg font-semibold w-full surface rounded-full px-6 py-4 h-full"
              style={{
                backgroundColor: "#07BDBD",
               
              }}
            >
              Start Assessment
            </Button>
            <p
              className="body-sm surface-variant text-center"
            >
Takes approximately 5 minutes to complete   </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="space-y-10 items-center justify-center flex flex-col">
        {/* Progress indicator */}
        {!showSectionComplete && (
          <div className="w-full space-y-2">
            {/* Labels on top */}
            <div className="flex items-center justify-between w-full">
              <button
                onClick={handleGoBack}
                className="text-white text-sm uppercase tracking-wide hover:text-cyan-400 transition-colors flex items-center gap-5 cursor-pointer"
              >
                <span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="16" fill="none">
                    <circle cx="1.026" cy="1.026" r="1.026" fill="#fff" transform="scale(-1 1) rotate(45 -8.631 1.523)"/>
                    <circle cx="1.026" cy="1.026" r="1.026" fill="#fff" transform="scale(-1 1) rotate(-45 4.479 9.048)"/>
                    <circle cx="1.026" cy="1.026" r="1.026" fill="#fff" transform="scale(-1 1) rotate(-45 .753 10.59)"/>
                    <circle cx="1.026" cy="1.026" r="1.026" fill="#fff" transform="scale(-1 1) rotate(-45 -2.974 12.134)"/>
                    <circle cx="1.026" cy="1.026" r="1.026" fill="#fff" transform="scale(-1 1) rotate(45 -16.084 -1.563)"/>
                    <circle cx="1.026" cy="1.026" r="1.026" fill="#fff" transform="scale(-1 1) rotate(45 -12.358 -.021)"/>
                    <circle cx="1.026" cy="1.026" r="1.026" fill="#fff" transform="scale(-1 1) rotate(45 -19.81 -3.108)"/>
                  </svg>
                </span>
                <span
                  className="title-md on-primary"
                >
                  GO BACK
                </span>
              </button>
              
              <span className="text-white text-sm uppercase tracking-wide whitespace-nowrap">
                {progress}% COMPLETE
              </span>
            </div>
            
            {/* Progress bar below */}
            <div className="w-full h-1 bg-white/12 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Section Completion Card */}
        {showSectionComplete && completedSection ? (
          <div className="bg-white rounded-xl p-5 text-center space-y-6 w-fit min-h-75 min-w-150 flex flex-col items-center justify-center">
            {/* Checkmark Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            {/* Section Complete Text */}
            <div>
              <h3 className="text-gray-900 text-2xl font-semibold mb-2">
                Section {completedSection.number} completed!
              </h3>
              <p className="text-gray-600 text-base">
                {completedSection.number === completedSection.totalSections 
                  ? "Great work! You've completed all sections."
                  : `Good job! ${completedSection.number} down, ${completedSection.totalSections - completedSection.number} to go.`
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-10">
            <div className="space-y-5 max-w-3xl w-full">
              {/* Category Tag */}
              <div
                style={{
                  color: "var(--primary-primary-70, #0DBEBE)",
                  textAlign: "center",
                  fontFamily: "Geist, sans-serif",
                  fontSize: 18,
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "140%",
                  letterSpacing: "-0.02em",
                }}
              >
                {currentQ.category}
              </div>
              {/* Question */}
              <h2
                style={{
                  color: "var(--sys-surface, #F9FAF9)",
                  textAlign: "center",
                  fontFamily: "Geist, sans-serif",
                  fontSize: "32px",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "120%",
                  letterSpacing: "-0.016em",
                }}
              >
                {currentQ.question}
              </h2>
            </div>

            {/* Choices */}
            <div className=" flex flex-col gap-3 w-full">
              {currentQ.choices.map((choice) => {
                const isSelected = answers[currentQuestion] === choice.id
                return (
                  <Button
                    key={choice.id}
                    type="button"
                    variant="outline"
                    onClick={() => handleAnswerClick(choice.id)}
                    className={`w-full max-w-3xl whitespace-normal h-auto p-5 justify-start gap-4 text-left rounded-xl border-2 transition-all ${
                      isSelected
                        ? ""
                        : "bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                    style={
                      isSelected
                        ? {
                            borderRadius: "12px",
                            border: "2px solid var(--primary-primary-70, #0DBEBE)",
                            background: "var(--sys-surfaceDim, #D5DBDA)",
                            boxShadow:
                              "0 2px 3px 0 var(--states-shadow-opacity-32, rgba(0, 0, 0, 0.32)), 0 2px 3px 0 var(--states-shadow-opacity-16, rgba(0, 0, 0, 0.16))",
                          }
                        : undefined
                    }
                  >
                    <span
                      className={`flex items-center justify-center font-semibold text-lg border ${
                        isSelected
                          ? "border-primary-primary-50 bg-[var(--primary-primary-50,#008585)] text-white"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                      style={{
                        width: "40px",
                        height: "40px",
                        minWidth: "40px",
                        minHeight: "40px",
                        borderRadius: "999px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ...(isSelected && {
                          background: "var(--primary-primary-50, #008585)",
                          borderColor: "var(--primary-primary-50, #008585)",
                          color: "#fff",
                        }),
                      }}
                    >
                      {choice.id}
                    </span>
                    <span
                      style={
                        isSelected
                          ? {
                              color: "var(--primary-primary-50, #008585)",
                              fontFamily: "Geist, sans-serif",
                              fontSize: "20px",
                              fontStyle: "normal",
                              fontWeight: 700,
                              lineHeight: "140%",
                              letterSpacing: "-0.025em",
                            }
                          : {
                              color: "var(--sys-onSurface, #161D1D)",
                              fontFamily: "Geist, sans-serif",
                              fontSize: "20px",
                              fontStyle: "normal",
                              fontWeight: 300,
                              lineHeight: "140%",
                              letterSpacing: "-0.02em",
                            }
                      }
                      className="flex-1"
                    >
                      {choice.text}
                    </span>
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

