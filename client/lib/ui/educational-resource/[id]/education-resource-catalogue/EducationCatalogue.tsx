"use client" 



import React, { useState } from 'react'
import styles from '@/styles/lib/ui/education-resoucre/[id]/educational-resource-catalogue.module.scss'
import Image from 'next/image'
import { TbCircleArrowLeft, TbCircleArrowRight } from 'react-icons/tb';


//components
import Text from '@/components/Typography/Text/text'


//lib & hooks
import { EducationResourceIdInterface } from '@/lib/interface/education-resource/educational-resources.interface';



interface Props {
  data: EducationResourceIdInterface
}


export default function EducationCatalogue({ data} : Props) {

    const [page, setPage] = useState(0);

    const attachments = data?.data.attachments ?? [];

    const leftPage = page > 0 ? attachments[page - 1] : null;
    const rightPage = attachments[page] ?? null;

    const previous = () => {
        setPage((prev) => Math.max(prev - 2, 0));
    };

    const next = () => {
    setPage((prev) =>
        Math.min(prev + 2, attachments.length - 1)
        );
    };


  return (
    <div>
      <div className={styles.book}>
        <div className={styles.page}>
            {leftPage ? (
              <Image
                  src={leftPage.file_url}
                  alt={leftPage.file_name}
                  fill
                  style={{ objectFit: "contain" }}
            />
              ) : (
                <div className={styles.blank}>Cover</div>
                  )}
                </div>

                <div className={styles.page}>
                    {rightPage && (
                        <Image
                          src={rightPage.file_url}
                          alt={rightPage.file_name}
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      )}
                    </div>
                  </div>

          <div className={styles.controller}>
              <button
                  disabled={page === 0}
                  onClick={previous}>
                  <TbCircleArrowLeft size={35} />
              </button>

              <Text size="lg" style={{color: "#35408E"}}>
                  {leftPage ? page : "Cover"} - {page + 1}
              </Text>

              <button
                disabled={page >= attachments.length - 1}
                onClick={next}>
                <TbCircleArrowRight size={35} />
              </button>
          </div>
    </div>
  )
}
