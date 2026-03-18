import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Search, ClipboardCheck, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

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

interface Inspection {
  id: number;
  code_producteur: string;
  nom_producteur: string;
  code_unique_parcelle: string | null;
  date_inspection: string;
  observations: string | null;
  conformite: string | null;
  actions_correctives: string | null;
  gps_inspection: string | null;
  inspecteur: string | null;
  created_at: string;
}

const Parcelles = () => {
  const [producers, setProducers] = useState<Producer[]>([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [inspectionOpen, setInspectionOpen] = useState(false);
  const [viewDialog, setViewDialog] = useState<Producer | null>(null);
  const [inspectionForm, setInspectionForm] = useState({
    code_producteur: "",
    nom_producteur: "",
    date_inspection: new Date().toISOString().split('T')[0],
    observations: "",
    conformite: "",
    actions_correctives: "",
    gps_inspection: "",
    inspecteur: "",
  });

  useEffect(() => {
    loadData();
  }, [search]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [producersRes, inspectionsRes] = await Promise.all([
        api.getProducers({ search }),
        api.getInspections(),
      ]);

      if (producersRes.success && producersRes.data) {
        const data = producersRes.data.data || producersRes.data;
        setProducers(Array.isArray(data) ? data : []);
      }

      if (inspectionsRes.success && inspectionsRes.data) {
        const data = inspectionsRes.data.data || inspectionsRes.data;
        setInspections(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInspection = async () => {
    if (!inspectionForm.code_producteur || !inspectionForm.nom_producteur || !inspectionForm.date_inspection) {
      toast.error("Veuillez remplir les champs obligatoires");
      return;
    }

    try {
      const response = await api.createInspection({
        code_producteur: inspectionForm.code_producteur,
        nom_producteur: inspectionForm.nom_producteur,
        date_inspection: inspectionForm.date_inspection,
        observations: inspectionForm.observations || null,
        conformite: inspectionForm.conformite || null,
        actions_correctives: inspectionForm.actions_correctives || null,
        gps_inspection: inspectionForm.gps_inspection || null,
        inspecteur: inspectionForm.inspecteur || null,
      });

      if (response.success) {
        toast.success("Inspection enregistrée avec succès");
        setInspectionForm({
          code_producteur: "",
          nom_producteur: "",
          date_inspection: new Date().toISOString().split('T')[0],
          observations: "",
          conformite: "",
          actions_correctives: "",
          gps_inspection: "",
          inspecteur: "",
        });
        setInspectionOpen(false);
        loadData();
      } else {
        toast.error(response.message || "Erreur lors de l'enregistrement");
      }
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const openInspection = (producer: Producer) => {
    setInspectionForm({
      code_producteur: producer.code_producteur,
      nom_producteur: producer.nom_prenom,
      date_inspection: new Date().toISOString().split('T')[0],
      observations: "",
      conformite: "",
      actions_correctives: "",
      gps_inspection: "",
      inspecteur: "",
    });
    setInspectionOpen(true);
  };

  const getProducerInspections = (codeProducteur: string) => {
    return inspections.filter(i => i.code_producteur === codeProducteur);
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Parcelles & Inspections</h1>
          <p className="page-description">Gérer les parcelles et inspections des producteurs</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="p-4 border-b flex gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Rechercher par code, nom ou culture..." 
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Producteur</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Culture</TableHead>
                  <TableHead>Superficie</TableHead>
                  <TableHead>GPS</TableHead>
                  <TableHead>Inspections</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {producers.map((p) => {
                  const producerInspections = getProducerInspections(p.code_producteur);
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.code_producteur}</TableCell>
                      <TableCell className="font-medium">{p.nom_prenom}</TableCell>
                      <TableCell className="text-sm">{p.nom_site}</TableCell>
                      <TableCell>
                        {p.culture && <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full">{p.culture}</span>}
                      </TableCell>
                      <TableCell>{p.superficie ? `${p.superficie} ha` : '-'}</TableCell>
                      <TableCell>
                        {(p.gps_parcelle1 || p.gps_menage) && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            GPS
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          producerInspections.length > 0 
                            ? producerInspections.some(i => i.conformite === 'Conforme')
                              ? 'bg-green-100 text-green-700'
                              : producerInspections.some(i => i.conformite === 'Non conforme')
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {producerInspections.length} inspection{producerInspections.length !== 1 ? 's' : ''}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewDialog(p)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openInspection(p)}>
                            <ClipboardCheck className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {producers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Aucun producteur trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* View Dialog */}
      <Dialog open={!!viewDialog} onOpenChange={() => setViewDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Détails de la parcelle</DialogTitle>
          </DialogHeader>
          {viewDialog && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-muted-foreground">Code:</span> <strong>{viewDialog.code_producteur}</strong></div>
                <div><span className="text-muted-foreground">Producteur:</span> <strong>{viewDialog.nom_prenom}</strong></div>
                <div><span className="text-muted-foreground">Site:</span> <strong>{viewDialog.nom_site}</strong></div>
                <div><span className="text-muted-foreground">Superficie:</span> <strong>{viewDialog.superficie ? `${viewDialog.superficie} ha` : '-'}</strong></div>
                <div><span className="text-muted-foreground">Culture:</span> <strong>{viewDialog.culture || '-'}</strong></div>
                <div><span className="text-muted-foreground">Interculture:</span> <strong>{viewDialog.interculture || '-'}</strong></div>
                <div><span className="text-muted-foreground">Nombre d'arbres:</span> <strong>{viewDialog.nombre_arbres || '-'}</strong></div>
                <div><span className="text-muted-foreground">Rendement:</span> <strong>{viewDialog.rendement || '-'}</strong></div>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">Coordonnées GPS</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Parcelle 1:</span> <code className="text-xs">{viewDialog.gps_parcelle1 || '-'}</code></div>
                  <div><span className="text-muted-foreground">Parcelle 2:</span> <code className="text-xs">{viewDialog.gps_parcelle2 || '-'}</code></div>
                  <div><span className="text-muted-foreground">Parcelle 3:</span> <code className="text-xs">{viewDialog.gps_parcelle3 || '-'}</code></div>
                  <div><span className="text-muted-foreground">Ménage:</span> <code className="text-xs">{viewDialog.gps_menage || '-'}</code></div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-2">Historique des inspections</h4>
                {getProducerInspections(viewDialog.code_producteur).length > 0 ? (
                  <div className="space-y-2">
                    {getProducerInspections(viewDialog.code_producteur).map(insp => (
                      <div key={insp.id} className="p-2 bg-muted rounded text-sm">
                        <div className="flex justify-between">
                          <span>{new Date(insp.date_inspection).toLocaleDateString('fr-FR')}</span>
                          {insp.conformite && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              insp.conformite === 'Conforme' ? 'bg-green-100 text-green-700' :
                              insp.conformite === 'Non conforme' ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {insp.conformite}
                            </span>
                          )}
                        </div>
                        {insp.inspecteur && <span className="text-xs text-muted-foreground">Par: {insp.inspecteur}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Aucune inspection</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Inspection Dialog */}
      <Dialog open={inspectionOpen} onOpenChange={setInspectionOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Nouvelle inspection</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div><Label>Producteur *</Label><Input value={inspectionForm.nom_producteur} disabled /></div>
            <div><Label>Date *</Label><Input type="date" value={inspectionForm.date_inspection} onChange={(e) => setInspectionForm({ ...inspectionForm, date_inspection: e.target.value })} /></div>
            <div>
              <Label>Conformité</Label>
              <Select value={inspectionForm.conformite} onValueChange={(v) => setInspectionForm({ ...inspectionForm, conformite: v })}>
                <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Conforme">Conforme</SelectItem>
                  <SelectItem value="Non conforme">Non conforme</SelectItem>
                  <SelectItem value="Partiel">Partiel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Observations</Label><Textarea value={inspectionForm.observations} onChange={(e) => setInspectionForm({ ...inspectionForm, observations: e.target.value })} /></div>
            <div><Label>Actions correctives</Label><Textarea value={inspectionForm.actions_correctives} onChange={(e) => setInspectionForm({ ...inspectionForm, actions_correctives: e.target.value })} /></div>
            <div><Label>GPS Inspection</Label><Input placeholder="lat, lng" value={inspectionForm.gps_inspection} onChange={(e) => setInspectionForm({ ...inspectionForm, gps_inspection: e.target.value })} /></div>
            <div><Label>Inspecteur</Label><Input value={inspectionForm.inspecteur} onChange={(e) => setInspectionForm({ ...inspectionForm, inspecteur: e.target.value })} /></div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setInspectionOpen(false)}>Annuler</Button>
            <Button onClick={handleInspection}>Enregistrer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Parcelles;
