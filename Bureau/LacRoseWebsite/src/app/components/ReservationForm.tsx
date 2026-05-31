import React, { useState } from 'react';

const PACKAGES = [
  {
    label: 'Forfait Couple (2 personnes)',
    desc: '45 min Quad + Pirogue + Dromadaire',
    price: '25,000 FCFA',
  },
  {
    label: 'Forfait 20000',
    desc: '45 min Quad + Dromadaire + Pirogue',
    price: '20,000 FCFA',
  },
  {
    label: 'Forfait 25000',
    desc: 'Quad + Dromadaire ou Cheval + Pirogue + Repas + Piscine',
    price: '25,000 FCFA',
  },
  {
    label: '1 Heure Quad + Pirogue',
    desc: 'Circuit complet : 1 heure Quad + Pirogue',
    price: '17,000 FCFA',
  },
  {
    label: '45 Min Quad',
    desc: 'Pirogue offert',
    price: '15,000 FCFA',
  },
  {
    label: '30 Min Quad',
    desc: 'Découverte',
    price: '13,000 FCFA',
  },
];

export default function ReservationForm() {
  const [selected, setSelected] = useState(0);
  return (
    <form className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6 border-t-4 border-orange-500">
      <h2 className="text-2xl font-bold text-orange-600 text-center">Réservation de Quad</h2>
      <p className="text-center text-gray-500 text-sm mb-4">Explorez les circuits du Lac Rose avec YAYA QUAD</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input required className="input" placeholder="Votre nom complet" type="text" name="name" />
        <input required className="input" placeholder="Votre e-mail" type="email" name="email" />
        <input required className="input" placeholder="Votre numéro de téléphone" type="tel" name="phone" />
        <input required className="input" placeholder="jj/mm/aaaa" type="date" name="date" min="2026-05-21" />
      </div>
      <div>
        <label className="block font-semibold mb-2 text-orange-600">Choisissez un forfait</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {PACKAGES.map((p, i) => (
            <button
              type="button"
              key={p.label}
              onClick={() => setSelected(i)}
              className={`rounded-xl border-2 p-4 text-left shadow transition-all duration-150 ${selected === i ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'} hover:border-orange-400`}
            >
              <div className="font-semibold text-orange-600">{p.label}</div>
              <div className="text-xs text-gray-500 mb-2">{p.desc}</div>
              <div className="font-bold text-lg text-gray-800">{p.price}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input required className="input" placeholder="Nombre de participants" type="number" min="1" name="participants" />
        <textarea className="input" placeholder="Vos besoins ou remarques" name="comments" rows={2} />
      </div>
      <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-full mt-4 shadow transition-all">ENVOYER LA RÉSERVATION</button>
    </form>
  );
}

// Style utilitaire pour les inputs (à placer dans le CSS global ou tailwind.config.js)
// .input { @apply w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition; }
