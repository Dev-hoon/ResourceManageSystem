package project.kimjinbo.RMS.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import project.kimjinbo.RMS.RMSApplicationTests;
import project.kimjinbo.RMS.model.entity.Employee;


public class EmployeeRepositoryTest extends RMSApplicationTests  {

    @Autowired
    EmployeeRepository employeeRepository;

    @Test
    void create() {
        Employee employee = new Employee();
        employee.setId(1l);
        employee.setName("root");
        employee.setEmail("test@test.com");
        employee.setPhone("01012345678");
        employee.setDepId(0);
        employee.setTeamId(0);
        employee.setPosition("SM");
        employee.setAuth("root");

        employeeRepository.save(employee);

        Employee newEmp = employeeRepository.save(employee);
        System.out.println("newEmp  : "+newEmp);
        System.out.println("employee: "+employee);
        System.out.println("test done!");
    }
}