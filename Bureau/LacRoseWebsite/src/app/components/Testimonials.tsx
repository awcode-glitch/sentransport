import { Star, Quote } from 'lucide-react';
import { useBooking } from '../context/BookingContext';
import { useLanguage } from '../context/LanguageContext';
import { useCountUp } from '../hooks/useCountUp';

const testimonialsData = {
  fr: [
    { id: 1, name: 'Sophie Martin', location: 'Paris, France', rating: 5, date: 'Avril 2026', text: '"Une expérience absolument incroyable ! Le quad dans les dunes était palpitant et l\'équipe était très professionnelle."' },
    { id: 2, name: 'Jean Dupont',   location: 'Bruxelles, Belgique', rating: 5, date: 'Mars 2026', text: '"Le Lac Rose est magnifique et les activités sont parfaites pour toute la famille. Nos enfants ont adoré la balade à dromadaire !"' },
    { id: 3, name: 'Marie Koné',    location: "Abidjan, Côte d'Ivoire", rating: 5, date: 'Mai 2026', text: '"Service impeccable, paysages à couper le souffle. La balade en pirogue au coucher du soleil restera gravée dans ma mémoire."' },
  ],
  en: [
    { id: 1, name: 'Sophie Martin', location: 'Paris, France', rating: 5, date: 'April 2026', text: '"An absolutely incredible experience! Quad biking in the dunes was thrilling and the team was very professional."' },
    { id: 2, name: 'Jean Dupont',   location: 'Brussels, Belgium', rating: 5, date: 'March 2026', text: '"Pink Lake is beautiful and the activities are perfect for the whole family. Our kids loved the camel ride!"' },
    { id: 3, name: 'Marie Koné',    location: "Abidjan, Ivory Coast", rating: 5, date: 'May 2026', text: '"Impeccable service and breathtaking scenery. The pirogue ride at sunset will stay with me forever."' },
  ],
  ar: [
    { id: 1, name: 'Sophie Martin', location: 'باريس، فرنسا', rating: 5, date: 'أبريل 2026', text: '"تجربة رائعة للغاية! كانت الدراجة الرباعية في الكثبان الرملية مثيرة والفريق احترافي جداً."' },
    { id: 2, name: 'Jean Dupont',   location: 'بروكسل، بلجيكا', rating: 5, date: 'مارس 2026', text: '"البحيرة الوردية خلابة والأنشطة مثالية للعائلة بأكملها. أحب أطفالنا جولة الجمل كثيراً!"' },
    { id: 3, name: 'Marie Koné',    location: 'أبيدجان، ساحل العاج', rating: 5, date: 'مايو 2026', text: '"خدمة ممتازة ومناظر رائعة. جولة القارب عند غروب الشمس ستبقى في ذاكرتي إلى الأبد."' },
  ],
  zh: [
    { id: 1, name: 'Sophie Martin', location: '法国巴黎', rating: 5, date: '2026年4月', text: '"绝对令人难忘的体验！沙丘上的越野车之旅令人心跳加速，团队非常专业。"' },
    { id: 2, name: 'Jean Dupont',   location: '比利时布鲁塞尔', rating: 5, date: '2026年3月', text: '"粉红湖美丽壮观，活动非常适合全家一起参与。孩子们特别喜欢骑骆驼！"' },
    { id: 3, name: 'Marie Koné',    location: '科特迪瓦阿比让', rating: 5, date: '2026年5月', text: '"服务无可挑剔，风景令人叹为观止。日落时分的独木舟之旅将永远留在我的记忆中。"' },
  ],
};

export function Testimonials() {
  const { bookings } = useBooking();
  const { tr, lang } = useLanguage();

  const confirmedCount = bookings.filter((b) => b.paymentStatus === 'confirmed').length;
  const clientTarget = confirmedCount > 0 ? confirmedCount : 500;
  const testimonials = testimonialsData[lang];

  const { count: clientsCount, ref: clientsRef } = useCountUp(clientTarget);
  const { count: ratingCount, ref: ratingRef } = useCountUp(49, 1500);
  const { count: recommendCount, ref: recommendRef } = useCountUp(100);

  return (
    <section id="temoignages" className="py-24 bg-gradient-to-br from-gray-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-orange-100 text-[#f97316] px-4 py-2 rounded-full text-sm font-medium mb-4">
            {tr.testimonials.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{tr.testimonials.title}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{tr.testimonials.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#ff2d7a] to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-white" />
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">{item.text}</p>
              <div className="border-t border-gray-100 pt-4">
                <div className="font-semibold text-gray-900">{item.name}</div>
                <div className="text-sm text-gray-500">{item.location}</div>
                <div className="text-xs text-gray-400 mt-1">{item.date}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 bg-white rounded-2xl px-8 py-6 shadow-lg">
            <div className="text-center" ref={clientsRef}>
              <div className="text-4xl font-bold text-[#ff2d7a]">
                {clientsCount}+
              </div>
              <div className="text-sm text-gray-600">{tr.testimonials.satisfied}</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center" ref={ratingRef}>
              <div className="text-4xl font-bold text-[#f97316]">
                {(ratingCount / 10).toFixed(1)}/5
              </div>
              <div className="text-sm text-gray-600">{tr.testimonials.avgRating}</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center" ref={recommendRef}>
              <div className="text-4xl font-bold text-blue-600">
                {recommendCount}%
              </div>
              <div className="text-sm text-gray-600">{tr.testimonials.recommended}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
