import { Link } from "react-router-dom";
import { useServer } from "../contexts/ServerContext";
import { Play, LogIn, UserPlus, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "../components/AuthDialog";

export default function Personal() {
  const { user, isAuthenticated, logout } = useServer();

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <div
        className="space-y-6 min-h-screen relative"
        style={{
          backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F8a07adefa7b04c6480a71dbc4c060aec%2F7f1ba787b70245adadfab80cdc1c3caa?format=webp&width=800')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>
        <div className="relative z-10 space-y-6 text-white">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-blue-500 text-white">
                <span className="font-bold text-lg">T</span>
              </div>
              <span className="text-2xl font-bold text-blue-500">THLIGHT</span>
            </div>
            <div className="flex items-center gap-3">
              <AuthDialog
                mode="login"
                trigger={
                  <Button variant="outline">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                }
              />
              <AuthDialog
                mode="register"
                trigger={
                  <Button className="bg-primary hover:bg-primary/90">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                }
              />
            </div>
          </div>

          <div className="text-center py-20 space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl font-bold text-blue-500">
                Minecraft servers.
              </h1>
              <h2 className="text-6xl font-bold text-blue-500">
                Free. Forever.
              </h2>
              <div className="flex justify-center gap-4 mt-12">
                <AuthDialog
                  mode="register"
                  trigger={
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Get Started
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show clean landing page for authenticated users
  return (
    <div
      className="space-y-6 min-h-screen relative"
      style={{
        backgroundImage: `url('https://cdn.builder.io/api/v1/image/assets%2F8a07adefa7b04c6480a71dbc4c060aec%2F7f1ba787b70245adadfab80cdc1c3caa?format=webp&width=800')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>

      <div className="relative z-10 space-y-6 text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-blue-500 text-white">
              <span className="font-bold text-lg">T</span>
            </div>
            <span className="text-2xl font-bold text-blue-500">THLIGHT</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
              <UserIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{user?.username}</span>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center py-20 space-y-8">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold text-blue-500">
              Minecraft servers.
            </h1>
            <h2 className="text-6xl font-bold text-blue-500">Free. Forever.</h2>

            {/* Navigation Links */}
            <div className="flex justify-center gap-8 mt-16">
              <Button
                variant="ghost"
                className="text-lg text-blue-500 hover:text-blue-600"
              >
                What?
              </Button>
              <Button
                variant="ghost"
                className="text-lg text-blue-500 hover:text-blue-600"
              >
                Facts
              </Button>
              <Button
                variant="ghost"
                className="text-lg text-blue-500 hover:text-blue-600"
              >
                Features
              </Button>
              <Button
                variant="ghost"
                className="text-lg text-blue-500 hover:text-blue-600"
              >
                Team
              </Button>
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
                asChild
              >
                <Link to="/dashboard">
                  <Play className="w-5 h-5 mr-2" />
                  Play
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
