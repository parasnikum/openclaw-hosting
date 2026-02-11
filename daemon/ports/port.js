import getPort from "get-port";

const port1 = await getPort();
const port2 = await getPort({ exclude: [port1] });

console.log(port1, port2);
