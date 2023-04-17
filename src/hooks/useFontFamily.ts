import { useState, useEffect } from 'react';
import WebFont from 'webfontloader';

export const useFontFamily = () => {
  const [headingFont, setHeadingFont] = useState('Roboto');
  const [bodyFont, setBodyFont] = useState('Roboto');

  const loadFont = (font: string) => {
    WebFont.load({
      google: {
        families: [font],
      },
    });
  };

  useEffect(() => {
    loadFont(headingFont);
    loadFont(bodyFont);
  }, [headingFont, bodyFont]);

  return {
    headingFont,
    setHeadingFont,
    bodyFont,
    setBodyFont,
  };
};