package project.kimjinbo.RMS.model.network.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RentalApiRequest {
    private Long        itemId;
    private Long        empId;

    private Long        registerUser;
    private LocalDate   registerDate;
    private Long        updateUser;
    private LocalDate   updateDate;

    private String      rentalCode;

    private LocalDate   startDate;
    private LocalDate   endDate;
    private String      reason;

    private Integer     state;

}
