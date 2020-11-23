package project.kimjinbo.RMS.model.enumclass;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public enum RentalResult {

    RENTAL_WAIT     (10,"승인대기","대여승인대기"),
    RENTAL_ACCEPT   (11,"대여승인","대여승인상태"),
    RENTAL_DENY     (12,"대여반려","대여반려상태"),
    RENTAL_RETURN   (13,"대여보류","대여보류상태"),
    RENTAL_HOLD     (14,"대여보류","대여보류상태");

    private Integer id;
    private String title;
    private String description;

    public static String titleOf(Integer id) {
        return Arrays.stream(RentalResult.values()).filter(item->(item.getId()==id)).findFirst().get().getTitle();
    }
    public static Integer idOf(String title) {
        if(title==null) return null;
        return Arrays.stream(RentalResult.values()).filter(item->(item.getTitle().equals(title)) ).findFirst().get().getId();
    }

    public static Map<Integer,String> getObject( ) {/*
        return Arrays.stream( ItemState.values() ).map( item->{
            return new HashMap<Integer,String>(){{ put(item.getId(),item.getTitle()); }};
        }).collect( Collectors.toList() );*/

        return Arrays.stream( RentalResult.values() ).collect( Collectors.toMap(RentalResult::getId, RentalResult::getTitle) );

    }

}



