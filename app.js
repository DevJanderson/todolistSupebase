const todoList = document.querySelector('.list')
const form = document.querySelector('form')
const input = document.querySelector('form > input')

const SUPABASE_URL = 'https://xzwfhsafgwvkbxshqxkw.supabase.co'
const SUPABASE_KIY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6d2Zoc2FmZ3d2a2J4c2hxeGt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njk2NDYxMjUsImV4cCI6MTk4NTIyMjEyNX0.gve5UpeEqh5SYoqx9bbP4aack0PFh_6MiPY1jZsfP7M'

const { createClient } = supabase
const _supabase = createClient(SUPABASE_URL, SUPABASE_KIY)

async function getTodos() {
    const { data, error } = await _supabase
    .from('tarefas')
    .select('*')

    // console.log(data)

    return data
}

// criar função que cria o elemento de lista no html
function render(todo) {
    const todoItem = `
    <li class="item">
        <div class="item-info">
            <input type="checkbox" onclick="completeTodo(event)" ${todo.completed ? "checked" : ""}/>
            <span class="${todo.completed ? "completed" : ""}" data-id="${todo.id}"> ${todo.title} </span>
        </div>
        <img src="assets/images/icon-cross.svg" alt="" onclick="removeTodo(event)"/>
    </li>
    `
    todoList.innerHTML += todoItem
}

async function renderTodos() {
    const todos = await getTodos()
    // console.log(todos)
    todos.forEach(task => {
        render(task)
    })
}

// Função que diz que a atividade foi feita
async function completeTodo(event) {
    const todoId = event.target.nextElementSibling.dataset.id
    const todoText = event.target.nextElementSibling

    todoText.classList.toggle('completed')

    const { error } = await _supabase
    .from('tarefas')
    .update({ completed: true })
    .eq( 'id', todoId)

    if ( error ) {
        console.log(error)
    }
}

// Função para excluir o elemento da lista e do banco de dado.
async function removeTodo(event) {
    const todoId = event.target.previousElementSibling.children[1].dataset.id
    const todo = event.target.parentElement
    const todoParent = todo.parentElement

    todoParent.removeChild(todo)

    const { error } = await _supabase
        .from('tarefas')
        .delete()
        .match({ id: todoId })

    if (error) {
        console.log( error )
    }

}

// Função que insere o conteúdo do input na lista
async function handleFormSubmit(event) {
    event.preventDefault()

    const {data, error } = await _supabase
        .from('tarefas')
        .upsert({title: input.value})
        .select()
    if (error) {
        console.log(error)
    }

    input.value = ''

    // console.log(data)

    render(data[0])
}

form.addEventListener('submit', handleFormSubmit)

renderTodos()