"use client";

import React, { useMemo, useState } from "react";
import Template from "../../template";
import useFormQuery from "@/lib/hooks/useQuery";
import { EducationResourceIdInterface } from "@/lib/interface/education-resource/educational-resources.interface";
import Image from "next/image";
import styles from "@/styles/lib/ui/education-resoucre/[id]/educational-resource.module.scss";
import Text from "@/components/Typography/Text/text";
import { TbCircleArrowLeft, TbCircleArrowRight } from "react-icons/tb";
import parser from 'html-react-parser'
interface Props {
    id: string;
}

export default function EducationResource({ id }: Props) {
    

    const { data } = useFormQuery<EducationResourceIdInterface>({
        key: ["EducationalResourceId", id],
        url: `maintenance/educational-resource/${id}`,
    });

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
        <Template
            title={data?.data.title || ""}
            description={data?.data.summary}
        >
            <div className={styles.container}>
                {data?.data.type === "CATALOGUE" && attachments.length > 0 && (
                    <>
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
                          onClick={previous}
                      >
                          <TbCircleArrowLeft size={35} />
                      </button>

                      <Text size="lg">
                          {leftPage ? page : "Cover"} - {page + 1}
                      </Text>

                      <button
                          disabled={page >= attachments.length - 1}
                          onClick={next}
                      >
                          <TbCircleArrowRight size={35} />
                      </button>
                  </div>
                    </>
                )}
                {data?.data.type === "ARTICLE" && (
                    <div>{JSON.stringify(data.data.content)}</div>
                    // parser(data.data.content)
                )}
            </div>
        </Template>
    );
}