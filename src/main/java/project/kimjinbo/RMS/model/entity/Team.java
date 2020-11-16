package project.kimjinbo.RMS.model.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer     id;
    private String      name;
    private Long        registerUser;
    private LocalDate   registerDate;
    private Long        updateUser;
    private LocalDate   updateDate;
    private String      head;
    private LocalDate   headDate;
    private String      phone;
    private String      fax;

    @OneToOne
    @JoinColumn(name="place_id", insertable = false, updatable = false)
    Place placeId;

    @OneToOne
    @JoinColumn(name="department_id", insertable = false, updatable = false)
    Department departmentId;

}
