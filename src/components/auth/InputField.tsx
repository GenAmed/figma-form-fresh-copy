
import React, { useState, forwardRef } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: string;
  placeholder: string;
  icon: string; // We'll keep this for backward compatibility but use Lucide icons
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

  // Determine which icon to show based on the icon string
  const renderIcon = () => {
    if (icon.includes("icon-email")) {
      return <Mail size={16} className="text-gray-400" />;
    } else if (icon.includes("icon-password")) {
      return <Lock size={16} className="text-gray-400" />;
    }
    return null;
  };

  return (
    <div className="w-full mb-4">
      <label className="font-normal text-sm text-[#333] mb-2 block">
        {label}
      </label>
      <div className="relative w-full">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          {renderIcon()}
        </div>
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
            {showPassword ? (
              <EyeOff className="text-gray-400" size={20} />
            ) : (
              <Eye className="text-gray-400" size={20} />
            )}
          </div>
        )}
      </div>
    </div>
  );
});

InputField.displayName = "InputField";
