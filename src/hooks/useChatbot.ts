import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { DbChatbotCategory, DbChatbotQuestion } from '../lib/types/database';
import { chatbotData as localCategories, type ChatCategory } from '../data/chatbotData';

export function useChatbot() {
  const [categories, setCategories] = useState<ChatCategory[]>(localCategories);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('chatbot_categories').select('*').order('sort_order'),
      supabase.from('chatbot_questions').select('*').order('sort_order'),
    ]).then(([c, q]) => {
      const cats = (c.data as DbChatbotCategory[]) ?? [];
      const questions = (q.data as DbChatbotQuestion[]) ?? [];

      if (cats.length > 0) {
        const result: ChatCategory[] = cats.map(cat => ({
          id: cat.id,
          icon: cat.icon,
          title: { ko: cat.title_ko, en: cat.title_en },
          questions: questions
            .filter(qn => qn.category_id === cat.id)
            .map(qn => ({
              question: { ko: qn.question_ko, en: qn.question_en },
              answer: { ko: qn.answer_ko, en: qn.answer_en },
              action: qn.action as 'openContact' | undefined,
            })),
        }));
        setCategories(result);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return { categories, loading };
}
