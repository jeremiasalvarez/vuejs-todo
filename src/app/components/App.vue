<template>
    <div>
        <nav class="navbar navbar-light bg-light">
            <a href="/" class="navbar-brand"> Todo App </a>
            
        </nav>

        <div class="container">
            <div class="row mt-5">
                <div class="col-md-5">
                    <div class="card">
                        <div class="card-body">
                            <form @submit.prevent="addTodo">
                                <div class="form-group">
                                    <input v-model="todo.title" type="text" placeholder="Inserta una nueva tarea" class="form-control">
                                   
                                </div>
                                <div class="form-group">
                                    <textarea v-model="todo.description" placeholder="Descripcion de la tarea" class="form-control" cols="30" rows="7"></textarea>
                                </div>  
                                <button class="btn btn-primary btn-block">Guardar Tarea</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-7">
                    <div id="tableLoader" class="d-none justify-content-center align-items-center">
                        <i class="fas fa-circle-notch fa-spin"></i>
                    </div>
                    <table class="table table-bordered">
                        <thead>
                            <tr>
                                <th>Titulo</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Opciones</th>
                            </tr>
                        </thead >
                        <tbody>
                            <tr v-for="todo of todoList">
                                <td>{{todo.title}}</td>
                                <td>{{todo.description}}</td>
                                <td v-if="todo.completed == 1">
                                    Completada
                                </td>
                                <td v-else>
                                    Pendiente
                                </td>
                                <td >
                                    <div class="d-flex justify-content-around align-items-center" v-if="todo.completed == 1">
                                        <button @click="switchState(todo.id, 0)" class="btn btn-warning"><i class="fas fa-clock"></i></button>
                                        
                                        <button @click="deleteTodo(todo.id, true)" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>
                                    </div>     
                                    <div class="d-flex justify-content-around align-items-center" v-else>

                                        <button data-toggle="tooltip" data-placement="top" title="Tooltip on top" @click="switchState(todo.id, 1)" class="btn btn-success"><i class="fas fa-check"></i></button>

                                        <button @click="fillEditTodo(todo.title, todo.description)" data-toggle="modal" v-bind:data-target="`#editModal_${todo.id}`" class="btn btn-secondary"><i class="fas fa-edit"></i></button>
                                        <div v-bind:id="`editModal_${todo.id}`" class="modal fade" tabindex="-1" aria-labelledby="editModal_Label" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title">Editar Tarea - <b>{{todo.title}}</b></h5>
                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <form>
                                                        <div class="form-group">
                                                            <label for="recipient-name" class="col-form-label">Titulo</label>
                                                            <input v-model="editTodo.title" type="text" class="form-control" id="recipient-name">
                                                        </div>
                                                        <div class="form-group">
                                                            <label for="message-text" class="col-form-label">Descripción</label>
                                                            <textarea v-model="editTodo.description" class="form-control" id="message-text">
                                                            </textarea>
                                                        </div>
                                                        </form>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button v-bind:id="`closeEditModal_${todo.id}`" type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                                                        <button @click="saveChanges(todo.id)" type="button" class="btn btn-primary">Guardar Cambios</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <button data-toggle="modal" v-bind:data-target="`#deleteModal_${todo.id}`" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>

                                        <div v-bind:id="`deleteModal_${todo.id}`" class="modal fade" tabindex="-1" aria-labelledby="editModal_Label" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title">Eliminar Tarea - <b>{{todo.title}}</b> </h5>
                                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <p>Esta tarea aun no ha sido completada. ¿Estas seguro que deseas eliminarla? <br> <br> Este procedimiento no se puede deshacer</p>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button v-bind:id="`closeDeleteModal_${todo.id}`" type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>
                                                        <button @click="deleteTodo(todo.id)" type="button" class="btn btn-danger">Confirmar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>      
                                </td>
                                
                            </tr>
                        </tbody>
                       
                    </table>
                </div>   
            </div>
        </div>
    </div>
</template>

<script>

    class Todo {

        constructor(title, description) {
            this.title = title
            this.description = description
        }

    }

    function closeModal(id) { 
        document.getElementById(id).click();
    }
    
    export default {
        
        data() {
            return { 
                todo: new Todo(), //modelo para crear una nueva tarea
                todoList: [], //lista de tareas
                editTodo: new Todo() //modelo para editar una tarea
            } 
        },
        
        created() {
            this.getTodos();
        },
        methods: {

            getTodos(){

                fetch("/api/tasks")
                    .then(response => response.json())
                    .then(data => {
                        this.todoList = data.todos
                    })
                
            },
            addTodo() {
                
                fetch('/api/tasks/create', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(this.todo)
                })
                    .then(response => response.json())
                    .then(data => {
                        this.getTodos();

                    })


                this.todo = new Todo(); //* Resetear todo
            },
            deleteTodo(id, completed = false) {
               fetch('/api/tasks/delete', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({id})
                })
                .then(response => response.json())
                .then(data => {
                    this.getTodos()
                    if (!completed) {
                        closeModal(`closeDeleteModal_${id}`)
                    }
                })
            },
            saveChanges(id) {
                const data = {
                    id,
                    newTitle: this.editTodo.title,
                    newDescription: this.editTodo.description
                }

                fetch('/api/tasks/update', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    this.getTodos()
                    closeModal(`closeEditModal_${id}`)
                })


            },
            fillEditTodo(title, description) {
                this.editTodo = new Todo(title, description)
            },
            switchState(id, state) {

                fetch('/api/tasks/switch_state', {
                    method: 'post',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({id, state})
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    this.getTodos()
                })
            }
        }
    }
</script>