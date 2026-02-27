import { Producteur, Parcelle, Utilisateur } from "@/types";

export const mockProducteurs: Producteur[] = [
  { id: "1", nom: "Kouassi", prenom: "Amed", code: "PRD-001", telephone: "+225 07 89 45 12", dateIntegration: "2023-01-15", chiffreAffaires: 12500, dateInspection: "2025-11-20", nomCI: "Traoré Ibrahim" },
  { id: "2", nom: "Bamba", prenom: "Fatou", code: "PRD-002", telephone: "+225 05 67 23 89", dateIntegration: "2023-03-22", chiffreAffaires: 8750, dateInspection: "2025-10-15", nomCI: "Diallo Moussa" },
  { id: "3", nom: "Yao", prenom: "Konan", code: "PRD-003", telephone: "+225 01 34 56 78", dateIntegration: "2022-06-10", chiffreAffaires: 15200, dateInspection: "2025-12-01", nomCI: "Traoré Ibrahim" },
  { id: "4", nom: "Ouattara", prenom: "Sita", code: "PRD-004", telephone: "+225 07 12 34 56", dateIntegration: "2024-02-01", chiffreAffaires: 6300, dateInspection: "2025-09-28", nomCI: "Koné Adama" },
  { id: "5", nom: "Diomandé", prenom: "Lassina", code: "PRD-005", telephone: "+225 05 98 76 54", dateIntegration: "2023-08-14", chiffreAffaires: 11000, dateInspection: "2025-11-05", nomCI: "Diallo Moussa" },
];

export const mockParcelles: Parcelle[] = [
  { id: "1", codeUnique: "PAR-001", producteurId: "1", producteurNom: "Kouassi Amed", superficie: 4.5, culture: "Cacao", interculture: "Banane plantain", nbArbres: 320, gps1: "6.8271, -5.2893", gps2: "6.8275, -5.2890", gps3: "6.8268, -5.2895", gpsMenage: "6.8300, -5.2910", estimation: 2800, recolteEffectue: 2400, rendement: 533, quantiteLivre: 2200 },
  { id: "2", codeUnique: "PAR-002", producteurId: "2", producteurNom: "Bamba Fatou", superficie: 3.2, culture: "Café", interculture: "Maïs", nbArbres: 210, gps1: "6.9100, -5.3200", gps2: "6.9105, -5.3198", gps3: "6.9098, -5.3205", gpsMenage: "6.9150, -5.3250", estimation: 1500, recolteEffectue: 1300, rendement: 406, quantiteLivre: 1200 },
  { id: "3", codeUnique: "PAR-003", producteurId: "3", producteurNom: "Yao Konan", superficie: 6.0, culture: "Cacao", interculture: "Palmier", nbArbres: 480, gps1: "6.7500, -5.1800", gps2: "6.7505, -5.1795", gps3: "6.7498, -5.1803", gpsMenage: "6.7520, -5.1830", estimation: 4200, recolteEffectue: 3800, rendement: 633, quantiteLivre: 3600 },
];

export const mockUtilisateurs: Utilisateur[] = [
  { id: "1", nom: "Admin", prenom: "Système", email: "admin@agrigest.com", role: "Administrateur", dateCreation: "2023-01-01" },
  { id: "2", nom: "Traoré", prenom: "Ibrahim", email: "traore@agrigest.com", role: "Chef d'inspection", dateCreation: "2023-01-15" },
  { id: "3", nom: "Diallo", prenom: "Moussa", email: "diallo@agrigest.com", role: "Chef d'inspection", dateCreation: "2023-02-01" },
  { id: "4", nom: "Koné", prenom: "Adama", email: "kone@agrigest.com", role: "Agent terrain", dateCreation: "2024-01-10" },
];
