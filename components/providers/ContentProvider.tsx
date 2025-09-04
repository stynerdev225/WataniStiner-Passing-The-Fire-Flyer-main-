"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ContentData {
    [key: string]: string;
}

interface ContentContextType {
    content: ContentData;
    updateContent: (key: string, value: string) => Promise<void>;
    saveAllContent: () => Promise<void>;
    loadContent: () => Promise<void>;
    isLoading: boolean;
    hasUnsavedChanges: boolean;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function useContent() {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
}

interface ContentProviderProps {
    children: React.ReactNode;
    initialContent?: ContentData;
}

export function ContentProvider({ children, initialContent = {} }: ContentProviderProps) {
    const [content, setContent] = useState<ContentData>(initialContent);
    const [isLoading, setIsLoading] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Load content from your backend/database
    const loadContent = async () => {
        setIsLoading(true);
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/content');
            // const data = await response.json();
            // setContent(data);

            // For now, load from localStorage as fallback
            const savedContent = localStorage.getItem('flyer-content');
            if (savedContent) {
                setContent(JSON.parse(savedContent));
            }
        } catch (error) {
            console.error('Failed to load content:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Save content to your backend/database
    const saveAllContent = async () => {
        setIsLoading(true);
        try {
            // TODO: Replace with actual API call
            // await fetch('/api/content', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(content),
            // });

            // For now, save to localStorage as fallback
            localStorage.setItem('flyer-content', JSON.stringify(content));
            setHasUnsavedChanges(false);
        } catch (error) {
            console.error('Failed to save content:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Update a specific content field
    const updateContent = async (key: string, value: string) => {
        setContent(prev => ({
            ...prev,
            [key]: value
        }));
        setHasUnsavedChanges(true);

        // Auto-save to localStorage immediately
        const updatedContent = { ...content, [key]: value };
        localStorage.setItem('flyer-content', JSON.stringify(updatedContent));

        // TODO: Implement debounced auto-save to backend
        // debouncedSave(updatedContent);
    };

    // Load content on mount
    useEffect(() => {
        loadContent();
    }, []);

    // Save changes on page unload
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasUnsavedChanges]);

    const value: ContentContextType = {
        content,
        updateContent,
        saveAllContent,
        loadContent,
        isLoading,
        hasUnsavedChanges,
    };

    return (
        <ContentContext.Provider value={value}>
            {children}
        </ContentContext.Provider>
    );
}