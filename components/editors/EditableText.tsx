"use client";

import InlineEditor from '@/components/editors/InlineEditor';
import { useContent } from '@/components/providers/ContentProvider';

interface EditableTextProps {
    contentKey: string;
    defaultContent: string;
    className?: string;
    placeholder?: string;
    allowFormatting?: boolean;
    as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
    style?: React.CSSProperties;
    disabled?: boolean;
}

export default function EditableText({
    contentKey,
    defaultContent,
    className = "",
    placeholder,
    allowFormatting = true,
    as = 'div',
    style,
    disabled = false
}: EditableTextProps) {
    const { content, updateContent } = useContent();

    const currentContent = content[contentKey] || defaultContent;

    const handleSave = async (newContent: string) => {
        await updateContent(contentKey, newContent);
    };

    // Generate appropriate editor styles based on the element type
    const getEditorClassName = () => {
        const baseClasses = className;

        // Preserve the original styling for different elements
        switch (as) {
            case 'h1':
                return `text-5xl md:text-8xl font-bold ${baseClasses}`;
            case 'h2':
                return `text-3xl md:text-4xl font-bold ${baseClasses}`;
            case 'h3':
                return `text-2xl md:text-3xl font-bold ${baseClasses}`;
            case 'h4':
                return `text-xl md:text-2xl font-bold ${baseClasses}`;
            case 'h5':
                return `text-lg md:text-xl font-bold ${baseClasses}`;
            case 'h6':
                return `text-base md:text-lg font-bold ${baseClasses}`;
            case 'p':
                return `text-base md:text-lg ${baseClasses}`;
            default:
                return baseClasses;
        }
    };

    return (
        <InlineEditor
            content={currentContent}
            onSave={handleSave}
            placeholder={placeholder || `Edit ${contentKey}...`}
            className={`min-h-[1em] ${className}`}
            editorClassName={getEditorClassName()}
            disabled={disabled}
            allowFormatting={allowFormatting}
        />
    );
}