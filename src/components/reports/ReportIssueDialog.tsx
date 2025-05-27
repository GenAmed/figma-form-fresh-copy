
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { AlertTriangle, Send } from "lucide-react";
import { sendEmailToAdmins } from "@/services/notifications/emailService";
import { getCurrentUser } from "@/lib/auth";

interface ReportIssueDialogProps {
  children: React.ReactNode;
}

export const ReportIssueDialog: React.FC<ReportIssueDialogProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "normal" as "low" | "normal" | "high" | "urgent"
  });

  const user = getCurrentUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setLoading(true);
    
    try {
      const priorityLabels = {
        low: "Faible",
        normal: "Normale", 
        high: "Élevée",
        urgent: "Urgente"
      };

      const emailSubject = `[${priorityLabels[formData.priority]}] Signalement: ${formData.subject}`;
      const emailBody = `
        <h2>Nouveau signalement de problème</h2>
        <p><strong>Utilisateur:</strong> ${user?.name} (${user?.email})</p>
        <p><strong>Priorité:</strong> ${priorityLabels[formData.priority]}</p>
        <p><strong>Sujet:</strong> ${formData.subject}</p>
        <p><strong>Description:</strong></p>
        <p>${formData.description.replace(/\n/g, '<br>')}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString('fr-FR')}</p>
      `;

      const success = await sendEmailToAdmins(emailSubject, emailBody, "warning");
      
      if (success) {
        toast.success("Problème signalé", {
          description: "Votre signalement a été envoyé à l'administration"
        });
        setFormData({ subject: "", description: "", priority: "normal" });
        setOpen(false);
      } else {
        toast.error("Erreur lors de l'envoi", {
          description: "Impossible d'envoyer le signalement. Veuillez réessayer."
        });
      }
    } catch (error) {
      console.error("Erreur lors du signalement:", error);
      toast.error("Erreur lors de l'envoi", {
        description: "Une erreur est survenue. Veuillez réessayer."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#BD1E28]" />
            Signaler un problème
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Priorité</Label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="low">Faible</option>
              <option value="normal">Normale</option>
              <option value="high">Élevée</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Sujet *</Label>
            <Input
              id="subject"
              placeholder="Ex: Problème de pointage, matériel défectueux..."
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description du problème *</Label>
            <Textarea
              id="description"
              placeholder="Décrivez le problème en détail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#BD1E28] hover:bg-[#a01820]"
            >
              {loading ? (
                "Envoi..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
