"use client";

import { useContent } from '@/components/providers/ContentProvider';
import { Button } from '@/components/ui/button';
import { Save, Upload, AlertCircle } from 'lucide-react';
import { useState } from 'react';

export default function SaveButton() {
    const { hasUnsavedChanges, saveAllContent, isLoading } = useContent();
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = async () => {
        try {
            await saveAllContent();
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    if (!hasUnsavedChanges && !showSuccess) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <Button
                onClick={handleSave}
                disabled={isLoading}
                className={`shadow-lg transition-all duration-300 ${showSuccess
                        ? 'bg-green-600 hover:bg-green-700'
                        : hasUnsavedChanges
                            ? 'bg-orange-600 hover:bg-orange-700 animate-pulse'
                            : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {isLoading ? (
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                ) : showSuccess ? (
                    <Save className="h-4 w-4 mr-2" />
                ) : (
                    <AlertCircle className="h-4 w-4 mr-2" />
                )}
                {isLoading
                    ? 'Saving...'
                    : showSuccess
                        ? 'Saved!'
                        : 'Save Changes'
                }
            </Button>
        </div>
    );
}