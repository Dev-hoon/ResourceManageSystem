package project.kimjinbo.RMS.model.network.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentApiRequest {
    private Integer     id;
    private Long        registerUser;
    private Long        updateUser;
    private LocalDate   registerDate;
    private LocalDate   updateDate;

    private String      name;
    private String      head;
    private String      phone;
    private String      fax;

    private Integer     placeId;

}
