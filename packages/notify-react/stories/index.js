import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Notify from '../src/index.js';
import theme from '../src/Notify.css';

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
;
