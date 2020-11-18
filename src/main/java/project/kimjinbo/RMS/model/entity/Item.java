package project.kimjinbo.RMS.model.entity;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;

import javax.persistence.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain=true)
@Entity
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long        id;

    private Long        registerUser;
    private LocalDate   registerDate;
    private String      superCate;
    private String      subCateFirst;
    private String      subCateSecond;
    private LocalDate   updateDate;
    private Long        updateUser;
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

