"use client";

import { useState } from "react";

type PasswordFieldProps = {
  name: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  invalid?: boolean;
  describedBy?: string;
};

export function PasswordField({ name, value, onChange, autoComplete, invalid, describedBy }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span className="password-field">
      <input
        name={name}
        data-field={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        autoCapitalize="off"
        spellCheck={false}
        required
        value={value}
        className={invalid ? "is-invalid" : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onChange={(event) => onChange(event.target.value)}
      />
      <button
        className="password-toggle"
        type="button"
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        aria-pressed={visible}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </span>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 4.5 20 19.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M9.9 6.1A9.6 9.6 0 0 1 12 5.8c6 0 9.5 6.2 9.5 6.2a17 17 0 0 1-3.3 4.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M6.2 7.2C4 8.8 2.5 12 2.5 12S6 18.2 12 18.2c1.2 0 2.3-.2 3.3-.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10 10.2a2.7 2.7 0 0 0 3.7 3.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
