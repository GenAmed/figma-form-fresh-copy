
import { ExportOptions, ExportData } from "./types";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Définir le type pour jsPDF avec autotable
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

/**
 * Exporte des données au format PDF
 */
export const exportToPdf = async (
  data: ExportData[],
  options: ExportOptions = {}
): Promise<Blob> => {
  // Créer un nouveau document PDF
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  // Si pas de données, créer un PDF simple avec un message
  if (!data || data.length === 0) {
    doc.text("Aucune donnée disponible", 20, 20);
    return doc.output("blob");
  }
  
  // Ajouter un en-tête au PDF
  doc.setFontSize(18);
  doc.text("Export de données", 14, 22);
  
  // Ajouter la date d'export
  doc.setFontSize(11);
  doc.text(
    `Exporté le ${format(new Date(), "dd MMMM yyyy à HH:mm", { locale: fr })}`,
    14,
    32
  );
  
  // Récupérer les clés (colonnes) à partir des données
  const columns = Object.keys(data[0]).map(key => ({
    header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'), // Format CamelCase to spaces
    dataKey: key
  }));
  
  // Préparer les données pour le tableau
  const rows = data.map(item => {
    // Traitement spécial pour formater certaines valeurs si nécessaire
    const formattedRow = { ...item };
    
    // Si une date est détectée, la formater
    Object.keys(formattedRow).forEach(key => {
      const value = formattedRow[key];
      if (value instanceof Date) {
        formattedRow[key] = format(value, options.dateFormat || "dd/MM/yyyy");
      }
    });
    
    return formattedRow;
  });
  
  // Générer le tableau
  doc.autoTable({
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey] || "")),
    startY: 40,
    styles: { fontSize: 10, cellPadding: 2 },
    headStyles: { fillColor: [189, 30, 40], textColor: [255, 255, 255] }, // Rouge AVEM
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });
  
  // Ajouter un pied de page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `Page ${i} sur ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }
  
  // Retourner le PDF sous forme de Blob
  return doc.output("blob");
};
