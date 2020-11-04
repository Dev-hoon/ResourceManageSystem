package project.kimjinbo.RMS.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import project.kimjinbo.RMS.model.entity.Department;


@Repository
public interface DepartmentRepository extends JpaRepository<Department, Integer> {

}
