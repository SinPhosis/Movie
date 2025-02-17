import React from 'react';

interface MoviePageProps {
  setStep: (step: number) => void;
}

export const MoviePage: React.FC<MoviePageProps> = ({ setStep }) => {
  return (
    <>
      <button onClick={() => setStep(1)}></button>
    </>
  );
};
