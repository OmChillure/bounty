"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import React, {
  ChangeEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

// Define more specific types for the components
type InputChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

type Props01 = {
  label?: string;
  value?: string;
  onChange?: (e: InputChangeEvent) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  type?: "text" | "file";
  className?: string;
  disabled?: boolean;
};

// Define a type for menu items
type MenuItem = {
  name: string;
  value: string;
};

type MenuDataType = string[] | MenuItem[];

interface Props02 {
  label?: string;
  value?: string | string[];
  onChange: (selectedValues: string | string[]) => void;
  id?: string;
  name?: string;
  menuData: MenuDataType;
  placeholder?: string;
  multiple?: boolean;
  className?: string;
  icon?: ReactNode;
}

export const Input01 = ({
  label,
  value,
  onChange,
  placeholder,
  id,
  name,
  type,
  className,
  disabled = false,
}: Props01) => {
  const [fileName, setFileName] = useState("No file chosen");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onChange?.(event);
    } else {
      setFileName("No file chosen");
    }
  };

  return (
    <div className={clsx(className, "flex flex-col gap-3")}>
      {label && (
        <label className="block text-base font-medium mb-1" htmlFor={id}>
          {label}
        </label>
      )}
      {type === "file" ? (
        <div className="flex flex-col h-full gap-2">
          <label className="block">
            <span className="sr-only">
              {placeholder || "Choose file (1 username per row)"}
            </span>
            <input
              type="file"
              id={`file${id}`}
              name={name}
              disabled={disabled}
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="bg-gradient-to-r from-purple-500 to-purple-400 px-4 text-nowrap py-2 rounded-md text-white font-semibold cursor-pointer text-xs"
              onClick={() => {
                const fileInput = document.getElementById(`file${id}`) as HTMLInputElement;
                fileInput?.click();
              }}
            >
              {placeholder || "Choose file (1 username per row)"}
            </button>
          </label>
          <span className="text-xs text-gray-400">{fileName}</span>
        </div>
      ) : (
        <input
          type={type || "text"}
          id={id}
          name={name}
          value={value}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          className="rounded-[16px] border border-[#FFFFFF33] w-full p-4 box-border focus:outline-[#7371FC] text-sm"
          style={{
            background:
              "linear-gradient(161deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.05) 101.7%)",
          }}
        />
      )}
    </div>
  );
};

export const TextArea01 = ({
  label,
  value,
  onChange,
  placeholder,
  id,
  name,
  className,
}: Props01) => {
  return (
    <div className={clsx(className, "flex flex-col gap-3 w-full")}>
      {label && (
        <label className="block text-base font-medium mb-1" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="rounded-[16px] border border-[#FFFFFF33] h-24 w-full p-4 box-border focus:outline-[#7371FC] text-sm"
        style={{
          background:
            "linear-gradient(161deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.05) 101.7%)",
        }}
      />
    </div>
  );
};

export const Select01 = ({
  label,
  value,
  onChange,
  id,
  menuData,
  placeholder,
  className,
  multiple = false,
  icon,
}: Props02) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string | MenuItem) => {
    const selectedValue = typeof option === "string" ? option : option.value;

    if (multiple) {
      const updatedValues = Array.isArray(value)
        ? value.includes(selectedValue)
          ? value.filter((val) => val !== selectedValue)
          : [...value, selectedValue]
        : [selectedValue];

      onChange(updatedValues);
    } else {
      onChange(selectedValue);
      setIsOpen(false);
    }
  };

  const displayValue = (): string => {
    if (multiple && Array.isArray(value)) {
      if (isMenuItemArray(menuData)) {
        const display = value
          .map((val) => {
            const found = menuData.find((item) => item.value === val);
            return found ? found.name : val;
          })
          .join(", ");
        return display.length > 0 ? display : placeholder || "";
      } else {
        return value.length > 0 ? value.join(", ") : placeholder || "";
      }
    }

    if (value) {
      if (isMenuItemArray(menuData)) {
        const found = menuData.find((item) => item.value === value);
        return found ? found.name : value.toString();
      }
      return value.toString();
    }

    return placeholder || "";
  };

  // Type guard to check if menuData is MenuItem[]
  const isMenuItemArray = (data: MenuDataType): data is MenuItem[] => {
    return typeof data[0] === "object";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-3 relative w-full" ref={dropdownRef}>
      {label && (
        <label className="block text-base font-medium mb-1" htmlFor={id}>
          {label}
        </label>
      )}

      <div
        className={clsx(
          "z-20 w-full rounded-[16px] border border-[#FFFFFF33] p-4 box-border focus:outline-[#7371FC] text-sm relative cursor-pointer flex items-center gap-4 justify-between",
          className
        )}
        style={{
          background:
            "linear-gradient(161deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.05) 101.7%)",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {icon}
          {displayValue()}
        </div>

        <ChevronDown size={16} />
      </div>

      {isOpen && (
        <ul
          className="absolute z-50 -bottom-1 translate-y-[100%] w-full max-h-60 overflow-auto rounded-lg pb-2 text-sm"
          style={{
            background:
              "linear-gradient(320deg, rgb(0 0 0 / 95%) 0%, rgb(0 0 0 / 49%) 101.7%)",
          }}
        >
          {menuData.length > 0 ? (
            menuData.map((option, i) => {
              const displayText =
                typeof option === "string" ? option : option.name;
              const optionValue =
                typeof option === "string" ? option : option.value;

              return (
                <li
                  key={i}
                  onClick={() => handleSelect(option)}
                  className={`cursor-pointer px-4 py-2 hover:bg-[#7371FC] ${
                    Array.isArray(value) && value.includes(optionValue)
                      ? "bg-[#7371FC] text-white"
                      : value === optionValue
                      ? "bg-[#7371FC] text-white"
                      : ""
                  }`}
                >
                  {displayText}
                </li>
              );
            })
          ) : (
            <li className="px-4 py-2 text-gray-500">No results</li>
          )}
        </ul>
      )}

      <div className="w-[100px] h-[50px] bg-[#7371FC80] rounded-[75px] blur-[35px] absolute z-10 left-[50%] top-5 translate-x-[-50%]"></div>
    </div>
  );
};