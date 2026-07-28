/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import styles from '@/styles/lib/ui/education-resoucre/educational-resource.module.scss'
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
import EducationCatalogue from './[id]/education-resource-catalogue/EducationCatalogue';
import EducationArticle from './[id]/education-resource-article/EducationArticle';


interface Props {
    id: string
}

export default function EducationResourceId({ id }: Props ) {


    const { data, isLoading } = useFormQuery<EducationResourceIdInterface>({
        key: ["EducationalResourceId", id],
        url: `maintenance/educational-resource/${id}`
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
            <Paragraph>{resource?.summary}</Paragraph>
            <div className={styles.sub_paragraph}>
                {resource?.Author ?  <Text size="md">{resource?.Author.Profile.first_name || ""}</Text> : <Text size="md">Unknown Author</Text>}
                {resource?.created_at && (
                <Text size="md">
                    {format(new Date(resource.created_at), "MMMM dd, yyyy")}
                </Text>
                )}
            </div>
            </>
        )}
        </div>
        {isLoading ? <SkeletonBody />  : 
            <>
            {  data?.data.type === "CATALOGUE" && (
                <EducationCatalogue data={data}/>
            )
            }
            {data?.data.type === "ARTICLE" && (
                <EducationArticle contents={data.data.content} />
            )}
            </>
        }

<div className={styles.container_footer}>
    <Title size="lg">Recommended Resources</Title>   
        <Grid max={"1fr"} min={330} gap={10}>
        {isLoading ? 
            Array.from({length: 6}).map((node, index) => (
                <SkeletonCard key={index} />
            )) 
        : resource?.related.edges.map((node, index) => (
                    <EducationResourceCard
                        thumbnail={node.node.thumbnail}
                        key={index}
                        summary={node.node.summary}
                        slug={node.node.slug}
                        type={node.node.type}
                        title={node.node.title}
                        route={node.node.type === "EXTERNAL_LINK" ? node.node.external_link :`/educational-resources/${node.node.slug}`}
                    />
                ))}
            </Grid>
            </div>
        </div>
    )
}
