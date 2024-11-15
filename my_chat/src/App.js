import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Sidebar,
  Conversation,
  ConversationList,
  Search,
  Avatar,
  ConversationHeader,
  TypingIndicator,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import { useEffect, useState } from "react";
import { socket } from './socket';
import { useSearchParams } from "react-router-dom";
const ConversationTemplate =[
  {
    info:'Vui lòng trả nợ cho tôi',
    lastSenderName:'Bàn 2',
    name:"Bàn 2",
    avatarURL:"https://chatscope.io/storybook/react/assets/lilly-aj6lnGPk.svg",
    status:"available",
    unreadCnt : 3,
    active:false
  },
  {
    info:'conmemay',
    lastSenderName:'Admin',
    name:"Bàn 1",
    avatarURL:"https://avatarfiles.alphacoders.com/375/375590.png",
    status:"available",
    unreadCnt : 0,
    active:true
  },
  {
    info:'Vui lòng trả nợ cho tôi',
    lastSenderName:'Bàn 3',
    name:"Bàn 3",
    avatarURL:"https://chatscope.io/storybook/react/assets/joe-v8Vy3KOS.svg",
    status:"available",
    unreadCnt : 100,
    active:false
  },
  
  {
    info:'Vui lòng trả nợ cho tôi',
    lastSenderName:'Bàn 4',
    name:"Bàn 4",
    avatarURL:"https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg",
    status:"invisible",
    unreadCnt : 0,
    active:false
  },
  {
    info:'Vui lòng trả nợ cho tôi',
    lastSenderName:'Bàn 5',
    name:"Bàn 5",
    avatarURL:"https://chatscope.io/storybook/react/assets/emily-xzL8sDL2.svg",
    status:"away",
    unreadCnt : 0,
    active:false
  },
  
]

function App() {
  let [searchParams, setSearchParams] = useSearchParams();
  const [roomCurrent,SetRoomCurrent] = useState(searchParams.get("id"))
  const [arr,setArr] = useState([
    {
        direction: 'incoming',
        message: 'Hello',
        position: 'single',
        sender: 'Bàn 1',
        avatarURL : "https://avatarfiles.alphacoders.com/375/375590.png",
        status:"available",
    }
    ,
    {
        direction: 'outgoing',
        message: 'conmemay',
        position: 'single',
        sender: 'Admin',
        avatarURL : "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg",
        status:"available",
    }
   
  ])
  const onConnect =()=>{
    console.log("COnect"+socket.id);
  }
  const onDisconnect =()=>{
      console.log("Dis"+socket.id);
  }
  const onClientSend = (data)=>{
    setArr((prev) =>{
      return[...prev,
          {
            direction: 'incoming',
            message: data,
            position: 'single',
            sender: 'Bàn 1',
            avatarURL : "https://avatarfiles.alphacoders.com/375/375590.png",
            status:"available",
          }
      ]
    })
  }
  const onMsgOld =(data)=>{
    setArr([
      {
          direction: 'outgoing',
          message: 'Chào bạn đã đến với cửa hàng của chúng tôi !<br>Chúng tôi có thể giúp được gì cho bạn không ?',
          position: 'single',
          sender: 'Admin',
          avatarURL : "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
      }
      ,
      {
          direction: 'incoming',
          message: 'conmemay',
          position: 'single',
          sender: 'Bàn 1',
          avatarURL : "https://avatarfiles.alphacoders.com/375/375590.png"
      }
    ])
    for (const element of data) {
      setArr((prev) =>{
        return[...prev,
            {
              direction: element.id==0 ? 'incoming' :'outgoing',
              message: element.msg,
              position: 'single',
              sender:  element.id ?  'Admin' :'Bàn 1' ,
              avatarURL : element.id==0 ?  "https://avatarfiles.alphacoders.com/375/375590.png": "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg "  ,
              status:"available",
            }
        ]
      })
    }
   
  }
  useEffect(() => {
    socket.emit('join_room',roomCurrent)
    socket.on('connect', onConnect);
    socket.on('server_send_old_msg', onMsgOld);
    socket.on('disconnect', onDisconnect);
    socket.on('client_send',onClientSend)
    return () => {
      socket.off('connect', onConnect);
      socket.off('server_send_old_msg', onMsgOld);
      socket.off('disconnect', onDisconnect);
      socket.off('client_send',onClientSend);
    };
  }, []);
  return (
    <div style={{ position: "relative", height: "500px" }}>
   <MainContainer
  responsive
  style={{
    height: '600px'
  }}
>
  <Sidebar
    position="left"
  >
    <Search placeholder="Search..." />
    <ConversationList>
      {
        ConversationTemplate.map((val,idx)=><Conversation
        key={idx}
        info={val.info}
        lastSenderName={val.lastSenderName}
        name={val.name}
        active ={ val.active}
        unreadCnt={val.unreadCnt}
        onClick={(e)=>{
          setSearchParams('?id='+(idx+1))
          SetRoomCurrent((idx+1))
          socket.emit('leave_room',searchParams.get("id"))
          socket.emit('join_room',`${idx+1}`)
        }}
        >
        <Avatar
          name={val.name}
          src={val.avatarURL}
          status={val.status}
        />
      </Conversation>)
      }
      
    </ConversationList>
  </Sidebar>
  <ChatContainer>
    <ConversationHeader>
      <ConversationHeader.Back />
      <Avatar
        name= {ConversationTemplate[roomCurrent-1].name}
        src={ConversationTemplate[roomCurrent-1].avatarURL}
      />
      <ConversationHeader.Content
        info="Hoạt động 10 mins ago"
        userName={ConversationTemplate[roomCurrent-1].name}
      />
    </ConversationHeader>
    <MessageList typingIndicator={<TypingIndicator content="Goku is typing" />}>
    <MessageSeparator></MessageSeparator>
    {
        arr.map((val,ind)=>
            <Message
            key={ind}
            model={{
              direction: val.direction,
              message: val.message,
              position: val.position,
              sender: val.sender,
            }}
            >
            <Avatar
            onMouseOver={()=>{
              console.log(val.sender);
            }}
            name="Zoe"
            status={val.status}
            src={val.avatarURL}
            />
        </Message>
        )
    }
    </MessageList>
    <MessageInput 
    autoFocus 
    attachButton={false}
    onSend={(innerHtml,textContent)=>{
      socket.emit("admin_request",textContent)
      setArr((prev) =>{
          return[...prev,
              {
                  direction: 'outgoing',
                  message: textContent,
                  position: 'single',
                  sender: 'Admin',
                  avatarURL : "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
              }
          ]
      })
  }}
    placeholder="Phản hồi tin nhắn..." />
  </ChatContainer>
</MainContainer>
</div>
  );
}

export default App;
