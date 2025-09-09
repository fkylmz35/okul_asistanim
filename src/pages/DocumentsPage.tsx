import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, MessageCircle, ArrowRight, Search } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useChat } from '../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';

const DocumentsPage: React.FC = () => {
  const { conversations, selectConversation } = useChat();
  const navigate = useNavigate();

  const handleOpenConversation = (conversationId: string) => {
    selectConversation(conversationId);
    navigate('/chat');
  };

  const groupedConversations = conversations.reduce((acc, conv) => {
    if (!acc[conv.ders]) {
      acc[conv.ders] = [];
    }
    acc[conv.ders].push(conv);
    return acc;
  }, {} as Record<string, typeof conversations>);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sofia ile Geçmiş Sohbetler</h1>
        <p className="text-gray-600 dark:text-gray-400">Sofia ile yaptığın sohbetleri ve öğrenme ilerlemenizi incele</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Sohbetlerde ara..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>
      </motion.div>

      {conversations.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Henüz Sofia ile sohbet yok</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Sofia ile ilk sohbetini başlat ve öğrenme geçmişin burada görünsün</p>
            <Button onClick={() => navigate('/chat')}>Sofia ile İlk Sohbetini Başlat</Button>
          </Card>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedConversations).map(([ders, convs], groupIndex) => (
            <motion.div
              key={ders}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + groupIndex * 0.1 }}
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <div className="w-3 h-3 bg-blue-500 dark:bg-purple-500 rounded-full mr-3" />
                {ders}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400 font-normal">({convs.length} sohbet)</span>
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {convs.map((conversation, index) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Card className="p-6 cursor-pointer group" hover onClick={() => handleOpenConversation(conversation.id)}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                            {conversation.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400 text-sm">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {conversation.updatedAt.toLocaleDateString('tr-TR')}
                            </div>
                            <div className="flex items-center">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {conversation.messages.length} mesaj
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-purple-400 transition-colors" />
                      </div>
                      
                      {conversation.messages.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mt-3">
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                            <span className="text-blue-600 dark:text-purple-400 font-medium">Sofia:</span> {' '}
                            {conversation.messages[conversation.messages.length - 1].content}
                          </p>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;