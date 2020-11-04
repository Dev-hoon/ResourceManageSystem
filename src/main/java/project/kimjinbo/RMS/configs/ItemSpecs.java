package project.kimjinbo.RMS.configs;

import org.springframework.data.jpa.domain.Specification;
import project.kimjinbo.RMS.model.entity.Item;

import java.time.LocalDate;

public class ItemSpecs {

    public static Specification<Item> superCate(String superCate) {
        return (superCate!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("superCate"), superCate) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> subCateFirst(String subCateFirst) {
        return (subCateFirst!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("superCate"), subCateFirst) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> expireDate(LocalDate expireDate) {
        return (expireDate!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("expireDate"), expireDate) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> registerDate(LocalDate registerDate) {
        return (registerDate!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("registerDate"), registerDate) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> name(String name) {
        return (name!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("superCate"), name) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> cost(Long cost) {
        return (cost!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("superCate"), cost) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }
    public static Specification<Item> purchasedCost(Long purchasedCost) {
        return (purchasedCost!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("superCate"), purchasedCost) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> itemState(Integer itemState) {
        return (itemState!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("superCate"), itemState) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> placeState(Integer placeState) {
        return (placeState!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("superCate"), placeState) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> rentalState(Integer rentalState) {
        return (rentalState!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("superCate"), rentalState) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

}
