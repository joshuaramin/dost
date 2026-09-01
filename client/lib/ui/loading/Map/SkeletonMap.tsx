import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function SkeletonMap() {
  return (
    <SkeletonTheme
     baseColor="#cacaca" highlightColor="#8a8a8a"
      borderRadius={12}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 700,
          aspectRatio: '1 / 1',
          position: 'relative',
        }}
      >
        <Skeleton
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
          }}
        />
      </div>
    </SkeletonTheme>
  );
}