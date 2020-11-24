package project.kimjinbo.RMS.service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.kimjinbo.RMS.configs.ItemSpecs;
import project.kimjinbo.RMS.model.entity.Item;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.enumclass.ItemState;
import project.kimjinbo.RMS.model.enumclass.RentalState;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.Pagination;
import project.kimjinbo.RMS.model.network.request.ItemApiRequest;
import project.kimjinbo.RMS.model.network.response.ItemApiResponse;
import project.kimjinbo.RMS.repository.ItemRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ItemApiLogicService implements CrudInterface<ItemApiRequest, ItemApiResponse> {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private CateApiLogicService cateApiLogicService;

    @Autowired
    private ItemTempApiLogicService itemTempApiLogicService;

    @Autowired
    private PlaceApiLogicService placeApiLogicService;

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
                .expireDate( (itemApiRequest.getExpireDate()==null)? null : LocalDate.parse(itemApiRequest.getExpireDate(), DateTimeFormatter.ISO_DATE) )
                .name( itemApiRequest.getName() )
                .cost( itemApiRequest.getCost() )
                .purchaseCost( itemApiRequest.getPurchaseCost() )
                .cdKey( itemApiRequest.getCdKey() )
                .licence( itemApiRequest.getLicence() )
                .memo( itemApiRequest.getMemo() )
                .detail( itemApiRequest.getDetail() )
                .itemState( itemApiRequest.getItemState() )
                .placeState( itemApiRequest.getPlaceState() )
                .rentalState( itemApiRequest.getRentalState() )
                .build();

        Item newItem = itemRepository.save(item);

        // 3. 생성된 데이터 -> userApiResponse return
        return Header.OK( response(newItem) );
    }

    @Override
    public Header<ItemApiResponse> read(Long id) {
        return itemRepository.findById(id)
                .map( item->response(item))
                .map(Header::OK)
                .orElseGet( () ->Header.ERROR("데이터 없음") );
    }

    @Override
    public Header<ItemApiResponse> update(Header<ItemApiRequest> request) {
        LocalDate date = LocalDate.now();

        ItemApiRequest itemApiRequest = request.getData();

        // 2. id -> user 데이터 를 찾고
        Optional<Item> optional = itemRepository.findById( itemApiRequest.getId() );


        System.out.println("ITEM update itemApiRequest : "+itemApiRequest);
        // 3. data -> update   id
        return optional.map( item -> {
            item
            .setId( itemApiRequest.getId() )
            .setSuperCate( itemApiRequest.getSuperCate() )
            .setSubCateFirst( itemApiRequest.getSubCateFirst() )
            .setSubCateSecond(itemApiRequest.getSubCateSecond() )
            .setUpdateDate( date )
            .setUpdateUser( itemApiRequest.getUpdateUser() )
            .setExpireDate( (itemApiRequest.getExpireDate()==null)? null : LocalDate.parse(itemApiRequest.getExpireDate(), DateTimeFormatter.ISO_DATE)  )
            .setName( itemApiRequest.getName() )
            .setCost( itemApiRequest.getCost() )
            .setPurchaseCost( itemApiRequest.getPurchaseCost() )
            .setCdKey( itemApiRequest.getCdKey() )
            .setLicence( itemApiRequest.getLicence() )
            .setMemo( itemApiRequest.getMemo() )
            .setDetail( itemApiRequest.getDetail() )
            .setItemState( itemApiRequest.getItemState() )
            .setPlaceState( itemApiRequest.getPlaceState() )
            .setRentalState( itemApiRequest.getRentalState() );
            return item;
        })
        .map(item -> itemRepository.save(item) )             // update -> newUser
        .map(item -> response(item) )                        // userApiResponse
        .map(Header::OK)
        .orElseGet(()->Header.ERROR("데이터 없음"));
    }

    @Override
    public Header delete(Long id) {
        Optional<Item> optional = itemRepository.findById(id);

        return optional.map( item ->{
            itemRepository.delete(item);
            return Header.OK();
        }).orElseGet(()->Header.ERROR("데이터 없음"));
    }

    public Header<List<ItemApiResponse>> search(Pageable pageable,ItemApiRequest request) {

        Page<Item> items =itemRepository.findAll(
                ItemSpecs.superCate( request.getSuperCate() ).and(
                ItemSpecs.subCateFirst(request.getSubCateFirst())).and(
                ItemSpecs.subCateSecond(request.getSubCateSecond())).and(
                ItemSpecs.expireDate(request.getExpireDate())).and(
                ItemSpecs.registerDate(request.getRegisterDate())).and(
                ItemSpecs.name( request.getName())).and(
                ItemSpecs.itemState( request.getItemState() )).and(
                ItemSpecs.rentalState( request.getRentalState() ))
                ,pageable);

        List<ItemApiResponse> itemApiResponseList = items.stream()
                .map(item -> response(item))
                .collect(Collectors.toList());

        Pagination pagination = Pagination.builder()
                .totalPages(items.getTotalPages())
                .totalElements(items.getTotalElements())
                .currentPage(items.getNumber())
                .currentElements(items.getNumberOfElements())
                .build();

        return Header.OK( itemApiResponseList, pagination );
    }

    public Header amount( ItemApiRequest request ) {

        List<Item> items =itemRepository.findAll(
                ItemSpecs.superCate( request.getSuperCate() ).and(
                        ItemSpecs.subCateFirst( request.getSubCateFirst())).and(
                        ItemSpecs.subCateSecond( request.getSubCateSecond())).and(
                        ItemSpecs.expireDate( request.getExpireDate())).and(
                        ItemSpecs.registerDate( request.getRegisterDate())).and(
                        ItemSpecs.name( request.getName())).and(
                        ItemSpecs.itemState( request.getItemState() )).and(
                        ItemSpecs.rentalState( request.getRentalState() )).and(
                        ItemSpecs.expireDateMore( request.getExpireDateMore())).and(
                        ItemSpecs.registerDateMore( request.getRegisterDateMore()) )
                );

        return Header.OK( items.size() );
    }

    public ItemApiResponse response(Item item){

        ItemApiResponse itemApiResponse = ItemApiResponse.builder()
                .id(item.getId())
                .superCate( item.getSuperCate() )
                .subCateFirst( item.getSubCateFirst() )
                .subCateSecond(item.getSubCateSecond() )
                .registerDate(item.getRegisterDate() )
                .expireDate(item.getExpireDate() )
                .name( item.getName() )
                .cost( item.getCost() )
                .purchaseCost( item.getPurchaseCost() )
                .memo( item.getMemo() )
                .detail( item.getDetail() )
                .placeState( item.getPlaceState() )
                .placeName((item.getPlace()==null)? null : item.getPlace().getName() )
                .itemState( (item.getItemState()==null)? null : ItemState.titleOf( item.getItemState()) )
                .rentalState( (item.getRentalState()==null)? null : RentalState.titleOf(item.getRentalState()) )
                .build();


        if( itemApiResponse.getSuperCate()=="SW" ){
            itemApiResponse.setCdKey( item.getCdKey() ).setLicence( item.getLicence() );
        }

        return itemApiResponse;
    }

    public Header<Object> setting(){
        Map settings = new HashMap<String,Object>();

        System.out.println("ItemState: "+ItemState.getObject());

        settings.put( "itemList"        , ItemState.getObject() );
        settings.put( "rentalList"      , RentalState.getObject() );
        settings.put( "categories"      , cateApiLogicService.readCategories().getData() );
        settings.put( "placeList"       , placeApiLogicService.searchList( ).getData() );

        return Header.OK( settings );
    }

}
