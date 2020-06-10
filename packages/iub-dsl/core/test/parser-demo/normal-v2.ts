const a1 = {};
const a2 = {};
const b1 = {};
const c1 = {};
const d1 = {};

async function run() {
  await a1();
  await a2();
  await b1();
  Prmoise.all('c1', 'd1')
    .then(([C, D]) => handler(C, D));
}
