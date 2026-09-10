import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionLabel } from '@/components/atoms/SectionLabel';
import { Button } from '@/components/atoms/Button';
import { ContactInfoItem } from '@/components/molecules/ContactInfoItem';

const CONTACT_ITEMS = [
  {
    label: 'Correo',
    value: 'hola@techmatch.bo',
    href:  'mailto:hola@techmatch.bo',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    label: 'WhatsApp',
    value: '+591 7123-4567',
    href:  'https://wa.me/59171234567',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    label: 'Horario',
    value: 'Lunes a Viernes, 8:00 — 18:00',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
      </svg>
    ),
  },
];

const TOPICS = [
  'Crear mi cuenta',
  'Información sobre Tech Pro',
  'Propuesta de inversión',
  'Soporte técnico',
  'Prensa o medios',
  'Otro',
];

/** Estados del formulario */
const FORM_STATUS = { IDLE: 'idle', SENDING: 'sending', SUCCESS: 'success' };

/**
 * ContactSection — Organismo
 * Formulario de contacto con estado declarativo React.
 * Reemplaza la función submitForm() del script.js legacy.
 */
export function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', topic: '', message: '' });
  const [status, setStatus]     = useState(FORM_STATUS.IDLE);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(FORM_STATUS.SENDING);
    // Simulación de envío (reemplazar por llamada a API real)
    setTimeout(() => {
      setStatus(FORM_STATUS.SUCCESS);
      setFormData({ name: '', email: '', topic: '', message: '' });
      setTimeout(() => setStatus(FORM_STATUS.IDLE), 5000);
    }, 1400);
  };

  const inputClass = `
    w-full bg-navy border border-cyan/15 rounded-xl px-4 py-3
    text-sm text-slate-body placeholder-slate-muted
    focus:outline-none focus:border-cyan/50 focus:ring-1 focus:ring-cyan/20
    transition-colors duration-150
  `;

  return (
    <section id="contact" className="min-h-screen flex flex-col justify-center py-16 bg-navy">
      <div className="max-w-[1080px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">

          {/* ── Left ── */}
          <div>
            <SectionLabel>Contacto</SectionLabel>
            <h2 className="font-display text-[clamp(1.9rem,4vw,2.7rem)] font-extrabold text-slate-body tracking-tight mb-4">
              Hablemos
            </h2>
            <p className="text-base text-slate-sub leading-relaxed mb-10">
              ¿Tenés una consulta, querés ser parte del equipo o simplemente querés saber más? Escribinos.
            </p>
            <div className="flex flex-col gap-6">
              {CONTACT_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                >
                  <ContactInfoItem {...item} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right — Form ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="bg-navy-light border border-cyan/10 rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} noValidate>
              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-slate-muted font-semibold block mb-1.5">Nombre completo</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-muted font-semibold block mb-1.5">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@correo.com"
                    required
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Topic */}
              <div className="mb-4">
                <label className="text-sm text-slate-muted font-semibold block mb-1.5">Asunto</label>
                <select
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none`}
                >
                  <option value="">Seleccioná un asunto</option>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Message */}
              <div className="mb-6">
                <label className="text-sm text-slate-muted font-semibold block mb-1.5">Mensaje</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Contanos en qué podemos ayudarte..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Submit + Success */}
              <AnimatePresence mode="wait">
                {status === FORM_STATUS.SUCCESS ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 bg-brand-green/10 border border-brand-green/25 rounded-xl p-4 text-sm text-brand-green font-semibold"
                  >
                    <span className="text-lg">✓</span>
                    Mensaje enviado. Te respondemos en menos de 24 horas.
                  </motion.div>
                ) : (
                  <motion.div key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Button
                      type="submit"
                      variant="cyan"
                      disabled={status === FORM_STATUS.SENDING}
                      magnetic={false}
                      className="w-full justify-center py-3.5"
                    >
                      {status === FORM_STATUS.SENDING ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                          </svg>
                          Enviando...
                        </span>
                      ) : 'Enviar mensaje'}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
