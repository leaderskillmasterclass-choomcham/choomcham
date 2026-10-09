import { Building2, Award, ShieldCheck } from "lucide-react";

export interface CustomerLogo {
  name: string;
  category: "Enterprise" | "StateEnterprise" | "EducationGov" | "Business";
  categoryLabel: string;
  url: string;
  description?: string;
}

export const CUSTOMER_LOGOS: CustomerLogo[] = [
  {
    name: "ท่าอากาศยานไทย (AOT)",
    category: "StateEnterprise",
    categoryLabel: "รัฐวิสาหกิจ & มหาชน",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/logo-customer/Airports_of_Thailand_Logo.svg.png",
    description: "บริษัท ท่าอากาศยานไทย จำกัด (มหาชน)"
  },
  {
    name: "การไฟฟ้าส่วนภูมิภาค (PEA)",
    category: "StateEnterprise",
    categoryLabel: "รัฐวิสาหกิจ",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/logo-customer/PEA.png",
    description: "การไฟฟ้าส่วนภูมิภาค (Provincial Electricity Authority)"
  },
  {
    name: "Central Food Retail (CFR)",
    category: "Enterprise",
    categoryLabel: "กลุ่มเซ็นทรัล รีเทล",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/logo-customer/central%20food%20retail%20(CFR).png",
    description: "Central Food Retail Group"
  },
  {
    name: "Land & Houses",
    category: "Enterprise",
    categoryLabel: "อสังหาริมทรัพย์ชั้นนำ",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/logo-customer/landandhouses.jpg",
    description: "บริษัท แลนด์แอนด์เฮ้าส์ จำกัด (มหาชน)"
  },
  {
    name: "Universal Robina (URC)",
    category: "Enterprise",
    categoryLabel: "FMCG ข้ามชาติ",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/logo-customer/Universal_Robina-Logo.wine.png",
    description: "Universal Robina Corporation (URC Thailand)"
  },
  {
    name: "มหาวิทยาลัยศรีนครินทรวิโรฒ (SWU)",
    category: "EducationGov",
    categoryLabel: "สถาบันการศึกษาชั้นนำ",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/logo-customer/SWU.png",
    description: "มหาวิทยาลัยศรีนครินทรวิโรฒ"
  },
  {
    name: "สำนักงาน ป.ป.ส. (ONCB)",
    category: "EducationGov",
    categoryLabel: "หน่วยงานภาครัฐ",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/logo-customer/oncb.go.th.png",
    description: "สำนักงานคณะกรรมการป้องกันและปราบปรามยาเสพติด"
  },
  {
    name: "SOOK by สสส.",
    category: "EducationGov",
    categoryLabel: "องค์กรสุขภาวะ",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/logo-customer/sook.png",
    description: "ศูนย์เรียนรู้สุขภาวะ สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.)"
  },
  {
    name: "9 Singha Broker",
    category: "Business",
    categoryLabel: "บริการการเงิน & โบรคเกอร์",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/logo-customer/9singhabroker.jpg",
    description: "9 Singha Insurance Broker"
  },
  {
    name: "Techsoft Holding",
    category: "Business",
    categoryLabel: "เทคโนโลยี & นวัตกรรม",
    url: "https://pub-52d5a8690c84469397e7f3027228203e.r2.dev/logo-customer/techsoft-holding.png",
    description: "Techsoft Holding Group"
  }
];

export function CustomerLogos() {
  return (
    <section id="clients" className="py-16 lg:py-24 px-6 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden border-b border-slate-100">
      {/* Background Accent Gradients */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-brand-purple/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-brand-pink/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-bold uppercase tracking-widest mb-4">
            <Building2 className="w-3.5 h-3.5" />
            <span>TRUSTED BY LEADING ORGANIZATIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            องค์กรชั้นนำที่ไว้วางใจให้เรา<br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-purple via-brand-pink to-brand-yellow bg-clip-text text-transparent">
              ร่วมพัฒนาคน ผู้นำ และวัฒนธรรมทีม
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            จากองค์กรภาครัฐ รัฐวิสาหกิจ บริษัทมหาชน สถาบันการศึกษา จนถึงกลุ่มธุรกิจชั้นนำ ที่ร่วมสร้างการเปลี่ยนแปลงจาก “ข้างใน” ไปสู่ผลลัพธ์ในการทำงานจริง
          </p>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
          {CUSTOMER_LOGOS.map((client) => (
            <div
              key={client.name}
              className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-purple/30 transition-all duration-300 flex flex-col items-center justify-center text-center hover:-translate-y-1"
            >
              {/* Logo Container */}
              <div className="w-full h-16 sm:h-20 flex items-center justify-center mb-3">
                <img
                  src={client.url}
                  alt={client.name}
                  loading="lazy"
                  className="max-h-12 sm:max-h-16 max-w-[85%] object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
              </div>

              {/* Client Info */}
              <div className="w-full pt-2 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-brand-purple transition-colors">
                  {client.name}
                </h3>
                <span className="text-[10px] text-slate-600 block mt-0.5">
                  {client.categoryLabel}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Key Metrics / Trust Bar */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-brand-purple block">100%</span>
            <span className="text-xs text-slate-600 font-medium mt-1 block">Tailor-Made Workshop</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-brand-pink block">5 Levels</span>
            <span className="text-xs text-slate-600 font-medium mt-1 block">Growth Transformation</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-brand-green block">Hands-on</span>
            <span className="text-xs text-slate-600 font-medium mt-1 block">Experiential Learning</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-brand-blue block">Real Impact</span>
            <span className="text-xs text-slate-600 font-medium mt-1 block">เปลี่ยนพฤติกรรมจริง</span>
          </div>
        </div>

      </div>
    </section>
  );
}
