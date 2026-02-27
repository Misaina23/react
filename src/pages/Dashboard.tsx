import { Users, Map, TrendingUp, Calendar, TreePine, Scale } from "lucide-react";
import { mockProducteurs, mockParcelles } from "@/data/mockData";
import { AppLayout } from "@/components/AppLayout";

const Dashboard = () => {
  const totalProducteurs = mockProducteurs.length;
  const totalParcelles = mockParcelles.length;
  const totalSuperficie = mockParcelles.reduce((s, p) => s + p.superficie, 0);
  const totalCA = mockProducteurs.reduce((s, p) => s + p.chiffreAffaires, 0);
  const totalRecolte = mockParcelles.reduce((s, p) => s + p.recolteEffectue, 0);
  const totalArbres = mockParcelles.reduce((s, p) => s + p.nbArbres, 0);

  const stats = [
    { label: "Producteurs", value: totalProducteurs, icon: Users, color: "text-primary" },
    { label: "Parcelles", value: totalParcelles, icon: Map, color: "text-info" },
    { label: "Superficie totale", value: `${totalSuperficie.toFixed(1)} ha`, icon: TreePine, color: "text-success" },
    { label: "Chiffre d'affaires", value: `${totalCA.toLocaleString("fr-FR")} €`, icon: TrendingUp, color: "text-warning" },
    { label: "Récolte totale", value: `${totalRecolte.toLocaleString("fr-FR")} kg`, icon: Scale, color: "text-primary" },
    { label: "Arbres total", value: totalArbres.toLocaleString("fr-FR"), icon: TreePine, color: "text-success" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Tableau de bord</h1>
        <p className="page-description">Vue d'ensemble de votre exploitation agricole</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 font-display">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-xl bg-muted flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="stat-card">
          <h3 className="font-semibold font-display mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Dernières inspections
          </h3>
          <div className="space-y-3">
            {mockProducteurs.slice(0, 4).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{p.nom} {p.prenom}</p>
                  <p className="text-xs text-muted-foreground">CI: {p.nomCI}</p>
                </div>
                <span className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
                  {new Date(p.dateInspection).toLocaleDateString("fr-FR")}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="stat-card">
          <h3 className="font-semibold font-display mb-4 flex items-center gap-2">
            <Map className="h-4 w-4 text-primary" />
            Parcelles récentes
          </h3>
          <div className="space-y-3">
            {mockParcelles.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium">{p.codeUnique} — {p.culture}</p>
                  <p className="text-xs text-muted-foreground">{p.producteurNom} · {p.superficie} ha</p>
                </div>
                <span className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full">
                  {p.rendement} kg/ha
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
