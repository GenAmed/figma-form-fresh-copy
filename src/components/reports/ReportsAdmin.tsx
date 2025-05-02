import React, { useState } from "react";
import { User } from "@/lib/auth";
import { BottomNavigation } from "@/components/navigation/BottomNavigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { FileText, Filter, AlertTriangle, Table as TableIcon, FileExcel, FileCsv, FilePdf, Download } from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { exportData, ExportFormat } from "@/services/export";

interface ReportsAdminProps {
  user: User;
}

// Mock data for demonstration
const mockChantiers = [
  { id: "1", nom: "Chantier Bordeaux Centre" },
  { id: "2", nom: "Chantier Mérignac" },
  { id: "3", nom: "Chantier Paris" },
  { id: "4", nom: "Chantier Lyon" },
  { id: "5", nom: "Chantier Lille" },
];

const mockEmployes = [
  { id: "1", nom: "Jean Dupont" },
  { id: "2", nom: "Marie Martin" },
  { id: "3", nom: "Pierre Durand" },
  { id: "4", nom: "Sophie Lefebvre" },
  { id: "5", nom: "Lucas Bernard" },
];

// Mock data for charts
const mockHeuresParChantier = [
  { name: "Bordeaux Centre", heures: 120 },
  { name: "Mérignac", heures: 80 },
  { name: "Paris", heures: 140 },
  { name: "Lyon", heures: 60 },
  { name: "Lille", heures: 90 },
];

const mockHeuresParJour = [
  { name: "Lun", heures: 45 },
  { name: "Mar", heures: 50 },
  { name: "Mer", heures: 48 },
  { name: "Jeu", heures: 52 },
  { name: "Ven", heures: 40 },
  { name: "Sam", heures: 20 },
  { name: "Dim", heures: 0 },
];

// Mock alerts data
const mockAlerts = [
  { id: 1, type: "warning", message: "Jean Dupont a travaillé plus de 10h le 29/04", date: "2025-05-02" },
  { id: 2, type: "danger", message: "Absence non justifiée de Pierre Durand", date: "2025-05-01" },
  { id: 3, type: "info", message: "Nouveau chantier assigné: Lyon", date: "2025-04-30" },
];

export const ReportsAdmin: React.FC<ReportsAdminProps> = ({ user }) => {
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [selectedChantiers, setSelectedChantiers] = useState<string[]>([]);
  const [selectedEmployes, setSelectedEmployes] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("excel");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [exportInProgress, setExportInProgress] = useState<boolean>(false);

  const toggleChantierSelection = (chantierId: string) => {
    if (selectedChantiers.includes(chantierId)) {
      setSelectedChantiers(selectedChantiers.filter(id => id !== chantierId));
    } else {
      setSelectedChantiers([...selectedChantiers, chantierId]);
    }
  };

  const toggleEmployeSelection = (employeId: string) => {
    if (selectedEmployes.includes(employeId)) {
      setSelectedEmployes(selectedEmployes.filter(id => id !== employeId));
    } else {
      setSelectedEmployes([...selectedEmployes, employeId]);
    }
  };

  // Fonction pour générer les données d'export selon les filtres actuels
  const generateExportData = () => {
    // Simulation de données pour l'export
    // Dans une vraie application, cela viendrait d'une API ou d'un service
    const detailedData = [
      { employé: "Jean Dupont", chantier: "Bordeaux Centre", date: "02/05/2025", entrée: "08:00", sortie: "17:00", total: "9h" },
      { employé: "Marie Martin", chantier: "Mérignac", date: "02/05/2025", entrée: "07:30", sortie: "16:30", total: "9h" },
      { employé: "Pierre Durand", chantier: "Paris", date: "02/05/2025", entrée: "08:30", sortie: "18:00", total: "9.5h" },
      { employé: "Jean Dupont", chantier: "Bordeaux Centre", date: "01/05/2025", entrée: "08:15", sortie: "16:45", total: "8.5h" },
      { employé: "Sophie Lefebvre", chantier: "Lyon", date: "01/05/2025", entrée: "07:45", sortie: "17:15", total: "9.5h" },
    ];

    // Filtrer par chantier si nécessaire
    let filteredData = detailedData;
    if (selectedChantiers.length > 0) {
      const chantierNames = mockChantiers
        .filter(c => selectedChantiers.includes(c.id))
        .map(c => c.nom);
      
      filteredData = filteredData.filter(item => chantierNames.includes(item.chantier));
    }

    // Filtrer par employé si nécessaire
    if (selectedEmployes.length > 0) {
      const employeNames = mockEmployes
        .filter(e => selectedEmployes.includes(e.id))
        .map(e => e.nom);
      
      filteredData = filteredData.filter(item => employeNames.includes(item.employé));
    }

    return filteredData;
  };

  const handleExport = async () => {
    try {
      setExportInProgress(true);
      toast.info(`Préparation de l'export en ${exportFormat.toUpperCase()}...`);
      
      // Générer les données à exporter
      const dataToExport = generateExportData();
      
      // Formatter le nom du fichier avec la date
      const formattedDateRange = `${format(dateRange.from, "yyyyMMdd")}_${format(dateRange.to, "yyyyMMdd")}`;
      const fileName = `pointage_${formattedDateRange}`;
      
      // Exporter les données
      const success = await exportData(dataToExport, exportFormat, {
        fileName,
        includeHeaders: true,
        dateFormat: "dd/MM/yyyy"
      });
      
      if (success) {
        toast.success(`Exportation en ${exportFormat.toUpperCase()} réussie`);
      } else {
        toast.error(`Erreur lors de l'exportation en ${exportFormat.toUpperCase()}`);
      }
    } catch (error) {
      console.error("Erreur d'export:", error);
      toast.error("Une erreur est survenue lors de l'export");
    } finally {
      setExportInProgress(false);
    }
  };

  const handlePrintReport = () => {
    // Simulation d'impression
    toast.success("Préparation de l'impression...");
    setTimeout(() => {
      toast.success("Document prêt à imprimer!");
      window.print();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] pb-16">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 py-3 fixed w-full top-0 z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">Rapports & Exports</h1>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filtres
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={handleExport}
              disabled={exportInProgress}
            >
              <FileText className="h-4 w-4 mr-1" />
              Exporter
            </Button>
          </div>
        </div>
      </header>

      {/* Filters Panel */}
      {showFilters && (
        <div className="pt-16 pb-4 px-4 bg-white shadow-md mb-4">
          <div className="space-y-4">
            <div>
              <Label>Période</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDateRange({
                    from: startOfMonth(new Date()),
                    to: endOfMonth(new Date())
                  })}
                >
                  Mois en cours
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDateRange({
                    from: subDays(new Date(), 7),
                    to: new Date()
                  })}
                >
                  7 derniers jours
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setDateRange({
                    from: subDays(new Date(), 30),
                    to: new Date()
                  })}
                >
                  30 derniers jours
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Date début</Label>
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                    className="rounded border bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Date fin</Label>
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                    className="rounded border bg-white"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Chantiers</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mockChantiers.map(chantier => (
                    <Badge 
                      key={chantier.id}
                      variant={selectedChantiers.includes(chantier.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleChantierSelection(chantier.id)}
                    >
                      {chantier.nom}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Employés</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {mockEmployes.map(employe => (
                    <Badge 
                      key={employe.id}
                      variant={selectedEmployes.includes(employe.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleEmployeSelection(employe.id)}
                    >
                      {employe.nom}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => {
                setSelectedChantiers([]);
                setSelectedEmployes([]);
              }}>
                Réinitialiser
              </Button>
              <Button onClick={() => setShowFilters(false)}>
                Appliquer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-16 px-4 mt-2">
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Période: {format(dateRange.from, "dd MMM yyyy", { locale: fr })} - {format(dateRange.to, "dd MMM yyyy", { locale: fr })}
          </p>
          {selectedChantiers.length > 0 && (
            <p className="text-sm text-gray-600">
              Chantiers filtrés: {selectedChantiers.length}
            </p>
          )}
          {selectedEmployes.length > 0 && (
            <p className="text-sm text-gray-600">
              Employés filtrés: {selectedEmployes.length}
            </p>
          )}
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="dashboard">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="alerts">Alertes</TabsTrigger>
            <TabsTrigger value="detailed">Détaillé</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Heures par chantier</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ chantiers: {} }} className="w-full h-[300px]">
                  <BarChart data={mockHeuresParChantier}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="heures" fill="#BD1E28" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Heures par jour</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{ jours: {} }} className="w-full h-[300px]">
                  <BarChart data={mockHeuresParJour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="heures" fill="#0088FE" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Résumé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Heures totales</p>
                    <p className="text-2xl font-bold">355h</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Employés actifs</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Chantiers actifs</p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Heures moyennes/employé</p>
                    <p className="text-2xl font-bold">29.6h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Alertes récentes</CardTitle>
              </CardHeader>
              <CardContent>
                {mockAlerts.map(alert => (
                  <div key={alert.id} className="mb-4 p-4 border-l-4 bg-white rounded shadow-sm flex items-start gap-3" style={{
                    borderLeftColor: alert.type === 'warning' ? '#f59e0b' : alert.type === 'danger' ? '#ef4444' : '#3b82f6'
                  }}>
                    <AlertTriangle className={`h-5 w-5 ${
                      alert.type === 'warning' ? 'text-amber-500' : 
                      alert.type === 'danger' ? 'text-red-500' : 
                      'text-blue-500'
                    }`} />
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-sm text-gray-500">{format(new Date(alert.date), "dd/MM/yyyy")}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Configuration des alertes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Seuil heures supplémentaires</Label>
                    <div className="flex items-center gap-2">
                      <Input type="number" placeholder="8" className="w-24" />
                      <span>heures par jour</span>
                    </div>
                  </div>
                  <div>
                    <Label>Alerte absence</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="checkbox" id="absence-alert" className="h-4 w-4" defaultChecked />
                      <label htmlFor="absence-alert">Activer notification absences non justifiées</label>
                    </div>
                  </div>
                  <div>
                    <Label>Alerte chantiers</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <input type="checkbox" id="chantier-alert" className="h-4 w-4" defaultChecked />
                      <label htmlFor="chantier-alert">Activer notification changements de chantiers</label>
                    </div>
                  </div>
                  <Button>Sauvegarder préférences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Tab */}
          <TabsContent value="detailed" className="space-y-4">
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
          </TabsContent>

          {/* Export Tab */}
          <TabsContent value="export" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Exporter les données</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Format d'export</Label>
                    <Select
                      value={exportFormat}
                      onValueChange={(value) => setExportFormat(value as ExportFormat)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choisir un format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excel">
                          <div className="flex items-center gap-2">
                            <FileExcel className="h-4 w-4" />
                            <span>Excel (.xlsx)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="csv">
                          <div className="flex items-center gap-2">
                            <FileCsv className="h-4 w-4" />
                            <span>CSV</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="pdf">
                          <div className="flex items-center gap-2">
                            <FilePdf className="h-4 w-4" />
                            <span>PDF</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Contenu à exporter</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="pointages" className="h-4 w-4" defaultChecked />
                        <label htmlFor="pointages">Pointages détaillés</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="resume-chantiers" className="h-4 w-4" defaultChecked />
                        <label htmlFor="resume-chantiers">Résumé par chantier</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="resume-employes" className="h-4 w-4" defaultChecked />
                        <label htmlFor="resume-employes">Résumé par employé</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="alertes" className="h-4 w-4" />
                        <label htmlFor="alertes">Alertes et anomalies</label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Options avancées</Label>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="inclure-geoloc" className="h-4 w-4" />
                        <label htmlFor="inclure-geoloc">Inclure données de géolocalisation</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="grouper-semaine" className="h-4 w-4" defaultChecked />
                        <label htmlFor="grouper-semaine">Grouper par semaine</label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrintReport}>Imprimer</Button>
                <Button 
                  onClick={handleExport}
                  disabled={exportInProgress}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Exporter les données
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rapports automatiques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Rapport hebdomadaire</h3>
                        <p className="text-sm text-gray-500">Lundi à 07:00</p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">Rapport mensuel</h3>
                        <p className="text-sm text-gray-500">1er du mois à 07:00</p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" onClick={() => {
                    toast.success("Nouveau rapport automatique créé");
                  }}>
                    + Ajouter un rapport automatique
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />
    </div>
  );
};
