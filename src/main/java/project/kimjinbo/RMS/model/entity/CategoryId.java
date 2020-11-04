package project.kimjinbo.RMS.model.entity;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.Objects;
import java.io.Serializable;
import java.util.Optional;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryId implements Serializable {
    private String      superCate;
    private String      subCateFirst;
    private String      subCateSecond;

    public void validate() throws Exception {
        if( !Optional.ofNullable(superCate).isPresent() || !Optional.ofNullable(subCateFirst).isPresent() || !Optional.ofNullable(subCateSecond).isPresent() ){
            throw new Exception("Primary key not ready");
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        CategoryId that = (CategoryId) o;

        if (!superCate.equals(that.superCate))          return false;
        if (!subCateFirst.equals(that.subCateFirst))    return false;
        if (!subCateSecond.equals(that.subCateSecond))  return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hash(superCate, subCateFirst, subCateSecond);
    }


}
