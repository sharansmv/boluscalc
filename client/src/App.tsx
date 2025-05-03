import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import NotFound from "@/pages/not-found";
import Calculator from "@/pages/Calculator";
import Settings from "@/pages/Settings";
import Details from "@/pages/Details";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function Router() {
  const [location] = useLocation();

  return (
    <Switch>
      <Route path="/" component={Calculator} />
      <Route path="/settings" component={Settings} />
      <Route path="/details" component={Details} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="container mx-auto px-4 py-6 mb-20 flex-grow">
              <Router />
            </main>
            <Footer />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
