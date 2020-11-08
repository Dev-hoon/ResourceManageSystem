package project.kimjinbo.RMS.model.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
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
    private Integer     depId;
    private Integer     teamId;
    private String      position;
    private String      auth;
    private String      memo;
    private String      passwd;
    private String      empNum;
}
