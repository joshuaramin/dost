"use client"

import styles from '@/styles/lib/ui/dashboard/insights/demographics.module.scss'
import Template from '@/lib/ui/template';
import React from 'react'
import SelectArray from '@/components/Select/select-array';
import TitleWrapper from '@/lib/ui/titleWrapper';
import { TbFileSmile } from 'react-icons/tb';
import Title from '@/components/Typography/Title/title';
import Paragraph from '@/components/Typography/Paragraph/paragraph';
import useFormQuery from '@/lib/hooks/useQuery';
import Grid from '@/components/Grid/grid';

export default function Demographics() {

      const { data, isLoading, error} = useFormQuery({
        key: ["Regions"],
        url: "maintenance/geospatial/geom"
    })
  
    
  return (
  
    <Template title="Demographics">
        <div className={styles.container}>
               <Grid max={"1fr"}  min={220} gap={10}>
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
            <TitleWrapper title="Demographics Overview" />
            <Grid max={"1fr"} min={300} gap={10}>
                {[
                    {
                        title: "Age Distribution",
                        value: "Predominantly 18-34 age groups"
                    }, {
                        title: "Gender Distribution",
                        value: "54% male, 43% female, 3% other"
                    }, { 
                        title: "Top Region",
                        value: "Metro Manila"
                    }
                ].map(({ title, value }, index) => ( 
                    <div className={styles.card} key={index}>
                        <div className={styles.iconChart}>
                            <TbFileSmile size={23} />
                        </div>
                        <Title  size="md">{title}</Title>
                        <Paragraph>{value}</Paragraph>
                    </div>
                ))}
            </Grid>
        </div>
    </Template>
  )
}
