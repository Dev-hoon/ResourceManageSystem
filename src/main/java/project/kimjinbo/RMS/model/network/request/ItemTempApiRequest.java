package project.kimjinbo.RMS.model.network.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Id;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemTempApiRequest {
    private Long        id;
    private Long        registerUser;
    private String      registerDate;
    private String      updateDate;

    private String      superCate;
    private String      subCateFirst;
    private String      subCateSecond;

    private String      name;
    private String      detail;
    private String      memo;
    private Long        cost;
    private Long        purchaseCost;
    private String      expireDate;
    private String      itemState;
    private Integer     placeState;
    private String      rentalState;
    private String      cdKey;
    private String      licence;

}
