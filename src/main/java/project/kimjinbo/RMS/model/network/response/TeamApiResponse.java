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
public class TeamApiResponse {
    private Integer     id;
    private String      name;
    private String      head;
    private Long        headId;
    private String      headDate;
    private String      updateDate;
    private String      address;
    private Integer     placeId;
    private String      phone;
    private String      fax;
}
