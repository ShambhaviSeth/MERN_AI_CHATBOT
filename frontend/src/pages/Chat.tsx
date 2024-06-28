import React, { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Box, Avatar, Typography, Button, IconButton } from '@mui/material'
import { useAuth } from "../context/AuthContext";
import red from "@mui/material/colors/red"
import Chatitem from "../components/chat/Chatitem";
import { IoMdSend } from 'react-icons/io'
import { deleteUserChats, getUserChats, sendChatRequest } from "../helpers/api-communicator";
import { Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom'

type Message = {
    role: "user" | "assistant",
    content: string
}

const Chat = () => {
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement | null> (null);
    const auth = useAuth();      
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const handleSubmit = async() => {
        const content = inputRef.current?.value as string;
        if (inputRef && inputRef.current) {
            inputRef.current.value = "";
        }
        const newMessage: Message = { role: "user", content};
        setChatMessages((prev) => [...prev, newMessage])
        const chatData = await sendChatRequest(content);
        setChatMessages([...chatData.chats]);

    }
    const handleDeleteChats = async() => {
        try {
            toast.loading("Deleting chats", {id: "deleteChats"});
            await deleteUserChats();
            setChatMessages([])
            toast.success("Chats deleted successfully", {id: 'deleteChats'})
        } catch (error) {
            toast.error("Deleting chats failed", {id: 'deleteChats'})
        }
    }

    useLayoutEffect(() => {
        if (auth?.isLoggedIn && auth.user){
            toast.loading("Loading chats", {id: 'loadchats'});
            getUserChats().then((data) => {
                setChatMessages([...data.chats]);
                toast.success("Chats loaded successfully", {id: 'loadchats'})
            }).catch(err => {
                toast.error("Loading failed", {id: 'loadchats'})
        })
        }
    }, [auth])

    useEffect(() => {
        if (!auth?.user){
            return navigate("/login");
        }
    }, [auth])

    return (
        <Box
            sx = {{
                display: "flex",
                flex: 1,
                width: "100%",
                height: "100%",
                mt: 3,
                gap: 3
            }}
        >
            <Box sx = {{ display: { md: "flex", xs: "none", sm: "none"}, flex: 0.2, flexDirection: "column"}}>
                <Box sx ={{ display: "flex", width:"100%", height: "60vh", backgroundColor: "rgb(17,29,39)", borderRadius:5, flexDirection:"column", mx: 3 }}>
                    <Avatar sx={{
                        mx: "auto",
                        my: 2,
                        bgcolor: "white",
                        color: "black",
                        fontWeight: 700
                    }}> {auth?.user?.name[0]} {auth?.user?.name.split(" ")[1][0]} </Avatar>
                    <Typography sx={{ mx: "auto", fontFamily: "work sans"}}> You are talking to a ChatBot</Typography>
                    <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, padding: 3}}> You can ask questions related to anything.</Typography>
                    <Button onClick={handleDeleteChats} sx={{ width: "200px", my: "auto", color: "white", fontWeight:"700", borderRadius: 3, mx:"auto" , bgcolor: red[300], ":hover": {
                        bgcolor: red.A400
                    }}}>Clear Conversation</Button>
                </Box>
            </Box>
            <Box sx={
                {
                    display: "flex",
                    flex: {
                        md: 0.8,
                        xs: 1,
                        sm: 1
                    },
                    px: 3,
                    flexDirection: "column"
                }
            }
            >
                <Typography sx={{
                    textAlign: "center",
                    fontSize: "40px",
                    color: "white",
                    mb: 2,
                    mx: "auto",
                    fontWeight: "600"
                }}> Model GPT-3.5-turbo </Typography>
                < Box sx={{ 
                    width: "100%", 
                    height: "60vh",
                    borderRadius: 3, 
                    mx: "auto", 
                    display:"flex", 
                    flexDirection: "column", 
                    overflow: "scroll", 
                    overflowX: "hidden", 
                    overflowY: "auto" , 
                    scrollBehavior:"smooth"}}>       
                {chatMessages.map((chat, index) => (
                    //@ts-ignore 
                    <Chatitem content={chat.content} role={chat.role} key={index}></Chatitem>))}</Box>
                <div style={{
                    width: "100%", 
                    borderRadius:8, 
                    backgroundColor: "rgb(17,27,39", 
                    display:"flex", 
                    margin:"auto"}}> {" "}
                <input ref={inputRef} type="text" style={{
                    width:"100%", 
                    backgroundColor: "transparent", 
                    padding:"30px", 
                    border: "none", 
                    outline:"none", 
                    color:"white", 
                    fontSize:"20px"}} />
                <IconButton onClick={handleSubmit} sx={{
                    color:"white",
                    ml: "auto",
                    max: 1
                }}>
                    <IoMdSend />
                    </IconButton>    
                </div>
            </Box>
        </Box>
    )

};

export default Chat;