import { useState, useRef, useEffect } from 'react';
import { AiOutlineSend } from "react-icons/ai";
import { FaChevronDown } from "react-icons/fa";
import { chat_bot_url } from '../helper/web_url';

function ChatBot({setQuery}) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null); 
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [splitResponse, setSplitResponse] = useState(false);
    const textareaRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Load chat data when the component mounts
    useEffect(() => {
        const loadChatData = async () => {
            try {
                const response = await fetch(chat_bot_url);
                // Check if response is OK (status code 200)
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                
                setMessages(data.messages || []);
            } catch (error) {
                console.error('Error loading chat data:', error);
            }
        };
        loadChatData();
    }, []);

    // Scroll to bottom when messages change
    useEffect(scrollToBottom, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!input.trim()) return;
        
        // Add user message to chat
        setMessages(prevMessages => [...prevMessages, { content: input, role: 'user' }]);    
        
        try {
        const response = await fetch(chat_bot_url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: input }),
        });
        
        const data = await response.json();
        
        // Add AI response to chat
        setMessages(prevMessages => [...prevMessages, { content: data.message, role: 'ai' }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prevMessages => [...prevMessages, { content: "Sorry, I couldn't process your request.", role: "ai" }]);
        }
        
        setInput('');
    };

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target;
        if (scrollHeight - scrollTop > clientHeight + 100) {
            setShowScrollButton(true);
        } else {
            setShowScrollButton(false);
        }
    }

    // Clear chat data
    const handleClearChat = async () => {
        try {
            await fetch(chat_bot_url, {
                method: 'DELETE',
            });
            setMessages([]);
        } catch (error) {
            console.error('Error clearing chat data:', error);
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Reset height to auto to calculate new height
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to scrollHeight
        }
    }, [input]);

return (    
    <div className='flex flex-col h-[96vh] w-120 w-[780px] p-4'>
        <div className='flex-grow overflow-y-auto mb-4 space-y-4'
            onScroll={handleScroll}
        >
            {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                    >
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg mr-4 
                                    ${message.role === 'user'
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 text-gray-800'
                            }`}
                        >
                            {message.role == 'ai' && splitResponse ? (message.content.split('\n').map((line, index) => (
                                <button
                                    key={index}
                                    className="bg-gray-300 text-black m-1 p-2 rounded"
                                    // get the data inside " " of line and set it as the query
                                    onClick={() => setQuery(line)}
                                >
                                    {line}
                                </button>
                                ))
                            ) : (
                                <p>{message.content}</p>
                            )}
                        </div>
                    </div>
            ))}
                
                <div ref={messagesEndRef}/>
        </div>
                
        {/* Scroll to bottom button */}
        {showScrollButton && (
            <button
                    onClick={scrollToBottom}
                    className='fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-gray-400 text-white p-3 rounded-full shadow-lg hover:bg-gray-600 focus:outline-none'
            >
                    <FaChevronDown size={24} />
            </button>
        )}

    <form onSubmit={handleSubmit} className='flex items-center space-x-2 mb-4'>
        
        
            <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Type a message...'
                className='flex-grow px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                style={{minHeight: '20px', maxHeight: '200px' }} // Optional: Set a min height
            />
        
            {/*
            <input
                type='text'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Type a message...'
                className='flex-grow px-4 py-2 border text-black rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
        */}
            <button
                type='submit'
                className='bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
                <AiOutlineSend size={24} />
            </button>  
            {/*
            <button
                onClick={handleClearChat}
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                Clear All
            </button>
            
            <button
                className={`bg-blue-500 text-white p-3 rounded ${splitResponse ? 'bg-green-500' : 'bg-blue-500'}`}
                onClick={() => setSplitResponse(!splitResponse)}
            >
                {splitResponse ? 'Disable Split' : 'Enable Split'}
            </button>
        */}
        </form>   
        <div className='flex justify-center'>
            <button
                onClick={handleClearChat}
                className="bg-red-500 text-white mr-8 px-8 py-2 rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
                Clear All
            </button>
            
            <button
                className={`bg-blue-500 text-white px-8 p-3 rounded ${splitResponse ? 'bg-green-500' : 'bg-blue-500'}`}
                onClick={() => setSplitResponse(!splitResponse)}
            >
                {splitResponse ? 'Disable Split' : 'Enable Split'}
            </button>
        </div>
        
    </div>
);
};

export default ChatBot;