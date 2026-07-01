"use client"

import styles from '@/styles/lib/ui/dashboard/insights/predictions.module.scss';
import { TbFileSmile } from 'react-icons/tb';


//components
import SelectArray from '@/components/Select/select-array';
import Paragraph from '@/components/Typography/Paragraph/paragraph';
import Text from '@/components/Typography/Text/text';
import Title from '@/components/Typography/Title/title';


//lib && hooks
import useFormQuery from '@/lib/hooks/useQuery';
import Template from '@/lib/ui/template';
import TitleWrapper from '@/lib/ui/titleWrapper';
import Grid from '@/components/Grid/grid';

export default function Predictions() {

      const { data, isLoading, error} = useFormQuery({
        key: ["Regions"],
        url: "maintenance/geospatial/geom"
    })
  
    
  return (
     <Template title="Predictions">
        <div className={styles.container}>
                <div className={styles.filter}>
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
            </div>
            <TitleWrapper title="Predictions Insights" />
            <Grid gap={10}>
                {[
            {
                title: "Trend Acceleration", 
                description: "HIV awareness discussions predicted to increase by 45% over the next 30 days due to upcoming World AIDS Day campaigns"
            },
            { 
                title: "Sentiment Approved",
                description: "Positive sentiment projected to increase from 64% to 76% following Department of Health's new educational campaign"
            },
            {
                title: "Regional Staff",
                description: "Western Visayas expected to see highest growth (30%) in HIV discussions as new testing centers open"
            },
            {
                title: "Information Integrity",
                description: "23% chance of new misinformation surge related to treatment side effects in next 2 weeks"
            }
            ].map(({ title, description}, index) => (
                <div  key={index} className={styles.card}>
                    <div className={styles.iconChart}>
                        <TbFileSmile size={23} />
                    </div>
                    <Title  size="md">{title}</Title>
                    <Paragraph>{description}</Paragraph>
                </div>
            ))}
            </Grid>
        </div>
     </Template>
  )
}
