package co.com.sofka.demo.Services;

import co.com.sofka.demo.Repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import co.com.sofka.demo.Models.Todo;

@Service
public class TodoService {
  @Autowired
  private TodoRepository repo;

  public Iterable<Todo> list(){
    return repo.findAll();
  }

  public Todo save(Todo todo){
      return repo.save(todo);
  }

  public void delete(Todo todo){
      repo.delete(todo);
    }

    public Todo get(Long id){
        return repo.findById(id).orElseThrow();
    }


}
