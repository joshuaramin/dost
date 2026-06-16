"use client"


import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { EditorState } from 'lexical';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import styles from '@/styles/components/Lexical/editor.module.scss';
import ToolBar from './plugin/toolbar';
import { $generateHtmlFromNodes } from '@lexical/html';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import { VolkhovLight } from '@/lib/typography';
import cn from '@/lib/utils/cn';
import { FieldError } from 'react-hook-form';
import { ListItemNode, ListNode } from '@lexical/list';
import { PrimaryFont } from '@/lib/typography';

interface Props {
    label: string
    isRequired: boolean
    name: string
    setValue: any
    height: number
    error: FieldError | undefined;
}

interface InitialConfig {
    namespace: string;
    onError: (error: Error) => void;
}

const EditorContentHandler = ({ name, setValue }: any) => {
    const [editor] = useLexicalComposerContext();

    const onChange = (editorState: EditorState) => {
        editorState.read(() => {
            const html = $generateHtmlFromNodes(editor);

            setValue(name, html)
        });

    };

    return <OnChangePlugin onChange={onChange} />;
};

export default function ReactEditor({ label, isRequired, setValue, error, name, height }: Props) {

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <label className={cn(styles.label)}>{label}</label>
                {isRequired ? <span className={styles.isRequired}>*</span> : null}
            </div>
            <div className={styles.body}>
                <LexicalComposer initialConfig={{
                    namespace: 'Editor',
                    onError: (error: Error) => {
                        console.error(error.message);
                    },
                    nodes: [ListNode, ListItemNode]
                }}>
                    <ToolBar />
                    <RichTextPlugin
                        contentEditable={<ContentEditable className={styles.editor} style={{
                            height: `${height}px`,
                            overflow: "auto"
                        }} />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <HistoryPlugin />
                    <EditorContentHandler name={name} setValue={setValue} />
                    <CheckListPlugin />
                    <ListPlugin />
                </LexicalComposer>
            </div>
            <div className={styles.errorBody}>
                <span className={styles.error}>{error?.message}</span>
            </div>
        </div>
    );
}
