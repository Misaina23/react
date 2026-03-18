import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users, ClipboardCheck, PlusCircle, Loader2, LogOut } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  producers: {
    total: number;
    total_superficie: number;
    total_chiffre_affaires: number;
  };
  inspections: {
    total: number;
    this_month: number;
  };
}

interface Producer {
  id: number;
  nom_prenom: string;
  code_producteur: string;
  nom_site: string;
  created_at: string;
}

interface Inspection {
  id: number;
  nom_producteur: string;
  code_producteur: string;
  date_inspection: string;
  conformite: string;
  created_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProducers, setRecentProducers] = useState<Producer[]>([]);
  const [recentInspections, setRecentInspections] = useState<Inspection[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    if (!api.isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    // Check if user is admin
    if (!api.isAdmin()) {
      navigate('/login');
      return;
    }
    
    loadDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    api.logout();
    navigate('/login');
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [dashboardRes, producersRes, inspectionsRes] = await Promise.all([
        api.getDashboard(),
        api.getProducers({ per_page: '5' }),
        api.getInspections({ per_page: '5' }),
      ]);

      if (dashboardRes.success && dashboardRes.data) {
        setStats(dashboardRes.data);
      }

      if (producersRes.success && producersRes.data) {
        const producers = producersRes.data.data || producersRes.data;
        setRecentProducers(Array.isArray(producers) ? producers : []);
      }

      if (inspectionsRes.success && inspectionsRes.data) {
        const inspections = inspectionsRes.data.data || inspectionsRes.data;
        setRecentInspections(Array.isArray(inspections) ? inspections : []);
      }
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Chargement des données...</span>
        </div>
      </AppLayout>
    );
  }

  const totalProducteurs = stats?.producers?.total || recentProducers.length || 0;
  const totalInspections = stats?.inspections?.total || recentInspections.length || 0;
  const totalSuperficie = stats?.producers?.total_superficie || 0;
  const totalCA = stats?.producers?.total_chiffre_affaires || 0;

  return (
    <div className="animate-fade-in">
      {/* Header - Style Android */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Bonjour 👋</p>
            <h1 className="text-2xl font-bold text-foreground">VIDEEKO VANILLA</h1>
          </div>
          
        </div>

        {/* Status Bar - Style Android */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg mb-6 bg-green-100">
          <span className="text-sm font-medium text-green-700">Connecté</span>
        </div>
      </div>

      {/* Superficie & Chiffre d'affaires - Top */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Superficie totale</p>
          <p className="text-2xl font-bold text-primary">{Number(totalSuperficie).toFixed(1)} ha</p>
        </div>
        <div className="bg-card border rounded-2xl p-4">
          <p className="text-xs text-muted-foreground">Chiffre d'affaires</p>
          <p className="text-2xl font-bold text-green-600">{Number(totalCA).toLocaleString("fr-FR")} €</p>
        </div>
      </div>

      {/* Stats Cards - Style Android */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card border rounded-2xl p-4 flex flex-col items-center">
          <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center mb-2">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-extrabold">{totalProducteurs}</p>
          <p className="text-xs text-muted-foreground mt-1">Producteurs</p>
        </div>
        <div className="bg-card border rounded-2xl p-4 flex flex-col items-center">
          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center mb-2">
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-3xl font-extrabold">{totalInspections}</p>
          <p className="text-xs text-muted-foreground mt-1">Inspections</p>
        </div>
      </div>

      {/* Actions - Style Android */}
      <div className="mb-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Actions rapides</h2>
        <div className="space-y-3">
          <Button
            className="w-full justify-between h-auto py-4 px-4 rounded-2xl bg-primary hover:bg-primary/90"
          >
            <div className="flex items-center gap-3">
              <PlusCircle className="h-6 w-6" />
              <div className="text-left">
                <p className="font-bold">Nouvelle Collecte</p>
                <p className="text-xs opacity-70">Saisir les données producteur</p>
              </div>
            </div>
          </Button>
           
          <Button
            variant="outline"
            className="w-full justify-between h-auto py-4 px-4 rounded-2xl border-2"
          >
            <div className="flex items-center gap-3">
              <ClipboardCheck className="h-6 w-6 text-blue-600" />
              <div className="text-left">
                <p className="font-bold text-foreground">Nouvelle Inspection</p>
                <p className="text-xs text-muted-foreground">Évaluer la conformité</p>
              </div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
