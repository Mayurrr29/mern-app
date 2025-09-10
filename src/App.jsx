import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";

function App() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "",
    email: "",
    number: "",
    message: "",
  });
  const [editId, setEditId] = useState(null);

  // Base URL for backend
  const API_BASE = "https://mern-app-backend-five.vercel.app";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`);
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // Update existing user
        const res = await axios.put(`${API_BASE}/users/${editId}`, form);
        const updatedUsers = users.map((user) =>
          user._id === editId ? res.data : user
        );
        setUsers(updatedUsers);
        setEditId(null);
        toast.success("User updated successfully");
      } else {
        // Create new user
        const res = await axios.post(`${API_BASE}/users`, form);
        setUsers([...users, res.data]);
        toast.success("User added successfully");
      }

      // Reset form
      setForm({
        username: "",
        email: "",
        number: "",
        message: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/users/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      toast("User deleted successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (id) => {
    const userToEdit = users.find((user) => user._id === id);
    if (userToEdit) {
      setForm({
        username: userToEdit.username,
        email: userToEdit.email,
        number: userToEdit.number,
        message: userToEdit.message,
      });
      setEditId(id);
    }
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Name:</label>
          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <br />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <br />

          <label htmlFor="number">Number:</label>
          <input
            type="number"
            placeholder="Number"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
            required
          />
          <br />

          <label htmlFor="message">Message:</label>
          <input
            type="text"
            placeholder="Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
          <br />

          <button>{editId ? "Update" : "Submit"}</button>
        </form>
      </div>

      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <span>
              {user.username} - {user.email} - {user.number} - {user.message}
            </span>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
            <button onClick={() => handleEdit(user._id)}>Edit</button>
          </li>
        ))}
      </ul>
      <ToastContainer />
    </>
  );
}

export default App;
