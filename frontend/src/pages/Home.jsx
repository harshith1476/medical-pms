import React, { useState } from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import AIChatbot from '../components/AIChatbot'

const Home = () => {
  const [showChatbot, setShowChatbot] = useState(false)

  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />

      {/* AI Chatbot */}
      {showChatbot ? (
        <AIChatbot onClose={() => setShowChatbot(false)} />
      ) : (
        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-20 right-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full p-3.5 shadow-lg hover:shadow-xl transition-all group hover:scale-110"
          style={{ zIndex: 999999 }}
          title="Chat with AI Assistant"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}
    </div>
  )
}

export default Home
