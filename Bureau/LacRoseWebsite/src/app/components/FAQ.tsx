import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export function FAQ() {
  const { tr } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-pink-100 text-[#ff2d7a] px-4 py-2 rounded-full text-sm font-medium mb-4">
            {tr.faq.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{tr.faq.title}</h2>
          <p className="text-xl text-gray-600">{tr.faq.subtitle}</p>
        </div>

        <div className="space-y-4">
          {tr.faq.items.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-pink-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-[#ff2d7a] flex-shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-600 leading-relaxed border-t border-gray-100 bg-pink-50/30">
                  <p className="pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
