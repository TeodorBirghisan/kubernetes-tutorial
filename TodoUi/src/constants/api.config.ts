const API_BASE_URL = import.meta.env.VITE_API_URL;

const API_ENDPOINTS = {
  TODOS: {
    GET_ALL: `${API_BASE_URL}/api/TodoItems`,
    CREATE: `${API_BASE_URL}/api/TodoItems`,
    UPDATE: (id: number) => `${API_BASE_URL}/api/TodoItems/${id}`,
    DELETE: (id: number) => `${API_BASE_URL}/api/TodoItems/${id}`,
  },
};

export default API_ENDPOINTS;
