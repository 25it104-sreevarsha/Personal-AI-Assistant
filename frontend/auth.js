async function login(){

const username=document.getElementById("username").value
const password=document.getElementById("password").value

const res=await fetch("http://localhost:3000/login",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({username,password})

})

const data=await res.json()

if(data.success){

localStorage.setItem("user",username)

window.location="index.html"

}
}