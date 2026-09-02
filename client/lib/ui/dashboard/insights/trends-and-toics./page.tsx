"use client"


import Search from '@/components/Search/search';
import Template from '@/lib/ui/template';
import React, { useState } from 'react'
import styles from '@/styles/lib/ui/dashboard/insights/trends-and-analytics.module.scss'
import SelectArray from '@/components/Select/select-array';
import TitleWrapper from '@/lib/ui/titleWrapper';
import { TbTrendingDown, TbTrendingUp } from 'react-icons/tb';
import Title from '@/components/Typography/Title/title';
import Text from '@/components/Typography/Text/text';
import useFormQuery from '@/lib/hooks/useQuery';
import Grid from '@/components/Grid/grid';

export default function TrendsAndTopics() {

    const [search, setSearch] = useState<string>('')


    const { data, isLoading, error} = useFormQuery({
        key: ["Regions"],
        url: "maintenance/geospatial/geom"
    })


     const onHandleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.currentTarget.value)
    }


    const onHandleClear = () => {
        setSearch('')
    }
  return (
    <Template title="Trends and Analytics">
        <div className={styles.container}>
             <Grid max={"1fr"} min={220} gap={10}>
                <Grid.Column span={1}>
                    <SelectArray 
                        label="Date Range"
                        value=""
                        name=""
                        options={["7 days", "Last 30 days", "90 Days"].map((node) => ({
                            label: node,
                            value: node.toLowerCase()
                        }))}
                    />
                </Grid.Column>
                <Grid.Column span={1}>
                    <SelectArray 
                        label="All Regions"
                        value=""
                        name=""
                        options={(data?.data.regions.features || []).map((node: { id: string, properties: { id: unknown, name: string}}) => ({
                            label: node.properties?.name,
                            value: node.id
                        }))}
                    />
                </Grid.Column>
                <Grid.Column span={1}>
                    <SelectArray 
                        label="Age Group"
                        value=""
                        name=""
                        options={["13-17", "18-24", "25-35"].map((node) => ({
                            label: node,
                            value: node
                        }))}
                    />
                </Grid.Column>
                <Grid.Column>
                        <SelectArray 
                        label="Platform"
                        name=""
                        value=""
                        options={["Facebook", "X", "Instagram", "Tiktok", "Reddit"].map((node) => ({
                            label: node,
                            value: node.toLowerCase()
                        }))}
                    />    
                </Grid.Column>
            </Grid>
            <TitleWrapper title="Trending Topics" />
            <Grid min={300} max={"1fr"} gap={10}>
                {
            [
                { title: "#HIVAwareness", trend: "up", percentage: "+143%"},
                { title: "HIV Treatment Access", trend: "up", percentage: "+88%"}, 
                { title: "Testing Centers", trend: "up", percentage: "+62%"},
                { title: "Prevention Methods", trend: "down", percentage: "-10%"}
              ].map(({  title, percentage, trend}, index) => (
                <div className={styles.card} key={index}>
                  <div className={styles.iconChart}>
                    {trend === "up" ? <TbTrendingUp size={40} /> : <TbTrendingDown size={40} />}
                  </div>
                  <div>
                    <Title size="md">{title}</Title>
                    <Text size="sm" style={{fontStyle: "italic"}}>{percentage}</Text>
                  </div>
                </div>
              ))
            }
            </Grid>
        </div>
    </Template>
  )
}
