const chat = document.getElementById("chat")
const input = document.getElementById("userInput")
const chatList = document.getElementById("chatList")

let chats = JSON.parse(localStorage.getItem("chats")) || {}
let currentChat = null

function saveChats(){
localStorage.setItem("chats",JSON.stringify(chats))
}

function newChat(){

const name = prompt("Enter chat name")

if(!name) return

const id = "chat_" + Date.now()

chats[id] = {
title:name,
messages:[]
}

currentChat=id

saveChats()
renderChatList()
renderMessages()

}

function renameChat(){

if(!currentChat) return

const name = prompt("New name")

if(!name) return

chats[currentChat].title=name

saveChats()
renderChatList()

}

function deleteCurrentChat(){

if(!currentChat) return

delete chats[currentChat]

currentChat=null

chat.innerHTML=""

saveChats()
renderChatList()

}

function clearChat(){

if(!currentChat) return

chats[currentChat].messages=[]

saveChats()
renderMessages()

}

function renderChatList(){

chatList.innerHTML=""

for(let id in chats){

const btn=document.createElement("button")

btn.innerText=chats[id].title

btn.onclick=()=>{
currentChat=id
renderMessages()
}

chatList.appendChild(btn)

}

}

function renderMessages(){

chat.innerHTML=""

if(!currentChat) return

chats[currentChat].messages.forEach((msg,index)=>{

chat.innerHTML+=`
<div class="${msg.role}">
${marked.parse(msg.text)}
<button class="deleteMsg" onclick="deleteMessage(${index})">🗑</button>
</div>
`

})

chat.scrollTop=chat.scrollHeight

}

function deleteMessage(index){

chats[currentChat].messages.splice(index,1)

saveChats()
renderMessages()

}

async function sendMessage(){

if(!currentChat) newChat()

const userText=input.value

if(userText.trim()==="") return

chats[currentChat].messages.push({
role:"user",
text:userText
})

renderMessages()

input.value=""

const typing=document.createElement("div")
typing.className="ai"
typing.innerText="AI is typing..."
chat.appendChild(typing)

const response=await fetch("http://localhost:3000/ask",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({message:userText})

})

const data=await response.json()

typing.remove()

chats[currentChat].messages.push({
role:"ai",
text:data.content
})

saveChats()

renderMessages()

}

input.addEventListener("keypress",(e)=>{
if(e.key==="Enter") sendMessage()
})

renderChatList()