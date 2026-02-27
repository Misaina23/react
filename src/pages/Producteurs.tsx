import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { mockProducteurs } from "@/data/mockData";
import { Producteur } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Eye, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

const Producteurs = () => {
  const [producteurs, setProducteurs] = useState<Producteur[]>(mockProducteurs);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialog, setViewDialog] = useState<Producteur | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Producteur, "id">>({
    nom: "", prenom: "", code: "", telephone: "", dateIntegration: "", chiffreAffaires: 0, dateInspection: "", nomCI: "",
  });

  const filtered = producteurs.filter((p) =>
    `${p.nom} ${p.prenom} ${p.code}`.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setForm({ nom: "", prenom: "", code: "", telephone: "", dateIntegration: "", chiffreAffaires: 0, dateInspection: "", nomCI: "" });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!form.nom || !form.prenom || !form.code) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    if (editingId) {
      setProducteurs((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form } : p)));
      toast.success("Producteur modifié avec succès");
    } else {
      setProducteurs((prev) => [...prev, { id: Date.now().toString(), ...form }]);
      toast.success("Producteur ajouté avec succès");
    }
    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (p: Producteur) => {
    setForm({ nom: p.nom, prenom: p.prenom, code: p.code, telephone: p.telephone, dateIntegration: p.dateIntegration, chiffreAffaires: p.chiffreAffaires, dateInspection: p.dateInspection, nomCI: p.nomCI });
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducteurs((prev) => prev.filter((p) => p.id !== id));
    toast.success("Producteur supprimé");
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
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display">{editingId ? "Modifier" : "Nouveau"} producteur</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div><Label>Nom *</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
              <div><Label>Prénom *</Label><Input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></div>
              <div><Label>Code producteur *</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
              <div><Label>Téléphone</Label><Input value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} /></div>
              <div><Label>Date d'intégration</Label><Input type="date" value={form.dateIntegration} onChange={(e) => setForm({ ...form, dateIntegration: e.target.value })} /></div>
              <div><Label>Chiffre d'affaires (€)</Label><Input type="number" value={form.chiffreAffaires} onChange={(e) => setForm({ ...form, chiffreAffaires: Number(e.target.value) })} /></div>
              <div><Label>Date dernière inspection</Label><Input type="date" value={form.dateInspection} onChange={(e) => setForm({ ...form, dateInspection: e.target.value })} /></div>
              <div><Label>Nom du CI</Label><Input value={form.nomCI} onChange={(e) => setForm({ ...form, nomCI: e.target.value })} /></div>
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
            <Input placeholder="Rechercher un producteur..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Nom & Prénom</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Intégration</TableHead>
              <TableHead>CA (€)</TableHead>
              <TableHead>CI</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs bg-muted/50 rounded">{p.code}</TableCell>
                <TableCell className="font-medium">{p.nom} {p.prenom}</TableCell>
                <TableCell className="text-sm">{p.telephone}</TableCell>
                <TableCell className="text-sm">{new Date(p.dateIntegration).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell className="text-sm font-medium">{p.chiffreAffaires.toLocaleString("fr-FR")} €</TableCell>
                <TableCell className="text-sm">{p.nomCI}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewDialog(p)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Aucun producteur trouvé</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewDialog} onOpenChange={() => setViewDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Détails du producteur</DialogTitle></DialogHeader>
          {viewDialog && (
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div><span className="text-muted-foreground">Nom:</span> <strong>{viewDialog.nom}</strong></div>
              <div><span className="text-muted-foreground">Prénom:</span> <strong>{viewDialog.prenom}</strong></div>
              <div><span className="text-muted-foreground">Code:</span> <strong>{viewDialog.code}</strong></div>
              <div><span className="text-muted-foreground">Téléphone:</span> <strong>{viewDialog.telephone}</strong></div>
              <div><span className="text-muted-foreground">Intégration:</span> <strong>{new Date(viewDialog.dateIntegration).toLocaleDateString("fr-FR")}</strong></div>
              <div><span className="text-muted-foreground">CA:</span> <strong>{viewDialog.chiffreAffaires.toLocaleString("fr-FR")} €</strong></div>
              <div><span className="text-muted-foreground">Inspection:</span> <strong>{new Date(viewDialog.dateInspection).toLocaleDateString("fr-FR")}</strong></div>
              <div><span className="text-muted-foreground">CI:</span> <strong>{viewDialog.nomCI}</strong></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Producteurs;
