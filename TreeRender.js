const fs = require('fs');

if (process.argv.length !== 4) {
    console.error('Usage: node TreeRender.js INPUT_FILE_NAME.txt OUTPUT_FILE_NAME.txt');
    process.exit(1);
}

const inputFileName = process.argv[2];
const outputFileName = process.argv[3];

const tree = parseTreeDefinition(fs.readFileSync(inputFileName, 'utf8').trim());

const treeText = renderTree(tree);

fs.writeFileSync(outputFileName, treeText);

console.log(`The tree visualization has been saved to ${outputFileName}`);

function parseTreeDefinition(definition) {
    const tokens = definition.split(/\s+/);
    const rootValue = parseInt(tokens[0], 10);
    if (tokens.length === 1) {
        return { value: rootValue };
    }
    let i = 1;
    const children = [];
    while (i < tokens.length) {
        const child = parseTreeDefinition(tokens.slice(i).join(' '));
        children.push(child);
        i += countTokens(child) + 1;
    }
    return { value: rootValue, children };
}

function countTokens(node) {
    return 1 + (node.children ? node.children.reduce((count, child) => count + countTokens(child), 0) : 0);
}

function renderTree(node, prefix = '') {
    let treeText = prefix + '└── ' + node.value + '\n';
    if (node.children) {
        node.children.slice(0, -1).forEach(child => {
            treeText += renderTree(child, prefix + '│   ');
        });
        treeText += renderTree(node.children[node.children.length - 1], prefix + '    ');
    }
    console.log(node);
    return treeText;
}