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
public class PlaceApiResponse {
    private Integer     id;
    private LocalDate   updateDate;
    private String      name;
    private String      address;
    private String      addressDetail;
    private String      phone;
    private String      fax;
}

