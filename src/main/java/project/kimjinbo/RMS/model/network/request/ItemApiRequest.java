package project.kimjinbo.RMS.model.network.request;

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
public class ItemApiRequest {
    @Id
    private Long        id;

    private String      superCate;
    private String      subCateFirst;
    private String      subCateSecond;

    private Long        registerUser;
    private String      registerDate;
    private String      expireDate;

    private String      name;
    private String      memo;
    private Long        cost;
    private Long        purchasedCost;
    private String      itemState;
    private Integer     placeState;
    private String      rentalState;

    private String      cdKey;
    private String      licence;

}
