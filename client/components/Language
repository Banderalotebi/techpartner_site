import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLocation } from "wouter";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Get current location from wouter
  const [location, setLocation] = useLocation();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (newLang: 'en' | 'ar') => {
    setIsOpen(false);

    // Change the language in state
    setLanguage(newLang);

    // Update HTML attributes for styling and fonts
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";

    // Calculate the new path with language prefix
    let newPath = location;
    
    // Remove existing language prefix if any
    if (location.startsWith('/en/') || location.startsWith('/ar/')) {
      newPath = '/' + location.split('/').slice(2).join('/');
    } else if (location === '/en' || location === '/ar') {
      newPath = '/';
    }
    
    // Add new language prefix
    if (newLang !== 'en') {
      newPath = `/${newLang}${newPath === '/' ? '' : newPath}`;
    }
    
    // Use wouter's setLocation to navigate (this triggers React re-render)
    setLocation(newPath);
  };

  return (
    <div
      ref={dropdownRef}
      className="relative"
      data-testid="language-switcher"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-gray-600 px-2 hover:text-[#01A1C1] hover:border-[#01A1C1] border border-transparent hover:border rounded-full transition-colors"
        title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
      >
        <Globe className="w-4 h-4" />
        <span className="text-xs font-medium">{language === 'en' ? 'EN' : 'عربي'}</span>
      </Button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-[9999] min-w-[120px] py-1"
          data-testid="language-dropdown"
        >
          <button
            onClick={() => handleLanguageChange('en')}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              language === 'en'
                ? "bg-[#01A1C1]/10 text-[#01A1C1] font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            data-testid="button-lang-en"
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange('ar')}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              language === 'ar'
                ? "bg-[#01A1C1]/10 text-[#01A1C1] font-medium"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            data-testid="button-lang-ar"
          >
            العربية
          </button>
        </div>
      )}
    </div>
  );
}
