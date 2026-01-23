import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  type?: 'website' | 'article';
  image?: string;
  noIndex?: boolean;
}

const SITE_NAME = 'Care Matters Hub';
const BASE_URL = 'https://caremattershub.com.au';
const DEFAULT_IMAGE = `${BASE_URL}/favicon.jpg`;

export const SEO = ({
  title,
  description,
  canonical,
  type = 'website',
  image = DEFAULT_IMAGE,
  noIndex = false,
}: SEOProps) => {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_AU" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

// JSON-LD Structured Data Components
export const OrganizationSchema = () => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Care Matters Hub',
        url: BASE_URL,
        logo: `${BASE_URL}/favicon.jpg`,
        description: 'Professional NDIS healthcare and support services across Melbourne, Australia.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Melbourne',
          addressRegion: 'VIC',
          addressCountry: 'AU',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+61-452-030-000',
            contactType: 'customer service',
            areaServed: 'AU',
            availableLanguage: 'English',
          },
          {
            '@type': 'ContactPoint',
            telephone: '+61-469-786-104',
            contactType: 'customer service',
            areaServed: 'AU',
            availableLanguage: 'English',
          },
        ],
        sameAs: [
          'https://www.facebook.com/share/1ANDupBcrf/',
          'https://www.instagram.com/caremattershub',
        ],
      })}
    </script>
  </Helmet>
);

export const LocalBusinessSchema = () => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${BASE_URL}/#localbusiness`,
        name: 'Care Matters Hub',
        image: `${BASE_URL}/favicon.jpg`,
        url: BASE_URL,
        telephone: ['+61-452-030-000', '+61-469-786-104'],
        email: ['sunil@caremattershub.com.au', 'shubh@caremattershub.com.au'],
        description: 'Registered NDIS provider offering disability support, personal care, community nursing, and independent living services in Melbourne.',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Melbourne',
          addressRegion: 'VIC',
          addressCountry: 'AU',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -37.8136,
          longitude: 144.9631,
        },
        areaServed: {
          '@type': 'State',
          name: 'Victoria',
        },
        priceRange: '$$',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '17:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '09:00',
            closes: '16:00',
          },
        ],
      })}
    </script>
  </Helmet>
);

export const WebsiteSchema = () => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Care Matters Hub',
        url: BASE_URL,
        description: 'Trusted NDIS healthcare and support services provider in Melbourne, Australia.',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${BASE_URL}/?s={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      })}
    </script>
  </Helmet>
);

interface BreadcrumbItem {
  name: string;
  url: string;
}

export const BreadcrumbSchema = ({ items }: { items: BreadcrumbItem[] }) => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${BASE_URL}${item.url}`,
        })),
      })}
    </script>
  </Helmet>
);

export const FAQSchema = ({ faqs }: { faqs: { question: string; answer: string }[] }) => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      })}
    </script>
  </Helmet>
);

export const ServiceSchema = ({ services }: { services: { name: string; description: string }[] }) => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'HealthAndBeautyBusiness',
        name: 'Care Matters Hub',
        url: BASE_URL,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'NDIS Support Services',
          itemListElement: services.map((service) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: service.name,
              description: service.description,
            },
          })),
        },
      })}
    </script>
  </Helmet>
);

export default SEO;
