import { convertToRaw, EditorState, ContentState } from "draft-js";
import { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import '@/assets/css/editor.css'
import draftToHtml from "draftjs-to-html";
import htmlToDraft from 'html-to-draftjs'
import { Fragment } from "react";
export default function RichEditor(props: any) {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [text, setText] = useState();
    const onEditorStateChange = function (editorState: any) {
        setEditorState(editorState);
        const { blocks } = convertToRaw(editorState.getCurrentContent());
        // 文本内容
        let text = editorState.getCurrentContent().getPlainText("\u0001");
        // html结构
        let htmlContent = draftToHtml(convertToRaw(editorState.getCurrentContent()))
        setText(text);
        props.setEditorContent(htmlContent)
    };
    useEffect(() => {
        if (props.content) {
            toDraft(props.content)
        }
    }, [props.content])

    // 设置富文本框内容
    const toDraft = (value: string) => {
        const blocksFromHtml = htmlToDraft(value);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState: any = EditorState.createWithContent(contentState);
        setEditorState(editorState)
    }

    return (
        <>
            <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={onEditorStateChange}
                mention={{
                    separator: " ",
                    trigger: "@",
                    suggestions: [
                        { text: "APPLE", value: "apple" },
                        { text: "BANANA", value: "banana", url: "banana" },
                        { text: "CHERRY", value: "cherry", url: "cherry" },
                        { text: "DURIAN", value: "durian", url: "durian" },
                        { text: "EGGFRUIT", value: "eggfruit", url: "eggfruit" },
                        { text: "FIG", value: "fig", url: "fig" },
                        { text: "GRAPEFRUIT", value: "grapefruit", url: "grapefruit" },
                        { text: "HONEYDEW", value: "honeydew", url: "honeydew" }
                    ]
                }}
            />
        </>
    );
}
