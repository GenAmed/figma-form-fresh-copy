
import React, { useState, forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: string;
  placeholder: string;
  icon: string;
  showPasswordToggle?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  label,
  type,
  placeholder,
  icon,
  showPasswordToggle = false,
  onChange,
  value,
  ...rest
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full mb-4">
      <label className="font-normal text-sm text-[#333] mb-2 block">
        {label}
      </label>
      <div className="relative w-full">
        <div
          className="absolute left-3 top-1/2 transform -translate-y-1/2"
          dangerouslySetInnerHTML={{
            __html: icon,
          }}
        />
        <input
          ref={ref}
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          className="w-full border border-gray-300 text-base text-[#333] px-10 py-2.5 rounded-md border-solid"
          onChange={onChange}
          value={value}
          {...rest}
        />
        {showPasswordToggle && (
          <div 
            onClick={togglePasswordVisibility} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            <div
              dangerouslySetInnerHTML={{
                __html:
                  '<svg id="2:52" layer-name="Frame" width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-eye" style="width: 18px; height: 16px; fill: #9CA3AF"> <g clip-path="url(#clip0_2_52)"> <path d="M8.99995 2.5C6.96245 2.5 5.28745 3.425 4.00308 4.61562C2.79995 5.73437 1.9687 7.0625 1.5437 8C1.9687 8.9375 2.79995 10.2656 3.99995 11.3844C5.28745 12.575 6.96245 13.5 8.99995 13.5C11.0375 13.5 12.7125 12.575 13.9968 11.3844C15.2 10.2656 16.0312 8.9375 16.4562 8C16.0312 7.0625 15.2 5.73437 14 4.61562C12.7125 3.425 11.0375 2.5 8.99995 2.5ZM2.9812 3.51875C4.45308 2.15 6.47495 1 8.99995 1C11.525 1 13.5468 2.15 15.0187 3.51875C16.4812 4.87812 17.4593 6.5 17.9249 7.61562C18.0281 7.8625 18.0281 8.1375 17.9249 8.38437C17.4593 9.5 16.4812 11.125 15.0187 12.4812C13.5468 13.85 11.525 15 8.99995 15C6.47495 15 4.45308 13.85 2.9812 12.4812C1.5187 11.125 0.540576 9.5 0.0780762 8.38437C-0.0250488 8.1375 -0.0250488 7.8625 0.0780762 7.61562C0.540576 6.5 1.5187 4.875 2.9812 3.51875ZM8.99995 10.5C10.3812 10.5 11.5 9.38125 11.5 8C11.5 6.61875 10.3812 5.5 8.99995 5.5C8.97808 5.5 8.95933 5.5 8.93745 5.5C8.97808 5.65937 8.99995 5.82812 8.99995 6C8.99995 7.10312 8.10308 8 6.99995 8C6.82808 8 6.65933 7.97812 6.49995 7.9375C6.49995 7.95937 6.49995 7.97813 6.49995 8C6.49995 9.38125 7.6187 10.5 8.99995 10.5ZM8.99995 4C10.0608 4 11.0782 4.42143 11.8284 5.17157C12.5785 5.92172 13 6.93913 13 8C13 9.06087 12.5785 10.0783 11.8284 10.8284C11.0782 11.5786 10.0608 12 8.99995 12C7.93909 12 6.92167 11.5786 6.17152 10.8284C5.42138 10.0783 4.99995 9.06087 4.99995 8C4.99995 6.93913 5.42138 5.92172 6.17152 5.17157C6.92167 4.42143 7.93909 4 8.99995 4Z" fill="#9CA3AF"></path> </g> <defs> <clipPath id="clip0_2_52"> <path d="M0 0H18V16H0V0Z" fill="white"></path> </clipPath> </defs> </svg>',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
});

InputField.displayName = "InputField";
