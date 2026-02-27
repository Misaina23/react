export interface Producteur {
  id: string;
  nom: string;
  prenom: string;
  code: string;
  telephone: string;
  dateIntegration: string;
  chiffreAffaires: number;
  dateInspection: string;
  nomCI: string;
}

export interface Parcelle {
  id: string;
  codeUnique: string;
  producteurId: string;
  producteurNom: string;
  superficie: number;
  culture: string;
  interculture: string;
  nbArbres: number;
  gps1: string;
  gps2: string;
  gps3: string;
  gpsMenage: string;
  estimation: number;
  recolteEffectue: number;
  rendement: number;
  quantiteLivre: number;
}

export interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  dateCreation: string;
}
