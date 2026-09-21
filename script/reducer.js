const actions = {
    addProducts(state, data) {
        return {...state, products: data};}
}

export default function reducer(state = {}, action, args) {
    if(actions[action]){
        return actions[action](state, ...args)
    }
    return state
}