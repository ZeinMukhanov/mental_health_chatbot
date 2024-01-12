import { useState } from 'react'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator, ConversationHeader, Avatar, InfoButton } from '@chatscope/chat-ui-kit-react';


function App() {
  const API_KEY = ''; // put your key
  const [messages, setMessages] = useState([
   {
     message: 'Hello, my name is Akylzhan, I am your personal mental health assistant!',
     sender: 'Assistant'
   }
 ])
 const [type, setType] = useState(false)
 const handleSend = async (message) => {
   const newMessage = {
     message: message,
     sender: 'user',
     direction: 'outgoing',
   };
   const newMessages = [...messages, newMessage];
   setMessages(newMessages);
   setType(true);
   await processMessageToChat(newMessages);
 };


 async function processMessageToChat(chatmessages) {
   let apiMessages = chatmessages.map((messgeObject => {
     let role = ''
     if (messgeObject.sender === 'Assistant') {
       role = 'assistant'
     } else {
       role = 'user'
     }
     return {role: role, content: messgeObject.message}
   }))


   //Fine-tuning and prompt here
   const prompt = 'Imagine that you are a mental health support bot and the user is coming to you with a particular mental health issue or a problem related to his/her mood, do your best to assist the user by asking the further details of his/her condition and suggest a possible solution, if the condition of the user is severe, suggest him/her to make an appointment with a psychotherapist.'
   const SystemMessages = {
     role: 'system',
     content: prompt
   }
   const apiRequestBody = {
     'model': 'gpt-3.5-turbo',
     'messages': [
       SystemMessages,
       ...apiMessages
     ]
   }


   await fetch('https://api.openai.com/v1/chat/completions', {
     method: 'POST',
     headers: {
       'Authorization': "Bearer " + API_KEY,
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(apiRequestBody)
   })
     .then((data) => data.json())
     .then((data) => {
       const responseContent = data.choices[0]?.message?.content || '';
      
       // update state with the response from the API
       const responseMessage = {
         message: responseContent,
         sender: 'Assistant',
       };


       const updatedMessages = [...chatmessages, responseMessage];
       setMessages(updatedMessages);
       setType(false);
     });
 }

//update message state
//send it over to chat
 return (
   <div className='App'>
     <div style={{position: 'relative', height: '700px', width: '700px'}}>
       <MainContainer>
         <ChatContainer>
           <ConversationHeader>
            <Avatar src="https://cdn-icons-png.flaticon.com/512/5987/5987424.png" name={"Akylzhan"} status="available" />
            <ConversationHeader.Content userName="Akylzhan" info="Mental Health Assistant" />
            <ConversationHeader.Actions>
              <InfoButton title='Analytics'></InfoButton>
            </ConversationHeader.Actions>
           </ConversationHeader>
           <MessageList
               scrollBehavior="smooth"
               typingIndicator={type ? <TypingIndicator content="Akylzhan is typing" /> : null} >
               {messages.map((message, i)=>{
                 return <Message key={i} model={message} className='responseText'/>
               })}
           </MessageList>
           <MessageInput placeholder='Type your message' onSend={handleSend} className='inputText'/>
         </ChatContainer>
       </MainContainer>
     </div>
   </div>
 )
}


export default App



