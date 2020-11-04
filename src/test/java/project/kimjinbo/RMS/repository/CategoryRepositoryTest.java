package project.kimjinbo.RMS.repository;


import org.json.JSONObject;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import project.kimjinbo.RMS.RMSApplicationTests;
import project.kimjinbo.RMS.model.entity.Category;
import project.kimjinbo.RMS.model.entity.CategoryId;

import java.time.LocalDate;
import java.util.*;

import static java.util.stream.Collectors.*;

public class CategoryRepositoryTest extends RMSApplicationTests {
    @Autowired
    CategoryRepository cateRepo;

    @Test
    public void create(){
        CategoryId cateId = new CategoryId("HW","컴퓨터","노트북");
        Category category = new Category();
        category.setSuperCate( cateId.getSuperCate() );
        category.setSubCateFirst( cateId.getSubCateFirst() );
        category.setSubCateSecond( cateId.getSubCateSecond() );
        category.setRegisterDate( LocalDate.now() );
        category.setRegisterUser( 0L );
        category.setUpdateDate( LocalDate.now() );

        Category newCate = cateRepo.save( category );
        System.out.println("newCate   : "+newCate);

        System.out.println("test done!");

    }

    @Test
    public void read(){
        Optional<Category> dep = cateRepo.findById( new CategoryId("HW","컴퓨터","노트북") );

        dep.ifPresent(test ->{
            System.out.println("test:" + test);
        });
    }

    @Test
    public void getCategories(){
        List<Category> categories = cateRepo.findAll();

        Map<String, Map<String, List<String>>> categoriesMap =
                categories.stream().collect( groupingBy(Category::getSuperCate, groupingBy(Category::getSubCateFirst, mapping(Category::getSubCateSecond, toList() ) ) ) );

        JSONObject jsonObject = new JSONObject( categoriesMap );

        System.out.println("categories    : " + categories);
        System.out.println("categoriesMap : " + categoriesMap);
        System.out.println("jsonObject    : " + jsonObject);


    }
}