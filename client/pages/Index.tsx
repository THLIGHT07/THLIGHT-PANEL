import { Link } from "react-router-dom";
import {
  Server,
  Users,
  Settings,
  Globe,
  ArrowRight,
  Shield,
  Zap,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Index() {
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
      {/* Background overlay for better readability */}
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm"></div>

      {/* Content wrapper */}
      <div className="relative z-10 space-y-12 text-white">
        {/* Hero Section */}
        <div className="text-center py-20 space-y-8">
          <div className="flex justify-center mb-8">
            <div className="flex items-center justify-center w-32 h-32 rounded-full bg-primary/10 border-2 border-primary/20">
              <Server className="w-16 h-16 text-primary" />
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              THLIGHT PANEL
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional Minecraft Server Hosting Panel
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Manage your Minecraft servers with ease. Get powerful tools for
              server management, player control, customization, and monitoring
              all in one place.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                asChild
              >
                <Link to="/personal">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Access Personal Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Server className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Server Management</h3>
              <p className="text-sm text-muted-foreground">
                Complete console access, file management, and performance
                monitoring for your Minecraft servers.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Customization</h3>
              <p className="text-sm text-muted-foreground">
                Install plugins, manage modpacks, and configure worlds to create
                your perfect server experience.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage players, handle backups, schedule tasks, and control
                server access with advanced tools.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Settings</h3>
              <p className="text-sm text-muted-foreground">
                Configure server settings, manage resources, and customize your
                hosting environment.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="text-center py-16 space-y-8">
          <h2 className="text-3xl font-bold">Why Choose THLIGHT Panel?</h2>
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Secure & Reliable</h3>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade security with reliable hosting infrastructure
                for your Minecraft servers.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10">
                  <Zap className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">High Performance</h3>
              <p className="text-sm text-muted-foreground">
                Optimized server performance with flexible resource allocation
                and monitoring tools.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">Easy to Use</h3>
              <p className="text-sm text-muted-foreground">
                Intuitive interface designed for both beginners and experienced
                server administrators.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-12 border-t border-border/20">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
            <p className="text-muted-foreground">
              Access your personal dashboard to create and manage your Minecraft
              servers.
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90"
              asChild
            >
              <Link to="/personal">
                <ArrowRight className="w-5 h-5 mr-2" />
                Go to Personal Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
