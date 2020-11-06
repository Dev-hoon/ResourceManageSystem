package project.kimjinbo.RMS.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.kimjinbo.RMS.configs.ItemSpecs;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.Category;
import project.kimjinbo.RMS.model.entity.Item;
import project.kimjinbo.RMS.model.enumclass.ItemState;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.Pagination;
import project.kimjinbo.RMS.model.network.request.ItemApiRequest;
import project.kimjinbo.RMS.model.network.response.ItemApiResponse;
import project.kimjinbo.RMS.repository.CategoryRepository;
import project.kimjinbo.RMS.repository.ItemRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.*;

@Service
public class CateApiLogicService implements CrudInterface<ItemApiRequest,ItemApiResponse> {

    @Autowired
    private CategoryRepository cateRepository;

    @Override
    public Header<ItemApiResponse> create( Header<ItemApiRequest> request ) {
        LocalDate date = LocalDate.now();

        // 1. request data
        ItemApiRequest itemApiRequest = request.getData();

        // 2. Item 생성
        Item item = Item.builder()
                .id( itemApiRequest.getId() )
                .superCate( itemApiRequest.getSuperCate() )
                .subCateFirst( itemApiRequest.getSubCateFirst() )
                .subCateSecond(itemApiRequest.getSubCateSecond() )
                .registerDate( date )
                .updateDate( date )
                .registerUser( itemApiRequest.getRegisterUser() )
                .updateUser( itemApiRequest.getRegisterUser() )
                .expireDate( LocalDate.parse(itemApiRequest.getExpireDate(), DateTimeFormatter.ISO_DATE) )
                .name( itemApiRequest.getName() )
                .cost( itemApiRequest.getCost() )
                .purchasedCost( itemApiRequest.getPurchasedCost() )
                .memo( itemApiRequest.getMemo() )
                .itemState( Integer.valueOf( itemApiRequest.getItemState() ) )
                .placeState( itemApiRequest.getPlaceState() )
                .rentalState(Integer.valueOf(itemApiRequest.getRentalState()))
                .build();

        // Item newItem = itemRepository.save(item);

        // 3. 생성된 데이터 -> userApiResponse return
        //return Header.OK( response(newItem) );
        return Header.OK( );
    }

    @Override
    public Header<ItemApiResponse> read(Long id) {
        /*return itemRepository.findById(id)
                .map( item->response(item))
                .map(Header::OK)
                .orElseGet( () ->Header.ERROR("데이터 없음") );*/
                return null;
    }

    public Header<Map> readCategories( ) {
        List<Category> categories = cateRepository.findAll();

        Map<String, Map<String, List<String>>> categoriesMap =
                categories.stream().collect(groupingBy(Category::getSuperCate, groupingBy(Category::getSubCateFirst, mapping(Category::getSubCateSecond, toList()))));

        return new Header<Map>( ).OK( categoriesMap );

        /*
        return itemRepository.findById(id)
                .map( item->response(item))
                .map(Header::OK)
                .orElseGet( () ->Header.ERROR("데이터 없음") );
        return null;*/
    }

    @Override
    public Header<ItemApiResponse> update(Header<ItemApiRequest> request) {/*
        LocalDate date = LocalDate.now();

        ItemApiRequest itemApiRequest = request.getData();

        // 2. id -> user 데이터 를 찾고
        Optional<Item> optional = itemRepository.findById( itemApiRequest.getId() );

        // 3. data -> update   id
        return optional.map( item -> {
                item
                .setId( itemApiRequest.getId() )
                .setSuperCate( itemApiRequest.getSuperCate() )
                .setSubCateFirst( itemApiRequest.getSubCateFirst() )
                .setSubCateSecond(itemApiRequest.getSubCateSecond() )
                .setUpdateDate( date )
                .setRegisterUser( itemApiRequest.getRegisterUser() )
                .setUpdateUser( itemApiRequest.getRegisterUser() )
                .setExpireDate( LocalDate.parse(itemApiRequest.getExpireDate(), DateTimeFormatter.ISO_DATE)  )
                .setName( itemApiRequest.getName() )
                .setCost( itemApiRequest.getCost() )
                .setPurchasedCost( itemApiRequest.getPurchasedCost() )
                .setMemo( itemApiRequest.getMemo() )
                .setItemState( itemApiRequest.getItemState() )
                .setPlaceState( itemApiRequest.getPlaceState() )
                .setRentalState( itemApiRequest.getRentalState() );
            return item;
        })
        .map(item -> itemRepository.save(item) )             // update -> newUser
        .map(item -> response(item) )                        // userApiResponse
        .map(Header::OK)
        .orElseGet(()->Header.ERROR("데이터 없음"));*/
        return null;
    }

    @Override
    public Header delete(Long id) {
        /*
        Optional<Item> optional = itemRepository.findById(id);

        return optional.map( item ->{
            itemRepository.delete(item);
            return Header.OK();
        }).orElseGet(()->Header.ERROR("데이터 없음"));
        */

        return null;
    }

    public Header<List<ItemApiResponse>> search(Pageable pageable,ItemApiRequest request) {
        /*
        LocalDate date = LocalDate.now();

        Page<Item> items =itemRepository.findAll(
                ItemSpecs.superCate( request.getSuperCate() ).and(
                ItemSpecs.subCateFirst(request.getSubCateFirst()) ).and(
                ItemSpecs.subCateSecond(request.getSubCateSecond())),
                pageable);

        List<ItemApiResponse> itemApiResponseList = items.stream()
                .map(user -> response(user))
                .collect(Collectors.toList());

        Pagination pagination = Pagination.builder()
                .totalPages(items.getTotalPages())
                .totalElements(items.getTotalElements())
                .currentPage(items.getNumber())
                .currentElements(items.getNumberOfElements())
                .build();

        return Header.OK( itemApiResponseList,pagination );*/
        return null;
    }

    public ItemApiResponse response(Item item){/*

        ItemApiResponse itemApiResponse = ItemApiResponse.builder()
                .id(item.getId())
                .superCate( item.getSuperCate() )
                .subCateFirst( item.getSubCateFirst() )
                .subCateSecond(item.getSubCateSecond() )
                .registerDate(item.getRegisterDate() )
                .expireDate(item.getExpireDate() )
                .name( item.getName() )
                .cost( item.getCost() )
                .purchasedCost( item.getPurchasedCost() )
                .memo( item.getMemo() )
                .itemState( item.getItemState() )
                .placeState( item.getPlaceState() )
                .rentalState( item.getRentalState() )
                .build();

        return itemApiResponse;*/
        return null;
    }

}

/*
     public Header<ItemApiResponse> readWhere(Header<ItemApiRequest> request) {
        LocalDate date = LocalDate.now();

        ItemApiRequest req = request.getData();

        List<ItemApiResponse> items = itemRepository.findAll(
                ItemSpecs.superCate(  req.getSuperCate() ).and(
                        ItemSpecs.subCateFirst(req.getSubCateFirst()) ).and(
                        ItemSpecs.subCateSecond(req.getSubCateSecond())
                )
        ).stream().map( el-> ( response(el) ) ).collect(Collectors.toList());

        return Header.OK( items.get(0) );
    }
 */