import { SecondaryFont } from "@/lib/typography";
import styles from "./page.module.scss";

//lib and hooks
import Header from "@/lib/ui/header";
import Title from '@/components/Typography/Title/title'
import TitleWrapper from "@/lib/ui/titleWrapper";
import Footer from "@/lib/ui/footer";
import SurveillanceMap from "@/lib/ui/home/map";
import Text from "@/components/Typography/Text/text";
import Paragraph from "@/components/Typography/Paragraph/paragraph";


export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <section>
        <TitleWrapper title="ADVOCACY RESEARCH PROGRAM" />
        <h2>Transformation Digital Conversation: </h2>
        <h2>into <span style={{
          color: "#ffbd59"
        }}>HIV INTELLIGENCE</span>:</h2>
        <h2>Geospatial AI for Public Health Surveillance</h2>
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

        <Title size="lg">Abstract</Title>
        <p className={SecondaryFont.className} style={{ textAlign: "justify" }}>
          The proposed project, AdvocAid PH Toolkit, aims to develop a geospatial artificial intelligence (AI) platform that transforms social media conversations into real-time HIV public health intelligence in the Philippines. By integrating multilingual natural language processing (NLP), machine learning, and geospatial analytics, the system will monitor HIV-related discussions across Facebook, TikTok, X (Twitter), and Reddit in multiple Philippine languages. The platform will analyze trends, public sentiment, misinformation, and stigma to support evidence-based decision-making for the Department of Health, local government units, and community organizations. Ultimately, the project seeks to strengthen HIV surveillance, improve health communication, and contribute to targeted and culturally relevant interventions nationwide.  
        </p>


        <div className={styles.buttons}>
          <button>Explore the Methodology</button>
          <button>View Research Data</button>
        </div>
      </section>
      <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <TitleWrapper title="ABOUT THE PROGRAM" />
        <div>

          <Title size="lg">What about ADVOCAID?</Title>
          <p className={SecondaryFont.className} style={{ textAlign: "justify"}}>
          AdvocAid PH Toolkit is a proposed AI-powered digital health surveillance system designed to monitor and analyze HIV-related online discourse in the Philippines. The toolkit includes a web dashboard and mobile application capable of visualizing regional trends, geospatial hotspots, public sentiment, stigma, and misinformation related to HIV discussions on social media. It combines multilingual NLP models, predictive analytics, and interactive mapping tools to provide real-time insights for health agencies, researchers, and advocacy groups. The platform is intended to support public health literacy, policy development, stigma reduction, and targeted HIV prevention campaigns while promoting ethical and privacy-compliant data analysis.
          </p>
        </div>
        <div>

          <Title size="lg">The Problem</Title>
          <p className={SecondaryFont.className} style={{ textAlign: "justify" }}>
            The Philippines is currently experiencing one of the fastest-growing HIV epidemics in the Asia-Pacific region, with increasing infections particularly among young people aged 15–34. Despite existing laws and health programs, stigma, misinformation, discrimination, and limited public engagement continue to hinder HIV prevention, testing, and treatment efforts. Social media has become a major source of health information and public discourse, yet there is no integrated national system capable of tracking and analyzing HIV-related conversations online. This lack of real-time digital surveillance limits the ability of health authorities to detect misinformation, understand public sentiment, identify regional trends, and respond effectively to emerging HIV-related concerns.
          </p>
        </div>
        <div>

        <Title size="lg">The Approach</Title>
          <p className={SecondaryFont.className} style={{ textAlign: "justify" }}>
            The project will employ a Design Science Research (DSR) methodology to develop and validate the AdvocAid PH Toolkit through multiple stages, including data collection, AI model development, geospatial analysis, and dashboard deployment. HIV-related social media data will be gathered from platforms such as Facebook, TikTok, X, and Reddit using APIs and web crawlers, then processed using multilingual NLP models like mBERT and XLM-RoBERTa. The system will classify sentiment, misinformation, stigma, and discussion trends while integrating geospatial mapping to visualize regional patterns. Through iterative testing, stakeholder collaboration, and ethical data governance, the toolkit will provide predictive analytics and real-time monitoring capabilities to support evidence-based HIV interventions and policy planning in the Philippines.
          </p>
        </div>
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
            description: "Geotagged social media posts, forum threads, and search trends mentioning HIV-related terms are ethically harvested via platform APIs and publicly accessible digital sources, with all personally identifiable information fully anonymized at the point of data capture. The system collects multilingual discussions from platforms such as Facebook, X (Twitter), TikTok, Reddit, and community forums to identify emerging patterns related to HIV awareness, stigma, misinformation, testing behavior, and treatment access. Advanced natural language processing (NLP) and geospatial analytics are then applied to classify sentiments, detect misinformation hotspots, and map regional discourse trends across the Philippines. By integrating real-time digital conversations with demographic and geographic insights, the platform enables health authorities and partner organizations to develop timely, evidence-based, and culturally responsive HIV interventions while ensuring strict compliance with ethical standards and data privacy regulations.",
          },
          {
            name: "NLP Classification",
            description: "A fine-tuned multilingual BERT model processes each post by automatically classifying content according to sentiment, HIV relevance, stigma-related language, help-seeking intent, and a composite risk score derived from linguistic and contextual indicators. The model is trained on multilingual Philippine datasets, enabling it to understand English, Filipino, Cebuano, Ilocano, Hiligaynon, and code-switched social media discourse commonly used online. Through advanced natural language processing techniques, the system can identify harmful misinformation, detect emotionally distressed or vulnerable conversations, and recognize patterns associated with discrimination or barriers to healthcare access. These AI-generated insights are then integrated into geospatial dashboards and predictive analytics tools, allowing public health agencies and partner organizations to monitor evolving HIV-related narratives and respond with timely, targeted, and culturally sensitive interventions."
          },
          {
            name: "Geospatial Intelligence",
            description: "Classified signals are geocoded to barangay-level administrative boundaries through PostGIS-enabled spatial processing, allowing the system to generate dynamic heat maps that visualize conversation density, stigma burden, misinformation prevalence, and HIV-related risk intensity across regions. By combining geospatial analytics with AI-driven sentiment and discourse classification, the platform can identify localized hotspots where harmful narratives, discrimination, or urgent public health concerns are most concentrated. These spatial insights enable health authorities, local government units, and advocacy organizations to prioritize interventions, allocate resources efficiently, and tailor awareness campaigns according to regional needs. The continuous real-time updating of these maps also supports predictive surveillance by revealing temporal shifts in online discourse and emerging behavioral patterns linked to HIV vulnerability and healthcare access."
          },
          {
            name: "Public Health Surveillance",
            description: "Intelligence reports and real-time analytics dashboards are delivered to the Department of Health (DOH), Local Government Units (LGUs), and community health organizations to support data-driven HIV response strategies and policy planning. These reports provide actionable insights on regional stigma patterns, misinformation hotspots, emerging behavioral trends, and areas with increased help-seeking or risk-related discourse, enabling authorities to deploy outreach teams more effectively and strategically position HIV testing and awareness campaigns. By identifying communities with elevated online stigma or low health literacy, the platform also guides the development of targeted, culturally sensitive anti-stigma initiatives and digital education programs. The integration of predictive geospatial intelligence into public health operations enhances the capacity of local health units to respond proactively, optimize resource allocation, and strengthen community-based HIV prevention and intervention efforts across the Philippines."
          }
          ].map((item, index) => (
            <div key={index} className={styles.methodologyItem}>
              <div>
                <span className={SecondaryFont.className}>Stage 0{index + 1}</span>
                <br/>
                <Title size="lg">{item.name}</Title>
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

      </section>

      <section>
        <TitleWrapper title="The Team" />
         <Title size="lg">Research & Advocates</Title>
          <Paragraph className={SecondaryFont.className} style={{ textAlign: "justify" }}>
       Advocaid is built by a multidisciplinary team of student researchers, faculty advisers, and government health partners — united by the shared goal of ending the Philippine HIV epidemic through better intelligence.
        </Paragraph>
        </section>
      <Footer />
    </div>
  );
}
