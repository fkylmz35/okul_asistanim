import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, Bot, User as UserIcon, Loader2 } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { subjects } from '../data/subjects';

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const { currentConversation, addMessage, createConversation, isTyping } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isTyping]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    if (!currentConversation && selectedSubject) {
      createConversation(selectedSubject);
    }

    if (!currentConversation) return;

    addMessage(message, 'user', selectedSubject);
    setMessage('');
  };

  const handleNewChat = () => {
    if (selectedSubject) {
      createConversation(selectedSubject);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full overflow-hidden touch-pan-y">
      <div className="flex flex-col lg:flex-row h-full gap-4 lg:gap-6 overflow-hidden touch-pan-y">
        {/* Subject Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-80 space-y-4 flex-shrink-0 overflow-y-auto max-h-48 lg:max-h-none touch-pan-y"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <h2 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-2 lg:mb-4">Ders Seçin</h2>
          <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm mb-2 lg:mb-4">Sofia hangi konuda sana yardım etsin?</p>
          
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-3">
            {subjects.map((subject, index) => (
              <motion.button
                key={subject.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedSubject(subject.name)}
                className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                  selectedSubject === subject.name
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-500 text-white shadow-lg'
                    : 'bg-white/80 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${subject.color}`}>
                    <div className="w-4 h-4 bg-white rounded-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm lg:text-base">{subject.name}</h3>
                    <p className="text-xs opacity-75 truncate">{subject.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {selectedSubject && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button onClick={handleNewChat} className="w-full">
                <Plus className="w-3 h-3 lg:w-4 lg:h-4 mr-2" />
                Sofia ile {selectedSubject} Öğren
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1 flex flex-col min-h-0 overflow-hidden touch-pan-y"
        >
          <Card className="flex-1 flex flex-col min-h-0 overflow-hidden touch-pan-y">
            {/* Chat Header */}
            <div className="p-3 lg:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-base lg:text-xl font-bold text-gray-900 dark:text-white">
                {currentConversation ? `Sofia - ${currentConversation.ders} Asistanı` : 'Başlamak için bir ders seçin'}
              </h2>
              {currentConversation && (
                <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">{currentConversation.title}</p>
              )}
            </div>

            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto overflow-x-hidden p-3 lg:p-6 space-y-3 lg:space-y-4 min-h-0 touch-pan-y" 
              style={{ 
                WebkitOverflowScrolling: 'touch',
                height: 'calc(100vh - 280px)',
                maxHeight: 'calc(100vh - 280px)'
              }}
            >
              {!currentConversation ? (
                <div className="text-center text-gray-600 dark:text-gray-400 mt-8 lg:mt-20">
                  <Bot className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-base lg:text-lg">Bir ders seçin ve sohbete başlayın</p>
                  <p className="text-xs lg:text-sm">Sofia öğrenmenize yardımcı olmaya hazır</p>
                </div>
              ) : (
                <>
                  <AnimatePresence>
                    {currentConversation.messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex space-x-2 lg:space-x-3 max-w-xs lg:max-w-md ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.sender === 'user' 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                              : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                          }`}>
                            {msg.sender === 'user' ? (
                              <UserIcon className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                            ) : (
                              <Bot className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                            )}
                          </div>
                          <div className={`p-2 lg:p-3 rounded-2xl ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                          }`}>
                            <p className="text-xs lg:text-sm leading-relaxed">{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {msg.timestamp.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="flex space-x-2 lg:space-x-3 max-w-xs lg:max-w-md">
                        <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-500">
                          <Bot className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                        </div>
                        <div className="p-2 lg:p-3 rounded-2xl bg-gray-100 dark:bg-gray-700">
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-3 lg:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <div className="flex space-x-2 lg:space-x-4">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedSubject ? `Sofia'ya ${selectedSubject} hakkında sor...` : 'Önce bir ders seçin...'}
                  disabled={!selectedSubject}
                  rows={1}
                  className="flex-1 px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-purple-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-purple-500/20 transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50 resize-none"
                  style={{ minHeight: '40px', maxHeight: '80px' }}
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!message.trim() || !selectedSubject || isTyping}
                  className="px-3 lg:px-4 h-10 lg:h-12"
                >
                  {isTyping ? (
                    <Loader2 className="w-4 h-4 lg:w-5 lg:h-5 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 lg:w-5 lg:h-5" />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;