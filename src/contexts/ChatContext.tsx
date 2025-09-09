import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Message, Conversation } from '../types';

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

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

const mockConversations: Conversation[] = [
  {
    id: '1',
    title: 'İkinci Dereceden Denklemler',
    ders: 'Matematik',
    messages: [
      {
        id: '1',
        content: 'İkinci dereceden denklemleri nasıl çözebilirim?',
        sender: 'user',
        timestamp: new Date('2024-01-20T10:00:00'),
        ders: 'Matematik'
      },
      {
        id: '2',
        content: 'Merhaba! Ben Sofia. İkinci dereceden denklemler ax² + bx + c = 0 şeklindedir. Bunları çözmek için birkaç yöntem var: faktörleme, tam kare yapma ve diskriminant formülü. Hangi yöntemi öğrenmek istersin?',
        sender: 'ai',
        timestamp: new Date('2024-01-20T10:00:30'),
        ders: 'Matematik'
      }
    ],
    createdAt: new Date('2024-01-20T10:00:00'),
    updatedAt: new Date('2024-01-20T10:15:00')
  },
  {
    id: '2',
    title: 'Osmanlı İmparatorluğu Tarihi',
    ders: 'Tarih',
    messages: [
      {
        id: '3',
        content: 'Osmanlı İmparatorluğu\'nun kuruluş dönemini anlatabilir misin?',
        sender: 'user',
        timestamp: new Date('2024-01-19T14:30:00'),
        ders: 'Tarih'
      },
      {
        id: '4',
        content: 'Merhaba! Ben Sofia. Osmanlı İmparatorluğu 1299 yılında Osman Gazi tarafından kuruldu. Küçük bir beylik olarak başlayıp zamanla üç kıtaya yayılan büyük bir imparatorluk haline geldi. Kuruluş döneminin önemli özelliklerini açıklayayım...',
        sender: 'ai',
        timestamp: new Date('2024-01-19T14:30:45'),
        ders: 'Tarih'
      }
    ],
    createdAt: new Date('2024-01-19T14:30:00'),
    updatedAt: new Date('2024-01-19T14:45:00')
  }
];

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const createConversation = (ders: string) => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: `Yeni ${ders} Sohbeti`,
      ders,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setConversations(prev => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  };

  const addMessage = (content: string, sender: 'user' | 'ai', ders?: string) => {
    if (!currentConversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      ders
    };

    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, newMessage],
      updatedAt: new Date(),
      title: currentConversation.messages.length === 0 ? content.slice(0, 50) + '...' : currentConversation.title
    };

    setCurrentConversation(updatedConversation);
    setConversations(prev => 
      prev.map(conv => conv.id === currentConversation.id ? updatedConversation : conv)
    );

    // Simulate AI typing and response
    if (sender === 'user') {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const aiResponses = [
          "Merhaba! Ben Sofia. Bu harika bir soru! Bu konuyu adım adım açıklayayım.",
          "Ben Sofia! Bu konuda sana yardımcı olmaktan mutluluk duyarım.",
          "Sofia burada! Bu önemli bir konu. Birlikte öğrenelim!",
          "Ben Sofia, çok güzel bir soru. Detaylı bir açıklama yapayım.",
          "Sofia olarak bu konuyu anlamanız için örneklerle açıklayayım."
        ];
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: randomResponse,
          sender: 'ai',
          timestamp: new Date(),
          ders
        };

        const finalConversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, aiMessage],
          updatedAt: new Date()
        };

        setCurrentConversation(finalConversation);
        setConversations(prev => 
          prev.map(conv => conv.id === currentConversation.id ? finalConversation : conv)
        );
      }, 1500);
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