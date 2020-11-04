package project.kimjinbo.RMS.model.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer     id;
    private Long        registerUser;
    private Long        updateUser;
    private LocalDate   registerDate;
    private LocalDate   updateDate;
    private String      name;
    private String      head;
    private LocalDate   headDate;
}
