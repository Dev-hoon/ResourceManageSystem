package project.kimjinbo.RMS.model.entity;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import java.util.Objects;
import java.io.Serializable;
import java.util.Optional;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookmarkPK implements Serializable {

    private Long    itemId;
    @Column(name = "coup_id")
    private Long    registerUser;

    public void validate() throws Exception {
        if( !Optional.ofNullable(itemId).isPresent() || !Optional.ofNullable(registerUser).isPresent() ){
            throw new Exception("Primary key not ready");
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        BookmarkPK that = (BookmarkPK) o;

        if (!itemId.equals(that.itemId))          return false;
        if (!registerUser.equals(that.registerUser))    return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hash(itemId, registerUser);
    }


}
