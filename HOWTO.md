
# Create a _Roc_ component

1. Create a directory for your project  
  Run `mkdir <project> && cd <project>`

2. Make the directory a _npm module_  
  You can choose two options here:
  - Either run `npm init -f`  
    Leaving the `-f` flag out; if you want to use the interactive guide
  - Or; manually write a minimal `package.json` file, i.e:
  ```
{
  "name": "<mono>",
  "version": "0.0.0"
}
```

3. Install a _Roc_ package  
  > Some _Roc_ packages are not yet publicly published; since they are in beta. In order to access
  > these you will need to have an [Artifactory](https://artifacts.schibsted.io/) account and setup
  > the project (or your environment) to be able to access the local _npm packages_ there.
  >
  > In short, for a project setup; run
  ```
curl -u <okta-email>:<artifactory-API-Key> https://artifacts.schibsted.io/artifactory/api/npm/auth > .npmrc
  ```
  > Then add `registry = https://artifacts.schibsted.io/artifactory/api/npm/npm-virtual` to the newly generated `.npmrc` file.
  >
  > More information can be found at https://github.schibsted.io/smp-distribution/team-websdk/blob/master/docs/artifactory/authentication.md#create-an-npm-authentication-token

  Run one of the following:

  - `npm i --save-dev @spp/roc-plugin-mono`
    Minimal monorepo style modules (_Artifactory_ required)
  - ...

4. _Optional_. If you do not have _Roc_ installed globally; add a script command to your `package.json` file, i.e:
  ```
  "scripts": {
    "start": "roc",
  }
```

## Additional _Roc_ plugin steps 

### Monorepo (@spp/roc-plugin-mono)

5. Add a folder to hold all your modules  
  Run `mkdir packages && cd packages`

6. Add one or many modules  
  - Create a directory for your module  
    Run `mkdir <module> && cd <module>`
  - Make the directory a _npm module_  
  - Make the directory a _npm module_  
    You can choose two options here
    - Run `npm init -f` (leave the `-f` out if you want to use the interactive guide)
    - Manually write a minimal `package.json` file
  ```
{
  "name": "<module>",
  "version": "0.0.0"
}
```

7. _Optional_. You can now verify your modules by issuing `roc list` (`npm start list`) in your project directory.

## Storybook

- Install the Storybook library  
  Run `npm i --save-dev @kadira/storybook`
- Install depepencies for Storybook  
  Run `npm i --save-dev react react-dom`
- Create a configuration for Storybook  
  - Run `mkdir .storybook && cd .storybook`
  - Create `index.js` and add the following  
  ```
import { configure } from '@kadira/storybook';

const req = require.context('../packages/', true, /stories\/index.js$/)

function loadStories() {
    req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
```
  This config will look for stories inside `/packages/stories/*`
- Create a story inside any component repo, i.e.  
  - `/packages/<module>/stories/index.js`
  ```
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import MyComponent from '../src/index.js';

storiesOf('MyComponent', module)
    .add('default', () => (
        <MyComponent/>
    ));
```
- Add script command to run Storybook  
```
  "scripts" : {
    "storybook": "roc build --watch & start-storybook -p 9001 -c .storybook"
  }
```,
- Run `npm run storybook`
- Go to http://localhost:9001/ in a web browser

> TBD
>
> - npm link
> - git init
