
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "./InputField";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log("Form submitted:", data);
    // Simulating a successful login, navigating to the home page
    navigate("/home");
  };

  const handleInputChange =
    (field: keyof LoginFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({
        ...formValues,
        [field]: field === "rememberMe" ? e.target.checked : e.target.value,
      });
    };

  const emailIcon =
    '<svg id="2:32" layer-name="Frame" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-email" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; fill: #9CA3AF"> <path d="M16 16H0V0H16V16Z" stroke="#E5E7EB"></path> <path d="M2 3.5C1.725 3.5 1.5 3.725 1.5 4V4.69063L6.89062 9.11563C7.5375 9.64688 8.46563 9.64688 9.1125 9.11563L14.5 4.69063V4C14.5 3.725 14.275 3.5 14 3.5H2ZM1.5 6.63125V12C1.5 12.275 1.725 12.5 2 12.5H14C14.275 12.5 14.5 12.275 14.5 12V6.63125L10.0625 10.275C8.8625 11.2594 7.13437 11.2594 5.9375 10.275L1.5 6.63125ZM0 4C0 2.89688 0.896875 2 2 2H14C15.1031 2 16 2.89688 16 4V12C16 13.1031 15.1031 14 14 14H2C0.896875 14 0 13.1031 0 12V4Z" fill="#9CA3AF"></path> </svg>';

  const passwordIcon =
    '<svg id="2:38" layer-name="Frame" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-password" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; fill: #9CA3AF"> <g clip-path="url(#clip0_2_38)"> <path d="M4.89062 13.9906L4.49687 14.9125C3.9125 14.6156 3.375 14.25 2.8875 13.8219L3.59687 13.1125C3.9875 13.4531 4.42188 13.75 4.89062 13.9906ZM1.26875 8.5H0.265625C0.309375 9.1625 0.434375 9.80313 0.63125 10.4094L1.5625 10.0375C1.40937 9.54688 1.30625 9.03125 1.26875 8.5ZM1.26875 7.5C1.3125 6.9125 1.43125 6.34375 1.61563 5.80937L0.69375 5.41563C0.459375 6.07188 0.3125 6.77188 0.265625 7.5H1.26875ZM2.00938 4.89062C2.25313 4.425 2.54688 3.99062 2.8875 3.59375L2.17812 2.88438C1.75 3.37188 1.38125 3.90938 1.0875 4.49375L2.00938 4.89062ZM12.4062 13.1125C11.9719 13.4875 11.4875 13.8094 10.9656 14.0625L11.3375 14.9937C11.9844 14.6844 12.5813 14.2875 13.1156 13.8188L12.4062 13.1125ZM3.59375 2.8875C4.02812 2.5125 4.5125 2.19063 5.03438 1.9375L4.6625 1.00625C4.01562 1.31563 3.41875 1.7125 2.8875 2.18125L3.59375 2.8875ZM13.9906 11.1094C13.7469 11.575 13.4531 12.0094 13.1125 12.4062L13.8219 13.1156C14.25 12.6281 14.6188 12.0875 14.9125 11.5063L13.9906 11.1094ZM14.7312 8.5C14.6875 9.0875 14.5687 9.65625 14.3844 10.1906L15.3062 10.5844C15.5406 9.925 15.6875 9.225 15.7312 8.49687H14.7312V8.5ZM10.0375 14.4375C9.54688 14.5938 9.03125 14.6937 8.5 14.7312V15.7344C9.1625 15.6906 9.80313 15.5656 10.4094 15.3687L10.0375 14.4375ZM7.5 14.7312C6.9125 14.6875 6.34375 14.5687 5.80937 14.3844L5.41563 15.3062C6.075 15.5406 6.775 15.6875 7.50313 15.7312V14.7312H7.5ZM14.4375 5.9625C14.5938 6.45313 14.6937 6.96875 14.7312 7.5H15.7344C15.6906 6.8375 15.5656 6.19687 15.3687 5.59062L14.4375 5.9625ZM2.8875 12.4062C2.5125 11.9719 2.19063 11.4875 1.9375 10.9656L1.00625 11.3375C1.31563 11.9844 1.7125 12.5813 2.18125 13.1156L2.8875 12.4062ZM8.5 1.26875C9.0875 1.3125 9.65313 1.43125 10.1906 1.61563L10.5844 0.69375C9.92813 0.459375 9.22812 0.3125 8.5 0.265625V1.26875ZM5.9625 1.5625C6.45313 1.40625 6.96875 1.30625 7.5 1.26875V0.265625C6.8375 0.309375 6.19687 0.434375 5.59062 0.63125L5.9625 1.5625ZM13.8219 2.88438L13.1125 3.59375C13.4875 4.02812 13.8094 4.5125 14.0656 5.03438L14.9969 4.6625C14.6875 4.01562 14.2906 3.41875 13.8219 2.88438ZM12.4062 2.8875L13.1156 2.17812C12.6281 1.75 12.0906 1.38125 11.5063 1.0875L11.1125 2.00938C11.575 2.25313 12.0125 2.54688 12.4062 2.8875Z" fill="#9CA3AF"></path> <path d="M8 12.25C8.48325 12.25 8.875 11.8582 8.875 11.375C8.875 10.8918 8.48325 10.5 8 10.5C7.51675 10.5 7.125 10.8918 7.125 11.375C7.125 11.8582 7.51675 12.25 8 12.25Z" fill="#9CA3AF"></path> <path d="M8.24063 9.75H7.74063C7.53438 9.75 7.36563 9.58125 7.36563 9.375C7.36563 7.15625 9.78438 7.37812 9.78438 6.00625C9.78438 5.38125 9.22813 4.75 7.99063 4.75C7.08126 4.75 6.60626 5.05 6.14063 5.64687C6.01876 5.80312 5.79376 5.83438 5.63438 5.72188L5.22501 5.43437C5.05001 5.3125 5.00938 5.06562 5.14376 4.89687C5.80626 4.04687 6.59376 3.5 7.99376 3.5C9.62813 3.5 11.0375 4.43125 11.0375 6.00625C11.0375 8.11875 8.61876 7.99063 8.61876 9.375C8.61563 9.58125 8.44688 9.75 8.24063 9.75Z" fill="#9CA3AF"></path> </g> <defs> <clipPath id="clip0_2_38"> <path d="M0 0H16V16H0V0Z" fill="white"></path> </clipPath> </defs> </svg>';

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-[358px] bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.1),0px_4px_6px_rgba(0,0,0,0.1)] mt-8 p-6 rounded-lg max-md:px-4 max-md:py-6 max-sm:px-2 max-sm:py-6"
    >
      <InputField
        label="Email / Identifiant"
        type="text"
        placeholder="Votre email"
        icon={emailIcon}
        onChange={handleInputChange("email")}
        value={formValues.email}
      />
      {errors.email && (
        <p className="text-red-500 text-xs mt-1 mb-2">{errors.email.message}</p>
      )}

      <InputField
        label="Mot de passe / PIN"
        type="password"
        placeholder="Votre mot de passe"
        icon={passwordIcon}
        showPasswordToggle={true}
        onChange={handleInputChange("password")}
        value={formValues.password}
      />
      {errors.password && (
        <p className="text-red-500 text-xs mt-1 mb-2">
          {errors.password.message}
        </p>
      )}

      <div className="flex items-center mb-6">
        <input
          type="checkbox"
          id="remember"
          className="mr-2"
          {...register("rememberMe")}
          onChange={handleInputChange("rememberMe")}
          checked={formValues.rememberMe}
        />
        <label htmlFor="remember" className="font-normal text-sm text-[#666]">
          Se souvenir de moi
        </label>
      </div>

      <button
        type="submit"
        className="w-full bg-[#BD1E28] text-white font-medium text-base cursor-pointer text-center px-0 py-3.5 rounded-md border-[none]"
      >
        Se connecter
      </button>

      <div className="text-center font-normal text-sm text-[#666] mt-4">
        Problème de connexion?
      </div>
    </form>
  );
};
