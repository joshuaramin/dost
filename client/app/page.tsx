import { SecondaryFont } from "@/lib/typography";
import styles from "./page.module.scss";
import Header from "@/lib/ui/header";
import Title from "@/lib/ui/title";
import TitleWrapper from "@/lib/ui/titleWrapper";
import Footer from "@/lib/ui/footer";

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <section>
        <TitleWrapper title="ADVOCACY RESEARCH PROGRAM" />
        <h2>Transformation Digital Conversation: </h2>
        <h2>into <span style={{
          color: "#ffa400"
        }}>HIV INTELLIGENCE</span>:</h2>
        <h2>Geospatial AI for Public Health Surveillance</h2>
      </section>
      <section>

        <Title title="Abstract" />
        <p className={SecondaryFont.className} style={{ textAlign: "justify" }}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dolore, similique asperiores? Cumque velit porro reiciendis accusamus vel voluptatem quasi, saepe optio reprehenderit dicta nostrum dolores repudiandae quis est animi eum assumenda distinctio deleniti ut incidunt. Fugit odit nulla modi fuga, earum dolorum consequatur magnam officiis labore, nihil sequi debitis, magni ullam libero quos eaque quas eius. Quidem eius numquam pariatur aliquid aliquam at dolorum nulla aut quis optio amet ratione dolore, eum voluptatum laboriosam fugiat ad assumenda vel saepe nihil totam minus repudiandae? Similique ratione unde eaque, quae quo autem distinctio provident harum debitis quidem cumque nihil cupiditate, iure perspiciatis recusandae error at officia fugiat esse velit quam eveniet, nobis obcaecati! Eveniet quisquam illum natus suscipit distinctio beatae facilis quo.</p>


        <div className={styles.buttons}>
          <button>Explore the Methodology</button>
          <button>View Research Data</button>
        </div>
      </section>
      <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <TitleWrapper title="ABOUT THE PROGRAM" />
        <div>
          <Title title="What about AVOCAID?" />
          <p className={SecondaryFont.className} style={{ textAlign: "justify" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur veritatis, placeat fugit quo aut dolore rem itaque voluptatem ullam laboriosam minima temporibus voluptas, nihil veniam? Aspernatur consequuntur inventore est placeat iure sunt laborum perferendis. Qui optio, repellat quasi deserunt a ut excepturi animi velit sint quis laudantium beatae dolor non sit dolorem cumque tempore quod fugit autem at enim culpa. Itaque repellendus, voluptas pariatur quo ad distinctio. Esse, quis accusantium hic ratione ut soluta dolorem obcaecati distinctio delectus recusandae odit quibusdam tenetur nemo dolores adipisci fuga voluptatem! Corrupti, quod exercitationem quasi, corporis omnis magni reiciendis natus possimus perferendis sunt voluptatum.
          </p>
        </div>
        <div>
          <Title title="The Problem" />
          <p className={SecondaryFont.className} style={{ textAlign: "justify" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur veritatis, placeat fugit quo aut dolore rem itaque voluptatem ullam laboriosam minima temporibus voluptas, nihil veniam? Aspernatur consequuntur inventore est placeat iure sunt laborum perferendis. Qui optio, repellat quasi deserunt a ut excepturi animi velit sint quis laudantium beatae dolor non sit dolorem cumque tempore quod fugit autem at enim culpa. Itaque repellendus, voluptas pariatur quo ad distinctio. Esse, quis accusantium hic ratione ut soluta dolorem obcaecati distinctio delectus recusandae odit quibusdam tenetur nemo dolores adipisci fuga voluptatem! Corrupti, quod exercitationem quasi, corporis omnis magni reiciendis natus possimus perferendis sunt voluptatum.
          </p>
        </div>
        <div>
          <Title title="The Approach" />
          <p className={SecondaryFont.className} style={{ textAlign: "justify" }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur veritatis, placeat fugit quo aut dolore rem itaque voluptatem ullam laboriosam minima temporibus voluptas, nihil veniam? Aspernatur consequuntur inventore est placeat iure sunt laborum perferendis. Qui optio, repellat quasi deserunt a ut excepturi animi velit sint quis laudantium beatae dolor non sit dolorem cumque tempore quod fugit autem at enim culpa. Itaque repellendus, voluptas pariatur quo ad distinctio. Esse, quis accusantium hic ratione ut soluta dolorem obcaecati distinctio delectus recusandae odit quibusdam tenetur nemo dolores adipisci fuga voluptatem! Corrupti, quod exercitationem quasi, corporis omnis magni reiciendis natus possimus perferendis sunt voluptatum.
          </p>
        </div>
      </section>
      <section>
        <TitleWrapper title="METHODOLOGY" />
        <Title title="A Four-Stage of Intelligence Pipeline" />
        <p className={SecondaryFont.className} style={{ textAlign: "justify" }}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur veritatis, placeat fugit quo aut dolore rem itaque voluptatem ullam laboriosam minima temporibus voluptas, nihil veniam? Aspernatur consequuntur inventore est placeat iure sunt laborum perferendis.
        </p>
        <div className={styles.gridContainer}>
          {["Digital Signal Collection", "NLP Classification", "Geospatial Intelligence", "Public Health Surveillance"].map((item, index) => (
            <div key={index} className={styles.methodologyItem}>
              <div>
                <span className={SecondaryFont.className}>Stage 0{index + 1}</span>

                <h3>{item}</h3>
              </div>
              <p className={SecondaryFont.className} style={{ textAlign: "justify" }}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor quo accusantium repellat, possimus perferendis, dolore voluptatem reprehenderit aut, suscipit nisi error aliquid rerum. Repellendus perspiciatis vel recusandae non quia illo cumque veniam sint. Mollitia quaerat iste cumque at vitae atque porro consectetur, officiis quidem dignissimos quos sunt ipsa voluptates facilis dicta nulla accusantium debitis harum, laudantium tenetur voluptatem modi! Voluptatibus, ratione excepturi explicabo suscipit quia maiores optio modi neque ipsum!
              </p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <TitleWrapper title="Partners and Agencies" />
        <div className="">
          {[
            {
              name: "Department of Health",
              logo: "http://localhost:3000/dost"
            }, {}
          ].map(({ name }, index: number) => (
            <div key={index} className={styles.pa_card}>
              <div></div>
              <div>
                <h2>{name}</h2>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <TitleWrapper title="Research Team" />
      </section>
      <Footer />
    </div>
  );
}
