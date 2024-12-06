import React, { type ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';

interface StaticCircleProps {
  percent?: number;
}
export const StaticCircle = ({ percent = 0 }: StaticCircleProps): ReactElement => {
  const [percentage, setPercentage] = useState(percent);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercentage(prev => {
        if (prev < percent) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return percent;
        }
      });
    }, 30);
  }, [percent]);

  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <CircularContainer size={150}>
      <ProgressText>{percentage}%</ProgressText>
      <SVG viewBox="0 0 36 36">
        <CircleBG
          d={`M18 18
            m -${radius}, 0
            a ${radius},${radius} 0 1,1 ${radius * 2},0
            a ${radius},${radius} 0 1,1 -${radius * 2},0`}
        />
        <Circle
          d={`M18 18
            m -${radius}, 0
            a ${radius},${radius} 0 1,1 ${radius * 2},0
            a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
        />
      </SVG>
    </CircularContainer>
  );
};

const CircularContainer = styled.div<{ size: number }>`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;

const SVG = styled.svg`
  transform: rotate(90deg);
  width: 100%;
  height: 100%;
`;

const CircleBG = styled.path`
  fill: none;
  stroke: #2f2f2f;
  stroke-width: 3.8;
`;

const Circle = styled.path`
  fill: none;
  stroke-width: 3.8;
  stroke: #4082bc;
  stroke-linecap: butt;
  transition: stroke-dasharray 0.6s ease;
`;

const ProgressText = styled.span`
  position: absolute;
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 2.5rem;
  color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
