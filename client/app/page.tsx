"use client";

import { PrimaryFont, SecondaryFont } from "@/lib/typography";
import styles from "./page.module.scss";
import Image from 'next/image'

//lib and hooks
import Header from "@/lib/ui/header";
import TitleWrapper from "@/lib/ui/titleWrapper";
import Footer from "@/lib/ui/footer";
import SurveillanceMap from "@/lib/ui/home/map";
import useFormQuery from "@/lib/hooks/useQuery";
import EducationResourceCard from "@/lib/ui/educational-resource/education-reosurce-card";
import { OrganizationResult } from "@/lib/interface/organization/organization.interface";
import { EducationalResourceResult } from "@/lib/interface/education-resource/educational-resources.interface";
import { Personnel } from "@/lib/utils/personel";


//components 
import Title from '@/components/Typography/Title/title'
import Avatar from "@/components/Avatar/avatar";
import Grid from "@/components/Grid/grid";
import Text from "@/components/Typography/Text/text";
import Paragraph from "@/components/Typography/Paragraph/paragraph";
import SkeletonCard from "@/lib/ui/loading/SkeletonCard";
import Button from "@/components/Button/button";



export default function Home() {


  const { data: OrganizationData } = useFormQuery<OrganizationResult>({ 
    key: ["Organizations"],
    url: "maintenance/organization",
  }); 

  const { data: EducationalResourceData, isLoading: EducationLoading } = useFormQuery<EducationalResourceResult>({
    key: ["EducationalResources"],
    url: "maintenance/educational-resource",
    params: { 
      status: "PUBLISHED"
    }
  });


  return (
    <div className={styles.container}>
      <Header />
      <section>
        {/* <TitleWrapper title="ADVOCACY RESEARCH PROGRAM" /> */}
        <h2>Transforming Digital Conversations</h2>
        <h2>into <span style={{
          color: "#ffbd59"
        }}>HIV INTELLIGENCE</span></h2>
        <h2>Through Geospatial AI for Public Health Surveillance</h2>
        <p className={SecondaryFont.className} style={{ textAlign: "justify" }}>
          AI-powered geospatial public health surveillance for monitoring HIV discourse, misinformation, stigma, and regional trends across the Philippines.
        </p>
          <div className={styles.buttons}>
          <Button type="button" size="md" variant="primary">Explore the Methodology</Button>
          <Button type="button" size="md" variant="primary">View Research Data</Button>
        </div>
      </section>
      <section>
        <TitleWrapper title="Surveillance Map" />
        <SurveillanceMap />
        <div style={{
          padding: '10px 0'
        }}>
          <Text size="sm" style={{ fontStyle: "italic",  color: "#808080"  }}>Disclaimer: This feature is intended for viewing the hotspot only. It is provided for display and monitoring purposes and does not allow any configuration changes or modifications to the hotspot settings.</Text>

        </div>
    </section>
      <section>
        <TitleWrapper title="Educational Resources" />
        <Grid gap={10} max={"1fr"} min={430}>
        {EducationLoading  ? Array.from({ length: 6}).map((node, index) => (
          <SkeletonCard  key={index} /> 
        )) : EducationalResourceData?.data.edges.map(({ node: { external_link, thumbnail, slug,type, summary, title}}, index) => (
          <EducationResourceCard
                key={index}
                summary={summary}
                thumbnail={thumbnail}
                slug={slug}
                type={type}
                title={title}
                route={
                  type === "EXTERNAL_LINK"
                    ? external_link
                    : `/educational-resources/${slug}`
                }
              />
          ))}
        </Grid>
      </section>
      <section>
        <TitleWrapper title="METHODOLOGY" />

        <Title size="lg">A Four-Stage of Intelligence Pipeline</Title>
        <Paragraph className={SecondaryFont.className} style={{ textAlign: "justify" }}>
        From raw digital signal to targeted field deployment — each stage is designed for rigor, reproducibility, and ethical compliance.
        </Paragraph>
        <div className={styles.gridContainer}>
          {
          [
          
            {
              name: "Digital Signal Collection",
              description:
                "Publicly available HIV-related discussions are ethically collected from social media platforms, forums, and search trends. The system anonymizes personally identifiable information during data collection and gathers multilingual conversations to capture patterns in HIV awareness, stigma, misinformation, testing behavior, and treatment access across the Philippines.",
            },
            {
              name: "NLP Classification",
              description:
                "Collected conversations are analyzed using a fine-tuned multilingual BERT model to classify sentiment, HIV relevance, stigma, misinformation, help-seeking intent, and potential risk. Supporting multiple Philippine languages, the model transforms unstructured online discussions into meaningful public health insights.",
            },
            {
              name: "Geospatial Intelligence",
              description:
                "Classified conversations are geocoded and integrated with PostGIS to generate interactive maps and heatmaps that visualize regional trends, conversation density, stigma, misinformation, and HIV-related risk. These spatial insights help identify emerging hotspots and support location-based decision-making.",
            },
            {
              name: "Public Health Surveillance",
              description:
                "The analyzed data is presented through real-time dashboards and intelligence reports, enabling health agencies, local government units, researchers, and advocacy organizations to monitor trends, prioritize interventions, combat misinformation, and strengthen evidence-based HIV prevention strategies.",
            }
          
          ].map((item, index) => (
            <div key={index} className={styles.methodologyItem}>
              <div>
                <span className={PrimaryFont.className}>Stage 0{index + 1}</span>
                <br/>
                <Title className={PrimaryFont.className} size="lg">{item.name}</Title>
              </div>
              <Paragraph className={SecondaryFont.className} style={{ textAlign: "justify" }}>
                {item.description}
              </Paragraph>
            </div>
          ))}
        </div>
      </section>

      <section>
        <TitleWrapper title="Organizations" />
      <Grid max={400} min={330}>
              {OrganizationData?.data.edges.map(({node: {logo }}, index) => (
            <div key={index}>
              <Avatar src={logo} variant="xl"/>
            </div>
          ))}
      </Grid>
      </section>

      <section>
        <TitleWrapper title="The Team" />
        <Title size="lg">Research & Advocates</Title>
          <Paragraph className={SecondaryFont.className} style={{ textAlign: "justify" }}>
          Advocaid is built by a multidisciplinary team of student researchers, faculty advisers, and government health partners — united by the shared goal of ending the Philippine HIV epidemic through better intelligence.
        </Paragraph>

        <Grid max={"1fr"}  min={300}gap={20}>
          {Personnel.map(({name, info } ) => (
            info.map(({name, position, url}, index) => (
            <div className={styles.team_card} key={index}>
              <div className={styles.avatar}>
                <Image src={url ?? ""} alt={name} layout="fill" objectFit="cover" objectPosition="center"/>
              </div>
              <div className={styles.divider}></div>
              <div className={styles.sub_team_card}>
                <Text style={{ fontWeight: 900 }} size="md">{name}</Text>
                <Text size="sm">{position}</Text>
              </div>
          </div>
            ))
        ))}
        </Grid>
        </section>
      <Footer />
    </div>
  );
}