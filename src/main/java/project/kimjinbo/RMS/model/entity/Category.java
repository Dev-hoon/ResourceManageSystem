package project.kimjinbo.RMS.model.entity;

import lombok.*;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.Optional;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Accessors(chain=true)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long        id;
    private String      superCate;
    private String      subCateFirst;
    private String      subCateSecond;

    private Long        registerUser;
    private Long        updateUser;
    private LocalDate   registerDate;
    private LocalDate   updateDate;
    private Long        expireDate;
    
}

