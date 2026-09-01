"use client";

import React, { useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { EditorState, $getRoot } from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { ListItemNode, ListNode } from "@lexical/list";
import { FieldError } from "react-hook-form";
import styles from "@/styles/components/Lexical/editor.module.scss";
import ToolBar from "./plugin/toolbar";

import cn from "@/lib/utils/cn";

interface Props {
    label: string;
    isRequired: boolean;
    name: string;
    setValue: unknown
    height: number;
    error: FieldError | undefined;
    value?: string;
}

interface EditorContentHandlerProps {
    name: string;
    setValue: (
        name: string,
        value: string,
        options?: {
            shouldDirty?: boolean;
            shouldValidate?: boolean;
        }
    ) => void;
}

interface InitialContentPluginProps {
    value?: string;
}

function InitialContentPlugin({
    value,
}: InitialContentPluginProps) {
    const [editor] = useLexicalComposerContext();

    const initialized = useRef(false);

    useEffect(() => {
        if (initialized.current) {
            return;
        }

        if (!value) {
            initialized.current = true;
            return;
        }

        editor.update(() => {
            const parser = new DOMParser();

            const dom = parser.parseFromString(
                value,
                "text/html"
            );

            const nodes = $generateNodesFromDOM(
                editor,
                dom
            );

            const root = $getRoot();

            root.clear();

            root.append(...nodes);

            initialized.current = true;
        });
    }, [editor, value]);

    return null;
}

function EditorContentHandler({
    name,
    setValue,
}: EditorContentHandlerProps) {
    const [editor] = useLexicalComposerContext();

    const onChange = (
        editorState: EditorState
    ) => {
        editorState.read(() => {
            const html = $generateHtmlFromNodes(
                editor
            );

            setValue(name, html, {
                shouldDirty: true,
                shouldValidate: true,
            });
        });
    };

    return (
        <OnChangePlugin
            onChange={onChange}
        />
    );
}

export default function ReactEditor({
    label,
    isRequired,
    setValue,
    error,
    name,
    height,
    value,
}: Props) {
    const hasError = !!error;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <label
                    className={cn(styles.label)}
                >
                    {label}
                </label>

                {isRequired ? (
                    <span
                        className={
                            styles.isRequired
                        }
                    >
                        *
                    </span>
                ) : null}
            </div>

            <div
                className={`${styles.body} ${
                    hasError
                        ? styles.bodyError
                        : ""
                }`}
            >
                <LexicalComposer
                    initialConfig={{
                        namespace: "EducationalResourceEditor",

                        onError: (
                            error: Error
                        ) => {
                            console.error(
                                error
                            );
                        },

                        nodes: [
                            ListNode,
                            ListItemNode,
                        ],
                    }}
                >
                    <ToolBar />

                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable
                                className={
                                    styles.editor
                                }
                                style={{
                                    height: `${height}px`,
                                    overflow:
                                        "auto",
                                }}
                            />
                        }
                        ErrorBoundary={
                            LexicalErrorBoundary
                        }
                    />

                    <HistoryPlugin />

                    <InitialContentPlugin
                        value={value}
                    />

                    <EditorContentHandler
                        name={name}
                        setValue={setValue}
                    />

                    <CheckListPlugin />

                    <ListPlugin />
                </LexicalComposer>
            </div>

            <div
                className={
                    styles.errorBody
                }
            >
                <span
                    className={styles.error}
                >
                    {error?.message}
                </span>
            </div>
        </div>
    );
}