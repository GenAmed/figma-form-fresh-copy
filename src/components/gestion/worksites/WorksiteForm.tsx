
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Calendar } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const worksiteFormSchema = z.object({
  name: z.string().min(1, "Le nom du chantier est requis"),
  address: z.string().min(1, "L'adresse est requise"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  status: z.enum(["pending", "active", "completed"]),
});

export type WorksiteFormValues = z.infer<typeof worksiteFormSchema>;

interface WorksiteFormProps {
  onSubmit: (values: WorksiteFormValues) => Promise<void>;
  isSubmitting: boolean;
  initialValues?: WorksiteFormValues;
}

export const WorksiteForm: React.FC<WorksiteFormProps> = ({ 
  onSubmit, 
  isSubmitting,
  initialValues = {
    name: "",
    address: "",
    startDate: "",
    endDate: "",
    status: "pending"
  }
}) => {
  const form = useForm<WorksiteFormValues>({
    resolver: zodResolver(worksiteFormSchema),
    defaultValues: initialValues
  });

  const handleSubmit = async (values: WorksiteFormValues) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Worksite Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="block text-sm font-bold text-[#333333]">
                Nom du chantier *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="w-full px-4 py-3" 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Address */}
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="block text-sm font-bold text-[#333333]">
                Adresse *
              </FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  className="w-full px-4 py-3" 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date */}
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="block text-sm font-bold text-[#333333]">
                Date de début
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    {...field} 
                    type="date"
                    className="w-full px-4 py-3" 
                    disabled={isSubmitting}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* End Date */}
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="block text-sm font-bold text-[#333333]">
                Date de fin
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    {...field}
                    type="date" 
                    className="w-full px-4 py-3" 
                    disabled={isSubmitting}
                  />
                  <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="block text-sm font-bold text-[#333333]">
                Statut
              </FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className="w-full px-4 py-3">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
