"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface CountryInfo {
  code: string;
  country: string;
  flag: string;
  minDigits: number;
  maxDigits: number;
  placeholder: string;
}

export const COUNTRY_CODES: CountryInfo[] = [
  { code: "+91", country: "India", flag: "🇮🇳", minDigits: 10, maxDigits: 10, placeholder: "98450 11223" },
  { code: "+1", country: "US / Canada", flag: "🇺🇸", minDigits: 10, maxDigits: 10, placeholder: "202 555 0123" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧", minDigits: 10, maxDigits: 11, placeholder: "7911 123456" },
  { code: "+971", country: "UAE", flag: "🇦🇪", minDigits: 9, maxDigits: 9, placeholder: "50 123 4567" },
  { code: "+65", country: "Singapore", flag: "🇸🇬", minDigits: 8, maxDigits: 8, placeholder: "8123 4567" },
  { code: "+61", country: "Australia", flag: "🇦🇺", minDigits: 9, maxDigits: 9, placeholder: "412 345 678" },
  { code: "+49", country: "Germany", flag: "🇩🇪", minDigits: 10, maxDigits: 11, placeholder: "151 12345678" },
];

export function parsePhoneNumber(raw: string): { countryCode: string; nationalNumber: string } {
  if (!raw) return { countryCode: "+91", nationalNumber: "" };
  const trimmed = raw.trim();

  for (const c of COUNTRY_CODES) {
    if (trimmed.startsWith(c.code)) {
      return {
        countryCode: c.code,
        nationalNumber: trimmed.slice(c.code.length).trim(),
      };
    }
  }

  // Default to +91 if no country code prefix
  return {
    countryCode: "+91",
    nationalNumber: trimmed.replace(/^\+/, ""),
  };
}

export function validatePhoneNumber(fullNumber: string): { valid: boolean; error?: string } {
  if (!fullNumber || !fullNumber.trim()) {
    return { valid: false, error: "A contact number helps the volunteer reach you." };
  }

  const { countryCode, nationalNumber } = parsePhoneNumber(fullNumber);
  const digits = nationalNumber.replace(/\D/g, "");

  if (countryCode === "+91") {
    if (digits.length !== 10) {
      return { valid: false, error: "Please enter a valid 10-digit Indian mobile number." };
    }
    if (!/^[6-9]\d{9}$/.test(digits)) {
      return { valid: false, error: "Mobile number must start with 6, 7, 8, or 9." };
    }
  } else {
    const country = COUNTRY_CODES.find((c) => c.code === countryCode);
    const min = country?.minDigits || 8;
    const max = country?.maxDigits || 15;
    if (digits.length < min || digits.length > max) {
      return { valid: false, error: `Enter a valid ${country?.country || ""} phone number (${min}–${max} digits).` };
    }
  }

  return { valid: true };
}

export function PhoneInput({
  value,
  onChange,
  error,
  disabled,
  id,
  className = "",
}: {
  value: string;
  onChange: (fullNumber: string) => void;
  error?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}) {
  const parsed = useMemo(() => parsePhoneNumber(value), [value]);
  const [prevValue, setPrevValue] = useState(value);
  const [selectedCountry, setSelectedCountry] = useState(parsed.countryCode);
  const [number, setNumber] = useState(parsed.nationalNumber);

  // Sync if value changes externally
  if (value !== prevValue) {
    setPrevValue(value);
    setSelectedCountry(parsed.countryCode);
    setNumber(parsed.nationalNumber);
  }

  const activeCountry =
    COUNTRY_CODES.find((c) => c.code === selectedCountry) || COUNTRY_CODES[0];

  function handleCountryChange(code: string) {
    setSelectedCountry(code);
    const cleanNum = number.trim();
    onChange(cleanNum ? `${code} ${cleanNum}` : "");
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    // Allow digits, spaces, and hyphens only
    const clean = raw.replace(/[^\d\s-]/g, "");
    setNumber(clean);
    onChange(clean.trim() ? `${selectedCountry} ${clean.trim()}` : "");
  }

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex h-12 w-full items-center rounded-xl border bg-white transition-all focus-within:border-forest focus-within:ring-2 focus-within:ring-forest/15 ${
          error ? "border-clay bg-clay/5" : "border-line-strong hover:border-forest/50"
        } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      >
        {/* Country Code Dropdown */}
        <div className="relative flex h-full items-center border-r border-line bg-cream px-3 rounded-l-xl">
          <span className="text-base select-none mr-1.5">{activeCountry.flag}</span>
          <span className="text-xs font-extrabold text-ink tabular-nums mr-1">
            {activeCountry.code}
          </span>
          <ChevronDown className="h-3 w-3 text-muted pointer-events-none" />

          <select
            value={selectedCountry}
            disabled={disabled}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer text-xs"
            aria-label="Country calling code"
          >
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.country} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* Number Input */}
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          disabled={disabled}
          value={number}
          onChange={handleNumberChange}
          placeholder={activeCountry.placeholder}
          maxLength={activeCountry.maxDigits + 4} // extra space for formatting
          className="flex-1 h-full bg-transparent px-3.5 text-sm font-semibold text-ink placeholder:text-muted/60 focus:outline-none tracking-wide"
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-semibold text-clay">{error}</p>}
    </div>
  );
}
