"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import styles from "@/styles/lib/ui/survey/survey.module.scss"

import Header from "../header"
import Footer from "../footer"

import Paragraph from "@/components/Typography/Paragraph/paragraph"
import Title from "@/components/Typography/Title/title"
import Input from "@/components/Input/input"
import Textarea from "@/components/Textarea/textarea"
import Text from "@/components/Typography/Text/text"
import Checkbox from "@/components/Input/checkbox"
import Form from "@/components/Form/form"

import useFormQuery from "@/lib/hooks/useQuery"
import useFormHook from "@/lib/hooks/useFormHook"
import useFormMutation from "@/lib/hooks/useMutation"
import { SurveyIDInterface, SurveyQuestionInterface } from "@/lib/interface/survey-management/survey.interface"
import { CreateSurveyResponseSchema } from "@/lib/validations/survey-management.validation"
import headers from "@/lib/utils/headers"
import { SurveyResponseField } from "@/lib/types/survey-management"

interface Props {
    slug: string
}

export default function SurveyID({ slug }: Props) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [consent, setConsent] = useState<boolean>(false)
    const [submitError, setSubmitError] = useState<string>("")

    const parsedStep = Number(searchParams.get("step"))

    const step =
        searchParams.has("step") &&
        Number.isInteger(parsedStep) &&
        parsedStep >= 1
            ? parsedStep
            : 1

    const { data, isLoading } =
        useFormQuery<SurveyIDInterface>({
            key: ["Survey", slug],
            url: `maintenance/survey/${slug}`,
            headers,
        })

    const questions = useMemo<SurveyQuestionInterface[]>(() => {
        return (data?.data?.questions ?? []) as unknown as SurveyQuestionInterface[]
    }, [data])

    const {
        register,
        setValue,
        getValues,
        watch,
        errors,
    } = useFormHook({
        schema: CreateSurveyResponseSchema,
        shouldUnregister: false,
        defaultValues: {
            answers: [],
        },
    })

    const mutation = useFormMutation({
        key: ["CreateSurveyAnswer", slug],
        method: "POST",
        url: `maintenance/survey/response/${data?.data.survey_id}`,
        headers,
    })

    const currentQuestionIndex = step - 2

    const currentQuestion =
        questions[currentQuestionIndex] ?? undefined

    const answers = watch("answers") ?? []

    const currentAnswer =
        answers[currentQuestionIndex]

    const currentText =
        currentAnswer?.text ?? ""

    const updateStep = (nextStep: number) => {
        const params = new URLSearchParams(
            searchParams.toString()
        )

        params.set("step", String(nextStep))

        router.push(
            `${window.location.pathname}?${params.toString()}`
        )
    }

    useEffect(() => {
        if (!questions.length) {
            return
        }

        const existingAnswers =
            getValues("answers") ?? []

        const initializedAnswers =
            questions.map((question, index) => {
                const existingAnswer =
                    existingAnswers[index]

                if (
                    existingAnswer?.survey_question_id ===
                    question.survey_question_id
                ) {
                    return existingAnswer
                }

                return {
                    survey_question_id:
                        question.survey_question_id,
                    text: "",
                }
            })

        setValue(
            "answers",
            initializedAnswers,
            {
                shouldDirty: false,
                shouldValidate: false,
            }
        )
    }, [
        questions,
        getValues,
        setValue,
    ])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSubmitError("")
    }, [currentQuestionIndex])

    const handleContinue = () => {
        if (!consent) {
            return
        }

        if (!questions.length) {
            return
        }

        updateStep(2)
    }

    const submitAnswers = (
        answersToSubmit: SurveyResponseField["answers"]
    ) => {

        const cleanedAnswers =
            answersToSubmit.map(
                (answer) => ({
                    survey_question_id:
                        answer.survey_question_id,
                    text:
                        answer.text?.trim() ?? "",
                })
            )

        const payload = {
            answers: cleanedAnswers,
        }

        console.log(
            "SUBMIT PAYLOAD:",
            payload
        )

        mutation.mutate(payload, {
            onSuccess: () => {
                updateStep(
                    questions.length + 2
                )
            },
            onError: () => {
                setSubmitError(
                    "Unable to submit the survey. Please try again."
                )
            },
        })
    }

    const handleNextQuestion = () => {
        if (!currentQuestion) {
            return
        }

        const currentAnswers =
            getValues("answers") ?? []

        const currentText =
            currentAnswers[
                currentQuestionIndex
            ]?.text?.trim() ?? ""

        if (
            currentQuestion.is_required &&
            !currentText
        ) {
            setSubmitError(
                "This question is required."
            )

            return
        }

        const updatedAnswers =
            questions.map(
                (question, index) => {
                    const answer =
                        currentAnswers[index]

                    return {
                        survey_question_id:
                            question.survey_question_id,
                        text:
                            answer?.text?.trim() ?? "",
                    }
                }
            )

        updatedAnswers[
            currentQuestionIndex
        ] = {
            survey_question_id:
                currentQuestion.survey_question_id,
            text: currentText,
        }

        setValue(
            "answers",
            updatedAnswers,
            {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
            }
        )

        setSubmitError("")

        const isLastQuestion =
            currentQuestionIndex ===
            questions.length - 1

        if (isLastQuestion) {
            console.log(
                "FINAL ANSWERS:",
                updatedAnswers
            )

            submitAnswers(
                updatedAnswers
            )

            return
        }

        updateStep(step + 1)
    }

    const handlePreviousQuestion = () => {
        if (step <= 2) {
            updateStep(1)
            return
        }

        const currentAnswers =
            getValues("answers") ?? []

        const currentText =
            currentAnswers[
                currentQuestionIndex
            ]?.text?.trim() ?? ""

        const updatedAnswers =
            [...currentAnswers]

        updatedAnswers[
            currentQuestionIndex
        ] = {
            survey_question_id:
                currentQuestion?.survey_question_id ??
                "",
            text: currentText,
        }

        setValue(
            "answers",
            updatedAnswers,
            {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: false,
            }
        )

        updateStep(step - 1)
    }

    const isCompleted =
        !isLoading &&
        questions.length > 0 &&
        step === questions.length + 2

    const currentTextError =
        errors?.answers?.[
            currentQuestionIndex
        ]?.text

    return (
        <div className={styles.container}>
            <Header />

            <div className={styles.sub_container}>
                {step === 1 && (
                    <div
                        className={
                            styles.data_privacy
                        }
                    >
                        <div
                            className={
                                styles.data_privacy_header
                            }
                        >
                            <Title
                                style={{
                                    color: "#fff",
                                }}
                                size="md"
                            >
                                Data Privacy Context
                            </Title>
                        </div>

                        <div
                            className={
                                styles.data_privacy_body
                            }
                        >
                            <Paragraph
                                style={{
                                    color: "black",
                                }}
                            >
                                The project shall implement
                                a clear and informed consent
                                process before collecting or
                                processing any personal
                                information. Users shall be
                                provided with a privacy notice
                                explaining what information
                                will be collected, the
                                specific purposes for its
                                collection, how the information
                                will be used and stored, who
                                may have access to it, the
                                applicable retention period,
                                and how they may exercise their
                                data privacy rights. Consent
                                shall be obtained through a
                                clear, affirmative, and
                                voluntary action, such as
                                selecting an appropriate
                                consent checkbox or
                                confirmation button, and
                                shall not be assumed from
                                continued use of the system.
                                Users shall be given the
                                opportunity to review the
                                privacy notice before
                                providing consent and shall
                                not be required to provide
                                personal information beyond
                                what is necessary for the
                                intended service. Where
                                applicable, consent may be
                                withdrawn at any time through
                                the system or by contacting
                                the designated data protection
                                personnel, subject to lawful
                                limitations and legitimate
                                grounds for continued
                                processing.
                            </Paragraph>

                            <Paragraph
                                style={{
                                    color: "black",
                                }}
                            >
                                Users shall have the right to
                                be informed about the
                                processing of their personal
                                information, access their
                                stored information, request
                                corrections to inaccurate or
                                outdated information, object
                                to or restrict certain
                                processing activities, and
                                request deletion or blocking
                                of their personal data when
                                legally applicable. The system
                                shall establish procedures for
                                exercising these rights by
                                providing an accessible
                                request mechanism through the
                                application or designated
                                contact channel. Requests
                                shall be properly
                                authenticated, recorded,
                                evaluated, and processed within
                                the applicable period, with the
                                user receiving confirmation of
                                the action taken or an
                                explanation when the request
                                cannot be fulfilled due to
                                legal, regulatory, or
                                legitimate operational
                                requirements.
                            </Paragraph>

                            <div
                                className={
                                    styles.consent
                                }
                            >
                                <label
                                    className={
                                        styles.consent_label
                                    }
                                >
                                    <Checkbox
                                        type="checkbox"
                                        checked={consent}
                                        onChange={(event) =>
                                            setConsent(
                                                event.target
                                                    .checked
                                            )
                                        }
                                    />

                                    <Text size="sm">
                                        I have read and
                                        understood the Data
                                        Privacy Context and
                                        voluntarily consent
                                        to the collection and
                                        processing of my
                                        personal information
                                        for the purposes
                                        described above.
                                    </Text>
                                </label>
                            </div>
                        </div>

                        <div
                            className={
                                styles.data_privacy_footer
                            }
                        >
                            <button
                                type="button"
                                disabled={!consent}
                                onClick={
                                    handleContinue
                                }
                                className={
                                    styles.continue_button
                                }
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                )}

                <Form>
                    {step >= 2 &&
                        !isCompleted && (
                            <div
                                className={
                                    styles.data_privacy
                                }
                            >
                                <div
                                    className={
                                        styles.data_privacy_header
                                    }
                                >
                                    <Title
                                        style={{
                                            color: "#fff",
                                        }}
                                        size="md"
                                    >
                                        {data?.data
                                            ?.title || ""}
                                    </Title>
                                </div>

                                <div
                                    className={
                                        styles.data_privacy_body
                                    }
                                >
                                    {isLoading && (
                                        <Paragraph>
                                            Loading survey
                                            questions...
                                        </Paragraph>
                                    )}

                                    {!isLoading &&
                                        questions.length ===
                                            0 && (
                                            <Paragraph>
                                                No survey
                                                questions are
                                                available.
                                            </Paragraph>
                                        )}

                                    {!isLoading &&
                                        currentQuestion && (
                                            <div
                                                key={
                                                    currentQuestion
                                                        .survey_question_id
                                                }
                                            >
                                                <Text size="lg">
                                                    Question{" "}
                                                    {currentQuestionIndex +
                                                        1}{" "}
                                                    of{" "}
                                                    {
                                                        questions.length
                                                    }
                                                </Text>

                                                <Title size="md">
                                                    {
                                                        currentQuestion.text
                                                    }
                                                </Title>

                                                {currentQuestion.type ===
                                                    "SHORT_TEXT" && (
                                                    <Input
                                                        key={`short-${currentQuestion.survey_question_id}`}
                                                        name={`answers.${currentQuestionIndex}.text`}
                                                        register={
                                                            register
                                                        }
                                                        error={
                                                            currentTextError
                                                        }
                                                        placeholder="Enter your answer"
                                                        defaultValue={
                                                            currentText
                                                        }
                                                    />
                                                )}

                                                {currentQuestion.type ===
                                                    "LONG_TEXT" && (
                                                    <Textarea
                                                        key={`long-${currentQuestion.survey_question_id}`}
                                                        name={`answers.${currentQuestionIndex}.text`}
                                                        register={
                                                            register
                                                        }
                                                        rows={6}
                                                        required={
                                                            currentQuestion.is_required
                                                        }
                                                        label=""
                                                        defaultValue={
                                                            currentText
                                                        }
                                                    />
                                                )}

                                                {submitError && (
                                                    <Paragraph>
                                                        {
                                                            submitError
                                                        }
                                                    </Paragraph>
                                                )}
                                            </div>
                                        )}
                                </div>

                                {!isLoading &&
                                    currentQuestion && (
                                        <div
                                            className={
                                                styles.data_privacy_footer
                                            }
                                        >
                                            {step > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={
                                                        handlePreviousQuestion
                                                    }
                                                    className={
                                                        styles.continue_button
                                                    }
                                                >
                                                    Previous
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={
                                                    handleNextQuestion
                                                }
                                                className={
                                                    styles.continue_button
                                                }
                                                disabled={
                                                    mutation.isPending
                                                }
                                            >
                                                {mutation.isPending
                                                    ? "Submitting..."
                                                    : currentQuestionIndex ===
                                                        questions.length -
                                                            1
                                                      ? "Finish"
                                                      : "Next"}
                                            </button>
                                        </div>
                                    )}
                            </div>
                        )}

                    {isCompleted && (
                        <div
                            className={
                                styles.data_privacy
                            }
                        >
                            <div
                                className={
                                    styles.data_privacy_header
                                }
                            >
                                <Title
                                    style={{
                                        color: "#fff",
                                    }}
                                    size="md"
                                >
                                    Survey Completed
                                </Title>
                            </div>

                            <div
                                className={
                                    styles.data_privacy_body
                                }
                            >
                                <Paragraph
                                    style={{
                                        color: "black",
                                    }}
                                >
                                    Thank you for completing
                                    the survey.
                                </Paragraph>
                            </div>

                            <div
                                className={
                                    styles.data_privacy_footer
                                }
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.push(
                                            "/"
                                        )
                                    }
                                    className={
                                        styles.continue_button
                                    }
                                >
                                    <Text size="sm">
                                        Back to Survey
                                    </Text>
                                </button>
                            </div>
                        </div>
                    )}
                </Form>
            </div>

            <Footer />
        </div>
    )
}