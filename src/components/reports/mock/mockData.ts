
// Mock data for demonstration
export const mockChantiers = [
  { id: "1", nom: "Chantier Bordeaux Centre" },
  { id: "2", nom: "Chantier Mérignac" },
  { id: "3", nom: "Chantier Paris" },
  { id: "4", nom: "Chantier Lyon" },
  { id: "5", nom: "Chantier Lille" },
];

export const mockEmployes = [
  { id: "1", nom: "Jean Dupont" },
  { id: "2", nom: "Marie Martin" },
  { id: "3", nom: "Pierre Durand" },
  { id: "4", nom: "Sophie Lefebvre" },
  { id: "5", nom: "Lucas Bernard" },
];

// Mock data for charts
export const mockHeuresParChantier = [
  { name: "Bordeaux Centre", heures: 120 },
  { name: "Mérignac", heures: 80 },
  { name: "Paris", heures: 140 },
  { name: "Lyon", heures: 60 },
  { name: "Lille", heures: 90 },
];

export const mockHeuresParJour = [
  { name: "Lun", heures: 45 },
  { name: "Mar", heures: 50 },
  { name: "Mer", heures: 48 },
  { name: "Jeu", heures: 52 },
  { name: "Ven", heures: 40 },
  { name: "Sam", heures: 20 },
  { name: "Dim", heures: 0 },
];

// Mock alerts data
export const mockAlerts = [
  { id: 1, type: "warning", message: "Jean Dupont a travaillé plus de 10h le 29/04", date: "2025-05-02", status: "open" },
  { id: 2, type: "danger", message: "Absence non justifiée de Pierre Durand", date: "2025-05-01", status: "open" },
  { id: 3, type: "info", message: "Nouveau chantier assigné: Lyon", date: "2025-04-30", status: "resolved" },
  { id: 4, type: "warning", message: "Marie Martin a dépassé 42h cette semaine", date: "2025-04-30", status: "pending" },
  { id: 5, type: "danger", message: "Pointage manquant pour Lucas Bernard", date: "2025-04-29", status: "resolved" },
];
