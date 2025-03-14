
import { useState } from 'react';
import { VideoEffect } from '@/components/editor/Canvas';

export const useEffects = () => {
  const [effects, setEffects] = useState<VideoEffect[]>([]);

  return {
    effects,
    setEffects
  };
};
