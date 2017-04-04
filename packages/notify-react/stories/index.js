import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Notify from '../src/index.js';
// import theme from '../src/Notify.css';
import theme from '../src/themes/AB.css';

const users = {
    martin: {
        stage: 'MCwCFBzGXH2LC3yDGsLzKuaEJwDzYv4zAhRNbImxLIz2rFP/7olYy2n1hKKtwQ==.eyJ1c2VySWQiOjExMTAwMDM1LCJuYW1lIjoibWFydGluX2RhbmllbHNzb24iLCJzZXJ2aWNlcyI6W10sInRpbWUiOjE0ODg4ODg1ODB9',
        production: 'MC0CFQCEu5qNoAbfMjku4TIFcpfjYiIofwIUc%2FMZO5x1jwJ2Kx3R58Z4sZfsuk0%3D.eyJ1c2VySWQiOjc0Nzk5NjgsIm5hbWUiOiJtYXJ0aW4uZGFuaWVsc3NvbiIsInNlcnZpY2VzIjpbInBsdXNQcmVtaXVtIiwicGx1cyJdLCJ0aW1lIjoxNDkxMzAyMTY4fQ%3D%3D',
    },
};
const environment = 'production';

const testUser = users.martin[environment];

const customAction = (e, state) => {
    e.preventDefault();

    alert('You clicked a link!');

    action('Called to action')(e, state);
}

storiesOf('Notify', module)
    .add('default', () => (
        <Notify user={ testUser } environment={ environment }/>
    ))
    .add('with default theme', () => (
        <Notify user={ testUser } environment={ environment } theme={ theme }/>
    ))
    .add('of type "fiskpinne" (themed)', () => (
        <Notify user={ testUser } environment={ environment } type="fishStick" theme={ theme }/>
    ))
    .add('with custom actions', () => (
        <Notify user={ testUser } environment={ environment } theme={ theme } onClick={ customAction } onClose={ action('Closed notification') }/>
    ))
;
