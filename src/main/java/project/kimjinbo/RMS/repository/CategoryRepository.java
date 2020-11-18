package project.kimjinbo.RMS.repository;


import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import project.kimjinbo.RMS.model.entity.Category;
import project.kimjinbo.RMS.model.entity.CategoryPK;
import project.kimjinbo.RMS.model.entity.Item;


@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {

}
