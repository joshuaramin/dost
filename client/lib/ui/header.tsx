import React from 'react'
import styles from '@/styles/lib/ui/header.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import { TbMenu2 } from 'react-icons/tb'
import { PrimaryFont } from '../typography'

export default function Header() {
    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <header>
                    <Image src={"/logo.png"} alt="logo" width={80} height={80} />
                    <div>
                        <h2>HIV GEOSPATIAL SURVIELLANCE</h2>
                        <span>Advocaid Program</span>
                    </div>
                </header>
                <nav>
                    <Link className={PrimaryFont.className} href={"/"}>Abstract</Link>
                    <Link className={PrimaryFont.className} href={"/"}>Methodology</Link>
                    <Link className={PrimaryFont.className} href={"/"}>Partners and Agencies</Link>
                    <Link className={PrimaryFont.className} href={"/"}>Contact</Link>
                </nav>
                <button>
                    <TbMenu2 size={35} />
                </button>
            </div>
            <div className={styles.sub}></div>
        </div>
    )
}
