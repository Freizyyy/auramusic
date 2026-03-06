import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Music, Mail, Lock, User, AlertCircle } from 'lucide-react';

export function AuthScreen() {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error('Пожалуйста, заполните все поля');
      }
      if (!isLogin && !name) {
        throw new Error('Пожалуйста, введите имя');
      }
      
      await login(email, isLogin ? undefined : name);
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || 'Произошла ошибка при авторизации');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-elevated p-8 rounded-2xl shadow-xl border border-border-subdued">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4 shadow-lg shadow-accent/20">
            <Music className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-text-base">
            {isLogin ? 'С возвращением' : 'Создать аккаунт'}
          </h1>
          <p className="text-text-subdued mt-2 text-center">
            {isLogin 
              ? 'Войдите, чтобы продолжить слушать любимую музыку' 
              : 'Присоединяйтесь к нам и откройте мир музыки'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 text-red-500">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-text-subdued mb-1">Имя</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-icon-subdued" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-border-subdued rounded-xl bg-bg-base text-text-base placeholder-text-subdued focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  placeholder="Ваше имя"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-subdued mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-icon-subdued" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-border-subdued rounded-xl bg-bg-base text-text-base placeholder-text-subdued focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-subdued mb-1">Пароль</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-icon-subdued" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-border-subdued rounded-xl bg-bg-base text-text-base placeholder-text-subdued focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-black font-bold py-3 px-4 rounded-xl hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-6 disabled:opacity-70 disabled:hover:scale-100"
          >
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-sm text-text-subdued hover:text-text-base transition-colors"
          >
            {isLogin 
              ? 'Нет аккаунта? Зарегистрируйтесь' 
              : 'Уже есть аккаунт? Войдите'}
          </button>
        </div>
      </div>
    </div>
  );
}
