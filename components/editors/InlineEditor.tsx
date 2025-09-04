"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Typography from '@tiptap/extension-typography';
import Placeholder from '@tiptap/extension-placeholder';
import Focus from '@tiptap/extension-focus';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X } from 'lucide-react';

interface InlineEditorProps {
    content: string;
    onSave?: (content: string) => void;
    placeholder?: string;
    className?: string;
    editorClassName?: string;
    disabled?: boolean;
    allowFormatting?: boolean;
}

export default function InlineEditor({
    content,
    onSave,
    placeholder = "Click to edit...",
    className = "",
    editorClassName = "",
    disabled = false,
    allowFormatting = true
}: InlineEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: allowFormatting ? {} : false,
                bold: allowFormatting ? {} : false,
                italic: allowFormatting ? {} : false,
                bulletList: allowFormatting ? {} : false,
                orderedList: allowFormatting ? {} : false,
            }),
            Typography,
            Placeholder.configure({
                placeholder,
            }),
            Focus.configure({
                className: 'has-focus',
                mode: 'all',
            }),
            Color.configure({ types: [TextStyle.name] }),
            TextStyle,
        ],
        content,
        editable: !disabled,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            // Auto-save could be implemented here
        },
    });

    useEffect(() => {
        if (editor && !isEditing) {
            editor.commands.setContent(content);
        }
    }, [content, editor, isEditing]);

    const handleSave = async () => {
        if (!editor) return;

        setIsSaving(true);
        try {
            const htmlContent = editor.getHTML();
            if (onSave) {
                await onSave(htmlContent);
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving content:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (editor) {
            editor.commands.setContent(content);
        }
        setIsEditing(false);
    };

    const handleEdit = () => {
        if (!disabled) {
            setIsEditing(true);
            setTimeout(() => {
                editor?.commands.focus();
            }, 100);
        }
    };

    if (!editor) {
        return <div className={className}>Loading...</div>;
    }

    return (
        <div className={`group relative ${className}`}>
            {/* Display Mode */}
            {!isEditing && (
                <div
                    className={`transition-all duration-200 rounded-md p-1 ${editorClassName}`}
                    style={{
                        transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        if (!disabled) {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    onClick={handleEdit}
                >
                    <div
                        dangerouslySetInnerHTML={{ __html: content || placeholder }}
                        className={`${!content ? 'text-gray-400 italic' : ''}`}
                    />
                    {!disabled && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 bg-white bg-opacity-80 text-gray-700 shadow-sm border border-gray-300 hover:bg-opacity-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleEdit();
                                }}
                            >
                                <Edit3 className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Mode */}
            {isEditing && (
                <div className="relative" data-editor="true">
                    <EditorContent
                        editor={editor}
                        className={`max-w-none focus:outline-none ${editorClassName}`}
                        style={{ color: 'inherit !important' }}
                    />

                    {/* Toolbar */}
                    {allowFormatting && (
                        <div className="flex gap-1 my-2 p-2 bg-gray-100 rounded-md border">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                className={`h-7 px-2 text-gray-700 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
                            >
                                <strong>B</strong>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={`h-7 px-2 text-gray-700 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
                            >
                                <em>I</em>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => editor.chain().focus().toggleBulletList().run()}
                                className={`h-7 px-2 text-gray-700 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
                            >
                                •
                            </Button>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-3">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            size="sm"
                            className="h-8 bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Save className="h-3 w-3 mr-1" />
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                            onClick={handleCancel}
                            variant="outline"
                            size="sm"
                            className="h-8 bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                            disabled={isSaving}
                        >
                            <X className="h-3 w-3 mr-1" />
                            Cancel
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}