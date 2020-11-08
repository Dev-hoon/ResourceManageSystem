package project.kimjinbo.RMS.model.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@IdClass(BookmarkPK.class)
@EqualsAndHashCode(callSuper=false)
public class Bookmark extends BookmarkPK {
    @Id
    private Long        itemId;

    @Id
    private Long        registerUser;

    private LocalDate   registerDate;
    private LocalDate   updateDate;
    private String      Memo;


}

