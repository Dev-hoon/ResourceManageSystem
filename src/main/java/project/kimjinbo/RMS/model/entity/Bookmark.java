package project.kimjinbo.RMS.model.entity;

import lombok.*;
import lombok.experimental.Accessors;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Accessors(chain=true)
@IdClass(BookmarkPK.class)
@EqualsAndHashCode(callSuper=false)
public class Bookmark extends BookmarkPK {

    @Id
    @Column(name="item_id")
    private Long        itemId;
    @Id
    @Column(name="register_user")
    private Long        registerUser;

    private Long        updateUser;
    private LocalDate   registerDate;
    private LocalDate   updateDate;
    private String      memo;

    @Id
    @ManyToOne
    @JoinColumn(name="item_id", insertable = false, updatable = false)
    Item item;

    @Id
    @ManyToOne
    @JoinColumn(name="register_user", insertable = false, updatable = false)
    Employee employee;

}

