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
      method: "POST",
      body: JSON.stringify({
        query: document,
        variables
      })
    });
  };

  return request;
}

const request = createClient("/todos.json");

const data = await request(GET_TODOS);

console.log(await data.json());

export {
  createClient
};
