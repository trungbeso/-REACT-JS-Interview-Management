import React, { useState, useEffect, useRef } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  multi?: boolean;
}

const Select: React.FC<SelectProps> = ({
  options,
  selectedValues,
  onChange,
  placeholder = 'Select options',
  multi = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleOptionClick = (value: string) => {
    if (multi) {
      onChange(
        selectedValues.includes(value)
          ? selectedValues.filter((v) => v !== value)
          : [...selectedValues, value],
      );
    } else {
      onChange(selectedValues[0] === value ? [] : [value]);
      setIsOpen(false);
    }
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const renderSelectedValues = () => {
    if (selectedValues.length === 0 || !selectedValues[0]) {
      return <span className="text-gray-400">{placeholder}</span>;
    }
    if (multi) {
      return selectedValues.map((value) => (
        <span
          key={value}
          className="bg-blue-500 dark:bg-blue-600 text-white px-2 py-1 rounded-full text-xs"
        >
          {options.find((option) => option.value === value)?.label}
        </span>
      ));
    }
    return (
      <span className="bg-blue-500 dark:bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
        {options.find((option) => option.value === selectedValues[0])?.label}
      </span>
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className={`border rounded-md p-2 flex flex-wrap items-center gap-2 cursor-pointer transition-all bg-gray-50 ${
          isOpen ? 'border-blue-500' : 'border-gray-600'
        } focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
        onClick={toggleDropdown}
      >
        {renderSelectedValues()}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-600 rounded-md shadow-lg z-10">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border-b border-gray-300 dark:border-gray-600 focus:outline-none dark:bg-gray-800 dark:text-white"
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredOptions.map((option) => (
              <li
                key={option.value}
                onClick={() => handleOptionClick(option.value)}
                className={`p-2 cursor-pointer hover:bg-blue-500 hover:text-white ${
                  selectedValues.includes(option.value)
                    ? 'bg-blue-100 dark:bg-blue-600 dark:text-white'
                    : 'dark:text-gray-300'
                }`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Select;
