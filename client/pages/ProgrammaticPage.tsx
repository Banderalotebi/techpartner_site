import React from 'react';
import { SEO } from '../components/admin/SEO';

interface ProgrammaticPageData {
  id: number;
  slug: string;
  targetKeyword: string;
  city: string;
  industry: string;
  h1Title: string;
  aiGeneratedContent: string;
  jsonLdSchema: object;
  createdAt: string;
}

interface Props {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonical?: string;
  noindex?: boolean;
  structuredData?: Record<string, any>;
  breadcrumbs?: Array<{ name: string; url: string }>;
}

const ProgrammaticPage: React.FC<Props> = ({ title, description, keywords, ogImage, ogType, canonical, noindex, structuredData, breadcrumbs }) => {
  return (
    <>
      <SEO
        title={title}
        description={description}
        keywords={keywords}
        ogImage={ogImage}
        ogType={ogType}
        canonical={canonical}
        noindex={noindex}
        structuredData={structuredData}
        breadcrumbs={breadcrumbs}
      />
      {/* rest of the page content */}
    </>
  );
};

export default ProgrammaticPage;
