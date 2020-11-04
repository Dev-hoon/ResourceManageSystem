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
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer     id;
    private Long        registerId;
    private Long        updateId;
    private LocalDate   registerDate;
    private LocalDate   updateDate;
    private LocalDate   enteredDate;
    private String      name;
    private String      head;
    private LocalDate   headDate;
}
