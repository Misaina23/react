import { useState } from "react";
import { mockParcelles, mockProducteurs } from "@/data/mockData";
import { Parcelle } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Pencil, Trash2, Search, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

const emptyParcelle: Omit<Parcelle, "id"> = {
  codeUnique: "", producteurId: "", producteurNom: "", superficie: 0, culture: "", interculture: "",
  nbArbres: 0, gps1: "", gps2: "", gps3: "", gpsMenage: "", estimation: 0, recolteEffectue: 0, rendement: 0, quantiteLivre: 0,
};

const Parcelles = () => {
  const [parcelles, setParcelles] = useState<Parcelle[]>(mockParcelles);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [viewDialog, setViewDialog] = useState<Parcelle | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Parcelle, "id">>(emptyParcelle);
  const [inspectionForm, setInspectionForm] = useState({ parcelleId: "", dateInspection: "", observations: "", etatCulture: "", recommandations: "", recolteEffectue: 0, rendement: 0 });

  const filtered = parcelles.filter((p) =>
    `${p.codeUnique} ${p.producteurNom} ${p.culture}`.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => { setForm(emptyParcelle); setEditingId(null); };

  const handleSubmit = () => {
    if (!form.codeUnique || !form.producteurId) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    const prod = mockProducteurs.find((p) => p.id === form.producteurId);
    const finalForm = { ...form, producteurNom: prod ? `${prod.nom} ${prod.prenom}` : form.producteurNom };
    if (editingId) {
      setParcelles((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...finalForm } : p)));
      toast.success("Parcelle modifiée avec succès");
    } else {
      setParcelles((prev) => [...prev, { id: Date.now().toString(), ...finalForm }]);
      toast.success("Parcelle ajoutée avec succès");
    }
    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (p: Parcelle) => {
    setForm({ codeUnique: p.codeUnique, producteurId: p.producteurId, producteurNom: p.producteurNom, superficie: p.superficie, culture: p.culture, interculture: p.interculture, nbArbres: p.nbArbres, gps1: p.gps1, gps2: p.gps2, gps3: p.gps3, gpsMenage: p.gpsMenage, estimation: p.estimation, recolteEffectue: p.recolteEffectue, rendement: p.rendement, quantiteLivre: p.quantiteLivre });
    setEditingId(p.id);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setParcelles((prev) => prev.filter((p) => p.id !== id));
    toast.success("Parcelle supprimée");
  };

  const handleInspection = () => {
    if (!inspectionForm.parcelleId || !inspectionForm.dateInspection) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }
    toast.success("Inspection enregistrée avec succès");
    setInspectionForm({ parcelleId: "", dateInspection: "", observations: "", etatCulture: "", recommandations: "", recolteEffectue: 0, rendement: 0 });
    setInspectionOpen(false);
  };

  const setF = (key: string, value: string | number) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Parcelles</h1>
          <p className="page-description">Gérer les parcelles et inspections</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={inspectionOpen} onOpenChange={setInspectionOpen}>
            <DialogTrigger asChild>
              <Button variant="outline"><ClipboardCheck className="h-4 w-4 mr-2" />Inspection parcelle</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle className="font-display">Inspection de parcelle</DialogTitle></DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Parcelle *</Label>
                  <Select value={inspectionForm.parcelleId} onValueChange={(v) => setInspectionForm({ ...inspectionForm, parcelleId: v })}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner une parcelle" /></SelectTrigger>
                    <SelectContent>
                      {parcelles.map((p) => (
                        <SelectItem key={p.id} value={p.id}>{p.codeUnique} — {p.producteurNom}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Date d'inspection *</Label><Input type="date" value={inspectionForm.dateInspection} onChange={(e) => setInspectionForm({ ...inspectionForm, dateInspection: e.target.value })} /></div>
                <div><Label>État de la culture</Label><Input value={inspectionForm.etatCulture} onChange={(e) => setInspectionForm({ ...inspectionForm, etatCulture: e.target.value })} /></div>
                <div><Label>Observations</Label><Textarea value={inspectionForm.observations} onChange={(e) => setInspectionForm({ ...inspectionForm, observations: e.target.value })} /></div>
                <div><Label>Recommandations</Label><Textarea value={inspectionForm.recommandations} onChange={(e) => setInspectionForm({ ...inspectionForm, recommandations: e.target.value })} /></div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => setInspectionOpen(false)}>Annuler</Button>
                <Button onClick={handleInspection}>Enregistrer</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" />Nouvelle parcelle</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle className="font-display">{editingId ? "Modifier" : "Nouvelle"} parcelle</DialogTitle></DialogHeader>
              <Tabs defaultValue="general" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="gps">Coordonnées GPS</TabsTrigger>
                  <TabsTrigger value="production">Production</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Code unique *</Label><Input value={form.codeUnique} onChange={(e) => setF("codeUnique", e.target.value)} /></div>
                    <div>
                      <Label>Producteur *</Label>
                      <Select value={form.producteurId} onValueChange={(v) => setF("producteurId", v)}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                        <SelectContent>
                          {mockProducteurs.map((p) => (
                            <SelectItem key={p.id} value={p.id}>{p.nom} {p.prenom}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Superficie (ha)</Label><Input type="number" step="0.1" value={form.superficie} onChange={(e) => setF("superficie", Number(e.target.value))} /></div>
                    <div><Label>Culture</Label><Input value={form.culture} onChange={(e) => setF("culture", e.target.value)} /></div>
                    <div><Label>Interculture</Label><Input value={form.interculture} onChange={(e) => setF("interculture", e.target.value)} /></div>
                    <div><Label>Nombre d'arbres</Label><Input type="number" value={form.nbArbres} onChange={(e) => setF("nbArbres", Number(e.target.value))} /></div>
                  </div>
                </TabsContent>
                <TabsContent value="gps" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>GPS Parcelle 1</Label><Input placeholder="lat, lng" value={form.gps1} onChange={(e) => setF("gps1", e.target.value)} /></div>
                    <div><Label>GPS Parcelle 2</Label><Input placeholder="lat, lng" value={form.gps2} onChange={(e) => setF("gps2", e.target.value)} /></div>
                    <div><Label>GPS Parcelle 3</Label><Input placeholder="lat, lng" value={form.gps3} onChange={(e) => setF("gps3", e.target.value)} /></div>
                    <div><Label>GPS Ménage</Label><Input placeholder="lat, lng" value={form.gpsMenage} onChange={(e) => setF("gpsMenage", e.target.value)} /></div>
                  </div>
                </TabsContent>
                <TabsContent value="production" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div><Label>Estimation (kg)</Label><Input type="number" value={form.estimation} onChange={(e) => setF("estimation", Number(e.target.value))} /></div>
                    <div><Label>Récolte effectuée (kg)</Label><Input type="number" value={form.recolteEffectue} onChange={(e) => setF("recolteEffectue", Number(e.target.value))} /></div>
                    <div><Label>Rendement (kg/ha)</Label><Input type="number" value={form.rendement} onChange={(e) => setF("rendement", Number(e.target.value))} /></div>
                    <div><Label>Quantité livrée (kg)</Label><Input type="number" value={form.quantiteLivre} onChange={(e) => setF("quantiteLivre", Number(e.target.value))} /></div>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-2 mt-6">
                <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Annuler</Button>
                <Button onClick={handleSubmit}>{editingId ? "Modifier" : "Ajouter"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher une parcelle..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Producteur</TableHead>
                <TableHead>Culture</TableHead>
                <TableHead>Superficie</TableHead>
                <TableHead>Arbres</TableHead>
                <TableHead>Récolte</TableHead>
                <TableHead>Rendement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.codeUnique}</TableCell>
                  <TableCell className="font-medium">{p.producteurNom}</TableCell>
                  <TableCell><span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">{p.culture}</span></TableCell>
                  <TableCell>{p.superficie} ha</TableCell>
                  <TableCell>{p.nbArbres}</TableCell>
                  <TableCell>{p.recolteEffectue.toLocaleString("fr-FR")} kg</TableCell>
                  <TableCell>{p.rendement} kg/ha</TableCell>
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
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Aucune parcelle trouvée</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={!!viewDialog} onOpenChange={() => setViewDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-display">Détails de la parcelle</DialogTitle></DialogHeader>
          {viewDialog && (
            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div><span className="text-muted-foreground">Code:</span> <strong>{viewDialog.codeUnique}</strong></div>
              <div><span className="text-muted-foreground">Producteur:</span> <strong>{viewDialog.producteurNom}</strong></div>
              <div><span className="text-muted-foreground">Superficie:</span> <strong>{viewDialog.superficie} ha</strong></div>
              <div><span className="text-muted-foreground">Culture:</span> <strong>{viewDialog.culture}</strong></div>
              <div><span className="text-muted-foreground">Interculture:</span> <strong>{viewDialog.interculture}</strong></div>
              <div><span className="text-muted-foreground">Arbres:</span> <strong>{viewDialog.nbArbres}</strong></div>
              <div className="col-span-2 border-t pt-2 mt-2"><span className="font-medium">Coordonnées GPS</span></div>
              <div><span className="text-muted-foreground">GPS 1:</span> <strong>{viewDialog.gps1}</strong></div>
              <div><span className="text-muted-foreground">GPS 2:</span> <strong>{viewDialog.gps2}</strong></div>
              <div><span className="text-muted-foreground">GPS 3:</span> <strong>{viewDialog.gps3}</strong></div>
              <div><span className="text-muted-foreground">GPS Ménage:</span> <strong>{viewDialog.gpsMenage}</strong></div>
              <div className="col-span-2 border-t pt-2 mt-2"><span className="font-medium">Production</span></div>
              <div><span className="text-muted-foreground">Estimation:</span> <strong>{viewDialog.estimation} kg</strong></div>
              <div><span className="text-muted-foreground">Récolte:</span> <strong>{viewDialog.recolteEffectue} kg</strong></div>
              <div><span className="text-muted-foreground">Rendement:</span> <strong>{viewDialog.rendement} kg/ha</strong></div>
              <div><span className="text-muted-foreground">Livré:</span> <strong>{viewDialog.quantiteLivre} kg</strong></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Parcelles;
