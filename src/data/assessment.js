// Questions for the free AI Readiness Assessment (/assessment).
// Shared by the widget (src/components/AssessmentWidget.jsx) and the server endpoint
// (functions/api/assessment.js), which only accepts answers that match these options exactly.
export const SECTIONS = [
  {
    id: 'role',
    title: 'Your Role & Context',
    questions: [
      {
        id: 'role_type',
        text: 'Which best describes your primary role?',
        options: [
          'Marketing Director / Growth Lead',
          'HR Leader / People Operations',
          'Founder / Operator',
          'Consultant / Advisor',
          'Technical Lead / Developer',
          'Executive / VP',
        ],
      },
      {
        id: 'org_size',
        text: 'How large is your organization or team?',
        options: [
          'Solo / 1-5 people',
          '6-25 people',
          '26-100 people',
          '101-500 people',
          '500+ people',
        ],
      },
      {
        id: 'industry',
        text: 'Which industry are you in?',
        options: [
          'Technology / SaaS',
          'Professional Services / Consulting',
          'Healthcare / HR',
          'Retail / E-commerce',
          'Financial Services',
          'Agency / Creative',
          'Other',
        ],
      },
    ],
  },
  {
    id: 'current_ai',
    title: 'Current AI Usage',
    questions: [
      {
        id: 'ai_usage_frequency',
        text: 'How often does your team use AI tools today?',
        options: [
          'Never — we haven\'t started',
          'Occasionally — a few people experimenting',
          'Regularly — multiple people, multiple tools',
          'Daily — AI is part of our workflow',
          'Systematically — AI is infrastructure, not a tool',
        ],
      },
      {
        id: 'ai_tools_used',
        text: 'Which AI tools does your team currently use? (Pick the closest match)',
        options: [
          'None yet',
          'ChatGPT only',
          'Claude only',
          'Multiple: Claude, ChatGPT, Gemini, etc.',
          'Enterprise AI platforms (Copilot, etc.) plus individual tools',
        ],
      },
      {
        id: 'ai_output_quality',
        text: 'How would you describe the quality and consistency of your AI outputs?',
        options: [
          'We don\'t have outputs yet',
          'Inconsistent — quality varies a lot by who is prompting',
          'Okay — some good outputs but no reliable system',
          'Good — we have some prompts that work reliably',
          'Excellent — our outputs are consistent and brand-accurate',
        ],
      },
    ],
  },
  {
    id: 'governance',
    title: 'Governance & Infrastructure',
    questions: [
      {
        id: 'governance_state',
        text: 'What is your current AI governance status?',
        options: [
          'No governance — people use whatever they want',
          'Informal — some understanding but nothing documented',
          'Basic — we have a policy but no enforcement',
          'Structured — documented policy, ownership assigned',
          'Mature — policy, ownership, review cadence, compliance integration',
        ],
      },
      {
        id: 'data_readiness',
        text: 'How would you describe your organization\'s data and documentation readiness for AI?',
        options: [
          'Poor — data is scattered and not AI-accessible',
          'Developing — some structure but significant gaps',
          'Moderate — core data is organized but not optimized',
          'Good — well-structured, reasonably accessible',
          'Excellent — standardized, AI-formatted, well-governed',
        ],
      },
      {
        id: 'skills_infrastructure',
        text: 'Do you have a structured prompt or skills library for your team?',
        options: [
          'No — everyone prompts independently',
          'Informal — a few shared prompts in a doc somewhere',
          'Partial — some structured prompts for specific tasks',
          'Yes — a maintained prompt library with documentation',
          'Yes — a full skills library with governance and versioning',
        ],
      },
    ],
  },
  {
    id: 'gaps',
    title: 'Biggest Gaps & Priorities',
    questions: [
      {
        id: 'critical_gap',
        text: 'What is your single biggest AI-related challenge right now?',
        options: [
          'I don\'t know where to start',
          'Inconsistent outputs — quality varies too much',
          'No governance — uncontrolled AI use is a risk',
          'Slow adoption — team isn\'t using AI effectively',
          'Scaling — what works for one person doesn\'t scale to the team',
          'Maintenance — our AI systems degrade over time',
        ],
      },
      {
        id: 'primary_goal',
        text: 'What is your primary AI goal in the next 90 days?',
        options: [
          'Get a clear picture of where we stand (diagnostic)',
          'Implement AI in our marketing function',
          'Implement AI in our HR / people operations',
          'Build a custom Claude skills library',
          'Establish governance before we go further',
          'Maintain and improve existing AI systems',
        ],
      },
      {
        id: 'budget_authority',
        text: 'What is your decision-making authority for AI investments?',
        options: [
          'I\'m exploring — not yet in a buying position',
          'I can recommend but need leadership approval',
          'I have budget up to $5,000',
          'I have budget up to $15,000',
          'I have budget above $15,000 or can get it',
        ],
      },
    ],
  },
  {
    id: 'readiness',
    title: 'Implementation Readiness',
    questions: [
      {
        id: 'timeline',
        text: 'What is your desired implementation timeline?',
        options: [
          'ASAP — I need to move immediately',
          '30 days — this quarter',
          '60-90 days — this cycle',
          '3-6 months — deliberate rollout',
          'Exploring — no specific timeline yet',
        ],
      },
      {
        id: 'internal_capacity',
        text: 'Do you have internal capacity to maintain AI systems once implemented?',
        options: [
          'No — we need ongoing external support',
          'Limited — one person could own it if trained',
          'Moderate — a small team could manage it',
          'Yes — we have dedicated internal capacity',
          'Yes — we have a full AI/ops team',
        ],
      },
      {
        id: 'biggest_fear',
        text: 'What is your biggest concern about AI implementation?',
        options: [
          'Wasting money on tools we won\'t use',
          'Poor quality outputs damaging our brand',
          'Data security and compliance risk',
          'Team resistance and low adoption',
          'Building something that breaks when AI models update',
          'Not knowing if it\'s actually working',
        ],
      },
    ],
  },
]

export const QUESTIONS = SECTIONS.flatMap((s) => s.questions)
