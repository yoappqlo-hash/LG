import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Info,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lock,
  Heart,
  Award,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { lang } = useApp();
  const isAr = lang === 'ar';

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'كيف توفرون هذه الحسابات والأكواد مجاناً؟',
      qEn: 'How are these accounts and game keys provided for free?',
      a: 'نتعاون مع مطوري الألعاب، ونستفيد من العروض الترويجية والاشتراكات المؤسسية المدفوعة مسبقاً، ونقوم بتوزيعها على مجتمع اللاعبين بهدف تعزيز التفاعل ودعم اللاعبين العرب.',
      aEn: 'We partner with promotional sponsors, leverage prepaid enterprise developer trials, and distribute unredeemed gaming licenses to empower the gaming community.',
    },
    {
      q: 'هل الحسابات آمنة ومضمونة ضد الباند؟',
      qEn: 'Are the claimed accounts safe and ban-free?',
      a: 'نعم، جميع الحسابات يتم فحصها والتأكد من نظافة سجلها قبل طرحها في الدروب. ننصح المستخدمين بتغيير كلمة المرور وتفعيل المصادقة الثنائية (2FA) فور الاستلام لحمايتها بشكل دائم.',
      aEn: 'Yes, all accounts are checked before each drop. We advise users to change credentials and bind their own 2FA immediately after claiming.',
    },
    {
      q: 'كم عدد الحسابات التي يمكنني استلامها يومياً؟',
      qEn: 'How many accounts can I claim daily?',
      a: 'يحق لكل مستخدم مسجل بحساب جوجل استلام حساب واحد من كل دروب نشط، بالإضافة لفرص دوران عجلة الحظ اليومية، وذلك لضمان توزيع عادل لكافة الأعضاء.',
      aEn: 'Each verified Google user can claim 1 drop per category to ensure fair distribution for all members, plus daily Lucky Wheel spins.',
    },
    {
      q: 'كيف أشارك في السحوبات الكبرى؟',
      qEn: 'How do I enter the mega community giveaways?',
      a: 'كل ما عليك هو تسجيل الدخول بحسابك، والذهاب لصفحة السحوبات والضغط على زر "دخول السحب مجاناً". يتم السحب آلياً وبكل شفافية.',
      aEn: 'Simply sign in with Google, navigate to the Giveaways tab, and click "Enter Giveaway". Winners are selected via verified random seeds.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
          <Info className="w-3.5 h-3.5" />
          <span>{isAr ? 'عن المنصة ورسالتنا' : 'About ApexDrop Platform'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          {isAr ? 'من نحن وقصة انطلاق أبيكس دروب' : 'Our Mission & Legitimacy Story'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          {isAr
            ? 'المنصة الرائدة في العالم العربي لتقديم حسابات الألعاب وخدمات البث وسحوبات الجوائز اليومية بشفافية ومصداقية تامة.'
            : 'The premier community platform delivering verified gaming accounts, software licenses, and community giveaways.'}
        </p>
      </div>

      {/* Story & Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isAr ? 'أمان وموثوقية 100%' : '100% Verified Drops'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isAr
              ? 'كل حساب يتم اختباره وفحصه قبل النشر في الموقع لضمان عمله الكامل وسهولة تسجيل الدخول.'
              : 'Every single account drop is audited prior to deployment to ensure active licenses and pristine security.'}
          </p>
        </div>

        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isAr ? 'سحوبات وجوائز حقيقية' : 'Fair Transparent Draws'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isAr
              ? 'نظام سحب آلي بدون تدخل بشري يضمن تكافؤ الفرص لجميع المشاركين وإعلان أسماء الفائزين علناً.'
              : 'Automated cryptographic selection algorithms ensure zero bias and transparent winner announcements.'}
          </p>
        </div>

        <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isAr ? 'دعم مجتمع اللاعبين' : 'Community First'}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isAr
              ? 'هدفنا تمكين الجميع من تجربة أحدث ألعاب الكمبيوتر والخدمات الترفيهية بدون أي مقابل مادي.'
              : 'Empowering passionate gamers to access premier titles and streaming subscriptions without barriers.'}
          </p>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>{isAr ? 'إرشادات أمان الحسابات المستلمة:' : 'Security & Ownership Guidelines:'}</span>
        </div>

        <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              {isAr
                ? 'قم بتغيير كلمة المرور فور استلام بيانات الحساب وربط بريدك الإلكتروني الشخصي كبريد استرداد.'
                : 'Change password immediately upon receiving credentials and set your personal recovery email.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              {isAr
                ? 'فعّل التحقق بخطوتين (2FA) عبر تطبيقات مثل Google Authenticator أو Steam Guard.'
                : 'Enable Two-Factor Authentication (2FA) via Google Authenticator or mobile app.'}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              {isAr
                ? 'احفظ الأكواد والمفاتيح في ملفك الشخصي ولا تشاركها مع أي شخص آخر على الإنترنت.'
                : 'Keep your claimed keys securely stored in your personal profile and do not share with third parties.'}
            </span>
          </li>
        </ul>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-lg">
          <HelpCircle className="w-5 h-5 text-purple-400" />
          <span>{isAr ? 'الأسئلة الشائعة والأجوبة' : 'Frequently Asked Questions'}</span>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-start font-semibold text-xs sm:text-sm text-white flex items-center justify-between gap-4 hover:bg-slate-800/40 transition-colors"
                >
                  <span>{isAr ? faq.q : faq.qEn}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {isAr ? faq.a : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
