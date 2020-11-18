package project.kimjinbo.RMS.configs;

import org.springframework.data.jpa.domain.Specification;
import project.kimjinbo.RMS.model.entity.Category;
import project.kimjinbo.RMS.model.entity.Item;
import project.kimjinbo.RMS.model.network.request.CateApiRequest;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class CategorySpecs {

    public static Specification<Category> superCate(String superCate) {
        return (superCate!=null)
                ? (Specification<Category>) ((root, query, builder) -> builder.equal(root.get("superCate"), superCate) )
                : (Specification<Category>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Category> subCateFirst(String subCateFirst) {
        return (subCateFirst!=null)
                ? (Specification<Category>) ((root, query, builder) -> builder.equal(root.get("subCateFirst"), subCateFirst) )
                : (Specification<Category>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Category> subCateSecond(String subCateSecond) {
        return (subCateSecond!=null)
                ? (Specification<Category>) ((root, query, builder) -> builder.equal(root.get("subCateSecond"), subCateSecond) )
                : (Specification<Category>) ((root, query, builder) -> builder.and() );
    }

}
