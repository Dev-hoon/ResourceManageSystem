package project.kimjinbo.RMS.model.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Accessors(chain=true)
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer     id;
    private String      name;
    private Long        registerUser;
    private LocalDate   registerDate;
    private Long        updateUser;
    private LocalDate   updateDate;
    private LocalDate   headDate;
    private String      phone;
    private String      fax;

    private Long        head;

    @Column(name="place_id")
    private Integer     placeId;

    @Column(name="dep_id")
    private Long        depId;

    @OneToOne
    @JoinColumn(name="head", insertable = false, updatable = false)
    Employee headPserson;

    @OneToOne
    @JoinColumn(name="place_id", insertable = false, updatable = false)
    Place place;

    @OneToOne
    @JoinColumn(name="dep_id", insertable = false, updatable = false)
    Department department;

}
