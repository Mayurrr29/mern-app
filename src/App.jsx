import { useState,useEffect} from "react"
import axios from "axios"
import "./App.css"
 import { ToastContainer, toast } from 'react-toastify';
function App() {
  const[users,setUsers]=useState([]);
  const[form, setForm]=useState({
    username:"",
    email:"",
    number:"",
    message:""
  });
 const[editId,setEditId]= useState(null);
  useEffect(()=>{   
    fetchUsers();
   },[]);
  const fetchUsers= async()=>{
    try{
      const res= await axios.get("https://mern-app-backend-five.vercel.app/");
      setUsers(res.data);
    }
    catch(err){
      console.log(err);
    }}
 const handleSubmit= async(e)=>{
    e.preventDefault();
    try{
      if(editId){
        // Update existing user
        const res= await axios.put(`https://mern-app-backend-five.vercel.app//${editId}`,form);
        const updatedUsers= users.map((user)=>
          user._id === editId ? res.data : user
        );
        setUsers(updatedUsers);
        setEditId(null);
        toast.success("User updated successfully");
      } else {
        // Create new user
        const res= await axios.post("https://mern-app-backend-five.vercel.app/",form);
        setUsers([...users,res.data]);
       
       toast.success("User added successfully");
      }
      setForm({
        username:"",
        email:"",
        number:"",
        message:""
      });
    }
    catch(err){
      console.log(err);
    }

 }

 const handleDelete= async(id)=>{
  try{
    await axios.delete(`https://mern-app-backend-five.vercel.app//${id}`);
    setUsers(users.filter((user)=>user._id !== id));
    toast("User deleted successfully");
  }
  catch(err){
    console.log(err);
  }
 }

 const handleEdit= (id)=>{
  const userToEdit = users.find((user) => user._id === id);
  if(userToEdit){
    setForm({
      username: userToEdit.username,
      email: userToEdit.email,
      number: userToEdit.number,
      message: userToEdit.message
    });
    setEditId(id);
  }
}
  return (
    <>
    <div>
     <form onSubmit={handleSubmit}>
      <label htmlFor="username">Name:</label>
      <input type="text" placeholder="Username" value={form.username} 
      
      onChange={(e)=>setForm({...form,username:e.target.value})}
      required/>
      <br />
       <label htmlFor="username">Email:</label>
      <input type="email" placeholder="Username"  value={form.email}
       onChange={(e)=>setForm({...form,email:e.target.value})}
      required/>
      <br />
       <label htmlFor="username">Number:</label>
      <input type="number" placeholder="Username" value={form.number} 
      onChange={(e)=>setForm({...form,number:e.target.value})}
      required/>

       <br />
      <label htmlFor="username">Message:</label>
      <input type="textarea" placeholder="Message" value={form.message} 
      onChange={(e)=>setForm({...form,message:e.target.value})}
      required/>
       <br />
      <button>{editId ? "Update" : "Submit"}</button>
     </form>
      </div>


    <ul>
      {users.map((user)=>(
        <li key={user._id}>
          <span>{user.username} - {user.email} - {user.number} - {user.message}</span>
          <button onClick={()=>handleDelete(user._id)}>Delete</button>
          <button onClick={()=>handleEdit(user._id)}>Edit</button>
        </li> 
 ))}
        
    </ul>
     <ToastContainer />
    </>
  )
}

export default App
