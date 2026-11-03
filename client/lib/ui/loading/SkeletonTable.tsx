import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function SkeletonTable() {
  return (
    <SkeletonTheme baseColor="#cacaca" highlightColor="#8a8a8a">
      <div
        style={{
        //   width: '100%',
        //   overflowX: 'auto',
        //   border: '1px solid #e5e7eb',
          borderRadius: '8px',
        }}
      >
        <table
          style={{
            // width: '100%',
            // borderCollapse: 'collapse',
            tableLayout: 'fixed',
          }}
        >
          <thead>
            <tr>
              <th style={{  textAlign: 'left', padding: "5px" }}>
                <Skeleton width={30} height={25} />
              </th>

              <th style={{ textAlign: 'left' }}>
                <Skeleton width={150} />
              </th>

              {Array.from({ length: 5 }).map((_, index) => (
                <th key={index} style={{ textAlign: 'left', padding:16 }}>
                  <Skeleton width={150} />
                </th>
              ))}

              <th style={{ textAlign: 'left' }}>
                <Skeleton width={100} />
              </th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                style={{ borderTop: '1px solid #f1f1f1' }}
              >
                <td style={{ padding: "5px" }}>
                  <Skeleton width={30} height={25} />
                </td>

                <td style={{ }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Skeleton circle width={35} height={35} />
                    <Skeleton width={120} />
                  </div>
                </td>

                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <td key={colIndex} style={{ padding: '16px' }}>
                    <Skeleton width={150} />
                  </td>
                ))}

                <td style={{ }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {Array.from({ length: 3 }).map((_, actionIndex) => (
                      <Skeleton
                        key={actionIndex}
                        circle
                        width={25}
                        height={25}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SkeletonTheme>
  );
}