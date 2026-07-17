/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React from 'react'
import styles from '@/styles/lib/ui/education-resoucre/educational-resource.module.scss'
import parser from 'html-react-parser'
import { format} from 'date-fns'


//components
import Title from '@/components/Typography/Title/title';
import Text from '@/components/Typography/Text/text';
import Paragraph from '@/components/Typography/Paragraph/paragraph';


//lib & hooks
import useFormQuery from '@/lib/hooks/useQuery';
import { EducationResourceIdInterface } from '@/lib/interface/education-resource/educational-resources.interface';
import EducationResourceCard from './education-reosurce-card';
import Grid from '@/components/Grid/grid';
import SkeletonCard from '../loading/SkeletonCard';
import SkeletonTitle from '../loading/SkeletonTitle';
import SkeletonBody from '../loading/SkeletonBody';


interface Props {
    id: string
}

export default function EducationResourceId({ id }: Props ) {


    const { data, isLoading } = useFormQuery<EducationResourceIdInterface>({
        key: ["EducationalResourceId", id],
        url: `maintenance/educationResource/${id}`
    })


    const resource = data?.data

    return (
        <div className={styles.container}>
        <div className={styles.container_header}>
        {isLoading ? 
        <SkeletonTitle /> : (
        <>
            <Title size="md">
                {resource?.title}
            </Title>
            <Paragraph>{resource?.excerpt}</Paragraph>
             {resource?.created_at && (
                <Text size="md">
                    {format(new Date(resource.created_at), "MMMM dd, yyyy")}
                </Text>
                )}
            </>
        )}
           
            {/* <Text size="sm">{resource.Author.Profile.first_name}</Text> */}
        </div>
       {isLoading ? <SkeletonBody />  : (
         <div className={styles.container_body}>
                {/* <Paragraph> */}
                    {parser(data?.data.content || "")}
                {/* </Paragraph> */}
        </div>
       )}

<div className={styles.container_footer}>
    <Title size="lg">Recommended Resources</Title>   
        <Grid max={"1fr"} min={330} gap={10}>
        {isLoading ? 
            Array.from({length: 6}).map((node, index) => (
                <SkeletonCard key={index} />
            )) 
        : resource?.related.edges.map((node, index) => (
                    <EducationResourceCard
                        key={index}
                        excerpt={node.node.excerpt}
                        slug={node.node.slug}
                        category={node.node.category}
                        title={node.node.title}
                        route={`/educational-resources/${node.node.slug}`}
                    />
                ))}
            </Grid>
            </div>
        </div>
    )
}
