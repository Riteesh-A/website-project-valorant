import { Button } from "@/components/Button";
import { useEffect, useState } from "react";

// Declare confetti from CDN
declare global {
  interface Window {
    confetti: (options: Record<string, unknown>) => void;
  }
}

export interface ResultsPageProps {
  answers: Record<number, number>
  questions: Array<{
    category: string
    question: string
    choices: Array<{
      id: string
      text: string
      points?: number
    }>
  }>
}

interface LevelData {
  name: string
  title: string
  description: string
  color: string
  minPercent: number
  maxPercent: number
  summary: string
  howToHelp: string
  months: string
}

const levels: LevelData[] = [
  {
    name: "LAGGING",
    title: "beginning of its AI journey",
    description: "Your organization is at the beginning of its AI journey in procurement & supply chain.",
    color: "#0DBEBE",
    minPercent: 0,
    maxPercent: 42,
    summary: "Your organization is at the beginning of its AI journey in procurement and supply chain. While this presents challenges, it also offers opportunities to learn from others' experiences and implement modern solutions from the start. Your immediate focus should be on building foundational capabilities: consolidating data, standardizing processes, and developing leadership buy-in. Start with pilot projects that can demonstrate quick wins and build momentum. Key priorities include data quality improvement, process standardization, and basic automation of routine tasks. With focused effort and strategic investment, you can progress to the Developing level within 12-18 months.",
    howToHelp: "Valorant specializes in helping organizations build strong AI foundations from the ground up. Our experts can accelerate your journey by conducting a detailed readiness assessment, identifying high-impact pilot projects, and implementing foundational data and process improvements. We'll help you avoid common pitfalls and establish a roadmap that delivers quick wins while building toward long-term success. Contact Valorant to transform your initial status into a competitive advantage.",
    months: "12-18"
  },
  {
    name: "EMERGING",
    title: "establishing basic digital capabilities",
    description: "Your organization has established basic digital capabilities and is building toward AI readiness.",
    color: "#0DBEBE",
    minPercent: 43,
    maxPercent: 61,
    summary: "Your organization has established basic digital capabilities and is building toward AI readiness. You've made important progress in system integration, process automation, and leadership awareness. However, significant gaps remain in advanced capabilities, comprehensive strategies, advanced data analytics capabilities, and developing clear AI use cases with strong business justification. Invest in upskilling your workforce and establishing governance frameworks. With continued commitment and strategic execution, you can advance to the Advanced level within 12-24 months.",
    howToHelp: "At this critical juncture, Valorant can help you bridge the gap between basic digitalization and true AI capability. Our team excels at scaling automation initiatives, implementing advanced analytics, and developing compelling AI business cases that secure leadership buy-in. We provide hands-on training for your teams and help establish governance frameworks that ensure responsible AI deployment. Partner with Valorant to accelerate your progression to Advanced status while avoiding costly mistakes.",
    months: "12-24"
  },
  {
    name: "SCALING",
    title: "well-positioned with strong digital foundations",
    description: "Your organization is well-positioned in procurement and supply chain.",
    color: "#0DBEBE",
    minPercent: 62,
    maxPercent: 80,
    summary: "Your organization is well-positioned to capitalize on AI opportunities in procurement and supply chain. You have strong digital foundations, automated processes, and leadership support. Your teams possess solid analytical capabilities and you've identified clear AI use cases. To reach the Optimized level, focus on implementing advanced AI applications, expanding real-time capabilities, and leading industry collaboration. With sustained focus and innovation, you can achieve Optimized status within 6-12 months.",
    howToHelp: "Your strong foundation is ready for sophisticated AI applications. Valorant brings deep expertise in advanced AI implementation, from predictive analytics to autonomous decision-making systems. We'll help you develop innovative algorithms tailored to your unique needs, establish centers of excellence, and implement cutting-edge solutions like computer vision for quality control or NLP for contract analysis. Let Valorant be your partner in achieving procurement and supply chain excellence through AI innovation.",
    months: "6-12"
  },
  {
    name: "ADVANCED",
    title: "achieved excellence",
    description: "Your organization has achieved excellence in procurement and supply chain management.",
    color: "#0DBEBE",
    minPercent: 81,
    maxPercent: 100,
    summary: "Your organization has achieved excellence in AI-enabled procurement and supply chain management. You have achieved comprehensive digital transformation with fully integrated systems, automated processes, and data-driven decision making. Your teams are highly skilled and your AI initiatives are delivering significant value. To maintain leadership, focus on continuous innovation, explore emerging technologies like quantum computing, and shape industry standards. Consider mentoring other organizations and contributing to the broader advancement of AI-enabled procurement excellence while pioneering next-generation capabilities.",
    howToHelp: "Even at peak performance, continuous innovation is essential to maintain competitive advantage. Valorant partners with industry leaders to explore breakthrough technologies, optimize existing AI systems for maximum efficiency, and identify new generation opportunities. Our research team can help you pilot emerging technologies like quantum computing for optimization, implement advanced autonomous systems, and develop IP-protected innovations. Collaborate with Valorant to transform your current excellence into sustained market leadership and shape the future of AI in procurement and supply chain.",
    months: "6-12"
  }
]

export function ResultsPage({ answers, questions }: ResultsPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(true) // Show modal immediately
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false) // Only show results after modal completion
  const [formData, setFormData] = useState({
    fullName: "",
    businessEmail: "",
    company: "",
    role: "",
    region: "",
    problem: ""
  })

  /**
   * MAKE.COM INTEGRATION SETUP
   * 
   * 1. Go to https://www.make.com and create an account (if you don't have one)
   * 2. Create a new Scenario
   * 3. Add a "Webhooks" module and select "Custom webhook"
   * 4. Create a new webhook and copy the URL
   * 5. Replace the MAKE_WEBHOOK_URL below with your webhook URL
   * 
   * 6. In Make.com, add the following modules to your scenario:
   *    - Webhooks: Custom webhook (receives the form data)
   *    - Email: Send an Email (or use Gmail, Outlook, etc.)
   *    - Optional: Google Sheets/Airtable to store submissions
   *    - Optional: Add a Router to send different emails or notifications
   * 
   * 7. Map the webhook data to your email template:
   *    - Full Name: {{fullName}}
   *    - Business Email: {{businessEmail}}
   *    - Company: {{company}}
   *    - Role: {{role}}
   *    - Region: {{region}}
   *    - Problem: {{problem}}
   *    - Assessment Score: {{assessmentScore}}
   *    - Assessment Level: {{assessmentLevel}}
   *    - Assessment Percentage: {{assessmentPercentage}}
   * 
   * 8. Activate your scenario and test it!
   * 
   * SAMPLE EMAIL TEMPLATE FOR MAKE.COM:
   * -----------------------------------
   * Subject: Your AI Readiness Assessment Results - {{assessmentLevel}}
   * 
   * Dear {{fullName}},
   * 
   * Thank you for completing the AI Readiness Assessment for {{company}}!
   * 
   * Your Assessment Results:
   * - Score: {{assessmentScore}}/100 ({{assessmentPercentage}}%)
   * - Level: {{assessmentLevel}}
   * 
   * Contact Information:
   * - Name: {{fullName}}
   * - Email: {{businessEmail}}
   * - Company: {{company}}
   * - Role: {{role}}
   * - Region: {{region}}
   * 
   * Problem Statement:
   * {{problem}}
   * 
   * Your detailed report is attached to this email.
   * 
   * Our team will review your assessment and reach out within 24-48 hours 
   * to discuss how Valorant can help accelerate your AI journey.
   * 
   * Best regards,
   * The Valorant Team
   * -----------------------------------
   * 
   * OPTIONAL: GENERATING & ATTACHING PDF REPORTS
   * ---------------------------------------------
   * To attach a PDF report, you can:
   * 
   * Option 1: Use Make.com's PDF Generator module
   *   - Add "PDF Generator" module after the webhook
   *   - Create a template with the assessment data
   *   - Attach the generated PDF to the email
   * 
   * Option 2: Store pre-generated PDFs in cloud storage
   *   - Upload report templates to Google Drive/Dropbox
   *   - Use Make.com to fetch the appropriate PDF
   *   - Attach it to the email
   * 
   * Option 3: Generate PDF on your server
   *   - Create an API endpoint that generates the PDF
   *   - Call it from Make.com using HTTP module
   *   - Return the PDF URL or base64 data
   *   - Attach to email
   * 
   * Uncomment the line below in the success handler to trigger
   * a PDF download directly in the browser:
   * window.open('/path-to-report.pdf', '_blank')
   */
   
  // const MAKE_WEBHOOK_URL = "https://hook.us1.make.com/your-webhook-id-here"

  // Calculate total score (answers now contain points directly)
  const totalScore = Object.values(answers).reduce((sum, points) => {
    return sum + points
  }, 0)

  // Calculate maximum possible score
  const maxScore = questions.reduce((sum, q) => {
    const maxPoints = Math.max(...q.choices.map(c => c.points || 0))
    return sum + maxPoints
  }, 0)

  // Calculate percentage
  const percentage = Math.round((totalScore / maxScore) * 100)

  // Determine level
  const level = levels.find(l => percentage >= l.minPercent && percentage <= l.maxPercent) || levels[0]

  // For display purposes, show score out of 100 (normalized)
  const displayScore = Math.round((totalScore / maxScore) * 100)

  // Trigger confetti effect when results are shown
  useEffect(() => {
    if (showResults && window.confetti) {
      const duration = 5 * 1000; // 5 seconds
      const animationEnd = Date.now() + duration;
      
      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }
        
        window.confetti({
          particleCount: 3,
          startVelocity: 1,
          ticks: 300,
          origin: {
            x: Math.random(),
            y: 0
          },
          colors: ["#1E00FF",
        "#FF0061",
        "#E1FF00",
        "#00FF9E"],
          shapes: ['circle', 'square'],
          gravity: 1,
          scalar: 2,
          drift: 0.2,
          flat: false
        });
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [showResults]);

  return (
    <>
      {/* Modal - Shows immediately before results */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/48 flex items-center justify-center z-50 p-4"
          // Removed onClick to prevent closing modal by clicking outside
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-4xl w-full relative"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxHeight: "90vh",
              overflowY: "auto"
            }}
          >
            {/* Modal Content */}
            <div className="space-y-6">
                <div className="space-y-2">
                  <h2
                    className="display-md primary"
                  >
                    Interested in knowing more?
                  </h2>
                  <p
                    className="headline-md on-surface-variant"
                  >
                    Fill out your details to learn how Valorant can help you.
                  </p>
                </div>

                {/* Form */}
                <form
                className="space-y-4 gap-4 grid grid-cols-2"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setIsSubmitting(true)

                  try {
                    // TESTING MODE: Simulating successful submission
                    // Log the data that would be sent to the webhook
                    console.log("Form submitted successfully (TEST MODE):", {
                      fullName: formData.fullName,
                      businessEmail: formData.businessEmail,
                      company: formData.company,
                      role: formData.role,
                      region: formData.region,
                      problem: formData.problem,
                      assessmentScore: displayScore,
                      assessmentLevel: level.name,
                      assessmentPercentage: percentage,
                      answersForPythonScript: answers, // Format: {1: 75, 2: 50, 3: 100, ...}
                      timestamp: new Date().toISOString(),
                    })
                    
                    // Also log the JSON format for copy-paste into Python script
                    console.log("Answers JSON for Python script:", JSON.stringify(answers, null, 2))

                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 1000))

                    // When ready to use real webhook, uncomment this section:
                    /*
                    const response = await fetch(MAKE_WEBHOOK_URL, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        fullName: formData.fullName,
                        businessEmail: formData.businessEmail,
                        company: formData.company,
                        role: formData.role,
                        region: formData.region,
                        problem: formData.problem,
                        assessmentScore: displayScore,
                        assessmentLevel: level.name,
                        assessmentPercentage: percentage,
                        timestamp: new Date().toISOString(),
                      }),
                    })

                    if (!response.ok) {
                      throw new Error("Form submission failed: " + response.statusText)
                    }
                    */

                    // Success - go directly to results page
                    setIsModalOpen(false)
                    setShowResults(true)
                    
                    // Optional: Trigger file download here
                    // window.open('path-to-report.pdf', '_blank')
                  } catch (error) {
                    // Handle network or other errors
                    console.error("Error submitting form:", error)
                    alert("There was an error submitting your form. Please check your connection and try again.")
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
              >
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="headline-sm on-surface-variant"
                    
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    placeholder="Name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    style={{
                      display: "flex",
                      height: "48px",
                      padding: "0 24px",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexShrink: 0,
                      alignSelf: "stretch",
                      borderRadius: "999px",
                      border: "1px solid var(--sys-outlineVariant, #BBC9C9)",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "14px",
                      width: "100%", // replicate w-full from Tailwind
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      marginTop: "12px"
                    }}
                    className="focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Business Email */}
                <div>
                  <label
                    htmlFor="businessEmail"
                    className="headline-sm on-surface-variant"
                  >
                    Business Email <span style={{ color: "#FF0000" }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="businessEmail"
                    placeholder="Email"
                    value={formData.businessEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, businessEmail: e.target.value })
                    }
                    required
                    style={{
                      display: "flex",
                      height: "48px",
                      padding: "0 24px",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexShrink: 0,
                      alignSelf: "stretch",
                      borderRadius: "999px",
                      border: "1px solid var(--sys-outlineVariant, #BBC9C9)",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "14px",
                      width: "100%",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      marginTop: "12px"
                    }}
                    className="focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Company */}
                <div>
                  <label
                    htmlFor="company"
                    className="headline-sm on-surface-variant"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    placeholder="Company"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    style={{
                      display: "flex",
                      height: "48px",
                      padding: "0 24px",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexShrink: 0,
                      alignSelf: "stretch",
                      borderRadius: "999px",
                      border: "1px solid var(--sys-outlineVariant, #BBC9C9)",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "14px",
                      width: "100%",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      marginTop: "12px"
                    }}
                    className="focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="headline-sm on-surface-variant"
                  >
                    Role
                  </label>
                  <input
                    type="text"
                    id="role"
                    placeholder="Role"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    style={{
                      display: "flex",
                      height: "48px",
                      padding: "0 24px",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexShrink: 0,
                      alignSelf: "stretch",
                      borderRadius: "999px",
                      border: "1px solid var(--sys-outlineVariant, #BBC9C9)",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "14px",
                      width: "100%",
                      transition: "border-color 0.2s",
                        boxSizing: "border-box",
                      marginTop: "12px"
                    }}
                    className="focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Region */}
                <div className="col-span-2">
                  <label
                    htmlFor="region"
                    className="headline-sm on-surface-variant"
                  >
                    Region
                  </label>
                  <select
                    id="region"
                    value={formData.region}
                    onChange={(e) =>
                      setFormData({ ...formData, region: e.target.value })
                    }
                    style={{
                      display: "flex",
                      height: "48px",
                      padding: "0 24px",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexShrink: 0,
                      alignSelf: "stretch",
                      borderRadius: "999px",
                      border: "1px solid var(--sys-outlineVariant, #BBC9C9)",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "14px",
                      width: "100%",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      marginTop: "12px",
                      appearance: "none",
                      background: "white",
                      cursor: "pointer",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%233C4949' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1.5rem center"
                    }}
                    className="focus:outline-none focus:border-teal-500"
                  >
                    <option value="">Select region</option>
                    <option value="north-america">North America</option>
                    <option value="europe">Europe</option>
                    <option value="asia-pacific">Asia Pacific</option>
                    <option value="latin-america">Latin America</option>
                    <option value="middle-east-africa">Middle East & Africa</option>
                  </select>
                </div>

                {/* Problem Description */}
                <div className="col-span-2">
                  <label
                    htmlFor="problem"
                    className="headline-sm on-surface-variant"
                  >
                    What problem are you trying to solve?
                  </label>
                  <textarea
                    id="problem"
                    placeholder="Describe your problem"
                    value={formData.problem}
                    onChange={(e) =>
                      setFormData({ ...formData, problem: e.target.value })
                    }
                    rows={4}
                    style={{
                      display: "flex",
                      padding: "16px 24px",
                      alignItems: "flex-start",
                      flexShrink: 0,
                      alignSelf: "stretch",
                      borderRadius: "16px",
                      border: "1px solid var(--sys-outlineVariant, #BBC9C9)",
                      fontFamily: "Geist, sans-serif",
                      fontSize: "14px",
                      width: "100%",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                      marginTop: "12px",
                        resize: "none"
                    }}
                    className="focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="title-md surface w-full  col-span-2 justify-center h-full px-6 py-4 rounded-full  cursor-pointer"
                  style={{
                    background: isSubmitting 
                      ? "var(--sys-outlineVariant, #BBC9C9)" 
                      : "var(--primary-container, #07BDBD)",
                    whiteSpace: "wrap",
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? "not-allowed" : "pointer"
                  }}
                  
                >
                  {isSubmitting ? "SUBMITTING..." : "SUBMIT & DOWNLOAD FULL REPORT"}
                </Button>
                </form>
            </div>
          </div>
        </div>
      )}

      {/* Results Page - Only shown after modal is completed */}
      {showResults && (
    <div className="w-full max-w-4xl mx-auto space-y-8 p-4">
      {/* Score Display */}
      <div className="text-center space-y-6">
        {/* Large Score */}
        <div>
          <div
            style={{
              color: "#F9FAF9",
              textAlign: "center",
              fontFamily: "Geist, sans-serif",
              fontSize: "120px",
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "100%",
              letterSpacing: "-0.048em"
            }}
          >
            {displayScore}
          </div>
          <div
            style={{
              color: "#F9FAF9",
              textAlign: "center",
              fontFamily: "Geist, sans-serif",
              fontSize: "18px",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
              letterSpacing: "-0.036px",
              marginTop: "8px"
            }}
          >
            out of 100
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto space-y-3">
          <div className="relative w-full h-[6px] flex items-center">
            {/* Dotted background track */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{
                background: `repeating-linear-gradient(
                  to right,
                  rgba(249, 250, 249, 0.3) 0px,
                  rgba(249, 250, 249, 0.3) 4px,
                  transparent 4px,
                  transparent 8px
                )`
              }}
            />
            
            {/* Progress fill */}
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${percentage}%`,
                background: level.color
              }}
            />
            
            {/* Start marker (filled circle) */}
            <div 
              className="absolute left-0 top-0 -translate-y-1/2 w-[18px] h-[18px] rounded-full border-[3px]"
              style={{
                background: level.color,
                borderColor: level.color,
                top: '-75%'
              }}
            />
            
            {/* End marker (filled circle) */}
            <div 
              className="absolute -right-4 top-0 -translate-y-1/2 w-[18px] h-[18px] rounded-full"
              style={{
                background: "rgba(249, 250, 249, 0.4)",
                top: '-75%'
              }}
            />
          </div>
          
          {/* Level Badge - positioned under the progress point */}
          <div 
            className="relative w-full"
            style={{
              paddingTop: "8px"
            }}
          >
            <div
              className="absolute transition-all duration-1000 ease-out"
              style={{
                left: `${percentage}%`,
                transform: "translateX(-50%)",
                color: level.color,
                fontFamily: "Geist Mono, monospace",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "140%",
                letterSpacing: "0.28px",
                textTransform: "uppercase",
                whiteSpace: "nowrap"
              }}
            >
              {level.name}
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-4">
          <h1
            className={"display-md surface"}
          >
            Your organization is at the <span style={{ color: level.color }}>{level.title}</span>
            {''} in procurement & supply chain.
          </h1>
          <p
            className={"body-sm surface"}
          >
            While this presents challenges, it also offers opportunities to learn from others' experiences and implement modern solutions from the start.
          </p>
        </div>
      </div>

      {/* Assessment Summary Card */}
      <div
        className="rounded-2xl p-8 space-y-6"
        style={{
          background: "rgba(249, 250, 249, 0.95)",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)"
        }}
      >
        {/* Your Assessment Summary */}
        <div
          className="space-y-4 p-1"
          style={{
            borderRadius: "16px",
            background: "#FFF",
            boxShadow:
              "0 4px 8px 3px var(--states-shadow-opacity-16, rgba(0, 0, 0, 0.16)), 0 1px 3px 0 var(--states-shadow-opacity-32, rgba(0, 0, 0, 0.32))",
            border: "3px solid transparent",
            backgroundImage:
              "linear-gradient(#FFF, #FFF), linear-gradient(90deg, #ff6ec4 0%, #fbc531 15%, #48dbfb 35%, #1dd1a1 55%, #5f27cd 75%, #ff6ec4 100%)",
            backgroundOrigin: "padding-box, border-box",
            backgroundClip: "padding-box, border-box"
          }}
        >
          <div className={'space-y-2'}
            style={{
              background: "linear-gradient(0deg, rgba(249,250,249,0.20) 0%, rgba(7,189,189,0.20) 100%)",
              borderRadius: "10px",
              padding: "24px"
            }}
          >
          <h2
            className={"headline-lg on-surface-variant"}
          >
            Your Assessment Summary
          </h2>
          <p
            className={"body-sm on-surface-variant"}
          >
            {level.summary}
          </p>
        </div>
        </div>

        {/* How Valorant can help */}
        <div className="space-y-4">
          <h3
           className={"headline-lg on-surface-variant"}
          >
            How Valorant can help
          </h3>
          <p
             className={"body-sm on-surface-variant"}
          >
            {level.howToHelp}
          </p>
        </div>
      </div>

    </div>
      )}
    </>
  )
}

