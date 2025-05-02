
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Créer un schéma de validation pour le formulaire
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Adresse email invalide" }),
  pin: z.string().regex(/^\d{4,6}$/, { message: "Le PIN doit contenir entre 4 et 6 chiffres" }),
  role: z.string().min(1, { message: "Le rôle est requis" }),
  active: z.boolean().default(true),
  phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialiser le formulaire avec react-hook-form et zod
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      pin: "",
      role: "",
      active: true,
      phone: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Créer le profil directement dans la table profiles
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: crypto.randomUUID(), // Générer un UUID pour l'utilisateur
          name: values.name,
          email: values.email,
          pin: values.pin,
          role: values.role,
          active: values.active,
          phone: values.phone || null,
        })
        .select();
      
      if (error) {
        console.error("Erreur lors de l'ajout de l'utilisateur:", error);
        throw error;
      }
      
      toast.success("Utilisateur ajouté avec succès");
      navigate("/gestion/users");
    } catch (error: any) {
      console.error("Erreur détaillée:", error);
      toast.error("Erreur lors de l'ajout de l'utilisateur");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col">
      {/* Header */}
      <header className="bg-[#BD1E28] text-white p-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-4 p-0 hover:bg-transparent text-white"
            onClick={() => navigate("/gestion/users")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">Ajouter un utilisateur</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-24">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Nom complet *</FormLabel>
                  <FormControl>
                    <Input {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Email *</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* PIN */}
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">PIN (4-6 chiffres) *</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" className="w-full" maxLength={6} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Role */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Rôle *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ouvrier">Ouvrier</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Status */}
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between py-2">
                  <FormLabel className="font-bold">Actif</FormLabel>
                  <FormControl>
                    <Switch 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </main>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
        <div className="flex justify-between gap-4">
          <Button 
            type="button" 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate("/gestion/users")}
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            type="submit"
            onClick={form.handleSubmit(handleSubmit)} 
            className="flex-1 bg-[#BD1E28] hover:bg-[#A01822] text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Chargement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
};
