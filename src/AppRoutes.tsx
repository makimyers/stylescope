import React from 'react';
import { Route, Routes } from 'react-router-dom';
import StyleScope from './StyleScope';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<StyleScope />} />
      <Route path="/:docId" element={<StyleScope />} />
    </Routes>
  );
};

export default AppRoutes;