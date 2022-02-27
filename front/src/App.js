import React, { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";

const HOST_API = "http://localhost:8080/api";
const initialState = {
  todo: {list: [], item:{} } 
};
const Store = createContext(initialState);

// Creación de formulario para el ingreso de datos
const Form = () => {
  const formRef = useRef(null);
  const { dispatch, state: {todo} } = useContext(Store);
  const item = todo.item
  const [state, setState] = useState(item);
  
  //control del evento ADD
  const onAdd=(event) =>{
    event.preventDefault();

    const request = {
      name: state.name,
      id:null,
      isCompleted: false
    };  

    //Petición para dar de alta un nuevo objeto
    fetch(HOST_API+"/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers:{
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((todo) => {
        dispatch({ type: "add-item", item: todo });
        setState({name: ""});
        formRef.current.reset();
      });
  }
  
    //Petición para dar de actualizar un objeto existente
  const onEdit=(event) =>{
    event.preventDefault();

    const request = {
      name: state.name,
      id: item.id,
      isCompleted: item.isCompleted
    };  

    fetch(HOST_API+"/todo", {
      method: "PUT",
      body: JSON.stringify(request),
      headers:{
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((todo) => {
        dispatch({ type: "update-item", item: todo });
        setState({name: ""});
        formRef.current.reset();
      });
    }

    //Diseño del formulario para el ingreso de datos
  return <form ref={formRef}>
  <input
    type="text"
    name="name"
    defaultValue={item.name}
    onChange={(event) => {
      setState({ ...state, name: event.target.value })
    }} ></input>
  {item.id && <button onClick={onAdd}>Agregar</button>}
  {!item.id && <button onClick={onEdit}>Actualizar</button>}
</form>
}


//Vista de listado
const List = () => {
  const { dispatch, state: { todo } } = useContext(Store);
  const currenList = todo.list;
//Petición que trae todos los objetos registrados y los muestra en la vista
  useEffect(() => {
    fetch(HOST_API + "/todos")
      .then(response => response.json())
      .then((list) => {
        dispatch({ type: "update-list", list });
      });
  }, [dispatch]);

  // Función para eliminar un objeto de la base
  const onDelete = (id) => {
    fetch(HOST_API + "/"+id+"/todo", {
      method: "DELETE"
    }).then((list)=>{
      dispatch({type: "delete-item", id})
    })
  };

  // Función que acciona la edición del objeto seleccionado
  const onEdit = (todo) => {
    dispatch({ type: "edit-item", item: todo })
  };

  const onChange = (event, todo) => {
    const request = {
      name: todo.name,
      id: todo.id,
      completed: event.target.checked
    };
    fetch(HOST_API + "/todo", {
      method: "PUT",
      body: JSON.stringify(request),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then((todo) => {
        dispatch({ type: "update-item", item: todo });
      });
  };

  return <div>
      <table>
        <thead>
          <tr>
            <td>ID</td>
            <td>Nombre</td>
            <td>¿Está completado?</td>
          </tr>
        </thead>
        <tbody>
          {state.list.map((todo) => {
            return (
              <tr key={todo.id}>
                <td>{todo.id}</td>
                <td>{todo.name}</td>
                <td><input type="checkbox" defaultChecked={todo.completed} onChange={(event) => onChange(event, todo)}></input></td>
                <td><button onClick={() => onDelete(todo.id)}>Eliminar</button></td>
                <td><button onClick={() => onEdit(todo)}>Editar</button></td>
              </tr>
            )
          }
        }     
        </tbody>
      </table>
    </div> 
}

//Función que controla los diferentes estados y dependiendo del estado las acciones que debe realizar
function reducer(state, action) {
  switch (action.type) {
    case "update-item":
      const todoUpItem = state.todo;
      const listUpdateEdit = todoUpItem.list.map((item) => {
        if(item.id === action.item.id){
          return action.item;          
        }
        return item
      });
      return { ...state, todo: todoUpItem }
    case "delete-item":
      const listUpdate = state.filter((item) =>{
        return item.id !== action.id;
      });
      return{...state, list: listUpdate}
    case "update-list":
      return { ...state, list: action.list };
    case "edit-item":
      return { ...state, item: action.item };
    case "add-item":
      const newList = state.list;
      newList.push(action.item);
      return { ...state, list: newList };
    default:
      return state;
  }
}

//Contenedor que mostrará en pantalla diferentes componentes de React.as
const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <Store.Provider value={{ state, dispatch }}>
      {children}
    </Store.Provider>
  );
};

function App() {
  return <StoreProvider>
    <Form />
    <List />
  </StoreProvider>;
};

export default App;
