package project.kimjinbo.RMS.controller.api;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;
import project.kimjinbo.RMS.model.entity.Category;
import project.kimjinbo.RMS.model.entity.CategoryId;
import project.kimjinbo.RMS.repository.CategoryRepository;
import project.kimjinbo.RMS.service.CateApiLogicService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static java.util.stream.Collectors.*;

@RestController
@RequestMapping("/api") //localhost:8080/api
public class CategoryController {

    @Autowired
    CategoryRepository cateRepo;

    @Autowired
    CateApiLogicService cateApiLogicService;

    @GetMapping("/categories") // localhost:8080/api/categories
    public Object ReadCategories() {
        return cateApiLogicService.readCategories();
    }

    @PostMapping("/category") // localhost:8080/api/category
    public String InsertMethod(@RequestBody Map<String, Object> bodyObject) {
        CategoryId categoryId  = new CategoryId((String) bodyObject.get("superCate"), (String) bodyObject.get("subCateFirst"), (String) bodyObject.get("subCateSecond"));

        // 입력 전 데이터가 있는지 확인
        Optional<Category> DBCategory = cateRepo.findById(categoryId);

        if (DBCategory.isPresent()) {
            return "Exist on DB";
        }

        Category category = new Category(categoryId, new Long( (Integer)bodyObject.get("registerUser") ) );

        // 새로운 값 생성
        try {
            cateRepo.save(category);
        } catch (Exception event) {
            return "FAIL";
        }

        return "INSERTED";
    }

    @PutMapping("/category") // localhost:8080/api/category
    public String UpdateMethod(@RequestBody Map<String, Object> bodyObject) {
        CategoryId categoryId  = new CategoryId((String)bodyObject.get("superCate"),(String) bodyObject.get("subCateFirst"),(String) bodyObject.get("subCateSecond"));

        Optional<Category> DBCategory = cateRepo.findById(categoryId);

        // 입력 전 데이터가 있는지 확인
        try {
            System.out.println("DBCategory.isPresent() : "+DBCategory.isPresent());
            if (!DBCategory.isPresent()) {
                return "Not exist on DB";
            }

            DBCategory.get().updateCategory((String) bodyObject.get("toSuperCate"), (String) bodyObject.get("toSubCateFirst"), (String) bodyObject.get("toSubCateSecond"), new Long( (Integer)bodyObject.get("updateUser") ) );

            cateRepo.save(DBCategory.get());
        } catch (Exception event) {
            System.out.println("Event : " + event);
            return "FAIL";
        }

        return "UPDATED";
    }

    @DeleteMapping("/category") // localhost:8080/api/category?superCate=HW&subCateFirst=TEST&subCateSecond=노트북
    public String DeleteMethod(CategoryId categoryId) {
        Optional<Category> DBCategory = cateRepo.findById(categoryId);

        // 입력 전 데이터가 있는지 확인
        try {
            if (!DBCategory.isPresent()) {
                return "Not exist on DB";
            }

            cateRepo.deleteById(categoryId);

        } catch (Exception event) {
            System.out.println("Event : " + event);
            return "FAIL";
        }

        return "DELETED";
    }
}