import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Autosave,
    Essentials,
    Paragraph,
    Autoformat,
    ImageInsertViaUrl,
    ImageBlock,
    ImageToolbar,
    AutoImage,
    BlockQuote,
    Bold,
    CKBox,
    CloudServices,
    Link,
    ImageUpload,
    ImageInsert,
    PictureEditing,
    CKBoxImageEdit,
    Heading,
    ImageCaption,
    ImageInline,
    ImageStyle,
    ImageTextAlternative,
    Indent,
    IndentBlock,
    Italic,
    LinkImage,
    List,
    MediaEmbed,
    Table,
    TableToolbar,
    TableCaption,
    TextTransformation,
    TodoList,
    Underline,
    Emoji,
    Mention
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

const LICENSE_KEY = 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjEzNTAzOTksImp0aSI6Ijc5YjQ2MGM0LTAyZmEtNGYzYi1iMzBiLWUxYWRiYzhmYWY5NiIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjE1Yzc5MTE0In0.paXdalgli_09rK5wedzuG1BxU0Zi6cxofdfvAk_CcRG0mXRWUk9Mh5R9hFdBb2CN3fNQgTT1exhL_zcBjXWr2w';

const CLOUD_SERVICES_TOKEN_URL = 'https://9nma36xpt5eg.cke-cs.com/token/dev/15e14f3aa70377592407e96ddd3dffe7805b0cec1158aa40ff67a9d3aece?limit=10';

export default function CkEditorWrapper({ value = '', onChange }) {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);
        return () => setIsLayoutReady(false);
    }, []);

    const { editorConfig } = useMemo(() => {
        if (!isLayoutReady) {
            return {};
        }

        return {
            editorConfig: {
                toolbar: {
                    items: [
                        'undo',
                        'redo',
                        '|',
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        '|',
                        'emoji',
                        'link',
                        'insertImage',
                        'ckbox',
                        'mediaEmbed',
                        'insertTable',
                        'blockQuote',
                        '|',
                        'bulletedList',
                        'numberedList',
                        'todoList',
                        'outdent',
                        'indent'
                    ],
                    shouldNotGroupWhenFull: false
                },
                plugins: [
                    Autoformat,
                    AutoImage,
                    Autosave,
                    BlockQuote,
                    Bold,
                    CKBox,
                    CKBoxImageEdit,
                    CloudServices,
                    Emoji,
                    Essentials,
                    Heading,
                    ImageBlock,
                    ImageCaption,
                    ImageInline,
                    ImageInsert,
                    ImageInsertViaUrl,
                    ImageStyle,
                    ImageTextAlternative,
                    ImageToolbar,
                    ImageUpload,
                    Indent,
                    IndentBlock,
                    Italic,
                    Link,
                    LinkImage,
                    List,
                    MediaEmbed,
                    Mention,
                    Paragraph,
                    PictureEditing,
                    Table,
                    TableCaption,
                    TableToolbar,
                    TextTransformation,
                    TodoList,
                    Underline
                ],
                cloudServices: {
                    tokenUrl: CLOUD_SERVICES_TOKEN_URL
                },
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: 'Paragraph',
                            class: 'ck-heading_paragraph'
                        },
                        {
                            model: 'heading1',
                            view: 'h1',
                            title: 'Heading 1',
                            class: 'ck-heading_heading1'
                        },
                        {
                            model: 'heading2',
                            view: 'h2',
                            title: 'Heading 2',
                            class: 'ck-heading_heading2'
                        },
                        {
                            model: 'heading3',
                            view: 'h3',
                            title: 'Heading 3',
                            class: 'ck-heading_heading3'
                        },
                        {
                            model: 'heading4',
                            view: 'h4',
                            title: 'Heading 4',
                            class: 'ck-heading_heading4'
                        },
                        {
                            model: 'heading5',
                            view: 'h5',
                            title: 'Heading 5',
                            class: 'ck-heading_heading5'
                        },
                        {
                            model: 'heading6',
                            view: 'h6',
                            title: 'Heading 6',
                            class: 'ck-heading_heading6'
                        }
                    ]
                },
                image: {
                    toolbar: [
                        'toggleImageCaption',
                        'imageTextAlternative',
                        '|',
                        'imageStyle:inline',
                        'imageStyle:wrapText',
                        'imageStyle:breakText',
                        '|',
                        'ckboxImageEdit'
                    ]
                },
                initialData: value || '',
                licenseKey: LICENSE_KEY,
                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                    decorators: {
                        toggleDownloadable: {
                            mode: 'manual',
                            label: 'Downloadable',
                            attributes: {
                                download: 'file'
                            }
                        }
                    }
                },
                mention: {
                    feeds: [
                        {
                            marker: '@',
                            feed: []
                        }
                    ]
                },
                placeholder: 'Type or paste your content here!',
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
                }
            }
        };
    }, [isLayoutReady, value]);

    return (
        <div className="main-container">
            <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                <div className="editor-container__editor">
                    <div ref={editorRef}>
                        {editorConfig && (
                            <CKEditor
                                editor={ClassicEditor}
                                config={editorConfig}
                                data={value}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    if (onChange) {
                                        onChange(data);
                                    }
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * This function exists to remind you to update the config needed for premium features.
 * The function can be safely removed. Make sure to also remove call to this function when doing so.
 */
function configUpdateAlert(config) {
    if (configUpdateAlert.configUpdateAlertShown) {
        return;
    }

    const isModifiedByUser = (currentValue, forbiddenValue) => {
        if (currentValue === forbiddenValue) {
            return false;
        }

        if (currentValue === undefined) {
            return false;
        }

        return true;
    };

    const valuesToUpdate = [];

    configUpdateAlert.configUpdateAlertShown = true;

    if (!isModifiedByUser(config.cloudServices?.tokenUrl, '<YOUR_CLOUD_SERVICES_TOKEN_URL>')) {
        valuesToUpdate.push('CLOUD_SERVICES_TOKEN_URL');
    }

    if (valuesToUpdate.length) {
        window.alert(
            [
                'Please update the following values in your editor config',
                'to receive full access to Premium Features:',
                '',
                ...valuesToUpdate.map(value => ` - ${value}`)
            ].join('\n')
        );
    }
}
