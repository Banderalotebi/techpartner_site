import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Order {
  id: string;
  amount: number;
  status: string;
  service: string;
  createdAt: string;
  paidAt: string | null;
  tapId: string | null;
  user: {
    email: string;
  };
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

const AdminOrdersPage: React.FC<Props> = ({ title, description, keywords, ogImage, ogType, canonical, noindex, structuredData, breadcrumbs }) => {
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

export default AdminOrdersPage;
