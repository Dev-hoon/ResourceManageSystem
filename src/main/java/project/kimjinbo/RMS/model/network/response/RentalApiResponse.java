package project.kimjinbo.RMS.model.network.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import javax.persistence.Column;
import javax.persistence.Id;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain=true)
public class RentalApiResponse {
    private Long        itemId;
    private Long        empId;
    private String      userName;
    private String      teamName;
    private String      itemName;
    private String      superCate;
    private String      subCateFirst;
    private String      subCateSecond;
    private LocalDate   startDate;
    private LocalDate   endDate;
    private Integer     state;

}

