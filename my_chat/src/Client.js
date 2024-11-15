import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  Avatar,
  ConversationHeader,
  TypingIndicator,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import { socket } from './socket';
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
function Client() {
  
  let [searchParams, setSearchParams] = useSearchParams();
    const [arr,setArr] = useState([
        {
            direction: 'incoming',
            message: 'Chào bạn đã đến với cửa hàng của chúng tôi !<br>Chúng tôi có thể giúp được gì cho bạn không ?',
            position: 'single',
            sender: 'Admin',
            avatarURL : "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        }
        ,
        {
            direction: 'outgoing',
            message: 'conmemay',
            position: 'single',
            sender: 'Bàn 1',
            avatarURL : "https://avatarfiles.alphacoders.com/375/375590.png"
        }
    ])
    const onConnect =()=>{
        console.log("COnect"+socket.id);
        
    }
    const onDisconnect =()=>{
        console.log("Dis"+socket.id);
    }
    const onAdminSend = (data)=>{
      setArr((prev) =>{
        return[...prev,
            {
              direction: 'incoming',
              message: data,
              position: 'single',
              sender: 'Admin',
              avatarURL : "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
            }
        ]
      })
    }
    const onMsgOld =(data)=>{
      setArr([
        {
            direction: 'incoming',
            message: 'Chào bạn đã đến với cửa hàng của chúng tôi !<br>Chúng tôi có thể giúp được gì cho bạn không ?',
            position: 'single',
            sender: 'Admin',
            avatarURL : "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
        }
        ,
        {
            direction: 'outgoing',
            message: 'conmemay',
            position: 'single',
            sender: 'Bàn 1',
            avatarURL : "https://avatarfiles.alphacoders.com/375/375590.png"
        }
      ])
      data.forEach(element => {
        setArr((prev) =>{
          return[...prev,
              {
                direction: element.id ? 'incoming' :'outgoing',
                message: element.msg,
                position: 'single',
                sender:  element.id ? 'Admin' :'Bàn 1' ,
                avatarURL : element.id ==0? "https://avatarfiles.alphacoders.com/375/375590.png" : "https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg",
                status:"available",
              }
          ]
        })
      });
    }
    useEffect(() => {
        socket.emit('join_room',searchParams.get("id"))
        socket.on('connect', onConnect);
        socket.on('server_send_old_msg', onMsgOld);
        socket.on('disconnect', onDisconnect);
        socket.on('admin_send',onAdminSend)
        return () => {
          socket.off('connect', onConnect);
          socket.off('server_send_old_msg', onMsgOld);
          socket.off('disconnect', onDisconnect);
          socket.off('admin_send',onAdminSend);
        };
      }, []);
  return (
   <MainContainer
    responsive
    style={{ position: "fixed",margin:'20px' ,bottom:'20px' , right:'20px', height: "500px" }}
    >
  <ChatContainer>
    <ConversationHeader>
      <ConversationHeader.Back />
      <Avatar
        name="Zoe"
        src="https://chatscope.io/storybook/react/assets/zoe-E7ZdmXF0.svg"
      />
      <ConversationHeader.Content
        info="Nhà hàng"
        userName="Chăm sóc khách hàng"
      />
    </ConversationHeader>
    <MessageList typingIndicator={<TypingIndicator content="Zoe is typing" />}>
    {
        arr.map((val,idx)=>
            <Message
            key={idx}
            model={{
            direction: val.direction,
            message: val.message,
            position: val.position,
            sender: val.sender,
            }}
            >
            <Avatar
            onMouseOver={()=>{
            // console.log(val.sender);
            }}
            name="Zoe"
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
      socket.emit("client_request",textContent)
        setArr((prev) =>{
            return[...prev,
                {
                    direction: 'outgoing',
                    message: textContent,
                    position: 'single',
                    sender: 'Bàn 1',
                    avatarURL : "https://avatarfiles.alphacoders.com/375/375590.png"
                }
            ]
        })
    }}
    placeholder="Bạn cần hỗ trợ gì..." />
  </ChatContainer>
</MainContainer>
  );
}

export default Client;
