const { MCN } = require('./mcn.js');

const mcnText = `
T Perm = R U R' U' R' F R2 U' R' U' R U R' F'
{T Perm}
`;

const parsed = MCN.parse(mcnText);
const parsedFile = MCN.parseFile('./algs.mcn');

if (parsed.algs.every((value, index) => value === parsedFile.algs[index]))
    console.log('Parsed file has same algs as internal text!');
else
    console.log('Parsed file does not have same algs as internal text!');