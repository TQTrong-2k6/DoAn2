export default async function getData(API, args){
    const result = await Promise.all(
        args.map(async (value) => {
            const res = await fetch(API + value);
            const data = await res.json()
            return {[value]: data};
        })
    );
    return Object.assign({}, ...result);
}