package project.kimjinbo.RMS.sampleData;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import project.kimjinbo.RMS.RMSApplicationTests;
import project.kimjinbo.RMS.model.entity.Employee;
import project.kimjinbo.RMS.repository.EmployeeRepository;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;


public class EmployeeSample extends RMSApplicationTests {

    @Autowired
    EmployeeRepository employeeRepository;


    @Test
    public void createSample() {
        LocalDate date = LocalDate.now();
        List<String> names  = Arrays.asList("개발자1", "개발자2", "마케팅1", "영업1", "신규1");
        List<String> emails = Arrays.asList("test1@naver.com","test2@naver.com","test3@naver.com","test4@naver.com","test5@naver.com");
        List<String> phones = Arrays.asList("01012345678","01012345679","0108765432","01012348765", "01033453333");
        List<String> auth   = Arrays.asList("root", "admin", "dev", "user", "user");

        employeeRepository.save(
            Employee.builder()
                .name("root")
                .registerDate(date)
                .updateDate(date)
                .registerUser( 0L )
                .updateUser( 0L )
                .email("test@naver.com")
                .phone("01046696620")
                .auth("root")
            .build()
            );

        date = LocalDate.now();

        for(int i = 0; i < names.size(); i++){

            employeeRepository.save(
                Employee.builder()
                .name( names.get(i) )
                .registerDate(date)
                .updateDate(date)
                .registerUser( 0L )
                .updateUser( 0L )
                .email( emails.get(i))
                .phone( phones.get(i))
                .auth( auth.get(i)).build()
            );
        }

    }


}