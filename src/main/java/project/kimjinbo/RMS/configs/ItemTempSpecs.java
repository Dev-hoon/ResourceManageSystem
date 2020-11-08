package project.kimjinbo.RMS.configs;

import org.springframework.data.jpa.domain.Specification;

import project.kimjinbo.RMS.model.entity.ItemTemp;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class ItemTempSpecs {

    public static Specification<ItemTemp> registerDate(String registerDate) {
        return (registerDate!=null)
                ? (Specification<ItemTemp>) ((root, query, builder) -> builder.equal(root.get("registerDate"),  LocalDate.parse( registerDate, DateTimeFormatter.ISO_DATE)) )
                : (Specification<ItemTemp>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<ItemTemp> registerUser(Long registerUser) {
        return (registerUser!=null)
                ? (Specification<ItemTemp>) ((root, query, builder) -> builder.equal(root.get("registerUser"),  registerUser ) )
                : (Specification<ItemTemp>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<ItemTemp> superCate(String superCate) {
        return (superCate!=null)
                ? (Specification<ItemTemp>) ((root, query, builder) -> builder.equal(root.get("superCate"), superCate) )
                : (Specification<ItemTemp>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<ItemTemp> subCateFirst(String subCateFirst) {
        return (subCateFirst!=null)
                ? (Specification<ItemTemp>) ((root, query, builder) -> builder.equal(root.get("subCateFirst"), subCateFirst) )
                : (Specification<ItemTemp>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<ItemTemp> subCateSecond(String subCateSecond) {
        return (subCateSecond!=null)
                ? (Specification<ItemTemp>) ((root, query, builder) -> builder.equal(root.get("subCateSecond"), subCateSecond) )
                : (Specification<ItemTemp>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<ItemTemp> expireDate(String expireDate) {
        return (expireDate!=null)
                ? (Specification<ItemTemp>) ((root, query, builder) -> builder.equal(root.get("expireDate"),  LocalDate.parse( expireDate, DateTimeFormatter.ISO_DATE)) )
                : (Specification<ItemTemp>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<ItemTemp> name(String name) {
        return (name!=null)
                ? (Specification<ItemTemp>) ((root, query, builder) -> builder.equal(root.get("name"), name) )
                : (Specification<ItemTemp>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<ItemTemp> cost(Long cost) {
        return (cost!=null)
                ? (Specification<ItemTemp>) ((root, query, builder) -> builder.equal(root.get("cost"), cost) )
                : (Specification<ItemTemp>) ((root, query, builder) -> builder.and() );
    }
    public static Specification<ItemTemp> purchaseCost(Long purchaseCost) {
        return (purchaseCost!=null)
                ? (Specification<ItemTemp>) ((root, query, builder) -> builder.equal(root.get("purchaseCost"), purchaseCost) )
                : (Specification<ItemTemp>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<ItemTemp> itemState(Integer itemState) {
        return (itemState!=null)
                ? (Specification<ItemTemp>) ((root, query, builder) -> builder.equal(root.get("itemState"), itemState) )
                : (Specification<ItemTemp>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<ItemTemp> placeState(Integer placeState) {
        return (placeState!=null)
                ? (Specification<ItemTemp>) ((root, query, builder) -> builder.equal(root.get("placeState"), placeState) )
                : (Specification<ItemTemp>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<ItemTemp> rentalState(Integer rentalState) {
        return (rentalState!=null)
                ? (Specification<ItemTemp>) ((root, query, builder) -> builder.equal(root.get("rentalState"), rentalState) )
                : (Specification<ItemTemp>) ((root, query, builder) -> builder.and() );
    }

}
