import { useTheme } from "next-themes";
import { Link, useLocation } from "react-router-dom";
import { useServer } from "../contexts/ServerContext";
import {
  Monitor,
  Play,
  Pause,
  RotateCcw,
  FileText,
  Terminal,
  Puzzle,
  Package,
  Archive,
  Activity,
  Clock,
  Users,
  Globe,
  Link as LinkIcon,
  Settings,
  Moon,
  Sun,
  Server,
  Home,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const getNavigation = (currentServerId: number | null) => {
  const baseNavigation = [
    {
      title: "Personal",
      items: [{ title: "Dashboard", url: "/personal", icon: Home }],
    },
  ];

  // Only show management sections if a server is selected
  if (currentServerId) {
    return [
      ...baseNavigation,
      {
        title: "Server Management",
        items: [
          { title: "Console", url: `/console/${currentServerId}`, icon: Terminal },
          { title: "File Manager", url: `/files/${currentServerId}`, icon: FileText },
          { title: "Performance", url: `/performance/${currentServerId}`, icon: Activity },
        ],
      },
      {
        title: "Customization",
        items: [
          { title: "Plugins", url: `/plugins/${currentServerId}`, icon: Puzzle },
          { title: "Modpacks", url: `/modpacks/${currentServerId}`, icon: Package },
          { title: "Worlds", url: `/worlds/${currentServerId}`, icon: Globe },
        ],
      },
      {
        title: "Management",
        items: [
          { title: "Players", url: `/players/${currentServerId}`, icon: Users },
          { title: "Backups", url: `/backups/${currentServerId}`, icon: Archive },
          { title: "Scheduled Tasks", url: `/tasks/${currentServerId}`, icon: Clock },
          { title: "FTP Access", url: `/ftp/${currentServerId}`, icon: LinkIcon },
        ],
      },
      {
        title: "Settings",
        items: [{ title: "Server Settings", url: `/settings/${currentServerId}`, icon: Settings }],
      },
    ];
  }

  return baseNavigation;
};

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { currentServerId, getCurrentServer } = useServer();

  // Get current server for display
  const currentServer = getCurrentServer();

  // Get navigation based on whether a server is selected
  const navigation = getNavigation(currentServerId);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Server className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">THLIGHT Panel</span>
              <span className="truncate text-xs text-muted-foreground">
                Server Control
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {navigation.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                        tooltip={item.title}
                      >
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter>
          <div className="p-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full justify-start"
            >
              {theme === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
              <span className="ml-2">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </Button>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-sidebar-border" />
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-success text-success-foreground border-success"
              >
                <div className="w-2 h-2 bg-success rounded-full mr-1"></div>
                Online
              </Badge>
              <span className="text-sm text-muted-foreground">
                {currentServer ? `Managing: ${currentServer.name}` : "THLIGHT Panel.com"}
              </span>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
