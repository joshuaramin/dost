"use client"

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
    TbAlignCenter,
    TbAlignJustified,
    TbAlignLeft,
    TbAlignRight,
    TbArrowBack,
    TbArrowForward,
    TbBold,
    TbItalic,
    TbStrikethrough,
    TbUnderline,
    TbListNumbers,
    TbList
} from 'react-icons/tb'
import styles from '@/styles/components/Lexical/toolbar.module.scss';
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND
} from "@lexical/list";

import {
    $getSelection,
    $isRangeSelection,
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    REDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    UNDO_COMMAND
} from 'lexical'



const LowPriority = 1;

function Divider() {
    return <div className={styles.divider} />
}



const blockTypeName = {
    bullet: "Bulleted List",
    number: "Numbered List",
    paragraph: "Normal"
}

export default function ToolBar() {

    const [editor] = useLexicalComposerContext();
    const toolbarRef = useRef(null);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isStrikeThrough, setIsStrikethrough] = useState(false);
    const [isAlignLeft, setIsAlignLeft] = useState(false);
    const [isAlignRight, setIsAlignRight] = useState(false);
    const [isAlignCenter, setIsAlignCenter] = useState(false);
    const [isAlignJustify, setIsAlignJustify] = useState(false);

    const [blockType, setBlockType] = useState<keyof typeof blockTypeName>("paragraph")


    const $updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
        }
    }, [])


    useEffect(() => {
        return mergeRegister(editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                $updateToolbar();
            });
        })),
            editor.registerCommand(SELECTION_CHANGE_COMMAND, (_payload, _newEditor) => {
                $updateToolbar();
                return false;
            }, LowPriority),
            editor.registerCommand(CAN_UNDO_COMMAND, (payload) => {
                setCanUndo(payload);
                return false
            }, LowPriority),
            editor.registerCommand(CAN_REDO_COMMAND, (payload) => {
                setCanRedo(payload);
                return false
            }, LowPriority);
    }, [editor, $updateToolbar])


    const formatList = (listType: string) => {
        console.log(blockType);
        if (listType === "number" && blockType !== "number") {
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            setBlockType("number");
        } else if (listType === "bullet" && blockType !== "bullet") {
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            setBlockType("bullet");
        } else {
            editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            setBlockType("paragraph");
        }
    };


    return (
        <div className={styles.container} ref={toolbarRef}>
            <div>
                <button disabled={!canUndo} onClick={() => {
                    editor.dispatchCommand(UNDO_COMMAND, undefined)
                }}>
                    <TbArrowBack size={18} />
                </button>
                <button disabled={!canRedo} onClick={() => {
                    editor.dispatchCommand(REDO_COMMAND, undefined)
                }}>
                    <TbArrowForward size={18} />
                </button>
                <Divider />
            </div>
            <div>
                <button className={isBold ? `${styles.active}` : ''} onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
                    setIsBold(() => !isBold)
                }}>
                    <TbBold size={18} />
                </button>
                <button className={isItalic ? `${styles.active}` : ''} onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')
                    setIsItalic(() => !isItalic)
                }}>
                    <TbItalic size={18} />
                </button>
                <button className={isUnderline ? `${styles.active}` : ''} onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')
                    setIsUnderline(() => !isUnderline)
                }}>
                    <TbUnderline size={18} />
                </button>
                <button className={isStrikeThrough ? `${styles.active}` : ''} onClick={() => {
                    editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')
                    setIsStrikethrough(() => !isStrikeThrough)
                }}>
                    <TbStrikethrough size={18} />
                </button>
                <Divider />
            </div>
            <div>
                <button className={isAlignLeft ? `${styles.active}` : ''} onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')
                    setIsAlignLeft(() => !isAlignLeft)
                }}>
                    <TbAlignLeft size={18} />
                </button>
                <button className={isAlignRight ? `${styles.active}` : ''} onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')
                    setIsAlignRight(() => !isAlignRight)
                }}>
                    <TbAlignRight size={18} />
                </button>
                <button className={isAlignCenter ? `${styles.active}` : ''} onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')
                    setIsAlignCenter(() => !isAlignCenter)
                }}>
                    <TbAlignCenter size={18} />
                </button>
                <button className={isAlignJustify ? `${styles.active}` : ''} onClick={() => {
                    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify')
                    setIsAlignJustify(() => !isAlignJustify)
                }}>
                    <TbAlignJustified size={18} />
                </button>
                <Divider />
            </div>
            <div>
                <button className={blockType === "number" ? `${styles.active}` : ''} onClick={() => {
                    formatList("number")
                }
                }>
                    <TbListNumbers size={18} />
                </button>
                <button className={blockType === "bullet" ? `${styles.active}` : ''} onClick={() => {
                    formatList("bullet")
                }}>
                    <TbList size={18} />
                </button>
            </div>
        </div >
    )
}