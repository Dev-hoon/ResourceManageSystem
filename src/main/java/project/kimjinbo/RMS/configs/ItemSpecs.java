package project.kimjinbo.RMS.configs;

import org.springframework.data.jpa.domain.Specification;
import project.kimjinbo.RMS.model.entity.Item;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class ItemSpecs {

    public static Specification<Item> superCate(String superCate) {
        return (superCate!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("superCate"), superCate) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> subCateFirst(String subCateFirst) {
        return (subCateFirst!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("subCateFirst"), subCateFirst) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> subCateSecond(String subCateSecond) {
        return (subCateSecond!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("subCateSecond"), subCateSecond) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> expireDate(String expireDate) {
        return (expireDate!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("expireDate"),  LocalDate.parse( expireDate, DateTimeFormatter.ISO_DATE)) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> registerDate(String registerDate) {
        return (registerDate!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("registerDate"),  LocalDate.parse( registerDate, DateTimeFormatter.ISO_DATE)) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> name(String name) {
        return (name!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("name"), name) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> cost(Long cost) {
        return (cost!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("cost"), cost) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }
    public static Specification<Item> purchasedCost(Long purchasedCost) {
        return (purchasedCost!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("purchasedCost"), purchasedCost) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> itemState(Integer itemState) {
        return (itemState!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("itemState"), itemState) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> placeState(Integer placeState) {
        return (placeState!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("placeState"), placeState) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Item> rentalState(Integer rentalState) {
        return (rentalState!=null)
                ? (Specification<Item>) ((root, query, builder) -> builder.equal(root.get("rentalState"), rentalState) )
                : (Specification<Item>) ((root, query, builder) -> builder.and() );
    }

}
