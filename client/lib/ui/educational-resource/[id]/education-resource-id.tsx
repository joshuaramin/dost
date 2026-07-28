"use client";

import React, { useState } from "react";
import { EducationResourceIdInterface } from "@/lib/interface/education-resource/educational-resources.interface";
import styles from "@/styles/lib/ui/education-resoucre/[id]/educational-resource.module.scss";

//components


// libs & hook
import EducationCatalogue from "./education-resource-catalogue/EducationCatalogue";
import Template from "../../template";
import useFormQuery from "@/lib/hooks/useQuery";
import EducationArticle from "./education-resource-article/EducationArticle";

interface Props {
    id: string;
}

export default function EducationResource({ id }: Props) {
    

    const { data } = useFormQuery<EducationResourceIdInterface>({
        key: ["EducationalResourceId", id],
        url: `maintenance/educational-resource/${id}`,
    });


    return (
        <Template
            title={data?.data.title || ""}
            description={data?.data.summary}
        >
            <div className={styles.container}>
                {data?.data.type === "CATALOGUE"  && (
                <>
                    <EducationCatalogue data={data}/>
                </>
                )}
                {data?.data.type === "ARTICLE" && (
                    <EducationArticle contents={data.data.content} />
                )}
                {data?.data.type === "INFOGRAPHIC" && (
                    <div></div>
                )}
            </div>
        </Template>
    );
}