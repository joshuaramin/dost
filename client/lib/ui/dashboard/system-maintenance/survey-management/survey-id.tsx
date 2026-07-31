/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { SubmitHandler, useFieldArray, useWatch } from "react-hook-form";
import { TbPlus, TbTrash } from "react-icons/tb";
import styles from "@/styles/lib/ui/dashboard/system-maintenance/survey-management/questionnaire-card.module.scss";

// components
import Input from "@/components/Input/input";
import Text from "@/components/Typography/Text/text";
import Button from "@/components/Button/button";
import InputReadOnly from "@/components/Input/input-readonly";
import Form from "@/components/Form/form";
import TextareaReadOnly from "@/components/Textarea/textarea-readonly";
import { Select } from "@/components/Select/select";

// lib & hooks
import useFormHook from "@/lib/hooks/useFormHook";
import TemplateSurvey from "@/lib/ui/dashboard/template-survey";
import QuestionOptionCard from "./question-option-card";
import { SurveyQuestionSchema } from "@/lib/validations/survey-management.validation";
import { SurveyQuestionField } from "@/lib/types/survey-management";
import useFormQuery from "@/lib/hooks/useQuery";
import useFormMutation from "@/lib/hooks/useMutation";


interface Props {
    slug: string
}

export default function SurveyID({ slug }: Props) {


    const { data, isLoading } = useFormQuery({
        key: ["Survey", slug],
        url: `maintenance/survey/${slug}`,
    })
    type QuestionType =
        | "SHORT_TEXT"
        | "LONG_TEXT"
        | "MULTIPLE_CHOICE"
        | "CHECKBOX";
    const {
        register,
        control,
        handleSubmit,
        errors,
        setValue,

    } = useFormHook({
        schema: SurveyQuestionSchema,
        defaultValues: {
            questionnaire: [
                {
                    text: "",
                    type: "SHORT_TEXT",
                    order_index: 1,
                    is_required: true,
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "questionnaire",
    });


      const questionnaire = useWatch({
            name: "questionnaire",
            control
        }
    );


    const mutation = useFormMutation({
        key: ["CreateSurveyQuestions", slug],
        method: "POST",
        url: `maintenance/survey/${slug}`
    })


    const onHandleSubmit: SubmitHandler<SurveyQuestionField> = (data) => {
        console.log(data);
        mutation.mutate(data, {
            onSuccess: () => {},
            onError: () => {}
        })
    };

    return (
        <TemplateSurvey title={slug}>
                <div className={styles.container}>
                    <Form onSubmit={handleSubmit(onHandleSubmit)}>
                <div className={styles.question_container}>
                        {fields.map(({ id }, index) => {
                            const question = questionnaire?.[index]?.type;
                            return (
                                <div
                                    className={styles.question_card}
                                    key={id}
                                >
                                    <div className={styles.col_1}>
                                        <div className={styles.body}>
                                            <div className={styles.questions}>
                                                <Input
                                                    type="text"
                                                    label="Question"
                                                    register={register}
                                                    name={`questionnaire.${index}.text`}
                                                    placeholder="Enter your question"
                                                    error={errors.questionnaire?.[index]?.text}
                                                    isRequired
                                                />

                                                {question ===
                                                    "SHORT_TEXT" && (
                                                        <InputReadOnly readOnly placeholder="Short Answer" />
                                                )}

                                                {question ===
                                                    "LONG_TEXT" && (
                                                    <TextareaReadOnly
                                                        placeholder="Long Answer"
                                                        readOnly
                                                    />
                                                )}

                                                {question ===
                                                    "MULTIPLE_CHOICE" && (
                                                    <>
                                                    <QuestionOptionCard
                                                            index={index}
                                                            control={control}
                                                            register={register}
                                                            errors={errors}
                                                            setValue={setValue}
                                                        />
                                                    </>
                                                )}

                                                {question ===
                                                    "CHECKBOX" && (
                                                    <>
                                                        <QuestionOptionCard
                                                            index={index}
                                                            control={control}
                                                            register={register}
                                                            errors={errors}
                                                            setValue={setValue}
                                                        />
                                                    </>
                                                )}
                                            </div>

                                            <div className={styles.choice}>
                                                <Select
                                                    control={control}
                                                    name={`questionnaire.${index}.type`}
                                                    label="Question Type"
                                                    isRequired
                                                    onChange={(value: any) =>
                                                        setValue(
                                                            `questionnaire.${index}.type`,
                                                            (value?.target?.value ?? value) as QuestionType
                                                        )
                                                    }
                                                    options={[
                                                        {
                                                            label: "Short Text",
                                                            value: "SHORT_TEXT",
                                                        },
                                                        {
                                                            label: "Long Text",
                                                            value: "LONG_TEXT",
                                                        },
                                                        {
                                                            label:
                                                                "Multiple Choice",
                                                            value:
                                                                "MULTIPLE_CHOICE",
                                                        },
                                                        {
                                                            label: "Checkbox",
                                                            value: "CHECKBOX",
                                                        },
                                                    ]}
                                                    error={
                                                        errors.questionnaire?.[
                                                            index
                                                        ]?.type
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.divider} />

                                    <div className={styles.footer}>
                                        <div>
                                        {index === fields.length - 1 && (
                                            <Button
                                                type="button"
                                                types="outline"
                                                size="sm"
                                                variant="primary"
                                                onClick={() => append({
                                                        text: "",
                                                        type: "SHORT_TEXT",
                                                        order_index:
                                                            fields.length + 1,
                                                        is_required: false,
                                                })}
                                            >
                                                <TbPlus size={23} />
                                            </Button>
                                        )}
                                        </div>
                                        <div
                                            className={
                                                styles.footer_1_col_1
                                            }
                                        >
                                        <Button
                                            types="outline"
                                            size="sm"
                                            variant={fields.length === 1 ? "disabled" : "primary"}
                                            type="button"
                                            onClick={() => remove(index)}
                                            disabled={fields.length === 1}
                                        >
                                            <TbTrash size={23} />
                                        </Button>
                                        <hr />
                                        <div>
                                                <Text size="sm">
                                                    Required
                                                </Text>
                                            </div>
                                        </div>
                                    </div>                                 
                                </div>
                            );
                        })}
                    </div>

                    <div className={styles.submit_container}>
                        <Button
                            type="submit"
                            types="filled"
                            size="md"
                            variant="primary"
                            onClick={() => handleSubmit(onHandleSubmit)}
                        >
                            Submit
                        </Button>
                    </div>
                    </Form>
                </div>
        </TemplateSurvey>
    );
}