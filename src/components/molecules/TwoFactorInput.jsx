import { useRef, useEffect } from 'react';

/**
 * TwoFactorInput — Molécula (CU03)
 * 6 inputs individuales con auto-avance y soporte de pegado.
 */
export function TwoFactorInput({ value = '', onChange }) {
  const inputRefs = useRef([]);
  const digits = (value + '      ').slice(0, 6).split('');

  const handleChange = (index, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits.map(d => d.trim())];
    newDigits[index] = char;
    const newValue = newDigits.join('');
    onChange(newValue);
    // Avanza al siguiente input
    if (char && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      const newDigits = [...digits.map(d => d.trim())];
      if (!newDigits[index] && index > 0) {
        newDigits[index - 1] = '';
        onChange(newDigits.join(''));
        inputRefs.current[index - 1]?.focus();
      } else {
        newDigits[index] = '';
        onChange(newDigits.join(''));
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, ''));
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="flex gap-2 justify-center my-2" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i].trim()}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          className="
            w-11 h-14 text-center text-xl font-bold font-display
            bg-navy-light border-2 border-cyan/20 rounded-xl text-slate-body
            focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/20
            transition-all duration-150
          "
        />
      ))}
    </div>
  );
}
