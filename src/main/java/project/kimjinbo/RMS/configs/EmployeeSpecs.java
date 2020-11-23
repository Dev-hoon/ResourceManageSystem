package project.kimjinbo.RMS.configs;

import org.springframework.data.jpa.domain.Specification;
import project.kimjinbo.RMS.model.entity.Employee;
import project.kimjinbo.RMS.model.entity.Item;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class EmployeeSpecs {

    public static Specification<Employee> name(String name) {
        return (name!=null)
                ? (Specification<Employee>) ((root, query, builder) -> builder.equal(root.get("name"), name) )
                : (Specification<Employee>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Employee> phone(String phone) {
        return (phone!=null)
                ? (Specification<Employee>) ((root, query, builder) -> builder.equal(root.get("phone"), phone) )
                : (Specification<Employee>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Employee> email(String email) {
        return (email!=null)
                ? (Specification<Employee>) ((root, query, builder) -> builder.equal(root.get("email"), email) )
                : (Specification<Employee>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Employee> depId(Integer depId) {
        return (depId!=null)
                ? (Specification<Employee>) ((root, query, builder) -> builder.equal(root.get("depId"), depId) )
                : (Specification<Employee>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Employee> teamId(Integer teamId) {
        return (teamId!=null)
                ? (Specification<Employee>) ((root, query, builder) -> builder.equal(root.get("teamId"),  teamId) )
                : (Specification<Employee>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Employee> position(String position) {
        return (position!=null)
                ? (Specification<Employee>) ((root, query, builder) -> builder.equal(root.get("position"), position) )
                : (Specification<Employee>) ((root, query, builder) -> builder.and() );
    }
    ;
}
