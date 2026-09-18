'use client';

import React from 'react';
import MlmCommissionView from '@/components/admin/views/MlmCommissionView';
import { INITIAL_MLM_LEVELS } from '@/data/mockData';

export default function MlmPage() {
  return <MlmCommissionView levels={INITIAL_MLM_LEVELS} />;
}
