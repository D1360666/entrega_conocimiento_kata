package co.com.sofka.demo.Repository;

import co.com.sofka.demo.Models.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.Repository;

public interface TodoRepository extends JpaRepository<Todo, Long> {

}
