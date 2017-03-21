import { configure } from '@kadira/storybook';

const req = require.context('../packages/', true, /stories\/index.js$/)

function loadStories() {
    req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
