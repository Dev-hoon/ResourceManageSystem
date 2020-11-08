package project.kimjinbo.RMS.model.network.request;

import lombok.*;
import project.kimjinbo.RMS.model.entity.BookmarkPK;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookApiRequest {
    private Long        itemId;
    private Long        registerUser;

    private LocalDate   registerDate;
    private LocalDate   updateDate;
    private String      Memo;

}
