"use client"

import React from 'react'
import styles from '@/styles/lib/ui/dashboard/main/overview.module.scss'
import { TbArrowUp, TbTrendingUp, TbMapPinExclamation } from 'react-icons/tb';
import { format } from 'date-fns';

//components
import Text from '@/components/Typography/Text/text';
import TitleWrapper from '../../titleWrapper';
import Title from '@/components/Typography/Title/title';

//
import SurveillanceMap from '../../home/map';
import Template from '../../template';

export default function Overview() {
  return (
    <Template
      title='Overview'
      description='Get a comprehensive overview of the HIV/AIDS situation in the Philippines, including key metrics, trends, and insights to inform your advocacy efforts.'
    >
      <div className={styles.col1}>
        {[
          { title: 'Total Mentions', value: '395' },
          { title: 'Overall Sentiments', value: '1,234' },
          { title: 'Misinformation', value: '567' },
          { title: 'Trending Topics', value: '89' },
          ].map(({title, value}, index) => (
            <div className={styles.col1_card} key={index}>
              <div className={styles.header}>
                <div className={styles.iconChart}>
                  <TbMapPinExclamation size={32} />
                </div>
                <div className={styles.header_col1}>
                  <Title size="md">{title}</Title>
                  <Text size="lg" weight="bold">{value}</Text>
                </div>
              </div>
              <div className={styles.footer}>
                <Text size="sm">+15% vs Last Period</Text>
                <span>Last updated: {format(new Date("2024-06-01"), "MMM dd, yyyy")}</span>
              </div>
            </div>
        ))}
      </div>
      <TitleWrapper title="Hot Topics"/>
        <div className={styles.col2}>
        {[
          { title: "#HIVAwareness", value: "+101%", descrption: "" },
          { title: "#HIVPrevention", value: "+88%" },
          { title: "#HIVTesting", value: "+56%" },
          { title: "#HIVStigma", value: "+47%" },
        ].map(({title, value}, index) => (
            <div className={styles.col2_card} key={index}>
              <div className={styles.iconChart}>
                <TbTrendingUp size={23} />
              </div>
              <div>
                <Title size="md">{title}</Title>
                <div className={styles.footer}>
                  <TbArrowUp size={18} />
                  <Text size="lg" weight="bold">{value}</Text>
                </div>
              </div>
            </div>
        ))}
          </div>
        <TitleWrapper title="Key Metrics"/>
        <div className={styles.col3}>
        {[
            { total: "140K", title: "Post analyzed", description: "Geospatial Sample", percentage: "+12.4%"}, 
            { total: "24", title: "High Risk Zones", description: "Geospatial Sample", percentage: "+12.4%"}, 
            { total: "91.40%", title: "NLP Accuracy", description: "Geospatial Sample", percentage: "+12.4%"}, 
            { total: "3,120", title: "Testing Referral", description: "Geospatial Sample", percentage: "+12.4%"}
        ].map((node, index) => (
            <div className={styles.col3_card} key={index}>
              <div className={styles.header}>
                <div className={styles.iconChart}>
                  <TbTrendingUp  size={52} />
                </div>
                <div className={styles.percentage}>
                  <TbArrowUp size={18} />
                  <Text size="sm" weight="bold">{node.percentage}</Text>
                </div>
              </div>
              <div className={styles.footer}>
                <Title size="lg">{node.total}</Title>
                <Text size="sm">{node.title}</Text>
                <Text size="sm">{node.description}</Text>
               
              </div>
            </div>
        ))}
        </div>
        <TitleWrapper title="Geospatial Intelligence"/>
        <SurveillanceMap />
        <TitleWrapper title="Barangay Intelligence"/>
    </Template>
  )
}
