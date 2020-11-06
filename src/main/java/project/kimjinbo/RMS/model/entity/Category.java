package project.kimjinbo.RMS.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.lang.reflect.Array;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@IdClass(CategoryId.class)
public class Category extends CategoryId {
    @Id
    private String      superCate;
    @Id
    private String      subCateFirst;
    @Id
    private String      subCateSecond;

    private Long        registerUser;
    private Long        updateUser;
    private LocalDate   registerDate;
    private LocalDate   updateDate;

    public Category( CategoryId cateId, long registerUser ){
        System.out.println(" public Category( CategoryId cateId, Long registerUser ) ");
        LocalDate date = LocalDate.now();

        this.registerUser   = registerUser;
        this.updateUser     = registerUser;
        this.registerDate   = date;
        this.updateDate     = date;

        this.superCate      = cateId.getSuperCate();
        this.subCateFirst   = cateId.getSubCateFirst();
        this.subCateSecond  = cateId.getSubCateSecond();

    }

    public void updateCategory(String superCate, String subCateFirst, String subCateSecond, Long registerUser) {
        Optional<String> superCateOPT       = Optional.ofNullable(superCate);
        Optional<String> subCateFirstOPT    = Optional.ofNullable(subCateFirst);
        Optional<String> subCateSecondOPT   = Optional.ofNullable(subCateSecond);
        Optional<Long>   registerUserOPT    = Optional.ofNullable(registerUser);

        superCateOPT.filter( item->( item.equals("HW") || item.equals("SW")) ).orElseThrow(()->new NoResultException("잘못된 대분류 값입니다."));
        this.setSuperCate(superCateOPT.get());

        registerUserOPT.orElseThrow(()->new NoResultException("update user가 존재하지 않습니다."));
        registerUserOPT.ifPresent( item->this.setUpdateUser(item) );

        subCateFirstOPT.ifPresent( item->this.setSubCateFirst(item) );

        subCateSecondOPT.ifPresent( item->this.setSubCateSecond(item) );

        this.setUpdateDate( LocalDate.now() );

    }
}

