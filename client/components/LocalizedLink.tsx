import { Link, useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedPath, isExternalUrl } from '@/lib/language';
import { ReactNode, MouseEvent } from 'react';

interface LocalizedLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

/**
 * A wrapper around wouter's Link that automatically adds the /ar prefix
 * when in Arabic mode. This ensures internal navigation preserves the
 * language context.
 */
export function LocalizedLink({ to, children, className, onClick }: LocalizedLinkProps) {
  const { language } = useLanguage();
  const [location] = useLocation();
  
  // Don't modify external URLs
  if (isExternalUrl(to)) {
    return (
      <a href={to} className={className} onClick={onClick} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  
  // Get the localized path based on current language
  const localizedPath = getLocalizedPath(to, language);
  
  return (
    <Link href={localizedPath} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

export default LocalizedLink;

