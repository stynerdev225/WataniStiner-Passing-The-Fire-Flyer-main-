"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit3, Save, X } from 'lucide-react';

interface SimpleTextEditorProps {
    content: string;
    onSave?: (content: string) => void;
    className?: string;
    disabled?: boolean;
}

export default function SimpleTextEditor({
    content,
    onSave,
    className = "",
    disabled = false
}: SimpleTextEditorProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(content);
    const [isSaving, setIsSaving] = useState(false);

    const handleEdit = () => {
        if (!disabled) {
            setEditValue(content);
            setIsEditing(true);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (onSave) {
                await onSave(editValue);
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditValue(content);
        setIsEditing(false);
    };

    return (
        <div className={`group relative ${className}`}>
            {/* Display Mode */}
            {!isEditing && (
                <div className="relative" onClick={handleEdit}>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                    {!disabled && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 bg-white bg-opacity-80 text-gray-700 shadow-sm border border-gray-300 hover:bg-opacity-100"
                                onClick={handleEdit}
                            >
                                <Edit3 className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Mode - NO FRAMES */}
            {isEditing && (
                <div className="relative">
                    <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full min-h-[40px] p-2 resize-none bg-transparent"
                        style={{
                            color: 'inherit',
                            fontSize: 'inherit',
                            fontFamily: 'inherit',
                            fontWeight: 'inherit',
                            lineHeight: 'inherit',
                            letterSpacing: 'inherit',
                            textAlign: 'inherit',
                            textShadow: 'inherit',
                            textTransform: 'inherit',
                            background: 'rgba(255, 255, 255, 0.9)',
                            outline: 'none',
                            border: 'none'
                        }}
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                                handleSave();
                            }
                            if (e.key === 'Escape') {
                                handleCancel();
                            }
                        }}
                    />

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-2">
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
                    <div className="text-xs text-gray-500 mt-1">
                        Press Ctrl+Enter to save, Esc to cancel
                    </div>
                </div>
            )}
        </div>
    );
}
