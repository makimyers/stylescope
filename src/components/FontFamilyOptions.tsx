import React from 'react';

interface FontOptionsProps {
  headingFont: string;
  bodyFont: string;
  setHeadingFont: (font: string) => void;
  setBodyFont: (font: string) => void;
  googleFonts: Array<{ name: string; value: string }>;
}

const FontOptions: React.FC<FontOptionsProps> = ({
  headingFont,
  bodyFont,
  setHeadingFont,
  setBodyFont,
  googleFonts,
}) => {
  const renderFontOptions = () => {
    return googleFonts.map((font) => (
      <option key={font.value} value={font.value}>
        {font.name}
      </option>
    ));
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <label htmlFor="headingFont">Heading font</label>
        <select
          id="headingFont"
          className="select"
          value={headingFont}
          onChange={(e) => setHeadingFont(e.target.value)}
        >
          {renderFontOptions()}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="textFont">Body font</label>
        <select id="headingFont"
          className="select" value={bodyFont} onChange={(e) => setBodyFont(e.target.value)}>
          {renderFontOptions()}
        </select>
      </div>

    </>
  );
};

export default FontOptions;