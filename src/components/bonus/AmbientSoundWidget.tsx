import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Slider } from '../ui/Slider';
import { proceduralSoundEngine } from '../../lib/sound';
import { Volume2, VolumeX, CloudRain, Wind } from 'lucide-react';

export const AmbientSoundWidget: React.FC = () => {
  const [rainVol, setRainVol] = useState(0);
  const [noiseVol, setNoiseVol] = useState(0);

  const handleRainChange = (val: number) => {
    setRainVol(val);
    proceduralSoundEngine.setRainVolume(val / 100);
  };

  const handleNoiseChange = (val: number) => {
    setNoiseVol(val);
    proceduralSoundEngine.setWhiteNoiseVolume(val / 100);
  };

  const handleMuteAll = () => {
    setRainVol(0);
    setNoiseVol(0);
    proceduralSoundEngine.stopAll();
  };

  const isPlaying = rainVol > 0 || noiseVol > 0;

  return (
    <Card
      title="Ambient Sounds"
      icon={<Volume2 className="w-4 h-4 text-[#111111]" />}
      headerColor="bg-[#4D96FF]"
      className="w-full"
      bodyClassName="p-3"
      headerAction={
        isPlaying && (
          <button
            onClick={handleMuteAll}
            className="p-1 hover:bg-black/10 transition-colors"
            title="Mute all sounds"
          >
            <VolumeX className="w-3.5 h-3.5 text-[#111111]" />
          </button>
        )
      }
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <CloudRain className="w-4 h-4 text-[#4D96FF] shrink-0" />
          <Slider
            label="Gentle Rain"
            value={rainVol}
            min={0}
            max={100}
            unit="%"
            onChange={handleRainChange}
            className="flex-1"
          />
        </div>

        <div className="flex items-center gap-3">
          <Wind className="w-4 h-4 text-[#B983FF] shrink-0" />
          <Slider
            label="White Noise"
            value={noiseVol}
            min={0}
            max={100}
            unit="%"
            onChange={handleNoiseChange}
            className="flex-1"
          />
        </div>
      </div>
    </Card>
  );
};
