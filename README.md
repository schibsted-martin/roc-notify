# roc-notify

## Test

Add a mapping between your own _Fuse_ user (stage) and a notification on `http://ab-web-notifications-stage.herokuapp.com/crm/usernotifications/userid` as _JSON_.
```
{
  "users": [{
    "notificationId": "<notification id>",
    "userId": "<user id>"
  }]
}
```

A list of notifications can be found on `https://ab-web-notifications-stage.herokuapp.com/crm/notifications/all`

You can check your user id on `http://stage.fuse.aftonbladet.se/v2/test/start`

## Contribute

### Prerequisites

Some of the dependencies used in this project are not yet publicly available. You will need to get
access to the _ Shibsted_ _Artifactory_ instance and perform a few setup tasks in order to allow
the application to install properly.

Follow this [step-by-step guide](https://github.schibsted.io/smp-distribution/team-websdk/blob/master/docs/artifactory.md) to setup you environment.

### Installation

- Install the application  
  Run `npm i`
- Run the development server  
  Run `npm run storybook`
