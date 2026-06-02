import React from 'react'
import Template from '../../template';
import TitleWrapper from '../../titleWrapper';

export default function Overview() {
  return (
    <Template
    
      title='Overview' >
        <TitleWrapper title="Hot Topics"/>
        {Array.from({length: 4}).map((nonde, index) => (
            <div key={index}></div>
        ))}
        <TitleWrapper title="Key Metrics"/>
        {Array.from({length: 4}).map((node, index) => (
            <div key={index}></div>
        ))}
        <TitleWrapper title="Geospatial Intelligence"/>
        <TitleWrapper title="Barangay Intelligence"/>
    </Template>
  )
}
