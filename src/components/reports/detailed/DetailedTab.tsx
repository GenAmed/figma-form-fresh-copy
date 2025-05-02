
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Table as TableIcon } from "lucide-react";

export const DetailedTab = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Heures détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Chantier</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Entrée</TableHead>
                  <TableHead>Sortie</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Jean Dupont</TableCell>
                  <TableCell>Bordeaux Centre</TableCell>
                  <TableCell>02/05/2025</TableCell>
                  <TableCell>08:00</TableCell>
                  <TableCell>17:00</TableCell>
                  <TableCell className="text-right">9h</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Marie Martin</TableCell>
                  <TableCell>Mérignac</TableCell>
                  <TableCell>02/05/2025</TableCell>
                  <TableCell>07:30</TableCell>
                  <TableCell>16:30</TableCell>
                  <TableCell className="text-right">9h</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Pierre Durand</TableCell>
                  <TableCell>Paris</TableCell>
                  <TableCell>02/05/2025</TableCell>
                  <TableCell>08:30</TableCell>
                  <TableCell>18:00</TableCell>
                  <TableCell className="text-right">9.5h</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Jean Dupont</TableCell>
                  <TableCell>Bordeaux Centre</TableCell>
                  <TableCell>01/05/2025</TableCell>
                  <TableCell>08:15</TableCell>
                  <TableCell>16:45</TableCell>
                  <TableCell className="text-right">8.5h</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Sophie Lefebvre</TableCell>
                  <TableCell>Lyon</TableCell>
                  <TableCell>01/05/2025</TableCell>
                  <TableCell>07:45</TableCell>
                  <TableCell>17:15</TableCell>
                  <TableCell className="text-right">9.5h</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => {
            toast.success("Données chargées en format Excel");
          }}>
            <TableIcon className="h-4 w-4 mr-1" />
            Voir plus
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
