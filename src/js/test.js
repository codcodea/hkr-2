

const selection = new Set(["mooses"])
const answers = new Set(["elk", "moose"])

// const res = [...answers].some(answer => [...selection][0].includes(answer))

const res  = [...answers].some(answer => [...selection][0].includes(answer))

console.log(res)