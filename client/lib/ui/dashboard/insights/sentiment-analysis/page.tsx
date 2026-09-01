/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"


import Template from '@/lib/ui/template';
import React from 'react'
import styles from '@/styles/lib/ui/dashboard/insights/sentiment-analysis.module.scss';


// components
import SelectArray from '@/components/Select/select-array';
import Title from '@/components/Typography/Title/title';
import Grid from '@/components/Grid/grid';
import Text from '@/components/Typography/Text/text';


//lib & utils
import TitleWrapper from '@/lib/ui/titleWrapper';
import useFormQuery from '@/lib/hooks/useQuery';


export default function SentimentAnalysis() {


   const { data, isLoading, error} = useFormQuery<any>({
        key: ["Regions"],
        url: "maintenance/geospatial/geom"
    })
  

  return (
    <Template title='Sentiment Analysis'>
        <div className={styles.container}>
            <Grid min={220} max={"1fr"} gap={10}>
                    <SelectArray 
                    label="Date Range"
                    value=""
                    name=""
                    options={["7 days", "Last 30 days", "90 Days"].map((node) => ({
                        label: node,
                        value: node.toLowerCase()
                    }))}
                />
                <SelectArray 
                    label="All Regions"
                    value=""
                    name=""
                    options={(data?.data.regions.features || []).map((node: { id: string, properties: { id: unknown, name: string}}) => ({
                        label: node.properties?.name,
                        value: node.id
                }))}
            />
                <SelectArray 
                    label="Age Group"
                    value=""
                    name=""
                    options={["13-17", "18-24", "25-35"].map((node) => ({
                        label: node,
                        value: node
                }))}
                />
                <SelectArray 
                    label="Platform"
                    name=""
                    value=""
                    options={["Facebook", "X", "Instagram", "Tiktok", "Reddit"].map((node) => ({
                        label: node,
                        value: node.toLowerCase()
                    }))}
                />
            </Grid>
            
            <TitleWrapper title="Sentiment Overview" />
        <Grid min={300} gap={10}>
                {[
                    {title: "Positive Statement", percentage: 42},
                    {title: "Neutral Statement", percentage: 33},
                    { title: "Negative Statement", percentage: 50}
                ].map(({ title, percentage}, index ) => (
                    <div className={styles.card} key={index}>
                        <Title size="sm">{title}</Title>
                        <div className={styles.sub}>
                            <Text size={"sm"}>{percentage}%</Text>
                            <Text size={"sm"}>of total mentions</Text>
                        </div>
                        <progress value={percentage} max={100}/>
                    </div>
                ))}
        </Grid>
        </div>
    </Template>
    )
}
