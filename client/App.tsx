import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Layout } from "@/components/Layout";
import { ServerProvider } from "./contexts/ServerContext";
import { ServerAccessControl } from "@/components/ServerAccessControl";
import Index from "./pages/Index";
import Personal from "./pages/Personal";
import Dashboard from "./pages/Dashboard";
import Console from "./pages/Console";
import Players from "./pages/Players";
import ServerSettings from "./pages/ServerSettings";
import AdminManage from "./pages/AdminManage";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

// Placeholder component for pages not yet implemented
const PlaceholderPage = ({ title }: { title: string }) => (
  <div
    className="min-h-screen relative"
    style={{
      backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F8a07adefa7b04c6480a71dbc4c060aec%2F7f1ba787b70245adadfab80cdc1c3caa?format=webp&width=800')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
    }}
  >
    {/* Background overlay for better readability */}
    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>

    {/* Content wrapper */}
    <a
      href="/"
      className="relative z-10 flex flex-col items-center justify-center min-h-[400px] text-center cursor-pointer"
    >
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      <p className="text-muted-foreground mb-4">This page is coming soon!</p>
      <p className="text-sm text-muted-foreground">
        Continue prompting to add content to this section.
      </p>
    </a>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ServerProvider>
            <Routes>
              {/* Pages without sidebar */}
              <Route path="/" element={<Index />} />
              <Route path="/personal" element={<Personal />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* Pages with sidebar - wrapped in Layout */}
              <Route
                path="/console/:serverId"
                element={
                  <Layout>
                    <ServerAccessControl>
                      <Console />
                    </ServerAccessControl>
                  </Layout>
                }
              />
              <Route
                path="/console"
                element={
                  <Layout>
                    <Console />
                  </Layout>
                }
              />
              <Route
                path="/files/:serverId"
                element={
                  <Layout>
                    <PlaceholderPage title="File Manager" />
                  </Layout>
                }
              />
              <Route
                path="/files"
                element={
                  <Layout>
                    <PlaceholderPage title="File Manager" />
                  </Layout>
                }
              />
              <Route
                path="/performance/:serverId"
                element={
                  <Layout>
                    <PlaceholderPage title="Performance Metrics" />
                  </Layout>
                }
              />
              <Route
                path="/performance"
                element={
                  <Layout>
                    <PlaceholderPage title="Performance Metrics" />
                  </Layout>
                }
              />
              <Route
                path="/plugins/:serverId"
                element={
                  <Layout>
                    <PlaceholderPage title="Plugin Manager" />
                  </Layout>
                }
              />
              <Route
                path="/plugins"
                element={
                  <Layout>
                    <PlaceholderPage title="Plugin Manager" />
                  </Layout>
                }
              />
              <Route
                path="/modpacks/:serverId"
                element={
                  <Layout>
                    <PlaceholderPage title="Modpack Manager" />
                  </Layout>
                }
              />
              <Route
                path="/modpacks"
                element={
                  <Layout>
                    <PlaceholderPage title="Modpack Manager" />
                  </Layout>
                }
              />
              <Route
                path="/worlds/:serverId"
                element={
                  <Layout>
                    <PlaceholderPage title="World Manager" />
                  </Layout>
                }
              />
              <Route
                path="/worlds"
                element={
                  <Layout>
                    <PlaceholderPage title="World Manager" />
                  </Layout>
                }
              />
              <Route
                path="/players/:serverId"
                element={
                  <Layout>
                    <Players />
                  </Layout>
                }
              />
              <Route
                path="/players"
                element={
                  <Layout>
                    <Players />
                  </Layout>
                }
              />
              <Route
                path="/backups/:serverId"
                element={
                  <Layout>
                    <PlaceholderPage title="Backup & Restore" />
                  </Layout>
                }
              />
              <Route
                path="/backups"
                element={
                  <Layout>
                    <PlaceholderPage title="Backup & Restore" />
                  </Layout>
                }
              />
              <Route
                path="/tasks/:serverId"
                element={
                  <Layout>
                    <PlaceholderPage title="Scheduled Tasks" />
                  </Layout>
                }
              />
              <Route
                path="/tasks"
                element={
                  <Layout>
                    <PlaceholderPage title="Scheduled Tasks" />
                  </Layout>
                }
              />
              <Route
                path="/ftp/:serverId"
                element={
                  <Layout>
                    <PlaceholderPage title="FTP Access" />
                  </Layout>
                }
              />
              <Route
                path="/ftp"
                element={
                  <Layout>
                    <PlaceholderPage title="FTP Access" />
                  </Layout>
                }
              />
              <Route
                path="/settings/:serverId"
                element={
                  <Layout>
                    <ServerSettings />
                  </Layout>
                }
              />
              <Route
                path="/settings"
                element={
                  <Layout>
                    <ServerSettings />
                  </Layout>
                }
              />
              {/* Admin Routes */}
              <Route path="/admin/manage" element={<AdminManage />} />

              {/* Help Route */}
              <Route path="/help" element={<Help />} />

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ServerProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
