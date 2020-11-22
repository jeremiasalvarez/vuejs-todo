import Vue from 'vue'
import App from './components/App.vue'
import Toasted from 'vue-toasted';
import VTooltip from 'v-tooltip'

Vue.use(VTooltip)


Vue.use(Toasted, {
    duration: 1500,
    keepOnHover: true,
    iconPack: 'fontawesome',
    theme: "outline"
})

let errorOptions = {
    type : 'error',
    icon : 'exclamation-circle'
};

Vue.toasted.register('error',
    (payload) => {

        // if there is no message passed show default message
        if(! payload.message) {
    	    return "Oops.. Algo salio mal"
        }

        // if there is a message show it with the message
        return payload.message;
    },
    errorOptions
)

let successOptions = {
    type : 'success',
    icon : 'check'
}

Vue.toasted.register('success',
    (payload) => {

        // if there is no message passed show default message
        if(! payload.message) {
    	    return "Exitoso"
        }

        // if there is a message show it with the message
        return payload.message;
    },
    successOptions
)

let editDeleteOptions = {
    type : 'info',
    icon : 'check'
}

Vue.toasted.register('info',
    (payload) => {

        // if there is no message passed show default message
        if(! payload.message) {
    	    return "Exitoso"
        }

        // if there is a message show it with the message
        return payload.message;
    },
    editDeleteOptions
)


//*Components

Vue.component('filters-box', {
    data: function() {
        return {
            value: 'all'
        }
    },
    template: `
    <div class="col-md-5">
        <div class="input-group">
        <div class="input-group-prepend">
            <span class="input-group-text"> Mostrar </span>
        </div>
            <select v-bind:value="value"
            v-on:input="$emit('input', $event.target.value)"
            @change="sendEvent" 
            class="form-control border" 
            id="">
                <option value="all">Todas</option>
                <option value="pen">Pendientes</option>
                <option value="comp">Completadas</option>
            </select>
        </div>                                 
    </div>`,
    methods: {

        sendEvent(){
            this.$emit('sendFilterValue', this.value);
        }
    }
})

Vue.component('edit-modal', {
    props: ['modalIndex', 'todo', 'loading', 'title'],
    data: function() {
        return {
            index: -1
        }
    },
    template: `
    <div :id="'editModal_' + modalIndex" class="modal fade" tabindex="-1" aria-labelledby="modalIndex" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Tarea - <b>{{title}}</b></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                    <div class="form-group">
                        <label for="recipient-name" class="col-form-label">Titulo</label>
                        <input v-model="todo.title" type="text" class="form-control" id="recipient-name">
                    </div>
                    <div class="form-group">
                        <label for="message-text" class="col-form-label">Descripción</label>
                        <textarea v-model="todo.description" class="form-control" id="message-text">
                        </textarea>
                    </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button v-bind:id="'editModal_' + modalIndex + '_CloseBtn'" type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>

                    <div v-if="loading">
                        <button type="button" class="btn btn-primary p-events-none"><i class="fas fa-circle-notch text-white fa-spin"></i> Guardando..</button>
                    </div>
                    <div v-else>
                        <button @click="sendEvent" type="button" class="btn btn-primary">Guardar Cambios</button>
                    </div>             
                </div>
            </div>
        </div>
    </div>
    `,
    methods: {

        sendEvent(){
            const todo = {
                id: this.modalIndex,
                description: this.todo.description,
                title: this.todo.title
            }
            this.$emit('send-edit-model', todo)
        }
    },
    created() {
        this.index = this.modalIndex
        this.initialTitle = this.todo.title
    }
})

Vue.component('delete-modal', {
    props: ['title', 'todoId', 'loading', 'completed', 'index'],
    template: `
        <div v-bind:id="'deleteModal_' + todoId" class="modal fade" tabindex="-1" aria-labelledby="'deleteModal_' + todoId" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Eliminar Tarea - <b>{{title}}</b> </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Esta tarea aun no ha sido completada. ¿Estas seguro que deseas eliminarla? <br> <br> Este procedimiento no se puede deshacer</p>
                    </div>
                    <div class="modal-footer">
                        <button v-bind:id="'deleteModal_' + todoId + '_closeBtn'" type="button" class="btn btn-secondary" data-dismiss="modal">Cancelar</button>

                        <div v-if="loading">
                            <button type="button" class="btn btn-danger p-events-none"><i class="fas fa-circle-notch text-white fa-spin"></i> Eliminando..</button>
                        </div>
                        <div v-else>
                            <button @click="sendEvent" type="button" class="btn btn-danger">Confirmar</button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    `,
    methods: {
        sendEvent() {
            const data = {
                id: this.todoId,
                completed: this.completed,
                index: this.index
            }
            this.$emit('delete-todo', data)
        }
    }
})

Vue.component('new-todo-form', {
    props: ['todo', 'hasErrors', 'errorList', 'loading'],
    template: `
    <div class="col-md-4">
        <h4 class="text-center mb-3 pb-3">Nueva Tarea</h4>
        <div class="card">
            <div class="card-body">
                <form @submit.prevent="sendData">
                    <div class="form-group">
                        <input v-model="todo.title" type="text" placeholder="Titulo de la tarea" class="form-control">
                    
                    </div>
                    <div class="form-group">
                        <textarea v-model="todo.description" placeholder="Descripcion de la tarea" class="form-control" cols="30" rows="7"></textarea>
                    </div>
                    <div v-if="hasErrors">
                        <div class="form-group">
                            <ul v-for="(error, index) of errorList" :key="index">
                                <li class="text-danger font-weight-bold"><i class="fas fa-exclamation-circle"></i> {{error}}</li>
                            </ul>
                        </div>
                    </div>
                    <div class="p-events-none" v-if="loading">
                        <button class="btn btn-primary btn-block"><i class="fas fa-circle-notch text-white fa-spin"></i> Guardando..</button>
                    </div>
                    <div v-else>
                        <button class="btn btn-primary btn-block">Guardar Tarea <i class="fas fa-plus ml-1"></i></button>
                    </div>         
                </form>
            </div>
        </div>
    </div>`,
    methods: {
        sendData() {
            const data = {
                title: this.todo.title,
                description: this.todo.description
            }
            this.$emit('send-newTodo-data', data)
        }
    }
})


new Vue({
    render: h => h(App)
}).$mount('#app')
