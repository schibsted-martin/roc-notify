import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Notify from '../src/index.js';
import theme from '../src/Notify.css';

const customAction = (e, state) => {
    e.preventDefault();

    alert('You clicked a link!');

    action('Called to action')(e, state);
}

storiesOf('Notify', module)
    .add('default', () => (
        <Notify/>
    ))
    .add('with default theme', () => (
        <Notify theme={ theme }/>
    ))
    .add('of type "fiskpinne" (themed)', () => (
        <Notify type="fishStick" theme={ theme }/>
    ))
    .add('with custom actions', () => (
        <Notify theme={ theme } onClick={ customAction } onClose={ action('Closed notification') }/>
    ))
;
