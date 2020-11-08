package project.kimjinbo.RMS.model.network.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain=true)
public class ItemApiResponse {
    private Long        id;

    private String      superCate;
    private String      subCateFirst;
    private String      subCateSecond;

    private LocalDate   registerDate;
    private LocalDate   expireDate;

    private String      name;
    private String      memo;
    private Long        cost;
    private Long        purchaseCost;
    private String      itemState;
    private Integer     placeState;
    private String      rentalState;
    private String      cdKey;
    private String      licence;

}

