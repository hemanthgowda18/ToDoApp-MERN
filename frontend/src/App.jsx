import { useState, useEffect } from 'react';
import axios from 'axios';
import { MdEditNote, MdOutlineToggleOff, MdDelete } from 'react-icons/md';
import { IoIosAddCircle } from 'react-icons/io';
import { BiSolidPaperPlane } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa';
import './App.css';
import Footer from './Footer';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [editText, setEditText] = useState('');
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/todos')
      .then((response) => setTodos(response.data))
      .catch((error) => console.error('Error fetching todos:', error));
  }, []);

  const addTodo = async () => {
    try {
      const response = await axios.post('http://localhost:5000/todos', {
        text,
      });
      setTodos([...todos, response.data]);
      setText('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  const markTodoCompleted = async (todoId) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/todos/${todoId}`,
        {
          completed: !todos.find((todo) => todo._id === todoId).completed,
        }
      );

      setTodos(
        todos.map((todo) => (todo._id === todoId ? response.data : todo))
      );
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleEdit = (todoId, currentText) => {
    setEditText(currentText);
    setEditId(todoId);
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/todos/${editId}`,
        { text: editText }
      );
      setTodos(
        todos.map((todo) => (todo._id === editId ? response.data : todo))
      );
      setEditText('');
      setEditId(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  return (
    <>
      <div className='container'>
        <h1 style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'1rem'}}>
          <BiSolidPaperPlane />
          Todo Mern App
        </h1>
        <div className='input-container'>
          <input
            type='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button onClick={addTodo}>
            <IoIosAddCircle className='btn btn-add' />
          </button>
        </div>
        <ul>
          {todos.map((todo) => (
            <li key={todo._id}>
              {editId === todo._id ? (
                <>
                  <div className='edit-container'>
                    <input
                      type='text'
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button onClick={handleUpdate}>
                      <FaCheck className='btn btn-check' />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <span
                    style={{
                      textDecoration: todo.completed ? 'line-through' : 'none',
                      width: '50%',
                      textTransform: 'capitalize',
                      paddingLeft: '3rem',
                    }}
                  >
                    {todo.text}
                  </span>
                  <button onClick={() => handleEdit(todo._id, todo.text)}>
                    <MdEditNote className='btn btn-edit' />
                  </button>
                  <button
                    onClick={() => markTodoCompleted(todo._id)}
                    className='toggle-btn'
                  >
                    <MdOutlineToggleOff className='btn btn-toggle' />
                  </button>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className='delete-btn'
                  >
                    <MdDelete className='btn btn-delete' />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </>
  );
}

export default App;
