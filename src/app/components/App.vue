<template>
    <div >
        <div class="bg-light">
            <h1 class="text-center p-3">Gestión de Tareas</h1>
        </div>

        <div class="container">
            <div class="row mt-5">
                <new-todo-form :todo="todo" :hasErrors="hasErrors" :errorList="errorList" :loading="loadingCreate" @send-newTodo-data="getData"></new-todo-form>
                <div class="col-md-8 table-container">
                    <div class="d-flex justify-content-between align-items-center pb-3">
                        <h4 class="mb-3">Tareas Guardadas</h4>
                        <filters-box v-model="filterValue" @sendFilterValue="applyFilter()"></filters-box>
                    </div>
                    <table class="table table-bordered">
                        <div v-if="loadingTable" class="justify-content-center align-items-center">
                            <i class="fas fa-circle-notch fa-spin text-primary"></i>
                        </div>
                        <thead>
                            <tr>
                                <th>Titulo</th>
                                <th>Descripción</th>
                                <th>Estado</th>
                                <th>Opciones</th>
                            </tr>
                        </thead >
                        <tbody>
                            
                            <tr v-for="(todo, index) of todoListFiltered" :key="todo.id">
                                <td class="text-wrap">{{todo.title}}</td>
                                <td>{{todo.description}}</td>
                                <td class="text-success font-weight-bold" v-if="todo.completed == 1">
                                    Completada <i class="fas fa-check "></i>
                                </td>
                                <td class="text-warning font-weight-bold" v-else>
                                    Pendiente <i class="fas fa-exclamation-circle "></i> 
                                </td>
                                <td >
                                    <div class="d-flex justify-content-around align-items-center m-res" v-if="todo.completed == 1">
                                        
                                        <div v-if="loadingState.loading && loadingState.clickedIndex === index">
                                            <button class="btn btn-warning p-events-none">
                                                <i class="fas fa-circle-notch text-white fa-spin"></i>
                                            </button>
                                        </div>
                                        <div v-else>
                                            <button v-bind:class="{'p-events-none': blockButtons}" v-tooltip="'Marcar tarea como pendiente'" @click="switchState(todo.id, 0, index)" class="btn btn-warning">
                                                <i class="fas fa-clock text-white"></i>
                                            </button>
                                        </div>

                                        <div v-if="loadingDelete.loading && loadingDelete.clickedIndex === index">
                                            <button class="btn btn-danger p-events-none"><i class="fas fa-circle-notch text-white fa-spin"></i></button>
                                        </div>
                                        <div v-else>
                                            <button v-bind:class="{'p-events-none': blockButtons}" v-tooltip="'Eliminar Tarea'" @click="deleteTodo(todo.id, true, index)" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>
                                        </div>
                                        
                                    </div>     
                                    <div class="d-flex justify-content-around align-items-center flex-wrap m-res" v-else>

                                        <div v-if="loadingState.loading && loadingState.clickedIndex === index">
                                            <button class="btn btn-success p-events-none"><i class="fas fa-circle-notch text-white fa-spin"></i></button>
                                        </div>

                                        <div v-else>
                                            <button v-bind:class="{'p-events-none': blockButtons}" v-tooltip="'Marcar tarea como completada'" @click="switchState(todo.id, 1, index)" class="btn btn-success"><i class="fas fa-check"></i></button>
                                        </div>
                                        
                                        <button v-bind:class="{'p-events-none': blockButtons}" v-tooltip="'Editar tarea'" @click="fillEditTodo(todo.title, todo.description)" data-toggle="modal" v-bind:data-target="`#editModal_${todo.id}`" class="btn btn-secondary"><i class="fas fa-edit"></i></button>

                                        <edit-modal @send-edit-model="processEdit" :modalIndex="todo.id" :loading="loadingEdit" :todo="editTodo" :title="todo.title"></edit-modal>
                                        
                                        <button v-bind:class="{'p-events-none': blockButtons}" v-tooltip="'Eliminar tarea'" data-toggle="modal" v-bind:data-target="`#deleteModal_${todo.id}`" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>
                                        
                                        <delete-modal @delete-todo="processDelete" :title="todo.title" :todoId="todo.id" :loading="loadingDelete.loading && loadingDelete.clickedIndex === index" :completed="todo.completed == 1" :index="index"></delete-modal>
                                    </div>      
                                </td>                
                            </tr>
                        </tbody>
                    </table>
                    <div class="text-warning font-weight-bold text-center" v-if="todoList.length == 0 && !loadingTable && filterValue === 'all'">
                                <i class="fas fa-exclamation-circle"></i> Por el momento no tienes tareas guardadas.
                    </div>
                    <div class="text-warning font-weight-bold text-center" v-else-if="todoListFiltered.length == 0 && !loadingTable && filterValue === 'comp'">
                        <i class="fas fa-exclamation-circle"></i> Por el momento no tienes tareas completadas.
                    </div>
                    <div class="text-warning font-weight-bold text-center" v-else-if="todoListFiltered.length == 0 && !loadingTable && filterValue === 'pen'">
                        <i class="fas fa-exclamation-circle"></i> Por el momento no tienes tareas pendientes.
                    </div>
                </div>   
            </div>
        </div>
    </div>
</template>

<script>

    class Todo {

        constructor(title, description, id) {
            this.title = title
            this.description = description
            this.id = id
        }

    }

    function closeModal(id) { 
        document.getElementById(id).click();
    }
    
    export default {
        
        data() {
            return { 
                todo: new Todo(), //modelo para crear una nueva tarea
                todoList: [], //lista de tareas (sin filtros)
                todoListFiltered: [], // lista de tareas con filtros (es la que se muestra en pantalla)
                editTodo: new Todo(), //modelo para editar una tarea
                blockButtons: false, //* variable para bloquear todos los botones mientras se procesa otra accion
                loadingState: {
                    loading: false,
                    clickedIndex: -1
                },
                loadingEdit: false,
                loadingDelete: {
                    loading: false,
                    clickedIndex: -1
                },
                loadingCreate: false,
                loadingTable: false,
                //*objetos/variables loading utilizadas para animar los botones
                //*se utilizan objetos para poder manejar los indices de los botones presionados (de lo contrario se animarian todos los botones al mismo tiempo)

                hasErrors: false, //*modelos para control de errores
                errorList: [],
                filterValue: "" //*valor utilizado para filtrar los valores de la tabla
            } 
        },
        
        created() {
            //*funciones que se ejecutan la primera vez que se abre la app
            this.loadingTable = true;
            this.filterValue = 'all';
            this.getTodos(() => {
                this.loadingTable = false
            });
        },
        methods: {

            applyFilter() {

                switch (this.filterValue) {
                    case 'all':
                        this.todoListFiltered = this.todoList
                        break;
                    case 'pen':
                        this.todoListFiltered = this.todoList.filter(todo => todo.completed == 0)
                        break;
                    case 'comp':
                        this.todoListFiltered = this.todoList.filter(todo => todo.completed == 1)
                        break;
                    default:
                        break;
                }
            },
            checkErrors() {
                
                this.errorList = []

                if (!this.todo.title) {
                    this.errorList.push("Debes completar el campo 'Titulo'")
                }
                if (!this.todo.description) {
                    this.errorList.push("Debes completar el campo 'Descripcion'")
                }
                return this.errorList.length > 0 //* si es mayor a 0 significa que tiene errores
            },
            getTodos(callback){

                fetch("/api/tasks")
                    .then(response => response.json())
                    .then(data => {
                        this.todoList = data.todos
                        this.todoListFiltered = this.todoList
                        this.applyFilter()
                        callback()
                        //*se utiliza un callback para mejorar la experiencia de usuario
                    })
                
            },
            getData(data) {
                this.todo = new Todo(data.title, data.description)
                this.addTodo()
            },
            addTodo() {
                
                //*control de errores en los campos
                this.hasErrors = this.checkErrors();

                if (this.hasErrors) {
                    this.$toasted.global.error({
                    message : 'Soluciona los errores para guardar la tarea'
                    }); 
                    return;
                }

                this.loadingCreate = true;
                this.blockButtons = true;
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
                        this.getTodos(() => {
                            this.loadingCreate = false;
                            this.todo = new Todo(); //* Resetear todo
                            this.errorList = [] //* Resetear errores
                            this.$toasted.global.success({
                            message : 'Tarea guardada exitosamente!'
                            }); 
                            this.blockButtons = false;
                        });
                    })

                
            },
            processDelete(data) {
                this.deleteTodo(data.id, data.completed, data.index)
            },
            deleteTodo(id, completed = false, index) {

               this.loadingDelete.loading = true;
               this.loadingDelete.clickedIndex = index;
               this.blockButtons = true;
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
                    this.getTodos(() => {
                        if (!completed) {
                        closeModal(`deleteModal_${id}_closeBtn`)
                        }
                        this.loadingDelete.loading = false;
                        this.loadingDelete.clickedIndex = -1;
                        this.$toasted.global.info({
                            message : 'La tarea fue removida exitosamente'
                        });
                        this.blockButtons = false;

                    })            
                })
            },
            processEdit(todo){
                this.editTodo = todo
                this.saveChanges(this.editTodo.id)
            },
            saveChanges(id) {
                this.loadingEdit = true;

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
                    this.getTodos(() => {
                        console.log("ID: " + id);
                        closeModal(`editModal_${id}_CloseBtn`)
                        this.loadingEdit = false;
                        this.$toasted.global.info({
                            message : 'La tarea fue editada exitosamente'
                        });
                    })
                })


            },
            fillEditTodo(title, description) {
                this.editTodo = new Todo(title, description)
                return this.editTodo
            },
            switchState(id, state, index) {

                this.loadingState.loading = true;
                this.loadingState.clickedIndex = index;
                this.blockButtons = true;

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
                    this.getTodos(() => {
                        this.loadingState.loading = false;
                        this.loadingState.clickedIndex = -1;
                        this.blockButtons = false;
                        if (state == 0) {
                            this.$toasted.global.info({
                                message : 'Tarea marcada como pendiente'
                            });
                        } else {
                            this.$toasted.global.success({
                                message : 'Tarea marcada como completada'
                            });
                        }
                    })
                })
            }
        }
    }
</script>