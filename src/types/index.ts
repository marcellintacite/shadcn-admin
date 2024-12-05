// Type pour un paiement
export interface Paiement {
  annee: number // Année du paiement
  montant: number // Montant payé
  date: string // Date du paiement
  createdAt: string // Date de création
  updatedAt: string // Dernière mise à jour
}

// Type pour un traitement
export interface Traitement {
  id: number // Identifiant unique
  membreId: number // Référence au membre traité
  type: 'hospitalisation' | 'ambulatoire' // Type de traitement
  date: string // Date du traitement
  description: string // Détails du traitement
  createdAt: string // Date de création
  updatedAt: string // Dernière mise à jour
}

// Type pour un membre
export interface Membre {
  id: number // Identifiant unique du membre
  nom: string // Nom complet
  forfaitActif: boolean // Si le membre est actif ou non
  hospitalisationsRestantes: number // Nombre d'hospitalisations restantes
  soinsAmbulatoiresRestants: number // Nombre de soins ambulatoires restants
  zoneDeSanteId: number // Référence à la zone de santé du membre
  paiements: Paiement[] // Liste des paiements effectués
  createdAt: string // Date de création
  updatedAt: string // Dernière mise à jour
  traitements: Traitement[] // Liste des traitements effectués
}

// Type pour une structure sanitaire
export interface StructureSanitaire {
  id: number // Identifiant unique
  nom: string // Nom de la structure
  zoneDeSanteId: number // Référence à la zone de santé
  traitements: Traitement[] // Liste des traitements effectués
  createdAt: string // Date de création
  updatedAt: string // Dernière mise à jour
}

// Type pour une zone de santé
export interface ZoneDeSante {
  id: number // Identifiant unique
  nom: string // Nom de la zone
  structuresSanitaires: number[] // Références des structures sanitaires dans cette zone
  membres: number[] // Références des membres dans cette zone
  responsable: number // Référence à l'utilisateur responsable de la zone
  createdAt: string // Date de création
  updatedAt: string // Dernière mise à jour
}

// Type pour un utilisateur
export interface Utilisateur {
  id: number // Identifiant unique
  nom: string // Nom complet
  email: string // Adresse e-mail
  motDePasse: string // Mot de passe (hashé dans une vraie application)
  role: 'admin_global' | 'admin_zone' | 'agent_structure' // Rôle de l'utilisateur
  zoneDeSanteId?: number // Référence à la zone de santé (pour admin_zone)
  structureSanitaireId?: number // Référence à la structure sanitaire (pour agent_structure)
  createdAt: string // Date de création
  updatedAt: string // Dernière mise à jour
}

export type UserFormData = Omit<Utilisateur, 'id' | 'createdAt' | 'updatedAt'>
