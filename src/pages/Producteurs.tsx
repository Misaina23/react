import { useState, useEffect } from "react";
import api from "@/lib/api";
import sweetAlert from "@/lib/sweetAlert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Eye, Pencil, Trash2, Search, Loader2 } from "lucide-react";

interface Producer {
  id: number;
  nom_site: string;
  nom_prenom: string;
  code_producteur: string;
  telephone: string | null;
  date_integration: string | null;
  superficie: number | null;
  chiffre_affaires: number | null;
  code_unique_parcelle: string | null;
  culture: string | null;
  interculture: string | null;
  nombre_arbres: number | null;
  gps_parcelle1: string | null;
  gps_parcelle2: string | null;
  gps_parcelle3: string | null;
  gps_menage: string | null;
  estimation_recolte: string | null;
  rendement: string | null;
  quantite_livree: number | null;
  nom_ci: string | null;
  created_at: string;
}

const Producteurs = () => {
  const [producteurs, setProducteurs] = useState<Producer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialog, setViewDialog] = useState<Producer | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    nom_site: "",
    nom_prenom: "",
    code_producteur: "",
    telephone: "",
    date_integration: "",
    superficie: "",
    chiffre_affaires: "",
    code_unique_parcelle: "",
    culture: "",
    interculture: "",
    nombre_arbres: "",
    gps_parcelle1: "",
    gps_parcelle2: "",
    gps_parcelle3: "",
    gps_menage: "",
    estimation_recolte: "",
    rendement: "",
    quantite_livree: "",
    nom_ci: "",
  });

  useEffect(() => {
    loadProducers();
  }, [search]);

  const loadProducers = async () => {
    setLoading(true);
    try {
      const response = await api.getProducers({ search });
      if (response.success && response.data) {
        const data = response.data.data || response.data;
        setProducteurs(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error loading producers:", error);
      sweetAlert.error("Erreur lors du chargement des producteurs");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      nom_site: "", nom_prenom: "", code_producteur: "", telephone: "",
      date_integration: "", superficie: "", chiffre_affaires: "",
      code_unique_parcelle: "", culture: "", interculture: "",
      nombre_arbres: "", gps_parcelle1: "", gps_parcelle2: "",
      gps_parcelle3: "", gps_menage: "", estimation_recolte: "",
      rendement: "", quantite_livree: "", nom_ci: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (!form.nom_site || !form.nom_prenom || !form.code_producteur) {
      sweetAlert.error("Veuillez remplir les champs obligatoires");
      return;
    }

    try {
      const data = {
        nom_site: form.nom_site,
        nom_prenom: form.nom_prenom,
        code_producteur: form.code_producteur,
        telephone: form.telephone || null,
        date_integration: form.date_integration || null,
        superficie: form.superficie ? parseFloat(form.superficie) : null,
        chiffre_affaires: form.chiffre_affaires ? parseFloat(form.chiffre_affaires) : null,
        code_unique_parcelle: form.code_unique_parcelle || null,
        culture: form.culture || null,
        interculture: form.interculture || null,
        nombre_arbres: form.nombre_arbres ? parseInt(form.nombre_arbres) : null,
        gps_parcelle1: form.gps_parcelle1 || null,
        gps_parcelle2: form.gps_parcelle2 || null,
        gps_parcelle3: form.gps_parcelle3 || null,
        gps_menage: form.gps_menage || null,
        estimation_recolte: form.estimation_recolte || null,
        rendement: form.rendement || null,
        quantite_livree: form.quantite_livree ? parseFloat(form.quantite_livree) : null,
        nom_ci: form.nom_ci || null,
      };

      let response;
      if (editingId) {
        response = await api.updateProducer(editingId, data);
      } else {
        response = await api.createProducer(data);
      }

      if (response.success) {
        resetForm();
        setDialogOpen(false);
        loadProducers();
        sweetAlert.success(editingId ? "Producteur modifié avec succès" : "Producteur ajouté avec succès");
      } else {
        sweetAlert.error(response.message || "Une erreur est survenue");
      }
    } catch (error) {
      console.error("Error saving producer:", error);
      sweetAlert.error("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (p: Producer) => {
    setForm({
      nom_site: p.nom_site,
      nom_prenom: p.nom_prenom,
      code_producteur: p.code_producteur,
      telephone: p.telephone || "",
      date_integration: p.date_integration || "",
      superficie: p.superficie?.toString() || "",
      chiffre_affaires: p.chiffre_affaires?.toString() || "",
      code_unique_parcelle: p.code_unique_parcelle || "",
      culture: p.culture || "",
      interculture: p.interculture || "",
      nombre_arbres: p.nombre_arbres?.toString() || "",
      gps_parcelle1: p.gps_parcelle1 || "",
      gps_parcelle2: p.gps_parcelle2 || "",
      gps_parcelle3: p.gps_parcelle3 || "",
      gps_menage: p.gps_menage || "",
      estimation_recolte: p.estimation_recolte || "",
      rendement: p.rendement || "",
      quantite_livree: p.quantite_livree?.toString() || "",
      nom_ci: p.nom_ci || "",
    });
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    const confirmed = await sweetAlert.confirm(
      "Supprimer le producteur",
      "Êtes-vous sûr de vouloir supprimer ce producteur?"
    );
    
    if (!confirmed) return;
    
    try {
      const response = await api.deleteProducer(id);
      if (response.success) {
        sweetAlert.success("Producteur supprimé avec succès");
        loadProducers();
      } else {
        sweetAlert.error(response.message || "Erreur lors de la suppression");
      }
    } catch (error) {
      sweetAlert.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Producteurs</h1>
          <p className="page-description">Gérer les producteurs enregistrés</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Nouveau producteur</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">{editingId ? "Modifier" : "Nouveau"} producteur</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><Label>Nom du site *</Label><Input value={form.nom_site} onChange={(e) => setForm({ ...form, nom_site: e.target.value })} /></div>
              <div><Label>Nom et prénom *</Label><Input value={form.nom_prenom} onChange={(e) => setForm({ ...form, nom_prenom: e.target.value })} /></div>
              <div><Label>Code producteur *</Label><Input value={form.code_producteur} onChange={(e) => setForm({ ...form, code_producteur: e.target.value })} /></div>
              <div><Label>Téléphone</Label><Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
              <div><Label>Date d'intégration</Label><Input type="date" value={form.date_integration} onChange={(e) => setForm({ ...form, date_integration: e.target.value })} /></div>
              <div><Label>Superficie (ha)</Label><Input type="number" step="0.01" value={form.superficie} onChange={(e) => setForm({ ...form, superficie: e.target.value })} /></div>
              <div><Label>Chiffre d'affaires (€)</Label><Input type="number" value={form.chiffre_affaires} onChange={(e) => setForm({ ...form, chiffre_affaires: e.target.value })} /></div>
              <div><Label>Code parcelle</Label><Input value={form.code_unique_parcelle} onChange={(e) => setForm({ ...form, code_unique_parcelle: e.target.value })} /></div>
              <div><Label>Culture</Label><Input value={form.culture} onChange={(e) => setForm({ ...form, culture: e.target.value })} /></div>
              <div><Label>Interculture</Label><Input value={form.interculture} onChange={(e) => setForm({ ...form, interculture: e.target.value })} /></div>
              <div><Label>Nombre d'arbres</Label><Input type="number" value={form.nombre_arbres} onChange={(e) => setForm({ ...form, nombre_arbres: e.target.value })} /></div>
              <div><Label>Nom du CI</Label><Input value={form.nom_ci} onChange={(e) => setForm({ ...form, nom_ci: e.target.value })} /></div>
              <div><Label>GPS Parcelle 1</Label><Input value={form.gps_parcelle1} onChange={(e) => setForm({ ...form, gps_parcelle1: e.target.value })} /></div>
              <div><Label>GPS Parcelle 2</Label><Input value={form.gps_parcelle2} onChange={(e) => setForm({ ...form, gps_parcelle2: e.target.value })} /></div>
              <div><Label>GPS Parcelle 3</Label><Input value={form.gps_parcelle3} onChange={(e) => setForm({ ...form, gps_parcelle3: e.target.value })} /></div>
              <div><Label>GPS Ménage</Label><Input value={form.gps_menage} onChange={(e) => setForm({ ...form, gps_menage: e.target.value })} /></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Annuler</Button>
              <Button onClick={handleSubmit}>{editingId ? "Modifier" : "Ajouter"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher un producteur..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)} 
              className="pl-9" 
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Chargement...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Nom & Prénom</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Culture</TableHead>
                <TableHead>Superficie</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {producteurs.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs bg-muted/50 rounded">{p.code_producteur}</TableCell>
                  <TableCell className="font-medium">{p.nom_prenom}</TableCell>
                  <TableCell className="text-sm">{p.nom_site}</TableCell>
                  <TableCell className="text-sm">{p.telephone || '-'}</TableCell>
                  <TableCell className="text-sm">{p.culture || '-'}</TableCell>
                  <TableCell className="text-sm">{p.superficie ? `${p.superficie} ha` : '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewDialog(p)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {producteurs.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucun producteur trouvé</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!viewDialog} onOpenChange={() => setViewDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle className="font-display">Détails du producteur</DialogTitle></DialogHeader>
          {viewDialog && (
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div><span className="text-muted-foreground">Nom du site:</span> <strong>{viewDialog.nom_site}</strong></div>
              <div><span className="text-muted-foreground">Nom & prénom:</span> <strong>{viewDialog.nom_prenom}</strong></div>
              <div><span className="text-muted-foreground">Code:</span> <strong>{viewDialog.code_producteur}</strong></div>
              <div><span className="text-muted-foreground">Téléphone:</span> <strong>{viewDialog.telephone || '-'}</strong></div>
              <div><span className="text-muted-foreground">Intégration:</span> <strong>{viewDialog.date_integration ? new Date(viewDialog.date_integration).toLocaleDateString("fr-FR") : '-'}</strong></div>
              <div><span className="text-muted-foreground">Superficie:</span> <strong>{viewDialog.superficie ? `${viewDialog.superficie} ha` : '-'}</strong></div>
              <div><span className="text-muted-foreground">CA:</span> <strong>{viewDialog.chiffre_affaires ? `${viewDialog.chiffre_affaires.toLocaleString()} €` : '-'}</strong></div>
              <div><span className="text-muted-foreground">Culture:</span> <strong>{viewDialog.culture || '-'}</strong></div>
              <div><span className="text-muted-foreground">CI:</span> <strong>{viewDialog.nom_ci || '-'}</strong></div>
              <div><span className="text-muted-foreground">Nombre d'arbres:</span> <strong>{viewDialog.nombre_arbres || '-'}</strong></div>
              <div className="col-span-2"><span className="text-muted-foreground">GPS Ménage:</span> <strong className="font-mono">{viewDialog.gps_menage || '-'}</strong></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Producteurs;
