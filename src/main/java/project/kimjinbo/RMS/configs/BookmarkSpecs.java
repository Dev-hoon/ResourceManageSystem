package project.kimjinbo.RMS.configs;

import org.springframework.data.jpa.domain.Specification;
import project.kimjinbo.RMS.model.entity.Bookmark;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class BookmarkSpecs {

    public static Specification<Bookmark> registerUser(Long registerUser) {
        return (registerUser!=null)
                ? (Specification<Bookmark>) ((root, query, builder) -> builder.equal( root.get("registerUser"),  registerUser ) )
                : (Specification<Bookmark>) ((root, query, builder) -> builder.and() );
    }

    public static Specification<Bookmark> registerDate(String registerDate) {
        return (registerDate!=null)
                ? (Specification<Bookmark>) ((root, query, builder) -> builder.equal(root.get("registerDate"),  LocalDate.parse( registerDate, DateTimeFormatter.ISO_DATE)) )
                : (Specification<Bookmark>) ((root, query, builder) -> builder.and() );
    }




}
