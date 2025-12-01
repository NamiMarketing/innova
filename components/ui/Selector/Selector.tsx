'use client';

import { useState, useRef, useEffect, useCallback, KeyboardEvent, ReactNode, useId } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from './Selector.module.css';
import selectorIcon from '@/img/icons/selector-icon.svg';

export interface SelectorOption {
  value: string;
  label: string;
}

interface BaseSelectorProps {
  options: SelectorOption[];
  label?: string;
  icon?: ReactNode;
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

interface SingleSelectorProps extends BaseSelectorProps {
  multiple?: false;
  value: string;
  onChange: (value: string) => void;
}

interface MultipleSelectorProps extends BaseSelectorProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
}

type SelectorProps = SingleSelectorProps | MultipleSelectorProps;

interface DropdownPosition {
  top: number;
  left: number;
  width: number;
}

export function Selector(props: SelectorProps) {
  const {
    options,
    label,
    icon,
    placeholder = 'Selecione...',
    searchable = false,
    searchPlaceholder = 'Buscar...',
    disabled = false,
    id,
    className,
    multiple = false,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const isMultiple = multiple === true;
  const selectedValues = isMultiple
    ? (props as MultipleSelectorProps).value
    : [(props as SingleSelectorProps).value].filter(Boolean);

  const getDisplayValue = (): string => {
    if (selectedValues.length === 0) return '';

    if (isMultiple) {
      const selectedLabels = selectedValues
        .map((v) => options.find((o) => o.value === v)?.label)
        .filter(Boolean);
      return selectedLabels.join(', ');
    }

    return options.find((o) => o.value === selectedValues[0])?.label || '';
  };

  const updateDropdownPosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, []);

  const handleSelect = (optionValue: string) => {
    if (isMultiple) {
      const currentValues = (props as MultipleSelectorProps).value;
      const onChange = (props as MultipleSelectorProps).onChange;

      if (currentValues.includes(optionValue)) {
        onChange(currentValues.filter((v) => v !== optionValue));
      } else {
        onChange([...currentValues, optionValue]);
      }
    } else {
      (props as SingleSelectorProps).onChange(optionValue);
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      case 'Tab':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setHighlightedIndex(-1);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    const target = event.target as Node;
    const isOutsideContainer = containerRef.current && !containerRef.current.contains(target);
    const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(target);

    if (isOutsideContainer && isOutsideDropdown) {
      setIsOpen(false);
      setSearchTerm('');
      setHighlightedIndex(-1);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);

      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true);
        window.removeEventListener('resize', updateDropdownPosition);
      };
    }
  }, [isOpen, updateDropdownPosition]);

  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const displayValue = getDisplayValue();
  const hasValue = selectedValues.length > 0;

  const dropdownContent = isOpen && (
    <div
      ref={dropdownRef}
      className={styles.dropdown}
      style={{
        position: 'absolute',
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
      }}
    >
      {searchable && (
        <div className={styles.searchContainer}>
          <input
            ref={inputRef}
            type="text"
            className={styles.searchInput}
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={handleSearchChange}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <ul ref={listRef} id={listboxId} className={styles.optionsList} role="listbox">
        {filteredOptions.length === 0 ? (
          <li className={styles.noOptions}>Nenhuma opção encontrada</li>
        ) : (
          filteredOptions.map((option, index) => {
            const isSelected = selectedValues.includes(option.value);
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={option.value}
                className={`${styles.option} ${isSelected ? styles.optionSelected : ''} ${isHighlighted ? styles.optionHighlighted : ''}`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={isSelected}
              >
                {isMultiple && (
                  <span className={`${styles.checkbox} ${isSelected ? styles.checkboxChecked : ''}`}>
                    {isSelected && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                )}
                <span className={styles.optionLabel}>{option.label}</span>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );

  return (
    <>
      <div
        ref={containerRef}
        className={`${styles.container} ${className || ''} ${disabled ? styles.disabled : ''}`}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-disabled={disabled}
      >
        <div
          className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className={styles.content}>
            {label && (
              <div className={styles.labelRow}>
                {icon && <span className={styles.icon}>{icon}</span>}
                <span className={styles.label}>{label}</span>
              </div>
            )}
            <span className={`${styles.value} ${!hasValue ? styles.placeholder : ''}`}>
              {hasValue ? displayValue : placeholder}
            </span>
          </div>
          <span className={styles.arrow}>
            <Image src={selectorIcon} alt="" width={8} height={12} />
          </span>
        </div>
      </div>
      {typeof document !== 'undefined' && createPortal(dropdownContent, document.body)}
    </>
  );
}
