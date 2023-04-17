type TextSizeKey = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' | 'text-2xl';

const generateFontFamilyStyle = (
  fontSize: Record<TextSizeKey, { mobile: number; desktop: number }>,
  lineHeight: Record<TextSizeKey, { mobile: number; desktop: number }>,
  fontSizeKey: TextSizeKey,
  lineHeightKey: TextSizeKey,
  fontFamily: string,
) => {
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  return {
    fontSize: `${isMobile ? fontSize[fontSizeKey].mobile : fontSize[fontSizeKey].desktop}px`,
    lineHeight: isMobile ? lineHeight[lineHeightKey].mobile : lineHeight[lineHeightKey].desktop,
    fontFamily: fontFamily,
  };
};

export default generateFontFamilyStyle;