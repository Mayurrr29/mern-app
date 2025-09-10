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
  const [errors, setErrors] = useState({});
  const [editId, setEditId] = useState(null);

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

  // Validation function
  const validateForm = () => {
    let newErrors = {};
    const { username, email, number, message } = form;

    if (!username.trim()) {
      newErrors.username = "Name is required";
    } else if (username.length < 3) {
      newErrors.username = "Name must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (!number.trim()) {
      newErrors.number = "Phone number is required";
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(number)) {
        newErrors.number = "Phone number must be exactly 10 digits";
      }
    }

    if (message.length > 250) {
      newErrors.message = "Message cannot exceed 250 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editId) {
        const res = await axios.put(`${API_BASE}/users/${editId}`, form);
        const updatedUsers = users.map((user) =>
          user._id === editId ? res.data : user
        );
        setUsers(updatedUsers);
        setEditId(null);
        toast.success("User updated successfully");
      } else {
        const res = await axios.post(`${API_BASE}/users`, form);
        setUsers([...users, res.data]);
        toast.success("User added successfully");
      }

      setForm({
        username: "",
        email: "",
        number: "",
        message: "",
      });
      setErrors({});
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
          />
          {errors.username && <p style={{ color: "red" }}>{errors.username}</p>}
          <br />

          <label htmlFor="email">Email:</label>
          <input
            type="text"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
          <br />

          <label htmlFor="number">Number:</label>
          <input
            type="text"
            placeholder="Number"
            value={form.number}
            onChange={(e) => setForm({ ...form, number: e.target.value })}
          />
          {errors.number && <p style={{ color: "red" }}>{errors.number}</p>}
          <br />

          <label htmlFor="message">Message:</label>
          <input
            type="text"
            placeholder="Message (Optional)"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          {errors.message && <p style={{ color: "red" }}>{errors.message}</p>}
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
