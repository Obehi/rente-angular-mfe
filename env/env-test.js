const test = () => {

  return System.import('./env.js').then(response => response.environment)
}

export const environment = {
    test: test
  };

  
  