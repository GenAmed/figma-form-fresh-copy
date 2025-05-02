
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface DashboardTabProps {
  mockHeuresParChantier: any[];
  mockHeuresParJour: any[];
}

export const DashboardTab = ({ mockHeuresParChantier, mockHeuresParJour }: DashboardTabProps) => {
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

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
    </div>
  );
};
