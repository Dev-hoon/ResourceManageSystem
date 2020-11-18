package project.kimjinbo.RMS.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Accessors(chain=true)
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer     id;
    private String      name;
    private Long        registerUser;
    private Long        updateUser;
    private LocalDate   registerDate;
    private LocalDate   updateDate;
    private String      head;
    private LocalDate   headDate;
    private String      phone;
    private String      fax;

    @Column(name="place_id")
    private Integer     placeId;

    @OneToOne
    @JoinColumn(name="head", insertable = false, updatable = false)
    Employee headPserson;

    @OneToOne
    @JoinColumn(name="place_id", insertable = false, updatable = false)
    Place place;
}
