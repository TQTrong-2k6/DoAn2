export default function html([first, ...strings], ...values){
    return values.reduce((acc, cur) => {
        return acc.concat(cur, strings.shift())
    }, [first])
    .filter(x => x && x !== true || x === 0)
    .join('')
}

export function createStore(reducer){
    if(typeof reducer !== 'function')
        throw new Error("reducer is not a function");
        
    let state = reducer();
    const roots = new Map()

    function render(){
        for (const [root, component] of roots){
            const el = typeof root === 'string' ? document.querySelector(root) : root
            if (el) el.innerHTML = component()
        }
    }

    return {
        attach(component, root) {
            roots.set(root, component) 
            render();
        },
        connect(selector = state => state){
            return component => (props, ...args) => 
                component(Object.assign({}, props, selector(state), ...args))
        },
        dispatch(action, ...args){
            state = reducer(state, action, args)
            render()
        }
    }
}