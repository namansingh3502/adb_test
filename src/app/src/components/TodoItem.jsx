function TodoItem({task}) {
    return (
        <li className="todo-item">
            <span className="todo-text">{task.task}</span>
        </li>
    );
}

export default TodoItem;