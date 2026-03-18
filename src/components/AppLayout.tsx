import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MapPin, LogOut, Cloud, CloudOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isOnline] = useState(true);
  const [logoError, setLogoError] = useState(false);

  const handleLogout = () => {
    api.logout();
    navigate('/login');
    toast.success("Déconnexion réussie");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4 shrink-0">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4" />
              <span className="text-sm text-muted-foreground">VIDEEKO VANILLA</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Status Bar - Style Android */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                isOnline
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {isOnline ? (
                  <>
                    <Cloud className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Connecté</span>
                  </>
                ) : (
                  <>
                    <CloudOff className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Hors ligne</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!logoError ? (
                  <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="h-8 w-8 rounded-full object-cover"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://ui-avatars.com/api/?name=Admin&background=1e3a5f&color=fff" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">AD</AvatarFallback>
                  </Avatar>
                )}
                <span className="text-sm font-medium hidden sm:inline">Admin</span>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={handleLogout} title="Déconnexion">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
