import React, { useState, useEffect } from 'react';
import { Smile, Reply, Pencil, Trash2 } from 'lucide-react';
import SingleQuiz from '../RoomQuizzes/SingleQuiz';
import ChatInputs from './ChatInputs';
import { useSocket } from '@/hooks/useSocket';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'user',
      name: 'You',
      text: 'Hey! How are you doing?',
      reactions: [
        { emoji: '👍', users: ['Alex', 'John'] },
        { emoji: '❤️', users: ['You'] },
        { emoji: '😂', users: ['Sam', 'Emma'] }
      ]
    },
    { id: 2, sender: 'other', name: 'Alex', text: 'I’m good, thanks! What about you?', reactions: [{ emoji: '❤️', users: ['You', 'Sam'] }, { emoji: '🔥', users: ['Emma'] }] },
    { id: 3, sender: 'user', name: 'You', text: 'All good here! Ready for the meeting?', reactions: [{ emoji: '👍', users: ['Alex', 'Emma'] }] },
    { id: 4, sender: 'other', name: 'Alex', text: 'Check this out! 🚀', emojiOnly: true, reactions: [{ emoji: '😂', users: ['Sam'] }, { emoji: '❤️', users: ['You', 'Emma'] }] },
    { id: 5, sender: 'user', name: 'You', text: 'Here’s an image!', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1500', reactions: [{ emoji: '👍', users: ['Alex'] }] },
    { id: 6, sender: 'other', name: 'Alex', text: 'Nice! Here’s a GIF', gifUrl: 'https://media.giphy.com/media/3ohs4Czz7j46NozUxs/giphy.gif', reactions: [{ emoji: '👍', users: ['You'] }, { emoji: '🔥', users: ['Sam', 'Emma'] }] },
    { id: 7, sender: 'user', name: 'You', text: 'All set for the meeting?', replyTo: 2, reactions: [{ emoji: '❤️', users: ['Alex'] }] },

    {
      id: 9,
      sender: "user",
      name: "You",
      text: "Yo! Hope you're ready to get your brain tickled 😂",
      reactions: [
        { emoji: "👍", users: ["Alex", "John"] },
        { emoji: "❤️", users: ["You"] },
        { emoji: "😂", users: ["Sam", "Emma"] }
      ],
      quiz: {
        title: "💻 The World's Goofiest Coding Quiz",
        description: "Think you can debug a sandwich? Let’s find out with this fun little challenge!",
        difficulty: "Easy",
        category: "Programming",
        participants: 5,
        time: "10m",
        points: 10
      }
    },

    {
      id: 10,
      sender: 'other',
      name: 'Emma',
      quizResult: {
        title: "💻 The World's Goofiest Coding Quiz",
        correct: 7,
        total: 10,
        score: 70,
      },
      reactions: [
        { emoji: '🎉', users: ['You', 'Alex'] },
        { emoji: '👏', users: ['Sam'] },
      ],
    }

  ]);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">

      {/* Messages */}
      <div className="flex-1 p-4 space-y-8 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex flex-col items-start max-w-xs md:max-w-md group">
              <span className="text-xs text-gray-400 mb-1">
                {msg.sender === 'user' ? 'You' : msg.name}
              </span>

              {/* Message Content */}
              <div
                className={`relative px-4 py-2 rounded-lg text-sm break-words ${msg.sender === 'user'
                  ? 'bg-primary/70 text-white rounded-br-none'
                  : 'bg-gray-700/40 text-white rounded-bl-none'
                  }`}
              >
                {msg.replyTo && (
                  <div className="bg-gray-700 text-xs p-2 mb-2 rounded-md">
                    <span className="font-semibold">{messages.find((m) => m.id === msg.replyTo)?.name}</span>:
                    {messages.find((m) => m.id === msg.replyTo)?.text}
                  </div>
                )}

                {msg.text && !msg.emojiOnly && msg.text}

                {/* Only Emoji Message */}
                {msg.emojiOnly && <span className="text-2xl">{msg.text}</span>}

                {/* Image Message */}
                {msg.imageUrl && (
                  <div className="mt-2">
                    <img src={msg.imageUrl} alt="uploaded" className="w-36 h-36 object-cover rounded-md" />
                  </div>
                )}

                {/* GIF Message */}
                {msg.gifUrl && (
                  <div className="mt-2">
                    <img src={msg.gifUrl} alt="gif" className="w-36 h-36 object-cover rounded-md" />
                  </div>
                )}

                {/* Quiz Card */}
                {msg?.quiz && <div className='mt-2'><SingleQuiz /></div>}

                {/* Quiz Participant Result Notification */}
                {msg.quizResult && (
                  <div className="mt-3 bg-gradient-to-br from-[#2d2d2d] to-[#1c1c1c] border-l-4 border-blue-500 rounded-lg p-4 shadow-lg text-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👤</span>
                        <span className="text-green-400 font-semibold">{msg.name}</span>
                      </div>
                      <span className="text-lg" title="Participant Result">🏆</span>
                    </div>
                    <div className="text-sm text-gray-300 mb-1">
                      <span className="font-semibold text-white">{msg.quizResult.title}</span>
                    </div>
                    <div className="text-sm text-gray-300">
                      Scored <span className="text-yellow-300 font-bold">{msg.quizResult.correct}</span> out of{' '}
                      <span className="text-yellow-300">{msg.quizResult.total}</span> (
                      <span className="text-blue-400 font-semibold">{msg.quizResult.score}%</span>)
                    </div>
                  </div>
                )}

                {/* Reactions */}
                <div className="flex gap-3 mt-2">
                  {msg.reactions.map((reaction, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-lg cursor-pointer">{reaction.emoji}</span>
                      <span className="text-xs text-white">{reaction.users.length}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="absolute -bottom-6 right-0 flex gap-3 text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button className="hover:text-white flex items-center gap-1">
                    <Smile size={14} /> React
                  </button>
                  <button className="hover:text-white flex items-center gap-1">
                    <Reply size={14} /> Reply
                  </button>
                  {msg.sender === 'user' && (
                    <>
                      <button className="hover:text-white flex items-center gap-1">
                        <Pencil size={14} /> Edit
                      </button>
                      <button className="hover:text-white flex items-center gap-1">
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input Field with Buttons */}
      <ChatInputs />
    </div>
  );
}
