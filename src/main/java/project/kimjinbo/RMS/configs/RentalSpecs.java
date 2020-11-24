package project.kimjinbo.RMS.configs;

import org.springframework.data.jpa.domain.Specification;
import project.kimjinbo.RMS.model.entity.Rental;

import java.time.LocalDate;

public class RentalSpecs {

    public static Specification<Rental> state(Integer state) {
        return (state!=null)
                ? (Specification<Rental>) ((root, query, builder) -> builder.equal(root.get("state"), state) )
                : (Specification<Rental>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Rental> endDate(LocalDate endDate) {
        return (endDate!=null)
                ? (Specification<Rental>) ((root, query, builder) -> builder.equal(root.get("endDate"), endDate) )
                : (Specification<Rental>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Rental> endDateLess(LocalDate endDate) {
        return (endDate!=null)
                ? (Specification<Rental>) ((root, query, builder) -> builder.lessThan(root.get("endDate"), endDate) )
                : (Specification<Rental>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Rental> itemId(Long itemId) {
        return (itemId!=null)
                ? (Specification<Rental>) ((root, query, builder) -> builder.equal(root.get("itemId"), itemId) )
                : (Specification<Rental>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Rental> empId(Long empId) {
        return (empId!=null)
                ? (Specification<Rental>) ((root, query, builder) -> builder.equal(root.get("empId"), empId) )
                : (Specification<Rental>) ((root, query, builder) -> builder.and() );
    }


}
