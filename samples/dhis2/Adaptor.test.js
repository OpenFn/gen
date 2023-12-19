import { createTrackedEntityInstance } from './JavascriptImplementation';

const state = {
  configuration: {
    apiUrl: 'https://play.dhis2.org/2.34.3',
    apiVersion: '34',
    apiUsername: 'admin',
    apiPassword: 'district',
  },
  data: {},
  references: [],
};

createTrackedEntityInstance({ name: 'John Doe', age: 25 })(state).then(
  nextState => {
    console.log(nextState);
  }
);