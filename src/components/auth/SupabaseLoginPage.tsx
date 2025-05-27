
import React from "react";
import { SupabaseLoginForm } from "./SupabaseLoginForm";

export const SupabaseLoginPage: React.FC = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-[#F8F8F8] p-4 sm:p-6 md:p-8">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-center mb-12">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/4a05b240274fc3f9416c899e3f3392089612eea9?placeholderIfAbsent=true"
              alt="AVEM Industrie Logo"
              className="w-[161px] h-[66px]"
            />
          </div>
          <div className="font-bold text-2xl text-[#333] text-center mb-8">
            AVEM Pointage
          </div>
          <SupabaseLoginForm />
        </div>
      </div>
    </>
  );
};
