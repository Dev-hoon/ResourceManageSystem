package project.kimjinbo.RMS.repository;


import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import project.kimjinbo.RMS.model.entity.Category;
import project.kimjinbo.RMS.model.entity.CategoryId;


@Repository
public interface CategoryRepository extends JpaRepository<Category, CategoryId> {

}
