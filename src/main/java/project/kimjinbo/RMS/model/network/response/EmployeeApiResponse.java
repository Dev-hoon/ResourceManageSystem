package project.kimjinbo.RMS.model.network.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain=true)
public class EmployeeApiResponse {
    private Long        id;
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

    private String      teamName;
    private String      departmentName;
}

