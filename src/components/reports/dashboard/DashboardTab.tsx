
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ReportData } from "@/hooks/useReportsData";

interface DashboardTabProps {
  data: ReportData;
  loading: boolean;
}

export const DashboardTab = ({ data, loading }: DashboardTabProps) => {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 text-[#BD1E28] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Heures par chantier</CardTitle>
          <Select defaultValue="bar" onValueChange={(value) => setChartType(value as "bar" | "line")}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type de graphique" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Barres</SelectItem>
              <SelectItem value="line">Lignes</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ chantiers: {} }} className="w-full h-[300px]">
            {chartType === "bar" ? (
              <BarChart data={data.heuresParChantier}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="heures" fill="#BD1E28" />
              </BarChart>
            ) : (
              <LineChart data={data.heuresParChantier}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="heures" stroke="#BD1E28" strokeWidth={2} />
              </LineChart>
            )}
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Heures par jour</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ jours: {} }} className="w-full h-[300px]">
            <BarChart data={data.heuresParJour}>
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
              <p className="text-2xl font-bold">{data.totalHeures}h</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Employés actifs</p>
              <p className="text-2xl font-bold">{data.employesActifs}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Chantiers actifs</p>
              <p className="text-2xl font-bold">{data.chantiersActifs}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Heures moyennes/employé</p>
              <p className="text-2xl font-bold">{data.moyenneHeuresEmploye}h</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
