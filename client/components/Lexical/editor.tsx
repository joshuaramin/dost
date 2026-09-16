/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { $getRoot } from "lexical";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { ListItemNode, ListNode } from "@lexical/list";
import styles from "@/styles/components/Lexical/editor.module.scss";
import ToolBar from "./plugin/toolbar";
import cn from "@/lib/utils/cn";

interface Props<T extends FieldValues> {
  label: string;
  isRequired: boolean;
  name: Path<T>;
  control: Control<T>;
  height: number;
  error?: {
    message?: string;
  };
}

interface InitialContentPluginProps {
  value?: string;
}

function InitialContentPlugin({ value }: InitialContentPluginProps) {
  const [editor] = useLexicalComposerContext();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    if (value === undefined) {
      return;
    }

    if (value === "") {
      initialized.current = true;
      return;
    }

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(value, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();

      root.clear();

      if (nodes.length > 0) {
        root.append(...nodes);
      }

      initialized.current = true;
    });
  }, [editor, value]);

  return null;
}

interface EditorContentHandlerProps {
  onChange: (value: string) => void;
}

function EditorContentHandler({ onChange }: EditorContentHandlerProps) {
  const [editor] = useLexicalComposerContext();

  return (
    <OnChangePlugin
      onChange={() => {
        editor.getEditorState().read(() => {
          const html = $generateHtmlFromNodes(editor);
          onChange(html);
        });
      }}
    />
  );
}

export default function ReactEditor<T extends FieldValues>({
  label,
  isRequired,
  control,
  name,
  height,
  error,
}: Props<T>) {
  const hasError = !!error;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={styles.container}>
          <div className={styles.header}>
            <label className={cn(styles.label)}>{label}</label>

            {isRequired ? <span className={styles.isRequired}>*</span> : null}
          </div>

          <div className={`${styles.body} ${hasError ? styles.bodyError : ""}`}>
            <LexicalComposer
              initialConfig={{
                namespace: "EducationalResourceEditor",
                onError: (error: Error) => {
                  console.error(error);
                },
                nodes: [ListNode, ListItemNode],
              }}
            >
              <ToolBar />

              <RichTextPlugin
                contentEditable={
                  <ContentEditable
                    className={styles.editor}
                    style={{
                      height: `${height}px`,
                      overflow: "auto",
                    }}
                  />
                }
                ErrorBoundary={LexicalErrorBoundary}
              />

              <HistoryPlugin />

              <InitialContentPlugin value={field.value ?? ""} />

              <EditorContentHandler onChange={field.onChange} />

              <CheckListPlugin />

              <ListPlugin />
            </LexicalComposer>
          </div>

          <div className={styles.errorBody}>
            <span className={styles.error}>{error?.message}</span>
          </div>
        </div>
      )}
    />
  );
}
