const GET_TODOS = `
  query GetTodos {
    todos {
      title
      completed
    }
  }
`;

function createClient(url: string) {
  const request = (document, variables = {}) => {
    return fetch(url, {
      body: JSON.stringify({
        query: document,
        variables
      })
    });
  };

  return request;
}

const request = createClient("/graphql.json");

const data = request(GET_TODOS);

console.log(data);
