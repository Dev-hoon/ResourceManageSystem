package project.kimjinbo.RMS.model.enumclass;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Arrays;

@Getter
@AllArgsConstructor
public enum RentalState {
    UNREGISTERED    (1, "미등록", "대여 미동록상태"),
    NO_RENTAL       (10,"대여불능","대여 대여불능상태"),
    CAN_RENTAL      (11,"대여가능","대여 대여가능상태"),
    WAIT_RENTAL     (12,"대여대기","대여 대여대기상태"),
    ON_RENTAL       (13,"대여중","대여 대여중상태"),
    WAIT_RETURN     (20,"반환대기","대여 반환대기상태"),
    REQ_RETURN      (21,"반환요청","대여 반환요청상태");

    private Integer id;
    private String title;
    private String description;

    public static String titleOf(Integer id) {
        return Arrays.stream(RentalState.values()).filter(item->(item.getId()==id)).findFirst().get().getTitle();
    }
    public static Integer idOf(String title) {
        if(title==null) return null;
        return Arrays.stream(RentalState.values()).filter( item->(item.getTitle().equals(title)) ).findFirst().get().getId();
    }

}



