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
public class DepartmentApiResponse {
    private Long        id;
    private String      name;
    private String      head;
    private LocalDate   updateDate;
    private String      addressDetail;
    private String      phone;
    private String      fax;
}

