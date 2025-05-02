import React from "react";
import { LoginForm } from "./LoginForm";

export const LoginPage: React.FC = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
      />
      <div className="max-w-[390px] flex flex-col items-center w-full bg-[#F8F8F8] h-screen box-border mx-auto my-0 px-4 py-0 max-md:max-w-[991px] max-md:px-6 max-md:py-0 max-sm:max-w-screen-sm max-sm:px-4 max-sm:py-0">
        <div className="mt-[63px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4a05b240274fc3f9416c899e3f3392089612eea9?placeholderIfAbsent=true"
            alt="AVEM Industrie Logo"
            className="w-[161px] h-[66px]"
          />
        </div>
        <div className="font-bold text-2xl text-[#333] mt-[63px]">
          AVEM Pointage
        </div>
        <LoginForm />
      </div>
    </>
  );
};
