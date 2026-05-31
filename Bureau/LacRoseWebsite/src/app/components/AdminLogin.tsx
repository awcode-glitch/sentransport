import { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';
import { verifyAdminCredentials } from '../../lib/auth';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (verifyAdminCredentials(username.trim(), password)) {
      onLogin();
    } else {
      setError('Identifiants incorrects. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-blue-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#ff2d7a] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#f97316] rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#ff2d7a] to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tableau de Bord Admin</h1>
          <p className="text-gray-600">Connectez-vous pour gérer les réservations</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom d'utilisateur
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff2d7a] focus:border-transparent"
                placeholder="Entrez votre nom d'utilisateur"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#ff2d7a] focus:border-transparent"
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#ff2d7a] to-pink-600 text-white font-medium hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            Se connecter
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-800">
            <strong>Démo:</strong> Utilisez "admin" / "admin123" pour vous connecter
          </p>
        </div>
      </div>
    </div>
  );
}
