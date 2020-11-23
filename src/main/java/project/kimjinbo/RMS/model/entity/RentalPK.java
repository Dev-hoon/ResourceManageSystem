package project.kimjinbo.RMS.model.entity;

import lombok.*;
import project.kimjinbo.RMS.model.network.request.RentalApiRequest;
import project.kimjinbo.RMS.model.network.request.RentalRequest;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
public class RentalPK implements Serializable {

    private Long        empId;
    private Long        itemId;
    private LocalDate   startDate;

    public RentalPK( RentalApiRequest rentalApiRequest ){
        this.empId      = rentalApiRequest.getEmpId();
        this.itemId     = rentalApiRequest.getItemId();
        this.startDate  = rentalApiRequest.getStartDate();
    }

    public RentalPK( RentalRequest rentalRequest, Long itemId ){
        this.empId      = rentalRequest.getUserId();
        this.itemId     = itemId;
        this.startDate  = LocalDate.parse(rentalRequest.getStartDate());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RentalPK that = (RentalPK) o;

        if (!empId.equals(that.empId))          return false;
        if (!itemId.equals(that.itemId))        return false;
        if (!startDate.equals(that.startDate))  return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hash(itemId, empId, startDate);
    }


}