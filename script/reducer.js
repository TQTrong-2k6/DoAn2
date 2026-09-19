import getData from "./fetch.js"

const API = 'http://localhost:3000/'

getData(API, ['pc', 'computerComponents', 'screen', 'gaminggear', 'laptop', 'other']).then(products => {dispatch('SET_PRODUCTS', products);});

const actions = {
    SET_PRODUCTS(state, args){
        return{...state, products: args[0]}
    }
}

export default function reducer(state = { products: [] }, action, args) {
    if(actions[action]){
        return actions[action](state, args)
    }
    return state
}