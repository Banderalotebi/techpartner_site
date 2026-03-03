import React from 'react';
import { SEO } from '../components/admin/SEO';

interface OrderDetails {
  orderId: string | null;
  chargeId: string | null;
  audio?: string;
  audioTitle?: string;
  audioDescription?: string;
  audioKeywords?: string[];
  audioOgImage?: string;
  audioOgType?: string;
  audioCanonical?: string;
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

const PaymentSuccessPage: React.FC<Props> = ({ title, description, keywords, ogImage, ogType, canonical, noindex, structuredData, breadcrumbs }) => {
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

export default PaymentSuccessPage;
