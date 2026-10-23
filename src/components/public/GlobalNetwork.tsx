import React from 'react';
import { useServer } from '../../context/ServerContext';
import { Globe, ShieldCheck, Zap, Lock, Server } from 'lucide-react';

export const GlobalNetwork: React.FC = () => {
  const { lang } = useServer();
  const isAr = lang === 'ar';

  const centers = [
    {
      city: 'Riyadh, KSA',
      cityAr: 'الرياض، السعودية',
      tier: 'Tier IV Certified',
      latency: '2ms Edge Latency',
      features: ['Direct Mena-IX Peering', 'Local Data Sovereignty', 'Hardware HSM Encryption'],
      featuresAr: ['ربط مباشر مع مقسم الإنترنت السعودي', 'سيادة كاملة على البيانات', 'تشفير عتادي بمستويات أمان بنكية'],
    },
    {
      city: 'Frankfurt, Germany',
      cityAr: 'فرانكفورت، ألمانيا',
      tier: 'Tier III+ ISO 27001',
      latency: '8ms EU Latency',
      features: ['DE-CIX Core Backbone', 'GDPR Strict Compliance', 'Green Hydro-powered'],
      featuresAr: ['ربط مباشر بمقسم فرانكفورت الدولي', 'امتثال كامل للائحة حماية البيانات GDPR', 'طاقة نظيفة ومستدامة بنسبة 100%'],
    },
    {
      city: 'Virginia, US',
      cityAr: 'فرجينيا، أمريكا',
      tier: 'Tier IV Hyperscale',
      latency: '14ms East-US',
      features: ['Subsea Fiber Landings', 'Dedicated NVMe Fabrics', 'DDoS 100Tbps Scrubbing'],
      featuresAr: ['بوابة كوابل بحرية فائقة السرعة', 'مصفوفات NVMe موزعة', 'محطات تنقية سحابية لسعة 100Tbps'],
    },
    {
      city: 'Singapore, SG',
      cityAr: 'سنغافورة',
      tier: 'Tier III+ Redundant',
      latency: '12ms APAC',
      features: ['Equinix SG1 Gateway', 'Zero Packet Loss SLA', 'Multi-homed BGP Routing'],
      featuresAr: ['بوابة اتصال مركزية لجنوب شرق آسيا', 'ضمان نقل الحزم بدون أي فقدان', 'توجيه شبكي متقدم BGP متعدد المسارات'],
    },
  ];

  return (
    <section id="network" className="py-16 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-400">
            <span>{isAr ? 'الانتشار الجغرافي' : 'Global Edge Fabric'}</span>
            <span aria-hidden="true">·</span>
            <span>{isAr ? 'مراكز بيانات فائقة الأمان' : 'Tier IV Certified'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {isAr ? 'مراكز بيانات عالمية موصولة بأسرع كوابل الألياف' : 'Low-Latency Enterprise Datacenters'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {isAr
              ? 'بنية تحتية موزعة تضمن استجابة فائقة السرعة وتواجد بياناتك بالقرب من عملائك مع التزام كامل بالمعايير الأمنية.'
              : 'Strategically located carrier-neutral facilities with redundant subsea backbones and instant automated failovers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {centers.map((c, i) => (
            <div
              key={i}
              className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                  <span>{c.tier}</span>
                  <span className="text-slate-400">{c.latency}</span>
                </div>

                <h3 className="text-base font-bold text-white mb-3">
                  {isAr ? c.cityAr : c.city}
                </h3>

                <ul className="space-y-2 text-xs text-slate-300">
                  {(isAr ? c.featuresAr : c.features).map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <span className="text-cyan-400 text-xs shrink-0 mt-0.5">•</span>
                      <span className="leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
