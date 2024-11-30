import React, { useState } from "react";

export default function RegistrationInput({ field, form, type, placeholder }) {
  const [isFocused, setIsFocused] = useState(false);

  // Check if the input has a value or is focused to float the label
  const shouldFloatLabel = isFocused || !!field.value;

  return (
    <div className="relative mt-4">
      <label
        className={`absolute left-2 transition-all pointer-events-none ${
          shouldFloatLabel
            ? "text-xs text-gray-500 -top-2 bg-white px-1"
            : "text-gray-400 top-2.5"
        }`}
      >
        {placeholder}
      </label>
      <input
        {...field}
        type={type || "text"}
        className="border rounded-md border-gray-300 outline-none px-2 py-2 w-full mt-1"
        spellCheck={false}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {form.touched[field.name] && form.errors[field.name] && (
        <div className="text-red-500 text-sm">{form.errors[field.name]}</div>
      )}
    </div>
  );
}
