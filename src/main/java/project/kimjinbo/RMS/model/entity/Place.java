package project.kimjinbo.RMS.model.entity;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import javax.persistence.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@Accessors(chain=true)
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer     id;
    private String      name;
    private Long        registerUser;
    private LocalDate   registerDate;
    private Long        updateUser;
    private LocalDate   updateDate;
    private String      address;
    private String      addressDetail;
    private String      phone;
    private String      fax;
}
