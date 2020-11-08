package project.kimjinbo.RMS.service;

import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import project.kimjinbo.RMS.configs.ItemTempSpecs;
import project.kimjinbo.RMS.exception.UserAuthException;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.ItemTemp;
import project.kimjinbo.RMS.model.enumclass.ItemState;
import project.kimjinbo.RMS.model.enumclass.RentalState;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.Pagination;
import project.kimjinbo.RMS.model.network.request.ItemTempApiRequest;
import project.kimjinbo.RMS.model.network.response.ItemTempApiResponse;
import project.kimjinbo.RMS.repository.ItemTempRepository;

import javax.persistence.NoResultException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ItemTempApiLogicService implements CrudInterface<ItemTempApiRequest, ItemTempApiResponse> {

    @Autowired
    private ItemTempRepository itemTempRepository;

    @Override
    public Header<ItemTempApiResponse> create( Header<ItemTempApiRequest> request ) {
        LocalDate date = LocalDate.now();

        // 1. request data
        ItemTempApiRequest itemTempApiRequest = request.getData();

        if( itemTempApiRequest.getItemState().equals("") ) itemTempApiRequest.setItemState("미등록");
        if( itemTempApiRequest.getRentalState().equals("") ) itemTempApiRequest.setRentalState("미등록");

        // 2. Item 생성
        ItemTemp item = ItemTemp.builder()
                .id( itemTempApiRequest.getId() )
                .superCate( itemTempApiRequest.getSuperCate() )
                .subCateFirst( itemTempApiRequest.getSubCateFirst() )
                .subCateSecond(itemTempApiRequest.getSubCateSecond() )
                .registerDate( date )
                .updateDate( date )
                .registerUser( itemTempApiRequest.getRegisterUser() )
                .expireDate( date )
                .name( itemTempApiRequest.getName() )
                .cost( itemTempApiRequest.getCost() )
                .purchaseCost( itemTempApiRequest.getPurchaseCost() )
                .memo( itemTempApiRequest.getMemo() )
                .itemState( ItemState.idOf(itemTempApiRequest.getItemState()) )
                .rentalState( RentalState.idOf(itemTempApiRequest.getRentalState()) )
                .placeState( itemTempApiRequest.getPlaceState() )
                .build();

        ItemTemp newItem = itemTempRepository.save(item);

        // 3. 생성된 데이터 -> userApiResponse return
        return Header.OK( response(newItem) );
    }

    @Override
    public Header<ItemTempApiResponse> read(Long id) {
        return itemTempRepository.findById(id)
                .map( item->response(item))
                .map(Header::OK)
                .orElseGet( () ->Header.ERROR("데이터 없음") );
    }

    @Override
    public Header<ItemTempApiResponse> update(Header<ItemTempApiRequest> request) {
        LocalDate date = LocalDate.now();

        ItemTempApiRequest itemTempApiRequest = request.getData();

        // 2. id -> user 데이터 를 찾고
        Optional<ItemTemp> optional = itemTempRepository.findById( itemTempApiRequest.getId() );

        // 3. data -> update   id
        return optional.map( item -> {
                item
                .setId( itemTempApiRequest.getId() )
                .setSuperCate( itemTempApiRequest.getSuperCate() )
                .setSubCateFirst( itemTempApiRequest.getSubCateFirst() )
                .setSubCateSecond(itemTempApiRequest.getSubCateSecond() )
                .setUpdateDate( date )
                .setRegisterUser( itemTempApiRequest.getRegisterUser() )
                .setExpireDate( LocalDate.parse(itemTempApiRequest.getExpireDate(), DateTimeFormatter.ISO_DATE)  )
                .setName( itemTempApiRequest.getName() )
                .setCost( itemTempApiRequest.getCost() )
                .setPurchaseCost( itemTempApiRequest.getPurchaseCost() )
                .setMemo( itemTempApiRequest.getMemo() )
                .setItemState( ItemState.idOf(itemTempApiRequest.getItemState()) )
                .setPlaceState( itemTempApiRequest.getPlaceState() )
                .setRentalState(  RentalState.idOf(itemTempApiRequest.getRentalState()));
            return item;
        })
        .map(item -> itemTempRepository.save(item) )             // update -> newUser
        .map(item -> response( item ) )                        // userApiResponse
        .map(Header::OK)
        .orElseGet(()->Header.ERROR("데이터 없음"));
    }

    @Override
    public Header delete(Long id) {
        Optional<ItemTemp> optional = itemTempRepository.findById(id);

        return optional.map( item ->{
            itemTempRepository.delete(item);
            return Header.OK();
        }).orElseGet(()->Header.ERROR("데이터 없음"));
    }

    @SneakyThrows
    public Header<List<ItemTempApiResponse>> search(Pageable pageable, ItemTempApiRequest request) {

        System.out.println("request.getRegisterUser()  : "+request.getRegisterUser() );
        Optional.ofNullable(request.getRegisterUser()).orElseThrow(()->new UserAuthException("update user가 존재하지 않습니다."));

        Page<ItemTemp> items =itemTempRepository.findAll(
                ItemTempSpecs.registerDate( request.getRegisterDate() ).and(
                ItemTempSpecs.registerUser( request.getRegisterUser() ) )
                , pageable);

        List<ItemTempApiResponse> itemTempApiResponseList = items.stream()
                .map(item -> response(item) )
                .collect(Collectors.toList());

        Pagination pagination = Pagination.builder()
                .totalPages(items.getTotalPages())
                .totalElements(items.getTotalElements())
                .currentPage(items.getNumber())
                .currentElements(items.getNumberOfElements())
                .build();

        return Header.OK( itemTempApiResponseList, pagination );
    }

    @SneakyThrows
    public Header<Long> amount(Pageable pageable, ItemTempApiRequest request) {

        System.out.println("request.getRegisterUser()  : "+request.getRegisterUser() );
        Optional.ofNullable(request.getRegisterUser()).orElseThrow(()->new UserAuthException("update user가 존재하지 않습니다."));

        Page<ItemTemp> items =itemTempRepository.findAll(
                ItemTempSpecs.registerDate( request.getRegisterDate() ).and(
                ItemTempSpecs.registerUser( request.getRegisterUser() ) )
                , pageable);

        return Header.OK( items.getTotalElements() );
    }

    /*
    public Header<List<ItemApiResponse>> search(Pageable pageable,ItemApiRequest request) {
        LocalDate date = LocalDate.now();

        Page<Item> items =itemTempRepository.findAll(
                ItemSpecs.superCate( request.getSuperCate() ).and(
                ItemSpecs.subCateFirst(request.getSubCateFirst())).and(
                ItemSpecs.subCateSecond(request.getSubCateSecond())).and(
                ItemSpecs.expireDate(request.getExpireDate())).and(
                ItemSpecs.registerDate(request.getRegisterDate())).and(
                ItemSpecs.name( request.getName())).and(
                ItemSpecs.itemState( ItemState.idOf(request.getItemState()) )).and(
                ItemSpecs.rentalState( RentalState.idOf(request.getRentalState()) ))
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
    }*/

    public ItemTempApiResponse response(ItemTemp item){

        ItemTempApiResponse itemTempApiResponse = ItemTempApiResponse.builder()
                .id(item.getId())
                .superCate( item.getSuperCate() )
                .subCateFirst( item.getSubCateFirst() )
                .subCateSecond( item.getSubCateSecond() )
                .registerDate( item.getRegisterDate() )
                .expireDate( item.getExpireDate() )
                .name( item.getName() )
                .cost( item.getCost() )
                .purchaseCost( item.getPurchaseCost() )
                .memo( item.getMemo() )
                .itemState( ItemState.titleOf( item.getItemState()) )
                .placeState( item.getPlaceState() )
                .rentalState( RentalState.titleOf(item.getRentalState()) )
                .build();

        return itemTempApiResponse;
    }

}