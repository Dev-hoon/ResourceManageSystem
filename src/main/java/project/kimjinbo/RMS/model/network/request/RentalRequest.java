package project.kimjinbo.RMS.model.network.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RentalRequest {
    private List<Long>  items;
    private List<String>endDates;
    private Long        userId;
    private Long        registerUser;
    private Long        updateUser;
    private String      rentalCode;
    private String      startDate;
    private String      endDate;
    private String      reason;
    private Integer     state;
}
