import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { NavBrand } from '@/components/molecules/NavBrand';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';

const QUESTIONS = [
  {
    id: 'goals',
    title: '¿Cuál es tu objetivo principal?',
    subtitle: 'Selecciona todas las que apliquen',
    multi: true,
    options: [
      { id: 'pc', label: 'Armar o actualizar mi PC', desc: 'Gaming o Workstation' },
      {
        id: 'infra',
        label: 'Equipamiento e Infraestructura',
        desc: 'Laboratorios, servidores y redes',
      },
      { id: 'mobile', label: 'Dispositivos portátiles', desc: 'Laptops, tablets y smartphones' },
      { id: 'smart', label: 'Automatización y Smart Home', desc: 'Domótica e IoT' },
      { id: 'parts', label: 'Repuestos y Componentes', desc: 'Para reparaciones específicas' },
    ],
  },
  {
    id: 'era',
    title: '¿Qué época tecnológica te atrae más?',
    subtitle: 'Elige tu preferencia principal',
    multi: false,
    options: [
      { id: 'new', label: 'Última Generación', desc: 'Lo más nuevo y potente del mercado' },
      {
        id: 'retro',
        label: 'Tecnología Retro',
        desc: 'Hardware clásico, consolas vintage y colección',
      },
      { id: 'used', label: 'Costo-Eficiencia (Usado)', desc: 'Equipos probados de segunda mano' },
      {
        id: 'dev',
        label: 'Prototipado e Ingeniería',
        desc: 'Raspberry Pi, Arduino, electrónica pura',
      },
    ],
  },
  {
    id: 'os',
    title: '¿Qué ecosistemas dominan tu entorno?',
    subtitle: 'Selecciona los que usas a diario',
    multi: true,
    options: [
      { id: 'windows', label: 'Windows', desc: 'Gaming y software comercial' },
      { id: 'linux', label: 'Linux', desc: 'Desarrollo, servidores, pentesting' },
      { id: 'mac', label: 'macOS / Apple', desc: 'Ecosistema de Apple' },
      { id: 'android', label: 'Android / IoT', desc: 'Móviles y dispositivos embebidos' },
    ],
  },
  {
    id: 'feed',
    title: '¿Qué quieres ver primero en tu muro?',
    subtitle: 'Prioridad de recomendaciones',
    multi: false,
    options: [
      { id: 'stores', label: 'Tiendas Verificadas', desc: 'Ofertas dinámicas de hardware nuevo' },
      { id: 'users', label: 'Usuarios Particulares', desc: 'Segunda mano con IMEI/Serie validado' },
      { id: 'lots', label: 'Lotes de Hardware', desc: 'Múltiples componentes para ensambles' },
      { id: 'deals', label: 'Remates y Gangas', desc: 'Ofertas rápidas por debajo del mercado' },
    ],
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({
    goals: [],
    era: [],
    os: [],
    feed: [],
  });
  const [loading, setLoading] = useState(false);

  const currentQ = QUESTIONS[step];

  const toggleOption = (optId) => {
    setAnswers((prev) => {
      const currentSelection = prev[currentQ.id];
      if (currentQ.multi) {
        if (currentSelection.includes(optId)) {
          return { ...prev, [currentQ.id]: currentSelection.filter((id) => id !== optId) };
        } else {
          return { ...prev, [currentQ.id]: [...currentSelection, optId] };
        }
      } else {
        return { ...prev, [currentQ.id]: [optId] };
      }
    });
  };

  const handleNext = async () => {
    if (answers[currentQ.id].length === 0) {
      toast.error('Por favor selecciona al menos una opción');
      return;
    }

    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      // Finalizar
      setLoading(true);
      // Aquí idealmente guardaríamos 'answers' en el campo 'preferences' de la tabla 'profiles'
      // await supabase.from('profiles').update({ preferences: answers }).eq('id', user.id);

      // Mock de carga
      setTimeout(() => {
        toast.success('¡Perfil configurado! Preparando tu tienda...');
        navigate('/profile');
      }, 1500);
    }
  };

  return (
    <div className="onboarding-page min-h-screen text-slate-body flex flex-col">
      {/* Header mini */}
      <div className="p-6 border-b border-cyan/10 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <NavBrand />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
          <button
            onClick={() => navigate('/profile')}
            className="text-sm font-medium text-slate-muted hover:text-cyan transition-colors"
          >
            Omitir por ahora
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center p-4 md:p-6 overflow-y-auto">
        <div className="w-full max-w-2xl my-auto flex flex-col items-center">
          {/* Progress */}
          <div className="w-full max-w-2xl flex gap-2 mb-8">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-cyan' : 'bg-navy-light border border-cyan/10'}`}
              />
            ))}
          </div>

          {/* Cuestionario */}
          <div className="glass-panel w-full max-w-2xl p-6 md:p-10 flex flex-col">
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-body mb-2">
                {currentQ.title}
              </h2>
              <p className="text-cyan text-sm font-bold">{currentQ.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id].includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    aria-pressed={isSelected}
                    onClick={() => toggleOption(opt.id)}
                    className={`flex flex-col text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-cyan bg-cyan/10 shadow-[0_0_15px_-3px_rgba(11,219,168,0.3)]'
                        : 'border-cyan/10 bg-navy hover:border-cyan/40 hover:bg-navy-lighter/30'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full mb-1.5 gap-2">
                      <span
                        className={`text-sm font-bold leading-tight ${isSelected ? 'text-cyan' : 'text-slate-body'}`}
                      >
                        {opt.label}
                      </span>
                      <div
                        className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-cyan bg-cyan' : 'border-slate-muted/50'
                        }`}
                      >
                        {isSelected && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-[0.7rem] text-slate-sub leading-relaxed">{opt.desc}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-cyan/10">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${step === 0 ? 'invisible' : 'text-slate-sub hover:text-white'}`}
              >
                Atrás
              </button>

              <button
                onClick={handleNext}
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? (
                  <>
                    Configurando IA{' '}
                    <div className="w-4 h-4 border-2 border-navy border-t-transparent rounded-full animate-spin" />
                  </>
                ) : step === QUESTIONS.length - 1 ? (
                  'Finalizar'
                ) : (
                  'Siguiente'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
