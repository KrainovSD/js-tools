// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// import { getByPath, setByPath, setByPath2, speedTest } from "../lib";

// const test = {};
// const test2 = {};

// speedTest(
//   (i) => {
//     setByPath(test, `level1.level2[${i}].level3[${i}]`, 2);
//   },
//   { name: "set", iterations: 1000000 },
// );
// speedTest(
//   (i) => {
//     setByPath2(test, `level1.level2[${i}].level3[${i}]`, 2);
//   },
//   { name: "set2", iterations: 1000000 },
// );

// // setByPath2(test2, `level1.level2[10].level3[10]`, 2);
// setByPath2(test2, `.l1....l2.[10].l3[10]`, 2);

// console.log(test, test2);
// console.log(getByPath(test2, `.l1.l2.[10]l3[10].test`));
