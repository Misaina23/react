import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MapPin, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const handleLogout = () => {
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
              <span className="text-sm text-muted-foreground">Système de gestion agricole</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-muted-foreground gap-1.5">
                <MapPin className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">GPS actif</span>
              </Button>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://ui-avatars.com/api/?name=Admin&background=1e3a5f&color=fff" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">AD</AvatarFallback>
                </Avatar>
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
