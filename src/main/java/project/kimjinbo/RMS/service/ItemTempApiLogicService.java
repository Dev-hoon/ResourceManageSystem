package project.kimjinbo.RMS.service;

import lombok.SneakyThrows;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.transaction.annotation.Transactional;
import project.kimjinbo.RMS.configs.ItemTempSpecs;
import project.kimjinbo.RMS.exception.UserAuthException;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.Item;
import project.kimjinbo.RMS.model.entity.ItemTemp;
import project.kimjinbo.RMS.model.enumclass.ItemState;
import project.kimjinbo.RMS.model.enumclass.RentalState;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.Pagination;
import project.kimjinbo.RMS.model.network.request.ItemTempApiRequest;
import project.kimjinbo.RMS.model.network.request.ItemTempRequest;
import project.kimjinbo.RMS.model.network.response.ItemTempApiResponse;
import project.kimjinbo.RMS.repository.ItemRepository;
import project.kimjinbo.RMS.repository.ItemTempRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
public class ItemTempApiLogicService implements CrudInterface<ItemTempApiRequest, ItemTempApiResponse> {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ItemTempRepository itemTempRepository;

    @Override
    public Header<ItemTempApiResponse> create( Header<ItemTempApiRequest> request ) {
        LocalDate date = LocalDate.now();

        // 1. request data
        ItemTempApiRequest itemTempApiRequest = request.getData();

        // 2. Item 생성
        ItemTemp item = ItemTemp.builder()
                .registerDate( date )
                .updateDate( date )
                .registerUser( itemTempApiRequest.getRegisterUser() )
                .updateUser( itemTempApiRequest.getRegisterUser() )
                .id( itemTempApiRequest.getId() )
                .superCate( itemTempApiRequest.getSuperCate() )
                .subCateFirst( itemTempApiRequest.getSubCateFirst() )
                .subCateSecond(itemTempApiRequest.getSubCateSecond() )
                .expireDate( (itemTempApiRequest.getExpireDate()==null)? null : LocalDate.parse(itemTempApiRequest.getExpireDate(), DateTimeFormatter.ISO_DATE) )
                .name( itemTempApiRequest.getName() )
                .cost( itemTempApiRequest.getCost() )
                .purchaseCost( itemTempApiRequest.getPurchaseCost() )
                .cdKey( itemTempApiRequest.getCdKey() )
                .licence( itemTempApiRequest.getLicence() )
                .memo( itemTempApiRequest.getMemo() )
                .detail( itemTempApiRequest.getDetail() )
                .itemState( itemTempApiRequest.getItemState() )
                .placeState( itemTempApiRequest.getPlaceState() )
                .rentalState( itemTempApiRequest.getRentalState() )
                .build();

        ItemTemp newItem = itemTempRepository.save(item);

        // 3. 생성된 데이터 -> userApiResponse return
        return Header.OK( response(newItem) );
    }

    @Override
    public Header<ItemTempApiResponse> read(Long id) {
        return itemTempRepository.findById(id)
                .map( item->response(item) )
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
            .setUpdateUser( itemTempApiRequest.getRegisterUser() )
            .setExpireDate( (itemTempApiRequest.getExpireDate()==null)? null : LocalDate.parse(itemTempApiRequest.getExpireDate(), DateTimeFormatter.ISO_DATE)  )
            .setName( itemTempApiRequest.getName() )
            .setCost( itemTempApiRequest.getCost() )
            .setPurchaseCost( itemTempApiRequest.getPurchaseCost() )
            .setCdKey( itemTempApiRequest.getCdKey() )
            .setLicence( itemTempApiRequest.getLicence() )
            .setMemo( itemTempApiRequest.getMemo() )
            .setDetail( itemTempApiRequest.getDetail() )
            .setItemState( itemTempApiRequest.getItemState() )
            .setPlaceState( itemTempApiRequest.getPlaceState() )
            .setRentalState( itemTempApiRequest.getRentalState() );
            return item;
        })
        .map(item -> itemTempRepository.save(item) )             // update -> newUser
        .map(item -> response(item) )                        // userApiResponse
        .map(Header::OK)
        .orElseGet(()->Header.ERROR("데이터 없음"));
    }

    @Override
    public Header delete(Long id) {
        Optional<ItemTemp> optional = itemTempRepository.findById( id );

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

    @Transactional
    public Header createItems(Header<ItemTempRequest> request) {
        LocalDate date = LocalDate.now();

        ItemTempRequest itemTempRequest = request.getData();

        List temps = itemTempRequest.getItems().stream().map( ( item )->{
            try {

                Optional<ItemTemp> itemTemp =  itemTempRepository.findById( item );

                if( itemTemp.isPresent() ) {
                    Item newItem = new Item( itemTemp.get() );

                    newItem.setUpdateDate( date );
                    newItem.setUpdateUser( itemTempRequest.getUserId() );

                    itemRepository.save( newItem );

                    itemTempRepository.delete( itemTemp.get() );

                }else{
                    throw new RuntimeException("delete error");
                }

                return "createItems";
            } catch(Exception e) {
                return new RuntimeException("delete error");
            }
        }).collect(Collectors.toList());

        System.out.println("temps : "+temps );

        return Header.OK( temps );
    }

    @Transactional
    public Header deleteItems(Header<ItemTempRequest> request) {

        ItemTempRequest itemTempRequest = request.getData();

        List temps = itemTempRequest.getItems().stream().map( ( item )->{
            try {
                System.out.println("item, bookmarkRequests.getUserId() "+item+" / "+itemTempRequest.getUserId());
                itemTempRepository.deleteById( item );
                return "deleted";
            } catch(Exception e) {
                return new RuntimeException("delete error");
            }
        }).collect(Collectors.toList());

        System.out.println("temps : "+temps );

        return Header.OK( temps );
    }

    public ItemTempApiResponse response(ItemTemp item){

        ItemTempApiResponse itemTempApiResponse =
            ItemTempApiResponse.builder()
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
            .itemState( (item.getItemState()==null)? null : ItemState.titleOf( item.getItemState()) )
            .rentalState( (item.getRentalState()==null)? null : RentalState.titleOf(item.getRentalState()) )
            .build();

        if( itemTempApiResponse.getSuperCate()=="SW" ){
            itemTempApiResponse.setCdKey( item.getCdKey() ).setLicence( item.getLicence() );
        }

        return itemTempApiResponse;
    }

}