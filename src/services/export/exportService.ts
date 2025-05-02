
import { saveAs } from "file-saver";
import { ExportFormat, ExportOptions, ExportData } from "./types";
import { exportToExcel } from "./excelExport";
import { exportToCsv } from "./csvExport";
import { exportToPdf } from "./pdfExport";

/**
 * Service principal pour l'export de données dans différents formats
 */
export const exportData = async (
  data: ExportData[],
  format: ExportFormat,
  options: ExportOptions = {}
): Promise<boolean> => {
  try {
    const defaultFileName = `export-${new Date().toISOString().split("T")[0]}`;
    const fileName = options.fileName || defaultFileName;
    
    let blob: Blob | null = null;
    
    switch (format) {
      case "excel":
        blob = await exportToExcel(data, options);
        saveAs(blob, `${fileName}.xlsx`);
        break;
      
      case "csv":
        blob = exportToCsv(data, options);
        saveAs(blob, `${fileName}.csv`);
        break;
      
      case "pdf":
        blob = await exportToPdf(data, options);
        saveAs(blob, `${fileName}.pdf`);
        break;
      
      default:
        console.error(`Format d'export non supporté: ${format}`);
        return false;
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de l'export des données:", error);
    return false;
  }
};

/**
 * Fonction pour formater les données avant l'export
 */
export const formatDataForExport = (
  data: any[],
  includeFields?: string[]
): ExportData[] => {
  if (!data || data.length === 0) {
    return [];
  }
  
  // Si aucun champ spécifique n'est demandé, on inclut tout
  if (!includeFields || includeFields.length === 0) {
    return data;
  }
  
  // Sinon, on filtre les champs demandés
  return data.map(item => {
    const formattedItem: ExportData = {};
    includeFields.forEach(field => {
      if (field in item) {
        formattedItem[field] = item[field];
      }
    });
    return formattedItem;
  });
};
