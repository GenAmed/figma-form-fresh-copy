
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

interface WorksiteSummary {
  worksiteId: string;
  worksiteName: string;
  totalHours: number;
}

interface WorksiteSummaryProps {
  worksiteSummaries: WorksiteSummary[];
}

export const WorksiteSummary: React.FC<WorksiteSummaryProps> = ({ worksiteSummaries }) => {
  // Calculate grand total of hours
  const totalHours = worksiteSummaries.reduce((acc, summary) => acc + summary.totalHours, 0);

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-bold">Heures travaillées par chantier</h3>
      </CardHeader>
      <CardContent>
        {worksiteSummaries.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Chantier</TableHead>
                <TableHead className="text-right">Heures totales</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {worksiteSummaries.map((summary) => (
                <TableRow key={summary.worksiteId}>
                  <TableCell className="font-medium">{summary.worksiteName}</TableCell>
                  <TableCell className="text-right">
                    {summary.totalHours.toFixed(2)}h
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold bg-gray-50">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">{totalHours.toFixed(2)}h</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Aucune heure enregistrée cette semaine
          </div>
        )}
      </CardContent>
    </Card>
  );
};
