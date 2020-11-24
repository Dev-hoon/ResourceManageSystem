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

    @Column(name="place_state")
    private Integer     placeState;
    private Integer     rentalState;
    private String      cdKey;
    private String      licence;
    private Long        cost;
    private Long        purchaseCost;

    @OneToOne
    @JoinColumn(name="place_state", insertable = false, updatable = false)
    Place place;


    public Item(ItemTemp itemItem ){
        this.registerUser   = itemItem.getRegisterUser();
        this.registerDate   = itemItem.getRegisterDate();
        this.updateUser     = itemItem.getUpdateUser();
        this.updateDate     = itemItem.getUpdateDate();

        this.superCate      = itemItem.getSuperCate();
        this.subCateFirst   = itemItem.getSubCateFirst();
        this.subCateSecond  = itemItem.getSubCateSecond();
        this.name           = itemItem.getName();
        this.memo           = itemItem.getMemo();
        this.detail         = itemItem.getDetail();
        this.expireDate     = itemItem.getExpireDate();
        this.itemState      = itemItem.getItemState();
        this.placeState     = itemItem.getPlaceState();
        this.rentalState    = itemItem.getRentalState();
        this.cdKey          = itemItem.getCdKey();
        this.licence        = itemItem.getLicence();
        this.cost           = itemItem.getCost();
        this.purchaseCost   = itemItem.getPurchaseCost();

        //
        this.expireDate     = itemItem.getExpireDate();
        this.registerDate   = itemItem.getRegisterDate();






    }

}

