import SEOHead from '../components/SEOHead.jsx'
import AssessmentWidget from '../components/AssessmentWidget.jsx'

export default function Assessment() {
  return (
    <>
      <SEOHead
        title="Free AI Readiness Assessment | By MAM Studio"
        description="Take the free By MAM Studio AI Readiness Assessment — 18 questions, a Claude-powered analysis, and a personalized 90-day plan with specific product and service recommendations."
        canonical="https://bymamstudio.com/assessment"
      />
      <AssessmentWidget />
    </>
  )
}
