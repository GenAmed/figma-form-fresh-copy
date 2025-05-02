
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

export const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pin: "",
    role: "",
    active: true,
    phone: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleRoleChange = (value: string) => {
    setFormData({ ...formData, role: value });
  };

  const handleActiveChange = (checked: boolean) => {
    setFormData({ ...formData, active: checked });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.pin || !formData.role) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    // PIN validation (4-6 digits)
    if (!/^\d{4,6}$/.test(formData.pin)) {
      toast.error("Le PIN doit contenir entre 4 et 6 chiffres");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Créer un nouvel utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.pin + formData.pin, // Utiliser le PIN comme mot de passe temporaire (doublé pour atteindre la longueur minimale)
        options: {
          data: {
            name: formData.name,
            pin: formData.pin,
            role: formData.role
          }
        }
      });
      
      if (authError) throw authError;
      
      // Si l'utilisateur est créé avec succès, mettre à jour son profil avec des informations supplémentaires
      if (authData.user) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            phone: formData.phone || null,
            active: formData.active
          })
          .eq('id', authData.user.id);
          
        if (updateError) throw updateError;
      }
      
      toast.success("Utilisateur ajouté avec succès");
      navigate("/gestion/users");
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      // Message d'erreur plus spécifique pour les adresses email déjà utilisées
      if (error.message && error.message.includes("email already")) {
        toast.error("Cette adresse email est déjà utilisée");
      } else {
        toast.error("Erreur lors de l'ajout de l'utilisateur");
      }
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-bold">
              Nom complet *
            </Label>
            <Input 
              id="name" 
              value={formData.name}
              onChange={handleInputChange}
              className="w-full"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold">
              Email *
            </Label>
            <Input 
              id="email" 
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full"
              required
            />
          </div>

          {/* PIN */}
          <div className="space-y-2">
            <Label htmlFor="pin" className="font-bold">
              PIN (4-6 chiffres) *
            </Label>
            <Input 
              id="pin" 
              type="password"
              value={formData.pin}
              onChange={handleInputChange}
              className="w-full"
              maxLength={6}
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label className="font-bold">
              Rôle *
            </Label>
            <Select value={formData.role} onValueChange={handleRoleChange} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ouvrier">Ouvrier</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between py-2">
            <Label htmlFor="active-status" className="font-bold">
              Actif
            </Label>
            <Switch 
              id="active-status" 
              checked={formData.active} 
              onCheckedChange={handleActiveChange} 
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-bold">
              Téléphone
            </Label>
            <Input 
              id="phone" 
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full"
            />
          </div>
        </form>
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
            className="flex-1 bg-[#BD1E28] hover:bg-[#A01822] text-white"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Chargement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  );
};
