import React from 'react';
import type { Period } from '~/types/clock';
import { OFFSET } from './testing';

interface Props {
  period: Period;
}

const Block: React.FC<Props> = ({ period }) => {
  const { name, start, end } = period;

  const startTime = start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  const endTime = end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  // Todo: remove offset
  const now = new Date(Date.now() - OFFSET);
  const isCurrent = now >= start && now <= end;

  return (
    <>
      <div
        className={[
          // Layout
          'flex flex-col justify-between items-center',
          // Size — width uses calc() so inline style handles it
          'h-[45vh]',
          // Rotation & shape
          'rotate-25 rounded-[0.5vw]',
          // Spacing
          'py-[1vh] px-[0.2vw]',
          // Color
          isCurrent ? 'bg-[#ff1a1a]' : 'bg-[#7a0000]',
        ].join(' ')}
        style={{ width: 'calc((100% - 40 * 1vw) / 11)' }}
      >
        {/* End time sits at the top of the (rotated) bar */}
        <div className="text-[0.9vw] opacity-80 text-center">{endTime}</div>

        {/* Block name runs vertically */}
        <div
          className="text-[1.5vw] font-bold text-center my-auto rotate-180"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          {name}
        </div>

        {/* Start time sits at the bottom */}
        <div className="text-[0.9vw] opacity-80 text-center">{startTime}</div>
      </div>
    </>
  );
};

export default Block;
