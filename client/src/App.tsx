import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Dashboard from "@/app/page";
import JobsPage from "@/app/jobs/page";
import ChatPage from "@/app/chat/page";
import AnalyticsPage from "@/app/analytics/page";
import ProfilePage from "@/app/profile/page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-80 p-6">
        <Header />
        <div className="space-y-6">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/jobs" component={JobsPage} />
            <Route path="/chat" component={ChatPage} />
            <Route path="/analytics" component={AnalyticsPage} />
            <Route path="/profile" component={ProfilePage} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
