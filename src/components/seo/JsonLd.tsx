export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "SevaKarya",
    alternateName: "SevaKarya Foundation",
    url: "https://www.sevakarya.com",
    logo: "https://www.sevakarya.com/opengraph-image",
    description:
      "SevaKarya connects donors with verified schools, shelters, and community NGOs across India to give pre-owned clothes, books, shoes, and toys a second life.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "No. 42, 3rd Floor, 80 Feet Road, 4th Block, Koramangala",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      postalCode: "560034",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-80-4711-2200",
      contactType: "customer support",
      email: "help@sevakarya.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi", "Kannada"],
    },
    sameAs: ["https://twitter.com/sevakarya", "https://instagram.com/sevakarya"],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SevaKarya",
    url: "https://www.sevakarya.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.sevakarya.com/faq?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
