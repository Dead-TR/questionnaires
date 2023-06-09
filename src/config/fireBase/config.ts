const apiKey = process.env.REACT_APP_apiKey,
  authDomain = process.env.REACT_APP_authDomain,
  projectId = process.env.REACT_APP_projectId,
  storageBucket = process.env.REACT_APP_storageBucket,
  appId = process.env.REACT_APP_appId,
  measurementId = process.env.REACT_APP_measurementId,
  messagingSenderId = process.env.REACT_APP_messagingSenderId;

export const fireBaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};
