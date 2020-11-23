package project.kimjinbo.RMS.model.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;

import javax.persistence.*;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Accessors(chain=true)
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long        id;
    private Long        registerUser;
    private Long        updateUser;
    private LocalDate   registerDate;
    private LocalDate   updateDate;
    private LocalDate   enteredDate;
    private String      name;
    private String      email;
    private String      phone;
    private String      position;
    private String      auth;
    private String      memo;
    private String      passwd;
    private String      empNum;

    @Column(name="dep_id")
    private Integer     depId;

    @Column(name="team_id")
    private Integer     teamId;

    @OneToOne
    @JoinColumn(name="dep_id", insertable = false, updatable = false)
    Department Department;

    @OneToOne
    @JoinColumn(name="team_id", insertable = false, updatable = false)
    Team team;

}
