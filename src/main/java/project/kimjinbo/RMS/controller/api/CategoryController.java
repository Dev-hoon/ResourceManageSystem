package project.kimjinbo.RMS.controller.api;


import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.Category;
import project.kimjinbo.RMS.model.entity.CategoryPK;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.request.CateApiRequest;
import project.kimjinbo.RMS.model.network.request.DepartmentApiRequest;
import project.kimjinbo.RMS.model.network.request.ItemApiRequest;
import project.kimjinbo.RMS.model.network.response.CateApiResponse;
import project.kimjinbo.RMS.model.network.response.DepartmentApiResponse;
import project.kimjinbo.RMS.model.network.response.ItemApiResponse;
import project.kimjinbo.RMS.repository.CategoryRepository;
import project.kimjinbo.RMS.service.CateApiLogicService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api") //localhost:8080/api
public class CategoryController implements CrudInterface<CateApiRequest, CateApiResponse> {

    @Autowired
    CateApiLogicService cateApiLogicService;


    @GetMapping("/categories") // localhost:8080/api/categories
    public Object ReadCategories() {
        return cateApiLogicService.readCategories();
    }


    @GetMapping("/categoryList")
    @ResponseBody
    public Header<List<CateApiResponse>> readItems(@PageableDefault(sort = { "superCate" }, direction = Sort.Direction.ASC) Pageable pageable, CateApiRequest request ) {
        return cateApiLogicService.search( pageable, request );
    }


    @Override
    @PostMapping("/category") // localhost:8080/api/category
    public Header<CateApiResponse> create( @RequestBody Header<CateApiRequest> request) {
        System.out.println(" category controller request : "+request);
        return cateApiLogicService.create( request );
    }

    @Override
    public Header<CateApiResponse> read(Long id) { return null; }

    public Header<CateApiResponse> read(Header<CateApiRequest> request) {
        return null;
    }

    @Override
    @PutMapping("/category")
    public Header<CateApiResponse> update(@RequestBody Header<CateApiRequest> request) {
        System.out.println( "request update : "+request );
        return cateApiLogicService.update( request );
    }

    @DeleteMapping("/category/{id}") // localhost:8080/api/category
    public Header delete(@PathVariable(name = "id") Long id) {
        return cateApiLogicService.delete( id );
    }
/*
    @PutMapping("/category") // localhost:8080/api/category
    public String UpdateMethod(@RequestBody Map<String, Object> bodyObject) {
        CategoryPK categoryPK = new CategoryPK((String)bodyObject.get("superCate"),(String) bodyObject.get("subCateFirst"),(String) bodyObject.get("subCateSecond"));

        Optional<Category> DBCategory = cateRepo.findById(categoryPK);

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
    }*/
/*
    @DeleteMapping("/category") // localhost:8080/api/category?superCate=HW&subCateFirst=TEST&subCateSecond=노트북
    public Header<CateApiResponse> DeleteMethod(CategoryPK categoryPK) {
        Optional<Category> DBCategory = cateRepo.findById(categoryPK);

        // 입력 전 데이터가 있는지 확인
        try {
            if (!DBCategory.isPresent()) {
                return null; //"Not exist on DB";
            }

            cateRepo.deleteById(categoryPK);

        } catch (Exception event) {
            System.out.println("Event : " + event);
            return null; //"FAIL";
        }

        return null; //"DELETED";
    }
*/


}