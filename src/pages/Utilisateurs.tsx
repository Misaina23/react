import { useState } from "react";
import { mockUtilisateurs } from "@/data/mockData";
import { Utilisateur } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Eye, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

const Utilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>(mockUtilisateurs);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialog, setViewDialog] = useState<Utilisateur | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", role: "", dateCreation: "" });

  const filtered = utilisateurs.filter((u) =>
    `${u.nom} ${u.prenom} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => { setForm({ nom: "", prenom: "", email: "", role: "", dateCreation: "" }); setEditingId(null); };

  const handleSubmit = () => {
    if (!form.nom || !form.email || !form.role) { toast.error("Veuillez remplir les champs obligatoires"); return; }
    if (editingId) {
      setUtilisateurs((prev) => prev.map((u) => (u.id === editingId ? { ...u, ...form } : u)));
      toast.success("Utilisateur modifié");
    } else {
      setUtilisateurs((prev) => [...prev, { id: Date.now().toString(), ...form, dateCreation: form.dateCreation || new Date().toISOString().split("T")[0] }]);
      toast.success("Utilisateur ajouté");
    }
    resetForm();
    setDialogOpen(false);
  };

  const handleEdit = (u: Utilisateur) => {
    setForm({ nom: u.nom, prenom: u.prenom, email: u.email, role: u.role, dateCreation: u.dateCreation });
    setEditingId(u.id);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => { setUtilisateurs((prev) => prev.filter((u) => u.id !== id)); toast.success("Utilisateur supprimé"); };

  const roleBadgeClass = (role: string) => {
    if (role === "Administrateur") return "bg-primary text-primary-foreground";
    if (role === "Chef d'inspection") return "bg-info text-info-foreground";
    return "bg-accent text-accent-foreground";
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="page-title">Utilisateurs</h1>
          <p className="page-description">Gérer les utilisateurs du système</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Nouvel utilisateur</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle className="font-display">{editingId ? "Modifier" : "Nouvel"} utilisateur</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Nom *</Label><Input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} /></div>
                <div><Label>Prénom</Label><Input value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} /></div>
              </div>
              <div><Label>Email *</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div>
                <Label>Rôle *</Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger><SelectValue placeholder="Sélectionner un rôle" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrateur">Administrateur</SelectItem>
                    <SelectItem value="Chef d'inspection">Chef d'inspection</SelectItem>
                    <SelectItem value="Agent terrain">Agent terrain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            <Input placeholder="Rechercher un utilisateur..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom & Prénom</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Date création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.nom} {u.prenom}</TableCell>
                <TableCell className="text-sm">{u.email}</TableCell>
                <TableCell><span className={`text-xs px-2.5 py-1 rounded-full ${roleBadgeClass(u.role)}`}>{u.role}</span></TableCell>
                <TableCell className="text-sm">{new Date(u.dateCreation).toLocaleDateString("fr-FR")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewDialog(u)}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(u)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(u.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewDialog} onOpenChange={() => setViewDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-display">Détails utilisateur</DialogTitle></DialogHeader>
          {viewDialog && (
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div><span className="text-muted-foreground">Nom:</span> <strong>{viewDialog.nom}</strong></div>
              <div><span className="text-muted-foreground">Prénom:</span> <strong>{viewDialog.prenom}</strong></div>
              <div><span className="text-muted-foreground">Email:</span> <strong>{viewDialog.email}</strong></div>
              <div><span className="text-muted-foreground">Rôle:</span> <strong>{viewDialog.role}</strong></div>
              <div><span className="text-muted-foreground">Créé le:</span> <strong>{new Date(viewDialog.dateCreation).toLocaleDateString("fr-FR")}</strong></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Utilisateurs;
