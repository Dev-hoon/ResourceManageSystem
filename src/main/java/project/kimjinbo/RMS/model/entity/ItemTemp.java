package project.kimjinbo.RMS.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain=true)
@Entity
@Table(
    indexes = {
        @Index(name = "item_temp_idx", columnList = "registerUser"),
        @Index(name = "item_temp_idx", columnList = "updateDate")
    }
)
public class ItemTemp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long        id;
    private Long        registerUser;
    private LocalDate   registerDate;
    private String      superCate;
    private String      subCateFirst;
    private String      subCateSecond;
    private LocalDate   updateDate;
    private String      name;
    private String      memo;
    private String      detail;
    private LocalDate   expireDate;
    private Integer     itemState;
    private Integer     placeState;
    private Integer     rentalState;
    private String      cdKey;
    private String      licence;
    private Long        cost;
    private Long        purchaseCost;

}

