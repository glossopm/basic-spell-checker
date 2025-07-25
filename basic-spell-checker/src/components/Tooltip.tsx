import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  suggestions?: string[];
  className?: string;
  onSuggestionClick?: (suggestion: string) => void;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  suggestions = [], 
  className = '',
  onSuggestionClick
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const showTooltip = (event: React.MouseEvent | React.FocusEvent) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setIsVisible(true);
    setFocusedSuggestionIndex(-1);
  };

  const hideTooltip = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsVisible(false);
    }, 150); // Small delay to allow moving to tooltip
  };

  const handleTooltipEnter = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isVisible || suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedSuggestionIndex >= 0 && onSuggestionClick) {
          onSuggestionClick(suggestions[focusedSuggestionIndex]);
          setIsVisible(false);
        }
        break;
      case 'Escape':
        event.preventDefault();
        setIsVisible(false);
        setFocusedSuggestionIndex(-1);
        break;
    }
  };

  const handleTooltipLeave = () => {
    setIsVisible(false);
    setFocusedSuggestionIndex(-1);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Don't render tooltip if no content or suggestions
  if (!content && suggestions.length === 0) {
    return <span className={className}>{children}</span>;
  }

  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      <span
        ref={triggerRef}
        className={`${className} cursor-help hover:bg-gray-100 focus:bg-gray-100 rounded px-1 transition-colors`}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        onKeyDown={handleKeyDown}
        aria-describedby={isVisible ? tooltipId : undefined}
        tabIndex={content || suggestions.length > 0 ? 0 : undefined}
        role={content || suggestions.length > 0 ? 'button' : undefined}
        aria-label={
          suggestions.length > 0 
            ? `Misspelled word. Suggestions: ${suggestions.join(', ')}` 
            : content
        }
        aria-expanded={isVisible}
        aria-haspopup={suggestions.length > 0 ? 'listbox' : undefined}
      >
        {children}
      </span>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className="fixed z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg max-w-xs border border-gray-700"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
        >
          {/* Arrow pointing down */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          
          {content && (
            <div className="mb-2 last:mb-0">{content}</div>
          )}
          
          {suggestions.length > 0 && (
            <div>
              <div className="font-semibold mb-1">Suggestions:</div>
              <div 
                className="flex flex-wrap gap-1"
                role="listbox"
                aria-label="Spelling suggestions"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="px-2 py-1 text-sm rounded transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    style={{ 
                      backgroundColor: focusedSuggestionIndex === index ? '#1d4ed8' : '#2563eb',
                      color: 'white',
                      border: 'none'
                    }}
                    onMouseEnter={() => setFocusedSuggestionIndex(index)}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSuggestionClick) {
                        onSuggestionClick(suggestion);
                        setIsVisible(false);
                      }
                    }}
                    role="option"
                    aria-selected={focusedSuggestionIndex === index}
                    aria-label={`Replace with ${suggestion}`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Tooltip;
