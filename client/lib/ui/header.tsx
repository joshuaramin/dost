import React from "react";
import styles from "@/styles/lib/ui/header.module.scss";
import Link from "next/link";
import Image from "next/image";
import { TbMenu2 } from "react-icons/tb";
import { PrimaryFont } from "../typography";
import Title from "@/components/Typography/Title/title";
import Text from "@/components/Typography/Text/text";

export default function Header() {
  return (
    <div className={styles.container}>
      <div className={styles.header_nav}>
        <Link href="/auth/login">Login</Link>

        <Link href="/auth/registration">Sign Up</Link>
      </div>
      <div className={styles.main}>
        <header>
          <div className={styles.logoBG}>
            <Image src={"/assets/logo.png"} alt="logo" width={80} height={80} />
          </div>

          {/* <Image src={"/logo.png"} alt="logo" width={80} height={80} /> */}
          <div>
            <Title size="lg">AdvocAid PH</Title>
            <Text size="sm">
              Geospatial AI for HIV Public Health Surveillance
            </Text>
          </div>
        </header>
        <nav>
          <Link className={PrimaryFont.className} href={"/"}>
            Surveillance Map
          </Link>
          <Link className={PrimaryFont.className} href={"/"}>
            Educational Resource
          </Link>
          <Link className={PrimaryFont.className} href={"/"}>
            Researchers Team
          </Link>
        </nav>
        <button>
          <TbMenu2 size={35} />
        </button>
      </div>
      <div className={styles.sub}></div>
    </div>
  );
}
