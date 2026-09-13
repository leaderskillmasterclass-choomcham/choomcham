import React from "react";

interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Global Schema for CHOOMCHAM HOUSE Organization & Service
export const CHOOMCHAM_GLOBAL_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://choomcham.pages.dev/#organization",
      "name": "บ้านชุ่มฉ่ำ CHOOMCHAM HOUSE",
      "alternateName": "Choomcham House",
      "url": "https://choomcham.pages.dev",
      "logo": "https://choomcham.pages.dev/logo.jpg",
      "description": "B2B People & Organizational Transformation Platform ช่วยคนและองค์กรเกิดใหม่จากข้างใน (Inner Transformation)",
      "sameAs": [
        "https://www.facebook.com/choomchamhouse",
        "https://lin.ee/choomcham"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "owner@choomcham.house",
        "availableLanguage": ["Thai", "English"]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://choomcham.pages.dev/#website",
      "url": "https://choomcham.pages.dev",
      "name": "บ้านชุ่มฉ่ำ CHOOMCHAM HOUSE",
      "publisher": {
        "@id": "https://choomcham.pages.dev/#organization"
      }
    },
    {
      "@type": "Service",
      "@id": "https://choomcham.pages.dev/#service-transformation",
      "serviceType": "Organizational Transformation & Culture Consulting",
      "provider": {
        "@id": "https://choomcham.pages.dev/#organization"
      },
      "name": "Zombie Organization Check™ & Choomcham Rebirth™ Programs",
      "description": "บริการตรวจประเมินสุขภาพองค์กร 7 มิติ และจัดกระบวนการ Transformation ปลุกพลังคน ฟื้นฟูทีม และเปลี่ยนผ่านผู้นำ",
      "areaServed": "TH",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Transformation Programs",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "REBORN PEOPLE - ปลุกพลังคนทำงานและฟื้นฟูภาวะหมดไฟ"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "ALIVE TEAM - สร้างทีมที่มีพลังและ Connection ข้ามสายงาน"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "REBORN LEADER - เปลี่ยนผู้นำจากข้างในสู่การเป็น Coach"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "LIVING ORGANIZATION - ออกแบบโครงสร้างและวัฒนธรรมองค์กรที่มีชีวิต"
            }
          }
        ]
      }
    }
  ]
};
