import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown as ChevronDown, FiCheck as Check } from 'react-icons/fi';

export interface SelectOption {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`custom-select-wrapper ${className}`}
      style={{ position: 'relative', width: '100%', userSelect: 'none' }}
    >
      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          background: isOpen ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)',
          border: isOpen ? '1px solid var(--color-accent)' : '1px solid var(--border-card)',
          borderRadius: '12px',
          padding: '10px 14px',
          color: 'var(--text-main)',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selectedOption?.icon}
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
        </div>
        <ChevronDown
          size={18}
          style={{
            color: isOpen ? 'var(--color-accent)' : 'var(--text-muted)',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0
          }}
        />
      </div>

      {/* Options Dropdown List */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#161b22',
            border: '1px solid var(--border-card)',
            borderRadius: '14px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
            zIndex: 9999,
            maxHeight: '220px',
            overflowY: 'auto',
            padding: '6px',
            animation: 'fadeIn 0.15s ease-out'
          }}
        >
          {options.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <div
                key={String(opt.value)}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 700 : 500,
                  color: isSelected ? 'var(--color-accent)' : 'var(--text-main)',
                  background: isSelected ? 'rgba(212, 255, 0, 0.1)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check size={16} color="var(--color-accent)" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
