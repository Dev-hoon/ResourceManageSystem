package project.kimjinbo.RMS.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.kimjinbo.RMS.configs.CategorySpecs;
import project.kimjinbo.RMS.configs.ItemSpecs;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.Category;
import project.kimjinbo.RMS.model.entity.CategoryPK;
import project.kimjinbo.RMS.model.entity.Department;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.Pagination;
import project.kimjinbo.RMS.model.network.request.CateApiRequest;
import project.kimjinbo.RMS.model.network.request.DepartmentApiRequest;
import project.kimjinbo.RMS.model.network.response.CateApiResponse;
import project.kimjinbo.RMS.repository.CategoryRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.*;

@Service
public class CateApiLogicService implements CrudInterface<CateApiRequest, CateApiResponse> {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Header<CateApiResponse> create( Header<CateApiRequest> request ) {
        LocalDate date = LocalDate.now();

        System.out.println("request: "+request.getData() );

        // 1. request data
        CateApiRequest cateApiRequest = request.getData();

        // 2. Cate 생성
        Category category = Category.builder()
                .id( cateApiRequest.getId() )
                .superCate( cateApiRequest.getSuperCate() )
                .subCateFirst( cateApiRequest.getSubCateFirst() )
                .subCateSecond(cateApiRequest.getSubCateSecond() )
                .registerDate( date )
                .updateDate( date )
                .registerUser( cateApiRequest.getRegisterUser() )
                .updateUser( cateApiRequest.getRegisterUser() )
                .expireDate( cateApiRequest.getExpireDate() )
                .build();

        Category newCategory = categoryRepository.save( category);

        return Header.OK( response(newCategory) );

    }

    @Override
    public Header<CateApiResponse> read(Long id) { return null; }

    @Override
    public Header<CateApiResponse> update( Header<CateApiRequest> request) {
        LocalDate date = LocalDate.now();

        CateApiRequest cateApiRequest = request.getData();

        // 2. id -> department 데이터 를 찾고
        Optional<Category> optional = categoryRepository.findById( cateApiRequest.getId() );

        // 3. data -> update  id
        return optional.map( item -> {
            item
            .setUpdateDate( date )
            .setUpdateUser( cateApiRequest.getUpdateUser() )
            .setExpireDate( cateApiRequest.getExpireDate() )
            .setSuperCate( cateApiRequest.getSuperCate() )
            .setSubCateFirst( cateApiRequest.getSubCateFirst() )
            .setSubCateSecond( cateApiRequest.getSubCateSecond() );

            return item;
        })
                .map(item -> categoryRepository.save(item) )             // update -> newUser
                .map(item -> response(item) )                        // userApiResponse
                .map(Header::OK)
                .orElseGet(()->Header.ERROR("데이터 없음"));
    }

    @Override
    public Header delete( Long id ) {

        Optional<Category> optional = categoryRepository.findById( id );

        return optional.map( category ->{
            categoryRepository.delete( category );
            return Header.OK();
        }).orElseGet(()->Header.ERROR("데이터 없음"));
    }

    public Header<Map> readCategories( ) {
        List<Category> categories = categoryRepository.findAll( );

        Map<String, Map<String, List<String>>> categoriesMap =
                categories.stream().collect(groupingBy(Category::getSuperCate, groupingBy(Category::getSubCateFirst, mapping(Category::getSubCateSecond, toList()))));

        return new Header<Map>( ).OK( categoriesMap );

    }

    public Header<List<CateApiResponse>>search( Pageable pageable, CateApiRequest request ) {
        LocalDate date = LocalDate.now();

        Page<Category> categorys = categoryRepository.findAll(
                CategorySpecs.superCate( request.getSuperCate() ).and(
                CategorySpecs.subCateFirst(request.getSubCateFirst())).and(
                CategorySpecs.subCateSecond(request.getSubCateSecond()))
                , pageable );

        List<CateApiResponse> CateApiResponseListList = categorys.stream()
                .map(category -> response(category))
                .collect(Collectors.toList());

        Pagination pagination = Pagination.builder()
                .totalPages(categorys.getTotalPages())
                .totalElements(categorys.getTotalElements())
                .currentPage(categorys.getNumber())
                .currentElements(categorys.getNumberOfElements())
                .build();

        return Header.OK( CateApiResponseListList, pagination );
    }

    public CateApiResponse response(Category category){

        CateApiResponse cateApiResponse = CateApiResponse.builder()
                .id( category.getId() )
                .superCate( category.getSuperCate() )
                .subCateFirst( category.getSubCateFirst() )
                .subCateSecond(category.getSubCateSecond() )
                .regsterDate(category.getRegisterDate() )
                .expireDate(category.getExpireDate() )
                .build();

        return cateApiResponse;
    }

}
