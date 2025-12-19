import { props } from '@webflow/data-types';
import { declareComponent } from '@webflow/react';
import { useState } from 'react';
import { QuestionForm, type Question } from './QuestionForm';
import { ResultsPage } from './ResultsPage';

import '@/global.css';
import '@/index.css';

// Helper to parse choices JSON
function parseChoices(choicesJson: string): { id: string; text: string; points?: number }[] {
  try {
    return JSON.parse(choicesJson);
  } catch {
    return [
      { id: "A", text: "Option A", points: 25 },
      { id: "B", text: "Option B", points: 50 },
      { id: "C", text: "Option C", points: 75 },
      { id: "D", text: "Option D", points: 100 },
    ];
  }
}

interface QuestionFormWebflowProps {
  // Foundation & Infrastructure (Q1-3)
  q1_question?: string;
  q1_choices?: string;
  q1_points?: number;
  
  q2_question?: string;
  q2_choices?: string;
  q2_points?: number;
  
  q3_question?: string;
  q3_choices?: string;
  q3_points?: number;
  
  // Process & Operations (Q4-6)
  q4_question?: string;
  q4_choices?: string;
  q4_points?: number;
  
  q5_question?: string;
  q5_choices?: string;
  q5_points?: number;
  
  q6_question?: string;
  q6_choices?: string;
  q6_points?: number;
  
  // Leadership & Strategy (Q7-8)
  q7_question?: string;
  q7_choices?: string;
  q7_points?: number;
  
  q8_question?: string;
  q8_choices?: string;
  q8_points?: number;
  
  // Talent & Capabilities (Q9-11)
  q9_question?: string;
  q9_choices?: string;
  q9_points?: number;
  
  q10_question?: string;
  q10_choices?: string;
  q10_points?: number;
  
  q11_question?: string;
  q11_choices?: string;
  q11_points?: number;
  
  // Governance & Compliance (Q12)
  q12_question?: string;
  q12_choices?: string;
  q12_points?: number;
  
  // Measurement & Investment (Q13-15)
  q13_question?: string;
  q13_choices?: string;
  q13_points?: number;
  
  q14_question?: string;
  q14_choices?: string;
  q14_points?: number;
  
  q15_question?: string;
  q15_choices?: string;
  q15_points?: number;
}

// Default choices for each question
const q1Choices = JSON.stringify([
  { id: "A", text: "Highly fragmented across multiple systems with significant quality issues", points: 25 },
  { id: "B", text: "Partially integrated with some data quality concerns", points: 50 },
  { id: "C", text: "Mostly integrated with good data quality across core systems", points: 75 },
  { id: "D", text: "Fully integrated with high-quality, real-time data across all operations", points: 100 }
]);

const q2Choices = JSON.stringify([
  { id: "A", text: "Minimal integration with mostly siloed systems and traditional suppliers (<25% digitized)", points: 25 },
  { id: "B", text: "Basic integration with manual transfers and mixed supplier capabilities (25-50% digitized)", points: 50 },
  { id: "C", text: "Moderate integration with automated workflows and majority digital suppliers (50-75% digitized)", points: 75 },
  { id: "D", text: "Fully integrated ecosystem with seamless APIs and highly digitized suppliers (>75%)", points: 100 }
]);

const q3Choices = JSON.stringify([
  { id: "A", text: "Primarily on-premise legacy systems", points: 33 },
  { id: "B", text: "Hybrid environment with limited cloud adoption", points: 50 },
  { id: "C", text: "Significant cloud presence with modern architecture", points: 75 },
  { id: "D", text: "Cloud-native infrastructure with scalable, AI-ready platforms", points: 100 }
]);

const q4Choices = JSON.stringify([
  { id: "A", text: "Highly manual with significant process variations (<25% automated)", points: 25 },
  { id: "B", text: "Some standardization with basic automation in some areas (25-50% automated)", points: 50 },
  { id: "C", text: "Well-defined processes with significant automation (50-75% automated)", points: 75 },
  { id: "D", text: "Fully standardized with extensive automation across operations (>75% automated)", points: 100 }
]);

const q5Choices = JSON.stringify([
  { id: "A", text: "Limited visibility with basic reporting only", points: 25 },
  { id: "B", text: "Good visibility with regular spend analysis", points: 50 },
  { id: "C", text: "Advanced analytics with predictive insights", points: 75 },
  { id: "D", text: "Real-time spend intelligence with AI-driven recommendations", points: 100 }
]);

const q6Choices = JSON.stringify([
  { id: "A", text: "Limited external data integration", points: 25 },
  { id: "B", text: "Basic external data feeds with manual processing", points: 50 },
  { id: "C", text: "Good external data integration with some automation", points: 75 },
  { id: "D", text: "Advanced external data ecosystem with real-time integration", points: 100 }
]);

const q7Choices = JSON.stringify([
  { id: "A", text: "Minimal awareness with historical struggles in technology adoption", points: 25 },
  { id: "B", text: "Some interest but no formal commitment or proven change management capability", points: 50 },
  { id: "C", text: "Strong support with budget and good track record", points: 75 },
  { id: "D", text: "Strategic priority with executive sponsorship and resilient change culture", points: 100 }
]);

const q8Choices = JSON.stringify([
  { id: "A", text: "No formal digital strategy or technology risk assessment", points: 25 },
  { id: "B", text: "Strategy exists but implementation is early with basic risk processes", points: 50 },
  { id: "C", text: "Active transformation with clear roadmap and comprehensive risk framework", points: 75 },
  { id: "D", text: "Advanced digital maturity with AI at core and specific AI governance guidelines", points: 100 }
]);

const q9Choices = JSON.stringify([
  { id: "A", text: "Limited technical skills with mostly traditional procurement expertise", points: 25 },
  { id: "B", text: "Basic data analysis capabilities with some technical knowledge", points: 50 },
  { id: "C", text: "Strong analytical skills with some experience in advanced technologies", points: 75 },
  { id: "D", text: "High data literacy with team members experienced in AI/ML technologies", points: 100 }
]);

const q10Choices = JSON.stringify([
  { id: "A", text: "No specific AI use cases identified", points: 25 },
  { id: "B", text: "Aware of potential applications but no detailed analysis", points: 50 },
  { id: "C", text: "Some use cases identified with preliminary business cases", points: 75 },
  { id: "D", text: "Comprehensive AI roadmap with prioritized use cases and ROI projections", points: 100 }
]);

const q11Choices = JSON.stringify([
  { id: "A", text: "Basic automation of routine tasks", points: 25 },
  { id: "B", text: "Moderate AI adoption with improved analytics and insights", points: 50 },
  { id: "C", text: "Advanced AI capabilities with predictive and prescriptive analytics", points: 75 },
  { id: "D", text: "Fully autonomous procurement and supply chain operations with real-time optimization", points: 100 }
]);

const q12Choices = JSON.stringify([
  { id: "A", text: "Limited compliance processes but no AI-specific protocols", points: 25 },
  { id: "B", text: "Basic compliance processes but no AI-specific protocols", points: 50 },
  { id: "C", text: "Strong compliance culture with some consideration for AI systems", points: 75 },
  { id: "D", text: "Comprehensive AI governance with audit trails and compliance monitoring", points: 100 }
]);

const q13Choices = JSON.stringify([
  { id: "A", text: "Basic metrics with limited tracking", points: 25 },
  { id: "B", text: "Standard KPIs with regular reporting", points: 50 },
  { id: "C", text: "Advanced metrics with trend analysis and benchmarking", points: 75 },
  { id: "D", text: "Comprehensive performance framework with predictive indicators", points: 100 }
]);

const q14Choices = JSON.stringify([
  { id: "A", text: "Primarily intuition and experience-based decisions", points: 25 },
  { id: "B", text: "Some data analysis but limited systematic approach", points: 50 },
  { id: "C", text: "Data-informed decisions with regular analytical support", points: 75 },
  { id: "D", text: "Fully data-driven decisions with advanced analytics and modeling", points: 100 }
]);

const q15Choices = JSON.stringify([
  { id: "A", text: "No specific budget or exploratory phase only", points: 25 },
  { id: "B", text: "Limited budget (<10%) with 2-3 year implementation horizon", points: 50 },
  { id: "C", text: "Moderate budget (10-25%) with 12-18 month pilot programs planned", points: 75 },
  { id: "D", text: "Significant budget (>25%) with 6-12 month rapid deployment strategy", points: 100 }
]);



// Wrapper component that handles Webflow props
export function QuestionFormWebflow(props: QuestionFormWebflowProps) {
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  
  const questions: Question[] = [];
  
  // Define category mapping
  const categoryMap: Record<number, string> = {
    1: "Foundation & Infrastructure",
    2: "Foundation & Infrastructure",
    3: "Foundation & Infrastructure",
    4: "Process & Operations",
    5: "Process & Operations",
    6: "Process & Operations",
    7: "Leadership & Strategy",
    8: "Leadership & Strategy",
    9: "Talent & Capabilities",
    10: "Talent & Capabilities",
    11: "Talent & Capabilities",
    12: "Governance & Compliance",
    13: "Measurement & Investment",
    14: "Measurement & Investment",
    15: "Measurement & Investment",
  };
  
  // Build questions array from props
  for (let i = 1; i <= 15; i++) {
    const questionKey = `q${i}_question` as keyof QuestionFormWebflowProps;
    const choicesKey = `q${i}_choices` as keyof QuestionFormWebflowProps;
    
      const question = props[questionKey];
    const choices = props[choicesKey];
    
    if (question) {
      questions.push({
        category: categoryMap[i],
        question: question as string,
        choices: parseChoices(choices as string),
      });
    }
  }

  const handleComplete = (completedAnswers: Record<number, number>) => {
    console.log('Quiz completed with answers:', completedAnswers);
    setAnswers(completedAnswers);
    setIsComplete(true);
    
    // Dispatch custom event that can be listened to in Webflow
    const event = new CustomEvent('questionFormComplete', {
      detail: { answers: completedAnswers },
      bubbles: true,
    });
    window.dispatchEvent(event);
  };

  // Conditionally render ResultsPage when complete
  if (isComplete) {
    return <ResultsPage answers={answers} questions={questions} />;
  }

  return <QuestionForm questions={questions} onComplete={handleComplete} />;
}

// Declare the component for Webflow
const WebflowQuestionForm = declareComponent(QuestionFormWebflow, {
  // Component metadata
  name: "Question Form",
  description: "An interactive AI readiness assessment form with 15 questions covering data quality, integration, infrastructure, process automation, analytics, leadership, strategy, talent, compliance, KPIs, decision-making, budget, and maturity goals",
  group: "Forms",

  // Prop definitions
  props: {
    // Q1: Data Quality and Integration (25 points)
    q1_question: props.Text({
      name: "Q1 - Question",
      defaultValue: "How would you rate the current state of your procurement and supply chain data?",
    }),
    q1_choices: props.Text({
      name: "Q1 - Choices (JSON)",
      defaultValue: q1Choices,
    }),
    q1_points: props.Number({
      name: "Q1 - Points",
      defaultValue: 25,
    }),
    
    // Q2: System and Supplier Integration (25 points)
    q2_question: props.Text({
      name: "Q2 - Question",
      defaultValue: "What is the current level of integration between your systems (ERP, WMS, TMS) and key suppliers' digital capabilities?",
    }),
    q2_choices: props.Text({
      name: "Q2 - Choices (JSON)",
      defaultValue: q2Choices,
    }),
    q2_points: props.Number({
      name: "Q2 - Points",
      defaultValue: 25,
    }),
    
    // Q3: Cloud and Digital Infrastructure (50 points)
    q3_question: props.Text({
      name: "Q3 - Question",
      defaultValue: "How would you describe your organization's cloud and digital infrastructure readiness?",
    }),
    q3_choices: props.Text({
      name: "Q3 - Choices (JSON)",
      defaultValue: q3Choices,
    }),
    q3_points: props.Number({
      name: "Q3 - Points",
      defaultValue: 50,
    }),
    
    // Q4: Process Standardization and Automation (50 points)
    q4_question: props.Text({
      name: "Q4 - Question",
      defaultValue: "How standardized and automated are your procurement and supply chain processes?",
    }),
    q4_choices: props.Text({
      name: "Q4 - Choices (JSON)",
      defaultValue: q4Choices,
    }),
    q4_points: props.Number({
      name: "Q4 - Points",
      defaultValue: 50,
    }),
    
    // Q5: Spend Visibility and Analytics (25 points)
    q5_question: props.Text({
      name: "Q5 - Question",
      defaultValue: "How comprehensive is your current spend analysis and visibility?",
    }),
    q5_choices: props.Text({
      name: "Q5 - Choices (JSON)",
      defaultValue: q5Choices,
    }),
    q5_points: props.Number({
      name: "Q5 - Points",
      defaultValue: 25,
    }),
    
    // Q6: External Data Integration (50 points)
    q6_question: props.Text({
      name: "Q6 - Question",
      defaultValue: "How capable is your organization of integrating external data sources (market intelligence, supplier performance, risk data)?",
    }),
    q6_choices: props.Text({
      name: "Q6 - Choices (JSON)",
      defaultValue: q6Choices,
    }),
    q6_points: props.Number({
      name: "Q6 - Points",
      defaultValue: 50,
    }),
    
    // Q7: Leadership Support and Change Management (100 points)
    q7_question: props.Text({
      name: "Q7 - Question",
      defaultValue: "What level of support exists from senior leadership for AI transformation in procurement and supply chain?",
    }),
    q7_choices: props.Text({
      name: "Q7 - Choices (JSON)",
      defaultValue: q7Choices,
    }),
    q7_points: props.Number({
      name: "Q7 - Points",
      defaultValue: 100,
    }),
    
    // Q8: Digital Strategy and Risk Management (25 points)
    q8_question: props.Text({
      name: "Q8 - Question",
      defaultValue: "How mature is your organization's digital transformation strategy including technology risk assessment?",
    }),
    q8_choices: props.Text({
      name: "Q8 - Choices (JSON)",
      defaultValue: q8Choices,
    }),
    q8_points: props.Number({
      name: "Q8 - Points",
      defaultValue: 25,
    }),
    
    // Q9: Skills and Talent (25 points)
    q9_question: props.Text({
      name: "Q9 - Question",
      defaultValue: "What is the current level of data literacy and technical expertise within your procurement and supply chain teams?",
    }),
    q9_choices: props.Text({
      name: "Q9 - Choices (JSON)",
      defaultValue: q9Choices,
    }),
    q9_points: props.Number({
      name: "Q9 - Points",
      defaultValue: 25,
    }),
    
    // Q10: AI Use Case Identification (50 points)
    q10_question: props.Text({
      name: "Q10 - Question",
      defaultValue: "How well has your organization identified specific AI use cases for your procurement and supply chain?",
    }),
    q10_choices: props.Text({
      name: "Q10 - Choices (JSON)",
      defaultValue: q10Choices,
    }),
    q10_points: props.Number({
      name: "Q10 - Points",
      defaultValue: 50,
    }),
    
        // Q11: AI Maturity Goals (25 points)
    q11_question: props.Text({
      name: "Q11 - Question",
      defaultValue: "Where does your organization aspire to be in terms of AI maturity within the next 3-5 years?",
    }),
    q11_choices: props.Text({
      name: "Q11 - Choices (JSON)",
      defaultValue: q11Choices,
    }),
    q11_points: props.Number({
      name: "Q11 - Points",
      defaultValue: 25,
    }),

    // Q11: Compliance and Audit Readiness (25 points)
    q12_question: props.Text({
      name: "Q12 - Question",
      defaultValue: "How prepared is your organization to handle compliance and audit requirements for AI systems?",
    }),
    q12_choices: props.Text({
      name: "Q12 - Choices (JSON)",
      defaultValue: q12Choices,
    }),
    q12_points: props.Number({
      name: "Q12 - Points",
      defaultValue: 25,
    }),
    
    // Q12: KPI and Metrics Framework (50 points)
    q13_question: props.Text({
      name: "Q13 - Question",
      defaultValue: "How comprehensive is your current performance measurement system for procurement and supply chain?",
    }),
    q13_choices: props.Text({
      name: "Q13 - Choices (JSON)",
      defaultValue: q13Choices,
    }),
    q13_points: props.Number({
      name: "Q13 - Points",
      defaultValue: 50,
    }),
    
    // Q13: Decision-Making Process (50 points)
    q14_question: props.Text({
      name: "Q14 - Question",
      defaultValue: "How data-driven is your current decision-making process?",
    }),
    q14_choices: props.Text({
      name: "Q14 - Choices (JSON)",
      defaultValue: q14Choices,
    }),
    q14_points: props.Number({
      name: "Q14 - Points",
      defaultValue: 50,
    }),
    
    // Q14: Budget and Implementation Timeline (75 points)
    q15_question: props.Text({
      name: "Q15 - Question",
      defaultValue: "What is your AI investment commitment and expected implementation timeline?",
    }),
    q15_choices: props.Text({
      name: "Q15 - Choices (JSON)",
      defaultValue: q15Choices,
    }),
    q15_points: props.Number({
      name: "Q15 - Points",
      defaultValue: 75,
    }),
    

  },

  // Optional configuration
  options: {
    applyTagSelectors: true,
  },
});

export default WebflowQuestionForm;

