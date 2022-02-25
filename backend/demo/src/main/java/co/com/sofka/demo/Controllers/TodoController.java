package co.com.sofka.demo.Controllers;

import co.com.sofka.demo.Models.Todo;
import co.com.sofka.demo.Services.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class TodoController {
    @Autowired
    private TodoService service;

    @GetMapping(value = "api/todos")
    public Iterable<Todo> list(){
        return service.list();
    }


    @PutMapping(value = "api/todo")
    public Todo update(@RequestBody Todo todo){
        if(todo.getId() != null){
            return service.save(todo);
        }
        throw new RuntimeException(("No existe el id para la actualización"));
    }

    @PostMapping(value = "api/todo")
    public Todo save(@RequestBody Todo todo){
        return service.save(todo);
    }


    public void delete(@PathVariable("id") Todo todo){
        service.delete(todo);
    }

    @GetMapping(value = "api/{id}/todos")
    public Todo get(@RequestParam("id") Long id){
        return service.get(id);
    }



}
