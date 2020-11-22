package project.kimjinbo.RMS.service;

import org.springframework.beans.factory.annotation.Autowired;;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import project.kimjinbo.RMS.configs.ItemSpecs;
import project.kimjinbo.RMS.configs.RentalSpecs;
import project.kimjinbo.RMS.interfaces.CrudInterface;
import project.kimjinbo.RMS.model.entity.Item;
import project.kimjinbo.RMS.model.entity.Rental;
import project.kimjinbo.RMS.model.entity.RentalPK;
import project.kimjinbo.RMS.model.enumclass.RentalResult;
import project.kimjinbo.RMS.model.network.Header;
import project.kimjinbo.RMS.model.network.Pagination;
import project.kimjinbo.RMS.model.network.request.RentalApiRequest;
import project.kimjinbo.RMS.model.network.response.RentalApiResponse;
import project.kimjinbo.RMS.repository.RentalRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RentalApiLogicService implements CrudInterface<RentalApiRequest, RentalApiResponse> {

    @Autowired
    RentalRepository rentalRepository;

    @Override
    public Header create(Header<RentalApiRequest> request) {
        LocalDate date = LocalDate.now();

        // 1. request data
        RentalApiRequest rentalApiRequest = request.getData();

        // 2. Item 생성
        Rental rental = Rental.builder()
                .registerDate( date )
                .updateDate( date )
                .registerUser( rentalApiRequest.getRegisterUser())
                .updateUser( rentalApiRequest.getRegisterUser() )
                .itemId( rentalApiRequest.getItemId() )
                .empId( rentalApiRequest.getEmpId() )
                .startDate( (rentalApiRequest.getStartDate()==null)? date : rentalApiRequest.getStartDate() )
                .endDate( rentalApiRequest.getEndDate() )
                .reason( rentalApiRequest.getReason() )
                .state( (rentalApiRequest.getState()==null)? RentalResult.RENTAL_WAIT.getId() : rentalApiRequest.getState() )
                .build();

        Rental newRental = rentalRepository.save(rental);

        // 3. 생성된 데이터 -> userApiResponse return
        return Header.OK( response(newRental) );
    }

    @Override
    public Header update(Header<RentalApiRequest> request) {
        LocalDate date = LocalDate.now();

        RentalApiRequest rentalApiRequest = request.getData();

        // 2. id -> user 데이터 를 찾고
        Optional<Rental> optional = rentalRepository.findById( new RentalPK( rentalApiRequest ) );

        // 3. data -> update   id
        return optional.map( item -> {
            item
            .setUpdateDate( date )
            .setUpdateUser( rentalApiRequest.getUpdateUser() )
            .setStartDate( rentalApiRequest.getStartDate() )
            .setEndDate( rentalApiRequest.getEndDate() )
            .setReason( rentalApiRequest.getReason() )
            .setState( rentalApiRequest.getState() );

            return item;
        })
        .map(item -> rentalRepository.save(item) )             // update -> newUser
        .map(item -> response(item) )                        // userApiResponse
        .map(Header::OK)
        .orElseGet(()->Header.ERROR("데이터 없음"));
    }

    public Header delete( Header<RentalApiRequest> request ) {
        Optional<Rental> optional = rentalRepository.findById( new RentalPK(request.getData()) );

        return optional.map( item ->{
            rentalRepository.delete(item);
            return Header.OK();
        }).orElseGet(()->Header.ERROR("데이터 없음"));
    }

    public Header search(Pageable pageable, RentalApiRequest request) {

        Page<Rental> items =rentalRepository.findAll(
                RentalSpecs.state( request.getState() ).and(
                RentalSpecs.endDate(request.getEndDate())),
                pageable );

        List<RentalApiResponse> itemApiResponseList = items.stream()
                .map(item -> response(item) )
                .collect(Collectors.toList());

        Pagination pagination = Pagination.builder()
                .totalPages(items.getTotalPages())
                .totalElements(items.getTotalElements())
                .currentPage(items.getNumber())
                .currentElements(items.getNumberOfElements())
                .build();

        return Header.OK( itemApiResponseList, pagination );
    }

    public RentalApiResponse response( Rental rental ){

        RentalApiResponse rentalApiResponse =
                RentalApiResponse.builder()
                .itemId( rental.getItemId() )
                .empId( rental.getEmpId())
                .userName( (rental.getEmployee()==null)?null:rental.getEmployee().getName() )
                .teamName( ((rental.getEmployee()==null)&&(rental.getEmployee().getTeam()==null) )?null:rental.getEmployee().getTeam().getName() )
                .itemName( (rental.getItem()==null)?null: rental.getItem().getName() )
                .superCate(  (rental.getItem()==null)?null:rental.getItem().getSuperCate() )
                .subCateFirst(  (rental.getItem()==null)?null:rental.getItem().getSubCateFirst() )
                .subCateSecond(  (rental.getItem()==null)?null:rental.getItem().getSubCateSecond() )
                .startDate( rental.getStartDate() )
                .endDate( rental.getEndDate() )
                .state( rental.getState() )
                .build();

        return rentalApiResponse;
    }

    @Override
    public Header read(Long id) { return null; }

    @Override
    public Header delete(Long id) { return null; }

}
