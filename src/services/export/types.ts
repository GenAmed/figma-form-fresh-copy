
export type ExportFormat = "excel" | "csv" | "pdf";

export interface ExportOptions {
  fileName?: string;
  includeHeaders?: boolean;
  dateFormat?: string;
}

export interface ExportData {
  [key: string]: any;
}
