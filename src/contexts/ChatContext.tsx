import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { Message, Conversation } from '../types';
import { generateChatResponse, isClaudeConfigured } from '../services/claudeApi';

// Mock conversations for development
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    title: 'İkinci Dereceden Denklemler',
    ders: 'Matematik',
    messages: [
      {
        id: 'msg-1',
        content: 'İkinci dereceden denklemleri nasıl çözebilirim?',
        sender: 'user',
        timestamp: new Date('2024-01-20T10:00:00'),
        ders: 'Matematik'
      },
      {
        id: 'msg-2',
        content: 'Merhaba! Ben Sofia. İkinci dereceden denklemler ax² + bx + c = 0 şeklindedir. Bunları çözmek için birkaç yöntem var: faktörleme, tam kare yapma ve diskriminant formülü.',
        sender: 'ai',
        timestamp: new Date('2024-01-20T10:00:30'),
        ders: 'Matematik'
      }
    ],
    createdAt: new Date('2024-01-20T10:00:00'),
    updatedAt: new Date('2024-01-20T10:15:00')
  }
];

interface ChatContextType {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  createConversation: (subject: string) => void;
  addMessage: (content: string, sender: 'user' | 'ai', subject?: string) => void;
  selectConversation: (conversationId: string) => void;
  clearChat: () => void;
  isTyping: boolean;
}

const ChatContext = createContext<ChatContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const { user } = useAuth();

  // Load conversations from Supabase or use mock data
  useEffect(() => {
    if (!user) return;

    const loadConversations = async () => {
      // Development mode - use mock conversations
      if (!isSupabaseConfigured) {
        setConversations(mockConversations);
        return;
      }

      // Production mode - load from Supabase
      try {
        const { data: conversationsData, error } = await supabase
          .from('conversations')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        if (conversationsData) {
          const conversationsWithMessages = await Promise.all(
            conversationsData.map(async (conv) => {
              const { data: messagesData, error: messagesError } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conv.id)
                .order('created_at', { ascending: true });

              if (messagesError) throw messagesError;

              return {
                id: conv.id,
                title: conv.title,
                ders: conv.ders,
                messages: messagesData.map((msg) => ({
                  id: msg.id,
                  content: msg.content,
                  sender: msg.sender as 'user' | 'ai',
                  timestamp: new Date(msg.created_at),
                  ders: msg.ders
                })),
                createdAt: new Date(conv.created_at),
                updatedAt: new Date(conv.updated_at)
              };
            })
          );

          setConversations(conversationsWithMessages);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    };

    loadConversations();
  }, [user]);

  const createConversation = async (ders: string) => {
    if (!user) return;

    // Development mode - create in-memory conversation
    if (!isSupabaseConfigured) {
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        title: `Yeni ${ders} Sohbeti`,
        ders,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
      return;
    }

    // Production mode - save to Supabase
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: `Yeni ${ders} Sohbeti`,
          ders
        })
        .select()
        .single();

      if (error) throw error;

      const newConversation: Conversation = {
        id: data.id,
        title: data.title,
        ders: data.ders,
        messages: [],
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };

      setConversations(prev => [newConversation, ...prev]);
      setCurrentConversation(newConversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  const addMessage = async (content: string, sender: 'user' | 'ai', ders?: string) => {
    if (!currentConversation || !user) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      sender,
      timestamp: new Date(),
      ders
    };

    // Update conversation title if this is the first message
    let newTitle = currentConversation.title;
    if (currentConversation.messages.length === 0) {
      newTitle = content.slice(0, 50) + (content.length > 50 ? '...' : '');
    }

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage],
      updatedAt: new Date(),
      title: newTitle
    };

    setCurrentConversation(updatedConversation);
    setConversations(prev =>
      prev.map(conv => conv.id === currentConversation.id ? updatedConversation : conv)
    );

    // Development mode - just update state
    if (!isSupabaseConfigured) {
      // Generate AI response if user sent message
      if (sender === 'user') {
        setIsTyping(true);

        // Try Claude API first, fallback to mock if not configured
        const generateResponse = async () => {
          try {
            let aiResponse: string;

            if (isClaudeConfigured()) {
              // Use Claude API for real AI response
              const context = ders ? `Ders: ${ders}` : '';
              aiResponse = await generateChatResponse(content, context);
            } else {
              // Fallback to mock responses
              const aiResponses = [
                "Merhaba! Ben Sofia. Bu harika bir soru! Bu konuyu adım adım açıklayayım.",
                "Ben Sofia! Bu konuda sana yardımcı olmaktan mutluluk duyarım.",
                "Sofia burada! Bu önemli bir konu. Birlikte öğrenelim!",
                "Ben Sofia, çok güzel bir soru. Detaylı bir açıklama yapayım.",
                "Sofia olarak bu konuyu anlamanız için örneklerle açıklayayım."
              ];
              await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate thinking
              aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
            }

            const aiMessage: Message = {
              id: `msg-${Date.now() + 1}`,
              content: aiResponse,
              sender: 'ai',
              timestamp: new Date(),
              ders
            };

            setIsTyping(false);

            const finalConversation = {
              ...updatedConversation,
              messages: [...updatedConversation.messages, aiMessage],
              updatedAt: new Date()
            };

            setCurrentConversation(finalConversation);
            setConversations(prev =>
              prev.map(conv => conv.id === currentConversation.id ? finalConversation : conv)
            );
          } catch (error) {
            console.error('Error generating AI response:', error);
            setIsTyping(false);
          }
        };

        generateResponse();
      }
      return;
    }

    // Production mode - save to Supabase
    try {
      // Save message to database
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: currentConversation.id,
          content,
          sender,
          ders
        })
        .select()
        .single();

      if (error) throw error;

      // Update conversation
      if (currentConversation.messages.length === 0) {
        await supabase
          .from('conversations')
          .update({
            title: newTitle,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentConversation.id);
      } else {
        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', currentConversation.id);
      }

      // Generate AI response
      if (sender === 'user') {
        setIsTyping(true);

        try {
          // Use Claude API for real AI response
          const context = ders ? `Ders: ${ders}` : '';
          const aiResponse = await generateChatResponse(content, context);

          const aiMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            content: aiResponse,
            sender: 'ai',
            timestamp: new Date(),
            ders
          };

          // Save AI message to database
          await supabase
            .from('messages')
            .insert({
              conversation_id: currentConversation.id,
              content: aiResponse,
              sender: 'ai',
              ders
            });

          setIsTyping(false);

          const finalConversation = {
            ...updatedConversation,
            messages: [...updatedConversation.messages, aiMessage],
            updatedAt: new Date()
          };

          setCurrentConversation(finalConversation);
          setConversations(prev =>
            prev.map(conv => conv.id === currentConversation.id ? finalConversation : conv)
          );
        } catch (error) {
          console.error('Error generating AI response:', error);
          setIsTyping(false);

          // Fallback to mock response if Claude API fails
          const aiResponses = [
            "Merhaba! Ben Sofia. Bu harika bir soru! Bu konuyu adım adım açıklayayım.",
            "Ben Sofia! Bu konuda sana yardımcı olmaktan mutluluk duyarım.",
            "Sofia burada! Bu önemli bir konu. Birlikte öğrenelim!",
            "Ben Sofia, çok güzel bir soru. Detaylı bir açıklama yapayım.",
            "Sofia olarak bu konuyu anlamanız için örneklerle açıklayayım."
          ];
          const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

          const aiMessage: Message = {
            id: `msg-${Date.now() + 1}`,
            content: randomResponse,
            sender: 'ai',
            timestamp: new Date(),
            ders
          };

          // Save AI fallback response to database
          await supabase
            .from('messages')
            .insert({
              conversation_id: currentConversation.id,
              content: randomResponse,
              sender: 'ai',
              ders
            });

          const finalConversation = {
            ...updatedConversation,
            messages: [...updatedConversation.messages, aiMessage],
            updatedAt: new Date()
          };

          setCurrentConversation(finalConversation);
          setConversations(prev =>
            prev.map(conv => conv.id === currentConversation.id ? finalConversation : conv)
          );
        }
      }
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const selectConversation = (conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    setCurrentConversation(conversation || null);
  };

  const clearChat = () => {
    setCurrentConversation(null);
  };

  return (
    <ChatContext.Provider value={{
      conversations,
      currentConversation,
      createConversation,
      addMessage,
      selectConversation,
      clearChat,
      isTyping
    }}>
      {children}
    </ChatContext.Provider>
  );
};