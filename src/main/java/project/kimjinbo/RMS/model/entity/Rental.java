package project.kimjinbo.RMS.model.entity;

import lombok.*;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain=true)
@IdClass(RentalPK.class)
@EqualsAndHashCode(callSuper=false)
public class Rental {
    @Id
    @Column(name="item_id")
    private Long        itemId;

    @Id
    @Column(name="emp_id")
    private Long        empId;

    @Id
    private LocalDate   startDate;

    private Long        registerUser;
    private LocalDate   registerDate;
    private LocalDate   updateDate;
    private Long        updateUser;
    private String      rentalCode;

    private LocalDate   endDate;
    private String      reason;
    private Integer     state;

    @OneToOne
    @JoinColumn(name="item_id", insertable = false, updatable = false)
    Item item;

    @OneToOne
    @JoinColumn(name="emp_id", insertable = false, updatable = false)
    Employee employee;

}

