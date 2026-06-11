import React from 'react'
import styles from '@/styles/lib/ui/footer.module.scss';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div style={{ display: "flex", alignItems: "center", justifyItems: "center"}}>
                    <Image src={"/assets/logo.png"} alt="logo" width={80} height={80} />
                    <Image src={"/assets/philippine_logo.png"} alt="logo" width={80} height={80} />
                </div>

                <h2>
                    HIV Geospatial Intelligence · Avocaid Program
                </h2>
                <p>
                    A school-hosted government advocacy initiative transforming digital conversations into actionable HIV surveillance intelligence for a healthier Philippines.
                </p>
            </div>
            <div className={styles.footer}>
                <Link href="https://www.national-u.edu.ph" target="_blank" className={styles.link}>
                    national-u.edu.ph
                </Link>
                <p>© 2023 Advocacy Research Program. All rights reserved.</p>
            </div>
        </div>
    )
}
