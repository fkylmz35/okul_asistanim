import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingLabelInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  disabled = false
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        disabled={disabled}
        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-transparent peer disabled:opacity-50 disabled:cursor-not-allowed"
        placeholder={label}
      />
      <motion.label
        initial={false}
        animate={{
          y: (isFocused || value) ? -24 : 0,
          scale: (isFocused || value) ? 0.85 : 1,
          color: isFocused ? (document.documentElement.classList.contains('dark') ? '#8B5CF6' : '#3B82F6') : '#9CA3AF'
        }}
        className="absolute left-4 top-3 text-gray-500 dark:text-gray-400 transition-all duration-200 pointer-events-none origin-left"
      >
        {label}
      </motion.label>
    </div>
  );
};

export default FloatingLabelInput;