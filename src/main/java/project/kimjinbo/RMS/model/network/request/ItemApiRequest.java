package project.kimjinbo.RMS.model.network.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemApiRequest {
    private Long        id;

    private String      superCate;
    private String      subCateFirst;
    private String      subCateSecond;

    private Long        registerUser;
    private String      registerDate;
    private Long        updateUser;
    private String      expireDate;

    private String      name;
    private String      memo;
    private String      detail;
    private Long        cost;
    private Long        purchaseCost;
    private Integer     itemState;
    private Integer     placeState;
    private Integer     rentalState;

    private String      cdKey;
    private String      licence;

}
