"use client"

import React, { useState } from "react"
import styles from "@/styles/lib/ui/survey/survey.module.scss"
import Header from "../header"
import Footer from "../footer"
import Paragraph from "@/components/Typography/Paragraph/paragraph"
import Title from "@/components/Typography/Title/title"

export default function SurveyID() {
    const [step, setStep] = useState<number>(1)
    const [consent, setConsent] = useState<boolean>(false)

    const handleContinue = () => {
        if (!consent) return

        setStep((currentStep) => currentStep + 1)
    }

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
                            <Paragraph>
                                The project shall implement a clear and informed consent
                                process before collecting or processing any personal
                                information. Users shall be provided with a privacy notice
                                explaining what information will be collected, the specific
                                purposes for its collection, how the information will be used
                                and stored, who may have access to it, the applicable
                                retention period, and how they may exercise their data
                                privacy rights. Consent shall be obtained through a clear,
                                affirmative, and voluntary action, such as selecting an
                                appropriate consent checkbox or confirmation button, and
                                shall not be assumed from continued use of the system. Users
                                shall be given the opportunity to review the privacy notice
                                before providing consent and shall not be required to provide
                                personal information beyond what is necessary for the intended
                                service. Where applicable, consent may be withdrawn at any
                                time through the system or by contacting the designated data
                                protection personnel, subject to lawful limitations and
                                legitimate grounds for continued processing.
                            </Paragraph>

                            <Paragraph>
                                Users shall have the right to be informed about the processing
                                of their personal information, access their stored
                                information, request corrections to inaccurate or outdated
                                information, object to or restrict certain processing
                                activities, and request deletion or blocking of their
                                personal data when legally applicable. The system shall
                                establish procedures for exercising these rights by providing
                                an accessible request mechanism through the application or
                                designated contact channel. Requests shall be properly
                                authenticated, recorded, evaluated, and processed within the
                                applicable period, with the user receiving confirmation of the
                                action taken or an explanation when the request cannot be
                                fulfilled due to legal, regulatory, or legitimate
                                operational requirements. All privacy-related requests and
                                incidents shall be handled confidentially and escalated to
                                the appropriate data protection officer or authorized
                                personnel when necessary.
                            </Paragraph>

                            <div className={styles.consent}>
                                <label className={styles.consent_label}>
                                    <input
                                        type="checkbox"
                                        checked={consent}
                                        onChange={(event) =>
                                            setConsent(event.target.checked)
                                        }
                                    />

                                    <span>
                                        I have read and understood the Data Privacy Context
                                        and voluntarily consent to the collection and
                                        processing of my personal information for the
                                        purposes described above.
                                    </span>
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

                {step === 2 && (
                    <div className={styles.data_privacy}>
                        <div className={styles.data_privacy_header}>
                            <Title style={{ color: "#fff" }} size="md">
                                Survey
                            </Title>
                        </div>

                        <div className={styles.data_privacy_body}>
                            <Paragraph>
                                Thank you for providing your consent. You may now proceed
                                with the survey.
                            </Paragraph>
                        </div>
                    </div>
                )}
            </div>

            {/* <Footer /> */}
        </div>
    )
}