package project.kimjinbo.RMS.model.network.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeApiRequest {
    private Long        id;
    private Long        registerUser;
    private Long        updateUser;

    private LocalDate   registerDate;
    private LocalDate   updateDate;
    private LocalDate   enteredDate;

    private String      name;
    private String      email;
    private String      phone;
    private String      position;
    private String      auth;
    private String      memo;
    private String      passwd;
    private String      empNum;
    private Integer     depId;
    private Integer     teamId;

}
