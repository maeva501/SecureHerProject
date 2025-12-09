import React, { useState, useEffect, useRef } from 'react';
import { FiMessageSquare, FiX, FiSend, FiHeadphones } from 'react-icons/fi';
import './Message.css'; 

// Définition du type pour un message, incluant l'horodatage
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string; // Ex: '23:45'
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

const ProfessionalChatbotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bienvenue ! Je suis votre assistant IA. Comment puis-je vous assister aujourd'hui ?",
      sender: 'bot',
      timestamp: formatTime(new Date()),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fonction pour simuler la réponse du chatbot
  const simulateBotResponse = (userMessage: string) => {
    setIsTyping(true);

    setTimeout(() => {
      let responseText = `J'ai analysé votre requête sur "${userMessage}". Nous sommes en train de générer une réponse détaillée.`;
      
      if (userMessage.toLowerCase().includes('aide') || userMessage.toLowerCase().includes('support')) {
        responseText = "Notre équipe de support est disponible 24/7. Voulez-vous que je crée un ticket pour vous ?";
      } else if (userMessage.toLowerCase().includes('prix') || userMessage.toLowerCase().includes('tarif')) {
        responseText = "Veuillez consulter notre page de tarification pour les détails. Elle est accessible via le menu principal.";
      }

      const botMessage: Message = {
        id: Date.now() + 1,
        text: responseText,
        sender: 'bot',
        timestamp: formatTime(new Date()),
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setIsTyping(false);
    }, 1500); 
  };

  // Gestion de l'envoi du message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput === '' || isTyping) return;

    const newMessage: Message = {
      id: Date.now(),
      text: trimmedInput,
      sender: 'user',
      timestamp: formatTime(new Date()),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
    simulateBotResponse(trimmedInput);
  };
  
  // Effet pour défiler vers le bas (Animation de défilement)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]); // Défilement quand les messages/état changent

  // Effet pour l'initialisation de l'ouverture
  useEffect(() => {
      // Pour simuler un message initial après 500ms si vous voulez
      // if (isOpen && messages.length === 0) { ... }
  }, [isOpen]);

  return (
    <div className="pro-chatbot-container">
      {/* Fenêtre du Chatbot */}
      <div className={`pro-chatbot-window ${isOpen ? 'is-open' : ''}`}>
        <header className="pro-chatbot-header">
          <div className="header-info">
            <div className="bot-avatar"><FiHeadphones size={20} /></div>
            <div>
              <h3 className="bot-name">Support IA Pro</h3>
              <p className={`status ${isTyping ? 'typing' : 'online'}`}>
                {isTyping ? 'Tape...' : 'En ligne'}
              </p>
            </div>
          </div>
          <button 
            className="close-button"
            onClick={() => setIsOpen(false)}
            aria-label="Fermer le Chatbot"
          >
            <FiX size={24} />
          </button>
        </header>
        
        <div className="pro-chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-row ${msg.sender}`}>
              <div className="message-bubble">
                <p className="message-text">{msg.text}</p>
                <span className="message-timestamp">{msg.timestamp}</span>
              </div>
            </div>
          ))}
          
          {/* Indicateur de frappe */}
          {isTyping && (
            <div className="message-row bot typing-row">
              <div className="message-bubble typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          
          {/* Référence pour le défilement */}
          <div ref={messagesEndRef} />
        </div>

        <form className="pro-chatbot-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrivez un message..."
            disabled={isTyping}
          />
          <button 
            type="submit" 
            disabled={input.trim() === '' || isTyping}
            className="send-button"
            aria-label="Envoyer"
          >
            <FiSend size={20} />
          </button>
        </form>
      </div>

      {/* Bouton d'Ouverture/Fermeture */}
      {!isOpen && (
        <button 
          className="pro-chatbot-toggle-button"
          onClick={() => setIsOpen(true)}
          aria-label="Ouvrir le Chatbot"
        >
          <FiMessageSquare size={28} />
        </button>
      )}
    </div>
  );
};

export default ProfessionalChatbotWidget;