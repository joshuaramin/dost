"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import styles from "@/styles/lib/ui/survey/survey.module.scss"

import Header from "../header"
import Footer from "../footer"

//components
import Paragraph from "@/components/Typography/Paragraph/paragraph"
import Title from "@/components/Typography/Title/title"
import Input from "@/components/Input/input"

//lib & hooks
import useFormQuery from "@/lib/hooks/useQuery"
import useFormHook from "@/lib/hooks/useFormHook"
import { SurveyIDInterface } from "@/lib/interface/survey-management/survey.interface"
import { SurveyAnswerSchema } from "@/lib/validations/survey-management.validation"

import headers from "@/lib/utils/headers"
import Textarea from "@/components/Textarea/textarea";
import Text from "@/components/Typography/Text/text";
import Checkbox from "@/components/Input/checkbox";
import useFormMutation from "@/lib/hooks/useMutation";
import { SubmitHandler } from "react-hook-form";
import { SurveyResponseField } from "@/lib/types/survey-management";
import Form from "@/components/Form/form";

interface Props {
    slug: string
}

interface SurveyAnswer {
    agreement: boolean
    question_id: string
    text?: string
    option_id?: string
    option_ids?: string[]
}

interface QuestionOption {
    option_id: string
    text: string
}

interface SurveyQuestion {
    survey_question_id: string
    text: string
    type: "SHORT_TEXT" | "LONG_TEXT" | "MULTIPLE_CHOICE" | "CHECKBOX"
    is_required: boolean
    options?: QuestionOption[]
}

export default function SurveyID({ slug }: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [consent, setConsent] = useState<boolean>(false)
    const [answers, setAnswers] = useState<Record<string, SurveyAnswer>>({})
    const [submitError, setSubmitError] = useState<string>("")

    const parsedStep = Number(searchParams.get("step"))
    const step =
        searchParams.has("step") &&
        Number.isInteger(parsedStep) &&
        parsedStep >= 1
            ? parsedStep
            : 1

    const { data, isLoading } = useFormQuery<SurveyIDInterface>({
        key: ["Survey", slug],
        url: `maintenance/survey/${slug}`,
        headers,
    })

    const questions = useMemo<SurveyQuestion[]>(() => {
        return (data?.data?.questions ?? []) as unknown as SurveyQuestion[]
    }, [data])

    const {
        register,
        setValue,
        getValues,
        resetField,
        watch,
        errors
    } = useFormHook({
        schema: SurveyAnswerSchema,
        defaultValues: {
            question_id: "",
            option_id: "",
            text: "",
            option_ids: [],
        },
    })

    const mutation = useFormMutation({
        key: ["CreateSurveyAnswer", slug],
        method: "POST",
        url: `maintenance/survey/answer/${slug}`
    })


    const onHandleSubmit: SubmitHandler<SurveyResponseField> = (data) => {

        console.log(data)
        // mutation.mutate({}, {
        //     onSuccess: () => {}
        // })
    }
    const updateStep = (nextStep: number) => {
        const params = new URLSearchParams(searchParams.toString())

        params.set("step", String(nextStep))

        router.push(`${window.location.pathname}?${params.toString()}`)
    }

    const currentQuestionIndex = step - 2

    const currentQuestion = questions[
        currentQuestionIndex
    ] as SurveyQuestion | undefined



    useEffect(() => {
        if (!currentQuestion) {
            return
        }

        const questionId = currentQuestion.survey_question_id

        setValue("question_id", questionId)

        const savedAnswer = answers[questionId]

        if (savedAnswer) {
            setValue("text", savedAnswer.text ?? "")
            setValue("option_id", savedAnswer.option_id ?? "")
            setValue("option_ids", savedAnswer.option_ids ?? [])
            return
        }

        resetField("text", {
            defaultValue: "",
        })

        resetField("option_id", {
            defaultValue: "",
        })

        resetField("option_ids", {
            defaultValue: [],
        })
    }, [
        currentQuestion,
        answers,
        setValue,
        resetField,
    ])

    const saveCurrentAnswer = (): boolean => {
        if (!currentQuestion) {
            return false
        }

        const values = getValues()

        const answer: SurveyAnswer = {
            agreement: false,
            question_id: currentQuestion.survey_question_id,
        }

        if (
            currentQuestion.type === "SHORT_TEXT" ||
            currentQuestion.type === "LONG_TEXT"
        ) {
            const text = values.text?.trim() ?? ""

            if (currentQuestion.is_required && !text) {
                setSubmitError("This question is required.")
                return false
            }

            if (text) {
                answer.text = text
            }
        }

        if (currentQuestion.type === "MULTIPLE_CHOICE") {
            const optionId = values.option_id ?? ""

            if (currentQuestion.is_required && !optionId) {
                setSubmitError("Please select an option.")
                return false
            }

            if (optionId) {
                answer.option_id = optionId
            }
        }

        if (currentQuestion.type === "CHECKBOX") {
            const optionIds = values.option_ids ?? []

            if (
                currentQuestion.is_required &&
                optionIds.length === 0
            ) {
                setSubmitError("Please select at least one option.")
                return false
            }

            if (optionIds.length > 0) {
                answer.option_ids = optionIds
            }
        }

        setAnswers((previous) => ({
            ...previous,
            [currentQuestion.survey_question_id]: answer,
        }))

        setSubmitError("")

        return true
    }

    const handleContinue = () => {
        if (!consent) {
            return
        }

        updateStep(2)
    }

    const handleNextQuestion = () => {
        if (!currentQuestion) {
            return
        }

        const saved = saveCurrentAnswer()

        if (!saved) {
            return
        }

        const isLastQuestion =
            currentQuestionIndex === questions.length - 1

        if (isLastQuestion) {
            updateStep(questions.length + 2)
            return
        }

        updateStep(step + 1)
    }

    const handlePreviousQuestion = () => {
        if (step <= 2) {
            updateStep(1)
            return
        }

        saveCurrentAnswer()
        updateStep(step - 1)
    }

    const handleSubmitSurvey = () => {
        if (!questions.length) {
            return
        }

        const allAnswers = questions.map((question) => {
            return answers[question.survey_question_id] ?? {
                agreement: false,
                question_id: question.survey_question_id,
            }
        })

        console.log("Survey Answers:", allAnswers)
    }

    const handleFinish = () => {
        if (!currentQuestion) {
            return
        }

        const saved = saveCurrentAnswer()

        if (!saved) {
            return
        }

        const finalAnswers = {
            ...answers,
            [currentQuestion.survey_question_id]: {
                ...getValues(),
                agreement: false,
                question_id: currentQuestion.survey_question_id,
            },
        }

        console.log("Survey Answers:", Object.values(finalAnswers))

        handleSubmitSurvey()

        updateStep(questions.length + 2)
    }

    const isCompleted =
        !isLoading &&
        questions.length > 0 &&
        step === questions.length + 2

    const selectedOptionIds = watch("option_ids") ?? []

    return (
        <div className={styles.container}>
            <Header />

            <div className={styles.sub_container}>
                {step === 1 && (
                    <div className={styles.data_privacy}>
                        <div className={styles.data_privacy_header}>
                            <Title style={{ color: "#fff" }} size="md">
                                Data Privacy Context
                            </Title>
                        </div>

                        <div className={styles.data_privacy_body}>
                            <Paragraph style={{ color: "black"}}>
                                The project shall implement a clear and informed
                                consent process before collecting or processing
                                any personal information. Users shall be provided
                                with a privacy notice explaining what information
                                will be collected, the specific purposes for its
                                collection, how the information will be used and
                                stored, who may have access to it, the applicable
                                retention period, and how they may exercise their
                                data privacy rights. Consent shall be obtained
                                through a clear, affirmative, and voluntary action,
                                such as selecting an appropriate consent checkbox
                                or confirmation button, and shall not be assumed
                                from continued use of the system. Users shall be
                                given the opportunity to review the privacy notice
                                before providing consent and shall not be required
                                to provide personal information beyond what is
                                necessary for the intended service. Where
                                applicable, consent may be withdrawn at any time
                                through the system or by contacting the designated
                                data protection personnel, subject to lawful
                                limitations and legitimate grounds for continued
                                processing.
                            </Paragraph>

                            <Paragraph style={{ color: "black"}}>
                                Users shall have the right to be informed about the
                                processing of their personal information, access
                                their stored information, request corrections to
                                inaccurate or outdated information, object to or
                                restrict certain processing activities, and request
                                deletion or blocking of their personal data when
                                legally applicable. The system shall establish
                                procedures for exercising these rights by providing
                                an accessible request mechanism through the
                                application or designated contact channel. Requests
                                shall be properly authenticated, recorded,
                                evaluated, and processed within the applicable
                                period, with the user receiving confirmation of
                                the action taken or an explanation when the request
                                cannot be fulfilled due to legal, regulatory, or
                                legitimate operational requirements. All
                                privacy-related requests and incidents shall be
                                handled confidentially and escalated to the
                                appropriate data protection officer or authorized
                                personnel when necessary.
                            </Paragraph>

                            <div className={styles.consent}>
                                <label className={styles.consent_label}>
                                    <Checkbox
                                
                                        type="checkbox"
                                        checked={consent}
                                        onChange={(event) =>
                                            setConsent(
                                                event.target.checked
                                            )
                                        }
                                    />

                                    <Text size="sm">
                                        I have read and understood the Data
                                        Privacy Context and voluntarily consent
                                        to the collection and processing of my
                                        personal information for the purposes
                                        described above.
                                    </Text>
                                </label>
                            </div>
                        </div>

                        <div className={styles.data_privacy_footer}>
                            <button
                                type="button"
                                disabled={!consent}
                                onClick={handleContinue}
                                className={styles.continue_button}
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

            <Form>
                    {step >= 2 && !isCompleted && (
                    <div className={styles.data_privacy}>
                        <div className={styles.data_privacy_header}>
                            <Title style={{ color: "#fff" }} size="md">
                                {data?.data.title || ""}
                            </Title>
                        </div>

                        <div className={styles.data_privacy_body}>
                            {isLoading && (
                                <Paragraph>
                                    Loading survey questions...
                                </Paragraph>
                            )}

                            {!isLoading && questions.length === 0 && (
                                <Paragraph>
                                    No survey questions are available.
                                </Paragraph>
                            )}

                            {!isLoading && currentQuestion && (
                                <div>
                                    <Text size="lg">
                                        Question{" "}
                                        {currentQuestionIndex + 1} of{" "}
                                        {questions.length}
                                    </Text>

                                    <Title size="md">
                                        {currentQuestion.text}
                                    </Title>

                                    {currentQuestion.type === "SHORT_TEXT" && (
                                        <Input
                                            name="text"
                                            error={errors.text}
                                            register={register}
                                            placeholder="Enter your answer"
                                            
                                        />
                                    )}

                                    {currentQuestion.type === "LONG_TEXT" && (
                                        <Textarea
                                            register={register}
                                            {...register("text")}
                                            rows={6}
                                            required={
                                                currentQuestion.is_required
                                            }
                                            label=""
                                        />
                                    )}

                                    {currentQuestion.type ===
                                        "MULTIPLE_CHOICE" && (
                                        <div>
                                            {currentQuestion.options?.map(
                                                (option) => (
                                                    <label
                                                        key={
                                                            option.option_id
                                                        }
                                                    >
                                                        <input
                                                            type="radio"
                                                            value={
                                                                option.option_id
                                                            }
                                                            {...register(
                                                                "option_id"
                                                            )}
                                                        />

                                                        <span>
                                                            {option.text}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    )}

                                    {currentQuestion.type === "CHECKBOX" && (
                                        <div>
                                            {currentQuestion.options?.map(
                                                (option) => {
                                                    const checked =
                                                        selectedOptionIds.includes(
                                                            option.option_id
                                                        )

                                                    return (
                                                        <label
                                                            key={
                                                                option.option_id
                                                            }
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                value={
                                                                    option.option_id
                                                                }
                                                                checked={
                                                                    checked
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) => {
                                                                    const current =
                                                                        getValues(
                                                                            "option_ids"
                                                                        ) ?? []

                                                                    if (
                                                                        event
                                                                            .target
                                                                            .checked
                                                                    ) {
                                                                        setValue(
                                                                            "option_ids",
                                                                            [
                                                                                ...current,
                                                                                option.option_id,
                                                                            ]
                                                                        )
                                                                    } else {
                                                                        setValue(
                                                                            "option_ids",
                                                                            current.filter(
                                                                                (
                                                                                    id
                                                                                ) =>
                                                                                    id !==
                                                                                    option.option_id
                                                                            )
                                                                        )
                                                                    }
                                                                }}
                                                            />

                                                            <span>
                                                                {
                                                                    option.text
                                                                }
                                                            </span>
                                                        </label>
                                                    )
                                                }
                                            )}
                                        </div>
                                    )}

                                    {submitError && (
                                        <Paragraph>
                                            {submitError}
                                        </Paragraph>
                                    )}
                                </div>
                            )}
                        </div>

                        {!isLoading && currentQuestion && (
                            <div className={styles.data_privacy_footer}>
                                {step > 2 && (
                                    <button
                                        type="button"
                                        onClick={handlePreviousQuestion}
                                        className={styles.continue_button}
                                    >
                                        Previous
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={
                                        currentQuestionIndex ===
                                        questions.length - 1
                                            ? handleFinish
                                            : handleNextQuestion
                                    }
                                    className={styles.continue_button}
                                >
                                    {currentQuestionIndex ===
                                    questions.length - 1
                                        ? "Finish"
                                        : "Next"}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {isCompleted && (
                    <div className={styles.data_privacy}>
                        <div className={styles.data_privacy_header}>
                            <Title style={{ color: "#fff" }} size="md">
                                Survey Completed
                            </Title>
                        </div>

                        <div className={styles.data_privacy_body}>
                            <Paragraph style={{ color: "black"}}>
                                Thank you for completing the survey.
                            </Paragraph>
                        </div>

                        <div className={styles.data_privacy_footer}>
                            <button
                                type="button"
                                onClick={() => router.push("/")}
                                className={styles.continue_button}
                            >
                                <Text size="sm">Back to Survey</Text>
                            </button>
                        </div>
                    </div>
                )}
            </Form>
            </div>
        </div>
    )
}