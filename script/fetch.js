export default async function getData(api, ...args){
    const result = await Promise.all(
        args.map(async (value) => {
            const res = await fetch(api + value);
            const data = await res.json()
            return {[value]: data};
        })
    );
    return Object.assign({}, ...result);
}