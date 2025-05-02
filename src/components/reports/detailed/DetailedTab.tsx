
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const DetailedTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Données de démonstration
  const timeEntries = [
    { id: 1, employee: "Jean Dupont", worksite: "Bordeaux Centre", date: "02/05/2025", checkin: "08:00", checkout: "17:00", total_hours: "9h", status: "Validé" },
    { id: 2, employee: "Marie Martin", worksite: "Mérignac", date: "02/05/2025", checkin: "07:30", checkout: "16:30", total_hours: "9h", status: "Validé" },
    { id: 3, employee: "Pierre Durand", worksite: "Paris", date: "02/05/2025", checkin: "08:30", checkout: "18:00", total_hours: "9.5h", status: "En attente" },
    { id: 4, employee: "Jean Dupont", worksite: "Bordeaux Centre", date: "01/05/2025", checkin: "08:15", checkout: "16:45", total_hours: "8.5h", status: "Validé" },
    { id: 5, employee: "Sophie Lefebvre", worksite: "Lyon", date: "01/05/2025", checkin: "07:45", checkout: "17:15", total_hours: "9.5h", status: "Validé" },
    { id: 6, employee: "Thomas Bernard", worksite: "Marseille", date: "01/05/2025", checkin: "08:00", checkout: "17:30", total_hours: "9.5h", status: "Anomalie" },
    { id: 7, employee: "Pierre Durand", worksite: "Paris", date: "30/04/2025", checkin: "08:45", checkout: "17:45", total_hours: "9h", status: "Validé" },
    { id: 8, employee: "Marie Martin", worksite: "Mérignac", date: "30/04/2025", checkin: "07:30", checkout: "16:30", total_hours: "9h", status: "Validé" },
    { id: 9, employee: "Jean Dupont", worksite: "Bordeaux Centre", date: "29/04/2025", checkin: "08:00", checkout: "17:00", total_hours: "9h", status: "Validé" },
    { id: 10, employee: "Sophie Lefebvre", worksite: "Lyon", date: "29/04/2025", checkin: "07:45", checkout: "17:15", total_hours: "9.5h", status: "Validé" },
  ];
  
  const filteredEntries = timeEntries.filter(entry => 
    entry.employee.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.worksite.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Données détaillées</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Rechercher..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Chantier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Entrée</TableHead>
                <TableHead>Sortie</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map(entry => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.employee}</TableCell>
                  <TableCell>{entry.worksite}</TableCell>
                  <TableCell>{entry.date}</TableCell>
                  <TableCell>{entry.checkin}</TableCell>
                  <TableCell>{entry.checkout}</TableCell>
                  <TableCell>{entry.total_hours}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${entry.status === 'Validé' ? 'bg-green-100 text-green-800' : 
                      entry.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'}`}>
                      {entry.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filteredEntries.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">Aucune donnée trouvée</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
