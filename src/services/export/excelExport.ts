
import { ExportOptions, ExportData } from "./types";
import * as XLSX from "xlsx";

/**
 * Exporte des données au format Excel (XLSX)
 */
export const exportToExcel = async (
  data: ExportData[],
  options: ExportOptions = {}
): Promise<Blob> => {
  if (!data || data.length === 0) {
    // Créer un classeur vide
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([["Aucune donnée disponible"]]);
    XLSX.utils.book_append_sheet(wb, ws, "Données");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    return new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }
  
  // Créer un classeur
  const wb = XLSX.utils.book_new();
  
  // Convertir les données en feuille de calcul
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Ajouter la feuille au classeur
  XLSX.utils.book_append_sheet(wb, ws, "Données");
  
  // Générer le buffer Excel
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  
  // Convertir le buffer en Blob
  return new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
};
