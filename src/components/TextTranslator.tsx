/**
 * Text translator component - translates text nodes in the DOM based on language
 */

import React, { useEffect, useRef } from 'react';
import { translationService } from '../services/translationService';

interface TextTranslatorProps {
  children: React.ReactNode;
  language: string;
}

export const TextTranslator: React.FC<TextTranslatorProps> = ({ children, language }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const translationsRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (language === 'en' || !containerRef.current) {
      return;
    }

    // Get all text nodes in the container
    const walker = document.createTreeWalker(
      containerRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );

    const textNodes: Node[] = [];
    let node;
    while ((node = walker.nextNode())) {
      if (node.textContent && node.textContent.trim()) {
        textNodes.push(node);
      }
    }

    // Translate all text nodes
    Promise.all(
      textNodes.map(async (textNode) => {
        const originalText = textNode.textContent || '';
        const trimmed = originalText.trim();

        if (!trimmed || translationsRef.current.has(trimmed)) {
          return;
        }

        try {
          const translated = await translationService.translate(trimmed, language);
          translationsRef.current.set(trimmed, translated);
          
          // Update the text node with translated text
          if (translated !== trimmed) {
            textNode.textContent = originalText.replace(trimmed, translated);
          }
        } catch (error) {
          console.error('Translation error:', error);
        }
      })
    );

    return () => {
      // Cleanup not needed for now
    };
  }, [language]);

  return <div ref={containerRef}>{children}</div>;
};
