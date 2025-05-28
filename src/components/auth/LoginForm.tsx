
import React, { useState } from "react";
import { InputField } from "./InputField";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "@/services/notifications/toastService";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      showSuccessToast("Connexion réussie", "Bienvenue !");
      navigate("/home");
    } catch (error: any) {
      showErrorToast("Erreur de connexion", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Entrez votre email"
      />
      
      <InputField
        id="password"
        label="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        placeholder="Entrez votre mot de passe"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#BD1E28] text-white py-3 px-4 rounded-md hover:bg-[#a01820] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Connexion..." : "Se connecter"}
      </button>
      
      {/* Comptes de test */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Comptes de test disponibles :</h3>
        <div className="space-y-2 text-xs text-blue-700">
          <div>
            <strong>Admin :</strong> admin@avem.fr / admin2024
          </div>
          <div>
            <strong>Ouvrier :</strong> ouvrier@avem.fr / avem2024
          </div>
        </div>
      </div>
    </form>
  );
};
