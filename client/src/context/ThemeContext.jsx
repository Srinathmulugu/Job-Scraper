import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [accentColor, setAccentColor] = useState('#0d6efd'); // Default Bootstrap primary
  const [textContrastClass, setTextContrastClass] = useState('text-light');

  // Calculate contrast dynamically (YIQ formula)
  useEffect(() => {
    const getContrastYIQ = (hexcolor) => {
      hexcolor = hexcolor.replace('#', '');
      if (hexcolor.length === 3) {
        hexcolor = hexcolor.split('').map(c => c + c).join('');
      }
      const r = parseInt(hexcolor.substr(0, 2), 16);
      const g = parseInt(hexcolor.substr(2, 2), 16);
      const b = parseInt(hexcolor.substr(4, 2), 16);
      const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return yiq >= 128 ? 'text-dark' : 'text-light';
    };

    if (accentColor) {
      setTextContrastClass(getContrastYIQ(accentColor));
    }
  }, [accentColor]);

  return (
    <ThemeContext.Provider value={{ accentColor, setAccentColor, textContrastClass }}>
      {children}
    </ThemeContext.Provider>
  );
};
