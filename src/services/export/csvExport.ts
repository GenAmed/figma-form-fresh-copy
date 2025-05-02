
import { ExportOptions, ExportData } from "./types";

/**
 * Exporte des données au format CSV
 */
export const exportToCsv = (
  data: ExportData[],
  options: ExportOptions = {}
): Blob => {
  if (!data || data.length === 0) {
    // Retourner un CSV vide si pas de données
    return new Blob([""], { type: "text/csv;charset=utf-8;" });
  }
  
  const includeHeaders = options.includeHeaders !== false;
  
  // Récupérer tous les en-têtes possibles (union de toutes les clés)
  const headers = Array.from(
    new Set(
      data.reduce((acc, item) => [...acc, ...Object.keys(item)], [] as string[])
    )
  );
  
  // Construire les lignes du CSV
  const csvRows = [];
  
  // Ajouter l'en-tête si demandé
  if (includeHeaders) {
    csvRows.push(headers.join(","));
  }
  
  // Ajouter les lignes de données
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      // Gérer les différents types de valeurs
      if (val === null || val === undefined) {
        return "";
      }
      if (typeof val === "string") {
        // Échapper les guillemets et entourer de guillemets si nécessaire
        const escaped = val.replace(/"/g, '""');
        return `"${escaped}"`;
      }
      return val;
    });
    csvRows.push(values.join(","));
  }
  
  // Joindre toutes les lignes avec des sauts de ligne
  const csvString = csvRows.join("\n");
  
  // Créer et retourner un Blob
  return new Blob([csvString], { type: "text/csv;charset=utf-8;" });
};
