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


new Vue({
    render: h => h(App)
}).$mount('#app')
