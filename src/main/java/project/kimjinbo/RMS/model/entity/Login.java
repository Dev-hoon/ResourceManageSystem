package project.kimjinbo.RMS.model.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Login {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String phoneNumber;
    private Long age;
    private String userId;
    private String password;
    private LocalDateTime createDate;
    private String createUser;
    private LocalDateTime updateDate;
    private String updateUser;
}
