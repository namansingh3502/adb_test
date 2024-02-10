import './App.css';
import {useEffect, useState} from 'react';
import TodoItem from './components/TodoItem';

function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await fetch('http://localhost:8000/todos/');
            const data = await response.json();
            setTasks(JSON.parse(data.tasks));
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const addTask = async () => {
        try {
            const response = await fetch('http://localhost:8000/todos/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({task: newTask}),
            });

            const newTaskData = await response.json();
            setNewTask('');
            setTasks(JSON.parse(newTaskData.tasks));
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    return (
        <div className="app-container">
            <div className="todo-form">
                <h2>Add a New ToDo</h2>
                <form onSubmit={(event) => {
                    event.preventDefault();
                    addTask();
                }}>
                    <label htmlFor="todo">ToDo:</label>
                    <input
                        type="text"
                        id="todo"
                        placeholder="Add a new task"
                        value={newTask}
                        onChange={(event) => setNewTask(event.target.value)}
                    />
                    <button type="submit">Add ToDo</button>
                </form>
            </div>
            <h1 className="app-title">ToDo List</h1>
            <div className="todo-list">
                {tasks.map((task) => (
                    <TodoItem key={task._id} task={task}/>
                ))}
            </div>
        </div>
    );
}

export default App;
