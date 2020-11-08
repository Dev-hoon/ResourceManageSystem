package project.kimjinbo.RMS.model.enumclass;

import lombok.Getter;
import lombok.AllArgsConstructor;

import java.util.Arrays;

@Getter
@AllArgsConstructor
public enum ItemState {
    UNREGISTERED    (10, "미등록", "자산 미등록상태"),
    REGISTERING     (11,"등록진행","자산 등록진행상태"),
    REGISTERED      (20,"등록완료","자산 등록완료상태"),
    WAIT_REPAIR     (30,"수리예정","자산 수리예정상태"),
    ON_REPAIR       (31,"수리진행","자산 수리진행상태"),
    DAMAGED_NO      (40,"손상/사용불가","자산 손상/사용불가상태"),
    DAMAGED_CAN     (41,"손상/시용가능","자산 손상/사용가능상태"),
    WAIT_DISCRADED  (50,"폐기예정","자산 폐기진행상태"),
    ON_DISCRADED    (51,"폐기완료","자산 폐기완료상태");

    private Integer id;
    private String title;
    private String description;

    public static String titleOf(Integer id) {
        return Arrays.stream(ItemState.values()).filter(item->(item.getId()==id)).findFirst().get().getTitle();
    }

    public static Integer idOf(String title) {
        if(title==null) return null;
        return Arrays.stream(ItemState.values()).filter(item->(item.getTitle().equals(title)) ).findFirst().get().getId();
    }

}

