import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Notify from '../src/index.js';
import theme from '../src/Notify.css';

const testUser = 'MCwCFBzGXH2LC3yDGsLzKuaEJwDzYv4zAhRNbImxLIz2rFP/7olYy2n1hKKtwQ==.eyJ1c2VySWQiOjExMTAwMDM1LCJuYW1lIjoibWFydGluX2RhbmllbHNzb24iLCJzZXJ2aWNlcyI6W10sInRpbWUiOjE0ODg4ODg1ODB9';

const customAction = (e, state) => {
    e.preventDefault();

    alert('You clicked a link!');

    action('Called to action')(e, state);
}

storiesOf('Notify', module)
    .add('default', () => (
        <Notify user={ testUser }/>
    ))
    .add('with default theme', () => (
        <Notify user={ testUser } theme={ theme }/>
    ))
    .add('of type "fiskpinne" (themed)', () => (
        <Notify user={ testUser } type="fishStick" theme={ theme }/>
    ))
    .add('with custom actions', () => (
        <Notify user={ testUser } theme={ theme } onClick={ customAction } onClose={ action('Closed notification') }/>
    ))
;
