import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Notify from '../src/index.js';

storiesOf('Notify', module)
    .add('default', () => (
        <Notify/>
    ));
