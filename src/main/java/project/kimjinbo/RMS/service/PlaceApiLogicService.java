package project.kimjinbo.RMS.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.kimjinbo.RMS.configs.ItemSpecs;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.Category;
import project.kimjinbo.RMS.model.entity.Department;
import project.kimjinbo.RMS.model.entity.Item;
import project.kimjinbo.RMS.model.entity.Place;
import project.kimjinbo.RMS.model.enumclass.ItemState;
import project.kimjinbo.RMS.model.enumclass.RentalState;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.Pagination;
import project.kimjinbo.RMS.model.network.request.DepartmentApiRequest;
import project.kimjinbo.RMS.model.network.request.ItemApiRequest;
import project.kimjinbo.RMS.model.network.request.PlaceApiRequest;
import project.kimjinbo.RMS.model.network.response.DepartmentApiResponse;
import project.kimjinbo.RMS.model.network.response.ItemApiResponse;
import project.kimjinbo.RMS.model.network.response.PlaceApiResponse;
import project.kimjinbo.RMS.model.network.response.PlaceListApiResponse;
import project.kimjinbo.RMS.repository.CategoryRepository;
import project.kimjinbo.RMS.repository.PlaceRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.*;

@Service
public class PlaceApiLogicService implements CrudInterface<PlaceApiRequest, PlaceApiResponse> {

    @Autowired
    private PlaceRepository placeRepository;

    @Override
    public Header<PlaceApiResponse> create( Header<PlaceApiRequest> request ) {
        LocalDate date = LocalDate.now();

        // 1. request data
        PlaceApiRequest placeApiRequest = request.getData();

        // 2. place 생성
        Place place = Place.builder()
                .id( placeApiRequest.getId() )
                .registerDate( date )
                .updateDate( date )
                .registerUser( placeApiRequest.getRegisterUser() )
                .updateUser( placeApiRequest.getRegisterUser() )
                .name( placeApiRequest.getName() )
                .address( placeApiRequest.getAddress() )
                .addressDetail( placeApiRequest.getAddressDetail() )
                .phone( placeApiRequest.getPhone() )
                .fax( placeApiRequest.getFax()  )
                .build();

        Place newPlace = placeRepository.save(place);

        // 3. 생성된 데이터 -> userApiResponse return
        return Header.OK( response(newPlace) );

    }

    @Override
    public Header<PlaceApiResponse> read(Long id) {
        return null;
    }

    @Override
    public Header<PlaceApiResponse> update(Header<PlaceApiRequest> request) {
        LocalDate date = LocalDate.now();

        PlaceApiRequest placeApiRequest = request.getData();

        // 2. id -> place 데이터 를 찾고
        Optional<Place> optional = placeRepository.findById( placeApiRequest.getId() );

        // 3. data -> update  id
        return optional.map( item -> {
            item
            .setId( placeApiRequest.getId() )
            .setAddress( placeApiRequest.getAddress() )
            .setAddressDetail( placeApiRequest.getAddressDetail() )
            .setPhone( placeApiRequest.getPhone() )
            .setFax( placeApiRequest.getFax() )
            .setUpdateDate( date )
            .setUpdateUser( placeApiRequest.getUpdateUser() )
            .setName( placeApiRequest.getName() );

            return item;
        })
        .map(item -> placeRepository.save(item) )             // update -> newUser
        .map(item -> response(item) )                        // userApiResponse
        .map(Header::OK)
        .orElseGet(()->Header.ERROR("데이터 없음"));
    }

    @Override
    public Header delete(Long id) {
        Optional<Place> optional = placeRepository.findById(  Math.toIntExact(id) );

        return optional.map( item ->{
            placeRepository.delete(item);
            return Header.OK();
        }).orElseGet(()->Header.ERROR("데이터 없음"));
    }

    public Header<List<PlaceApiResponse>> search(Pageable pageable, PlaceApiRequest request) {

        Page<Place> places = placeRepository.findAll( pageable );

        List<PlaceApiResponse> placeApiResponseList = places.stream()
                .map(item -> response(item))
                .collect(Collectors.toList());

        Pagination pagination = Pagination.builder()
                .totalPages(places.getTotalPages())
                .totalElements(places.getTotalElements())
                .currentPage(places.getNumber())
                .currentElements(places.getNumberOfElements())
                .build();

        return Header.OK( placeApiResponseList, pagination );
    }

    public Header<List<PlaceListApiResponse>> searchList( ) {

        List<Place> places = placeRepository.findAll();

        List<PlaceListApiResponse> placeApiResponseList = places.stream()
                .map(item ->
                    PlaceListApiResponse.builder()
                        .id(item.getId())
                        .name( item.getName() )
                        .address( item.getAddress() )
                        .addressDetail( item.getAddressDetail())
                        .build()
                )
                .collect(Collectors.toList());

        return Header.OK( placeApiResponseList );
    }

    public PlaceApiResponse response(Place place){

        return PlaceApiResponse.builder()
                .id(place.getId())
                .updateDate( place.getUpdateDate() )
                .name( place.getName() )
                .address( place.getAddress() )
                .addressDetail( place.getAddressDetail() )
                .phone( place.getPhone() )
                .fax( place.getFax() )
                .build();
    }
}