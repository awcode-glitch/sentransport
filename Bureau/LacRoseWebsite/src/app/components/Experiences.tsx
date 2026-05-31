import { memo } from 'react';
import { CheckCircle, Star, Zap } from 'lucide-react';
import img3 from '../../imports/image-3.png';
import img5 from '../../imports/image-5.png';
import img7 from '../../imports/image-7.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

const packs = [
  {
    id: 1,
    title: 'Pack Découverte',
    subtitle: 'L\'essentiel du Lac Rose',
    image: img3,
    color: 'from-[#ff2d7a] to-pink-600',
    bgLight: 'from-pink-50 to-pink-100',
    borderColor: 'border-pink-300',
    price: '24 500',
    icon: Star,
    items: [
      { label: 'Transport Aller/Retour', optional: false },
      { label: 'Balade en Quad', optional: false },
      { label: 'Balade en Pirogue', optional: false },
      { label: 'Balade en Cheval ou Dromadaire', optional: true },
      { label: 'Déjeuner à l\'Hôtel', optional: true },
      { label: 'Détente en Piscine', optional: false },
    ],
  },
  {
    id: 2,
    title: 'Pack Premium',
    subtitle: 'L\'expérience complète',
    image: img5,
    color: 'from-[#f97316] to-orange-600',
    bgLight: 'from-orange-50 to-orange-100',
    borderColor: 'border-orange-300',
    price: '25 000',
    icon: Zap,
    badge: 'Populaire',
    items: [
      { label: 'Transport Aller/Retour', optional: false },
      { label: 'Balade en Quad', optional: false },
      { label: 'Balade en Pirogue', optional: false },
      { label: 'Déjeuner à l\'Hôtel', optional: false },
      { label: 'Détente en Piscine', optional: false },
    ],
  },
  {
    id: 3,
    title: 'Pack Spécial',
    subtitle: 'Adrénaline & Liberté',
    image: img7,
    color: 'from-amber-500 to-yellow-600',
    bgLight: 'from-amber-50 to-yellow-100',
    borderColor: 'border-amber-300',
    price: '20 000',
    icon: Star,
    items: [
      { label: 'Balade en Quad — 1h', optional: false },
      { label: 'Balade en Pirogue — 30mn', optional: false },
      { label: 'Balade à Cheval ou Dromadaire — 15mn', optional: false },
    ],
  },
];

function ExperiencesComponent() {
  return (
    <section id="experiences" className="py-24 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block bg-pink-100 text-[#ff2d7a] px-4 py-2 rounded-full text-sm font-medium mb-4">
            Nos Packs
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choisissez votre Expérience
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Des forfaits tout inclus pour vivre le Lac Rose à votre rythme
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className={`relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 ${pack.borderColor}`}
            >
              {pack.badge && (
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#f97316] to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                  {pack.badge}
                </div>
              )}

              <div className="relative h-52 overflow-hidden">
                <ImageWithFallback
                  src={pack.image}
                  alt={pack.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${pack.color} opacity-50`} />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold">{pack.title}</h3>
                  <p className="text-sm opacity-90">{pack.subtitle}</p>
                </div>
              </div>

              <div className={`flex-1 flex flex-col p-6 bg-gradient-to-b ${pack.bgLight}`}>
                <ul className="space-y-3 flex-1 mb-6">
                  {pack.items.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${item.optional ? 'text-gray-400' : 'text-green-500'}`} />
                      <span className={`text-sm ${item.optional ? 'text-gray-400 italic' : 'text-gray-700 font-medium'}`}>
                        {item.label}
                        {item.optional && <span className="ml-1 text-xs">(en option)</span>}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-end justify-between mb-4">
                    <span className="text-gray-500 text-sm">Prix par personne</span>
                    <div className="text-right">
                      <span className={`text-3xl font-extrabold bg-gradient-to-r ${pack.color} bg-clip-text text-transparent`}>
                        {pack.price}
                      </span>
                      <span className="text-gray-500 text-sm ml-1">FCFA</span>
                    </div>
                  </div>
                  <a
                    href="#contact"
                    className={`block w-full py-3 rounded-full bg-gradient-to-r ${pack.color} text-white font-semibold text-center hover:shadow-lg transition-all`}
                  >
                    Réserver ce pack
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const Experiences = memo(ExperiencesComponent);
