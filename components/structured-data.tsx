export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Cod Coaching Teams",
    "url": "https://codcoachingteams.com",
    "logo": "https://codcoachingteams.com/logo.png",
    "description": "Plateforme de coaching d'équipes Call of Duty professionnelle",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "FR"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contact@codcoachingteams.com",
      "contactType": "customer service",
      "availableLanguage": ["French"]
    },
    "sameAs": [
      // Add your social media links here when available
    ],
    "offers": {
      "@type": "Offer",
      "description": "Services de coaching professionnel pour équipes Call of Duty",
      "availability": "https://schema.org/InStock"
    }
  };

  const webSiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Cod Coaching Teams",
    "url": "https://codcoachingteams.com",
    "description": "Plateforme de coaching d'équipes Call of Duty. Améliorez vos performances avec des stratégies professionnelles.",
    "inLanguage": "fr-FR",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://codcoachingteams.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteData) }}
      />
    </>
  );
}
