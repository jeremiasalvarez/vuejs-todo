import Vue from 'vue'
import App from './components/App.vue'
import Toasted from 'vue-toasted';

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

new Vue({
    render: h => h(App)
}).$mount('#app')
