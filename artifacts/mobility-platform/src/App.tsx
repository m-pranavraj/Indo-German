import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import NotFound from "@/pages/not-found";
import { LandingPage } from "@/pages/landing";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AIOnboarding } from "@/pages/AIOnboarding";

// Candidate Pages
import { CandidateDashboard } from "@/pages/candidate/CandidateDashboard";
import { CandidateJourney } from "@/pages/candidate/CandidateJourney";
import { CandidateReadiness } from "@/pages/candidate/CandidateReadiness";
import { CandidateDocuments } from "@/pages/candidate/CandidateDocuments";
import { CandidateTraining } from "@/pages/candidate/CandidateTraining";
import { CandidateRecognition } from "@/pages/candidate/CandidateRecognition";
import { CandidateApplications } from "@/pages/candidate/CandidateApplications";
import { CandidateVisa } from "@/pages/candidate/CandidateVisa";
import { CandidateWelfare } from "@/pages/candidate/CandidateWelfare";
import { CandidateProfile } from "@/pages/candidate/CandidateProfile";
import { CandidateRoadmap } from "@/pages/candidate/CandidateRoadmap";
import { CandidateResume } from "@/pages/candidate/CandidateResume";
import { CandidateCertifications } from "@/pages/candidate/CandidateCertifications";
import { CandidateNetwork } from "@/pages/candidate/CandidateNetwork";

// Employer Pages
import { EmployerDashboard } from "@/pages/employer/EmployerDashboard";
import { EmployerVacancies } from "@/pages/employer/EmployerVacancies";
import { EmployerMatches } from "@/pages/employer/EmployerMatches";
import { EmployerApplications } from "@/pages/employer/EmployerApplications";
import { EmployerInterviews } from "@/pages/employer/EmployerInterviews";
import { EmployerOffers } from "@/pages/employer/EmployerOffers";
import { EmployerProfile } from "@/pages/employer/EmployerProfile";

// Trainer Pages
import { TrainerDashboard } from "@/pages/trainer/TrainerDashboard";
import { TrainerCourses } from "@/pages/trainer/TrainerCourses";
import { TrainerBatches } from "@/pages/trainer/TrainerBatches";
import { TrainerStudents } from "@/pages/trainer/TrainerStudents";

// Facilitator Pages
import { FacilitatorDashboard } from "@/pages/facilitator/FacilitatorDashboard";
import { FacilitatorCandidates } from "@/pages/facilitator/FacilitatorCandidates";
import { FacilitatorRecognition } from "@/pages/facilitator/FacilitatorRecognition";
import { FacilitatorVisa } from "@/pages/facilitator/FacilitatorVisa";
import { FacilitatorWelfare } from "@/pages/facilitator/FacilitatorWelfare";

// Government Pages
import { GovernmentDashboard } from "@/pages/government/GovernmentDashboard";
import { GovernmentPipeline } from "@/pages/government/GovernmentPipeline";
import { MaharashtraMap } from "@/pages/government/MaharashtraMap";

// Admin Pages
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminCandidates } from "@/pages/admin/AdminCandidates";
import { AdminEmployers } from "@/pages/admin/AdminEmployers";
import { AdminDocuments } from "@/pages/admin/AdminDocuments";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false },
  },
});

function ProtectedRoute({ component: Component, allowedRoles }: { component: React.ComponentType; allowedRoles?: string[] }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) return <Redirect to="/" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Redirect to={`/${user.role}/dashboard`} />;
  }

  return (
    <DashboardLayout>
      <Component />
    </DashboardLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />

      {/* AI Onboarding — public route, no auth needed */}
      <Route path="/onboarding" component={AIOnboarding} />

      {/* Candidate Routes */}
      <Route path="/candidate/dashboard">{() => <ProtectedRoute component={CandidateDashboard} allowedRoles={["candidate"]} />}</Route>
      <Route path="/candidate/roadmap">{() => <ProtectedRoute component={CandidateRoadmap} allowedRoles={["candidate"]} />}</Route>
      <Route path="/candidate/resume">{() => <ProtectedRoute component={CandidateResume} allowedRoles={["candidate"]} />}</Route>
      <Route path="/candidate/journey">{() => <ProtectedRoute component={CandidateJourney} allowedRoles={["candidate"]} />}</Route>
      <Route path="/candidate/readiness">{() => <ProtectedRoute component={CandidateReadiness} allowedRoles={["candidate"]} />}</Route>
      <Route path="/candidate/documents">{() => <ProtectedRoute component={CandidateDocuments} allowedRoles={["candidate"]} />}</Route>
      <Route path="/candidate/certifications">{() => <ProtectedRoute component={CandidateCertifications} allowedRoles={["candidate"]} />}</Route>
      <Route path="/candidate/training">{() => <ProtectedRoute component={CandidateTraining} allowedRoles={["candidate"]} />}</Route>
      <Route path="/candidate/recognition">{() => <ProtectedRoute component={CandidateRecognition} allowedRoles={["candidate"]} />}</Route>
      <Route path="/candidate/applications">{() => <ProtectedRoute component={CandidateApplications} allowedRoles={["candidate"]} />}</Route>
      <Route path="/candidate/visa">{() => <ProtectedRoute component={CandidateVisa} allowedRoles={["candidate"]} />}</Route>
      <Route path="/candidate/network">{() => <ProtectedRoute component={CandidateNetwork} allowedRoles={["candidate"]} />}</Route>
      <Route path="/candidate/welfare">{() => <ProtectedRoute component={CandidateWelfare} allowedRoles={["candidate"]} />}</Route>
      <Route path="/candidate/profile">{() => <ProtectedRoute component={CandidateProfile} allowedRoles={["candidate"]} />}</Route>

      {/* Employer Routes */}
      <Route path="/employer/dashboard">{() => <ProtectedRoute component={EmployerDashboard} allowedRoles={["employer"]} />}</Route>
      <Route path="/employer/vacancies">{() => <ProtectedRoute component={EmployerVacancies} allowedRoles={["employer"]} />}</Route>
      <Route path="/employer/vacancy/:id/matches">{() => <ProtectedRoute component={EmployerMatches} allowedRoles={["employer"]} />}</Route>
      <Route path="/employer/applications">{() => <ProtectedRoute component={EmployerApplications} allowedRoles={["employer"]} />}</Route>
      <Route path="/employer/interviews">{() => <ProtectedRoute component={EmployerInterviews} allowedRoles={["employer"]} />}</Route>
      <Route path="/employer/offers">{() => <ProtectedRoute component={EmployerOffers} allowedRoles={["employer"]} />}</Route>
      <Route path="/employer/profile">{() => <ProtectedRoute component={EmployerProfile} allowedRoles={["employer"]} />}</Route>

      {/* Trainer Routes */}
      <Route path="/trainer/dashboard">{() => <ProtectedRoute component={TrainerDashboard} allowedRoles={["trainer"]} />}</Route>
      <Route path="/trainer/courses">{() => <ProtectedRoute component={TrainerCourses} allowedRoles={["trainer"]} />}</Route>
      <Route path="/trainer/batches">{() => <ProtectedRoute component={TrainerBatches} allowedRoles={["trainer"]} />}</Route>
      <Route path="/trainer/students">{() => <ProtectedRoute component={TrainerStudents} allowedRoles={["trainer"]} />}</Route>

      {/* Facilitator Routes */}
      <Route path="/facilitator/dashboard">{() => <ProtectedRoute component={FacilitatorDashboard} allowedRoles={["facilitator"]} />}</Route>
      <Route path="/facilitator/candidates">{() => <ProtectedRoute component={FacilitatorCandidates} allowedRoles={["facilitator"]} />}</Route>
      <Route path="/facilitator/recognition">{() => <ProtectedRoute component={FacilitatorRecognition} allowedRoles={["facilitator"]} />}</Route>
      <Route path="/facilitator/visa">{() => <ProtectedRoute component={FacilitatorVisa} allowedRoles={["facilitator"]} />}</Route>
      <Route path="/facilitator/welfare">{() => <ProtectedRoute component={FacilitatorWelfare} allowedRoles={["facilitator"]} />}</Route>

      {/* Government Routes */}
      <Route path="/government/dashboard">{() => <ProtectedRoute component={GovernmentDashboard} allowedRoles={["government"]} />}</Route>
      <Route path="/government/pipeline">{() => <ProtectedRoute component={GovernmentPipeline} allowedRoles={["government"]} />}</Route>
      <Route path="/government/districts">{() => <ProtectedRoute component={MaharashtraMap} allowedRoles={["government"]} />}</Route>

      {/* Admin Routes */}
      <Route path="/admin/dashboard">{() => <ProtectedRoute component={AdminDashboard} allowedRoles={["admin"]} />}</Route>
      <Route path="/admin/candidates">{() => <ProtectedRoute component={AdminCandidates} allowedRoles={["admin"]} />}</Route>
      <Route path="/admin/employers">{() => <ProtectedRoute component={AdminEmployers} allowedRoles={["admin"]} />}</Route>
      <Route path="/admin/documents">{() => <ProtectedRoute component={AdminDocuments} allowedRoles={["admin"]} />}</Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
