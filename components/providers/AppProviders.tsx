'use client';

import React from 'react';
import { SimulationProvider } from '@/lib/simulation/simulationStore';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <SimulationProvider>{children}</SimulationProvider>;
};
