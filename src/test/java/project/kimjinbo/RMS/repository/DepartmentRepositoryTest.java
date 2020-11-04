package project.kimjinbo.RMS.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.support.DefaultListableBeanFactory;

import project.kimjinbo.RMS.RMSApplicationTests;
import project.kimjinbo.RMS.model.entity.Department;

import java.time.LocalDate;
import java.util.Optional;


public class DepartmentRepositoryTest extends RMSApplicationTests {
    @Autowired
    DepartmentRepository depRepo;

    @Autowired
    DefaultListableBeanFactory df;

    @Test
    void create() {
        LocalDate date = LocalDate.of(2020,5,7);

        Department department = new Department();
        department.setId(1);
        department.setRegisterDate( date );
        department.setName("System Manager");
        System.out.println("department: "+department);

        Department newDep = depRepo.save(department);
        System.out.println("newDep    : "+newDep);

        System.out.println("test done!");
    }

    @Test
    public void read(){
        Optional<Department> dep = depRepo.findById(0);

        dep.ifPresent(test ->{
            System.out.println("test:" + test);
        });
    }
}