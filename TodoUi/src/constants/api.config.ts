const API_ENDPOINTS = {
  TODOS: {
    GET_ALL: `/api/TodoItems`,
    CREATE: `/api/TodoItems`,
    UPDATE: (id: number) => `/api/TodoItems/${id}`,
    DELETE: (id: number) => `/api/TodoItems/${id}`,
  },
};

export default API_ENDPOINTS;
